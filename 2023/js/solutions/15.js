import { getInput } from '../../../jshelpers/InputGetter.js';

const sequence = (await getInput(import.meta.url))[0].split(",");
const boxes = {};

const sum = sequence.reduce((s, c) => {
  runHashmap(c);
  return s + runHash(c);
}, 0);

console.log(sum);
console.log(getPowerSum(boxes));

function runHash(str) {
  let val = 0;
  for (const char of str) {
    val += char.charCodeAt(0);
    val *= 17;
    val %= 256;
  }
  return val;
}

function runHashmap(str) {
  const isRemove = str.includes("-");
  let label, focal;
  if (isRemove) label = str.substring(0, str.length - 1);
  else {
    [label, focal] = str.split("=");
    focal = parseInt(focal);
  }
  const boxKey = runHash(label);
  const func = isRemove ? removeLens : addOrReplaceLens;
  func(boxKey, label, focal);
}

function removeLens(box, label) {
  if (boxes[box] === undefined) return;
  boxes[box] = boxes[box].filter(l => l.label !== label);
}

function addOrReplaceLens(box, label, focal) {
  // box not initialized
  if (boxes[box] === undefined) {
    boxes[box] = [{ label, focal }];
    return;
  }

  // box contains label
  const lens = boxes[box].find(b => b.label === label);
  if (lens) lens.focal = focal;

  // box doesn't contain label
  else boxes[box].push({ label, focal });
}

function getPowerSum(boxes) {
  return Object.entries(boxes).reduce((boxSum, [box, lenses]) => {
    if (!lenses.length) return boxSum;
    return boxSum + lenses.reduce((lensSum, lens, i) => {
      return lensSum + getFocusingPower(lens, box, i);
    }, 0);
  }, 0);
}

function getFocusingPower(lens, box, i) {
  let product = parseInt(box) + 1;
  product *= (i + 1);
  return product * lens.focal;
}