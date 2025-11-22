import inquirer from "inquirer";

export default async function askForUserAndKeyword(opts = {}) {
  const questions = [];

  if (!opts.username) {
    questions.push({
      type: "input",
      name: "username",
      message: "GitHub username:",
      validate: (value) =>
        value.trim() ? true : "O username não pode estar vazio.",
    });
  }

  if (!opts.keyword) {
    questions.push({
      type: "input",
      name: "keyword",
      message: "Keyword para filtrar (ex: attached):",
      validate: (value) =>
        value.trim() ? true : "A keyword não pode estar vazia.",
    });
  }

  // Se não há nada para perguntar (usuário já passou via flags)
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
