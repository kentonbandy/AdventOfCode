import { getInput } from "../../../jshelpers/InputGetter.js";
import { l } from "../../../jshelpers/functions.js";

const stones = (await getInput(import.meta.url))[0]
  .split(" ")
  .map((s) => parseInt(s));

l(observeStones(stones, 25).length);

function observeStones(stones, blinks) {
  let newStones = [...stones];
  let count = 1;

  while (blinks > 0) {
    l(count++);
    newStones = blink(newStones);
    blinks--;
  }

  return newStones;
}

function blink(stones) {
  let newStones = [];

  for (const stone of stones) {
    newStones = newStones.concat(evaluateStone(stone));
  }

  l(newStones);
  return newStones
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
