import fs from 'fs';
import axios from 'axios';
import { aocCookie } from './muhcookie.js'

export async function getInput(filepath, filterEmptyLines = true) {
  const filepatharr = filepath.split('/');
  const len = filepatharr.length;
  const day = parseInt(filepatharr[len - 1].split('.')[0]);
  const year = filepatharr[len -4];
  const pathday = day > 9 ? `${day}` : `0${day}`;
  const relativePath = `./${year}/js/inputs/${pathday}.txt`;

  // try to read file
  console.log(`Attempting to read input file for ${year} day ${day}...`);
  try {
    const data = fs.readFileSync(relativePath, { encoding: 'utf8' });
    console.log("Input file found.");
    return formatData(data, filterEmptyLines);
  } catch {
    console.log("Input file not found. Attempting to download...");
  }

  // if no file, get data from aoc
  const data = await downloadData(day, year);
  if (!data) throw new Error("Could not fetch data.");

  // if folder doesn't exist, create it
  if (!fs.existsSync(`./${year}/js/inputs`)) {
    fs.mkdirSync(`./${year}/js/inputs`, { recursive: true });
  }

  // create file and write data
  writeFile(relativePath, data);
  console.log("Input file downloaded and saved.");
  return formatData(data, filterEmptyLines);
}

function writeFile(inputfilepath, data) {
  fs.writeFile(inputfilepath, data, () => null);
}

async function downloadData(day, year) {
  const url = `https://adventofcode.com/${year}/day/${day}/input`;
  const headers = { Cookie: `session=${aocCookie}` };
  let response;

  try {
    response = await axios.get(url, { headers });
  } catch {
    console.error("Error downloading input data. Check your cookie.");
    return;
  }

  return response.data;
}

function formatData(data, filterEmptyLines = true) {
  const lines = data.split("\n");
  return filterEmptyLines ? lines.filter(x => x !== "") : lines;
}
