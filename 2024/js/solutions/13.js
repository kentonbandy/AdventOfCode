import { getInput } from '../../../jshelpers/InputGetter.js';
import '../../../jshelpers/ArrayFuncs.js';
import { l } from '../../../jshelpers/functions.js';

const lines = (await getInput(import.meta.url, false)).splitArray((l) => l === "");
const machines = lines.map((group) => {
  const valueStrings = group.flatMap((l) => l.split(":")[1].trim());
  const [ax, ay, bx, by, x, y] = valueStrings
    .flatMap((s) => s.split(", "))
    .map((s) => parseInt(s.includes("+") ? s.split("+")[1] : s.split("=")[1]));
  return { ax, ay, bx, by, x, y };
});

l(costToWin(machines));
l(costToWin(machines, 10000000000000));

function costToWin(slotMachines, add = 0) {
  const callback = (tokens, machine) => tokens + getTokenCost(machine, add);
  return slotMachines.reduce(callback, 0);
}

function getTokenCost(machine, add = 0) {
  const newx = machine.x + add;
  const newy = machine.y + add;

  // some algebra yields the following equation for b
  let dividend = (machine.ax * newy) - (machine.ay * newx);
  let divisor = (machine.ax * machine.by) - (machine.bx * machine.ay);
  // only valid if we get a whole number
  if (dividend % divisor !== 0) return 0;

  const b = dividend / divisor;

  // use b value to solve for a
  dividend = newy - (machine.by * b);
  divisor = machine.ay;
  if (dividend % divisor !== 0) return 0;
  
  const a = dividend / divisor;

  return (a * 3) + b;
}
