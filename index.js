// import Lexer from './lexer';
// import Parser from './parser';
// import Evaluator from './evaluator';

// All code in one file

class MathPlusPlus {
  constructor(tokens = []) {
    this.tokens = tokens;
  }

  lexer(input) {
    let tokens = [];
    function isNumber() {
      return input.match(/[0-9]/);
    }

    function isOperator() {
      return input.match(/[+\-*\/\^%=()]/);
    }

    function isIdentifier() {
      //check if the character is a string but not whitespace
      return typeof input === 'string' && !input.match(/[\s]/);
    }

    function advance() {
      //
    }

    function addToken(type, value) {
      this.tokens.push({
        type,
        value,
      });
    }

    while (idx < input.length) {
      c = input[idx];
      if (c.match(/[\s]/)) {
        advance();
      } else if (isOperator(c)) {
        addToken('operator', c);
      } else if (isDigit(c)) {
        //
      } else if (isIdentifier(c)) {
        //
      }
    }

    return tokens;
  }
}
