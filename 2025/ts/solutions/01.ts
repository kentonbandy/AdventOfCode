import { getInput } from '@/tsutilities/helpers/InputGetter.js';
import { l } from '@/tsutilities/helpers/ShorthandFunctions.js';

const _input = await getInput(import.meta.url);
type Instruction = {
  direction: string;
  amount: number;
};
const _instructions = _input.map((line: string): Instruction => {
  const dir = line[0];
  const amt = Number.parseInt(line.substring(1));
  return { direction: dir, amount: amt };
});
const _start = 50;

l(turnDial(_start));

function turnDial(start: number): number {
  let dial = start;
  let zerocount = 0;

  for (const { direction, amount } of _instructions) {
    [dial, zerocount] = followInstruction(dial, amount, zerocount, direction);
  }

  return zerocount;
}

function followInstruction(dial: number, amount: number, zerocount: number, direction: string): [dial: number, zerocount: number] {
  const toAdd = direction === "R" ? 1 : -1;

  for (let i = 0; i < amount; i++) {
    dial += toAdd;
    if (dial > 99) dial %= 100;
    if (dial < 0) dial += 100;
    if (dial === 0) zerocount++;
  }

  return [dial, zerocount];
}
