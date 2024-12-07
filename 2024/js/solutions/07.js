import { getInput } from "../../../jshelpers/InputGetter.js";
import { l, e } from "../../../jshelpers/functions.js";

const equations = (await getInput(import.meta.url)).map((line) => {
  const [test, ops] = line.split(": ");
  const operators = ops.split(" ").map((o) => parseInt(o));
  return { test: parseInt(test), operators };
});

const operations = { '0': 'add', '1': 'mul', '2': 'cat' };

/*
this solution works fine but could be improved by incrementing the permutation
values in the calibrate loop instead of calculating them all beforehand and
storing them in a variable
*/

l(testEquations(equations));
l(testEquations(equations, true));

function testEquations(equations, isTernary = false) {
  return equations.reduce((calibration, equation) => calibration + calibrateEquation(equation, isTernary), 0);
}

function calibrateEquation(equation, isTernary = false) {
  const permutations = getBinaryNumbers(equation.operators.length - 1, isTernary);

  for (const permutation of permutations) {
    let ops = [...equation.operators];
    let total = ops[0];
    ops.shift()

    for (const bit of permutation) {
      total = performOperation(total, ops[0], operations[bit]);
      ops.shift();
    }

    if (total === equation.test) {
      return equation.test;
    }
  }

  return 0;
}

function performOperation(a, b, operation) {
  if (operation === 'add') return a + b;
  if (operation === 'mul') return a * b;
  if (operation === 'cat') return parseInt(a + '' + b);
  e("unknown operation.");
}

function getBinaryNumbers(len, isTernary = false) {
  // count up in a base system for however many operations we're dealing with to get all permutations
  // not very memory efficient
  const highest = isTernary ? '2' : '1';
  const toStringVal = isTernary ? 3 : 2;

  let current = parseInt('0'.repeat(len), 3);
  const end = parseInt(highest.repeat(len), 3);
  const numbers = [];

  while (current <= end) {
    const converted = current.toString(toStringVal);
    const fill = len - converted.length;
    const binstring = fill > 0 ? '0'.repeat(fill) + converted : converted;
    numbers.push(binstring);
    current++;
  }

  return numbers;
}
