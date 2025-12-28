import { execSync } from "node:child_process";

function getCurrentBranch() {
  return execSync("git branch --show-current", { stdio: ["ignore", "pipe", "ignore"] })
    .toString()
    .trim();
}

const branch = getCurrentBranch();
const registry = process.env.npm_config_registry;

// 🔓 Allow local publishes (yalc, tests, local registry)
if (!registry || !registry.includes("registry.npmjs.org")) {
  console.log("ℹ️ Local publish detected (yalc or non-npm registry). Skipping guard.");
  process.exit(0);
}

// 🔒 Block real npm publish outside main
if (branch !== "main") {
  console.error("❌ npm publish is only allowed from the 'main' branch.");
  console.error(`Current branch: ${branch}`);
  process.exit(1);
}

console.log("✅ npm publish allowed from main branch.");