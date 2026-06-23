(function(){ // MODULE-IIFE: isolate top-level declarations across <script> tags
// Public aggregator. Wires the ported data layer + engine together and handles
// charge-source loading (filesystem under Node for tests, fetch in the browser).

const isNode = typeof require !== 'undefined';
const TINCT = isNode ? require('./data/tinctures') : window.heraldryTinctures;
const SH = isNode ? require('./data/shields') : window.heraldryShields;
const MANIFEST = isNode ? require('./data/charges') : window.heraldryChargeManifest;
const PRESETS = isNode ? require('./presets') : window.heraldryPresets;
const engine = isNode ? require('./engine') : window.heraldryEngine;

const chargeCache = {};

// Node: read vendored SVGs from disk. Browser uses loadCharges() below.
function readChargeSource(name) {
  if (chargeCache[name] !== undefined) return chargeCache[name];
  if (isNode) {
    const fs = require('fs');
    const path = require('path');
    try {
      chargeCache[name] = fs.readFileSync(path.join(__dirname, 'charges', `${name}.svg`), 'utf8');
    } catch (e) {
      chargeCache[name] = null;
    }
    return chargeCache[name];
  }
  return chargeCache[name] || null;
}

function chargeNames(tree) {
  return [...engine.collectCharges(tree, new Set())];
}

// Browser: fetch all charge sources referenced by a tree, populate the cache.
async function loadCharges(tree) {
  if (isNode) { chargeNames(tree).forEach(readChargeSource); return; }
  const names = chargeNames(tree).filter(n => chargeCache[n] === undefined);
  await Promise.all(names.map(async name => {
    try {
      const res = await fetch(`src/charges/${name}.svg`);
      chargeCache[name] = res.ok ? await res.text() : null;
    } catch (e) {
      chargeCache[name] = null;
    }
  }));
}

function sourcesFor(tree) {
  const out = {};
  chargeNames(tree).forEach(name => {
    const src = isNode ? readChargeSource(name) : chargeCache[name];
    if (src) out[name] = src;
  });
  return out;
}

function renderCoatOfArms(tree, sources) {
  return engine.renderArms(tree, { chargeSources: sources || sourcesFor(tree) }).svg;
}

// Walk leaves; flag colour-on-colour / metal-on-metal of a charge over its field.
function violatesRuleOfTincture(tree) {
  let bad = false;
  (function walk(n) {
    if (!n) return;
    if (n.parts) return n.parts.forEach(walk), n.inescutcheon && walk(n.inescutcheon);
    if (n.field && n.field.type === 'plain') {
      const f = n.field.tinctures[0];
      const over = [...(n.charges || []).map(c => c.t), ...(n.ordinaries || []).map(o => o.t)]
        .filter(t => TINCT.tinctures[t] && TINCT.tinctures[t].kind !== 'proper');
      if (TINCT.tinctures[f] && over.some(t => TINCT.isMetal(t) === TINCT.isMetal(f))) bad = true;
    }
    if (n.inescutcheon) walk(n.inescutcheon);
  })(tree);
  return bad;
}

function tinctureLabel(t) { return TINCT.tinctures[t] ? TINCT.tinctures[t].label : t; }
const PARTITION_LABELS = {
  perPale: 'Per pale', perFess: 'Per fess', perBend: 'Per bend', perChevron: 'Per chevron',
  perSaltire: 'Per saltire', quarterly: 'Quarterly', grid: 'Quarterly', ente: 'Enté en point'
};

function blazon(tree) {
  function field(f) {
    if (!f) return 'a field';
    if (f.type === 'plain') return tinctureLabel(f.tinctures[0]);
    if (f.type === 'semy') return `${tinctureLabel(f.tinctures[0])} semy`;
    return `${f.type} ${f.tinctures.map(tinctureLabel).join(' and ')}`;
  }
  function describe(n) {
    if (!n) return '';
    if (n.parts) return `${PARTITION_LABELS[n.partition] || n.partition} (${n.parts.map(describe).join('; ')})` +
      (n.inescutcheon ? `, overall ${describe(n.inescutcheon)}` : '');
    let s = field(n.field);
    const ch = (n.charges || []).map(c => `${(MANIFEST.charges[c.charge] || {}).label || c.charge} ${tinctureLabel(c.t)}`);
    if (ch.length) s += ', ' + ch.join(' and ');
    if (n.inescutcheon) s += ', overall an inescutcheon ' + describe(n.inescutcheon);
    return s;
  }
  return describe(tree) + '.';
}

const api = {
  tinctures: TINCT.tinctures,
  shields: SH.shields,
  shieldLabels: SH.shieldLabels,
  chargeManifest: MANIFEST.charges,
  chargeCategories: MANIFEST.categories,
  presets: PRESETS.presets,
  chargeCache,
  chargeNames,
  loadCharges,
  renderCoatOfArms,
  violatesRuleOfTincture,
  blazon
};

if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.heraldry = Object.assign(window.heraldry || {}, api);
})();
