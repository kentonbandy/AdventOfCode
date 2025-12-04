import { getInput } from '@/tsutilities/helpers/InputGetter.js';
import { l } from '@/tsutilities/helpers/ShorthandFunctions.js';
import { getNeighbors, type Grid, type GridCoordinate } from '@/tsutilities/helpers/GridFunctions.js';

const _input = await getInput(import.meta.url);
const _grid = _input.map((line) => line.split("")) as Grid<string>;

l(findAccessibleRolls(_grid).length); // p1
l(removeRolls(_grid));                // p2

function removeRolls(grid: Grid<string>): number {
  let removed = 0;
  let mutableGrid = structuredClone(grid);
  
  while (true) {
    const toRemove = findAccessibleRolls(mutableGrid);
    if (toRemove.length === 0) break;
    mutableGrid = clearRolls(mutableGrid, toRemove);
    removed += toRemove.length;
  }

  return removed;
}

function findAccessibleRolls(grid: Grid<string>): GridCoordinate[] {
  const accessibleRolls: GridCoordinate[] = [];

  for (const [y, row] of grid.entries()) {
    for (const [x, roll] of row.entries()) {
      if (roll !== '@') continue;
      const neighbors = getNeighbors(grid, x, y);
      if (Object.values(neighbors).filter((n) => n?.value === '@').length < 4) {
        accessibleRolls.push({ x, y });
      }
    }
  }

  return accessibleRolls;
}

function clearRolls(grid: Grid<string>, rollCoordinates: GridCoordinate[]): Grid<string> {
  const newGrid = structuredClone(grid);

  for (const { x , y } of rollCoordinates) {
    newGrid[y][x] = '.';
  }

  return newGrid;
}
