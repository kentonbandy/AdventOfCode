import { getInput } from '@/tsutilities/helpers/InputGetter.js';
import { l } from '@/tsutilities/helpers/ShorthandFunctions.js';

const _input = await getInput(import.meta.url);
type Range = {
  start: number;
  stop: number;
};
const _ranges = _input[0]
  .split(",")
  .map((values): Range => {
    const [start, stop] = values.split("-").map((str) => Number.parseInt(str));
    return { start, stop };
  });

l(sumInvalidIds(_ranges));

function sumInvalidIds(ranges: Range[]): [number, number] {
  let p1sum = 0;
  let p2sum = 0;

  for (const { start, stop } of ranges) {
    for (let i = start; i <= stop; i++) {
      const numstring = i.toString();

      if (findInvalidPattern(numstring)) {
        p2sum += i;
      }

      if (numstring.length % 2 === 1) continue;

      const half = numstring.length / 2;
      if (numstring.substring(0, half) !== numstring.substring(half)) continue;
      
      p1sum += i;
    }
  }

  return [p1sum, p2sum];
}

function findInvalidPattern(numstring: string): boolean {
  const half = Math.floor(numstring.length / 2);

  for (let i = 1; i <= half; i++) {
    if (isInvalid(numstring, i)) return true;
  }

  return false;
}

function isInvalid(numstring: string, matchlen: number) {
  const matchstring = numstring.substring(0, matchlen);
  let remaining = numstring.slice(matchlen);

  while (remaining.length) {
    const isMatch = matchstring === remaining.substring(0, matchlen);
    if (!isMatch) return false;
    remaining = remaining.slice(matchlen);
  }

  return true;
}
