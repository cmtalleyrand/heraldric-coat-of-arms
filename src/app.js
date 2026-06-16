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
form.addEventListener('input', update);
form.addEventListener('change', update);
form.addEventListener('submit', event => event.preventDefault());
update();
