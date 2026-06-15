const tinctures = {
  gules: { label: 'Gules', hex: '#9f1d20', metal: false },
  azure: { label: 'Azure', hex: '#174a8b', metal: false },
  sable: { label: 'Sable', hex: '#161311', metal: false },
  vert: { label: 'Vert', hex: '#1f6f43', metal: false },
  purpure: { label: 'Purpure', hex: '#63316f', metal: false },
  argent: { label: 'Argent', hex: '#e8e4d4', metal: true },
  or: { label: 'Or', hex: '#d4a62a', metal: true }
};

const ordinaries = {
  none: { label: 'None', path: '' },
  chief: { label: 'Chief', path: '<rect x="110" y="62" width="260" height="80" />' },
  pale: { label: 'Pale', path: '<rect x="205" y="62" width="70" height="318" />' },
  fess: { label: 'Fess', path: '<rect x="110" y="188" width="260" height="70" />' },
  bend: { label: 'Bend', path: '<polygon points="132,62 190,62 370,330 370,380 330,380 110,112 110,62" />' },
  chevron: { label: 'Chevron', path: '<polygon points="110,280 240,140 370,280 332,318 240,220 148,318" />' },
  cross: { label: 'Cross', path: '<rect x="205" y="62" width="70" height="318" /><rect x="110" y="188" width="260" height="70" />' },
  saltire: { label: 'Saltire', path: '<polygon points="126,62 240,176 354,62 370,62 370,126 276,220 370,314 370,380 354,380 240,264 126,380 110,380 110,314 204,220 110,126 110,62" />' }
};

const charges = {
  lion: { label: 'Lion rampant', glyph: '♌' },
  eagle: { label: 'Eagle displayed', glyph: '🦅' },
  fleur: { label: 'Fleur-de-lis', glyph: '⚜' },
  rose: { label: 'Rose', glyph: '✹' },
  tower: { label: 'Tower', glyph: '♜' },
  star: { label: 'Estoile', glyph: '✦' },
  stag: { label: 'Stag', glyph: '♞' },
  dragon: { label: 'Dragon', glyph: '❧' }
};

const chargeLayouts = {
  one: [{ x: 240, y: 222, size: 112 }],
  two: [{ x: 240, y: 162, size: 82 }, { x: 240, y: 282, size: 82 }],
  three: [{ x: 240, y: 145, size: 76 }, { x: 188, y: 270, size: 76 }, { x: 292, y: 270, size: 76 }],
  semy: [
    { x: 170, y: 138, size: 44 }, { x: 240, y: 138, size: 44 }, { x: 310, y: 138, size: 44 },
    { x: 150, y: 220, size: 44 }, { x: 220, y: 220, size: 44 }, { x: 290, y: 220, size: 44 },
    { x: 190, y: 302, size: 44 }, { x: 260, y: 302, size: 44 }, { x: 330, y: 302, size: 44 }
  ]
};

function esc(value) {
  return String(value).replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
}

function normalizeOptions(input = {}) {
  const field = tinctures[input.field] ? input.field : 'gules';
  const ordinary = ordinaries[input.ordinary] ? input.ordinary : 'chevron';
  const ordinaryTincture = tinctures[input.ordinaryTincture] ? input.ordinaryTincture : 'or';
  const charge = charges[input.charge] ? input.charge : 'lion';
  const chargeTincture = tinctures[input.chargeTincture] ? input.chargeTincture : 'argent';
  const layout = chargeLayouts[input.layout] ? input.layout : 'one';
  const motto = String(input.motto || 'Fortune Favours the Bold').slice(0, 40);
  return { field, ordinary, ordinaryTincture, charge, chargeTincture, layout, motto };
}

function violatesRuleOfTincture(options) {
  const normalized = normalizeOptions(options);
  const fieldMetal = tinctures[normalized.field].metal;
  const ordinaryMetal = tinctures[normalized.ordinaryTincture].metal;
  const chargeMetal = tinctures[normalized.chargeTincture].metal;
  return fieldMetal === ordinaryMetal || fieldMetal === chargeMetal;
}

function renderCoatOfArms(options = {}) {
  const o = normalizeOptions(options);
  const field = tinctures[o.field];
  const ordinaryTincture = tinctures[o.ordinaryTincture];
  const chargeTincture = tinctures[o.chargeTincture];
  const charge = charges[o.charge];
  const positions = chargeLayouts[o.layout];
  const ordinaryShape = ordinaries[o.ordinary].path;
  const chargeNodes = positions.map(pos => `<text x="${pos.x}" y="${pos.y}" text-anchor="middle" dominant-baseline="middle" font-size="${pos.size}" fill="${chargeTincture.hex}" stroke="#2a170e" stroke-width="1.5">${charge.glyph}</text>`).join('');
  const ordinaryNode = ordinaryShape ? `<g fill="${ordinaryTincture.hex}" stroke="#2a170e" stroke-width="4">${ordinaryShape}</g>` : '';
  return `<svg viewBox="0 0 480 560" role="img" aria-label="${esc(field.label)} shield bearing ${esc(charge.label)}" xmlns="http://www.w3.org/2000/svg">
    <defs><clipPath id="shield"><path d="M110 62 H370 V278 C370 354 307 420 240 462 C173 420 110 354 110 278 Z" /></clipPath></defs>
    <rect width="480" height="560" fill="#24150e" />
    <path d="M110 62 H370 V278 C370 354 307 420 240 462 C173 420 110 354 110 278 Z" fill="${field.hex}" stroke="#f3d48b" stroke-width="10" />
    <g clip-path="url(#shield)">${ordinaryNode}${chargeNodes}</g>
    <path d="M110 62 H370 V278 C370 354 307 420 240 462 C173 420 110 354 110 278 Z" fill="none" stroke="#2a170e" stroke-width="4" />
    <path d="M92 486 C164 522 316 522 388 486 L364 536 C292 510 188 510 116 536 Z" fill="#d4a62a" stroke="#2a170e" stroke-width="4" />
    <text x="240" y="517" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#2a170e">${esc(o.motto)}</text>
  </svg>`;
}

const api = { tinctures, ordinaries, charges, chargeLayouts, normalizeOptions, violatesRuleOfTincture, renderCoatOfArms };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.heraldry = api;
