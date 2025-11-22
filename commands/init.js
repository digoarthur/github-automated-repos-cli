import fs from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

import detectPackageManager from "../utils/pkgManager/detectPackageManager.js";
import getInstallCommand from "../utils/pkgManager/getInstallCommand.js";
import installDependency from "../utils/pkgManager/installDependency.js";
import ensureDependencyExists from "../utils/pkgManager/ensureDependencyExists.js";

import askForUserAndKeyword from "./interactive/askForUserAndKeyword.js";
import injectPlaceholders from "./interactive/injectPlaceholders.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const examplesRoot = path.join(__dirname, "..", "example");

async function run(opts = {}) {
  const projectRoot = process.cwd();
  const pkgPath = path.join(projectRoot, "package.json");
  if (!fs.existsSync(pkgPath)) throw new Error("No package.json found in project root.");

  const depName = "github-automated-repos";

  // 1) Ensure dependency exists
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

  // 2) Interactive questions (Inquirer)
  const answers = await askForUserAndKeyword(opts);

  // 3) Detect framework
  const appDir = path.join(projectRoot, "app");
  const pagesDir = path.join(projectRoot, "pages");
  const isVite =
    fs.existsSync(path.join(projectRoot, "vite.config.js")) ||
    fs.existsSync(path.join(projectRoot, "vite.config.ts"));

  let srcExamplePath;
  let targetPath;

  if (fs.existsSync(appDir)) {
    srcExamplePath = path.join(examplesRoot, "Project.next.tsx");
    targetPath = path.join(appDir, "projects", "page.tsx");
    console.log(chalk.gray("Detected Next.js App Router"));
  } else if (fs.existsSync(pagesDir)) {
    srcExamplePath = path.join(examplesRoot, "Project.next.tsx");
    targetPath = path.join(pagesDir, "projects", "index.tsx");
    console.log(chalk.gray("Detected Next.js Pages Router"));
  } else if (isVite) {
    srcExamplePath = path.join(examplesRoot, "Project.vite.tsx");
    targetPath = path.join(projectRoot, "src", "components", "Project.tsx");
    console.log(chalk.gray("Detected Vite project"));
  } else {
    srcExamplePath = path.join(examplesRoot, "Project.react.tsx");
    targetPath = path.join(projectRoot, "src", "components", "Project.tsx");
    console.log(chalk.gray("Fallback React project"));
  }

  if (!fs.existsSync(srcExamplePath)) {
    throw new Error(`Example file missing: ${srcExamplePath}`);
  }

  // 4) Write final file
  const raw = fs.readFileSync(srcExamplePath, "utf8");
  const replaced = injectPlaceholders(raw, answers);

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });

  if (fs.existsSync(targetPath)) {
    console.log(chalk.yellow(`⚠ Overwriting existing file: ${targetPath}`));
  }

  fs.writeFileSync(targetPath, replaced, "utf8");

  console.log(chalk.green(`✅ Created: ${targetPath}`));
  console.log(chalk.cyan("Run your dev server and open /projects"));
}

export default { run };
