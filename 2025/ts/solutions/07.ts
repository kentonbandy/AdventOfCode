import { getInput } from '@/tsutilities/helpers/InputGetter.js';
import { l } from '@/tsutilities/helpers/ShorthandFunctions.js';
import { arraySum } from '@/tsutilities/helpers/ArrayFunctions.js';

const _input = await getInput(import.meta.url);
const _start = _input[0].indexOf('S');
const _tachyons = [_start];
type QuantumTachyons = { [key: string]: number; };

l(traceTachyon(_input, _tachyons));

function traceTachyon(manifold: string[], startingTachyons: number[]): [number, number] {
  let tachyons: QuantumTachyons = { [startingTachyons[0]]: 1 };
  let splits = 0;

  for (const row of manifold) {
    let newTachyons: QuantumTachyons = {};

    for (const [key, amount] of Object.entries(tachyons)) {
      const index = Number.parseInt(key);
      const toAdd = resolveTachyon(index, row[index]);

      if (toAdd.length > 1) splits++
      
      for (const num of toAdd) {
        newTachyons[num] = (newTachyons[num] ?? 0) + amount;
      }
    }

    tachyons = { ...newTachyons };
  }

  return [splits, arraySum(Object.values(tachyons))];
}

function resolveTachyon(index: number, path: string): number[] {
  return path === '.' ? [index] : [index -1, index + 1];
}
