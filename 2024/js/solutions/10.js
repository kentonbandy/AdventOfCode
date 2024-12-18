import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js'
import { getNeighbors, getCoordString } from '../../../jshelpers/GridFuncs.js';

const lines = await getInput(import.meta.url);
const grid = lines.map((l) => l.split("").map((s) => parseInt(s) ?? -1));

l(parseMap(grid));

function parseMap(topomap) {
  let validDestinations = 0;
  let allValidTrails = 0;

  for (const [y, row] of topomap.entries()) {
    for (const [x, val] of row.entries()) {
      if (val !== 0) continue;

      const coordObj = { val, x, y };
      const paths = getPaths(topomap, coordObj, 0, 9);

      // part 1: use set of string coordinates to get unique paths to peaks
      const peaks = new Set(paths.map((n) => getCoordString(n)));
      validDestinations += peaks.size;

      // part 2: just add all valid paths
      allValidTrails += paths.length;
    }
  }

  return [validDestinations, allValidTrails];
}

// returning the peak coord object for each path so we can get unique for part 1
function getPaths(topomap, coordObj, nextNum, peak) {
  if (nextNum === peak && coordObj.val === peak) return coordObj;
  if (coordObj.val !== nextNum) return null;

  let paths = [];
  const neighbors = getNeighbors(topomap, coordObj.x, coordObj.y, true);

  for (const neighbor of Object.values(neighbors)) {
    if (!neighbor) continue;

    const value = getPaths(topomap, neighbor, nextNum + 1, peak);
    if (!value) continue;

    // if we reached a peak, we get a coordObj
    if (value.val) paths.push(value);
    // otherwise we got an array - combine them
    else paths = paths.concat(value);
  }

  return paths;
}
