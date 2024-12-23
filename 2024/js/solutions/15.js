import { getInput } from '../../../jshelpers/InputGetter.js';
import '../../../jshelpers/ArrayFuncs.js';
import { getNeighbor, getNodeWithValue } from '../../../jshelpers/GridFuncs.js';
import { l, c } from '../../../jshelpers/functions.js';

class Node {
  constructor(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
  }
}

const input = await getInput(import.meta.url, false);
const [mapStrings, directionsStrings] = input.splitArray((l) => l == "");
const map = mapStrings.map((s, y) => s.split("").map((char, x) => new Node(x, y, char)));
const dirConversion = { "^": "u", ">": "r", "v": "d", "<": "l" };
const directions = directionsStrings.flatMap((row) => row.split("").map((char) => dirConversion[char]));
const robot = getNodeWithValue(map, "value", "@");

const wideMap = mapStrings.reduce((grid, str, y) => {
  const row = str.split("").reduce((arr, char, x) => {
    const charMap = {
      ".": [".", "."],
      "#": ["#", "#"],
      "O": ["[", "]"],
      "@": ["@", "."],
    };
    const chars = charMap[char];
    const node1 = new Node(x * 2, y, chars[0]);
    const node2 = new Node(x * 2 + 1, y, chars[1]);
    arr = arr.concat([node1, node2]);
    return arr;
  }, []);
  grid.push(row);
  return grid;
}, []);
const wideRobot = getNodeWithValue(wideMap, "value", "@");

l(await sillyRobot(map, robot, directions));
l(await sillyRobot(wideMap, wideRobot, directions, true));

async function sillyRobot(warehouse, bot, movements, isWide = false) {
  let movingBot = bot;

  for (const movement of movements) {
    // for left and right, we can use the same function for both parts
    const moveFunc = isWide && ["u", "d"].includes(movement) ? tryMoveWide : tryMove;
    movingBot = moveFunc(warehouse, movingBot, movement);
  }

  return getGpsCoordinateSum(warehouse, isWide);
}

function getGpsCoordinateSum(warehouse, isWide) {
  let sum = 0;
  const box = isWide ? "[" : "O";

  for (const row of warehouse) {
    for (const node of row) {
      if (node.value !== box) continue;

      sum += (node.y * 100) + node.x;      
    }
  }

  return sum;
}

function tryMove(warehouse, bot, movement) {
  const nodes = [bot];
  let last = bot;

  while (!["#", "."].includes(last.value)) {
    last = getNeighbor(warehouse, last.x, last.y, movement).val;
    nodes.push(last);
  }

  if (last.value === ".") doMove(nodes);

  return nodes.find((n) => n.value === "@");
}

function doMove(nodes) {
  // get the values, move the last value to the beginning, set node values
  const values = nodes.map((n) => n.value);
  const last = values.pop();
  values.unshift(last);

  for (const [i, node] of nodes.entries()) {
    node.value = values[i];
  }
}

function tryMoveWide(warehouse, bot, movement) {
  // create an array of nodes going outward from the bot in the direction of movement.
  // if the nodes are all moveable, move the nodes starting with those furthest from the bot

  let nodesToMove = [];
  let yGroup = [bot];
  let readyToMove = false;
  let cannotMove = false;

  // for each ygroup, the next line with either be
  // all . (can move),
  // all [] (keep going),
  // or contain # (can't move)

  while (!readyToMove && !cannotMove) {
    // get rid of all . nodes before merging with nodes array (include bot for first step)
    const boxes = yGroup.filter((n) => ["[", "]", "@"].includes(n.value));
    nodesToMove = nodesToMove.concat(boxes);

    // use boxes to build the next group - we only want to look in front of boxes
    yGroup = buildYGroup(warehouse, boxes, movement);

    readyToMove = yGroup.every((n) => n.value === ".");
    cannotMove = yGroup.some((n) => n.value === "#");
  }

  if (cannotMove) return bot;
  
  while (nodesToMove.length) {
    moveNode(warehouse, nodesToMove.pop(), movement);
  }

  return getNodeWithValue(warehouse, "value", "@");
}

function buildYGroup(warehouse, lastGroup, movement) {
  const newGroup = [];

  for (const node of lastGroup) {
    const next = getNeighbor(warehouse, node.x, node.y, movement).val;
    newGroup.push(next);

    if (next.value === "[") {
      const otherHalf = getNeighbor(warehouse, next.x, next.y, "r").val;
      newGroup.push(otherHalf);
    }
    else if (next.value === "]") {
      const otherHalf = getNeighbor(warehouse, next.x, next.y, "l").val;
      newGroup.push(otherHalf);
    }
  }

  return newGroup;
}

// moves a single node one space in the direction.
// it is assumed that the next node wil be .
function moveNode(warehouse, node, movement) {
  if (node.value === ".") return;

  const next = getNeighbor(warehouse, node.x, node.y, movement).val;
  next.value = node.value;
  node.value = ".";
}

// used for debugging
async function print(warehouse, dir = "", step = 0) {
  let str = "";
  let grid = [];

  for (const row of warehouse) {
    for (const node of row) {
      str += node.value;
    }
    grid.push(str);
    str = "";
  }

  await new Promise(r => setTimeout(r, 1200));
  c();
  l(step, dir);
  for (const s of grid) l(s);
}
