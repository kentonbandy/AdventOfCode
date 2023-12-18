import { getInput } from '../../../jshelpers/InputGetter.js';
import { getNeighbors } from '../../../jshelpers/GridFuncs.js';

class Block {
  heat;
  x; y;
  u; r; d; l;
  history;
  wholehistory;
  sum = Infinity;
  visited = false;
  end = false;

  constructor(val, x, y) {
    this.heat = parseInt(val);
    this.x = x;
    this.y = y;
  }

  setNeighbors(n) {
    this.u = n.u?.val;
    this.r = n.r?.val;
    this.d = n.d?.val;
    this.l = n.l?.val;
  }

  addHistory(d) {
    this.history.push(d);
    this.wholehistory.push(d);
    while (this.history.length > 3) this.history.shift();
  }
}

const lines = await getInput(import.meta.url);
// create block objects
const grid = lines.map((line, y) => line.split("").map((block, x) => new Block(block, x, y)));
// unvisited set
const unvisited = new Set();
// set neighbors
grid.forEach(line => line.forEach(block => {
  block.setNeighbors(getNeighbors(grid, block.x, block.y, true));
  unvisited.add(block);
}));
// set current, end
grid[grid.length - 1][grid[0].length -1].end = true;
let current = grid[0][0];
current.history = [];
current.wholehistory = [];
current.sum = current.heat;

console.log(traverse(current));


function traverse(current) {
  while (!current.end) {
    // look at possible unvisited neighbors (keeping in mind 3 in a row rule)
    getCheckableDirections(current).forEach(dir => {
      // calculate heat sum to them. if smaller, set that as their new sum AND set their history with directions
      const n = current[dir];
      const newSum = current.sum + n.heat;
      if (newSum < n.sum) {
        n.sum = newSum;
        n.history = [...current.history];
        n.wholehistory = [...current.wholehistory];
        n.addHistory(dir);
      }
    });
    // mark current as visited, remove from unvisited set
    current.visited = true;
    unvisited.delete(current);
    // set new current
    current = Array.from(unvisited).toSorted((a, b) => a.sum - b.sum)[0];
  }
  console.log(current.wholehistory);
  return current.sum;
}

function getCheckableDirections(block) {
  const exclude = new Set();
  if (block.history.length > 2 && block.history.every(d => d === block.history[0])) exclude.add(block.history[0]);
  if (!block.u || block.u.visited) exclude.add("u");
  if (!block.r || block.r.visited) exclude.add("r");
  if (!block.d || block.d.visited) exclude.add("d");
  if (!block.l || block.l.visited) exclude.add("l");
  return ["u", "r", "d", "l"].filter(d => !exclude.has(d));
}