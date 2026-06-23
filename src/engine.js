// Heraldry rendering engine. A coat of arms is a recursive tree of nodes:
//   leaf node:        { field, ordinaries?, charges?, inescutcheon? }
//   marshalling node: { partition, parts: [node, ...] }
// Leaf nodes render an Armoria-style field + charges; marshalling nodes split
// their box into sub-regions (rects/triangles/wedge), clip each, and recurse —
// which is how deep quarterings (Charles V) are expressed with the same schema.

const SH = (typeof require !== 'undefined') ? require('./data/shields') : window.heraldryShields;
const TINCT = (typeof require !== 'undefined') ? require('./data/tinctures') : window.heraldryTinctures;
const MANIFEST = (typeof require !== 'undefined') ? require('./data/charges') : window.heraldryChargeManifest;
const hex = TINCT.hex;

// 3x3 named position grid (offsets from a region's centre, in ±50 of half-box).
const GRID = {
  a: [-50, -50], b: [0, -50], c: [50, -50],
  d: [-50, 0], e: [0, 0], f: [50, 0],
  g: [-50, 50], h: [0, 50], i: [50, 50]
};

const CHARGE_PAD = 0.94;     // fraction of a cell's charge-area a charge fills
const STRETCH_CAP = 1.45;    // max non-uniform stretch
const OUTLINE = '#5a4626';   // thin shield outline (soft brown, like the references)
const OUTLINE_W = 1.1;
const LINE = '#2b2218';      // hairline between cells
// fallback charge bbox if a charge isn't measured
const DEF_BBOX = { x: 60, y: 60, w: 80, h: 88 };
function chargeBBox(name) {
  return (MANIFEST.charges[name] && MANIFEST.charges[name].bbox) || DEF_BBOX;
}

function box(x, y, w, h) { return { x, y, w, h }; }
function rectPath(b) { return `M${b.x} ${b.y}H${b.x + b.w}V${b.y + b.h}H${b.x}Z`; }
function poly(points) { return 'M' + points.map(p => p.join(' ')).join('L') + 'Z'; }
function bboxOf(points) {
  const xs = points.map(p => p[0]); const ys = points.map(p => p[1]);
  const x = Math.min(...xs); const y = Math.min(...ys);
  return box(x, y, Math.max(...xs) - x, Math.max(...ys) - y);
}

// --- Charge symbols -------------------------------------------------------------

// Extract the inner <g id="name">…</g> from a vendored charge SVG and give it a
// namespaced id so it can be referenced by <use>.
function prepareSymbol(name, src) {
  let s = src.replace(/<\?xml[^>]*\?>/g, '')
    .replace(/<metadata[\s\S]*?\/>/g, '')
    .replace(/<metadata[\s\S]*?<\/metadata>/g, '')
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .trim();
  // rename the first id to the namespaced one
  s = s.replace(/id="[^"]*"/, `id="ch_${name}"`).replace(/id=([^\s">]+)/, `id="ch_${name}"`);
  if (!s.includes(`id="ch_${name}"`)) s = `<g id="ch_${name}">${s}</g>`;
  return s;
}

function collectCharges(node, set) {
  if (!node) return set;
  if (node.field && node.field.semyCharge) set.add(node.field.semyCharge);
  (node.charges || []).forEach(c => set.add(c.charge));
  (node.parts || []).forEach(p => collectCharges(p, set));
  if (node.inescutcheon) collectCharges(node.inescutcheon, set);
  return set;
}

// --- Fields & patterns ----------------------------------------------------------

function fillRect(b, color) {
  return `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="${color}"/>`;
}

function stripes(b, colors, count, horizontal) {
  const n = Math.max(1, count);
  let out = '';
  for (let i = 0; i < n; i++) {
    out += horizontal
      ? `<rect x="${b.x}" y="${b.y + i * b.h / n}" width="${b.w}" height="${b.h / n + 0.4}" fill="${colors[i % 2]}"/>`
      : `<rect x="${b.x + i * b.w / n}" y="${b.y}" width="${b.w / n + 0.4}" height="${b.h}" fill="${colors[i % 2]}"/>`;
  }
  return out;
}

