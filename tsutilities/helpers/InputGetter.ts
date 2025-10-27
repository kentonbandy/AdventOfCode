import fs from 'node:fs';
import axios from 'axios';
import { aocCookie } from '@/tsutilities/muhcookie.js';
import { l, e } from '@/tsutilities/helpers/ShorthandFunctions.js';

export async function getInput(filepath: string, filterEmptyLines: boolean = true): Promise<string[]> {
  const filepatharr = filepath.split('/');
    const len = filepatharr.length;
    const day = Number.parseInt(filepatharr[len - 1].split('.')[0]);
    const year = filepatharr[len -4];
    const pathday = day > 9 ? `${day}` : `0${day}`;
    const directoryPath = `./${year}/ts/inputs`;
    const relativePath = `${directoryPath}/${pathday}.txt`;
  
    // try to read file
    l(`Attempting to read input file for ${year} day ${day}...`);
    try {
      const data = fs.readFileSync(relativePath, { encoding: 'utf8' });
      l("Input file found.");
      return formatData(data, filterEmptyLines);
    } catch {
      l("Input file not found. Attempting to download...");
    }
  
    // if no file, get data from aoc
    const data = await downloadData(day, year);
    if (!data) throw new Error("Could not fetch data.");
  
    // if folder doesn't exist, create it
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
  
    // create file and write data
    writeFile(relativePath, data);
    l("Input downloaded and saved to file.");
    return formatData(data, filterEmptyLines);
}

function writeFile(inputfilepath: string, data: string): void {
  fs.writeFile(inputfilepath, data, () => null);
}

async function downloadData(day: number, year: string): Promise<string | null> {
  const url = `https://adventofcode.com/${year}/day/${day}/input`;
  const headers = { Cookie: `session=${aocCookie}` };
  let response;

  try {
    response = await axios.get(url, { headers });
  } catch {
    e("Error downloading input data. Check your cookie.");
    return null;
  }

  return response.data.toString();
}

function formatData(data: string, filterEmptyLines: boolean = true): string[] {
  const lines = data.split("\n");
  return filterEmptyLines ? lines.filter(x => x !== "") : lines;
}
