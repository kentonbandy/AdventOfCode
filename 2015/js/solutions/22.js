import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js';

/**
 * I was stuck on this and researched a solution. Thanks to Edd Mann
 * https://eddmann.com/posts/advent-of-code-2015-day-22-wizard-simulator-20xx/
 * My solution is similar in approach but with some differences due to my preferences and environment.
 */

const _lines = await getInput(import.meta.url);
const spells = [//           cost  d  a  h    m  t
  buildSpell("magic missile",  53, 4, 0, 0,   0, 1),
  buildSpell("drain",          73, 2, 0, 2,   0, 1),
  buildSpell("shield",        113, 0, 7, 0,   0, 6),
  buildSpell("poison",        173, 3, 0, 0,   0, 6),
  buildSpell("recharge",      229, 0, 0, 0, 101, 5),
];
const [bossHp, bossDamage] = _lines.map((l) => Number.parseInt(l.split(": ")[1]));
const initialState = buildState(50, 500, 0, bossHp, bossDamage, 0);

l(recursiveBattle(initialState));
l(recursiveBattle(initialState, true));

function recursiveBattle(state, isHardMode = false, minMana = Infinity) {
  if (state.manaSpent > minMana) return minMana;

  const availableSpells = getAvailableSpells(state);

  if (availableSpells.length === 0) {
    return didPlayerWin(state) ? state.manaSpent : minMana;
  }

  for (const spell of availableSpells) {
    const postBattleState = battleRound(state, spell, isHardMode);
    const result = recursiveBattle(postBattleState, isHardMode, minMana);
    minMana = Math.min(minMana, result);
  }

  return minMana;
}

function battleRound(state, spell, isHardMode) {
  const beginState = isHardMode ? hardMode(state) : state;
  if (beginState.playerHp === 0) return beginState;
  return bossTurn(applySpellEffects(playerTurn(spell, applySpellEffects(beginState))));
}

function hardMode(state) {
  return {
    ...state,
    playerHp: state.playerHp - 1,
  };
}

function didPlayerWin(state) {
  return isBattleOver(state) && state.playerHp > 0;
}

function playerTurn(spell, state) {
  if (isBattleOver(state)) return state;

  const isEffect = spell.turns > 1;

  return {
    ...state,
    playerHp: state.playerHp + (isEffect ? 0 : spell.heal),
    playerMana: state.playerMana - spell.cost,
    bossHp: state.bossHp - (isEffect ? 0 : spell.damage),
    manaSpent: state.manaSpent + spell.cost,
    activeSpells: isEffect ? [...state.activeSpells, spell] : state.activeSpells,
  };
}

function bossTurn(state) {
  if (isBattleOver(state)) return state;

  const bossDamage = Math.max(state.bossDamage - state.playerArmor, 1);

  return { ...state, playerHp: state.playerHp - bossDamage };
}

function applySpellEffects(state) {
  if (isBattleOver(state)) return state;

  return {
    ...state,
    playerMana: state.playerMana + getPropertySum(state.activeSpells, "mana"),
    playerArmor: getPropertySum(state.activeSpells, "armor"),
    bossHp: state.bossHp - getPropertySum(state.activeSpells, "damage"),
    activeSpells: state.activeSpells.reduce((newActiveSpells, spell) => {
      if (spell.turns > 1) newActiveSpells.push({ ...spell, turns: spell.turns - 1 });
      return newActiveSpells;
    }, []),
  };
}

function getPropertySum(array, property) {
  return array.reduce((sum, item) => sum + item[property], 0);
}

function getAvailableSpells(state) {
  if (isBattleOver(state)) return [];

  return spells.filter((spell) => {
    if (spell.cost > state.playerMana) return false;
    // include spells with turns === 1 because those will expire by the player's turn
    return !state.activeSpells.some((activeSpell) => activeSpell.name === spell.name && activeSpell.turns > 1);
  });
}

function isBattleOver(state) {
  return state.playerHp <= 0 || state.bossHp <= 0;
}

function buildState(playerHp, playerMana, playerArmor, bossHp, bossDamage, manaSpent, activeSpells = []) {
  return { playerHp, playerMana, playerArmor, bossHp, bossDamage, manaSpent, activeSpells };
}

function buildSpell(name, cost, damage, armor, heal, mana, turns) {
  return { name, cost, damage, armor, heal, mana, turns };
}
