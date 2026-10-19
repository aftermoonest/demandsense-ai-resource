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
  ['.cells > article', '.cells > .fact', '.pass', '.versus > *', '.ways > *', '.hub .tools > div'],
  ['.chain .link', '.levels > *'],
  ['.board-head', '.ctx > .node'],
  ['.grp.in > .node'],
  ['.flow > .links', '.hub > .links'],
  ['.flow > .node.main', '.hub > .core'],
  ['.grp.out > .node', '.hub > .dsc', '.board-note', '.hubcap', '.hubhelp'],
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

// ---------- Numbers count up once (DESIGN §11) ----------
// "500-600" counts both ends; tabular figures keep the width steady.
const countIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    countIO.unobserve(e.target);
    const el = e.target, text = el.textContent, nums = text.match(/\d+/g).map(Number);
    const t0 = performance.now(), dur = 1400;
    const frame = (now) => {
      const k = Math.min(1, (now - t0) / dur), ease = 1 - Math.pow(1 - k, 4);
      let i = 0;
      el.textContent = text.replace(/\d+/g, () => String(Math.round(nums[i++] * ease)));
      if (k < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}, { threshold: 0.8 });
if (!reduced.matches) $$('[data-count]').forEach((el) => countIO.observe(el));

// ---------- Links between blocks (boards and the stack hub) ----------
// Measured from layout offsets (not getBoundingClientRect), so reveal transforms never skew them.
// Side by side: curves fan into the main block and out of it. Stacked: L-shaped lines down a left spine.
function pos(el, box) {
  let x = 0, y = 0, n = el;
  while (n && n !== box) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
  return { l: x, t: y, r: x + el.offsetWidth, b: y + el.offsetHeight, y: y + el.offsetHeight / 2 };
}
const tip = (x, y, dir) => dir === 'd' ? `M${x - 3.5} ${y - 6}L${x} ${y}L${x + 3.5} ${y - 6}Z` : `M${x - 6} ${y - 3.5}L${x} ${y}L${x - 6} ${y + 3.5}Z`;
function drawLinks(box) {
  const svg = box.querySelector(':scope > .links');
  const main = box.querySelector(':scope > .node.main, :scope > .core');
  if (!svg || !main) return;
  const ins = $$(':scope > .grp.in > .node, :scope > .tools > div', box);
  const outs = $$(':scope > .grp.out > .node, :scope > .dsc', box);
  const m = pos(main, box), W = box.offsetWidth, H = box.offsetHeight;
  const stacked = getComputedStyle(box).gridTemplateColumns.trim().split(/\s+/).length === 1;
  const base = parseFloat(svg.style.getPropertyValue('--d')) || 0;
  const links = [];
  if (!stacked) {
    const curve = (x1, y1, x2, y2) => { const dx = (x2 - x1) * 0.55; return `M${x1} ${y1}C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`; };
    ins.forEach((e, i) => { const a = pos(e, box); links.push({ d: curve(a.r, a.y, m.l - 1, m.y), end: tip(m.l - 1, m.y, 'r'), delay: i * 50 }); });
    outs.forEach((e, i) => { const a = pos(e, box); links.push({ d: curve(m.r, m.y, a.l - 1, a.y), end: tip(a.l - 1, a.y, 'r'), delay: 700 + i * 50, out: true }); });
  } else {
    const x = 12, r = 8;
    ins.forEach((e, i) => { const a = pos(e, box); links.push({ d: `M${a.l} ${a.y}H${x + r}Q${x} ${a.y} ${x} ${a.y + r}V${m.t - 1}`, end: i === ins.length - 1 ? tip(x, m.t - 1, 'd') : '', delay: i * 50 }); });
    outs.forEach((e, i) => { const a = pos(e, box); links.push({ d: `M${x} ${m.b}V${a.y - r}Q${x} ${a.y} ${x + r} ${a.y}H${a.l - 1}`, end: tip(a.l - 1, a.y, 'r'), delay: 700 + i * 50, out: true }); });
  }
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = links.map((k) => `<path pathLength="1" style="--ld:${base + k.delay}ms" d="${k.d}"/>${k.end ? `<path class="tip" style="--ld:${base + k.delay}ms" d="${k.end}"/>` : ''}`).join('');
  // pulses ride the same paths
  $$(':scope > .pulse', box).forEach((p) => p.remove());
  links.forEach((k) => {
    const p = document.createElement('i');
    p.className = 'pulse';
    p.style.offsetPath = `path("${k.d}")`;
    p.style.setProperty('--pd', `${k.out ? 900 : 0}ms`);
    box.append(p);
  });
}
function pulse(box) {
  if (reduced.matches) return;
  $$(':scope > .pulse', box).forEach((p) => { p.classList.remove('go'); void p.offsetWidth; p.classList.add('go'); });
}
const flows = $$('.flow, .hub');
const redraw = () => flows.forEach(drawLinks);
redraw();
document.fonts?.ready.then(redraw);
let rz = 0;
addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(redraw); });
flows.forEach((box) => {
  const svg = box.querySelector(':scope > .links');
  // the first pulse runs once the links have drawn; a hover replays it
  new MutationObserver((_, mo) => {
    if (!svg.classList.contains('on')) return;
    mo.disconnect();
    setTimeout(() => pulse(box), (parseFloat(svg.style.getPropertyValue('--d')) || 0) + 900);
  }).observe(svg, { attributes: true, attributeFilter: ['class'] });
  if (fine.matches) box.addEventListener('mouseenter', () => pulse(box));
});

// ---------- Contributor pass: holographic foil and tilt follow the pointer ----------
const pass = document.querySelector('.pass');
if (pass && fine.matches) {
  pass.addEventListener('pointermove', (e) => {
    if (reduced.matches) return;
    const r = pass.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    pass.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
    pass.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
    pass.style.setProperty('--ry', `${((x - 0.5) * 10).toFixed(2)}deg`);
    pass.style.setProperty('--rx', `${((0.5 - y) * 8).toFixed(2)}deg`);
  });
  pass.addEventListener('pointerleave', () => { pass.style.setProperty('--rx', '0deg'); pass.style.setProperty('--ry', '0deg'); });
}