function bendyFill(b, colors, count, sinister) {
  const n = Math.max(1, count);
  const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
  const diag = Math.hypot(b.w, b.h) * 1.3, band = diag / n;
  let out = `<g transform="rotate(${sinister ? -45 : 45} ${cx} ${cy})">`;
  for (let i = 0; i < n; i++) {
    out += `<rect x="${cx - diag / 2}" y="${cy - diag / 2 + i * band}" width="${diag}" height="${band + 0.4}" fill="${colors[i % 2]}"/>`;
  }
  return out + '</g>';
}

function chequyFill(b, colors, count) {
  const cols = Math.max(1, count), cw = b.w / cols;
  const rows = Math.max(1, Math.round(b.h / cw)), ch = b.h / rows;
  let out = '';
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    out += `<rect x="${b.x + c * cw}" y="${b.y + r * ch}" width="${cw + 0.4}" height="${ch + 0.4}" fill="${colors[(r + c) % 2]}"/>`;
  }
  return out;
}

function renderField(field, b, ctx) {
  if (!field) return '';
  const colors = (field.tinctures || []).map(hex);
  switch (field.type) {
    case 'paly': return stripes(b, colors, field.count || 6, false);
    case 'barry': return stripes(b, colors, field.count || 6, true);
    case 'bendy': return bendyFill(b, colors, field.count || 6, field.sinister);
    case 'chequy': return chequyFill(b, colors, field.count || 6);
    case 'semy': {
      let out = fillRect(b, colors[0]);
      const sz = Math.min(b.w, b.h) / 3.4, stepX = sz * 1.25, stepY = sz * 1.15;
      let row = 0;
      for (let y = b.y + sz * 0.3; y < b.y + b.h - sz * 0.3; y += stepY) {
        const off = (row % 2) * (stepX / 2);
        for (let x = b.x - stepX + off; x < b.x + b.w; x += stepX) {
          const { sx, sy } = chargeScale(field.semyCharge, { w: sz, h: sz }, 1);
          out += placeCharge(field.semyCharge, [field.semyTincture || 'or'], null, {},
            { x: x + sz / 2, y: y + sz / 2 }, sx, sy, ctx);
        }
        row++;
      }
      return out;
    }
    case 'plain':
    default: return fillRect(b, colors[0] || hex(field.tincture));
  }
}

// --- Ordinaries -----------------------------------------------------------------

function renderOrdinary(o, b) {
  const t = hex(o.t);
  switch (o.ordinary) {
    case 'chief': return `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h * 0.27}" fill="${t}"/>`;
    case 'fess': return `<rect x="${b.x}" y="${b.y + b.h * 0.4}" width="${b.w}" height="${b.h * 0.2}" fill="${t}"/>`;
    case 'bar': return `<rect x="${b.x}" y="${b.y + b.h * 0.43}" width="${b.w}" height="${b.h * 0.14}" fill="${t}"/>`;
    case 'pale': return `<rect x="${b.x + b.w * 0.4}" y="${b.y}" width="${b.w * 0.2}" height="${b.h}" fill="${t}"/>`;
    case 'cross':
      return `<rect x="${b.x + b.w * 0.4}" y="${b.y}" width="${b.w * 0.2}" height="${b.h}" fill="${t}"/>` +
        `<rect x="${b.x}" y="${b.y + b.h * 0.4}" width="${b.w}" height="${b.h * 0.2}" fill="${t}"/>`;
    case 'bend': case 'saltire': {
      const cx = b.x + b.w / 2, cy = b.y + b.h / 2, len = Math.hypot(b.w, b.h) * 1.3, bw = Math.min(b.w, b.h) * 0.24;
      const bar = a => `<g transform="rotate(${a} ${cx} ${cy})"><rect x="${cx - len / 2}" y="${cy - bw / 2}" width="${len}" height="${bw}" fill="${t}"/></g>`;
      return o.ordinary === 'saltire' ? bar(45) + bar(-45) : bar(45);
    }
    case 'bordure': {
      const bw = Math.min(b.w, b.h) * 0.16;
      let out = `<path d="${rectPath(b)}" fill="none" stroke="${t}" stroke-width="${bw}"/>`;
      if (o.compony && o.t2) {
        const seg = bw * 1.2;
        out += `<path d="${rectPath(b)}" fill="none" stroke="${hex(o.t2)}" stroke-width="${bw}" stroke-dasharray="${seg} ${seg}"/>`;
      }
      return out;
    }
    default: return '';
  }
}

