import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js';
import { getNeighbor } from '../../../jshelpers/GridFuncs.js';

const _lines = (await getInput(import.meta.url));
const numbers = [];
const code = [];
const pad = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
const pad2 = [
  [null, null, '1', null, null],
  [null, '2', '3', '4', null],
  ['5', '6', '7', '8', '9'],
  [null, 'A', 'B', 'C', null],
  [null, null, 'D', null, null],
];
const resolveDirection = {
  'U': (x, y, _) => { return { x, y: Math.max(y - 1, 0) }; },
  'R': (x, y, max) => { return { x: Math.min(x + 1, max), y }; },
  'D': (x, y, max) => { return { x, y: Math.min(y + 1, max) }; },
  'L': (x, y, _) => { return { x: Math.max(x - 1, 0), y }; },
}

solve(_lines);

function solve(lines) {
  let x = 1;
  let y = 1;
  let num;

  let x2 = 0;
  let y2 = 2;
  let char;

  for (const line of lines) {
    ({ x, y, num } = getNumber(line, x, y));
    numbers.push(num);

    ({ x2, y2, char } = getChar(line, x2, y2));
    code.push(char);
  }
  l(numbers.join(''));
  l(code.join(''));
}

function getNumber(line, x, y) {
  for (const direction of line.split('')) {
    ({ x, y } = resolveDirection[direction](x, y, 2));
  }

  return { x, y, num: pad[y][x] };
}

function getChar(line, x2, y2) {
  for (const direction of line.split('')) {
    const lowdir = direction.toLowerCase();
    const neighbor = getNeighbor(pad2, x2, y2, lowdir);
    if (!neighbor || neighbor.val === null) continue;
    x2 = neighbor.x;
    y2 = neighbor.y;
  }

  return { x2, y2, char: pad2[y2][x2] };
}
