import { execSync } from "child_process";
import chalk from "chalk";

/**
 * @description Executes the install command using the detected package manager and installs the required dependency in the project.
 * @param {string} projectRoot - Absolute path of the user's project where the installation should run.
 * @param {string} installCommand - Full install command (e.g., "npm install X", "yarn add X", "pnpm add X").
 * @returns {boolean} Returns true if installation succeeded, otherwise false.
 */
export default function installDependency(projectRoot, installCommand) {
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
