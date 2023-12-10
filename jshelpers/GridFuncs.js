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
export function getNeighbors(grid, x, y, cardinal = false, callback = null) {
  let u, ur, r, dr, d, dl, l, ul;

  const lookup = y > 0;
  const lookright = x < grid[y].length - 1;
  const lookdown = y < grid.length - 1;
  const lookleft = x > 0;

  if (lookup) u = { val: grid[y-1][x], x, y: y-1 };
  if (lookright) r = { val: grid[y][x+1], x: x+1, y };
  if (lookdown) d = { val: grid[y+1][x], x, y: y+1 };
  if (lookleft) l = { val: grid[y][x-1], x: x-1, y };

  let neighbors = { u, r, d, l };

  if (!cardinal) {
    if (lookup && lookright) ur = { val: grid[y-1][x+1], x: x+1, y: y-1 };
    if (lookright && lookdown) dr = { val: grid[y+1][x+1], x: x+1, y: y+1 };
    if (lookdown && lookleft) dl = { val: grid[y+1][x-1], x: x-1, y: y+1 };
    if (lookup && lookleft) ul = { val: grid[y-1][x-1], x: x-1, y: y-1 };

    neighbors = { ...neighbors, ur, dr, dl, ul };
  }

  if (callback) {
    for (const [dir, neighbor] of Object.entries(neighbors)) {
      if (neighbor) callback(dir, neighbor.val, neighbor.x, neighbor.y);
    }
  }

  return neighbors;
}

export function findChar(grid, char) {
  let x;
  for (let y = 0; y < grid.length; y++) {
    x = grid[y].indexOf(char);
    if (x > -1) return { x, y };
  }
}