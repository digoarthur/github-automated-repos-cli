// utils/interactive.js
import { stdin as input, stdout as output } from "process";
import readlinePromises from "readline/promises";

export default async function askForUserAndKeyword(opts = {}) {
  if (opts.username && opts.keyword) {
    return { username: opts.username, keyword: opts.keyword };
  }
  if (opts.yes) {
    throw new Error("Non-interactive mode (--yes) requires --username and --keyword.");
  }

  const rl = readlinePromises.createInterface({ input, output });
  const username = (await rl.question("GitHub username (owner): ")).trim();
  const keyword = (await rl.question("Keyword (topic) to filter (e.g. 'attached'): ")).trim();
  rl.close();

  if (!username) throw new Error("username is required.");
  if (!keyword) throw new Error("keyword is required.");

  return { username, keyword };
}
