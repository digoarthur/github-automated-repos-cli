
import fs from "fs";
import path from "path";

export default function getUniqueNewProjectPath(filePath) {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);

  let candidate = path.join(dir, `New${base}${ext}`);
  let counter = 1;

  while (fs.existsSync(candidate)) {
    candidate = path.join(dir, `New${base}${counter}${ext}`);
    counter++;
  }

  return candidate;
}
