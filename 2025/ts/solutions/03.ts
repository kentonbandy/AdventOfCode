import { getInput } from '@/tsutilities/helpers/InputGetter.js';
import { l } from '@/tsutilities/helpers/ShorthandFunctions.js';

const _input = await getInput(import.meta.url);
const _banks: string[][] = _input.map((line) => line.split(""));

l(turnOnBatteries(_banks));

function turnOnBatteries(banks: string[][]): [number, number] {
  let joltage1 = 0;
  let joltage2 = 0;

  for (const bank of banks) {
    joltage1 += getHighestJoltage(bank, 2);
    joltage2 += getHighestJoltage(bank, 12);
  }

  return [joltage1, joltage2];
}

function getHighestJoltage(bank: string[], keep: number): number {
  let start = 0;
  let batteries = [];

  while (batteries.length < keep) {
    const end = bank.length - (keep - batteries.length - 1);
    const partialBank = bank.slice(start, end);
    const [joltage, index] = getFirstHighestBattery(partialBank);
    batteries.push(joltage);
    start = start + index + 1;
  }

  return Number.parseInt(batteries.join(""));
}

function getFirstHighestBattery(bank: string[]): [number, number] {
  let highest = 0;
  let index = 0;

  for (let i = 0; i < bank.length; i++) {
    const joltage = Number.parseInt(bank[i]);
    if (joltage > highest) {
      highest = joltage;
      index = i;
    }
  }

  return [highest, index];
}
