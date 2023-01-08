const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

let playing = true;

class Field {
    constructor(field) {
        this._field = field;
        this.x = 0;
        this.y = 0;
    }

    // Methods
    playGame() {
        let direction = prompt('Which direction do you want to move to? (u for Up, d for down, l for left and r for right): ');

        if (direction.toUpperCase() === 'U') {
            if (this.y === 0) {
                console.log('You cannot move any further upwards. Please choose another direction')
            } else {
                this.y -=1
            }
        } else if (direction.toUpperCase() === 'D') {
            if (this.y >= this._field.length -1) {
                console.log('You cannot move any further down. Please choose another direction')
            } else {
                this.y +=1
            }
        } else if (direction.toUpperCase() === 'L') {
            if (this.x === 0) {
                console.log('You cannot move any further left. Please choose another direction')
            } else {
                this.x -= 1
            }
        } else if (direction.toUpperCase() === 'R') {
            if (this.x >= this._field[this.y].length -1) {
                console.log('You cannot move any further right. Please choose another direction')
            } else {
                this.x += 1
            }
        } else {
            console.log('Invalid entry. Please enter U, D, R, or L')
        }
    }

    check() {
        if (this._field[this.y][this.x] === hole) {
            console.log('You lose - You fell in a hole!');
            playing = false;
        } else if (this._field[this.y][this.x] === hat) {
            console.log('You win - You found the hat!');
            playing = false;
        } else if (this._field[this.y][this.x] === fieldCharacter) {
            console.log('Keep going on to find the hat...');
            this._field[this.y][this.x] = pathCharacter;
            this.printField()
        } else if (this._field[this.y][this.x] === pathCharacter) {
            console.log('You have already been here, keep going!')
            this.printField()
        }
    }

    printField() {
        this._field.forEach(row => {
            console.log(row.join(""));
        });
    }

    static generateField(height, width, percentage) {

        //Helper function to return hole or fieldCharacter depening on percentage.
        const fieldOrHole = (percentage) => {
            if (percentage >= 0 && percentage <= 100) {
              const ranNum = Math.random() * 100;
              if (ranNum < percentage) {
                return hole;
              } else {
                return fieldCharacter;
              }
            } else {
              console.log('Please enter a number between 0 - 100');
            }
        }

        ////Helper function to return a plain field with no hat and pathCharacter
        const plainField = () => {
            function makeWidthArray() {
                let widthArray = [];
                for (let i=0; i < width; i++) {
                    widthArray.push(fieldOrHole(percentage));
                }
                return widthArray;
            }
            let plainField = [];
            for (let i=0; i < height; i++) {
                plainField.push(makeWidthArray());
            }
            return plainField;
        }

        const gameReadyField = plainField();

        //Adding hat on gameReadyField, while loop will check if hat sits on * and will reposition if so
        do {
            gameReadyField[Math.floor(Math.random() * height)][Math.floor(Math.random() * width)] = hat;
        }   while (gameReadyField[0][0] == hat);
        
        //Adding pathCharacter to left-upper corner
        gameReadyField[0][0] = pathCharacter;

        return gameReadyField;
    }
}

// Creates the field, change the generateField fields to change the board.
const myField = new Field(Field.generateField(10,10,30));

const game = () => {
    myField.printField();
    while (playing) {
        myField.playGame();
        myField.check();
    }
}

game()