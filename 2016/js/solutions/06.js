import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js';

const _lines = (await getInput(import.meta.url));

l(correctRepetitionMessage(_lines));

function correctRepetitionMessage(messages) {
  const counts = Array.from({ length: _lines[0].length }, () => ({}));
  
  for (const message of messages) {
    for (const [index, char] of Array.from(message).entries()) {
      counts[index][char] = (counts[index][char] ?? 0) + 1;
    }
  }

  let messageWithMostCommon = "";
  let messageWithLeastCommon = "";
  for (const countsAtIndex of counts) {
    const { most, least } = getMostAndLeastFrequentKey(countsAtIndex);
    messageWithMostCommon += most;
    messageWithLeastCommon += least;
  }

  return [messageWithMostCommon, messageWithLeastCommon];
}

function getMostAndLeastFrequentKey(counts) {
  const sortedKeys = Object.entries(counts)
    .toSorted(([_1, count1], [_2, count2]) => count2 - count1)
    .map(([key, _]) => key);

  return { most: sortedKeys[0], least: sortedKeys.at(-1) };
}
