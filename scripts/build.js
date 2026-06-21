const { copyFileSync, mkdirSync, rmSync, readdirSync, statSync, readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { createHash } = require('node:crypto');

const root = process.cwd();
const dist = join(root, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

copyFileSync(join(root, 'styles.css'), join(dist, 'styles.css'));

function copyDir(from, to) {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from)) {
    const source = join(from, entry);
    const target = join(to, entry);
    if (statSync(source).isDirectory()) copyDir(source, target);
    else copyFileSync(source, target);
  }
}

copyDir(join(root, 'src'), join(dist, 'src'));

// Cache-busting: derive a version from the assets that affect behaviour, then
// stamp it onto every reference in index.html. GitHub Pages serves JS/CSS with
// long-lived caching, so without a changing URL mobile browsers (especially
// Chrome for Android via bfcache) keep executing the previously cached app.js.
// A content hash guarantees every deploy ships a fresh URL.
const assets = ['styles.css', 'src/heraldry.js', 'src/app.js'];
const hash = createHash('sha256');
for (const asset of assets) hash.update(readFileSync(join(root, asset)));
const version = hash.digest('hex').slice(0, 8);

let html = readFileSync(join(root, 'index.html'), 'utf8');
for (const asset of assets) {
  html = html.replace(`"${asset}"`, `"${asset}?v=${version}"`);
}
writeFileSync(join(dist, 'index.html'), html);

console.log(`Built static site into dist/ (asset version ${version})`);
