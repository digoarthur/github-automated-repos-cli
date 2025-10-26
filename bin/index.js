#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const framework = args[0] || "next";

if (!["next", "react", "vite"].includes(framework)) {
  console.log("Uso: npx github-automated-repos-example [next|react|vite]");
  process.exit(1);
}

console.log(`🚀 Gerando exemplo para ${framework}...`);

let sourceDir;
let targetDir;

switch (framework) {
  case "next":
    sourceDir = path.join(__dirname, "../example/Project.tsx");
    targetDir = path.join(process.cwd(), "src/app/projects/page.tsx");
    break;
  case "react":
    sourceDir = path.join(__dirname, "../example/Project.tsx");
    targetDir = path.join(process.cwd(), "src/components/Project.tsx");
    break;
  case "vite":
    sourceDir = path.join(__dirname, "../example/Project.tsx");
    targetDir = path.join(process.cwd(), "src/components/Project.tsx");
    break;
}

fs.mkdirSync(path.dirname(targetDir), { recursive: true });

fs.copyFileSync(sourceDir, targetDir);
console.log(`✅ Exemplo criado em: ${targetDir}`);
console.log("💡 Agora você pode acessar a página no seu projeto Next.js em /projects");
