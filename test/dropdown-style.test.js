const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

test('select menu options define their own readable colours', () => {
  const css = readFileSync('styles.css', 'utf8');

  assert.match(css, /select option\s*{[^}]*color:\s*#2a170e;[^}]*background:\s*#f7ead2;[^}]*}/s);
  assert.match(css, /select\s*{[^}]*min-height:\s*48px;[^}]*}/s);
});
