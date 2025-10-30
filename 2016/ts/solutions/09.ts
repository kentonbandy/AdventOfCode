import { getInput } from '@/tsutilities/helpers/InputGetter.js';
import { l } from '@/tsutilities/helpers/ShorthandFunctions.js';

const _input = (await getInput(import.meta.url))[0];
const markerRegex = /\(\d+x\d+\)/;

type Marker = { count: number, repeat: number, targetIndex: number, targetString: string };

l(decompress(_input).length);
l(getDecompressLengthRecursive(_input));

function getDecompressLengthRecursive(input: string): number {

  const regexResult = markerRegex.exec(input);
  if (!regexResult) return input.length;
  const prepend = regexResult.index;
  const marker = parseMarker(input, regexResult[0], regexResult.index);
  const remainingInput = input.substring(regexResult[0].length + marker.targetString.length + regexResult.index);
  
  const targetLength = getDecompressLengthRecursive(marker.targetString);
  return prepend + (targetLength * marker.repeat) + getDecompressLengthRecursive(remainingInput);
}

function decompress(input: string): string {
  let pointer = 0;
  let output = "";

  while (pointer < input.length) {
    const remainingInput = input.substring(pointer);
    const regexResult = markerRegex.exec(remainingInput);
    if (!regexResult) return output + remainingInput;

    const beforeMarker = remainingInput.substring(0, regexResult.index);
    output += beforeMarker;
    pointer += regexResult.index;

    const markerString = regexResult[0];
    const marker = parseMarker(input, markerString, pointer);
    pointer += markerString.length + marker.count;
    output += executeMarker(input, output, marker);
  }

  return output;
}

function parseMarker(input: string, markerString: string, pointer: number = 0): Marker {
  const marker = markerString
    .substring(1, markerString.length -1)
    .split("x")
    .reduce((mkr, val, index) => {
      const num = Number.parseInt(val);
      if (index === 0) mkr.count = num;
      else mkr.repeat = num;
      return mkr;
    }, {} as Marker);

  marker.targetIndex = pointer + markerString.length;
  marker.targetString = input.substring(marker.targetIndex, marker.targetIndex + marker.count);

  return marker;
}

function executeMarker(input: string, output: string, marker: Marker): string {
  const repeatString = input.slice(marker.targetIndex, marker.targetIndex + marker.count);
  const decompressed = repeatString.repeat(marker.repeat);
  return decompressed;
}
