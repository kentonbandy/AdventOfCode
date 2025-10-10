import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js';

const _lines = await getInput(import.meta.url);
let _molecule;
const _conversions = _lines.reduce((arr, line) => {
  if (!line.includes("=>")) {
    _molecule = line;
    return arr;
  }

  const split = line.split(" => ");
  const obj = { from: split[0], to: split[1] };
  arr.push(obj);

  return arr;
}, []);

const _uniqueMolecules = new Set();

runAllConversions(_molecule, _conversions, _uniqueMolecules);
l(_uniqueMolecules.size);
const fabricationCount = reverseFabrication(_molecule, _conversions);
l(fabricationCount);

function runAllConversions(molecule, conversions, uniqueMolecules) {
  for (const conversion of conversions) {
    doConversions(molecule, conversion, uniqueMolecules);
  }
}

function doConversions(molecule, conversion, uniqueMolecules) {
  for (let i = 0; i < molecule.length; i++) {
    const right = molecule.substring(i);
    if (!right.startsWith(conversion.from)) continue;
    const left = molecule.substring(0, i);

    const newMolecule = left + right.replace(conversion.from, conversion.to);
    uniqueMolecules.add(newMolecule);
  }
}

function reverseFabrication(molecule, conversions) {
  let newMolecule = molecule + "";
  let count = 0;
  let lastCount = -1;

  while (newMolecule !== "e" && lastCount !== count) {
    lastCount = count
    for (const conversion of conversions) {
      [newMolecule, count] = findAndReplace(newMolecule, conversion, count);
    }
  }

  return count;
}

function findAndReplace(molecule, conversion, count) {
  let newMolecule = molecule + "";
  let newCount = count;

  while (newMolecule.includes(conversion.to)) {
    newMolecule = newMolecule.replace(conversion.to, conversion.from);
    newCount += 1;
  }

  return [newMolecule, newCount];
}
