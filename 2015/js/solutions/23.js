import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js';

const _lines = await getInput(import.meta.url);
const _commands = _lines.map((line) => {
  let [commandName, arg1, arg2 = null] = line.split(" ");
  if (arg1.endsWith(",")) {
    arg1 = arg1.substring(0, arg1.length - 1);
  }
  arg1 = parseJumpValue(arg1);
  arg2 = parseJumpValue(arg2);
  return { commandName, arg1, arg2 };
});

const funcResolver = {
  'hlf': hlf,
  'tpl': tpl,
  'inc': inc,
  'jmp': jmp,
  'jie': jie,
  'jio': jio,
};

l(executeCommand(_commands, { a: 0, b: 0 }));
l(executeCommand(_commands, { a: 1, b: 0 }));

function parseJumpValue(string) {
  if (!string?.startsWith("+") && !string?.startsWith("-")) return string;

  const operator = string.substring(0, 1);
  const value = string.substring(1);
  const mult = operator === "+" ? 1 : -1;
  const intValue = Number.parseInt(value);

  return intValue * mult;
}

function executeCommand(commands, registers, index = 0) {
  if (index < 0 || index >= commands.length) return registers;

  const command = commands[index];
  ({ registers, index } = funcResolver[command.commandName](command, registers, index));
  return executeCommand(commands, registers, index);
}

function hlf(command, registers, index) {
  const newRegisters = { ...registers, [command.arg1]: registers[command.arg1] / 2 };
  return { registers: newRegisters, index: index + 1 };
}

function tpl(command, registers, index) {
  const newRegisters = { ...registers, [command.arg1]: registers[command.arg1] * 3 };
  return { registers: newRegisters, index: index + 1 };
}

function inc(command, registers, index) {
  const newRegisters = { ...registers, [command.arg1]: registers[command.arg1] + 1 };
  return { registers: newRegisters, index: index + 1 };
}

function jmp(command, registers, index) {
  return { registers, index: index + command.arg1 };
}

function jie(command, registers, index) {
  const toAdd = registers[command.arg1] % 2 === 0 ? command.arg2 : 1;
  return { registers, index: index + toAdd };
}

function jio(command, registers, index) {
  const toAdd = registers[command.arg1] === 1 ? command.arg2 : 1;
  return { registers, index: index + toAdd };
}
