
import fs from "fs";


export default function doesProjectFileExist(targetPath) {
  try {
    return fs.existsSync(targetPath);
  } catch (err) {
    
    return false;
  }
}
