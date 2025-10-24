import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js';

const _lines = (await getInput(import.meta.url));
const _rooms = _lines.map((line) => {
  const splitLine = line.split("-");
  const last = splitLine.pop().split("[");
  const sectorId = Number.parseInt(last[0]);
  const checksum = last[1].substring(0, 5);
  const name = splitLine.join(" ");

  return { name, sectorId, checksum };
});

l(searchRooms(_rooms));

function searchRooms(rooms, targetStartsWith = "north") {
  let idSum = 0;
  let targetRoomSectorId;

  for (const room of rooms) {
    const checksum = constructChecksum(room.name);
    if (checksum !== room.checksum) continue;

    idSum += room.sectorId;
    const decipheredName = decipherRoomName(room);
    if (decipheredName.startsWith(targetStartsWith)) targetRoomSectorId = room.sectorId;
  }

  return [idSum, targetRoomSectorId];
}

function decipherRoomName(room) {
  let decipheredName = "";

  for (const char of room.name) {
    if (char === " ") {
      decipheredName += " ";
      continue;
    }
    const unicodeValue = (((char.codePointAt(0) + room.sectorId) - 97) % 26) + 97;
    decipheredName += String.fromCodePoint(unicodeValue);
  }

  return decipheredName;
}

function constructChecksum(name) {
  const counts = {};

  for (const char of name) {
    if (char === " ") continue;
    counts[char] = (counts[char] ?? 0) + 1;
  }

  // sort by highest count then by alphabetical order (use unicode value)
  const orderedCounts = Object.entries(counts).toSorted(([char1, count1], [char2, count2]) => {
    return count1 === count2
      ? char1.codePointAt(0) - char2.codePointAt(0)
      : count2 - count1;
  });

  const checksum = orderedCounts.slice(0, 5).map((keyVal) => keyVal[0]).join("");
  return checksum;
}
