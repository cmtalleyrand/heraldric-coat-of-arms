const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');

function build() {
  execFileSync('node', ['scripts/build.js'], { cwd: root });
  return readFileSync(join(root, 'dist', 'index.html'), 'utf8');
}

test('built index.html cache-busts every behavioural asset', () => {
  const html = build();

  for (const asset of ['styles.css', 'src/heraldry.js', 'src/app.js']) {
    assert.match(html, new RegExp(`"${asset.replace('.', '\\.')}\\?v=[0-9a-f]{8}"`),
      `${asset} should carry a version query so caches refetch after a deploy`);
  }

  assert.ok(existsSync(join(root, 'dist', 'src', 'app.js')));
  assert.ok(existsSync(join(root, 'dist', 'styles.css')));
});

test('the asset version is shared and content-derived', () => {
  const html = build();
  const versions = [...html.matchAll(/\?v=([0-9a-f]{8})/g)].map(match => match[1]);

  assert.equal(versions.length, 3);
  assert.equal(new Set(versions).size, 1, 'all assets share one deploy version');

  // Rebuilding identical sources must reproduce the same version (deterministic),
  // so the URL only changes when the code actually changes.
  const second = build();
  const secondVersions = [...second.matchAll(/\?v=([0-9a-f]{8})/g)].map(match => match[1]);
  assert.equal(secondVersions[0], versions[0]);
});
