import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js'

const diskMap = (await getInput(import.meta.url))[0];

l(getChecksum(diskMap));

function getChecksum(diskMap) {
  // part 1
  const reverseIds = buildReverseIds(diskMap);
  const disk = buildDisk(diskMap, reverseIds);
  const checksum = calculateChecksum(disk);

  // part 2
  const diskChunks = buildDiskChunks(diskMap);
  buildDiskWithWholeFiles(diskChunks);
  const flatDisk = flattenChunks(diskChunks);
  const chunksum = calculateChecksum(flatDisk);

  return [checksum, chunksum];
}

function flattenChunks(chunks) {
  const flat = [];
  for (const chunk of chunks) {
    for (const val of chunk.values) {
      flat.push(parseInt(val));
    }
    for (let i = 0; i < chunk.space; i++) {
      flat.push('.');
    }
  }

  return flat;
}

function buildDiskWithWholeFiles(disk) {
  // mutating the input because I'm a little scurred about doubling memory usage
  for (let i = disk.length - 1; i >= 0; i--) {
    const chunk = disk[i];
    if (chunk.space > 0) continue;

    const match = disk.find((c, j) => j < i && c.space >= chunk.values.length);
    if (!match) continue;

    match.values = match.values.concat(chunk.values);
    match.space -= chunk.values.length;
    disk[i] = { values: [], space: chunk.values.length };
  }
}

function buildDiskChunks(diskMap) {
  // this is kinda jank but it's fine just go with it
  const disk = [];
  let isEmpty = false;
  let id = 0;

  for (const value of diskMap) {
    const values = isEmpty ? [] : buildArrayOfNValues(id, parseInt(value));
    const space = isEmpty ? parseInt(value) : 0;
    const chunk = { values, space };
    id += isEmpty; // u so funny js
    isEmpty = !isEmpty;
    disk.push(chunk);
  }

  return disk;
}

function calculateChecksum(disk) {
  let checksum = 0;
  for (const [i, val] of disk.entries()) {
    if (val === '.') continue;
    checksum += i * val;
  }

  return checksum;
}

function buildReverseIds(diskMap) {
  let largeId = Math.floor(diskMap.length / 2);
  let largeIndex = diskMap.length - 1;
  const reverseIds = [];

  // build backward, ignoring spaces
  while (largeIndex > -1) {
    for (let i = 0; i < diskMap[largeIndex]; i++) {
      reverseIds.push(largeId);
    }
    largeId--;
    largeIndex -= 2;
  }

  return reverseIds;
}

function buildDisk(diskMap, reverseIds) {
  const disk = [];
  let smallId = 0;
  let smallIndex = 0;
  let largeIdIndex = 0;
  let count;

  while (smallId < reverseIds[largeIdIndex]) {
    count = diskMap[smallIndex++];
    addNIdToArray(disk, smallId, count);
    smallId++;
    count = diskMap[smallIndex++];
    for (let i = 0; i < count; i++) {
      disk.push(reverseIds[largeIdIndex++]);
    }
  }

  // edge case: finish out the remainder of the last id
  while (reverseIds[largeIdIndex] === disk[disk.length - 1]) {
    disk.push(reverseIds[largeIdIndex++]);
  }

  return disk;
}

function addNIdToArray(array, id, n) {
  for (let i = 0; i < n; i++) {
    array.push(id);
  }
}

function buildArrayOfNValues(value, n) {
  const array = [];
  for (let i = 0; i < n; i++) array.push(value);
  return array;
}
