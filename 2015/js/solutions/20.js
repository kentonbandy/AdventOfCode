import { l } from '../../../jshelpers/functions.js';

const _input = 36000000;
const _delivery = 11;

// This was hacky; I'm sure a much better solution is possible using clever math

l(findLowestHouseNumberWithTotal(_input, _delivery));

function findLowestHouseNumberWithTotal(total, delivery) {
  let presents = 0;
  let n = 880000;

  while (presents < total) {
    n += 1;
    presents = getPresentTotal(n, delivery);
  }

  return n;
}

function getPresentTotal(number, delivery) {
  let presents = number * delivery;

  for (let n = Math.ceil(number / 2); n > 0; n--) {
    if ((number / n) >= 50) break;
    if (number % n === 0) {
      presents += (n * delivery);
    }
  }

  return presents;
}
