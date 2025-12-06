import { getInput } from '@/tsutilities/helpers/InputGetter.js';
import { l } from '@/tsutilities/helpers/ShorthandFunctions.js';
import { arraySum, arrayProduct } from '@/tsutilities/helpers/ArrayFunctions.js';

const _input = await getInput(import.meta.url);

type Problem = {
  numbers: number[];
  expression: '+' | '*';
};

const _problems: Problem[] = _input.reduce((problems: Problem[], line: string): Problem[] => {
  const lineValues = line.trim().split(/\s+/);

  for (let i = 0; i < lineValues.length; i++) {
    if (!problems[i]) {
      problems.push({ numbers: [], expression: '+' });
    }
    if (['+', '*'].includes(lineValues[i])) {
      problems[i].expression = lineValues[i] as '+' | '*';
    } else {
      problems[i].numbers.push(Number.parseInt(lineValues[i]));
    }
  }

  return problems;
}, []);
const _problems2 = part2InputParser(_input);

const _mathFuncs = {
  '+': arraySum,
  '*': arrayProduct,
};

l(sumAllAnswers(_problems));
l(sumAllAnswers(_problems2));

function sumAllAnswers(problems: Problem[]): number {
  let sum = 0;

  for (const problem of problems) {
    sum += _mathFuncs[problem.expression](problem.numbers);
  }

  return sum;
}

function part2InputParser(input: string[]): Problem[] {
  const expressions = input.at(-1)!.trim().split(/\s+/).map((n) => n as '+' | '*');
  const numbersInput = input.slice(0, -1);
  const problems: Problem[] = [];
  let index = 0;

  for (const expression of expressions) {
    const problem: Problem = { numbers: [], expression };
    
    while (true) {
      const number = getNumberAtIndex(numbersInput, index);
      index++;
      if (number === null) break;
      problem.numbers.push(number);
    }
    
    problems.push(problem);
  }

  return problems;
}

function getNumberAtIndex(input: string[], index: number): number | null {
  if (index >= input[0].length) return null;
  let numstring = '';

  for (const line of input) {
    const char = line[index];
    if (char !== ' ') numstring += char;
  }

  if (numstring === '') return null;
  return Number.parseInt(numstring);
}
