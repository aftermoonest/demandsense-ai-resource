/* Shared spot logic. A spring carries the spot; the lamp turns to it and the beam is re-cast from the lens.
   cfg: rest, from, box (clamp), pivot (lamp pin), lens (pin to lens), bn / bf (beam half width at the lens / at the pool), span (optional: pointer x range that maps onto box x). */
window.Stage = {
  mount(fig, cfg) {
    const svg = fig.querySelector('svg'), $ = (s) => svg.querySelector(s);
    const lamp = $('#lamp'), beam = $('#beam'), pool = $('#pool'), clip = $('#pclip');
    const rays = [...beam.querySelectorAll('[data-k]')];
    const [px, py] = cfg.pivot, L = cfg.lens, [bx0, by0, bx1, by1] = cfg.box;
    const vb = svg.viewBox.baseVal;
    new ResizeObserver(() => fig.style.setProperty('--sw', (vb.width / (svg.getBoundingClientRect().width || vb.width)).toFixed(3))).observe(svg);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const s = { x: cfg.rest[0], y: cfg.rest[1], vx: 0, vy: 0, tx: cfg.rest[0], ty: cfg.rest[1] };
    let raf = 0, last = 0;

    function render(x, y) {
      const dx = x - px, dy = y - py, d = Math.hypot(dx, dy), th = Math.atan2(-dx, dy), deg = th * 180 / Math.PI;
      const lx = px + dx / d * L, ly = py + dy / d * L, r = (n) => Math.round(n * 100) / 100;
      lamp.setAttribute('transform', `translate(${px} ${py}) rotate(${r(deg)})`);
      beam.setAttribute('transform', `translate(${r(lx)} ${r(ly)}) rotate(${r(deg)})`);
      const len = r(Math.max(d - L, 1));
      for (const p of rays) p.setAttribute('d', `M${r(cfg.bn * p.dataset.k)} 0L${r(cfg.bf * p.dataset.k)} ${len}`);
      pool.setAttribute('transform', `translate(${r(x)} ${r(y)})`);
      clip.setAttribute('transform', `translate(${r(x)} ${r(y)})`);
      if (cfg.extra) cfg.extra(x, y);
    }
    function tick(t) {
      const dt = Math.min((t - last) / 1000 || 0.016, 0.034); last = t;
      const k = 190, c = 24; // slightly under critical: settles without a wobble
      s.vx += (k * (s.tx - s.x) - c * s.vx) * dt; s.vy += (k * (s.ty - s.y) - c * s.vy) * dt;
      s.x += s.vx * dt; s.y += s.vy * dt; render(s.x, s.y);
      const rest = Math.hypot(s.tx - s.x, s.ty - s.y) < 0.05 && Math.hypot(s.vx, s.vy) < 0.05;
      raf = rest ? 0 : requestAnimationFrame(tick);
    }
    const go = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
    const aim = (x, y) => { s.tx = x; s.ty = y; go(); };

    render(...cfg.rest);
    if (reduce) { fig.classList.add('in'); return; }
    if (cfg.from && !location.search.includes('still')) { s.x = cfg.from[0]; s.y = cfg.from[1]; render(s.x, s.y); }
    new IntersectionObserver(([e], io) => {
      if (!e.isIntersecting) return;
      io.disconnect(); fig.classList.add('in');
      setTimeout(() => aim(...cfg.rest), 650);
    }, { threshold: 0.2 }).observe(fig);

    let on = false;
    fig.addEventListener('pointermove', (e) => {
      if (!fig.classList.contains('in')) return;
      const r = svg.getBoundingClientRect(), k = vb.width / r.width;
      const ux = (e.clientX - r.left) * k, [sa, sb] = cfg.span || [bx0, bx1];
      aim(clamp(bx0 + (ux - sa) / (sb - sa) * (bx1 - bx0), bx0, bx1), clamp((e.clientY - r.top) * k, by0, by1)); on = true;
    });
    const home = () => { if (on) { on = false; aim(...cfg.rest); } };
    fig.addEventListener('pointerleave', home); fig.addEventListener('pointercancel', home);
  },
};
