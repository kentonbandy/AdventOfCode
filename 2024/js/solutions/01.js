import { getInput } from '../../../jshelpers/InputGetter.js';

const lines = await getInput(import.meta.url);

const linepairs = lines.map((line) => line.split('   '));
const lst1 = linepairs.map(([id1, _]) => id1).toSorted((a, b) => a - b);
const lst2 = linepairs.map(([_, id2]) => id2).toSorted((a, b) => a - b);
let distance = 0;
const lst2map = {};
lst2.forEach((id) => lst2map[id] = isNaN(lst2map[id]) ? 1 : lst2map[id] + 1);
let similarity = 0;

// part 1: add differences at each index
lst1.forEach((id, i) => distance += Math.abs(id - lst2[i]));
// part 2: multiply each number in the left list by the number of times it appears in the right
lst1.forEach((id) => similarity += id * (lst2map[id] ?? 0));

console.log(distance);
console.log(similarity);

// 8:40
// 23:42
