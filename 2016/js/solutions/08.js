import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js';
import {
  buildGrid,
  rotateRowInline,
  rotateColumnInline,
  fillRectInline,
  printGridToConsole,
  countValue
} from '../../../jshelpers/GridFuncs.js';

const _lines = (await getInput(import.meta.url));
const _commands = _lines.map((line) => {
  const info = line.split(" ");
  if (info[0] === "rect") {
    const values = info[1].split("x").map((v) => Number.parseInt(v));
    return {
      name: info[0],
      width: values[0],
      height: values[1],
    };
  }
  // if not rect, rotate
  const offset = Number.parseInt(info[4]);
  const index = Number.parseInt(info[2].split("=")[1]);
  return {
    name: `${info[0]} ${info[1]}`,
    index,
    offset,
  };
});
const _grid = buildGrid(50, 6);
const _commandToFunc = {
  "rect": fillRectInline,
  "rotate row": rotateRowInline,
  "rotate column": rotateColumnInline,
};

runCommandsInline(_grid, _commands);
l(countValue(_grid, "#"));
printGridToConsole(_grid);

function runCommandsInline(grid, commands) {
  for (const command of commands) {
    runCommandInline(grid, command);
  }
}

function runCommandInline(grid, command) {
  const { name, width, height, index, offset } = command;
  _commandToFunc[name](grid, width ?? index, height ?? offset);
}
