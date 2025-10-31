import { getInput } from '@/tsutilities/helpers/InputGetter.js';
import { l } from '@/tsutilities/helpers/ShorthandFunctions.js';

const _input = await getInput(import.meta.url);

type BotStorage = [number?, number?];
type BotDestination = { isBot: boolean, value: number | null };
type Bot = {
  botKey: number,
  chips: BotStorage,
  lowTo: BotDestination,
  highTo: BotDestination,
  hasPassed: boolean,
};
type BotObject = { [key: number]: Bot };
type BotOutput = { [key: number]: number };

const _outputs = {} as BotOutput;
const _bots = _input.reduce((bots: BotObject, line: string) => {
  const splitString = line.split(" ");
  const firstWord = splitString[0];
  if (firstWord === "value") {
    const botKey = Number.parseInt(splitString[5]);
    if (!bots[botKey]) bots[botKey] = getBlankBot(botKey);
    bots[botKey].chips.push(Number.parseInt(splitString[1]));
  } else {
    const botKey = Number.parseInt(splitString[1]);
    if (!bots[botKey]) bots[botKey] = getBlankBot(botKey);
    bots[botKey].lowTo.isBot = splitString[5] === "bot";
    bots[botKey].lowTo.value = Number.parseInt(splitString[6]);
    bots[botKey].highTo.isBot = splitString[10] === "bot";
    bots[botKey].highTo.value = Number.parseInt(splitString[11]);
  }
  return bots;
}, {} as BotObject);

l(findBotThatComparesNumbers(_bots, _outputs, 61, 17));
l(_outputs[0] * _outputs[1] * _outputs[2]);

function findBotThatComparesNumbers(bots: BotObject, outputs: BotOutput, a: number, b: number): number | null {
  let botThatComparesNumbers: Bot | null = null;
  let notPassed = getNotPassed(Object.values(bots));

  while (notPassed.length) {
    for (const bot of notPassed) {
      if (bot.chips.length < 2) continue;

      if (bot.chips.includes(a) && bot.chips.includes(b)) botThatComparesNumbers = bot;
      handleMicrochips(bots, outputs, bot.botKey);
    }
    notPassed = getNotPassed(notPassed);
  }

  return botThatComparesNumbers?.botKey ?? null;
}

function getNotPassed(bots: Bot[]): Bot[] {
  return bots.filter((bot) => !bot.hasPassed);
}

function handleMicrochips(bots: BotObject, outputs: BotOutput, botKey: number) {
  const bot = bots[botKey];
  if (bot.lowTo.value === null || bot.highTo.value === null) {
    throw new Error(`bot not fully configured: ${bot.botKey}`);
  }

  const ascendingValues = bot.chips.toSorted((a, b) => (a ?? 0) - (b ?? 0));
  if (ascendingValues[0] === undefined || ascendingValues[1] === undefined) return;

  if (bot.lowTo.isBot) bots[bot.lowTo.value].chips.push(ascendingValues[0]);
  else outputs[bot.lowTo.value] = ascendingValues[0];
  if (bot.highTo.isBot) bots[bot.highTo.value].chips.push(ascendingValues[1]);
  else outputs[bot.highTo.value] = ascendingValues[1];
  bot.hasPassed = true;
}

function getBlankBot(botKey: number): Bot {
  return {
    botKey: botKey,
    chips: [],
    lowTo: { isBot: false, value: null },
    highTo: { isBot: false, value: null },
    hasPassed: false,
  };
}
