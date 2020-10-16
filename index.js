import operators from './operators';
import functions from './functions';
import specialConstants from './specialConstants';

/**
 * @summary A class containing each of the lexer, parser, and evaluator.
 * It can be initialized with user input
 */
class MathPlusPlus {
  /**
   * @summary constructor function
   * @param {string} input - the user's input
   */
  constructor(input) {
    this.input = input;
    this.tokens = tokens;
    this.idx = 0;
    this.parseTree = null;
  }

  /**
   * @summary moves the character index along to the next character, used by both Lexer and Parser
   * @returns the next character valuevalue
   */
  getNextChar() {
    this.idx += 1;
    return this.input[this.idx];
  }

  /**
   * @summary Step 1: Lexical Analysis of the given input separates every character / identifier into a token
   */
  lexer() {
    /**
     * @summary Checks if the given character is a digit
     */
    function isDigit() {
      return this.input.match(/[0-9]/);
    }

    /**
     * @summary Checks if the given character is an operator
     */
    function isOperator() {
      return this.input.match(/[+\-*\/\^%=()]/);
    }

    /**
     * @summary Checks if the given character is a string, but is not whitespace
     */
    function isIdentifier() {
      return typeof this.input === 'string' && !this.input.match(/[\s]/);
    }

    /**
     * @summary A utility function used to add a given token into the list of all tokens
     * @param {string} type Specifies if the token is an operator, a number, or an identifier
     * @param {string} value Specifie's the token's value (i.e. the operator, the number, or the identifier)
     */
    function addToken(type, value) {
      this.tokens.push({
        type,
        value,
      });
    }

    //loop through the input
    while (this.idx < this.input.length) {
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
        while (isDigit(getNextChar())) {
          num += c;
        }
        //if we run into a decimal, we have a decimal number
        //add the period to the number and redo the previous loop to get all digits after decimal point
        if (c === '.') {
          num = c;
          while (isDigit(getNextChar())) {
            num += c;
          }
        }

        addToken('number', num);
      } else if (isIdentifier(c)) {
        //if a character isn't whitespace, an operator, or a digit, it must be an identifier
        //loop through until you've collected all subsequent chars related to the identifier
        identifier = c;
        while (isIdentifier(getNextChar())) {
          identifier += c;
        }

        addToken('identifier', identifier);
      } else {
        throw `Whoops! I can't recognize this character: ${c}`;
      }
    }
    return this.tokens;
  }

  /**
   * @summary Step 2: Parsing the tokens in order to create a parse tree.
   * This function is the longest of the 3 steps, and is required to determine each tokens' binding powers
   */
  parser() {
    let symbols = {};
    while (getInterpretedToken().type !== '(end)') {
      this.parseTree.push(generateExpressionTree(0));
    }

    /**
     * @summary Adds a symbol to an object of all symbols
     * @param {*} id The character's actual symbol
     * @param {*} leftBindingPower A measure of how strongly a symbol is bound to its lefthand side
     * @param {*} nullDenotativeFunction Used by variables, literals, and prefix operators
     * @param {*} leftDenotativeFunction Used by infix and suffix operators
     */
    function generateSymbol(
      id,
      leftBindingPower,
      nullDenotativeFunction,
      leftDenotativeFunction
    ) {
      if (symbols[id]) {
        return;
      }

      symbols[id] = {
        leftBindingPower: leftBindingPower,
        nullDenotativeFunction: nullDenotativeFunction,
        leftDenotativeFunction: leftDenotativeFunction,
      };
    }

    /**
     * @summary Used to interpret a token's type and value
     * @param {object} token A token object
     */
    function interpretToken(token) {
      return {
        type: token.type,
        value: token.value,
      };
    }

    this.idx = 0;

    /**
     * @summary Returns an object representing a token's type and value
     */
    function getInterpretedToken() {
      return interpretToken(this.tokens[this.idx]);
    }

    /**
     * @summary
     * @param {*} rightBindingPower
     */
    function generateExpressionTree(rightBindingPower) {
      let left;
      let token = getInterpretedToken();

      getNextChar();
      if (!token.nullDenotativeFunction) {
        throw `Whoops! I can't recognize this character: ${token.type}`;
      }
      left = token.nullDenotativeFunction(token); //need to clean this up somehow, doesn't make sense

      while (rightBindingPower < getInterpretedToken().leftBindingPower) {
        token = getInterpretedToken();
        getNextChar();
        if (!token.leftDenotativeFunction) {
          throw `Whoops! I can't recognize this character: ${token.type}`;
        }
        left = token.leftDenotativeFunction(left);
      }
      return left;
    }

    /**
     * @summary Generating a symbol for an infix operator (i.e. operators that go in between two identifiers / numbers)
     * @param {*} id The character's actual symbol
     * @param {*} leftBindingPower A measure of how strongly a symbol is bound to its lefthand side
     * @param {*} nullDenotativeFunction Used by variables, literals, and prefix operators
     * @param {*} leftDenotativeFunction Used by infix and suffix operators
     */
    function infix(
      id,
      leftBindingPower,
      rightBindingPower,
      leftDenotativeFunction
    ) {
      rightBindingPower = rightBindingPower || leftBindingPower;
      generateSymbol(
        id,
        leftBindingPower,
        null,
        leftDenotativeFunction ||
          function (left) {
            return {
              type: id,
              left,
              right: generateExpressionTree(rightBindingPower),
            };
          }
      );
    }

    /**
     * @summary Generating a symbol for a prefix operator (i.e. operators that go before a number, like the - sign)
     * @param {*} id The character's actual symbol
     * @param {*} leftBindingPower A measure of how strongly a symbol is bound to its righthand side
     */
    function prefix(id, rightBindingPower) {
      generateSymbol(id, function () {
        return {
          type: id,
          right: generateExpressionTree(rightBindingPower),
        };
      });
    }

    // the negation prefix
    prefix('-', 7);

    // infix symbols with binding power(s) in descending order
    infix('^', 6, 5); // higher left than right binding power because of right-associativeness of exponentiation
    infix('*', 4); // these follow BEDMAS order of operations
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
    generateSymbol('(end)'); // symbol to denote the end of the parsing tree
    generateSymbol(')');
    generateSymbol(')', null, () => {
      value = generateExpressionTree(2);
    });
    generateSymbol('number', null, (number) => {
      return number;
    });
    generateSymbol('identifier', null, () => {
      //
    });

    return this.parseTree;
  }

  /**
   * @summary Step 3: Evaluating the individual nodes of the parse tree
   * @returns {string} Returns the interpreted user input
   */
  evaluator() {
    /**
     * @summary extracting the node value depending on the individual node object's type
     * @param {object} node An individual token in the parse tree
     */
    function getNodeVal(node) {
      if (node.type === 'number') {
        return node.value;
      } else if (node.type === 'operator') {
        //
      } else if (node.type === 'identifier') {
        //
      }
    }

    // Looping through the parse tree and calling getNodeVal to evaluate individual nodes
    result = '';
    for (let i = 0; i < this.parseTree.length; i++) {
      nodeVal = getNodeVal(this.parseTree[i]);
      if (nodeVal !== 'undefined') {
        result += nodeVal + '\n';
      }
    }
    return result;
  }

  /**
   * @summary This function is called to execute the lexer, parser, and evaluator
   * @returns the output of the evaluator
   */
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
