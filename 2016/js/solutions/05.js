import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js';
import md5 from 'js-md5';

const _doorId = (await getInput(import.meta.url))[0];

l(getPassword(_doorId));

function getPassword(doorId) {
  let password1 = "";
  const password2 = new Array(8).fill('_');
  let hash;
  let index = -1;

  while (password2.includes('_')) {
    [hash, index] = getNextCharacter(doorId, index + 1);

    if (password1.length < 8) password1 += hash[5];

    const charToInt = Number.parseInt(hash[5]);
    if (charToInt >= 0 && charToInt <= 7 && password2[charToInt] === '_') {
      password2[charToInt] = hash[6];
      l(password2.join("")); // cinematic "decrypting" animation
    }
  }

  return [password1, password2.join("")];
}

function getNextCharacter(doorId, index) {
  let hash = '';
  let newIndex = index - 1;

  while (!hash.startsWith('00000')) {
    newIndex++
    hash = md5(`${doorId}${newIndex}`);
  }

  return [hash, newIndex];
}
