// commands/init.js
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; 
import {
  detectPackageManager,
  ensureDependencyExists,
  getInstallCommand,
  installDependency
} from "../utils/pkgManager/index.js";

async function run(opts = {}) {
  const projectRoot = process.cwd();
  const pkgPath = path.join(projectRoot, "package.json");

  if (!fs.existsSync(pkgPath)) {
    throw new Error("No package.json found in project root. Run inside your project.");
  }

  const depName = "github-automated-repos";

  // --- CHECK DEPENDENCY ---
  const hasDep = ensureDependencyExists(projectRoot, depName);

  if (hasDep) {
    console.log(chalk.green(`✔ ${depName} already installed.`));
  } else {
    console.log(chalk.yellow(`⚠ ${depName} not found. Preparing to install...`));

    const pkgManager = detectPackageManager(projectRoot);
    const installCmd = getInstallCommand(pkgManager, depName);

    if (!opts.yes) {
      process.stdout.write(chalk.yellow(`Run install command? ${installCmd}  (Y/n): `));
      const answer = fs.readFileSync(0, "utf8").trim().toLowerCase();

      if (answer === "n" || answer === "no") {
        throw new Error("User aborted installation.");
      }
    }

    const ok = installDependency(projectRoot, installCmd);
    if (!ok) throw new Error("Installation failed. Install manually and re-run init.");

    const confirm = ensureDependencyExists(projectRoot, depName);
    if (!confirm) throw new Error("Dependency still missing after install.");

    console.log(chalk.green(`✔ ${depName} installed and confirmed.`));
  }

  // --- COPY EXAMPLE BASED ON FRAMEWORK ---
const examplesRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../example");

  const appDir = path.join(projectRoot, "app");
  const pagesDir = path.join(projectRoot, "pages");

  let srcExample;
  let targetPath;

  // Next.js App Router
  if (fs.existsSync(appDir)) {
    srcExample = path.join(examplesRoot, "Project.next.tsx");
    targetPath = path.join(appDir, "projects", "page.tsx");
    console.log(chalk.gray("Detected Next.js (app/)"));
  }
  // Next.js Pages Router
  else if (fs.existsSync(pagesDir)) {
    srcExample = path.join(examplesRoot, "Project.next.tsx");
    targetPath = path.join(pagesDir, "projects", "index.tsx");
    console.log(chalk.gray("Detected Next.js (pages/)"));
  }
  // Vite
  else if (
    fs.existsSync(path.join(projectRoot, "vite.config.js")) ||
    fs.existsSync(path.join(projectRoot, "vite.config.ts"))
  ) {
    srcExample = path.join(examplesRoot, "Project.vite.tsx");
    targetPath = path.join(projectRoot, "src", "components", "Project.tsx");
    console.log(chalk.gray("Detected Vite project"));
  }
  // React fallback
  else {
    srcExample = path.join(examplesRoot, "Project.react.tsx");
    targetPath = path.join(projectRoot, "src", "components", "Project.tsx");
    console.log(chalk.gray("Fallback: React project"));
  }

  // ensure folder
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });

  // copy file
  if (fs.existsSync(targetPath)) {
    console.log(chalk.yellow(`${targetPath} already exists — skipping creation.`));
  } else {
    if (!fs.existsSync(srcExample)) {
      throw new Error(`Example file missing: ${srcExample}`);
    }

    fs.copyFileSync(srcExample, targetPath);
    console.log(chalk.green(`✅ Example created at: ${targetPath}`));
  }

  console.log(chalk.cyan("Init completed — start your dev server and open /projects"));
}

export default { run };
