import { l } from '../../../jshelpers/functions.js';

const spells = [//           cost  d  a  h    m  t
  buildSpell("magic missile",  53, 4, 0, 0,   0, 1),
  buildSpell("drain",          73, 2, 0, 2,   0, 1),
  buildSpell("shield",        113, 0, 7, 0,   0, 6),
  buildSpell("poison",        173, 3, 0, 0,   0, 6),
  buildSpell("recharge",      229, 0, 0, 0, 101, 5),
];
const initialState = buildState(50, 500, 0, 51, 9, 0);
let minMana = Infinity;

recursiveBattle(initialState, true);
l(minMana);

function recursiveBattle(state, isHardMode) {
  if (state.manaSpent > minMana) return;

  const availableSpells = getAvailableSpells(state);

  if (availableSpells.length === 0) {
    if (didPlayerWin(state)) {
      minMana = state.manaSpent;
    }
    return;
  }

  for (const spell of availableSpells) {
    recursiveBattle(battleRound(state, spell, isHardMode), isHardMode);
  }
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
    spellsCast: [...state.spellsCast, spell.name],
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
    return !state.activeSpells.some((activeSpell) => activeSpell.name === spell.name);
  });
}

function isBattleOver(state) {
  return state.playerHp <= 0 || state.bossHp <= 0;
}

function buildState(playerHp, playerMana, playerArmor, bossHp, bossDamage, manaSpent, activeSpells = [], spellsCast = []) {
  return { playerHp, playerMana, playerArmor, bossHp, bossDamage, manaSpent, activeSpells, spellsCast };
}

function buildSpell(name, cost, damage, armor, heal, mana, turns) {
  return { name, cost, damage, armor, heal, mana, turns };
}
