/**
 * @description Returns the correct install command based on the detected package manager.
 * @param {"npm" | "yarn" | "pnpm" | string} packageManager - The package manager detected in the user's project.
 * @param {string} packageName - The dependency name that should be installed.
 * @returns {string} The full command that should be executed to install the dependency.
 */
export default function getInstallCommand(packageManager, packageName) {
  switch (packageManager) {
    case "pnpm":
      return `pnpm add ${packageName}`;
    case "yarn":
      return `yarn add ${packageName}`;
    default:
      return `npm install ${packageName} --save`;
  }
}
