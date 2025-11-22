// commands/init.js
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { stdin as input, stdout as output } from "process";
import readlinePromises from "readline/promises";

// importa utilidades reais
import {
  detectPackageManager,
  ensureDependencyExists,
  getInstallCommand,
  installDependency
} from "../utils/pkgManager/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const examplesRoot = path.join(__dirname, "..", "example");

// -----------------------
// Perguntas interativas
// -----------------------
async function askIfNeeded(opts) {
  if (opts.username && opts.keyword) {
    return { username: opts.username, keyword: opts.keyword };
  }

  if (opts.yes) {
    throw new Error("Non-interactive mode (--yes) requires --username and --keyword.");
  }

  const rl = readlinePromises.createInterface({ input, output });

  const username = (await rl.question("GitHub username: ")).trim();
  const keyword = (await rl.question("Keyword for filtering (topic): ")).trim();

  rl.close();

  if (!username) throw new Error("username is required.");
  if (!keyword) throw new Error("keyword is required.");

  return { username, keyword };
}

// -----------------------
// Substitui placeholders
// -----------------------
function injectPlaceholders(content, replacements = {}) {
  return content
    .replaceAll("__GITHUB_USERNAME__", replacements.username)
    .replaceAll("__KEYWORD__", replacements.keyword);
}

// -----------------------
// MAIN
// -----------------------
async function run(opts = {}) {
  const projectRoot = process.cwd();
  const pkgPath = path.join(projectRoot, "package.json");

  if (!fs.existsSync(pkgPath)) {
    throw new Error("No package.json found. Run inside a valid project.");
  }

  const depName = "github-automated-repos";

  // -----------------------
  // 1) Verifica dependência

  const alreadyInstalled = ensureDependencyExists(projectRoot, depName);

  if (alreadyInstalled) {
    console.log(chalk.green(`✔ ${depName} already installed.`));
  } else {
    console.log(chalk.yellow(`⚠ ${depName} not found. Preparing to install...`));

    const pkgManager = detectPackageManager(projectRoot);
    const installCmd = getInstallCommand(pkgManager, depName);

    if (!opts.yes) {
      process.stdout.write(
        chalk.yellow(`Run install command? ${installCmd} (Y/n): `)
      );

      const answer = fs.readFileSync(0, "utf8").trim().toLowerCase();
      if (answer === "n" || answer === "no") {
        throw new Error("Installation aborted by user.");
      }
    }

    const ok = installDependency(projectRoot, installCmd);
    if (!ok) throw new Error("Failed to install dependency. Install manually.");

    console.log(chalk.green(`✔ ${depName} installed successfully.`));
  }

  // -----------------------
  // 2) Perguntas interativas
  // -----------------------
  const answers = await askIfNeeded(opts);

  // -----------------------
  // 3) Detecta framework
  // -----------------------
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
    console.log(chalk.gray("Fallback: React project"));
  }

  if (!fs.existsSync(srcExamplePath)) {
    throw new Error(`Example file missing: ${srcExamplePath}`);
  }

  // -----------------------
  // 4) Cria página final
  // -----------------------
  const raw = fs.readFileSync(srcExamplePath, "utf8");
  const replaced = injectPlaceholders(raw, answers);

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });

  // se já existir, sobrescreve direto (sem .bak)
  if (fs.existsSync(targetPath)) {
    console.log(chalk.yellow(`⚠ Overwriting existing file: ${targetPath}`));
  }

  fs.writeFileSync(targetPath, replaced, "utf8");

  console.log(chalk.green(`\n✅ Page/component created at:`));
  console.log(chalk.cyan(targetPath));

  console.log(chalk.green(`\n✨ Done! Run your dev server and open /projects\n`));

}

export default { run };
