import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js';

const _lines = await getInput(import.meta.url);
const _player = {
  hp: 100,
  damage: 0,
  armor: 0,
  spent: 0,
  equipped: [],
};
const [_bossHp, _bossDamage, _bossArmor] = _lines.map((l) => Number.parseInt(l.split(": ")[1]));
const _boss = {
  hp: _bossHp,
  damage: _bossDamage,
  armor: _bossArmor,
};
const weapons = [
  buildItem("dagger", 8, 4, 0),
  buildItem("shortsword", 10, 5, 0),
  buildItem("warhammer", 25, 6, 0),
  buildItem("longsword", 40, 7, 0),
  buildItem("greataxe", 74, 8, 0),
];
const armors = [
  buildItem("leather", 13, 0, 1),
  buildItem("chainmail", 31, 0, 2),
  buildItem("splitmail", 53, 0, 3),
  buildItem("bandedmail", 75, 0, 4),
  buildItem("platemail", 102, 0, 5),
];
const rings = [
  buildItem("damage +1", 25, 1, 0),
  buildItem("damage +2", 50, 2, 0),
  buildItem("damage +3", 100, 3, 0),
  buildItem("defense +1", 20, 0, 1),
  buildItem("defense +2", 40, 0, 2),
  buildItem("defense +3", 80, 0, 3),
];

l(getLowestCost(_player, _boss));

function getLowestCost(player, boss) {
  const results = { least: Infinity, most: 0 };

  tryAllWeapons(player, boss, results);

  return results;
}

function tryAllWeapons(player, boss, results) {
  for (const weapon of weapons) {
    const thisPlayer = structuredClone(player);
    equipItem(thisPlayer, weapon);
    doBattle(thisPlayer, boss, results);
    tryAllArmor(thisPlayer, boss, results);
  }
}

function tryAllArmor(player, boss, results) {
  for (const armor of armors) {
    const thisPlayer = structuredClone(player);
    equipItem(thisPlayer, armor);
    doBattle(thisPlayer, boss, results);
    tryOneRing(thisPlayer, boss, results);
  }
}

function tryOneRing(player, boss, results) {
  for (const ring of rings) {
    const thisPlayer = structuredClone(player);
    equipItem(thisPlayer, ring);
    doBattle(thisPlayer, boss, results);
    tryTwoRings(thisPlayer, boss, results, ring);
  }
}

function tryTwoRings(player, boss, results, firstRing) {
  for (const ring of rings) {
    // don't equip the same ring
    if (ring.cost === firstRing.cost) continue;

    const thisPlayer = structuredClone(player);
    equipItem(thisPlayer, ring);
    doBattle(thisPlayer, boss, results);
  }
}

function doBattle(player, boss, results) {
  const playerWon = battle(player, boss);

  if (playerWon && player.spent < results.least) {
    results.least = player.spent;
  } else if (!playerWon && player.spent > results.most) {
    results.most = player.spent;
  }
}

function battle(player, boss) {
  const playerDamage = Math.max(player.damage - boss.armor, 1);
  const bossDamage = Math.max(boss.damage - player.armor, 1);

  const playerLifespan = Math.ceil(player.hp / bossDamage);
  const bossLifespan = Math.ceil(boss.hp / playerDamage);

  return playerLifespan >= bossLifespan;
}

function equipItem(player, item) {
  player.damage += item.damage;
  player.armor += item.armor;
  player.spent += item.cost;
  player.equipped.push(item.name);
}

function buildItem(name, cost, damage, armor) {
  return { name, cost, damage, armor };
}
