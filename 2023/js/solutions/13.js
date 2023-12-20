import { getInput } from '../../../jshelpers/InputGetter.js';
import '../../../jshelpers/ArrayFuncs.js';

const lines = await getInput(import.meta.url, false);
const grids = lines.splitArray(l => l === "");
let hsum = 0;
let vsum = 0;
const reflections = [];

// part 1
grids.forEach(g => {
  const h = horizontal(g);
  const v = h ? 0 : vertical(g);
  reflections.push([h, v]);
  hsum += h;
  vsum += v;
});
console.log((100 * hsum) + vsum);

// part 2
hsum = vsum = 0;
grids.forEach((g, i) => {
  const [h, v] = getSumWithSmudge(g, i);
  hsum += h;
  vsum += v;
});
console.log((100 * hsum) + vsum);


function getSumWithSmudge(grid, i) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const newGrid = [...grid];
      newGrid[y] = flip(newGrid[y], x);
      const h = horizontal(newGrid, reflections[i][0]);
      const v = h ? 0 : vertical(newGrid, reflections[i][1]);
      if (i === 31 && x === 16 && y === 7) {
        newGrid.forEach(l => console.log(l));
        console.log(h, v);
      }
      if ((h || v) && ![h, v].hasSameValues(reflections[i], true)) {
        return [h, v];
      }
    }
  };
  console.log(i, reflections[i]);
}

function flip(string, ind) {
  const char = string[ind] === "#" ? "." : "#";
  return string.slice(0, ind) + char + string.slice(ind + 1);
}

function horizontal(grid, ignore = null) {
  for (let i = 0, j = 1; j < grid.length; i++, j++) {
    if (j === ignore) continue;
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

function vertical(grid, ignore = null) {
  const rotated = rotate(grid);
  return horizontal(rotated, ignore);
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