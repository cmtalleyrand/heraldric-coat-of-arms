const { copyFileSync, mkdirSync, rmSync, readdirSync, statSync } = require('node:fs');
const { join } = require('node:path');

const root = process.cwd();
const dist = join(root, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const file of ['index.html', 'styles.css']) {
  copyFileSync(join(root, file), join(dist, file));
}

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
console.log('Built static site into dist/');
