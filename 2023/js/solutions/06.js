import { getInput } from '../../../jshelpers/InputGetter.js';

const lines = await getInput(import.meta.url);

const times = lines[0].split(" ").filter(x => x).slice(1);
const distances = lines[1].split(" ").filter(x => x).slice(1);
const races = times.reduce((a, c, i) => {
  a.push({ time: parseInt(c), dist: parseInt(distances[i]) });
  return a;
}, []);
const races2 = {
  time: parseInt(lines[0].split(":")[1].replaceAll(" ", "")),
  dist: parseInt(lines[1].split(":")[1].replaceAll(" ", ""))
};
let marginProduct = 1;

races.forEach((r) => { marginProduct *= getMarginForRace(r) });
const race2Margin = getMarginForRace(races2);

console.log(marginProduct, race2Margin);

function getMarginForRace(r) {
  let attempt = 0;
  let range = [];
  let i = 1;
  const calculate = (n) => (r.time - n) * n;
  for (; attempt <= r.dist; i++) attempt = calculate(i);
  range.push(i - 1);
  attempt = 0;
  for (i = r.time - 1; attempt <= r.dist; i--) attempt = calculate(i);
  range.push(i + 1);
  
  return (range[1] + 1) - range[0];
}