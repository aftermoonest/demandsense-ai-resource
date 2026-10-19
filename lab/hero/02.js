// The slab builds on its own clock (≈1.2s), not after the hero copy: plates first, then the lanes.
const s = document.querySelector('.stack');
const set = (sel, d) => s.querySelectorAll(sel).forEach((el, i) => el.style.setProperty('--d', `${d(i)}ms`));
set('.floor', () => 0);
set('.sheet.b2', () => 0);
set('.sheet.b1', () => 70);
set('.sheet.front', () => 140);
set('.toc li', (i) => 380 + i * 60);
