import { getInput } from '../../../jshelpers/InputGetter.js';
import '../../../jshelpers/ArrayFuncs.js';


const lines = await getInput(import.meta.url);

lines
  .map(l => l.split(" ").map(n => parseInt(n)))
  .reduce((a, h) => {
    a[0].push(getPrediction(h));
    a[1].push(getPrediction(h, false, true));
    return a;
  }, [[], []])
  .map(x => x.sum())
  .forEach(x => console.log(x));


// call stacks hate this one weird trick
function getPrediction(nums, zero = false, first = false) {
  if (zero) return 0;

  const diffs = [];
  let allzero = true;

  for (let i = 1; i < nums.length; i++) {
    const diff = nums[i] - nums[i - 1];
    if (diff !== 0) allzero = false;
    diffs.push(diff);
  }

  const ind = first ? 0 : nums.length - 1;
  return first
    ? nums[ind] - getPrediction(diffs, allzero, first)
    : nums[ind] + getPrediction(diffs, allzero, first);
}