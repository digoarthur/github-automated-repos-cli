import fs from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
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
  const projectRoot = process.cwd();
  const pkgPath = path.join(projectRoot, "package.json");
  if (!fs.existsSync(pkgPath)) throw new Error("No package.json found in project root.");

  const depName = "github-automated-repos";


  const hasDep = ensureDependencyExists(projectRoot, depName);
  if (!hasDep) {
    console.log(chalk.yellow(`${depName} not found.`));

    const pm = detectPackageManager(projectRoot);
    const installCmd = getInstallCommand(pm, depName);

    if (!opts.yes) {
      console.log(chalk.yellow(`Installing dependency: ${installCmd}`));
    }

    const ok = installDependency(projectRoot, installCmd);
    if (!ok) throw new Error("Failed to install dependency.");

    console.log(chalk.green(`${depName} installed.`));
  } else {
    console.log(chalk.green(`${depName} already installed.`));
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

  const raw = fs.readFileSync(srcExamplePath, "utf8");
  const replaced = injectPlaceholders(raw, answers);

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });

  if (fs.existsSync(targetPath)) {
    console.log(chalk.yellow(`⚠ Overwriting existing file: ${targetPath}`));
  }

  fs.writeFileSync(targetPath, replaced, "utf8");


const projectUrl = getLocalhostUrl(framework);

console.log("\n" + chalk.green("✨ Your project page is ready!"));

console.log(
  chalk.cyan(
    `Run your dev server and open:\n 🔗 ${projectUrl}\n`
  )
);

console.log(
  "\n" +
  chalk.yellow("💡 Don't forget:\n") +
  chalk.yellow("• Access your GitHub profile → ") +
  chalk.red( `🐙 https://github.com/${answers.username}\n`) +
  chalk.yellow("• Open the repository you want to display\n") +
  chalk.yellow("• Go to: ") +
  chalk.red("Settings → Topics") +
  chalk.yellow("\n") +
  chalk.yellow("• Add your chosen keyword, 🔑 ") +
  chalk.red(answers.keyword) +
  chalk.yellow(", so the project appears on your page!\n")
);
}

export default { run };
