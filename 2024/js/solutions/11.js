import { getInput } from "../../../jshelpers/InputGetter.js";
import { l } from "../../../jshelpers/functions.js";

class Stone {
  constructor(value, depth) {
    this.value = value;
    this.depth = depth;
  }
}

const startingStones = (await getInput(import.meta.url))[0]
  .split(" ")
  .map((s) => new Stone(parseInt(s), 1));

const values = startingStones.map(s => s.value);

l(countStones(values, 75));

function countStones(stones, blinks) {
  let stoneCount = stones.length;
  let stoneNum = 1;
  for (const stone of stones) {
    l("starting stone", stoneNum++);
    stoneCount += stoneStep(stone, 1, blinks);
  }

  return stoneCount;
}

function stoneStep(stone, step, max) {
  if (step > max) return 0;

  const newStones = evaluateStone(stone);
  let newStoneCount = newStones.length - 1;

  for (const stone of newStones) {
    newStoneCount += stoneStep(stone, step + 1, max);
  }

  return newStoneCount;
}

function evaluateStone(stone) {
  if (stone === 0) return [1];

  const stoneString = stone.toString();
  if (stoneString.length % 2 === 0) {
    return splitInHalf(stoneString);
  }

  return [stone * 2024];
}

function splitInHalf(str) {
  const half = str.length / 2;
  const left = parseInt(str.slice(0, half));
  const right = parseInt(str.slice(half));
  return [left, right];
}

// too memory inefficient
function blinkpocalypse(stones, blinks) {
  const unprocessed = [...stones];
  let count = unprocessed.length;

  while (unprocessed.length) {
    l(unprocessed.length);
    const current = unprocessed.shift();
    // clamp depth
    if (current.depth > blinks) continue;
    const newStoneValues = evaluateStone(current.value);
    // if the stone has divided, add one to count
    count += newStoneValues.length - 1;
    newStoneValues.forEach((v) => {
      unprocessed.push(new Stone(v, current.depth + 1));
    });
  }

  return count;
}
