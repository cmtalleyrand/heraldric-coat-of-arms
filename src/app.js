const { tinctures, ordinaries, charges, chargeLayouts, normalizeOptions, violatesRuleOfTincture, renderCoatOfArms } = window.heraldry;

const form = document.querySelector('#arms-form');
const preview = document.querySelector('#preview');
const warning = document.querySelector('#warning');
const blazon = document.querySelector('#blazon');

function optionList(source) {
  return Object.entries(source).map(([value, item]) => `<option value="${value}">${item.label}</option>`).join('');
}

function populate() {
  document.querySelector('#field').innerHTML = optionList(tinctures);
  document.querySelector('#ordinary').innerHTML = optionList(ordinaries);
  document.querySelector('#ordinaryTincture').innerHTML = optionList(tinctures);
  document.querySelector('#charge').innerHTML = optionList(charges);
  document.querySelector('#chargeTincture').innerHTML = optionList(tinctures);
  document.querySelector('#layout').innerHTML = Object.keys(chargeLayouts).map(key => `<option value="${key}">${key}</option>`).join('');
}

function closeDropdown(dropdown) {
  dropdown.classList.remove('is-open');
  dropdown.querySelector('button').setAttribute('aria-expanded', 'false');
}

function enhanceSelect(select) {
  const dropdown = document.createElement('div');
  dropdown.className = 'select-menu';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'select-menu__trigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');

  const list = document.createElement('div');
  list.className = 'select-menu__list';
  list.setAttribute('role', 'listbox');

  Array.from(select.options).forEach(option => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'select-menu__option';
    item.textContent = option.textContent;
    item.setAttribute('role', 'option');
    item.addEventListener('click', () => {
      select.value = option.value;
      trigger.textContent = option.textContent;
      closeDropdown(dropdown);
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    list.append(item);
  });

  trigger.textContent = select.options[select.selectedIndex].textContent;
  trigger.addEventListener('click', () => {
    const willOpen = !dropdown.classList.contains('is-open');
    document.querySelectorAll('.select-menu.is-open').forEach(closeDropdown);
    dropdown.classList.toggle('is-open', willOpen);
    trigger.setAttribute('aria-expanded', String(willOpen));
  });

  select.classList.add('native-select');
  select.after(dropdown);
  dropdown.append(trigger, list);
}

function enhanceSelects() {
  document.querySelectorAll('select').forEach(enhanceSelect);
}

function readOptions() {
  return normalizeOptions(Object.fromEntries(new FormData(form).entries()));
}

function update() {
  const options = readOptions();
  preview.innerHTML = renderCoatOfArms(options);
  warning.hidden = !violatesRuleOfTincture(options);
  const ordinary = options.ordinary === 'none' ? 'plain' : ordinaries[options.ordinary].label.toLowerCase();
  blazon.textContent = `${tinctures[options.field].label}, ${ordinary} ${tinctures[options.ordinaryTincture].label}, charged with ${options.layout} ${charges[options.charge].label.toLowerCase()} ${tinctures[options.chargeTincture].label}.`;
}

populate();
enhanceSelects();
form.addEventListener('input', update);
form.addEventListener('change', update);
form.addEventListener('submit', event => event.preventDefault());
update();
