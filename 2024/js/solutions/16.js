import { getInput } from '../../../jshelpers/InputGetter.js';
import { getValue, getCoordString, getNeighbors } from "../../../jshelpers/GridFuncs.js";
import { l } from '../../../jshelpers/functions.js';

const grid = (await getInput(import.meta.url)).map((row) => row.trim().split(""));

// track visited/unvisited
const visited = [];
const unvisited = new Set();
// build nodes of all '.'
const nodeMap = {};
// directions: right, down, left, up
const directions = [0, 1, 2, 3];
let end = null;

// populate collections
for (const [y, row] of grid.entries()) {
  for (const [x, char] of row.entries()) {
    if (char === "#") continue;

    const node = getNode(x, y, char);
    nodeMap[node.key] = node;

    if (char === "S") {
      node.score = 0;
      node.direction = 0;
      node.path = new Set([node.key]);
      visited.push(node);
    }
    else {
      unvisited.add(node);
    }
    if (char === "E") end = node;
  }
}

while (unvisited.size > 0) {
  for (const node of visited) {
    resolveNode(node);
  }
}

// this is really hacky but my solution needs extra iterations to fully resolve the scores
for (let i = 0; i < 15; i++) {
  for (const node of visited) {
    resolveNode(node);
  }
}

l(end.score, end.path.size);
print(grid, end);

function resolveNode(node) {
  if (node.isEnd) return;

  for (const dir of directions) {
    const dirDiff = Math.abs(dir - node.direction);

    // can't go backwards
    if (dirDiff === 2) continue;

    const neighbor = nodeMap[node.neighborKeys[dir]];
    if (!neighbor) continue;

    const isTurn = dirDiff % 2 === 1;
    checkNeighbor(neighbor, dir, node, isTurn);
  }
}

function checkNeighbor(neighbor, direction, node, isTurn) {
  if (!neighbor) return;

  if (unvisited.has(neighbor)) {
    unvisited.delete(neighbor);
    visited.push(neighbor);
  }

  const newScore = 1 + node.score + (1000 * isTurn);

  if (neighbor.score < newScore) return;

  // this line corrects the best paths total for the test paths but breaks the score
  // doesn't work for the actual input though
  //if (isTurn) node.score += 1000;
  const isEqual = neighbor.score === newScore;
  neighbor.score = newScore;
  neighbor.direction = direction;

  const newPath = new Set([...node.path]);

  if (isEqual) {
    newPath.forEach((n) => neighbor.path.add(n));
  }
  else {
    newPath.add(neighbor.key);
    neighbor.path = newPath;
  }
}

function getNode(x, y, char) {
  return {
    x,
    y,
    char: char,
    isEnd: char === "E",
    key: getCoordString({ x, y }),
    neighborKeys: [
      getCoordString({ x: x + 1, y }),
      getCoordString({ x, y: y + 1 }),
      getCoordString({ x: x - 1, y }),
      getCoordString({ x, y: y - 1 }),
    ],
    score: Number.MAX_SAFE_INTEGER,
    direction: null,
    path: null,
  };
}

function print(maze, node) {
  for (const [y, row] of maze.entries()) {
    const newRow = [];
    for (const [x, char] of row.entries()) {
      const coordString = getCoordString({x, y});
      const printChar = node.path.has(coordString) ? 'O' : char;
      newRow.push(printChar);
    }
    l(newRow.join(''));
  }
}
