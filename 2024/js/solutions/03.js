import { getInput } from "../../../jshelpers/InputGetter.js";
import { l } from "../../../jshelpers/functions.js";

const input = await getInput(import.meta.url);
const regex = /mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)/gm;
const instructions = input.flatMap((i) => i.match(regex));
let enabled = true;

const solution = instructions.reduce(
  ([sum1, sum2], instruction) => {
    if (instruction === "do()") enabled = true;
    else if (instruction === "don't()") enabled = false;
    else {
      const product = instruction
        .slice(4, instruction.length - 1)
        .split(",")
        .map((n) => parseInt(n))
        .reduce((prod, num) => prod * num, 1);

      sum1 += product;
      if (enabled) sum2 += product;
    }

    return [sum1, sum2];
  },
  [0, 0]
);

l(solution);
