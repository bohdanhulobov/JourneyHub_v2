const fs = require("fs");
const path = require("path");

const sourceDir = path.join(__dirname, "../images");
const destDir = path.join(__dirname, "../dist/images");

function copyFiles(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  fs.readdirSync(src).forEach((file) => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);

    if (fs.lstatSync(srcFile).isDirectory()) {
      copyFiles(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
      console.log(`Copied ${srcFile} to ${destFile}`);
    }
  });
}

copyFiles(sourceDir, destDir);
