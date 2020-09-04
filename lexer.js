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

  isNumber(input) {
    return input.match(/[0-9]/);
  }

  isOperator(input) {
    return input.match(/[+\-*\/\^%=()]/);
  }

  isIdentifier(input) {
    //check if the character is a string but not whitespace
    return typeof input === 'string' && !input.match(/[\s]/);
  }

  tokenize(input) {
    for (let i = 0; i < input.length; i++) {
      if (this.isNumber(input[i])) {
        //check if the digit is part of a larger number
        let number = input[i];
        while (i < input.length - 1 && this.isNumber(input[++i])) {
          number += input[i];
          if (i === input.length - 1) {
            break;
          }
        }
        if (i < input.length - 1 && input[i] === '.') {
          //check if there is a decimal point in the number
          number += input[i];
          while (this.isNumber(input[++i])) {
            number += input[i];
            if (i === input.length - 1) {
              break;
            }
          }
        }
        this.addToken('number', parseFloat(number)); //convert the number to a float to account for potential decimals
      } else if (this.isOperator(input[i])) {
        //check if the char is an operator
        this.addToken('operator', input[i]);
      } else if (this.isIdentifier(input[i])) {
        let identifier = input[i];
        while (i < input.length - 1 && this.isIdentifier(input[++i])) {
          //check chars ahead to see if they are part of a longer identifier
          identifier += input[i];
          if (i === input.length - 1) {
            break;
          }
        }
        this.addToken('identifier', input[i]);
      }
    }
  }
}

//console.log(lexer('12 + 4 / 6'));
