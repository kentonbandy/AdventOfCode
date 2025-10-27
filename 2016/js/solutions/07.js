import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js';

const _lines = (await getInput(import.meta.url));

l(findTlsIps(_lines));

function findTlsIps(ips) {
  const ipGroups = ips.map((ip) => ip.replaceAll("[", " ").replaceAll("]", " ").split(" "));
  const tlsIps = ipGroups.filter((ip) => isTlsIp(ip));
  const sslIps = ipGroups.filter((ip) => isSslIp(ip));

  return [tlsIps.length, sslIps.length];
}

function isSslIp(ipGroups) {
  const abas = new Set();
  const babs = new Set();

  for (const [index, group] of ipGroups.entries()) {
    const isSuper = index % 2 === 0;
    const foundAbas = findAbas(group, isSuper);
    for (const aba of foundAbas) {
      if (isSuper) {
        if (abas.has(aba)) return true;
        babs.add(aba);
      } else {
        if (babs.has(aba)) return true;
        abas.add(aba);
      }
    }
  }
}

function isTlsIp(ipGroups) {
  let hasOddAbba = false

  for (const [index, group] of ipGroups.entries()) {
    const hasAbba = stringHasAbba(group);
    if (!hasAbba) continue;
    if (index % 2 === 1) return false;
    hasOddAbba = true;
  }

  return hasOddAbba;
}

function findAbas(string, isSuper) {
  const abas = new Set();

  for (let i = 0; i < string.length - 2; i++) {
    const substring = string.substring(i, i + 3);
    if (substring[0] === substring[2] && substring[0] !== substring[1]) {
      const toAdd = isSuper
        ? substring
        : substring[1] + substring[0] + substring[1];
      abas.add(toAdd);
    }
  }

  return abas;
}

function stringHasAbba(string) {
  for (let i = 0; i < string.length - 3; i++) {
    if (
      string[i] === string[i + 3] &&
      string[i + 1] === string[i + 2] &&
      string[i] !== string[i + 1]
    ) {
      return true;
    }
  }
  return false;
}