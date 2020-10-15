// import Lexer from './lexer';
// import Parser from './parser';
// import Evaluator from './evaluator';
import operators from './operators';
import functions from './functions';
import specialConstants from './specialConstants';

// All code in one file

class MathPlusPlus {
  constructor(input) {
    this.input = input;
    this.tokens = tokens;
    this.idx = 0;
    this.parseTree = null;
  }

  //moves the index along to the next character, and returns it
  //useful for parsing through characters sequentially when determining whether
  //they create number or identifier of length > 1
  // Will be used by both Lexer and Parser
  nextChar() {
    this.idx += 1;
    return this.input[this.idx];
  }

  // STEP 1: LEXICAL ANALYSIS
  lexer() {
    let tokens = [];
    function isDigit() {
      //check if the character is a digit
      return this.input.match(/[0-9]/);
    }

    function isOperator() {
      //check if the character is an operator
      return this.input.match(/[+\-*\/\^%=()]/);
    }

    function isIdentifier() {
      //check if the character is a string but not whitespace
      return typeof this.input === 'string' && !this.input.match(/[\s]/);
    }

    function addToken(type, value) {
      //utility function to add the found token into the list of all tokens
      this.tokens.push({
        type,
        value,
      });
    }

    //loop through the input
    while (this.idx < this.input.length) {
      //current char
      c = this.input[this.idx];

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
        throw `Whoops! I can't recognize this character: ${c}`;
      }
    }
    return this.tokens;
  }

  // STEP 2: CREATING PARSE TREE
  parser() {
    let symbols = {};
    while (token().type !== '(end)') {
      this.parseTree.push(generateExpressionTree(0));
    }

    //adds a symbol to an object of all symbols
    function symbol(
      id,
      leftBindingPower,
      nullDenotativeFunction,
      leftDenotativeFunction
    ) {
      let symbol = symbols[id] || {};
      symbols[id] = {
        leftBindingPower: symbol[leftBindingPower] || leftBindingPower,
        nullDenotativeFunction:
          symbol[nullDenotativeFunction] || nullDenotativeFunction,
        leftDenotativeFunction:
          symbol[leftDenotativeFunction] || leftDenotativeFunction,
      };
    }

    //used to associate token with corresponding symbol
    function interpretToken(token) {
      return {
        type: token.type,
        value: token.value,
      };
    }

    let idx = 0;
    function token() {
      return interpretToken(this.tokens[idx]);
    }

    function generateExpressionTree(rightBindingPower) {
      let left;
      let token = token();

      nextChar();
      if (!token.nullDenotativeFunction) {
        throw `Whoops! I can't recognize this character: ${token.type}`;
      }
      left = token.nullDenotativeFunction(token); //need to clean this up somehow, doesn't make sense

      while (rightBindingPower < token().leftBindingPower) {
        token = token();
        nextChar();
        if (!token.leftDenotativeFunction) {
          throw `Whoops! I can't recognize this character: ${token.type}`;
        }
        left = token.leftDenotativeFunction(left);
      }
      return left;
    }

    function infix(
      id,
      leftBindingPower,
      rightBindingPower,
      leftDenotativeFunction
    ) {
      rightBindingPower = rightBindingPower || leftBindingPower;
      this.symbol(
        id,
        leftBindingPower,
        null,
        leftDenotativeFunction ||
          function (left) {
            return {
              type: id,
              left,
              right: this.expression(rightBindingPower),
            };
          }
      );
    }

    //creates prefix arithmetic operators (i.e. those that go before numbers)
    function prefix(id, rightBindingPower) {
      this.symbol(id, function () {
        return {
          type: id,
          right: this.expression(rightBindingPower),
        };
      });
    }

    //the negation prefix
    prefix('-', 7);

    // infix symbols with binding power(s)
    infix('^', 6, 5);
    infix('*', 4);
    infix('/', 4);
    infix('%', 4);
    infix('+', 3);
    infix('-', 3);

    // the assignment symbol has a left denotative function
    // and behaves differently if assigning values for a call or an identifer
    infix('=', 1, 2, (left) => {
      if (left.type === 'call') {
        for (let i = 0; i < left.args.length; i++) {
          if (left.args[i].type !== 'identifer') {
            throw `Whoops! That argument name is invalid`;
          }
        }
        return {
          type: 'function',
          name: left.name,
          args: left.args,
          value: generateExpressionTree(2),
        };
      } else if (left.type === 'identifier') {
        return {
          type: 'assign',
          name: left.value,
          value: generateExpressionTree(2),
        };
      } else {
        throw `Whoops! Something went wrong around the '=' sign.`;
      }
    });

    // Defining IDs and null denotative functions for basic symbols
    symbol('(end)');
    symbol(')');
    symbol(')', null, () => {
      value = generateExpressionTree(2);
    });
    symbol('number', null, (number) => {
      return number;
    });
    symbol('identifier', null, () => {});

    return this.parseTree;
  }

  evaluator() {
    function getNodeVal(node) {
      if (node.type === 'number') {
        return node.value;
      } else if (node.type === 'operator') {
        //
      } else if (node.type === 'identifier') {
        //
      }
    }
    result = '';
    for (let i = 0; i < this.parseTree.length; i++) {
      nodeVal = getNodeVal(this.parseTree[i]);
      if (nodeVal !== 'undefined') {
        result += nodeVal + '\n';
      }
    }
    return result;
  }

  calculate() {
    try {
      this.lexer();
      this.parser();
      return this.evaluator();
    } catch (error) {
      return error;
    }
  }
}
