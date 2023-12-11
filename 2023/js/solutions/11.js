import { getInput } from '../../../jshelpers/InputGetter.js';

const lines = await getInput(import.meta.url);

// find where galaxies are
const yhasgalaxy = new Set();
const xhasgalaxy = new Set();
lines.forEach((line, y) => {
  for (let x = 0; x < line.length; x++) {
    if (line[x] === "#") {
      yhasgalaxy.add(y);
      xhasgalaxy.add(x);
    }
  }
});
// create expanded galaxy
const expanded = [];
const newxlen = lines[0].length + (lines[0].length - xhasgalaxy.size);
lines.forEach((line, y) => {
  let spaceline = "";
  // add new lines
  if (!yhasgalaxy.has(y)) {
    expanded.push(".".repeat(newxlen));
  }
  // add columns
  for (let x = 0; x < line.length; x++) {
    if (!xhasgalaxy.has(x)) spaceline += ".";
    spaceline += line[x];
  }
  expanded.push(spaceline);
});

// find all galaxies
const galaxies = [];
expanded.forEach((line, y) => {
  for (let x = 0; x < line.length; x++) {
    if (line[x] === "#") galaxies.push(coordkey(x, y));
  }
});

// sum distances between all galaxies
const pairsSummed = new Set();
let distanceSum = 0;
galaxies.forEach((galaxy, i) => {
  const [gx, gy] = galaxy.split(",").map(g => parseInt(g));
  galaxies.forEach((other, j) => {
    if (j === i) return;
    const keyargs = j >= i ? [galaxy, other] : [other, galaxy];
    const pairkey = coordkey(...keyargs);
    if (pairsSummed.has(pairkey)) return;
    pairsSummed.add(pairkey);
    const [ox, oy] = other.split(",").map(g => parseInt(g));
    const distance = (Math.abs(gx - ox) + Math.abs(gy - oy));
    distanceSum += distance;
  });
});

console.log(distanceSum);

function coordkey(x, y) {
  return `${x},${y}`;
}