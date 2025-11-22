// commands/init.js
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

  // check
  const hasDep = ensureDependencyExists(projectRoot, depName);
  if (!hasDep) {
    console.log(chalk.yellow(`${depName} not found.`));
    const pm = detectPackageManager(projectRoot);
    const installCmd = getInstallCommand(pm, depName);

    if (!opts.yes) {
      process.stdout.write(chalk.yellow(`Run install command? ${installCmd} (Y/n): `));
      const answer = fs.readFileSync(0, "utf8").trim().toLowerCase();
      if (answer === "n" || answer === "no") throw new Error("User aborted installation.");
    }

    const ok = installDependency(projectRoot, installCmd);
    if (!ok) throw new Error("Failed to install dependency.");
    console.log(chalk.green(`${depName} installed.`));
  } else {
    console.log(chalk.green(`${depName} already installed.`));
  }

  // interactive
  const answers = await askForUserAndKeyword(opts);

  // detect framework and pick example
  const appDir = path.join(projectRoot, "app");
  const pagesDir = path.join(projectRoot, "pages");
  const isVite = fs.existsSync(path.join(projectRoot, "vite.config.js")) || fs.existsSync(path.join(projectRoot, "vite.config.ts"));

  let srcExamplePath;
  let targetPath;
  if (fs.existsSync(appDir)) {
    srcExamplePath = path.join(examplesRoot, "Project.next.tsx");
    targetPath = path.join(appDir, "projects", "page.tsx");
    console.log(chalk.gray("Detected Next.js app/"));
  } else if (fs.existsSync(pagesDir)) {
    srcExamplePath = path.join(examplesRoot, "Project.next.tsx");
    targetPath = path.join(pagesDir, "projects", "index.tsx");
    console.log(chalk.gray("Detected Next.js pages/"));
  } else if (isVite) {
    srcExamplePath = path.join(examplesRoot, "Project.vite.tsx");
    targetPath = path.join(projectRoot, "src", "components", "Project.tsx");
    console.log(chalk.gray("Detected Vite"));
  } else {
    srcExamplePath = path.join(examplesRoot, "Project.react.tsx");
    targetPath = path.join(projectRoot, "src", "components", "Project.tsx");
    console.log(chalk.gray("Fallback: React"));
  }

  if (!fs.existsSync(srcExamplePath)) throw new Error(`Example file missing: ${srcExamplePath}`);

  // read, replace placeholders and write (overwrite, no .bak)
  const raw = fs.readFileSync(srcExamplePath, "utf8");
  const replaced = injectPlaceholders(raw, answers);

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });

  if (fs.existsSync(targetPath)) {
    console.log(chalk.yellow(`⚠ Overwriting existing file: ${targetPath}`));
  }

  fs.writeFileSync(targetPath, replaced, "utf8");
  console.log(chalk.green(`✅ Created: ${targetPath}`));
  console.log(chalk.cyan("Run dev server and open /projects"));
}

export default { run };
