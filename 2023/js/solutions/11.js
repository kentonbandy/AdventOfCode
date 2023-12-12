import { getInput } from '../../../jshelpers/InputGetter.js';

const lines = await getInput(import.meta.url);

// find where galaxies aren't
const blankY = [];
const blankX = [];
const galaxies = [];
const xhasgalaxy = new Set();
lines.forEach((line, y) => {
  // populate blank y
  if (!line.includes("#")) blankY.push(y);
  for (let x = 0; x < line.length; x++) {
    if (line[x] === "#") {
      // add x value to set
      xhasgalaxy.add(x);
      // add galaxy coords
      galaxies.push([x, y]);
    }
  }
});
// populate blank x
for (let i = 0; i < lines[0].length; i++) {
  if (!xhasgalaxy.has(i)) blankX.push(i);
}

// part 1
console.log(sumDistances(expand(galaxies)));
// part 2
console.log(sumDistances(expand(galaxies, 1000000)));

function sumDistances(galaxies) {
  let distanceSum = 0;
  galaxies.forEach(([x, y], i) => {
    for (let j = i + 1; j < galaxies.length; j++) {
      const [a, b] = galaxies[j];
      const distance = (Math.abs(x - a) + Math.abs(y - b));
      distanceSum += distance;
    }
  });
  return distanceSum;
}

function expand(galaxies, expansion = 2) {
  const expanded = [];
  for (const [x, y] of galaxies) {
    const expX = x + (getNumsSmaller(blankX, x) * (expansion - 1));
    const expY = y + (getNumsSmaller(blankY, y) * (expansion - 1));
    expanded.push([expX, expY]);
  }
  return expanded;
}

function getNumsSmaller(nums, n) {
  let smaller = 0;
  for (const num of nums) {
    if (num < n) smaller++;
    else return smaller;
  }
  return smaller;
}