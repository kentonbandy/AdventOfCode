import { getInput } from '@/tsutilities/helpers/InputGetter.js';
import { l } from '@/tsutilities/helpers/ShorthandFunctions.js';

const _input = await getInput(import.meta.url);
type Range = { low: number, high: number };
let _ranges: Range[] = [];
const _ingredients: number[] = [];
for (const line of _input) {
  if (line.includes("-")) {
    const nums = line.split("-").map((str) => Number.parseInt(str));
    _ranges.push({ low: nums[0], high: nums[1]});
  } else {
    _ingredients.push(Number.parseInt(line));
  }
}
_ranges = combineAllRanges(_ranges);

l(findFreshIngredients(_ranges, _ingredients).length);
l(getPossibleFreshCount(_ranges));

function getPossibleFreshCount(ranges: Range[]) {
  let total = 0;

  for (const range of ranges) {
    total += range.high - range.low + 1;
  }

  return total;
}

function findFreshIngredients(ranges: Range[], ingredients: number[]): number[] {
  const freshIngredients = [];

  for (const ingredient of ingredients) {
    for (const range of ranges) {
      if (isInRange(range, ingredient)) {
        freshIngredients.push(ingredient);
      }
    }
  }

  return freshIngredients;
}

function combineAllRanges(ranges: Range[]): Range[] {
  let newRanges = [...ranges];
  let oldRanges: Range[] = [];

  while (newRanges.length !== oldRanges.length) {
    oldRanges = [...newRanges];
    newRanges = [];
    const combinedIndices = new Set();

    for (let i = 0; i < oldRanges.length; i++)  {
      if (combinedIndices.has(i)) continue;
      let isCombined = false;

      for (let j = i + 1; j < oldRanges.length; j++) {
        if (combinedIndices.has(j)) continue;
        if (!isOverlapping(oldRanges[i], oldRanges[j])) continue;
        newRanges.push(combineRanges(oldRanges[i], oldRanges[j]));
        combinedIndices.add(i);
        combinedIndices.add(j);
        isCombined = true;
      }

      if (!isCombined) newRanges.push(oldRanges[i]);
    }
  }

  return newRanges;
}

function combineRanges(range1: Range, range2: Range): Range {
  const low = Math.min(range1.low, range2.low);
  const high = Math.max(range1.high, range2.high);
  return { low, high };
}

function isOverlapping(range1: Range, range2: Range): boolean {
  return (
    isInRange(range1, range2.low) ||
    isInRange(range1, range2.high) ||
    isInRange(range2, range1.low) ||
    isInRange(range2, range1.high)
  );
}

function isInRange(range: Range, ingredient:number): boolean {
  return ingredient >= range.low && ingredient <= range.high;
}
