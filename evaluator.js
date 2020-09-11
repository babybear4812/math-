import operators from './operators';
import functions from './functions';
import operators from './operators';
import specialConstants from './specialConstants';

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
}
