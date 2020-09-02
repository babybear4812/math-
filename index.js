// lexical analysis -> parsing -> generation (evaluation, for interpreter)
// lexing splits code into tokens (from greek "lex" for word), some are 1 char, some are more
// parsing is like giving lexical analysis grammar to compose larger expressions and statements

function lexer(input) {
  function addToken(tokens, type, value) {
    tokens.push({
      type,
      value,
    });
  }

  function isNumber(input) {
    return input.match(/[0-9]/);
  }

  function isOperator(input) {
    return input.match(/[+\-*\/\^%=()]/);
  }

  function isIdentifier(input) {
    //check if the character is a string but not whitespace
    return typeof input === 'string' && !input.match(/[\s]/);
  }

  let tokens = [];
  for (let i = 0; i < input.length; i++) {
    if (isNumber(input[i])) {
      //check if the digit is part of a larger number
      let number = input[i];
      while (i < input.length - 1 && isNumber(input[++i])) {
        number += input[i];
        if (i === input.length - 1) {
          break;
        }
      }
      if (i < input.length - 1 && input[i] === '.') {
        //check if there is a decimal point in the number
        number += input[i];
        while (isNumber(input[++i])) {
          number += input[i];
          if (i === input.length - 1) {
            break;
          }
        }
      }
      addToken(tokens, 'number', parseFloat(number)); //convert the number to a float to account for potential decimals
    } else if (isOperator(input[i])) {
      //check if the char is an operator
      addToken(tokens, 'operator', input[i]);
    } else if (isIdentifier(input[i])) {
      let identifier = input[i];
      while (i < input.length - 1 && isIdentifier(input[++i])) {
        //check chars ahead to see if they are part of a longer identifier
        identifier += input[i];
        if (i === input.length - 1) {
          break;
        }
      }
      addToken(tokens, 'identifier', input[i]);
    }
  }
  return tokens;
}

// nud = null denotative function
// led = left denotative function
// lbp = left binding power
// rbp = right binding power

//identifiers: nud
//numbers: nud
//operators: +, /, * led, - nud

//to associate symbols with a binding power, nud, or led
function parser(tokens) {
  let parseTree = [];

  let symbols = {};
  function symbol() {
    let sym = symbols[id] || {};
    symbols[id] = {
      lbp: sym.lbp || lbp,
      nud: sym.nud || nud,
      led: sym.led || led,
    };
  }

  //associate token with corresponding symbol
  function interpretToken(token) {
    return {
      type: token.type,
      value: token.value,
    };
  }

  function createParseTree(rbp) {
    for (let i = 0; i < tokens.length; i++) {
      //code
    }
  }

  return parseTree;
}
console.log(lexer('12 + 4 / 6'));

/*
(5) [{…}, {…}, {…}, {…}, {…}]
0: {type: "number", value: 12}
1: {type: "operator", value: "+"}
2: {type: "number", value: 4}
3: {type: "operator", value: "/"}
4: {type: "number", value: 6}
length: 5
*/
