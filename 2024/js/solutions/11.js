import { getInput } from "../../../jshelpers/InputGetter.js";
import { l } from "../../../jshelpers/functions.js";

const startingStones = (await getInput(import.meta.url))[0]
  .split(" ")
  .map((s) => parseInt(s));

let total = 0;

countStones(startingStones, 25);
l(total);

function countStones(stones, blinks) {
  let stoneNum = 1;
  for (const stone of stones) {
    l("starting stone", stoneNum++);
    stoneStep(stone, 0, blinks);
  }
}

function stoneStep(stone, step, max) {
  if (step === max) {
    total += 1;
    return;
  }

  const newStones = evaluateStone(stone);
  for (const stone of newStones) stoneStep(stone, step + 1, max);
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
