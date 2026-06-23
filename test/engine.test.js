const test = require('node:test');
const assert = require('node:assert/strict');
const h = require('../src/heraldry');
const { presets } = require('../src/presets');

test('every preset renders to a valid svg without throwing', () => {
  for (const key of Object.keys(presets)) {
    const svg = h.renderCoatOfArms(presets[key].tree);
    assert.match(svg, /^<svg /, `${key} should produce an <svg>`);
    assert.match(svg, /viewBox="/, `${key} should set a viewBox`);
  }
});

test('Charles V exercises the full engine (depth, charges, inescutcheon)', () => {
  const svg = h.renderCoatOfArms(presets.charlesV.tree);
  // baroque (royal) shield viewBox
  assert.match(svg, /viewBox="0 10 200 200"/);
  // Castile appears 8 times (2 castles per Castile/León quarter x 4 occurrences)
  const castles = (svg.match(/xlink:href="#ch_castle"/g) || []).length;
  assert.equal(castles, 8, 'expected 8 castle charges');
  // real charge instances are placed via <use>
  assert.ok((svg.match(/<use /g) || []).length > 30, 'many charge instances');
  // deep nesting yields many clip regions
  assert.ok((svg.match(/clipPath/g) || []).length > 100, 'deep clip nesting');
  // charges fill cells with a (possibly non-uniform) scale
  assert.match(svg, /scale\([0-9.]+ [0-9.]+\)/, 'charge fill scale present');
});

test('marshalling splits a quarterly node into four clipped regions', () => {
  const tree = { shield: 'heater', partition: 'quarterly', parts: [
    { field: { type: 'plain', tinctures: ['gules'] } },
    { field: { type: 'plain', tinctures: ['or'] } },
    { field: { type: 'plain', tinctures: ['azure'] } },
    { field: { type: 'plain', tinctures: ['argent'] } }
  ] };
  const svg = h.renderCoatOfArms(tree);
  // four quarter fills with the four tinctures
  for (const t of ['gules', 'or', 'azure', 'argent']) {
    assert.ok(svg.includes(h.tinctures[t].hex), `${t} fill present`);
  }
});

test('division lines appear ONLY between same-coloured neighbours', () => {
  const distinct = h.renderCoatOfArms({ shield: 'heater', partition: 'quarterly', parts: [
    { field: { type: 'plain', tinctures: ['gules'] } }, { field: { type: 'plain', tinctures: ['or'] } },
    { field: { type: 'plain', tinctures: ['azure'] } }, { field: { type: 'plain', tinctures: ['vert'] } }
  ] });
  assert.doesNotMatch(distinct, /stroke="#2b2218"/, 'no lines when all quarters differ');
  const same = h.renderCoatOfArms({ shield: 'heater', partition: 'perPale', parts: [
    { field: { type: 'plain', tinctures: ['argent'] } }, { field: { type: 'plain', tinctures: ['argent'] } }
  ] });
  assert.match(same, /stroke="#2b2218"/, 'a line where two argent fields meet');
});

test('the same coat fits every shield type via per-shield bbox', () => {
  for (const sh of Object.keys(h.shields)) {
    assert.ok(h.shields[sh].bbox, `${sh} has a bbox`);
    const svg = h.renderCoatOfArms({ shield: sh, partition: 'perPale', parts: [
      { field: { type: 'plain', tinctures: ['gules'] } },
      { field: { type: 'plain', tinctures: ['or'] } }
    ] });
    assert.match(svg, /^<svg /, `${sh} renders`);
  }
});

test('rule of tincture flags metal-on-metal (Jerusalem) but not a clean coat', () => {
  assert.equal(h.violatesRuleOfTincture(presets.charlesV.tree), true);
  const clean = { field: { type: 'plain', tinctures: ['azure'] }, charges: [{ charge: 'lionRampant', t: 'or', p: 'e' }] };
  assert.equal(h.violatesRuleOfTincture(clean), false);
});

test('blazon produces a description string', () => {
  assert.match(h.blazon(presets.castileLeon.tree), /Quarterly/);
});

test('charge manifest and tinctures are exposed', () => {
  assert.ok(Object.keys(h.chargeManifest).length >= 40);
  assert.ok(h.tinctures.or && h.tinctures.gules);
  assert.ok(h.shields.spanish && h.shields.heater);
});
