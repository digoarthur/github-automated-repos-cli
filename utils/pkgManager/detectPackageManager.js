import fs from "fs";
import path from "path";

/**
 * @description Detects which package manager is being used in the project (pnpm, yarn, or npm).
 * @param {string} projectRoot - Absolute path of the project root.
 * @returns {"pnpm" | "yarn" | "npm"} The detected package manager.
 */
export default function detectPackageManager(projectRoot) {
  if (fs.existsSync(path.join(projectRoot, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(projectRoot, "yarn.lock"))) return "yarn";
  return "npm";
}
