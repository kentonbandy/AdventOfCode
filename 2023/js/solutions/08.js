import { getInput } from '../../../jshelpers/InputGetter.js';
import '../../../jshelpers/ArrayFuncs.js';
import { getPrimeFactors } from '../../../jshelpers/Maths.js';


const lines = await getInput(import.meta.url);

const instructions = lines[0];
const map = lines.slice(1).reduce((a,c) => {
  a[c.slice(0, 3)] = [c.slice(7,10), c.slice(12,15)];
  return a;
}, {});
// get highest count of each prime factor from traverse steps of every ghost
const ghostPrimeCounts = Object.keys(map)
  .filter(k => k[2] === "A")
  .map(g => traverse(g))
  .map(g => getPrimeFactors(g))
  .reduce((a, c) => {
    c.forEach(p => {
      const count = c.count(p);
      if (!a[p] || a[p] < count) a[p] = count;
    });
    return a;
  }, {});

console.log(traverse())
console.log(ghostMath(ghostPrimeCounts));

function traverse(ghostStart = null) {
  let step = 0;
  let current = ghostStart ?? "AAA";
  let ind;
  let inst;

  while (ghostStart ? current[2] !== "Z" : current !== "ZZZ") {
    inst = getInstruction(step);
    ind = inst === "L" ? 0 : 1;
    current = map[current][ind];
    step++;
  }

  return step;
}

// get LCM
function ghostMath(primeCounts) {
  let product = 1;
  for (const [key, val] of Object.entries(primeCounts)) {
    product *= parseInt(key) * val;
  }
  return product
}

function getInstruction(step) {
  return instructions[step % instructions.length];
}