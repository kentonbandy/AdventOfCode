import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js';
import { getNeighbors } from '../../../jshelpers/GridFuncs.js';

const _lines = await getInput(import.meta.url);
const _grid = _lines.map((line) => line.split(""));
const _steps = 100;

l(animate(_grid, _steps));

function animate(grid, steps) {
  let animatedGrid = [...grid];

  for (let i = 0; i < steps; i++) {
    animatedGrid = step(animatedGrid);
  }

  return countOn(animatedGrid);
}

function step(grid) {
  const newGrid = [];

  grid.forEach((row, y) => {
    const newRow = [];

    row.forEach((light, x) => {
      const neighbors = Object.values(getNeighbors(grid, x, y));
      const lit = countLights(neighbors);
      let newLight;

      if (neighbors.filter(n => !!n).length === 3) { // corners (part 2)
        newLight = "#";
      } else if (light === "#") {
        newLight = lit === 2 || lit === 3 ? "#" : ".";
      } else {
        newLight = lit === 3 ? "#" : ".";
      }

      newRow.push(newLight);
    });

    newGrid.push(newRow);
  });

  return newGrid;
}

function countLights(neighbors) {
  let count = 0;

  for (const light of neighbors) {
    if (light?.val === "#") count++;
  }

  return count;
}

function countOn(grid) {
  let count = 0;

  for (const row of grid) {
    for (const light of row) {
      if (light === "#") count ++;
    }
  }

  return count;
}
