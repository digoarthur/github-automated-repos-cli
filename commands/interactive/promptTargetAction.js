// src/cli/interactive/promptTargetAction.js
import chalk from "chalk";
import prompts from "prompts";

export default async function promptTargetAction(targetPath, spinner, opts = {}) {
  if (spinner?.stop) spinner.stop();

  if (opts.yes) {
    console.log(chalk.yellow(`--yes detected: will overwrite ${targetPath}\n`));
    return { action: "overwrite" };
  }

  const { action } = await prompts({
    type: "select",
    name: "action",
    message: `Target file already exists:\n${targetPath}\nWhat would you like to do?`,
    choices: [
      { title: "Overwrite", value: "overwrite" },
      { title: "Create a new file", value: "create_new" },
      { title: "Cancel", value: "cancel" }
    ]
  });

  if (!action || action === "cancel") {
    console.log(chalk.yellow("\nOperation cancelled.\n"));
    return { action: "cancel" };
  }

  return { action };
}
