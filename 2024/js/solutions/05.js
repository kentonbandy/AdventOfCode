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
  return map;
});

l(validateUpdates(updateMaps, ruleMap));

function validateUpdates(updates, rules) {
  return updates.reduce((total, update) => {
    return total + validateUpdate(update, rules);
  }, 0);
}

function validateUpdate(update, rules) {
  for (const [num, ind] of Object.entries(update)) {
    if (num === 'middle') continue;
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
