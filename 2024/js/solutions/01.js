import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js';

const lines = await getInput(import.meta.url);

// part 1
const linepairs = lines.map((line) => line.split('   '));
// separate and sort left and right lists
const lst1 = linepairs.map(([id1, _]) => id1).toSorted((a, b) => a - b);
const lst2 = linepairs.map(([_, id2]) => id2).toSorted((a, b) => a - b);
// distance is the sum of differences at each index
const distance = lst1.reduce((sum, id, i) => sum + Math.abs(id - lst2[i]), 0);
l(distance);

// part 2 - create map of list 2 for fast lookup
const lst2map = {};
lst2.forEach((id) => lst2map[id] = isNaN(lst2map[id]) ? 1 : lst2map[id] + 1);
// similarity is id in left list * how many times it is found in the right list
const similarity = lst1.reduce((sum, id) => sum + (id * (lst2map[id] ?? 0)), 0);
l(similarity);

// 8:40
// 23:42
