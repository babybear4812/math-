import Lexer from './lexer';
import Parser from './parser';
import operators from './operators';
import functions from './functions';
import operators from './operators';
import specialConstants from './specialConstants';

export default class Evaluator {
  constructor(parseTree) {
    this.parseTree = parseTree;
    this.functions = functions;
    this.operators = operators;
    this.specialConstants = specialConstants;
    this.args = {};
  }
  parse(node) {
    if (node.type === 'number') {
      return node.value;
    } else if (node.type === 'identifier') {
      let value;
      if (this.args[node.value]) {
        value = this.args[node.value];
      } else {
        value = this.specialConstants[node.value];
      }

      if (typeof value === 'undefined') {
        throw `Undefined: ${value}`;
      }
      return value;
    } else if (node.type === 'assign') {
      specialConstants[node.id] = parse(node.value);
    } else if (node.type === 'call') {
      //
    } else if (node.type === 'function') {
      functions[node.id] = function () {
        for (let i = 0; i < node.args.length; i++) {
          args[node.args[i].value] = arguments[i];
        }
        return parse(node.value);
      };
    }
  }

  evaluate() {
    let output = '';
    for (let i = 0; i < this.parseTree.length; i++) {
      let value = this.parse(this.parseTree[i]);
      typeof value !== 'undefined' ? (output += value + '\n') : '';
    }
    return output;
  }

  calculate(input) {
    try {
      const lexer = new Lexer(input);
      const tokens = lexer.tokenize();

      const parser = new Parser(tokens);
      const parseTree = parser.createParseTree();

      const output = this.evaluate();
      return output;
    } catch (error) {
      return error;
    }
  }
}
