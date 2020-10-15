// import Lexer from './lexer';
// import Parser from './parser';
// import Evaluator from './evaluator';
import operators from './operators';
import functions from './functions';
import specialConstants from './specialConstants';

// All code in one file

class MathPlusPlus {
  constructor(tokens = [], idx = 0) {
    this.tokens = tokens;
    this.idx = 0;
  }

  lexer(input) {
    let tokens = [];
    function isDigit() {
      //check if the character is a digit
      return input.match(/[0-9]/);
    }

    function isOperator() {
      //check if the character is an operator
      return input.match(/[+\-*\/\^%=()]/);
    }

    function isIdentifier() {
      //check if the character is a string but not whitespace
      return typeof input === 'string' && !input.match(/[\s]/);
    }

    function nextChar() {
      //moves the index along to the next character, and returns it
      //useful for parsing through characters sequentially when determining whether
      //they create number or identifier of length > 1
      this.idx += 1;
      return input[this.idx];
    }

    function addToken(type, value) {
      //utility function to add the found token into the list of all tokens
      this.tokens.push({
        type,
        value,
      });
    }

    //loop through the input
    while (this.idx < input.length) {
      //current char
      c = input[this.idx];

      if (c.match(/[\s]/)) {
        //if character is whitespace, continue to reading the next character
        continue;
      } else if (isOperator(c)) {
        //if character is an operator, add it to the tokens as-is
        addToken('operator', c);
      } else if (isDigit(c)) {
        //if character is a digit, continue to loop through until you're no longer looking at a digit
        //the digits you've collected will form a full number
        num = c;
        while (isDigit(nextChar())) {
          num += c;
        }
        //if we run into a decimal, we have a decimal number
        //add the period to the number and redo the previous loop to get all digits after decimal point
        if (c === '.') {
          num = c;
          while (isDigit(nextChar())) {
            num += c;
          }
        }

        addToken('number', num);
      } else if (isIdentifier(c)) {
        //if a character isn't whitespace, an operator, or a digit, it must be an identifier
        //loop through until you've collected all subsequent chars related to the identifier
        identifier = c;
        while (isIdentifier(nextChar())) {
          identifier += c;
        }

        addToken('identifier', identifier);
      } else {
        //error checking
        throw `Whoop! I can't recognize this character: ${c}`;
      }
    }

    return tokens;
  }

  parser() {
    //
  }

  evaluator() {
    //
  }
}
