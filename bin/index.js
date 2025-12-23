#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import initCommand from "../commands/init.js";

const program = new Command();

program
  .name("github-automated-repos-cli")
  .description("CLI oficial do github-automated-repos (only init)")
  .version("1.0.0");

program
  .command("init")
  .description("Initialize the project: ensure dependency, install if needed and add example page/component")
  .option("-y, --yes", "auto-confirm prompts (non-interactive)")
  .action((opts) => {
    initCommand
      .run(opts)
      .then(() => {
        console.log(chalk.green("Init finished successfully."));
      })
      .catch((err) => {
        console.error(chalk.red("Init failed:"), err.message || err);
        process.exit(1);
      });
  });

program.parse(process.argv);
