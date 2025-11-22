import { execSync } from "child_process";
import chalk from "chalk";
export  default function installDependency(projectRoot, installCommand) {
  try {
    console.log(chalk.gray(`Running in ${projectRoot}:`));
    console.log(chalk.yellow(`> ${installCommand}`));
    execSync(installCommand, { stdio: "inherit", cwd: projectRoot });
    console.log(chalk.green("✔ Dependency installation finished."));
    return true;
  } catch (err) {
    console.error(chalk.red("❌ Install command failed:"), err.message);
    return false;
  }
}
