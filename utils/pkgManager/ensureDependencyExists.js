import fs from "fs";
import path from "path";


export function ensureDependencyExists(projectRoot, packageName) {
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
