import { execSync } from "child_process";

try {
  const branch = execSync("git branch --show-current", {
    stdio: ["pipe", "pipe", "ignore"],
  })
    .toString()
    .trim();

  if (branch !== "main") {
    console.error("");
    console.error("❌ NPM PUBLISH BLOCKED");
    console.error("--------------------------------");
    console.error("You are not allowed to publish from this branch.");
    console.error("");
    console.error(`Current branch: ${branch}`);
    console.error("Allowed branch: main");
    console.error("");
    process.exit(1);
  }

  console.log("✅ Branch validation passed. Publishing from main.");
} catch (error) {
  console.error("❌ Failed to detect git branch.");
  process.exit(1);
}
