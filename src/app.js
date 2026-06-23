/* global heraldry */
const H = window.heraldry;
const $ = sel => document.querySelector(sel);

const POSITION_PRESETS = {
  e: 'One (centre)', df: 'Two (in fess)', bh: 'Two (in pale)',
  abc: 'Three (in chief)', adg: 'Three (in pale)', ace: 'Three',
  abcdefghi: 'Nine (semé-like)'
};
const SIZE_PRESETS = { 0.7: 'Small', 1: 'Medium', 1.3: 'Large' };
const PARTITIONS = {
  perPale: 'Per pale (2)', perFess: 'Per fess (2)', quarterly: 'Quarterly (4)',
  perSaltire: 'Per saltire (4)', perBend: 'Per bend (2)', perChevron: 'Per chevron (2)',
  ente: 'Enté en point (2)', grid: 'Grid (rows × cols)'
};
const PART_COUNT = { perPale: 2, perFess: 2, quarterly: 4, perSaltire: 4, perBend: 2, perChevron: 2, ente: 2 };

let tree = clone(H.presets.charlesV.tree);
let selectedPath = [];

function clone(o) { return JSON.parse(JSON.stringify(o)); }
function leafNode(t) { return { field: { type: 'plain', tinctures: [t || 'azure'] }, charges: [] }; }

function getNode(path) {
  let n = tree;
  for (const step of path) n = step === 'ines' ? n.inescutcheon : n.parts[step];
  return n;
}

// --- small DOM helpers ----------------------------------------------------------
function el(tag, attrs, children) {
  const e = document.createElement(tag);
  if (attrs) for (const k in attrs) {
    if (k === 'class') e.className = attrs[k];
    else if (k === 'html') e.innerHTML = attrs[k];
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), attrs[k]);
    else e.setAttribute(k, attrs[k]);
  }
  (children || []).forEach(c => e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
  return e;
}
function select(value, options, onChange) {
  const s = el('select', { onchange: e => onChange(e.target.value) });
  for (const [val, label] of options) {
    const o = el('option', { value: val }); o.textContent = label;
    if (String(val) === String(value)) o.selected = true;
    s.appendChild(o);
  }
  return s;
}
const tinctureOptions = () => Object.keys(H.tinctures).map(k => [k, H.tinctures[k].label]);

function tinctureSwatches(value, onPick) {
  const row = el('div', { class: 'swatches' });
  Object.keys(H.tinctures).forEach(k => {
    const b = el('button', {
      class: 'swatch' + (k === value ? ' active' : ''), type: 'button',
      title: H.tinctures[k].label, onclick: () => onPick(k)
    });
    b.style.background = H.tinctures[k].hex;
    row.appendChild(b);
  });
  return row;
}

// --- editor -------------------------------------------------------------------
function buildEditor() {
  const node = getNode(selectedPath);
  const root = $('#node-editor');
  root.innerHTML = '';

  const isDivided = !!node.parts;
  const toggle = el('div', { class: 'segmented' }, [
    el('button', { class: 'seg' + (!isDivided ? ' active' : ''), type: 'button', onclick: () => setDivided(false) }, ['Single field']),
    el('button', { class: 'seg' + (isDivided ? ' active' : ''), type: 'button', onclick: () => setDivided(true) }, ['Divided'])
  ]);
  root.appendChild(toggle);

  if (isDivided) buildDividedControls(root, node);
  else buildLeafControls(root, node);

  // inescutcheon (available on any node)
  const hasInes = !!node.inescutcheon;
  const inesRow = el('div', { class: 'control' }, [
    el('label', { class: 'check' }, [
      Object.assign(el('input', { type: 'checkbox', onchange: e => toggleInes(e.target.checked) }), { checked: hasInes }),
      el('span', {}, ['Inescutcheon (overall)'])
    ])
  ]);
  if (hasInes) inesRow.appendChild(el('button', { class: 'btn small', type: 'button', onclick: () => navigate([...selectedPath, 'ines']) }, ['Edit inescutcheon →']));
  root.appendChild(inesRow);
}

function buildDividedControls(root, node) {
  root.appendChild(el('div', { class: 'control' }, [
    el('label', { class: 'field' }, ['Division',
      select(node.partition, Object.entries(PARTITIONS), setPartition)])
  ]));
  if (node.partition === 'grid') {
    const grid = el('div', { class: 'control inline' }, [
      el('label', { class: 'field' }, ['Rows', Object.assign(el('input', { type: 'number', min: 1, max: 6, value: node.rows || 2, oninput: e => { node.rows = +e.target.value; rebuildGrid(node); } }), {})]),
      el('label', { class: 'field' }, ['Cols', Object.assign(el('input', { type: 'number', min: 1, max: 6, value: node.cols || 2, oninput: e => { node.cols = +e.target.value; rebuildGrid(node); } }), {})])
    ]);
    root.appendChild(grid);
  }
  const parts = el('div', { class: 'parts' });
  node.parts.forEach((p, i) => parts.appendChild(
    el('button', { class: 'part-btn', type: 'button', onclick: () => navigate([...selectedPath, i]) }, [`Part ${i + 1} →`])
  ));
  root.appendChild(parts);
}

