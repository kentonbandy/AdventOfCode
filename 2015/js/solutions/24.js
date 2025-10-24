import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js';
import '../../../jshelpers/ArrayFuncs.js';

/**
 * I had to look up explanations of subset sum, partition, and 3-partition problems to find an approach to this one.
 * I opted for a dynamic programming approach.
 */

const _lines = await getInput(import.meta.url);
const _presents = _lines
  .map((line) => Number.parseInt(line))
  .toSorted((a, b) => a - b);

l(getQuantumEntanglement(_presents, 3));
l(getQuantumEntanglement(_presents, 4));

function getQuantumEntanglement(presents, numberOfGroups) {
  const presentsSet = new Set(presents);
  const targetWeight = presents.sum() / numberOfGroups;
  const sumArray = buildSumArray(presentsSet, targetWeight);
  applySums(presents, sumArray, targetWeight);
  
  return getQEOfShortestGroup(sumArray[targetWeight]);
}

function buildSumArray(numbersSet, target) {
  const sumArray = [[new Set()]]; // set representing 0
  for (let i = 1; i <= target; i++) {
    const value = numbersSet.has(i) ? [new Set([i])] : null;
    sumArray.push(value);
  }

  return sumArray;
}

function getQEOfShortestGroup(groups) {
  const shortest = filterByShortest(groups);
  const quantumEntanglementValues = shortest.map((group) => {
    return Array.from(group).product();
  });

  return Math.min(...quantumEntanglementValues);
}

function applySums(numbers, array, target) {
  for (const number of numbers) {
    for (let index = 1; index <= target; index++) {
      applySum(number, index, array);
    }    
  }
}

function applySum(number, index, array) {
  const toMove = array[index - number]?.filter((s) => !s.has(number))?.map((s) => structuredClone(s));
  if (!toMove?.length) return;

  array[index] ??= [];

  const shortest = filterByShortest(toMove);
  
  for (const set of shortest) {
    set.add(number);
    array[index].push(set);
  }
}

function filterByShortest(groups) {
  return groups.reduce((shortest, current) => {
    if (current.size < shortest[0].size) {
      return [current];
    } else if (current.size === shortest[0].size) {
      shortest.push(current);
    }
    return shortest;
  }, [groups[0]]);
}
