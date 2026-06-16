const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const heraldry = require('../src/heraldry');

function createClassList() {
  const classes = new Set();
  return {
    add(value) { classes.add(value); },
    remove(value) { classes.delete(value); },
    contains(value) { return classes.has(value); },
    toggle(value, force) {
      const shouldAdd = force === undefined ? !classes.has(value) : force;
      if (shouldAdd) classes.add(value);
      else classes.delete(value);
      return shouldAdd;
    }
  };
}

function createElement(tagName) {
  return {
    tagName,
    children: [],
    attributes: new Map(),
    listeners: new Map(),
    classList: createClassList(),
    textContent: '',
    value: '',
    selectedIndex: 0,
    options: [],
    set className(value) {
      value.split(/\s+/).filter(Boolean).forEach(item => this.classList.add(item));
    },
    set innerHTML(value) {
      this.html = value;
      this.options = [...value.matchAll(/<option value="([^"]+)">([^<]+)<\/option>/g)].map(match => ({
        value: match[1],
        textContent: match[2]
      }));
      this.value = this.options[0]?.value || '';
      this.selectedIndex = 0;
    },
    get innerHTML() {
      return this.html || '';
    },
    setAttribute(name, value) {
      this.attributes.set(name, value);
    },
    getAttribute(name) {
      return this.attributes.get(name);
    },
    addEventListener(type, listener) {
      this.listeners.set(type, listener);
    },
    dispatchEvent(event) {
      this.listeners.get(event.type)?.(event);
    },
    append(...items) {
      this.children.push(...items);
    },
    after(item) {
      this.afterNode = item;
    },
    querySelector(selector) {
      if (selector === 'button') return this.children.find(child => child.tagName === 'button');
      return undefined;
    }
  };
}

function createContext() {
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
  const selectNodes = ['#field', '#ordinary', '#ordinaryTincture', '#charge', '#chargeTincture', '#layout']
    .map(selector => [selector, createElement('select')]);
  const nodes = new Map([
    ['#arms-form', form],
    ['#preview', { innerHTML: '' }],
    ['#warning', { hidden: false }],
    ['#blazon', { textContent: '' }],
    ...selectNodes
  ]);
  const document = {
    querySelector: selector => nodes.get(selector),
    querySelectorAll(selector) {
      if (selector === 'select') return selectNodes.map(([, node]) => node);
      if (selector === '.select-menu.is-open') return [];
      return [];
    },
    createElement
  };

  return {
    listeners,
    state,
    nodes,
    context: {
      window: { heraldry },
      document,
      Event: class {
        constructor(type) {
          this.type = type;
        }
      },
      FormData: class {
        constructor(target) {
          this.target = target;
        }
        entries() {
          return Object.entries(this.target.state);
        }
      }
    }
  };
}

test('select change events refresh the preview', () => {
  const { context, listeners, state, nodes } = createContext();

  vm.runInNewContext(readFileSync('src/app.js', 'utf8'), context);
  const originalPreview = nodes.get('#preview').innerHTML;

  state.charge = 'eagle';
  listeners.get('change')({});

  assert.notEqual(nodes.get('#preview').innerHTML, originalPreview);
  assert.match(nodes.get('#preview').innerHTML, /🦅/);
});

test('native select input events refresh the preview', () => {
  const { context, listeners, state, nodes } = createContext();

  vm.runInNewContext(readFileSync('src/app.js', 'utf8'), context);
  const originalPreview = nodes.get('#preview').innerHTML;

  state.field = 'azure';
  listeners.get('input')({});

  assert.notEqual(nodes.get('#preview').innerHTML, originalPreview);
});
