import { getInput } from '../../../jshelpers/InputGetter.js';
import '../../../jshelpers/ArrayFuncs.js';

const lines = await getInput(import.meta.url, false);
const grids = lines.splitArray(l => l === "");
let hsum = 0;
let vsum = 0;

grids.forEach(g => {
  const h = horizontal(g);
  const v = h ? 0 : vertical(g);
  hsum += h;
  vsum += v;
});

console.log((100 * hsum) + vsum);

function horizontal(grid) {
  for (let i = 0, j = 1; j < grid.length; i++, j++) {
    if (grid[i] === grid[j] && isHorizontalMirror(grid, j)) return j;
  }
  return 0;
}

function isHorizontalMirror(grid, j) {
  for (let i = j - 1; i >= 0 && j < grid.length; i--, j++) {
    if (grid[i] !== grid[j]) return false;
  }
  return true
}

function vertical(grid) {
  const rotated = rotate(grid);
  return horizontal(rotated);
}

function rotate(grid) {
  return grid.reduce((rotated, row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (y === 0) rotated.push(row[x]);
      else rotated[x] += row[x];
    }
    return rotated;
  }, []);
}