import inquirer from "inquirer";
/**
 * @description Prompts the user for GitHub username and keyword unless they were provided via CLI flags.
 * @param {{ username?: string, keyword?: string }} opts - Optional values passed through CLI flags.
 * @returns {Promise<{ username: string, keyword: string }>} The resolved username and keyword.
 */
export default async function askForUserAndKeyword(opts = {}) {
  const questions = [];

  if (!opts.username) {
    questions.push({
      type: "input",
      name: "username",
      message: "GitHub username:",
      validate: (value) =>
        value.trim() ? true : "The username cannot be empty.",
    });
  }

  if (!opts.keyword) {
    questions.push({
      type: "input",
      name: "keyword",
      message: "Keyword to filter (e.g. 'attached'):",
      validate: (value) =>
        value.trim() ? true : "The keyword cannot be empty.",
    });
  }

  if (questions.length === 0) {
    return {
      username: opts.username,
      keyword: opts.keyword,
    };
  }

  const answers = await inquirer.prompt(questions);

  return {
    username: opts.username || answers.username,
    keyword: opts.keyword || answers.keyword,
  };
}
