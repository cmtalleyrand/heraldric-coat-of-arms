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
  shield: 'baroque',
  partition: 'ente',
  parts: [
    M('quarterly', [spainGrand, burgundyGrand, burgundyGrand, spainGrand]),
    granada
  ]
};

const presets = {
  charlesV: { label: 'Charles V, Holy Roman Emperor', tree: charlesV },
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
