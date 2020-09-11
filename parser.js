// nud = null denotative function (does not care about tokens to the left)
// led = left denotative function (cares about tokens to the left)
// lbp = left binding power
// rbp = right binding power

//nud (used by values, ie variables and literals) and prefix operators
//led (used by infix operators and suffix operators)
//some tokens have both, e.g. (-) might be a prefix operator (negation) and infix operator (subtraction)

//infix operators: +, * (but w/ higher binding power)

//to associate symbols with a binding power, nud, or led
export default class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.symbols = {};
    this.defaultSymbol = {
      nullDenotativePower: function () {
        this.error('Undefined');
      },
      leftDenotativePower: function (left) {
        this.error('Missing Operator');
      },
    };
    this.parseTree = [];
  }

  symbol(id, leftBindingPower, nullDenotativeFunction, leftDenotativeFunction) {
    let symbol = symbols[id] || {};
    symbols[id] = {
      leftBindingPower: symbol.leftBindingPower || leftBindingPower,
      nullDenotativeFunction:
        symbol.nullDenotativeFunction || nullDenotativeFunction,
      leftDenotativeFunction:
        symbol.leftDenotativeFunction || leftDenotativeFunction,
    };
  }

  //associate token with corresponding symbol
  interpretToken(token) {
    return {
      type: token.type,
      value: token.value,
    };
  }

  createParseTree() {
    for (let i = 0; i < tokens.length; i++) {
      //code
    }
    return this.parseTree;
  }

  //creates infix arithmetic operators (i.e. those that go in between numbers)
  infix(id, leftBindingPower, rightBindingPower, leftDenotativeFunction) {
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
            right: expression(rightBindingPower),
          };
        }
    );
  }

  //creates prefix arithmetic operators (i.e. those that go before numbers)
  prefix(id, rightBindingPower) {
    this.symbol(id, function () {
      return {
        type: id,
        right: expression(rightBindingPower),
      };
    });
  }
}

// precedence values gathered from http://crockford.com/javascript/tdop/tdop.html

/*
  (5) [{…}, {…}, {…}, {…}, {…}]
  0: {type: "number", value: 12}
  1: {type: "operator", value: "+"}
  2: {type: "number", value: 4}
  3: {type: "operator", value: "/"}
  4: {type: "number", value: 6}
  length: 5
  */
