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
  ['.head > *', '.hero-copy > *'],
  ['.stack .sheet.back', '.stack .floor'],
  ['.stack .sheet.front'],
  ['.toc li'],
  ['.cells > article', '.cells > .fact', '.tl > .stop', '.spot', '.facts li', '.versus > *', '.ways > *', '.hub .tools > div'],
  ['.chain .link', '.levels > *'],
  ['.board-head'],
  ['.flow .node'],
  ['.flow > .links', '.hub > .links'],
  ['.hub > .core'],
  ['.hub > .dsc', '.board-note', '.hubcap', '.hubhelp'],
  ['.gets li', '.notes > *', '.post > *', '.steps li'],
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
const units = [...$$('.board, div.bleed, .lv-bar, .contrib, .rail, .hub, .versus, .ways'), ...$$('.hero, .sec')];
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
    scrollTo({ top: target.getBoundingClientRect().top + scrollY + parseFloat(getComputedStyle(target).paddingTop) - tabs.offsetHeight - 8, behavior: reduced.matches ? 'auto' : 'smooth' });
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
// A flow is a row of columns; every block links to every block in the next column.
// Measured from layout offsets (not getBoundingClientRect), so reveal transforms never skew them.
// Side by side: curves between columns. Stacked: L-shaped lines down a left spine.
// Once built, a packet runs the flow column by column (TRAVEL each) on a LOOP while it is on screen.
const COL = 260, TRAVEL = 900;
function pos(el, box) {
  let x = 0, y = 0, n = el;
  while (n && n !== box) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
  return { l: x, t: y, r: x + el.offsetWidth, b: y + el.offsetHeight, y: y + el.offsetHeight / 2 };
}
const columns = (box) => $$(':scope > :not(.links, .pulse)', box).map((c) => c.matches('.col, .tools') ? [...c.children] : [c]);
function drawLinks(box) {
  const svg = box.querySelector(':scope > .links');
  if (!svg) return;
  const cols = columns(box);
  const stacked = getComputedStyle(box).gridTemplateColumns.trim().split(/\s+/).length === 1;
  const links = [], ports = new Map();
  const port = (x, y, ld) => { const k = `${x},${y}`; if (!ports.has(k)) ports.set(k, `<circle class="tip" style="--ld:${ld}ms" cx="${x}" cy="${y}" r="2.5"/>`); };
  cols.forEach((col, c) => col.forEach((el) => { el.style.setProperty('--col', c); }));
  for (let c = 0; c + 1 < cols.length; c++) {
    const ld = c * COL + 120;
    for (const ea of cols[c]) for (const eb of cols[c + 1]) {
      const a = pos(ea, box), b = pos(eb, box);
      let d;
      if (!stacked) {
        // strict lines: 25% horizontal, 50% diagonal, 25% horizontal (45° when the rise is half the gap)
        const x1 = a.r + 4, x2 = b.l - 4, w = x2 - x1;
        d = `M${x1} ${a.y}h${w / 4}L${x2 - w / 4} ${b.y}H${x2}`;
        port(x1, a.y, ld); port(x2, b.y, ld);
      } else {
        const x = 12, r = 8;
        d = `M${a.l - 4} ${a.y}H${x + r}L${x} ${a.y + r}V${b.y - r}L${x + r} ${b.y}H${b.l - 4}`;
        port(a.l - 4, a.y, ld); port(b.l - 4, b.y, ld);
      }
      links.push({ d, ld, c });
    }
  }
  svg.setAttribute('viewBox', `0 0 ${box.offsetWidth} ${box.offsetHeight}`);
  svg.innerHTML = links.map((k) => `<path pathLength="1" style="--ld:${k.ld}ms" d="${k.d}"/>`).join('') + [...ports.values()].join('');
  // packets ride the same paths
  $$(':scope > .pulse', box).forEach((p) => p.remove());
  links.forEach((k) => {
    const p = document.createElement('i');
    p.className = 'pulse';
    p.style.offsetPath = `path("${k.d}")`;
    p.style.setProperty('--col', k.c);
    box.append(p);
  });
}
const flows = $$('.flow, .hub');
// Boards build column by column; each column's wires draw as it lands
flows.forEach((box) => {
  const base = parseFloat(box.querySelector(':scope > .links')?.style.getPropertyValue('--d')) || 0;
  columns(box).forEach((col, c) => col.forEach((el, k) => { if (el.classList.contains('rv') && box.matches('.flow')) el.style.setProperty('--d', `${base + c * COL + k * 50}ms`); }));
});
const redraw = () => flows.forEach(drawLinks);
redraw();
document.fonts?.ready.then(redraw);
let rz = 0;
addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(redraw); });
// The loop plays only while the flow is on screen, and only after it has built
const playIO = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle('play', e.isIntersecting && e.target.classList.contains('built'))), { threshold: 0.2 });
flows.forEach((box) => {
  const svg = box.querySelector(':scope > .links');
  new MutationObserver((_, mo) => {
    if (!svg.classList.contains('on')) return;
    mo.disconnect();
    const built = (parseFloat(svg.style.getPropertyValue('--d')) || 0) + columns(box).length * COL + 600;
    setTimeout(() => { box.classList.add('built', 'play'); playIO.observe(box); }, built);
  }).observe(svg, { attributes: true, attributeFilter: ['class'] });
});


// ---------- Sticky bar: takes the theme of the section under it ----------
const bar = document.querySelector('.sitebar');
if (bar) {
  const darks = $$('.surface-black').filter((el) => el.matches('header, section'));
  const hero = document.querySelector('header.hero');
  const theme = () => {
    const y = bar.offsetHeight / 2;
    bar.classList.toggle('on', hero.getBoundingClientRect().bottom <= bar.offsetHeight);
    bar.dataset.theme = darks.some((el) => { const r = el.getBoundingClientRect(); return r.top <= y && r.bottom > y; }) ? 'dark' : 'light';
  };
  addEventListener('scroll', theme, { passive: true });
  addEventListener('resize', theme);
  theme();
}
