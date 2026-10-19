// Motion and interaction for the landing. No dependencies.
// Reveals: each section builds once when it enters the viewport, in the order its content reads
// (a board builds along its flow). Elements get .rv and a --i step; the section gets .in.
// Without JS nothing is hidden: the hidden state only exists under html.js.
const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

// ---------- Build order per section ----------
// Each entry is a group of selectors revealed together; groups follow each other.
const ORDER = [
  ['.topbar > *'],
  ['.head > *', '.hero-copy > *'],
  ['.stack .sheet.back', '.stack .floor'],
  ['.stack .sheet.front'],
  ['.toc li'],
  ['.cells > *', '.pass', '.versus > *', '.ways > *', '.hub .tools > div'],
  ['.chain .link', '.levels > *', '.hub .wire:not(.hot)', '.hub .core'],
  ['.hub .wire.hot', '.hub .dsc', '.hubcap', '.hubhelp'],
  ['.board-head', '.ctx > .node'],
  ['.grp.in > .node'],
  ['.flow > .wire:first-of-type'],
  ['.flow > .node.main'],
  ['.flow > .wire:last-of-type'],
  ['.grp.out > .node', '.board-note'],
  ['.gets li', '.stagefig', '.notes > *', '.post > *', '.steps li'],
  ['.stop'],
];
const STEP = 70; // ms between items of a group

const owns = new Map();
function prepare(section) {
  let t = 0;
  const owned = [];
  owns.set(section, owned);
  for (const group of ORDER) {
    const els = $$(group.join(','), section).filter((el) => !el.classList.contains('rv'));
    if (!els.length) continue;
    els.forEach((el, k) => { el.classList.add('rv'); owned.push(el); el.style.setProperty('--d', `${t + k * STEP}ms`); });
    t += Math.min(els.length, 4) * STEP + 80;
  }
  // Hairline icons draw their strokes; pathLength makes the dash maths size-free.
  $$('.ico svg :is(path, polygon)', section).forEach((p) => p.setAttribute('pathLength', '1'));
  const icons = $$('.ico', section).filter((el) => !el.closest('.rv-ico'));
  icons.forEach((el) => { el.classList.add('rv-ico'); owned.push(el); });
}

// Units build independently: tall blocks (boards, cell bands, lists) when they arrive themselves,
// the rest of a section with its header. Inner units claim their elements first.
const units = [...$$('.board, .bleed, .contrib, .rail, .hub, .versus, .ways'), ...$$('.hero, .sec')];
units.forEach(prepare);
root.classList.add('js');

const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) {
    e.target.classList.add('in');
    owns.get(e.target).forEach((el) => el.classList.add('on'));
    io.unobserve(e.target);
  }
}, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
units.forEach((u) => io.observe(u));

// ---------- Sticky tabs follow the scroll ----------
const tabs = document.querySelector('.tabs');
if (tabs) {
  const links = $$('.tab', tabs);
  const panels = links.map((a) => document.querySelector(a.getAttribute('href')));
  const bar = tabs.querySelector('.tab-ind');
  let current = -1;
  const update = () => {
    const y = tabs.getBoundingClientRect().bottom + 24;
    let i = 0;
    panels.forEach((p, k) => { if (p.getBoundingClientRect().top <= y) i = k; });
    const p = panels[i].getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (y - p.top) / Math.max(1, p.height - innerHeight / 2)));
    tabs.style.setProperty('--progress', progress.toFixed(3));
    if (i === current) return;
    current = i;
    tabs.style.setProperty('--tab', i);
    links.forEach((a, k) => a.setAttribute('aria-current', String(k === i)));
  };
  let queued = false;
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; update(); }); } }, { passive: true });
  addEventListener('resize', update);
  update();
  tabs.addEventListener('click', (e) => {
    const a = e.target.closest('.tab');
    if (!a) return;
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    scrollTo({ top: target.getBoundingClientRect().top + scrollY - tabs.offsetHeight - 8, behavior: reduced.matches ? 'auto' : 'smooth' });
    history.replaceState(null, '', a.getAttribute('href'));
  });
  // Arrow keys move between tabs (DESIGN §12).
  tabs.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const k = links.indexOf(document.activeElement);
    if (k < 0) return;
    links[(k + (e.key === 'ArrowRight' ? 1 : links.length - 1)) % links.length].focus();
    e.preventDefault();
  });
  if (bar) bar.hidden = false;
}

// ---------- Hero stack leans towards the pointer ----------
// A critically damped follow (lerp per frame), only on fine pointers and without reduced motion.
for (const stack of $$('.stack')) {
  const hero = stack.closest('.hero');
  let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
  const tick = () => {
    x += (tx - x) * 0.12; y += (ty - y) * 0.12;
    stack.style.setProperty('--rx', `${(-y * 4).toFixed(2)}deg`);
    stack.style.setProperty('--ry', `${(x * 6).toFixed(2)}deg`);
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  hero.addEventListener('pointermove', (e) => {
    if (!fine.matches || reduced.matches) return;
    const r = stack.getBoundingClientRect();
    tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width)));
    ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height)));
    kick();
  });
  hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; kick(); });
}
