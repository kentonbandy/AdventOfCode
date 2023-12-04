import { getInput } from '../../../jshelpers/InputGetter.js';

const lines = await getInput(import.meta.url);

const numbers = parseLines(lines);
const [points, matchValues] = processNumbers(numbers);
const cards = cardception(matchValues);
console.log(points, cards);

function processNumbers(numbers) {
  let totalPoints = 0;
  const matchValues = []
  for (const numArray of numbers) {
    const [winning, elf] = numArray;
    let points = 0;
    let matches = 0;
    elf.forEach((n) => {
      if (winning.includes(n)) {
        points = points > 0 ? points * 2 : 1;
        matches++;
      }
    });
    totalPoints += points;
    matchValues.push(matches);
  }
  return [totalPoints, matchValues];
}

function cardception(matchValues) {
  let cardcount = Array(matchValues.length).fill(1);
  for (const [i, matches] of matchValues.entries()) {
    for (let j = i+1; j < i + matches + 1; j++) {
      cardcount[j] += cardcount[i];
    }
  }
  return cardcount.reduce((a,c) => a + c, 0);
}

function parseLines(lines) {
  const parsed = [];
  for (const line of lines) {
    const parsedLine = line.split(":")[1].split("|").map(x => x.trim().split(" ").filter(x => x));
    parsed.push(parsedLine);
  }
  return parsed;
}