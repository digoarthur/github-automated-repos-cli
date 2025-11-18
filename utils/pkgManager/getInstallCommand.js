export function getInstallCommand(packageManager, packageName) {
  switch (packageManager) {
    case "pnpm":
      return `pnpm add ${packageName}`;
    case "yarn":
      return `yarn add ${packageName}`;
    default:
      return `npm install ${packageName} --save`;
  }
}
