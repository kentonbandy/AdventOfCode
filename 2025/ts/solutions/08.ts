import { getInput } from '@/tsutilities/helpers/InputGetter.js';
import { l } from '@/tsutilities/helpers/ShorthandFunctions.js';
import { arrayProduct } from '@/tsutilities/helpers/ArrayFunctions.js';

const _input = await getInput(import.meta.url);
type Coordinate = {
  x: number,
  y: number,
  z: number
};
const _circuits = _input.map((line) => {
  const numbers = line
    .split(',')
    .map((value) => Number.parseInt(value));
  return [{
    x: numbers[0],
    y: numbers[1],
    z: numbers[2],
  } as Coordinate];
});

l(getProductOfThreeLargestCircuits(_circuits, 1000));
l(getProductOfLastXs(_circuits));

function getProductOfThreeLargestCircuits(circuits: Coordinate[][], stop: number) {
  const connectedCircuits = buildCircuits(circuits, stop);
  connectedCircuits.sort((a, b) => b.length - a.length);
  return connectedCircuits[0].length * connectedCircuits[1].length * connectedCircuits[2].length;
}

function buildCircuits(circuits: Coordinate[][], stop: number) {
  let mutableCircuits = structuredClone(circuits);
  let min = 0;

  for (let connections = 0; connections < stop; connections++) {
    const { shortest, indexA, indexB } = getShortestDistance(mutableCircuits, min);
    min = shortest;
    if (indexA === indexB) continue;
    mutableCircuits[indexA] = mutableCircuits[indexA].concat(mutableCircuits[indexB]);
    mutableCircuits.splice(indexB, 1);
  }

  return mutableCircuits;
}

function getProductOfLastXs(circuits: Coordinate[][]) {
  let mutableCircuits = structuredClone(circuits);
  let min = 0;
  let lastCoordinateXs: number[] = [];

  while (mutableCircuits.length > 1) {
    const { shortest, indexA, indexB, coordinateA, coordinateB } = getShortestDistance(mutableCircuits, min, true);
    min = shortest;
    if (indexA === indexB) continue;
    mutableCircuits[indexA] = mutableCircuits[indexA].concat(mutableCircuits[indexB]);
    mutableCircuits.splice(indexB, 1);
    lastCoordinateXs = [coordinateA.x, coordinateB.x];
  }

  return arrayProduct(lastCoordinateXs);
}

function getShortestDistance(circuits: Coordinate[][], min: number, skipSameIndex = false) {
  let matchInfo: {
    shortest: number,
    indexA: number,
    indexB: number,
    coordinateA: Coordinate,
    coordinateB: Coordinate,
  } = {
    shortest: Infinity,
    indexA: 0,
    indexB: 0,
    coordinateA: { x: 0, y: 0, z: 0 },
    coordinateB: { x: 0, y: 0, z: 0 },
  };

  for (const [indexA, circuitA] of circuits.entries()) {
    for (const coordinateA of circuitA) {
      for (const [indexB, circuitB] of circuits.entries()) {
        if (skipSameIndex && indexA === indexB) continue;
        for (const coordinateB of circuitB) {
          if (coordinateA === coordinateB) continue;
          const distance = getDistance(coordinateA, coordinateB);
          if (distance < matchInfo.shortest && distance > min) {
            matchInfo = {
              shortest: distance,
              indexA,
              indexB,
              coordinateA,
              coordinateB,
            };
          }
        }
      }
    }
  }

  return matchInfo;
}

function getDistance(a: Coordinate, b: Coordinate) {
  const xdiff = Math.abs(a.x - b.x);
  const ydiff = Math.abs(a.y - b.y);
  const zdiff = Math.abs(a.z - b.z);

  const xyHypotenuse = Math.hypot(xdiff, ydiff);
  return Math.hypot(xyHypotenuse, zdiff);
}
