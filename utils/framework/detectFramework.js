import fs from "fs";
import path from "path";

/**
 * @description Detects whether the project is using Next.js (app/pages), Vite, or plain React.
 * @param {string} projectRoot - The absolute path of the project root.
 * @returns {"next-app" | "next-pages" | "vite" | "react"} The detected framework.
 */
export default function detectFramework(projectRoot) {
  const appDir = path.join(projectRoot, "app");
  const pagesDir = path.join(projectRoot, "pages");
  const isVite =
    fs.existsSync(path.join(projectRoot, "vite.config.js")) ||
    fs.existsSync(path.join(projectRoot, "vite.config.ts"));

  if (fs.existsSync(appDir)) return "next-app";
  if (fs.existsSync(pagesDir)) return "next-pages";
  if (isVite) return "vite";

  return "react"; // fallback
}
