// Foil follows the pointer across the hero (same damped follow as the tilt in base.js).
const stack = document.querySelector('.stack');
const hero = stack?.closest('.hero');
const ok = () => matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
let t = 0, x = 0, raf = 0;
const tick = () => {
  x += (t - x) * 0.1;
  stack.style.setProperty('--sx', x.toFixed(3));
  raf = Math.abs(t - x) > 0.001 ? requestAnimationFrame(tick) : 0;
};
const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
hero?.addEventListener('pointermove', (e) => {
  if (!ok()) return;
  const r = hero.getBoundingClientRect();
  t = ((e.clientX - r.left) / r.width) * 2 - 1;
  kick();
});
hero?.addEventListener('pointerleave', () => { t = 0; kick(); });

// Tighter build than base.js's page-wide order: drafts, sheet, then rows, all inside ~1.2s.
const at = (el, ms) => el?.style.setProperty('--d', `${ms}ms`);
document.querySelectorAll('.stack .sheet.back').forEach((el, k) => at(el, 60 * (1 - k)));
at(document.querySelector('.stack .floor'), 0);
at(document.querySelector('.stack .sheet.front'), 120);
document.querySelectorAll('.stack .toc li').forEach((el, k) => at(el, 320 + 50 * k));
