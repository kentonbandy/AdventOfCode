import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js';
import { getNeighbors } from '../../../jshelpers/GridFuncs.js';

class Plot {
  constructor(x, y, type, region = null) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.region = region;
  }
}

const lines = (await getInput(import.meta.url)).map(l => l.split(""));

const plots = [];
let regionId = 0;
const regionData = {};
const directions = ['u', 'r', 'd', 'l'];

// populate plots grid
for (const [y, row] of lines.entries()) {
  plots.push([]);
  for (const [x, type] of row.entries()) {
    plots[y].push(new Plot(x, y, type));
  }
}

// iterate through plots
for (const row of plots) {
  for (const plot of row) {
    if (!plot.region) {
      const newRegion = createNewRegion();
      propagateRegion(plot, newRegion, plots);
    }
  }
}

let cost = 0;
let discount = 0;

for (const { area, perimeter } of Object.values(regionData)) {
  const discountPerimeter = calculateDiscount(perimeter, plots);
  cost += area * perimeter.length;
  discount += area * discountPerimeter;
}

l(cost, discount);

function propagateRegion(plot, region, grid) {
  if (plot.region) return;

  plot.region = region;
  regionData[region].area += 1;

  const neighbors = getNeighbors(grid, plot.x, plot.y, true);

  for (const dir of directions) {
    const neighbor = neighbors[dir]?.val;
    if (!neighbor || neighbor.type !== plot.type) {
      regionData[region].perimeter.push({ ...plot, dir, calculated: false });
      continue;
    }
    propagateRegion(neighbor, region, grid);
  }
}

// this is an ugly run-on function but it works
function calculateDiscount(perimeter, grid) {
  let discount = 0;

  for (const plot of perimeter) {
    if (plot.calculated) continue;

    const leftRight = ['u', 'd'].includes(plot.dir);

    // filter candidates
    const matched = leftRight
      ? perimeter.filter((p) => !p.calculated && p.y === plot.y && p.dir === plot.dir)
      : perimeter.filter((p) => !p.calculated && p.x === plot.x && p.dir === plot.dir);

    // sort by x/y to get consecutive plots next to each other
    const sorted = leftRight
      ? matched.toSorted((a, b) => a.x - b.x)
      : matched.toSorted((a, b) => a.y - b.y);

    let i = sorted.indexOf(plot);

    // get two arrays going up and down from the plot's value
    const greater = sorted.slice(i + 1, sorted.length);
    const lesser = sorted.slice(0, i).toReversed();

    // while consecutive, mark calculated
    let next = leftRight ? plot.x + 1 : plot.y + 1;
    for (const greaterPlot of greater) {
      const value = leftRight ? greaterPlot.x : greaterPlot.y;
      if (value !== next) break;
      greaterPlot.calculated = true;
      next++;
    }

    next = leftRight ? plot.x - 1 : plot.y - 1;
    for (const lesserPlot of lesser) {
      const value = leftRight ? lesserPlot.x : lesserPlot.y;
      if (value !== next) break;
      lesserPlot.calculated = true;
      next--;
    }

    plot.calculated = true;
    // increment the discount by 1 - we've marked all consecutive perimeters calcluated
    discount += 1;
  }

  return discount;
}

function createNewRegion() {
  regionId += 1;
  regionData[regionId] = { area: 0, perimeter: [] };
  return regionId;
}