// --- Charges --------------------------------------------------------------------

function placeCharge(name, tinctures, stroke, opts, target, sx, sy, ctx) {
  ctx.used.add(name);
  const t = hex(tinctures[0]);
  const t2 = tinctures[1] ? hex(tinctures[1]) : t;
  const t3 = tinctures[2] ? hex(tinctures[2]) : t;
  const strk = stroke || '#000';
  const bb = chargeBBox(name);
  const acx = bb.x + bb.w / 2, acy = bb.y + bb.h / 2;   // artwork centre
  const flip = opts && opts.sinister ? -1 : 1;
  const tx = target.x - acx * sx * flip, ty = target.y - acy * sy;
  const sw = (0.8 / ((Math.abs(sx) + sy) / 2)).toFixed(2);
  return `<g fill="${t}" stroke="${strk}" stroke-width="${sw}" ` +
    `style="--secondary:${t2};--tertiary:${t3};--stroke:${strk}">` +
    `<use href="#ch_${name}" xlink:href="#ch_${name}" transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${(sx * flip).toFixed(4)} ${sy.toFixed(4)})"/></g>`;
}

// Scale a charge so its measured artwork fills the available square area, with
// bounded non-uniform stretch for narrow cells.
function chargeScale(name, area, sizeMod) {
  const bb = chargeBBox(name);
  let sx = (area.w * CHARGE_PAD) / bb.w * sizeMod;
  let sy = (area.h * CHARGE_PAD) / bb.h * sizeMod;
  if (sy > sx * STRETCH_CAP) sy = sx * STRETCH_CAP;
  if (sx > sy * STRETCH_CAP) sx = sy * STRETCH_CAP;
  return { sx, sy };
}

// The area a charge occupies inside a cell: a square the width of the cell,
// anchored toward the top of tall cells so charges sit in the wide part of the
// shield (and clear of the narrowing base), centred otherwise.
function chargeArea(b) {
  const side = Math.min(b.w, b.h);
  const tall = b.h > b.w * 1.15;
  const cx = b.x + b.w / 2;
  const cy = tall ? b.y + side * 0.5 + b.w * 0.06 : b.y + b.h / 2;
  return { cx, cy, w: tall ? b.w : Math.min(b.w, b.h * 1.1), h: side };
}

function renderCharges(charge, b, ctx) {
  const positions = (charge.p || 'e').split('').filter(p => GRID[p]);
  if (!positions.length) positions.push('e');
  const area = chargeArea(b);
  const divisor = positions.length > 1 ? Math.ceil(Math.sqrt(positions.length)) : 1;
  const sub = { w: area.w / divisor, h: area.h / divisor };
  const { sx, sy } = chargeScale(charge.charge, sub, charge.size || 1);
  const tinctures = [charge.t, charge.t2, charge.t3].filter(Boolean);
  return positions.map(p => {
    const [ox, oy] = GRID[p];
    const target = { x: area.cx + ox * (area.w / 200), y: area.cy + oy * (area.h / 200) };
    return placeCharge(charge.charge, tinctures, charge.stroke, charge, target, sx, sy, ctx);
  }).join('');
}

