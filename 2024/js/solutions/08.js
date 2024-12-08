import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js'
import { getGridBounds } from '../../../jshelpers/GridFuncs.js';

const grid = (await getInput(import.meta.url)).map((l) => l.split(""));
// map antenna frequency (character) to array of coordinates for those anntennae
// turns out this could have just been an array of arrays but we were planning for the worst
const antennae = grid.reduce((map, row, y) => {
  row.forEach((char, x) => {
    if (char === '.') return;
    if (map[char]) map[char].push({ x, y });
    else map[char] = [{ x, y }];
  });
  return map;
}, {});

const [p1, p2] = scanCityForAntinodes(grid, antennae);
l(p1.size, p2.size);

function scanCityForAntinodes(city, antennae) {
  const bounds = getGridBounds(city);
  const antinodes = new Set();
  const resonantAntinodes = new Set();

  for (const antennaeGroup of Object.values(antennae)) {
    for (const [i, antenna] of antennaeGroup.entries()) {
      // find antinode(s) for all other antennae in the group
      const others = antennaeGroup.filter((_, j) => j !== i);
      for (const other of others) {
        // part 1
        const antinode = calculateAntinode(antenna, other);
        addAntinode(antinode, antinodes, bounds);
        // part 2
        findAllAntinodes(antenna, other, resonantAntinodes, bounds);
      }
    }
  }

  return [antinodes, resonantAntinodes];
}

function calculateAntinode(a, b) {
  const x = a.x + (a.x - b.x);
  const y = a.y + (a.y - b.y);
  return { x, y };
}

function findAllAntinodes(firsta, firstb, antinodes, bounds) {
  let a = { ...firsta };
  let b = { ...firstb };

  // while in bounds, add the current coord and dynamically find the next antinode
  while (isInBounds(a, bounds)) {
    antinodes.add(getKey(a));
    const antinode = calculateAntinode(a, b);
    b = a;
    a = antinode;
  }
}

function isInBounds(coord, bounds) {
  const { x, y } = coord;
  const { xmin, xmax, ymin, ymax } = bounds;
  return x >= xmin && x <= xmax && y >= ymin && y <= ymax;
}

function addAntinode(antinode, antinodes, bounds) {
  if (!isInBounds(antinode, bounds)) return;
  antinodes.add(getKey(antinode));
}

function getKey(coord) {
  return `${coord.x}|${coord.y}`;
}
