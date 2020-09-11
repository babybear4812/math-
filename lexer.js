// lexical analysis -> parsing -> generation (evaluation, for interpreter)
// lexing splits code into tokens (from greek "lex" for word), some are 1 char, some are more
// parsing is like giving lexical analysis grammar to compose larger expressions and statements

export default class Lexer {
  constructor(input) {
    this.input = input;
    this.tokens = [];
  }

  addToken(type, value) {
    this.tokens.push({
      type,
      value,
    });
  }

  isNumber() {
    return this.input.match(/[0-9]/);
  }

  isOperator() {
    return this.input.match(/[+\-*\/\^%=()]/);
  }

  isIdentifier() {
    //check if the character is a string but not whitespace
    return typeof this.input === 'string' && !this.input.match(/[\s]/);
  }

  tokenize() {
    for (let i = 0; i < this.input.length; i++) {
      if (this.isNumber(this.input[i])) {
        //check if the digit is part of a larger number
        let number = this.input[i];
        while (i < this.input.length - 1 && this.isNumber(this.input[++i])) {
          number += this.input[i];
          if (i === this.input.length - 1) {
            break;
          }
        }
        if (i < this.input.length - 1 && this.input[i] === '.') {
          //check if there is a decimal point in the number
          number += this.input[i];
          while (this.isNumber(this.input[++i])) {
            number += this.input[i];
            if (i === this.input.length - 1) {
              break;
            }
          }
        }
        this.addToken('number', parseFloat(number)); //convert the number to a float to account for potential decimals
      } else if (this.isOperator(this.input[i])) {
        //check if the char is an operator
        this.addToken('operator', this.input[i]);
      } else if (this.isIdentifier(this.input[i])) {
        let identifier = this.input[i];
        while (
          i < this.input.length - 1 &&
          this.isIdentifier(this.input[++i])
        ) {
          //check chars ahead to see if they are part of a longer identifier
          identifier += this.input[i];
          if (i === this.input.length - 1) {
            break;
          }
        }
        this.addToken('identifier', this.input[i]);
      }
    }
  }
}