// --- Marshalling ----------------------------------------------------------------

function splitBox(b, partition) {
  const { x, y, w, h } = b;
  switch (partition) {
    case 'perPale': return [box(x, y, w / 2, h), box(x + w / 2, y, w / 2, h)].map(r => ({ box: r, clip: rectPath(r) }));
    case 'perFess': return [box(x, y, w, h / 2), box(x, y + h / 2, w, h / 2)].map(r => ({ box: r, clip: rectPath(r) }));
    case 'quarterly': {
      // Square-module quartering: when the region is taller than wide, the top
      // quarters are squares (w/2 each) and the bottom quarters absorb the extra
      // height (flowing into the shield's base). Square/wide regions split evenly.
      const topH = h > w ? w / 2 : h / 2;
      const botH = h - topH;
      return [
        box(x, y, w / 2, topH), box(x + w / 2, y, w / 2, topH),
        box(x, y + topH, w / 2, botH), box(x + w / 2, y + topH, w / 2, botH)
      ].map(r => ({ box: r, clip: rectPath(r) }));
    }
    case 'perSaltire': {
      const TL = [x, y], TR = [x + w, y], BR = [x + w, y + h], BL = [x, y + h], C = [x + w / 2, y + h / 2];
      return [[TL, TR, C], [TL, C, BL], [TR, BR, C], [BL, C, BR]].map(tr => ({ box: bboxOf(tr), clip: poly(tr) }));
    }
    case 'perBend': {
      const TL = [x, y], TR = [x + w, y], BR = [x + w, y + h], BL = [x, y + h];
      return [[TL, TR, BR], [TL, BR, BL]].map(tr => ({ box: bboxOf(tr), clip: poly(tr) }));
    }
    case 'perChevron': {
      const apex = [x + w / 2, y + h * 0.34], BL = [x, y + h], BR = [x + w, y + h];
      const TL = [x, y], TR = [x + w, y];
      return [
        { box: box(x, y, w, h), clip: poly([TL, TR, BR, apex, BL]) },
        { box: box(x, y + h * 0.34, w, h * 0.66), clip: poly([apex, BR, BL]) }
      ];
    }
    case 'ente': {
      const cx = x + w / 2, topY = y + h * 0.82, half = w * 0.17;
      const wedge = `M${cx - half} ${topY}C${cx - half} ${topY} ${cx - half * 0.7} ${y + h * 0.95} ${cx} ${y + h}` +
        `C${cx + half * 0.7} ${y + h * 0.95} ${cx + half} ${topY} ${cx + half} ${topY}Z`;
      return [
        { box: box(x, y, w, h), clip: rectPath(b) },
        { box: box(cx - half, topY, half * 2, y + h - topY), clip: wedge }
      ];
    }
    case 'grid': return null; // handled with rows/cols in renderNode
    default: return [{ box: b, clip: rectPath(b) }];
  }
}

function gridBoxes(b, rows, cols) {
  const out = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const cell = box(b.x + c * b.w / cols, b.y + r * b.h / rows, b.w / cols, b.h / rows);
    out.push({ box: cell, clip: rectPath(cell) });
  }
  return out;
}

