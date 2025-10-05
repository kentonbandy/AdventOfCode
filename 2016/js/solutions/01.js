import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js';

const line = (await getInput(import.meta.url))[0];
const instructions = line.split(", ");

let x = 0;
let y = 0;
let coords = new Set(["0,0"]);
// number used to derive direction
let turn = 0;
let firstFound = false;

solve();
l("part 1: ", getDistance(x, y));

function solve() {
  for (const instruction of instructions) {
    processInstruction(instruction);
  }
}

function processInstruction(string) {
  const dir = string[0];
  const num = parseInt(string.slice(1));

  // increase or decrease turn based on R/L
  turn += dir === 'R' ? 1 : -1;
  // avoid negative turn values
  if (turn <= 0) turn += 4;

  // maths
  const isNs = turn % 2 === 0;
  let toAdd = turn % 4 < 2 ? num : num * -1;

  // move one block at a time, logging visited coords
  while (toAdd !== 0) {
    const step = toAdd > 0 ? 1 : -1
    if (isNs) y += step;
    else x += step;
    const coordKey = `${x},${y}`;
    if (!firstFound && coords.has(coordKey)) {
      l(`part 2: `, getDistance(x, y));
      firstFound = true;
    }
    coords.add(coordKey);
    toAdd -= step;
  }
}

function getDistance(_x, _y) {
  return Math.abs(_x) + Math.abs(_y);
}
