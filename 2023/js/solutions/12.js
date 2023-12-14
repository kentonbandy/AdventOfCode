import { getInput } from '../../../jshelpers/InputGetter.js';
import '../../../jshelpers/ArrayFuncs.js';
import '../../../jshelpers/StringFuncs.js';

const lines = await getInput(import.meta.url);
const records = lines.map(l => {
  let [s, g] = l.split(" ");
  g = g.split(",").map(n => parseInt(n));
  return { springs: s, groups: g };
});
const unfolded = records.map(({springs, groups}) => {
  const u = {
    springs: springs + "?" + springs + "?" + springs + "?" + springs + "?" + springs,
    groups: groups.concat(groups).concat(groups).concat(groups).concat(groups),
  };
  return u;
});

// part 1
const sum = records.reduce((sum, {springs, groups}) => {
  const init = getInitialPattern(springs, groups);
  return sum + scootAndValidate(init, springs, groups.length);
}, 0);
console.log(sum);

// part 2
const sum2 = unfolded.reduce((sum, {springs, groups}, i) => {
  const init = getInitialPattern(springs, groups);
  console.log(`running group ${i+ 1} of ${unfolded.length}`);
  console.log(sum);
  return sum + scootAndValidate(init, springs, groups.length);
}, 0);
console.log(sum2);


function scootAndValidate(permutation, springs, numGroups) {
  let sum = 0;

  if (numGroups === 1) {
    while (permutation.endsWith(".")) {
      sum += isValid(permutation, springs);
      permutation = shiftOp(permutation, numGroups);
    }
    sum += isValid(permutation, springs);
    return sum;
  }

  while (permutation.endsWith(".")) {
    sum += scootAndValidate(permutation, springs, numGroups - 1);
    permutation = shiftOp(permutation, numGroups);
  }
  sum += scootAndValidate(permutation, springs, numGroups - 1);
  return sum;
}

function getInitialPattern(springs, groups) {
  let damaged = groups.reduce((a, c, i, g) => {
    a += "#".repeat(c);
    if (i !== g.length - 1) a += ".";
    return a;
  }, "");
  damaged += ".".repeat(springs.length - damaged.length);
  return damaged;
}

function isValid(permutation, springs) {
  return springs.split("").every((s, i) => s === "?" || permutation[i] === s);
}

function shiftOp(permutation, groupnum) {
  const opInds = getOpInds(permutation).toReversed();
  const i = opInds[groupnum - 1];
  permutation = permutation.slice(0, i) + "." + permutation.slice(i, permutation.length - 1);
  return permutation;
}

function getOpInds(permutation) {
  const indices = [];

  permutation.split("").forEach((c, i) => {
    if (i === permutation.length - 1) return;
    if (i === 0 && permutation[0] === "#") indices.push(i);
    if (c === "." && permutation[i + 1] === "#") indices.push(i);
  });

  return indices;
}