
import fs from "fs";
import path from "path";


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
