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
const sum1 = records.reduce((sum, {springs, groups}) => {
  const init = getInitialPattern(springs, groups);
  const linesum = scootAndValidate(init, springs, groups, groups.length);
  return sum + linesum;
}, 0);
console.log(sum1);

// part 2
const sum2 = unfolded.reduce((sum, {springs, groups}, i) => {
  const init = getInitialPattern(springs, groups);
  console.log(`running group ${i+ 1} of ${unfolded.length}`);
  return sum + scootAndValidate(init, springs, groups, groups.length);
}, 0);
console.log(sum2);


function scootAndValidate(permutation, springs, groups, numGroups) {
  let sum = 0;
  const validateFunc = numGroups === 1 ? isValid : scootAndValidate;

  while (permutation.endsWith(".")) {
    if (thisGroupCorrect(permutation, springs, groups, numGroups)) {
      sum += validateFunc(permutation, springs, groups, numGroups - 1);
    }
    permutation = shiftOp(permutation, numGroups);
  }
  sum += validateFunc(permutation, springs, groups, numGroups - 1);
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

function thisGroupCorrect(permutation, springs, groups, numGroups) {
  const opInds = getOpInds(permutation);
  const groupInd = groups.length - numGroups;
  let i = opInds[groupInd];
  const len = groups[groupInd];
  const end = i + len;
  
  for (; i <= end; i++) {
    if (springs[i] !== "?" && springs[i] !== permutation[i]) return false;
  }
  return true;
}

function isValid(permutation, springs) {
  for (let i = 0; i < springs.length; i++) {
    if (springs[i] !== "?" && permutation[i] !== springs[i]) return false;
  }
  return true;
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
    if ((i === 0 && permutation[0] === "#") || (c === "." && permutation[i + 1] === "#")) {
      indices.push(i);
    }
  });

  return indices;
}