let clipCounter = 0;
function renderNode(node, b, ctx) {
  if (!node) return '';
  const clipId = `clip${clipCounter++}`;
  ctx.defs.push(`<clipPath id="${clipId}"><path d="${rectPath(b)}"/></clipPath>`);
  let inner = '';

  if (node.partition && node.parts) {
    const regions = node.partition === 'grid'
      ? gridBoxes(b, node.rows || 2, node.cols || 2)
      : splitBox(b, node.partition);
    const lw = Math.max(0.35, Math.min(b.w, b.h) * 0.006);
    node.parts.forEach((child, i) => {
      const region = regions[i];
      if (!region) return;
      const childClip = `clip${clipCounter++}`;
      ctx.defs.push(`<clipPath id="${childClip}"><path d="${region.clip}"/></clipPath>`);
      inner += `<g clip-path="url(#${childClip})">${renderNode(child, region.box, ctx)}</g>`;
    });
    // division lines between cells (drawn over the children for legibility)
    regions.forEach(region => {
      if (region) inner += `<path d="${region.clip}" fill="none" stroke="${LINE}" stroke-width="${lw.toFixed(2)}"/>`;
    });
  } else {
    inner += renderField(node.field, b, ctx);
    (node.ordinaries || []).forEach(o => { inner += renderOrdinary(o, b); });
    (node.charges || []).forEach(c => { inner += renderCharges(c, b, ctx); });
  }

  if (node.inescutcheon) {
    const bb = ctx.shieldBBox;
    const iw = b.w * 0.44, ih = iw * (bb.h / bb.w);
    const ix = b.x + b.w / 2 - iw / 2, iy = b.y + b.h / 2 - ih * 0.46;
    const sxx = iw / bb.w, syy = ih / bb.h;
    const tf = `translate(${(ix - bb.x * sxx).toFixed(3)} ${(iy - bb.y * syy).toFixed(3)}) scale(${sxx.toFixed(4)} ${syy.toFixed(4)})`;
    const ic = `clip${clipCounter++}`;
    ctx.defs.push(`<clipPath id="${ic}"><path d="${ctx.shieldPath}" transform="${tf}"/></clipPath>`);
    inner += `<g clip-path="url(#${ic})"><g transform="${tf}">${renderNode(node.inescutcheon, box(bb.x, bb.y, bb.w, bb.h), ctx)}</g></g>`;
    inner += `<path d="${ctx.shieldPath}" transform="${tf}" fill="none" stroke="${OUTLINE}" stroke-width="${(OUTLINE_W / sxx).toFixed(2)}"/>`;
  }
  return `<g clip-path="url(#${clipId})">${inner}</g>`;
}

// --- Top level ------------------------------------------------------------------

function renderArms(tree, options) {
  clipCounter = 0;
  const opts = options || {};
  const shieldName = (tree && tree.shield) || opts.shield || 'spanish';
  const shieldDef = SH.shields[shieldName] || SH.shields.spanish;
  const ctx = { defs: [], used: new Set(), shield: shieldName, shieldPath: shieldDef.path, sources: opts.chargeSources || {} };

  // Fit marshalling to the shield's drawable area so divisions align to and fill
  // whatever shield is selected (works for any shield type).
  const bb = shieldDef.bbox || { x: 0, y: 0, w: 200, h: 200 };
  ctx.shieldBBox = bb;
  const fullBox = box(bb.x, bb.y, bb.w, bb.h);
  const shieldId = 'shield';
  const body = renderNode(tree, fullBox, ctx);

  // charge symbols
  let symbols = '';
  ctx.used.forEach(name => {
    if (ctx.sources[name]) symbols += prepareSymbol(name, ctx.sources[name]);
  });

  const styleBlock = `<style>.secondary{fill:var(--secondary)}.tertiary{fill:var(--tertiary)}.pseudostroke{fill:var(--stroke)}.background{fill:inherit}</style>`;
  const defs = `<defs>${styleBlock}<clipPath id="${shieldId}"><path d="${shieldDef.path}"/></clipPath>${symbols}${ctx.defs.join('')}</defs>`;
  const box4 = (shieldDef.box || SH.DEFAULT_BOX);
  return {
    viewBox: box4,
    svg: `<svg viewBox="${box4}" role="img" aria-label="Coat of arms" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">` +
      defs +
      `<g clip-path="url(#${shieldId})">${body}</g>` +
      `<path d="${shieldDef.path}" fill="none" stroke="${OUTLINE}" stroke-width="${OUTLINE_W}"/>` +
      `</svg>`
  };
}

const api = { renderArms, collectCharges, prepareSymbol, box, GRID };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.heraldryEngine = api;
