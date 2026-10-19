// Hero pile leans towards the pointer (same damped follow as base.js), and the sheen follows it.
// Fine pointers only, never under reduced motion. Block scope: base.js already declares `fine` globally.
{
const pile = document.querySelector('.pile');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const still = matchMedia('(prefers-reduced-motion: reduce)');
if (pile) {
  let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
  const tick = () => {
    x += (tx - x) * 0.1; y += (ty - y) * 0.1;
    pile.style.setProperty('--rx', `${(-y * 4).toFixed(2)}deg`);
    pile.style.setProperty('--ry', `${(x * 6).toFixed(2)}deg`);
    pile.style.setProperty('--mx', x.toFixed(3));
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  const hero = pile.closest('.hero');
  hero.addEventListener('pointermove', (e) => {
    if (!fine.matches || still.matches) return;
    const r = pile.getBoundingClientRect();
    tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / r.width));
    ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / r.height));
    kick();
  });
  hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; kick(); });
}
}
