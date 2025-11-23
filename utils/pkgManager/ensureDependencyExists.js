import fs from "fs";
import path from "path";

/**
 * @description Checks whether a given dependency exists inside the project's package.json.
 * @param {string} projectRoot - Absolute path of the project root.
 * @param {string} packageName - Name of the dependency to verify.
 * @returns {boolean} True if the dependency is listed, otherwise false.
 */
export default function ensureDependencyExists(projectRoot, packageName) {
  const pkgPath = path.join(projectRoot, "package.json");
  if (!fs.existsSync(pkgPath)) {
    return false;
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const present =
      (pkg.dependencies && pkg.dependencies[packageName]) ||
      (pkg.devDependencies && pkg.devDependencies[packageName]);

    return Boolean(present);
  } catch (err) {
    return false;
  }
}
