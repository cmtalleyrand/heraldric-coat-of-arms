(function(){ // MODULE-IIFE: isolate top-level declarations across <script> tags
// Tincture palette (colours, metals, stains) ported from Armoria (MIT).
// `metal` marks the metals/light tinctures for the rule-of-tincture check.
const tinctures = {
  or: { label: 'Or', hex: '#f4c518', metal: true, kind: 'metal' },
  argent: { label: 'Argent', hex: '#f4f2e8', metal: true, kind: 'metal' },
  gules: { label: 'Gules', hex: '#d4202c', metal: false, kind: 'colour' },
  azure: { label: 'Azure', hex: '#1b4f9c', metal: false, kind: 'colour' },
  sable: { label: 'Sable', hex: '#1c1c1c', metal: false, kind: 'colour' },
  vert: { label: 'Vert', hex: '#1a7a3e', metal: false, kind: 'colour' },
  purpure: { label: 'Purpure', hex: '#6a2c70', metal: false, kind: 'colour' },
  murrey: { label: 'Murrey', hex: '#85185b', metal: false, kind: 'stain' },
  sanguine: { label: 'Sanguine', hex: '#9d2933', metal: false, kind: 'stain' },
  tenne: { label: 'Tenné', hex: '#cc7f19', metal: false, kind: 'stain' },
  carnation: { label: 'Carnation', hex: '#eabfa2', metal: true, kind: 'colour' },
  proper: { label: 'Proper', hex: '#caa15a', metal: true, kind: 'proper' }
};

function hex(name) {
  return (tinctures[name] && tinctures[name].hex) || '#888888';
}
function isMetal(name) {
  return !!(tinctures[name] && tinctures[name].metal);
}

const api = { tinctures, hex, isMetal };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.heraldryTinctures = api;
})();
