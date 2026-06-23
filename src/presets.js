(function(){ // MODULE-IIFE: isolate top-level declarations across <script> tags
// Ready-made coats. Charles V is the engine's acceptance test: partitions nested
// four deep, every field variation, a compony bordure, an inescutcheon and an
// enté-en-point — all expressed with the same generic node schema the editor uses.

function plain(t, charges, extra) {
  return Object.assign({ field: { type: 'plain', tinctures: [t] }, charges: charges || [] }, extra || {});
}
const M = (partition, parts, extra) => Object.assign({ partition, parts }, extra || {});

// Kingdom building blocks
const castile = plain('gules', [{ charge: 'castle', t: 'or', p: 'e' }]);
const leon = plain('argent', [{ charge: 'lionRampant', t: 'purpure', p: 'e' }]);
const aragon = { field: { type: 'paly', tinctures: ['or', 'gules'], count: 9 }, charges: [] };
const navarre = plain('gules', [{ charge: 'escarbuncle', t: 'or', t2: 'vert', p: 'e' }]);
const jerusalem = plain('argent', [{ charge: 'crossJerusalem', t: 'or', p: 'e' }]);
const hungary = { field: { type: 'barry', tinctures: ['gules', 'argent'], count: 8 }, charges: [] };
const sicilyEagle = plain('argent', [{ charge: 'eagle', t: 'sable', p: 'e' }]);

const austria = plain('gules', [], { ordinaries: [{ ordinary: 'fess', t: 'argent' }] });
const burgundyModern = {
  field: { type: 'semy', tinctures: ['azure'], semyCharge: 'fleurDeLis', semyTincture: 'or' },
  charges: [],
  ordinaries: [{ ordinary: 'bordure', t: 'argent', t2: 'gules', compony: true }]
};
const burgundyAncient = {
  field: { type: 'bendy', tinctures: ['or', 'azure'], count: 6 },
  charges: [],
  ordinaries: [{ ordinary: 'bordure', t: 'gules' }]
};
const brabant = plain('sable', [{ charge: 'lionRampant', t: 'or', p: 'e' }]);
const flanders = plain('or', [{ charge: 'lionRampant', t: 'sable', p: 'e' }]);
const tyrol = plain('argent', [{ charge: 'eagle', t: 'gules', t2: 'or', p: 'e' }]);
const granada = plain('argent', [{ charge: 'pomegranate', t: 'proper', p: 'e' }]);

// Grand quarters
const castileLeon = M('quarterly', [castile, leon, leon, castile]);
const aragonNavarre = M('perFess', [aragon, navarre]);
const spainII = M('perPale', [aragonNavarre, M('perPale', [jerusalem, hungary])]);
const spainIII = M('perPale', [aragonNavarre, M('perSaltire', [aragon, sicilyEagle, sicilyEagle, aragon])]);
const spainGrand = M('quarterly', [castileLeon, spainII, spainIII, castileLeon]);
const burgundyGrand = M('quarterly', [austria, burgundyModern, burgundyAncient, brabant],
  { inescutcheon: M('perPale', [flanders, tyrol]) });

const charlesV = {
  shield: 'royal',
  partition: 'ente',
  parts: [
    M('quarterly', [spainGrand, burgundyGrand, burgundyGrand, spainGrand]),
    granada
  ]
};

// --- Guise (House of Lorraine-Guise): coupé et parti en 3 + Lorraine inescutcheon
const gHungary = { field: { type: 'barry', tinctures: ['gules', 'argent'], count: 8 }, charges: [] };
const gSicily = { field: { type: 'semy', tinctures: ['azure'], semyCharge: 'fleurDeLis', semyTincture: 'or' }, charges: [], ordinaries: [{ ordinary: 'label', t: 'gules' }] };
const gJerusalem = plain('argent', [{ charge: 'crossJerusalem', t: 'or', p: 'e' }]);
const gAragon = { field: { type: 'paly', tinctures: ['or', 'gules'], count: 9 }, charges: [] };
const gAnjou = { field: { type: 'semy', tinctures: ['azure'], semyCharge: 'fleurDeLis', semyTincture: 'or' }, charges: [], ordinaries: [{ ordinary: 'bordure', t: 'gules' }] };
const gGueldres = plain('azure', [{ charge: 'lionRampant', t: 'or', sinister: true, p: 'e' }, { charge: 'crown', t: 'gules', p: 'b', size: 0.5 }]);
const gJulich = plain('or', [{ charge: 'lionRampant', t: 'sable', p: 'e' }]);
const gBar = { field: { type: 'semy', tinctures: ['azure'], semyCharge: 'crossPattee', semyTincture: 'or' }, charges: [{ charge: 'pike', t: 'or', p: 'df' }] };
const lorraine = {
  field: { type: 'plain', tinctures: ['or'] },
  ordinaries: [{ ordinary: 'bend', t: 'gules' }],
  charges: [{ charge: 'eagle', t: 'argent', along: 'bend', count: 3, size: 0.7 }]
};
const guise = {
  shield: 'spanish',
  partition: 'grid', rows: 2, cols: 4,
  parts: [gHungary, gSicily, gJerusalem, gAragon, gAnjou, gGueldres, gJulich, gBar],
  inescutcheon: lorraine,
  ordinaries: [{ ordinary: 'label', t: 'gules' }]
};

const presets = {
  charlesV: { label: 'Charles V, Holy Roman Emperor', tree: charlesV },
  guise: { label: 'House of Guise (Lorraine)', tree: guise },
  castileLeon: { label: 'Castile and León', tree: { shield: 'spanish', ...castileLeon } },
  castile: { label: 'Kingdom of Castile', tree: { shield: 'heater', ...castile } },
  perPaleDemo: {
    label: 'Per pale demo',
    tree: {
      shield: 'heater',
      partition: 'perPale',
      parts: [
        plain('gules', [{ charge: 'lionRampant', t: 'or', p: 'e' }]),
        { field: { type: 'bendy', tinctures: ['argent', 'azure'], count: 6 }, charges: [] }
      ]
    }
  }
};

const api = { presets };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.heraldryPresets = api;
})();
