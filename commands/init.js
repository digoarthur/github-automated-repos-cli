// src/cli/init.js
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import ora from "ora";
import prompts from "prompts";

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


function getUniqueNewProjectPath(filePath) {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath); 
  const base = path.basename(filePath, ext); 

  let newName = `New${base}${ext}`; 
  let candidate = path.join(dir, newName);


  let counter = 1;
  while (fs.existsSync(candidate)) {
    newName = `New${base}${counter}${ext}`;
    candidate = path.join(dir, newName);
    counter++;
  }

  return candidate;
}


async function run(opts = {}) {
  const spinner = ora();

  try {
    const projectRoot = process.cwd();
    const pkgPath = path.join(projectRoot, "package.json");

    if (!fs.existsSync(pkgPath)) {
      throw new Error("No package.json found in the project root.");
    }

    const depName = "github-automated-repos";

    // -----------------------------------------------------------
    // CHECK / INSTALL DEPENDENCY
    // -----------------------------------------------------------
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
      const ok = installDependency(projectRoot, installCmd); // synchronous in your setup

      if (!ok) {
        spinner.fail("Failed to install dependency.");
        throw new Error("Failed to install dependency.");
      }

      spinner.succeed(`${depName} installed successfully.`);
    } else {
      spinner.succeed(`${depName} is already installed.`);
    }

    // -----------------------------------------------------------
    // DETECT FRAMEWORK & COMPUTE PATHS
    // -----------------------------------------------------------
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

    // -----------------------------------------------------------
    // CHECK TARGET FILE EXISTS AND ASK BEFORE OVERWRITING
    // (Do this BEFORE reading templates or doing any heavy work)
    // Options: Overwrite / Create new file (.new) / Cancel
    // -----------------------------------------------------------
    if (fs.existsSync(targetPath)) {

      spinner.stop();

      if (opts.yes) {
   
        console.log(chalk.yellow(`--yes detected: will overwrite existing file: ${targetPath}\n`));
      } else {
        const response = await prompts({
          type: "select",
          name: "action",
          message: `Target file already exists:\n${targetPath}\nWhat would you like to do?`,
          choices: [
            { title: "Overwrite", value: "overwrite" },
            { title: "Create a new file (keep existing)", value: "create_new" },
            { title: "Cancel", value: "cancel" }
          ],
          initial: 0
        });

        if (!response.action || response.action === "cancel") {
          console.log(chalk.yellow("\nOperation cancelled. The existing file was kept.\n"));
          return; // exit early, do not proceed
        }

        if (response.action === "create_new") {
         const newPath = getUniqueNewProjectPath(targetPath);
          console.log(chalk.yellow(`\nWill create a new file instead: ${newPath}\n`));
       
          targetPath = newPath;
        } else {
    
          console.log(chalk.yellow("\nOverwriting existing file as requested...\n"));
        }
      }


    }

    // -----------------------------------------------------------
    // ASK FOR GITHUB USERNAME & KEYWORD (after overwrite decision)
    // -----------------------------------------------------------
    const answers = await askForUserAndKeyword(opts);

    // -----------------------------------------------------------
    // READ TEMPLATE
    // -----------------------------------------------------------
    spinner.start("Preparing your projects page template...");
    const raw = fs.readFileSync(srcExamplePath, "utf8");
    spinner.succeed("Template ready!");

    // -----------------------------------------------------------
    // INJECT PLACEHOLDERS
    // -----------------------------------------------------------
    spinner.start("Injecting GitHub username and keyword into the template...");
    const replaced = injectPlaceholders(raw, answers);
    spinner.succeed("Template updated with your GitHub data.");

    // -----------------------------------------------------------
    // CREATE TARGET DIRECTORY
    // -----------------------------------------------------------
    spinner.start("Creating the target directory...");
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    spinner.succeed("Target directory ready.");

    // -----------------------------------------------------------
    // WRITE FILE
    // -----------------------------------------------------------
    spinner.start("Generating the projects page template file in the directory...");
    fs.writeFileSync(targetPath, replaced, "utf8");
    spinner.succeed(chalk.green(`Template file created at: ${targetPath}`));

    // -----------------------------------------------------------
    // FINAL MESSAGE
    // -----------------------------------------------------------
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
