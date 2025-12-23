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

import doesProjectFileExist from "../utils/projectFile/doesProjectFileExist.js";
import getUniqueNewProjectPath from "../utils/projectFile/getUniqueNewProjectPath.js";
import createProjectFile from "../utils/projectFile/createProjectFile.js";
import injectHookPlaceholders from "../utils/projectFile/injectHookPlaceholders.js";

import promptTargetAction from "./interactive/promptTargetAction.js";
import askForUserAndKeyword from "./interactive/askForUserAndKeyword.js";
import getLocalhostUrl from "../utils/getLocalhostUrl.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const examplesRoot = path.join(__dirname, "..", "pageExample");

async function run(opts = {}) {
  const spinner = ora();

  try {

    const projectRoot = process.cwd();
    const packageJsonPath = path.join(projectRoot, "package.json");

    const hasPackageJson = fs.existsSync(packageJsonPath);
    if (!hasPackageJson) {
      throw new Error("No package.json found in the project root.");
    }

 
    const dependencyName = "github-automated-repos";

    spinner.start(`Checking dependency: ${dependencyName}`);
    const dependencyExists = ensureDependencyExists(projectRoot, dependencyName);

    if (!dependencyExists) {
      const packageManager = detectPackageManager(projectRoot);
      const installCommand = getInstallCommand(packageManager, dependencyName);

      spinner.start(`Installing ${dependencyName} using ${packageManager}...`);
      const installedSuccessfully = installDependency(projectRoot, installCommand);

      if (!installedSuccessfully) {
        throw new Error("Failed to install dependency.");
      }
    }

    spinner.succeed(`${dependencyName} ready.`);

 
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


    const projectFileExists = doesProjectFileExist(targetPath);

    if (projectFileExists) {
      const targetDecision = await promptTargetAction(targetPath, spinner, opts);
      const { action } = targetDecision;

      if (action === "cancel") {
        return;
      }

      if (action === "create_new") {
        const newTargetPath = getUniqueNewProjectPath(targetPath);
        targetPath = newTargetPath;
      }
    }


    const userAnswers = await askForUserAndKeyword(opts);


    spinner.start("Preparing projects page template...");
    const templateContent = fs.readFileSync(srcExamplePath, "utf8");

    const finalContent = injectHookPlaceholders(
      templateContent,
      userAnswers
    );

    spinner.succeed("Template ready.");


    spinner.start("Creating project file...");
    const createdFilePath = createProjectFile(targetPath, finalContent);

    spinner.succeed(
      chalk.green(`File created at: ${createdFilePath}`)
    );


    const projectUrl = getLocalhostUrl(framework);

    console.log("\n" + chalk.green("✨ Your project page is ready!"));
    console.log(chalk.cyan(`🔗 ${projectUrl}\n`));

  } catch (err) {
    spinner.fail("Error during execution.");
    console.error(chalk.red("❌ Error:"), err.message || err);
    process.exitCode = 1;
  } finally {
    spinner.stop();
  }
}

export default { run };
