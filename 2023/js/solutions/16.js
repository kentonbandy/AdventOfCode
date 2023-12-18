import { getInput } from '../../../jshelpers/InputGetter.js';
import { getNeighbors } from '../../../jshelpers/GridFuncs.js';

const lines = await getInput(import.meta.url);
let coordDirSet = new Set();

const reflections = {
  "/":  { u: "r", r: "u", d: "l", l: "d" },
  "\\": { u: "l", r: "d", d: "r", l: "u" },
}

// part 1
console.log(getEnergizedCount(0, 0, "r", lines[0][0]));

// part 2
const largest = lines.reduce((largest, line, y) => {
  for (let x = 0; x < line.length; x++) {
    largest = Math.max(largest, getDirs(x, y, lines).reduce((max, dir) => {
      return Math.max(max, getEnergizedCount(x, y, dir, lines[y][x]));
    }, 0));
  }
  return largest;
}, 0);
console.log(largest);


function getEnergizedCount(x, y, dir, val) {
  beam(x, y, dir, val);
  const energized = (Array.from(coordDirSet).reduce((coords, c) => {
    coords.add(c.slice(0, c.length - 2));
    return coords;
  }, new Set())).size;
  coordDirSet = new Set();
  return energized;
}

function beam(x, y, dir, char) {
  const coordKey = `${x},${y}|${dir}`;
  if (coordDirSet.has(coordKey)) return;
  coordDirSet.add(coordKey);

  // continue in same direction
  if (char === "." ||
    (char === "-" && ["r", "l"].includes(dir)) ||
    (char === "|" && ["u", "d"].includes(dir))
  ) {
    const next = getNeighbors(lines, x, y, true)[dir];
    if (!next) return;
    beam(next.x, next.y, dir, next.val);
  }

  // reflect 90 degrees
  else if (["/", "\\"].includes(char)) {
    const nextDir = reflections[char][dir];
    const next = getNeighbors(lines, x, y, true)[nextDir];
    if (!next) return;
    beam(next.x, next.y, nextDir, next.val);
  }

  // split
  else {
    const { u, r, d, l } = getNeighbors(lines, x, y, true);
    if (char === "|") {
      if (u) beam(u.x, u.y, "u", u.val);
      if (d) beam(d.x, d.y, "d", d.val);
    } else if (char === "-") {
      if (r) beam(r.x, r.y, "r", r.val);
      if (l) beam(l.x, l.y, "l", l.val);
    }
  }
}

function getDirs(x, y, grid) {
  const dirs = [];
  const lastx = grid[0].length - 1;
  const lasty = grid.length - 1;
  if (x === 0) dirs.push("r");
  if (y === 0) dirs.push("d");
  if (x === lastx) dirs.push("l");
  if (y === lasty) dirs.push("u");
  return dirs;
}