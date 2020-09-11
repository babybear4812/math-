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
  }
  parse(node) {
    if (node.type === 'number') {
      return node.value;
    } else if (node.type === 'identifier') {
      //
    } else if (node.type === 'assign') {
      //
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
