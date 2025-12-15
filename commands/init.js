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

import doesProjectFileExists from "../utils/projectFile/doesProjectFileExist.js";
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
    const pkgPath = path.join(projectRoot, "package.json");

    if (!fs.existsSync(pkgPath)) {
      throw new Error("No package.json found in the project root.");
    }

    const depName = "github-automated-repos";

    // 1️⃣ Dependency
    spinner.start(`Checking dependency: ${depName}`);
    const hasDep = ensureDependencyExists(projectRoot, depName);

    if (!hasDep) {
      const pm = detectPackageManager(projectRoot);
      spinner.start(`Installing ${depName} using ${pm}...`);
      if (!installDependency(projectRoot, getInstallCommand(pm, depName))) {
        throw new Error("Failed to install dependency.");
      }
    }
    spinner.succeed(`${depName} ready.`);

    // 2️⃣ Framework
    const framework = detectFramework(projectRoot);

    let srcExamplePath;
    let targetPath;

    switch (framework) {
      case "next-app":
        srcExamplePath = path.join(examplesRoot, "Project.next.tsx");
        targetPath = path.join(projectRoot, "app/projects/page.tsx");
        break;
      case "next-pages":
        srcExamplePath = path.join(examplesRoot, "Project.next.tsx");
        targetPath = path.join(projectRoot, "pages/projects/index.tsx");
        break;
      case "vite":
        srcExamplePath = path.join(examplesRoot, "Project.vite.tsx");
        targetPath = path.join(projectRoot, "src/components/Project.tsx");
        break;
      default:
        srcExamplePath = path.join(examplesRoot, "Project.react.tsx");
        targetPath = path.join(projectRoot, "src/components/Project.tsx");
    }

    // 3️⃣ File existence + interaction
    if (doesProjectFileExists(targetPath)) {
      const decision = await promptTargetAction(targetPath, spinner, opts);

      if (decision.action === "cancel") return;

      if (decision.action === "create_new") {
        targetPath = getUniqueNewProjectPath(targetPath);
      }
    }

    // 4️⃣ User input
    const answers = await askForUserAndKeyword(opts);

    // 5️⃣ Template + inject
    spinner.start("Preparing projects page template...");
    const raw = fs.readFileSync(srcExamplePath, "utf8");
    const content = injectHookPlaceholders(raw, answers);
    spinner.succeed("Template ready.");

    // 6️⃣ Create file
    spinner.start("Creating project file...");
    createProjectFile(targetPath, content);
    spinner.succeed(chalk.green(`File created at: ${targetPath}`));

    // 7️⃣ Final
    console.log("\n" + chalk.green("✨ Your project page is ready!"));
    console.log(chalk.cyan(`🔗 ${getLocalhostUrl(framework)}\n`));

  } catch (err) {
    spinner.fail("Error during execution.");
    console.error(chalk.red("❌ Error:"), err.message);
  } finally {
    spinner.stop();
  }
}

export default { run };
