// src/utils/projectFile/createProjectFile.js
import fs from "fs";
import path from "path";

export default function createProjectFile(targetPath, content) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, content, "utf8");
  return targetPath;
}
