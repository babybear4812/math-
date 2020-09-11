import Lexer from './lexer';
import Parser from './parser';
import operators from './operators';
import functions from './functions';
import operators from './operators';
import specialConstants from './specialConstants';
import Parser from './parser';

export default class Evaluator {
  constructor(parseTree) {
    this.parseTree = parseTree;
    this.operators = operators;
  }
  parse(node) {
    //code goes here
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
    } catch (error) {
      return error;
    }
  }
}