function buildLeafControls(root, node) {
  if (!node.field) node.field = { type: 'plain', tinctures: ['azure'] };
  const f = node.field;
  root.appendChild(el('div', { class: 'control' }, [
    el('label', { class: 'field' }, ['Field',
      select(f.type, [['plain', 'Plain'], ['paly', 'Paly / pallets'], ['barry', 'Barry'], ['bendy', 'Bendy'], ['chequy', 'Chequy'], ['semy', 'Semé']], setFieldType)])
  ]));

  // tincture(s)
  if (f.type === 'plain') {
    root.appendChild(labelled('Tincture', tinctureSwatches(f.tinctures[0], t => { f.tinctures = [t]; render(); })));
  } else if (f.type === 'semy') {
    root.appendChild(labelled('Field', tinctureSwatches(f.tinctures[0], t => { f.tinctures = [t]; render(); })));
    root.appendChild(el('div', { class: 'control' }, [el('label', { class: 'field' }, ['Strewn charge', chargeSelect(f.semyCharge || 'fleurDeLis', v => { f.semyCharge = v; render(); })])]));
    root.appendChild(labelled('Charge tincture', tinctureSwatches(f.semyTincture || 'or', t => { f.semyTincture = t; render(); })));
  } else {
    if (!f.tinctures[1]) f.tinctures[1] = 'gules';
    root.appendChild(labelled('Tincture 1', tinctureSwatches(f.tinctures[0], t => { f.tinctures[0] = t; render(); })));
    root.appendChild(labelled('Tincture 2', tinctureSwatches(f.tinctures[1], t => { f.tinctures[1] = t; render(); })));
    root.appendChild(el('div', { class: 'control' }, [el('label', { class: 'field' }, ['Count',
      Object.assign(el('input', { type: 'number', min: 2, max: 16, value: f.count || 6, oninput: e => { f.count = +e.target.value; render(); } }), {})])]));
  }

  // charges
  const charges = node.charges || (node.charges = []);
  const list = el('div', { class: 'charge-list' });
  charges.forEach((c, i) => list.appendChild(chargeRow(c, i, charges)));
  root.appendChild(el('div', { class: 'control' }, [
    el('div', { class: 'control-head' }, [el('span', {}, ['Charges']),
      el('button', { class: 'btn small', type: 'button', onclick: () => { charges.push({ charge: 'lionRampant', t: 'or', p: 'e', size: 1 }); buildEditor(); render(); } }, ['+ Add'])]),
    list
  ]));
}

function chargeRow(c, i, charges) {
  return el('div', { class: 'charge-row' }, [
    chargeSelect(c.charge, v => { c.charge = v; render(); }),
    select(c.t, tinctureOptions(), v => { c.t = v; render(); }),
    select(c.p || 'e', Object.entries(POSITION_PRESETS), v => { c.p = v; render(); }),
    select(c.size || 1, Object.entries(SIZE_PRESETS), v => { c.size = +v; render(); }),
    el('button', { class: 'btn small danger', type: 'button', onclick: () => { charges.splice(i, 1); buildEditor(); render(); } }, ['✕'])
  ]);
}

function chargeSelect(value, onChange) {
  const s = el('select', { onchange: e => onChange(e.target.value) });
  const cats = H.chargeCategories;
  const byCat = {};
  Object.entries(H.chargeManifest).forEach(([name, m]) => { (byCat[m.cat] = byCat[m.cat] || []).push([name, m.label]); });
  Object.keys(cats).forEach(cat => {
    if (!byCat[cat]) return;
    const g = el('optgroup', { label: cats[cat] });
    byCat[cat].sort((a, b) => a[1].localeCompare(b[1])).forEach(([name, label]) => {
      const o = el('option', { value: name }); o.textContent = label;
      if (name === value) o.selected = true;
      g.appendChild(o);
    });
    s.appendChild(g);
  });
  return s;
}

function labelled(text, controlEl) {
  return el('div', { class: 'control' }, [el('span', { class: 'control-label' }, [text]), controlEl]);
}

