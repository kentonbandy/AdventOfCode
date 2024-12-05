import { getInput } from '../../../jshelpers/InputGetter.js';
import { l } from '../../../jshelpers/functions.js'

const lines = await getInput(import.meta.url);
const reports = lines.map((line) => line.split(" ").map((level) => parseInt(level)));

l(processReports(reports));

function processReports(reports) {
  let safeReports = 0;
  let mostlySafeReports = 0;

  for (const report of reports) {
    const isSafe = reportIsSafe(report);
    if (isSafe) {
      safeReports += 1;
      mostlySafeReports += 1;
      continue;
    }

    // try the report with one removed until it is either safe or we've tried all iterations
    const isMostlySafe = reportIsMostlySafe(report);
    mostlySafeReports += isMostlySafe ? 1 : 0;
  }

  return [safeReports, mostlySafeReports];
}

function reportIsMostlySafe(report) {
  for (let i = 0; i < report.length; i++) {
    const reportMinusOne = report.toSpliced(i, 1);
    if (reportIsSafe(reportMinusOne)) return true;
  }
  return false;
}

function reportIsSafe(report) {
  const isDesc = report[0] > report[1];
  const len = report.length;
  for (const [i, level] of report.entries()) {
    if (i === len - 1) return true;
    const next = report[i + 1];
    const diff = Math.abs(level - next);
    if (!levelIsSafe(isDesc, level, next, diff)) return false;
  }
  return true;
}

function levelIsSafe(isDesc, cur, nex, dif) {
  const diffOutOfBounds = dif > 3;
  const notDescending = isDesc && cur <= nex;
  const notAscending = !isDesc && cur >= nex;
  return !diffOutOfBounds && !notDescending && !notAscending;
}
