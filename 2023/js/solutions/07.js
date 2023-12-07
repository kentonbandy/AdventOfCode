import { getInput } from '../../../jshelpers/InputGetter.js';

const lines = await getInput(import.meta.url);
const hands = lines.map(l => {
  const [cards, bid] = l.split(" ");
  return { cards: cards, bid: parseInt(bid) };
});

const cardpoints = {
  "A": 12, "K": 11, "Q": 10, "J": 9, "T": 8, "9": 7, "8": 6, "7": 5, "6": 4, "5": 3, "4": 2, "3": 1, "2": 0,
};
const jokerpoints = { ...cardpoints, "J": -1 };


// part 1
hands.forEach(h => { h.strength = getHandStrength(h) });
let shands = hands.toSorted(sortHands);
console.log(getWinnings(shands));

// part 2 - jokers wild
hands.forEach(h => { h.strength = getHandStrength(h, true) });
shands = hands.toSorted(jokersortHands);
console.log(getWinnings(shands));


// no flushes, only n-of-a-kind, score 0-6
function getHandStrength(hand, jokersWild = false) {
  let cardcount = {};
  for (const card of hand.cards) {
    if (!Object.keys(cardcount).includes(card)) cardcount[card] = 1;
    else cardcount[card]++;
  }

  if (jokersWild) {
    getJokersWildHandCount(cardcount);
  }

  const sigcards = Object.values(cardcount).filter(c => c !== 1)
    .toSorted((a, b) => b - a);

  if (!sigcards.length) return 0;
  if (sigcards[0] === 5) return 6;
  if (sigcards[0] === 4) return 5;
  if (sigcards[0] === 3) return sigcards.length > 1 ? 4 : 3;
  if (sigcards[0] === 2) return sigcards.length > 1 ? 2 : 1
}

// treats joker as wild and adds joker value to highest other card count
function getJokersWildHandCount(cardcount) {
  const jokers = cardcount["J"];
  if (jokers === undefined || jokers === 5) return;

  delete cardcount["J"];
  const scardcount = Object.entries(cardcount).toSorted((a, b) => b[1] - a[1]);
  if (!scardcount.length) return;
  cardcount[scardcount[0][0]] = scardcount[0][1] + jokers;
}

function jokersortHands(a, b) {
  return sortHands(a, b, true);
}

// sort hands by strength then by individual card strength - unsorted!
function sortHands(a, b, jokersWild = false) {
  if (a.strength !== b.strength) return a.strength - b.strength;

  const points = jokersWild ? jokerpoints : cardpoints;
  for (let i = 0; i < a.cards.length; i++) {
    const astrength = points[a.cards[i]];
    const bstrength = points[b.cards[i]];
    if (astrength !== bstrength) return astrength - bstrength;
  }
  return 0;
}

function getWinnings(sortedHands) {
  return sortedHands.reduce((a, h, i) => (h.bid * (i + 1)) + a, 0);
}