import { getInput } from "../../../jshelpers/InputGetter.js";
import { l } from "../../../jshelpers/functions.js";
import { getValue } from "../../../jshelpers/GridFuncs.js";

/* This solution is a mess but it's fast */

const lab = (await getInput(import.meta.url)).map((line) => line.split(""));
const start = getValue(lab, '^');

const funcs = {
  0: moveUp,
  1: moveRight,
  2: moveDown,
  3: moveLeft,
};

// objects mapping indices to sets to track obstacles
const xtoy = {};
const ytox = {};
// build obstacle maps
for (const [y, row] of Object.entries(lab)) {
  ytox[y] = new Set();
  for (const [x, value] of Object.entries(row)) {
    if (!xtoy[x]) xtoy[x] = new Set();
    if (value !== '#') continue;
    addCoordToSetMaps(x, y);
  }
}

let p1Visited = traverse(lab, start, 0);
l(p1Visited.size);
l(canItLoop(lab, p1Visited, start, 0));

function traverse(grid, startxy, startDir) {
  let result = startxy;
  let dir = startDir;
  let visited = new Set();

  while (result) {
    result = funcs[dir](grid, result.x, result.y, visited);
    dir = turn(dir);
  }

  return visited;
}

function canItLoop(grid, visited, startxy, startDir) {
  // slow/fast pointers, not sure if this is a good approach here
  // I didn't want to fuss with tracking directions in visited history
  let count = 0;

  // try a new obstacle for each location that was visited in part 1
  for (const coordString of visited) {
    let { x, y } = getCoordsFromString(coordString);

    // can't put an obstacle on the start coord
    if (x === startxy.x && y === startxy.y) continue;

    // we track obstacles using the set maps, so add the new obstacle
    addCoordToSetMaps(x, y);
    let slow = { ...startxy };
    let fast = { ...startxy };
    let slowDir = startDir;
    let fastDir = startDir;
    let firstStep = true; // stupid hack to make sure they don't jam up in the first turn

    while (fast) {
      slow = funcs[slowDir](grid, slow.x, slow.y);
      slowDir = turn(slowDir);

      fast = funcs[fastDir](grid, fast.x, fast.y);
      fastDir = turn(fastDir);
      if (!fast) break;
      // so fast
      fast = funcs[fastDir](grid, fast.x, fast.y);
      fastDir = turn(fastDir);

      // if they meet, there's a loop, congratulations
      if (!firstStep && slow.x === fast?.x && slow.y === fast?.y) {
        count++;
        break;
      }
      firstStep = false;
    }
    // don't forget to remove the new obstacle
    removeCoordFromSetMaps(x, y);
  }

  return count;
}

function addCoordToSetMaps(x, y) {
  const intx = parseInt(x);
  const inty = parseInt(y);
  xtoy[x].add(inty);
  ytox[y].add(intx);
}

function removeCoordFromSetMaps(x, y) {
  const intx = parseInt(x);
  const inty = parseInt(y);
  xtoy[x].delete(inty);
  ytox[y].delete(intx);
}

function moveUp(_, x, y, visited = null) {
  let newy = y;
  const set = xtoy[x];

  while (!set.has(newy) && newy >= 0) {
    if (visited) visited.add(getCoordString(x, newy));
    newy--;
  }

  if (++newy === 0) return null;
  return { x, y: newy };
}

function moveRight(grid, x, y, visited = null) {
  let newx = x;
  const set = ytox[y];

  while (!set.has(newx) && newx < grid[0].length) {
    if (visited) visited.add(getCoordString(newx, y));
    newx++;
  }

  if (--newx === grid[0].length - 1) return null;
  return { x: newx, y };
}

function moveDown(grid, x, y, visited = null) {
  let newy = y;
  const set = xtoy[x];

  while (!set.has(newy) && newy < grid.length) {
    if (visited) visited.add(getCoordString(x, newy));
    newy++;
  }

  if (--newy === grid.length - 1) return null;
  return { x, y: newy };
}

function moveLeft(_, x, y, visited = null) {
  let newx = x;
  const set = ytox[y];

  while (!set.has(newx) && newx >= 0) {
    if (visited) visited.add(getCoordString(newx, y));
    newx--;
  }
  if (++newx === 0) return null;
  // move back one since we hit an obstacle
  return { x: newx, y };
}

function turn(dir) {
  return (dir + 1) % 4;
}

function getCoordString(x, y) {
  return `${x}|${y}`;
}

function getCoordsFromString(string) {
  const [x, y] = string.split("|").map((s) => parseInt(s));
  return { x, y };
}
