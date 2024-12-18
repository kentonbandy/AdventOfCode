import { getInput } from "../../../jshelpers/InputGetter.js";
import { l } from "../../../jshelpers/functions.js";

const data = (await getInput(import.meta.url))[0]
  .split(" ")
  .map((s) => parseInt(s));

l(countStones(stones));

function countStones(stones) {
  let stoneCount = stones.length;
  let stoneNum = 1;
  for (const stone of stones) {
    l("starting stone", stoneNum++)
    stoneCount += stoneStep(stone, 1, 75);
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
