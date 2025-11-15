#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const program = new Command();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
  .name("github-automated-repos-cli")
  .description("CLI oficial do github-automated-repos para gerar exemplos e automações")
  .version("1.0.0");

// ----------------------
// Helpers
// ----------------------
function detectPackageManager(projectRoot) {
  if (fs.existsSync(path.join(projectRoot, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(projectRoot, "yarn.lock"))) return "yarn";
  return "npm";
}

function installDependency(projectRoot, packageName) {
  const pkgManager = detectPackageManager(projectRoot);
  let cmd;
  switch (pkgManager) {
    case "pnpm":
      cmd = `pnpm add ${packageName}`;
      break;
    case "yarn":
      cmd = `yarn add ${packageName}`;
      break;
    default:
      cmd = `npm install ${packageName} --save`;
      break;
  }

  console.log(chalk.gray(`Detected package manager: ${pkgManager}`));
  console.log(chalk.yellow(`Installing ${packageName} using: ${cmd}`));
  execSync(cmd, { stdio: "inherit", cwd: projectRoot });
}

function ensureDependencyExists(projectRoot, packageName) {
  const pkgPath = path.join(projectRoot, "package.json");
  if (!fs.existsSync(pkgPath)) {
    console.log(chalk.red("❌ package.json not found in project root. Can't auto-install dependencies."));
    return false;
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const hasDep =
    (pkg.dependencies && pkg.dependencies[packageName]) ||
    (pkg.devDependencies && pkg.devDependencies[packageName]);
  if (hasDep) return true;

  try {
    installDependency(projectRoot, packageName);
    const updatedPkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const nowHas =
      (updatedPkg.dependencies && updatedPkg.dependencies[packageName]) ||
      (updatedPkg.devDependencies && updatedPkg.devDependencies[packageName]);
    if (nowHas) {
      console.log(chalk.green(`✅ ${packageName} installed successfully.`));
      return true;
    } else {
      console.log(chalk.red(`❌ ${packageName} not found after install.`));
      return false;
    }
  } catch (err) {
    console.log(chalk.red(`❌ Automatic install failed: ${err.message}`));
    return false;
  }
}

function copyFolderIfExists(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return 0;
  fs.mkdirSync(destDir, { recursive: true });
  const files = fs.readdirSync(srcDir);
  let copied = 0;
  for (const f of files) {
    const src = path.join(srcDir, f);
    const dst = path.join(destDir, f);
    if (fs.statSync(src).isDirectory()) {
      copied += copyFolderIfExists(src, dst);
      continue;
    }
    if (!fs.existsSync(dst)) {
      fs.copyFileSync(src, dst);
      copied++;
    }
  }
  return copied;
}

// ----------------------
// INIT command
// ----------------------
program
  .command("init")
  .description("Inicializa a configuração do github-automated-repos no projeto")
  .action(() => {
    console.log(chalk.blueBright("⚙️  Iniciando configuração do github-automated-repos..."));

    try {
      const pkgPath = path.join(process.cwd(), "package.json");
      if (!fs.existsSync(pkgPath)) {
        console.log(chalk.red("❌ Nenhum package.json encontrado. Execute dentro de um projeto válido."));
        process.exit(1);
      }

      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

      if (!pkg.dependencies?.["github-automated-repos"] && !pkg.devDependencies?.["github-automated-repos"]) {
        try {
          ensureDependencyExists(process.cwd(), "github-automated-repos");
        } catch (err) {
          console.log(chalk.red("❌ Não foi possível instalar a dependência automaticamente."));
        }
      } else {
        console.log(chalk.green("✔ 'github-automated-repos' já está presente nas dependências."));
      }

      console.log(chalk.green("🎉 github-automated-repos configurado com sucesso!"));
    } catch (error) {
      console.error(chalk.red("❌ Erro durante o init:"), error.message);
    }
  });

// ----------------------
// ADD command
// ----------------------
program
  .command("add <template>")
  .description("Adiciona um template (ex: react-project, next-project, vite-project)")
  .action((template) => {
    console.log(chalk.blueBright(`🚀 Generating example for ${template}...`));

    try {
      const examplesRoot = path.join(__dirname, "../example");

      switch (template) {
        // NEXT (uses Project.next.tsx if present)
        case "next-project": {
          const exampleNext = path.join(examplesRoot, "Project.next.tsx");
          const examplePublic = path.join(examplesRoot, "next", "public"); // optional folder for public assets
          const fallbackGeneric = path.join(examplesRoot, "Project.tsx");

          const projectRoot = process.cwd();
          const appDir = path.join(projectRoot, "app");
          const pagesDir = path.join(projectRoot, "pages");

          // Ensure runtime dependency before copying the page
          const depOk = ensureDependencyExists(projectRoot, "github-automated-repos");
          if (!depOk) {
            const pm = detectPackageManager(projectRoot);
            console.log(chalk.red("❗ The project is missing 'github-automated-repos'."));
            console.log(chalk.yellow(`Please run manually: ${pm === "yarn" ? "yarn add github-automated-repos" : pm === "pnpm" ? "pnpm add github-automated-repos" : "npm install github-automated-repos --save"}`));
            console.log(chalk.red("Aborting add — dependency missing."));
            process.exit(1);
          }

          let targetPagePath;
          if (fs.existsSync(appDir)) {
            targetPagePath = path.join(appDir, "projects", "page.tsx");
            console.log(chalk.gray("Detected Next.js App Router (app/)"));
          } else if (fs.existsSync(pagesDir)) {
            targetPagePath = path.join(pagesDir, "projects", "index.tsx");
            console.log(chalk.gray("Detected Next.js Pages Router (pages/)"));
          } else {
            targetPagePath = path.join(projectRoot, "app", "projects", "page.tsx");
            console.log(chalk.yellow("No app/ or pages/ found — creating app/projects/page.tsx by default."));
          }

          fs.mkdirSync(path.dirname(targetPagePath), { recursive: true });

          if (fs.existsSync(targetPagePath)) {
            console.log(chalk.yellow(`⚠️  ${targetPagePath} already exists — skipping overwrite.`));
          } else {
            const srcPage = fs.existsSync(exampleNext) ? exampleNext : fallbackGeneric;
            if (!fs.existsSync(srcPage)) {
              console.log(chalk.red("❌ No example page found in CLI. Add example/Project.next.tsx or example/Project.tsx to the CLI repo."));
              process.exit(1);
            }
            fs.copyFileSync(srcPage, targetPagePath);
            console.log(chalk.green(`✅ Example page created at: ${targetPagePath}`));
            console.log(chalk.cyan("Open http://localhost:3000/projects to view it (run your dev server)."));
          }

          // copy public assets if folder exists (example/next/public/* => project/public/github-automated-repos/*)
          if (fs.existsSync(examplePublic)) {
            const destPublic = path.join(projectRoot, "public", "github-automated-repos");
            const count = copyFolderIfExists(examplePublic, destPublic);
            if (count > 0) console.log(chalk.green(`📁 ${count} file(s) copied to /public/github-automated-repos/`));
          }

          break;
        }

        // VITE (uses Project.vite.tsx if present)
        case "vite-project": {
          const exampleVite = path.join(examplesRoot, "Project.vite.tsx");
          const fallbackGeneric = path.join(examplesRoot, "Project.tsx");
          const srcPage = fs.existsSync(exampleVite) ? exampleVite : fallbackGeneric;
          const targetDir = path.join(process.cwd(), "src", "components", "Project.tsx");

          // Ensure dependency
          const depOk2 = ensureDependencyExists(process.cwd(), "github-automated-repos");
          if (!depOk2) {
            const pm2 = detectPackageManager(process.cwd());
            console.log(chalk.red("❗ The project is missing 'github-automated-repos'."));
            console.log(chalk.yellow(`Please run manually: ${pm2 === "yarn" ? "yarn add github-automated-repos" : pm2 === "pnpm" ? "pnpm add github-automated-repos" : "npm install github-automated-repos --save"}`));
            process.exit(1);
          }

          fs.mkdirSync(path.dirname(targetDir), { recursive: true });
          if (fs.existsSync(targetDir)) {
            console.log(chalk.yellow(`⚠️  ${targetDir} already exists — skipping overwrite.`));
          } else {
            if (!fs.existsSync(srcPage)) {
              console.log(chalk.red("❌ No example component found for Vite. Add example/Project.vite.tsx or example/Project.tsx to the CLI repo."));
              process.exit(1);
            }
            fs.copyFileSync(srcPage, targetDir);
            console.log(chalk.green(`✅ Example created at: ${targetDir}`));
          }
          break;
        }

        // REACT (uses Project.react.tsx or fallback)
        case "react-project": {
          const exampleReact = path.join(examplesRoot, "Project.react.tsx");
          const fallbackGeneric = path.join(examplesRoot, "Project.tsx");
          const srcPage = fs.existsSync(exampleReact) ? exampleReact : fallbackGeneric;
          const targetDir = path.join(process.cwd(), "src", "components", "Project.tsx");

          const depOk3 = ensureDependencyExists(process.cwd(), "github-automated-repos");
          if (!depOk3) {
            const pm3 = detectPackageManager(process.cwd());
            console.log(chalk.red("❗ The project is missing 'github-automated-repos'."));
            console.log(chalk.yellow(`Please run manually: ${pm3 === "yarn" ? "yarn add github-automated-repos" : pm3 === "pnpm" ? "pnpm add github-automated-repos" : "npm install github-automated-repos --save"}`));
            process.exit(1);
          }

          fs.mkdirSync(path.dirname(targetDir), { recursive: true });
          if (fs.existsSync(targetDir)) {
            console.log(chalk.yellow(`⚠️  ${targetDir} already exists — skipping overwrite.`));
          } else {
            if (!fs.existsSync(srcPage)) {
              console.log(chalk.red("❌ No example component found for React. Add example/Project.react.tsx or example/Project.tsx to the CLI repo."));
              process.exit(1);
            }
            fs.copyFileSync(srcPage, targetDir);
            console.log(chalk.green(`✅ Example created at: ${targetDir}`));
          }
          break;
        }

        default:
          console.log(chalk.red("❌ Invalid template. Use: react-project, next-project or vite-project."));
          process.exit(1);
      }

      console.log(chalk.yellow("💡 Now customize the component for your project!"));
    } catch (err) {
      console.error(chalk.red("❌ Error while adding template:"), err.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
