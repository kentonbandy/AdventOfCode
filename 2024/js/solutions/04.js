import { getInput } from "../../../jshelpers/InputGetter.js";
import { l } from "../../../jshelpers/functions.js";
import { getNeighbors, getNeighbor } from "../../../jshelpers/GridFuncs.js";

const lines = await getInput(import.meta.url);
const xmas = 'XMAS';

l(doWordSearch(lines, xmas));

function doWordSearch(grid, target) {
    let targetCount = 0;
    let xCount = 0;

    for (const [y, line] of grid.entries()) {
        for (const [x, char] of line.split("").entries()) {
            // part 1
            if (char === target[0]) {
                targetCount += findMatch(grid, target, x, y);
            }

            // part 2
            if (char === 'A' && findX(grid, x, y)) xCount += 1;
        }
    }

    return [targetCount, xCount];
}

function findX(grid, x, y) {
    const { ur, dr, dl, ul } = getNeighbors(grid, x, y, false);
    if (!ur || !dr || !dl || !ul) return false;

    const rightDiag = (ur.val === 'M' && dl.val === 'S') || (ur.val === 'S' && dl.val === 'M');
    const leftDiag = (ul.val === 'M' && dr.val === 'S') || (ul.val === 'S' && dr.val === 'M');

    return rightDiag && leftDiag;
}

function findMatch(grid, target, x, y) {
    const neighbors = getNeighbors(grid, x, y, false);
    let matches = 0;

    for (const [key, value] of Object.entries(neighbors)) {
        if (!value) continue;

        if (value.val === target[1] && lookInDirection(grid, value.x, value.y, key, target, 2)) {
            matches++;
        }
    }

    return matches;
}

function lookInDirection(grid, x, y, direction, target, targetInd) {
    if (targetInd === target.length) return true;

    const next = getNeighbor(grid, x, y, direction);
    if (!next || next.val !== target[targetInd]) return false;

    return lookInDirection(grid, next.x, next.y, direction, target, targetInd + 1);
}
