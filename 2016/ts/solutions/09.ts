import { getInput } from '@/tsutilities/helpers/InputGetter.js';
import { l } from '@/tsutilities/helpers/ShorthandFunctions.js';

const _input = (await getInput(import.meta.url))[0];
const markerRegex = /\(\d+x\d+\)/;

type Marker = { count: number, repeat: number, targetIndex: number };

l(decompress(_input).length);

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
    const marker = parseMarker(markerString, pointer);
    pointer += markerString.length + marker.count;
    output += executeMarker(input, output, marker);
  }

  return output;
}

function parseMarker(markerString: string, pointer: number): Marker {
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

  return marker;
}

function executeMarker(input: string, output: string, marker: Marker): string {
  const repeatString = input.slice(marker.targetIndex, marker.targetIndex + marker.count);
  const decompressed = repeatString.repeat(marker.repeat);
  return decompressed;
}
