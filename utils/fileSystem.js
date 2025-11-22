// utils/fileSystem.js
import fs from "fs";
import path from "path";

export default function copyFolderIfExists(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return 0;

  fs.mkdirSync(destDir, { recursive: true });

  const items = fs.readdirSync(srcDir);
  let copied = 0;

  for (const item of items) {
    const src = path.join(srcDir, item);
    const dst = path.join(destDir, item);

    if (fs.statSync(src).isDirectory()) {
      copied += copyFolderIfExists(src, dst);
      continue;
    }

    // only copy if dst does not exist
    if (!fs.existsSync(dst)) {
      fs.copyFileSync(src, dst);
      copied++;
    }
  }

  return copied;
}
