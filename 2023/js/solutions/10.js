import { getInput } from '../../../jshelpers/InputGetter.js';
import { getNeighbors, getValue } from '../../../jshelpers/GridFuncs.js';
import '../../../jshelpers/ArrayFuncs.js';

// #region setup
const dirs = {
  "|": ["u", "d"], "-": ["l", "r"], L: ["u", "r"],
  J: ["u", "l"], 7: ["l", "d"], F: ["r", "d"]
};
const opp = { u: "d", d: "u", l: "r", r: "l" };

const lines = await getInput(import.meta.url);
const startcoords = getValue(lines, "S");
const S = getSShape(startcoords.x, startcoords.y);

// set current to S location
// location object: { char, x, y, last (the direction we took to get here) }
let current = { pipe: S, ...startcoords, last: opp[dirs[S][0]] };

// sets to track unique pipe and inside coords
const loop = new Set([coordString(current.x, current.y)]);
const inside = new Set();

// have to move once or while loop condition will be immediately met
current = move(current);
// #endregion


// #region solutions
// part 1
// build loop
while (current.x !== startcoords.x || current.y !== startcoords.y) {
  loop.add(coordString(current.x, current.y));
  current = move(current);
}
console.log(loop.size / 2);

// part 2
// build inside set by checking each coordinate
lines.forEach((line, y) => {
  for (let x = 0; x < line.length; x++) {
    getNeighbors(lines, x, y, true, (_dir, _val, x, y) => {
      if (notInside(x, y)) return;
      inside.add(coordString(x, y));
    });
  }
});
console.log(inside.size);
// #endregion


// #region functions
function move(node) {
  const neighbors = getNeighbors(lines, node.x, node.y, true);
  const dir = getDirection(node);
  const next = neighbors[dir];
  return { pipe: next.val, x: next.x, y: next.y, last: dir };
}

function getDirection(node) {
  // the direction we want to go will be the exit that
  // is not the opposite of our last direction
  return dirs[node.pipe].find(e => e !== opp[node.last]);
}

function coordString(x, y) {
  return `${x},${y}`;
}

function notInside(x, y) {
  const key = coordString(x, y);
  return loop.has(key) || isOutside(x, y);
}

// we look to the right of the given coord
// and find the count of vertical pipe intersections.
// if even, it is outside
function isOutside(x, y) {
  const line = lines[y];
  let key;
  let char;
  let pipeString = "";
  // get vertical and corner pipe chars
  for (let i = x + 1; i < line.length; i++) {
    key = coordString(i, y);
    char = line[i];
    if (loop.has(key) && char !== "-") pipeString += char;
  }
  // convert literal S to its shape
  pipeString = pipeString.replace("S", S)
    // U bends will cancel themselves out, but we need to convert
    // S bends because the 2 characters only count as 1 intersection
    .replaceAll("FJ", "|").replaceAll("L7", "|");
  // if even count of vert intersections, node is outside the loop
  return pipeString.length % 2 === 0;
}

function getSShape(x, y) {
  const exits = Object.entries(getNeighbors(lines, x, y, true))
    .reduce((a, [k, v]) => {
      if (v && dirs[v.val]?.includes(opp[k])) a.push(k);
      return a;
    }, []);

  for (const [key, val] of Object.entries(dirs)) {
    if (val.hasSameValues(exits)) return key;
  }
}
// #endregion