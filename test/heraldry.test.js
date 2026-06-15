const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeOptions, violatesRuleOfTincture, renderCoatOfArms } = require('../src/heraldry');

test('normalizes invalid option keys to stable defaults', () => {
  assert.deepEqual(normalizeOptions({ field: 'invalid', ordinary: 'bad', motto: 'Swift' }), {
    field: 'gules',
    ordinary: 'chevron',
    ordinaryTincture: 'or',
    charge: 'lion',
    chargeTincture: 'argent',
    layout: 'one',
    motto: 'Swift'
  });
});

test('detects rule of tincture contrast conflicts', () => {
  assert.equal(violatesRuleOfTincture({ field: 'gules', ordinaryTincture: 'azure', chargeTincture: 'or' }), true);
  assert.equal(violatesRuleOfTincture({ field: 'gules', ordinaryTincture: 'or', chargeTincture: 'argent' }), false);
});

test('renders escaped motto text into the SVG', () => {
  const svg = renderCoatOfArms({ motto: '<Valor & Honor>', charge: 'fleur', layout: 'three' });
  assert.match(svg, /&lt;Valor &amp; Honor&gt;/);
  assert.match(svg, /⚜/);
});