// --- mutations ----------------------------------------------------------------
function setDivided(divided) {
  const node = getNode(selectedPath);
  if (divided && !node.parts) {
    delete node.field; delete node.charges; delete node.ordinaries;
    node.partition = 'quarterly';
    node.parts = Array.from({ length: 4 }, (_, i) => leafNode(['gules', 'or', 'azure', 'argent'][i]));
  } else if (!divided && node.parts) {
    delete node.partition; delete node.parts; delete node.rows; delete node.cols;
    node.field = { type: 'plain', tinctures: ['azure'] }; node.charges = [];
  }
  buildEditor(); render();
}
function setPartition(p) {
  const node = getNode(selectedPath);
  node.partition = p;
  if (p === 'grid') { node.rows = node.rows || 2; node.cols = node.cols || 2; rebuildGrid(node); }
  else {
    const n = PART_COUNT[p];
    while (node.parts.length < n) node.parts.push(leafNode('argent'));
    node.parts.length = n;
  }
  buildEditor(); render();
}
function rebuildGrid(node) {
  const n = Math.max(1, (node.rows || 2) * (node.cols || 2));
  while (node.parts.length < n) node.parts.push(leafNode('argent'));
  node.parts.length = n;
  render();
}
function setFieldType(t) {
  const node = getNode(selectedPath);
  const f = node.field;
  f.type = t;
  if (t === 'plain') f.tinctures = [f.tinctures[0] || 'azure'];
  else if (t === 'semy') { f.tinctures = [f.tinctures[0] || 'azure']; f.semyCharge = f.semyCharge || 'fleurDeLis'; f.semyTincture = f.semyTincture || 'or'; }
  else { f.tinctures = [f.tinctures[0] || 'or', f.tinctures[1] || 'gules']; f.count = f.count || 6; }
  buildEditor(); render();
}
function toggleInes(on) {
  const node = getNode(selectedPath);
  if (on) node.inescutcheon = leafNode('gules');
  else delete node.inescutcheon;
  buildEditor(); render();
}

// --- navigation ---------------------------------------------------------------
function navigate(path) { selectedPath = path; buildBreadcrumb(); buildEditor(); }
function buildBreadcrumb() {
  const bc = $('#breadcrumb'); bc.innerHTML = '';
  const crumb = (label, path) => el('button', { class: 'crumb', type: 'button', onclick: () => navigate(path) }, [label]);
  bc.appendChild(crumb('Shield', []));
  let path = [];
  selectedPath.forEach(step => {
    path = [...path, step];
    bc.appendChild(el('span', { class: 'sep' }, ['›']));
    bc.appendChild(crumb(step === 'ines' ? 'Inescutcheon' : `Part ${step + 1}`, path));
  });
}

// --- render -------------------------------------------------------------------
let renderToken = 0;
async function render() {
  const token = ++renderToken;
  await H.loadCharges(tree);
  if (token !== renderToken) return;
  $('#preview').innerHTML = H.renderCoatOfArms(tree);
  $('#blazon').textContent = H.blazon(tree);
  $('#warning').hidden = !H.violatesRuleOfTincture(tree);
  writeHash();
}

// --- presets / shield / export / share ----------------------------------------
function initTopbar() {
  $('#preset').appendChild(document.createComment(''));
  $('#preset').replaceChildren(...Object.entries(H.presets).map(([k, p]) => {
    const o = el('option', { value: k }); o.textContent = p.label; return o;
  }));
  $('#preset').value = 'charlesV';
  $('#preset').addEventListener('change', e => {
    tree = clone(H.presets[e.target.value].tree); selectedPath = [];
    $('#shield').value = tree.shield || 'spanish';
    buildBreadcrumb(); buildEditor(); render();
  });

  $('#shield').replaceChildren(...Object.keys(H.shields).map(k => {
    const o = el('option', { value: k }); o.textContent = H.shieldLabels[k] || k; return o;
  }));
  $('#shield').value = tree.shield || 'spanish';
  $('#shield').addEventListener('change', e => { tree.shield = e.target.value; render(); });

  $('#export-svg').addEventListener('click', exportSVG);
  $('#export-png').addEventListener('click', exportPNG);
  $('#share').addEventListener('click', shareLink);
}

function currentSVG() { return $('#preview').innerHTML; }
function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = el('a', { href: url, download: name }); document.body.appendChild(a); a.click();
  a.remove(); URL.revokeObjectURL(url);
}
function exportSVG() { downloadBlob(new Blob([currentSVG()], { type: 'image/svg+xml' }), 'coat-of-arms.svg'); }
function exportPNG() {
  const svg = currentSVG();
  const img = new Image();
  img.onload = () => {
    const canvas = el('canvas'); canvas.width = 800; canvas.height = 880;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(b => downloadBlob(b, 'coat-of-arms.png'));
  };
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

function writeHash() {
  try { history.replaceState(null, '', '#' + btoa(unescape(encodeURIComponent(JSON.stringify(tree))))); } catch (e) { /* ignore */ }
}
function shareLink() {
  writeHash();
  navigator.clipboard?.writeText(location.href);
  const b = $('#share'); const old = b.textContent; b.textContent = 'Copied!'; setTimeout(() => (b.textContent = old), 1200);
}
function loadHash() {
  if (!location.hash || location.hash.length < 2) return false;
  try { tree = JSON.parse(decodeURIComponent(escape(atob(location.hash.slice(1))))); return true; }
  catch (e) { return false; }
}

// --- boot ---------------------------------------------------------------------
initTopbar();
if (loadHash()) $('#shield').value = tree.shield || 'spanish';
buildBreadcrumb();
buildEditor();
render();
