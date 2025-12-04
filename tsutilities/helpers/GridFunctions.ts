import { l } from '@/tsutilities/helpers/ShorthandFunctions.js';

export type Grid<T> = T[][];
export type GridNeighbor<T> = { x: number, y: number, value: T | undefined } | undefined;
export type GridDirection = 'up' | 'ur' | 'rt' | 'dr' | 'dn' | 'dl' | 'lt' | 'ul';
export type GridNeighborBounds = {
  lookup: boolean,
  lookright: boolean,
  lookdown: boolean,
  lookleft: boolean
};
export interface GridCoordinate { x: number, y: number };

/**
 * Returns the values of the neighbors of a given grid cell as an object.
 * If cardinal is true, only the 4 cardinal directions are returned.
 * If a callback is provided, it is called on each neighbor value.
 * @param {Array} grid
 * @param {int} x
 * @param {int} y
 * @param {bool} cardinal
 * @param {function} callback
 * @returns
 */
export function getNeighbors<T>(
  grid: Grid<T>,
  x: number,
  y: number,
  cardinal: boolean = false,
  callback: ((direction: GridDirection, neighborValue: T | undefined, x: number, y: number) => void) | null = null
) {
  const neighbors: Record<GridDirection, GridNeighbor<T>> = {
    up: undefined,
    ur: undefined,
    rt: undefined,
    dr: undefined,
    dn: undefined,
    dl: undefined,
    lt: undefined,
    ul: undefined,
  };

  const { lookup, lookright, lookdown, lookleft } = getNeighborBounds(grid, x, y);

  if (lookup) neighbors.up = { value: grid[y-1][x], x, y: y-1 };
  if (lookright) neighbors.rt = { value: grid[y][x+1], x: x+1, y };
  if (lookdown) neighbors.dn = { value: grid[y+1][x], x, y: y+1 };
  if (lookleft) neighbors.lt = { value: grid[y][x-1], x: x-1, y };

  if (!cardinal) {
    if (lookup && lookright) neighbors.ur = { value: grid[y-1][x+1], x: x+1, y: y-1 };
    if (lookright && lookdown) neighbors.dr = { value: grid[y+1][x+1], x: x+1, y: y+1 };
    if (lookdown && lookleft) neighbors.dl = { value: grid[y+1][x-1], x: x-1, y: y+1 };
    if (lookup && lookleft) neighbors.ul = { value: grid[y-1][x-1], x: x-1, y: y-1 };
  }

  if (callback) {
    for (const [dir, neighbor] of Object.entries(neighbors)) {
      const direction = dir as GridDirection;
      if (neighbor) callback(direction, neighbor.value, neighbor.x, neighbor.y);
    }
  }

  return neighbors;
}

export function getNeighbor<T>(grid: Grid<T>, x: number, y: number, direction: GridDirection): GridNeighbor<T> {
  const { lookup, lookright, lookdown, lookleft } = getNeighborBounds(grid, x, y);

  const funchash: Record<GridDirection, Function> = {
    'up': () => lookup ? [x, y-1] : null,
    'ur': () => lookup && lookright ? [x+1, y-1] : null,
    'rt': () => lookright ? [x+1, y] : null,
    'dr': () => lookright && lookdown ? [x+1, y+1] : null,
    'dn': () => lookdown ? [x, y+1] : null,
    'dl': () => lookleft && lookdown ? [x-1, y+1] : null,
    'lt': () => lookleft ? [x-1, y] : null,
    'ul': () => lookup && lookleft ? [x-1, y-1] : null,
  };

  const [newx, newy] = funchash[direction]() ?? [null, null];

  return newx !== null && newy !== null ? { value: grid[newy][newx], x: newx, y: newy } : undefined;
}

export function getValueCoordinate(grid: Grid<string>, value: string): GridCoordinate | undefined {
  let x;
  for (let y = 0; y < grid.length; y++) {
    x = grid[y].indexOf(value);
    if (x > -1) return { x, y };
  }
}

export function getObjectWithValue<T extends Record<string, any>, K extends keyof T>(
  grid: Grid<T>,
  property: K,
  value: T[K]
) {
  for (const row of grid) {
    for (const object of row) {
      if (object[property] === value) return object;
    }
  }
}

export function setValue<T>(grid: Grid<T>, x: number, y: number, value: T): Grid<T> {
  const newGrid = [];
  for (const row of grid) newGrid.push([...row]);
  newGrid[y][x] = value;

  return newGrid;
}

export function getGridBounds<T>(grid: Grid<T>) {
  const xmin = 0;
  const ymin = 0;
  const xmax = grid[0].length - 1;
  const ymax = grid.length - 1;
  return { xmin, xmax, ymin, ymax };
}

export function getCoordString(coord: GridCoordinate) {
  return `${coord.x}|${coord.y}`;
}

export function buildGrid<T>(width: number, height: number, filler: T): Grid<T> {
  const grid = [];

  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {
      row.push(filler);
    }
    grid.push(row);
  }

  return grid;
}

export function rotateRowInline<T>(grid: Grid<T>, y: number, offset: number, isRight: boolean = true) {
  const row = grid[y];
  if (!isRight) offset *= -1;
  const spliceIndex = (row.length - offset) % row.length;
  const newRow = row.slice(spliceIndex).concat(row.slice(0, spliceIndex));
  grid[y] = newRow;
}

export function rotateColumnInline<T>(grid: Grid<T>, x: number, offset: number, isDown: boolean = true) {
  const column = [grid.map((row) => row[x])];
  rotateRowInline(column, 0, offset, isDown);
  for (const [y, row] of grid.entries()) {
    row[x] = column[0][y];
  }
}

export function printGridToConsole<T>(grid: Grid<T>, joinChar: string = " "): void {
  for (const row of grid) {
    l(row.join(joinChar));
  }
}

export function fillRectInline<T>(
  grid: Grid<T>,
  width: number,
  height: number,
  filler: T,
  requiresDeepCopy: boolean = false,
  starty: number = 0,
  startx: number = 0
) {
  const gridWidth = grid[0].length;
  const gridHeight = grid.length;

  for (let y = starty; y < height; y++) {
    if (y >= gridHeight) break;
    for (let x = startx; x < width; x++) {
      if (x >= gridWidth) break;
      grid[y][x] = requiresDeepCopy ? structuredClone(filler) : filler;
    }
  }
}

export function countValue<T>(
  grid: Grid<T>,
  value: T,
  comparisonFunction = (item: T, targetValue: T) => item === targetValue
): number {
  let count = 0;

  for (const row of grid) {
    for (const item of row) {
      if (comparisonFunction(item, value)) count++;
    }
  }

  return count;
}

function getNeighborBounds<T>(grid: Grid<T>, x: number, y: number): GridNeighborBounds {
  const lookup = y > 0;
  const lookright = x < grid[y].length - 1;
  const lookdown = y < grid.length - 1;
  const lookleft = x > 0;

  return { lookup, lookright, lookdown, lookleft };
}
