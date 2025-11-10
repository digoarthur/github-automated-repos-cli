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
// Comando: INIT
// ----------------------
program
  .command("init")
  .description("Inicializa a configuração do github-automated-repos no projeto")
  .action(() => {
    console.log(chalk.blueBright("⚙️  Iniciando configuração do github-automated-repos..."));

    try {
      const pkgPath = path.join(process.cwd(), "package.json");
      if (!fs.existsSync(pkgPath)) {
        console.log(chalk.red("❌ Nenhum package.json encontrado. Execute dentro de um projeto Node/React."));
        process.exit(1);
      }

      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

      // Adiciona dependência se não existir
      if (!pkg.dependencies?.["github-automated-repos"]) {
        console.log(chalk.yellow("📦 Instalando dependência 'github-automated-repos'..."));
        execSync("npm install github-automated-repos", { stdio: "inherit" });
      }



      console.log(chalk.green("🎉 github-automated-repos configurado com sucesso!"));
    } catch (error) {
      console.error(chalk.red("❌ Erro durante o init:"), error.message);
    }
  });

// ----------------------
// Comando: ADD
// ----------------------
program
  .command("add <template>")
  .description("Adiciona um template (ex: react-project, next-project, vite-project)")
  .action((template) => {
    console.log(chalk.blueBright(`🚀 Gerando exemplo para ${template}...`));

    let sourceDir;
    let targetDir;

    switch (template) {
      case "next-project":
        sourceDir = path.join(__dirname, "../example/Project.tsx");
        targetDir = path.join(process.cwd(), "src/app/projects/page.tsx");
        break;
      case "react-project":
      case "vite-project":
        sourceDir = path.join(__dirname, "../example/Project.tsx");
        targetDir = path.join(process.cwd(), "src/components/Project.tsx");
        break;
      default:
        console.log(chalk.red("❌ Template inválido. Use: react-project, next-project ou vite-project"));
        process.exit(1);
    }

    fs.mkdirSync(path.dirname(targetDir), { recursive: true });
    fs.copyFileSync(sourceDir, targetDir);

    console.log(chalk.green(`✅ Exemplo criado em: ${targetDir}`));
    console.log(chalk.yellow("💡 Agora você pode personalizar o componente conforme seu projeto!"));
  });

program.parse(process.argv);
