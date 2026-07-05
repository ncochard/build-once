// Stand-in for a slow, real build step (tsc, webpack, babel, ...).
// Copies every file from `src/` into `dist/`, stamping each with the time
// of the run, so you can tell whether this actually executed or was
// skipped by `build-once`.
const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "src");
const distDir = path.join(__dirname, "dist");

fs.mkdirSync(distDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter((file) => file.endsWith(".js"));
const banner = `/* built at ${new Date().toISOString()} */\n`;

for (const file of files) {
  const source = fs.readFileSync(path.join(srcDir, file), "utf8");
  fs.writeFileSync(path.join(distDir, file), banner + source);
}

console.log(`[compile.js] Compiled ${files.length} file(s) into dist/`);
