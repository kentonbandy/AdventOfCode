import { getInput } from "../../../jshelpers/InputGetter.js";
import { l } from "../../../jshelpers/functions.js";
import '../../../jshelpers/ArrayFuncs.js';

const [ruleStrings, updateStrings] = (await getInput(import.meta.url, false)).splitArray((l) => l === '');
// create a map of rules with each unique number as a key and before/after values
const ruleMap = ruleStrings.reduce((map, rule) => {
  const [left, right] = rule.split("|");

  if (!(left in map)) map[left] = { before: [], after: [] };
  if (!(right in map)) map[right] = { before: [], after: [] };

  map[left].before.push(right);
  map[right].after.push(left);

  return map;
}, {});
// create a value to index map of updates
const updateMaps = updateStrings.map((update) => {
  const arr = update.split(",");
  const map = {};
  for (const value of arr) map[value] = arr.indexOf(value);
  map['middle'] = arr[Math.floor(arr.length / 2)];
  map['array'] = arr;
  return map;
});

l(validateUpdates(updateMaps, ruleMap));

function validateUpdates(updates, rules) {
  return updates.reduce(([totalValid, totalFixed], update) => {
    const valid = validateUpdate(update, rules);
    const fixed = valid > 0 ? 0 : fixUpdate(update.array, rules);
    return [totalValid + valid, totalFixed + fixed];
  }, [0, 0]);
}

function validateUpdate(update, rules) {
  for (const [num, ind] of Object.entries(update)) {
    if (num === 'middle' || num === 'array') continue;
    if (!checkUpdateValue(ind, rules[num], update)) return 0;
  }
  return parseInt(update['middle']);
}

function checkUpdateValue(ind, rules, update) {
  for (const beforeNum of rules.before) {
    if (beforeNum in update && update[beforeNum] < ind) return false;
  }
  for (const afterNum of rules.after) {
    if (afterNum in update && update[afterNum] > ind) return false;
  }
  return true;
}

function fixUpdate(updates, rules) {
  const sorted = updates.toSorted((a, b) => {
    const aRules = rules[a];
    const bRules = rules[b];

    // a definitely comes before b if either rule is met
    if ((aRules?.after?.includes(b)) || (bRules?.before?.includes(a))) return 1;
    // b definitely comes before a if either rule is broken
    if ((aRules?.before?.includes(b) || (bRules?.after?.includes(a)))) return -1;
    // otherwise we have no opinions
    return 0;
  });

  // return middle value
  return parseInt(sorted[Math.floor(sorted.length / 2)]);
}
