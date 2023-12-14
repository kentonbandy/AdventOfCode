import { getInput } from '../../../jshelpers/InputGetter.js';

const lines = await getInput(import.meta.url);
let rocks = [...lines];
let load = 0;

for (let y = 0; y < rocks.length; y++) {
  for (let x = 0; x < rocks[y].length; x++) {
    if (rocks[y][x] !== "O") continue;
    let a = x, b = y;
    while (getAbove(a, b) === ".") {
      swapVertical(rocks, a, b);
      b--;
    }
    load += rocks.length - b;
  }
}

console.log(load);

function getAbove(x, y) {
  if (y === 0) return null;
  return rocks[y-1][x];
}

function swapVertical(grid, x, y) {
  if (y === 0) return;
  const upper = grid[y-1][x];
  const lower = grid[y][x];
  grid[y-1] = grid[y-1].slice(0,x) + lower + grid[y-1].slice(x+1);
  grid[y] = grid[y].slice(0,x) + upper + grid[y].slice(x+1);
}