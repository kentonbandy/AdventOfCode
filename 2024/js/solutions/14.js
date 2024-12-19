import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js';

class Bot {
  constructor (px, py, vx, vy) {
    this.px = px;
    this.py = py;
    this.vx = vx;
    this.vy = vy;
  }

  xmax = 100;
  ymax = 102;

  move() {
    this.px = this.px + this.vx;
    if (this.px < 0) this.px += (this.xmax + 1);
    if (this.px > this.xmax) this.px -= (this.xmax + 1);
    this.py = this.py + this.vy;
    if (this.py < 0) this.py += (this.ymax + 1);
    if (this.py > this.ymax) this.py -= (this.ymax + 1);
  }
}

const robots = (await getInput(import.meta.url)).map((line) => {
  const [p, v] = line.split(" ");
  const [px, py] = p.slice(2).split(",").map((v) => parseInt(v));
  const [vx, vy] = v.slice(2).split(",").map((v) => parseInt(v));
  return new Bot(px, py, vx, vy);
});

l(await wait(robots, 10000));

async function wait(bots, seconds) {
  let countdown = seconds + 0;
  while (countdown > 0) {
    for (const bot of bots) {
      bot.move();
    }
    const count = seconds - countdown + 1;
    if (count == 7371) {
      printBots(bots, count);
      // timeout for each frame
      //await new Promise(r => setTimeout(r, 20));
    }

    countdown--;
  }

  return getSafetyFactor(bots);
}

function getSafetyFactor(bots) {
  const halfx = bots[0].xmax / 2;
  const halfy = bots[0].ymax / 2;
  let [q0, q1, q2, q3] = [0, 0, 0, 0];

  for (const bot of bots) {
    if (bot.px < halfx && bot.py < halfy) q0++;
    else if (bot.px > halfx && bot.py < halfy) q1++;
    else if (bot.px > halfx && bot.py > halfy) q2++;
    else if (bot.px < halfx && bot.py > halfy) q3++;
  }

  return q0 * q1 * q2 * q3;
}

function printBots(bots, second) {
  console.clear();
  l("Second ", second);

  // build visual grid
  const row = Array(101).fill(" ");
  const grid = [];
  for (let i = 102; i >= 0; i--) grid.push([...row]);

  // place bots
  for (const bot of bots) {
    grid[bot.py][bot.px] = "0";
  }

  for (const row of grid) l(row.join(' '));
}
