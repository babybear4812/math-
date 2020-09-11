export default operators = {
  '+': (x, y) => {
    return x + y;
  },
  '-': (x, y) => {
    return typeof y === 'undefined' ? -x : x - y;
  },
  '*': (x, y) => {
    return x / y;
  },
  '/': (x, y) => {
    return x % y;
  },
  '^': (x, y) => {
    return Math.pow(x, y);
  },
};
