// src/cli/init.js
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import ora from "ora";

import detectFramework from "../utils/framework/detectFramework.js";
import detectPackageManager from "../utils/pkgManager/detectPackageManager.js";
import getInstallCommand from "../utils/pkgManager/getInstallCommand.js";
import installDependency from "../utils/pkgManager/installDependency.js";
import ensureDependencyExists from "../utils/pkgManager/ensureDependencyExists.js";

import getLocalhostUrl from "../utils/getLocalhostUrl.js";
import askForUserAndKeyword from "./interactive/askForUserAndKeyword.js";
import injectPlaceholders from "./interactive/injectPlaceholders.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const examplesRoot = path.join(__dirname, "..", "example");

async function run(opts = {}) {
  const spinner = ora();

  try {
    const projectRoot = process.cwd();
    const pkgPath = path.join(projectRoot, "package.json");

    if (!fs.existsSync(pkgPath)) {
      throw new Error("No package.json found in the project root.");
    }

    const depName = "github-automated-repos";

    spinner.start(`Checking dependency: ${depName}`);
    const hasDep = ensureDependencyExists(projectRoot, depName);

    if (!hasDep) {
      spinner.info(`${depName} not found.`);
      const pm = detectPackageManager(projectRoot);
      const installCmd = getInstallCommand(pm, depName);

      if (!opts.yes) {
        spinner.info(`Install required: ${installCmd}`);
      }

      spinner.start(`Installing ${depName} using ${pm}...`);

  
      const ok = installDependency(projectRoot, installCmd);

      if (!ok) {
        spinner.fail("Failed to install dependency.");
        throw new Error("Failed to install dependency.");
      }

      spinner.succeed(`${depName} installed successfully.`);
    } else {
      spinner.succeed(`${depName} is already installed.`);
    }


    const answers = await askForUserAndKeyword(opts);

    const framework = detectFramework(projectRoot);


    let srcExamplePath;
    let targetPath;

    switch (framework) {
      case "next-app":
        srcExamplePath = path.join(examplesRoot, "Project.next.tsx");
        targetPath = path.join(projectRoot, "app", "projects", "page.tsx");
        break;

      case "next-pages":
        srcExamplePath = path.join(examplesRoot, "Project.next.tsx");
        targetPath = path.join(projectRoot, "pages", "projects", "index.tsx");
        break;

      case "vite":
        srcExamplePath = path.join(examplesRoot, "Project.vite.tsx");
        targetPath = path.join(projectRoot, "src", "components", "Project.tsx");
        break;

      default:
        srcExamplePath = path.join(examplesRoot, "Project.react.tsx");
        targetPath = path.join(projectRoot, "src", "components", "Project.tsx");
    }

    spinner.start("Preparing your projects page template...");
    const raw = fs.readFileSync(srcExamplePath, "utf8");
    spinner.succeed("Template ready!");

    spinner.start("Injecting GitHub username and keyword into the template...");
    const replaced = injectPlaceholders(raw, answers);
    spinner.succeed("Template updated with your GitHub data.");


    spinner.start("Setting up project directory...");
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    spinner.succeed("Project directory ready.");


    if (fs.existsSync(targetPath)) {
      console.log(chalk.yellow(`⚠ Overwriting existing file: ${targetPath}`));
    }

    spinner.start("Generating the projects page template file in the directory...");
    fs.writeFileSync(targetPath, replaced, "utf8");
    spinner.succeed(chalk.green(`Template file created at: ${targetPath}`));



    const projectUrl = getLocalhostUrl(framework);

    console.log("\n" + chalk.green("✨ Your project page is ready!"));
    console.log(chalk.cyan(`Start your dev server and open:\n 🔗 ${projectUrl}\n`));

    console.log(
      chalk.yellow("💡 Final steps:\n") +
      chalk.yellow("• Open your GitHub profile → ") +
      chalk.red(`https://github.com/${answers.username}\n`) +
      chalk.yellow("• Open the repository you want to display\n") +
      chalk.yellow("• Go to: ") +
      chalk.red("Settings → Topics") +
      chalk.yellow("\n") +
      chalk.yellow("• Add the keyword: ") +
      chalk.red(answers.keyword) +
      chalk.yellow("\n")
    );

  } catch (err) {
    spinner.fail("Error during execution.");
    console.error(chalk.red("❌ Error:"), err.message || err);
    process.exitCode = 1;
  } finally {
    spinner.stop();
  }
}

export default { run };
