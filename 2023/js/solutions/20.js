import { getInput } from '../../../jshelpers/InputGetter.js';
import '../../../jshelpers/ArrayFuncs.js';

const counts = { true: 0, false: 0 };

class Module {
  state = false;
  send = false;
  received = [];
  targets = [];
  isFlipFlop = null;
  key = null;

  constructor(prefix, targets, key) {
    this.isFlipFlop = prefix === "%";
    this.targets = targets;
    this.key = key;
  }
}

const lines = await getInput(import.meta.url);
const splitLines = lines.map(l => l.split(" -> "));
let broadcaster;
const modules = {};

for (const [modKey, targetKeys] of splitLines) {
  if (modKey === "broadcaster") {
    broadcaster = targetKeys.split(", ");
    continue;
  }
  modules[modKey.slice(1)] = new Module(modKey[0], targetKeys.split(", "), modKey.slice(1));
}
prepConjunctions();

multiPush(1);
console.log(counts);
console.log(Object.values(counts).product());


function multiPush(count) {
  for (let i = 0; i < count; i++) pushButton();
}

function pushButton() {
  broadcaster.forEach(m => modules[m].received.push(false));
  broadcaster.forEach(m => processPulse(modules[m]));
  counts[false] += broadcaster.length + 1;

  while (Object.values(modules).some(m => m.send)) {
    Object.values(modules).forEach(m => sendPulse(m));
    Object.values(modules).forEach(m => processPulse(m));
  }
}

function sendPulse(module) {
  if (!module.send) return;
  (module.isFlipFlop ? flipFlopPulse : conjunctionPulse)(module);
  module.send = false;
}

function flipFlopPulse(module) {
  doCount(module);
  module.targets.forEach(t => receivePulse(modules[t], module.state));
}

function conjunctionPulse(module) {
  doCount(module);
  module.targets.forEach(t => receivePulse(modules[t], module.state));
}

function receivePulse(module, pulse) {
  if (!module) return;
  module.received.push(pulse);
}

function processPulse(module) {
  if (!module.received.length) return;
  (module.isFlipFlop ? processFlipFlop : processConjunction)(module);
}

function processFlipFlop(module) {
  if (module.received.pop()) {
    module.send = false;
  } else {
    module.send = true;
    module.state = !module.state;    
  }
  module.received = [];
}

function processConjunction(module) {
  module.send = true;
  module.state = module.received.some(p => !p);
  module.received = [];
}

function prepConjunctions() {
  Object.values(modules).forEach(m => sendPulse(m));
}

function doCount(module) {
  counts[module.state] += module.targets.length;
}