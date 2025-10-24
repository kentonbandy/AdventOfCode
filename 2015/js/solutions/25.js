import { l } from '../../../jshelpers/functions.js';

const _x = 3075;
const _y = 2981;
const _firstCode = 20151125;

l(findCode(_x, _y, _firstCode));

function findCode(targetX, targetY, firstCode) {
  let x = 1;
  let y = 1;
  let maxy = 1;
  let code = firstCode;

  while (x !== targetX || y !== targetY) {
    if (y === 0) {
      x = 1;
      y = maxy + 1;
      maxy = y;
      continue;
    }

    y -= 1;
    x += 1;
    code = getNextCode(code);
  }

  return code;
}

function getNextCode(code) {
  return (code * 252533) % 33554393;
}
