import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js';

const lines = (await getInput(import.meta.url));
const sideArrays = lines.map((l) => l.trim().split(/\s+/).map((n) => parseInt(n)));
const part2Sides = readSidesVertically(sideArrays);

l(countPossibleTriangles(sideArrays));
l(countPossibleTriangles(part2Sides));

function countPossibleTriangles(triangles) {
  let count = 0;

  for (const [a, b, c] of triangles) {
    if (a + b <= c || a + c <= b || b + c <= a) continue;
    count += 1;
  }

  return count;
}

function readSidesVertically(triangles) {
  const newTriangles = [];
  let tri1;
  let tri2;
  let tri3

  triangles.forEach((triplet, i) => {
    if (i % 3 === 0) {
      tri1 = [];
      tri2 = [];
      tri3 = [];
    }

    tri1.push(triplet[0]);
    tri2.push(triplet[1]);
    tri3.push(triplet[2]);

    if (i % 3 === 2) {
      newTriangles.push(tri1);
      newTriangles.push(tri2);
      newTriangles.push(tri3);
    }
  });

  return newTriangles;
}
