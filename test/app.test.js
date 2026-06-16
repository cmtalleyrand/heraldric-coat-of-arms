const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const heraldry = require('../src/heraldry');

test('select change events refresh the preview', () => {
  const listeners = new Map();
  const state = {
    field: 'gules',
    ordinary: 'chevron',
    ordinaryTincture: 'or',
    charge: 'lion',
    chargeTincture: 'argent',
    layout: 'one',
    motto: 'Fortune Favours the Bold'
  };
  const form = {
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    state
  };
  const nodes = new Map([
    ['#arms-form', form],
    ['#preview', { innerHTML: '' }],
    ['#warning', { hidden: false }],
    ['#blazon', { textContent: '' }],
    ['#field', { innerHTML: '' }],
    ['#ordinary', { innerHTML: '' }],
    ['#ordinaryTincture', { innerHTML: '' }],
    ['#charge', { innerHTML: '' }],
    ['#chargeTincture', { innerHTML: '' }],
    ['#layout', { innerHTML: '' }]
  ]);
  const context = {
    window: { heraldry },
    document: { querySelector: selector => nodes.get(selector) },
    FormData: class {
      constructor(target) {
        this.target = target;
      }
      entries() {
        return Object.entries(this.target.state);
      }
    }
  };

  vm.runInNewContext(readFileSync('src/app.js', 'utf8'), context);
  const originalPreview = nodes.get('#preview').innerHTML;

  state.charge = 'eagle';
  listeners.get('change')({});

  assert.notEqual(nodes.get('#preview').innerHTML, originalPreview);
  assert.match(nodes.get('#preview').innerHTML, /🦅/);
});
