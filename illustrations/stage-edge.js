/* Stage edge: a spring carries the pool of light over the boards; the lamp turns to it and the beam is
   re-cast from the lens. Every ray runs from the lens rim to the pool's rim, so the cone always closes on the pool.
   cfg: rest, from (enter sweep start), box (clamp in viewBox units), pivot (lamp pin), lens (pin to lens),
   bn (beam half width at the lens), bf (pool half width). */
window.StageEdge = {
  mount(fig, cfg) {
    const svg = fig.querySelector('svg'), $ = (s) => svg.querySelector(s);
    const lamp = $('#lamp'), pool = $('#pool'), clip = $('#pclip'), rays = [...$('#beam').querySelectorAll('[data-k]')];
    const [px, py] = cfg.pivot, [bx0, by0, bx1, by1] = cfg.box, vb = svg.viewBox.baseVal;
    new ResizeObserver(() => fig.style.setProperty('--sw', (vb.width / (svg.getBoundingClientRect().width || vb.width)).toFixed(3))).observe(svg);
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v)), r = (n) => Math.round(n * 100) / 100;
    const s = { x: cfg.rest[0], y: cfg.rest[1], vx: 0, vy: 0, tx: cfg.rest[0], ty: cfg.rest[1] };
    let raf = 0, last = 0;

    function render(x, y) {
      const dx = x - px, dy = y - py, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
      const lx = px + ux * cfg.lens, ly = py + uy * cfg.lens;
      lamp.setAttribute('transform', `translate(${px} ${py}) rotate(${r(Math.atan2(-dx, dy) * 180 / Math.PI)})`);
      for (const p of rays) {
        const k = +p.dataset.k;
        p.setAttribute('d', `M${r(lx + uy * cfg.bn * k)} ${r(ly - ux * cfg.bn * k)}L${r(x + cfg.bf * k)} ${r(y)}`);
      }
      pool.setAttribute('transform', `translate(${r(x)} ${r(y)})`);
      clip.setAttribute('transform', `translate(${r(x)} ${r(y)})`);
    }
    function tick(t) {
      const dt = Math.min((t - last) / 1000 || 0.016, 0.034); last = t;
      const k = 120, c = 22; // critically damped: the light glides and lands without a wobble
      s.vx += (k * (s.tx - s.x) - c * s.vx) * dt; s.vy += (k * (s.ty - s.y) - c * s.vy) * dt;
      s.x += s.vx * dt; s.y += s.vy * dt; render(s.x, s.y);
      raf = Math.hypot(s.tx - s.x, s.ty - s.y) < 0.05 && Math.hypot(s.vx, s.vy) < 0.05 ? 0 : requestAnimationFrame(tick);
    }
    const aim = (x, y) => { s.tx = x; s.ty = y; if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };

    render(...cfg.rest);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { fig.classList.add('in'); return; }
    if (cfg.from && !location.search.includes('still')) { s.x = cfg.from[0]; s.y = cfg.from[1]; render(s.x, s.y); }
    new IntersectionObserver(([e], io) => {
      if (!e.isIntersecting) return;
      io.disconnect(); fig.classList.add('in');
      setTimeout(() => aim(...cfg.rest), 900);
    }, { threshold: 0.2 }).observe(fig);

    // The pointer anywhere over the drawing steers the light; its height maps onto the floor's depth.
    let on = false;
    fig.addEventListener('pointermove', (e) => {
      if (!fig.classList.contains('in') || e.pointerType === 'touch') return;
      const b = svg.getBoundingClientRect(), fx = (e.clientX - b.left) / b.width, fy = (e.clientY - b.top) / b.height;
      aim(clamp(bx0 + fx * (bx1 - bx0), bx0, bx1), clamp(by0 + fy * (by1 - by0), by0, by1)); on = true;
    });
    const home = () => { if (on) { on = false; aim(...cfg.rest); } };
    fig.addEventListener('pointerleave', home); fig.addEventListener('pointercancel', home);
  },
};
document.querySelectorAll('.edgefig[data-cfg]').forEach((f) => StageEdge.mount(f, JSON.parse(f.dataset.cfg)));
