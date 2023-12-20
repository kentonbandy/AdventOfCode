import { getInput } from '../../../jshelpers/InputGetter.js';
import '../../../jshelpers/ArrayFuncs.js';
import '../../../jshelpers/StringFuncs.js';

const lines = await getInput(import.meta.url, false);
const accepted = [];

let [workflowStrings, partsStrings] = lines.splitArray((l) => l === "");

const workflows = parseWorkflowStrings(workflowStrings);
const parts = parsePartsStrings(partsStrings);

parts.forEach(p => processWorkflow(p));
const sum = accepted.reduce((sum, part) => {
  return sum + Object.values(part).sum();
}, 0);
console.log(sum);


function getAcceptedConditions() {
  const ruleSets = [];
  let ruleSet = [];
  
}

function processWorkflow(part, workflow = "in") {
  let dest;
  for (const rule of workflows[workflow]) {
    if (!rule.op || runComparison(part, rule)) {
      dest = rule.dest;
      break;
    }
  }
  if (dest === "A") accepted.push(part);
  else if (dest === "R") return;
  else processWorkflow(part, dest);
}

function runComparison(part, rule) {
  return rule.op === ">" ? part[rule.left] > rule.right : part[rule.left] < rule.right;
}

function parseWorkflowStrings(strings) {
  return strings.reduce((workflows, ws) => {
    let [key, rules] = ws.split("{").map(x => x.rstrip("}"));
    rules = rules.split(",");
    workflows[key] = rules.map(r => {
      if (!r.includes(":")) return { dest: r };
      const [comp, dest] = r.split(":");

      return { left: comp[0], op: comp[1], right: parseInt(comp.slice(2)), dest: dest, }
    });
    return workflows;
  }, {});
}

function parsePartsStrings(strings) {
  return strings.reduce((parts, ps) => {
    const partArr = ps.lstrip("{").rstrip("}").split(",").map(x => x.split("="));
    const part = {};
    partArr.forEach(([key, val]) => part[key] = parseInt(val));
    parts.push(part);
    return parts;
  }, []);
}