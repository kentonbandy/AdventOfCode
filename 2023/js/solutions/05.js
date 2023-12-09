import { getInput } from '../../../jshelpers/InputGetter.js';
import '../../../jshelpers/ArrayFuncs.js';

const lines = await getInput(import.meta.url);
const seeds = lines[0].substring(7).split(" ").map(x => parseInt(x));
const categories = lines.splice(1).splitArray(x => x.includes(":"))
  .map(x => x.map(y => y.split(" ").map(z => parseInt(z))));
let lowest1 = Infinity;
let lowest2 = Infinity;

// part 1
for (let seed of seeds) {
  const locationValue = getLocationValue(seed, categories);
  lowest1 = Math.min(lowest1, locationValue);
}

// part 2
// pair seed values together
const seedPairs = seeds.reduce((a, s, i) => {
  a[a.length - 1].push(s);
  if (i % 2 === 1 && i < seeds.length - 1) a.push([]);
  return a;
}, [[]]);

// this is dumb and takes like 10 minutes with my pc but you just gotta let it cook
let pairnum = 1;
const max = seedPairs.length;
for (const pair of seedPairs) {
  console.log(`Running seed pair ${pairnum} of ${max}`);
  pairnum++;
  for (let i = pair[0]; i <= pair[0] + pair[1]; i++) {
    const locationValue = getLocationValue(i, categories);
    lowest2 = Math.min(lowest2, locationValue);
  }
}

console.log(lowest1, lowest2);

function getLocationValue(seed, categories) {
  let val = seed;
  for (const category of categories) {
    for (const map of category) {
      if (val >= map[1] && val <= map[1] + map[2]) {
        val = map[0] + val - map[1];
        break;
      }
    }
  }
  return val;
}