import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js';

const line = (await getInput(import.meta.url))[0];
const instructions = line.split(", ");

// the distance in blocks
let nsDistance = 0;
let ewDistance = 0;
// number used to derive direction
let turn = 0;
const visited = { '00': true };

solve();
l("part 2: ", Math.abs(nsDistance) + Math.abs(ewDistance));

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
  const toAdd = turn % 4 < 2 ? num : num * -1;
  if (isNs) nsDistance += toAdd;
  else ewDistance += toAdd;

  const key = `${nsDistance}${ewDistance}`;
  if (visited[key]) l("part 1: ", Math.abs(nsDistance) + Math.abs(ewDistance));
  visited[`${nsDistance}${ewDistance}`] = true;
}