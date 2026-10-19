import { mount } from './mount.js';

// Every element with [data-wave] gets a live ribbon. Pass overrides as JSON: data-wave='{"speed":0.05}'.
for (const host of document.querySelectorAll('[data-wave]')) {
  let options = {};
  try { options = JSON.parse(host.dataset.wave || '{}'); } catch { /* keep defaults */ }
  mount(host, options);
}
window.DSWave = { mount };
