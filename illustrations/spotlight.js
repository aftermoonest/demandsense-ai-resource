/* Followspot (iso-glow look): a small 3D model of the lamp, re-projected isometrically every frame so it
   really aims at the pool. The pool wanders over the whole section on its own and follows the pointer;
   the beam is drawn in section pixels behind the content. */
document.querySelectorAll('.spotsec').forEach((sec, n) => {
  // area: what the beam covers (#get: its sticky stage). data-spot="front": the lamp is seen straight on (no iso),
  // hangs from a rod that runs off the top (no pipe), and the pool rests on the [data-rest] headline instead of wandering.
  const area = sec.querySelector('.stage') || sec, still = sec.dataset.spot === 'front';
  const beam = sec.querySelector('.beam'), lampSvg = sec.querySelector('.lampfig svg'), $ = (s) => beam.querySelector(s);
  const cone = $('.cone'), core = $('.core'), pool = $('.pool'), ghosts = [...beam.querySelectorAll('.ghosts circle')], fr = [...beam.querySelectorAll('.fringe')], grad = $('linearGradient');
  const lit = [...sec.querySelectorAll('[data-lit]')];

  // ---- iso kernel ----
  const C = Math.cos(Math.PI / 6), S = Math.sin(Math.PI / 6), R3 = Math.sqrt(3);
  const V = still ? [0, -1, 0] : [1 / R3, 1 / R3, 1 / R3]; // towards the viewer
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = (a) => mul(a, 1 / Math.hypot(...a));
  const P = still ? (p) => [p[0], -p[2]] : (p) => [(p[0] - p[1]) * C, (p[0] + p[1]) * S - p[2]];
  const f = (n) => Math.round(n * 10) / 10;
  const poly = (pts, close) => 'M' + pts.map((p) => f(p[0]) + ' ' + f(p[1])).join('L') + (close ? 'Z' : '');
  const hull = (pts) => { // monotone chain
    pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const p of pts) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (const p of pts.reverse()) { while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  };
  const basis = (a) => { let u = cross(a, [0, 0, 1]); u = Math.hypot(...u) < 1e-3 ? [Math.SQRT1_2, -Math.SQRT1_2, 0] : norm(u); return [u, cross(u, a)]; };

  // A turned part: rings along axis a. Fill = hull, outline = hull, visible half of every ring, the cap facing us.
  function lathe(c, a, prof, o = {}) {
    const [u, w] = basis(a), A = dot(u, V), B = dot(w, V), tv = Math.atan2(B, A), N = 40;
    const ring = (t, r, t0, t1) => { const out = []; for (let i = 0; i <= N; i++) { const th = t0 + (t1 - t0) * i / N; out.push(P(add(add(c, mul(a, t)), add(mul(u, r * Math.cos(th)), mul(w, r * Math.sin(th)))))); } return out; };
    const all = prof.flatMap(([t, r]) => ring(t, r, 0, Math.PI * 2));
    let s = `<path class="sil${o.cls ? ' ' + o.cls : ''}" d="${poly(hull(all), 1)}"/>`;
    prof.forEach(([t, r], i) => { if (i && i < prof.length - 1) s += `<path class="nf${o.cls ? ' ' + o.cls : ''}${r === prof[i - 1][1] || r === prof[i + 1][1] ? '' : ' lo'}" d="${poly(ring(t, r, tv - Math.PI / 2, tv + Math.PI / 2))}"/>`; });
    const front = dot(a, V) > 0, [tc, rc] = front ? prof[prof.length - 1] : prof[0];
    s += `<path class="${o.cls || ''}" d="${poly(ring(tc, rc, 0, Math.PI * 2), 1)}"/>`;
    if (o.lens && front) {
      s += `<path class="lens halo" filter="url(#lamp-glow${n})" d="${poly(ring(tc + 0.5, o.lens, 0, Math.PI * 2), 1)}"/>`;
      s += `<path class="lens" d="${poly(ring(tc + 0.5, o.lens, 0, Math.PI * 2), 1)}"/>`;
    }
    return s;
  }
  // A box from a centre and three half-axes; only the faces turned to us.
  function box(c, ex, ey, ez) {
    let s = '';
    for (const [n, p, q] of [[ex, ey, ez], [ey, ez, ex], [ez, ex, ey]]) for (const sg of [1, -1]) {
      const nn = mul(n, sg); if (dot(nn, V) <= 0) continue;
      const fc = add(c, nn);
      s += `<path class="sil" d="${poly([add(add(fc, p), q), add(add(fc, p), mul(q, -1)), add(add(fc, mul(p, -1)), mul(q, -1)), add(add(fc, mul(p, -1)), q)].map(P), 1)}"/>`;
    }
    return s;
  }

  const HP = 92, YT = 44, LENS_T = 58;
  const BODY = [[-40, 14], [-36, 19], [-31, 19], [-31, 24], [-28, 24], [-28, 19], [-24, 19], [-24, 24], [-21, 24], [-21, 19], [-17, 19], [-17, 24], [-14, 24], [-14, 19], [-10, 19], [-10, 24], [-7, 24], [-7, 19], [26, 19], [26, 21], [33, 21], [33, 17], [53, 17], [53, 20], [LENS_T, 20]];
  lampSvg.setAttribute('viewBox', '-150 -190 300 270');
  const defs = `<defs><filter id="lamp-glow${n}" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="10"/></filter>
    <linearGradient id="pipe-fade${n}" gradientUnits="userSpaceOnUse" x1="${f(P([-150, 0, HP])[0])}" y1="${f(P([-150, 0, HP])[1])}" x2="${f(P([150, 0, HP])[0])}" y2="${f(P([150, 0, HP])[1])}">
    <stop offset="0" stop-color="var(--neutral-800)" stop-opacity="0"/><stop offset=".35" stop-color="var(--neutral-800)"/><stop offset=".65" stop-color="var(--neutral-800)"/><stop offset="1" stop-color="var(--neutral-800)" stop-opacity="0"/></linearGradient></defs>`;
  const pipe = lathe([0, 0, HP], [1, 0, 0], [[-150, 7], [150, 7]], { cls: 'pipe' }).replaceAll('<path', `<path stroke="url(#pipe-fade${n})"`);

  function drawLamp(a) {
    const h = norm([a[0], a[1], 0].map((v, i) => (i < 2 && Math.hypot(a[0], a[1]) < 1e-3 ? (i ? -1 : 1) : v)));
    const uy = cross([0, 0, 1], h);
    const parts = [
      ...(still ? [[-999, box([0, 0, (YT + 4 + 400) / 2], [2.5, 0, 0], [0, 2.5, 0], [0, 0, (400 - YT - 4) / 2])]] : [
        [-1e3, box([0, 0, HP], [9, 0, 0], [0, 11, 0], [0, 0, 11]) + box([0, 0, HP - 13], [4, 0, 0], [0, 4, 0], [0, 0, 3])],
        [-999, box([0, 0, (YT + 4 + HP - 16) / 2], [2.5, 0, 0], [0, 2.5, 0], [0, 0, (HP - 16 - YT - 4) / 2])]]),
      [dot([0, 0, YT], V), box([0, 0, YT], mul(uy, 36), mul(h, 6), [0, 0, 4])],
      [0, lathe([0, 0, 0], a, BODY, { lens: 15 })],
    ];
    for (const sg of [1, -1]) {
      const cA = add(mul(uy, 31 * sg), [0, 0, (YT - 8) / 2]);
      parts.push([dot(cA, V), box(cA, mul(uy, 2.5), mul(h, 7), [0, 0, (YT + 8) / 2])]);
      const k = mul(uy, 36 * sg);
      parts.push([dot(k, V) + 0.1, lathe(k, mul(uy, sg), [[-2, 8], [3, 8], [3, 4], [6, 4]])]);
    }
    lampSvg.innerHTML = defs + (still ? '' : `<g>${pipe}</g>`) + parts.sort((x, y) => x[0] - y[0]).map((p) => p[1]).join('');
  }

  // ---- light ----
  const eR = still ? [1, 0, 0] : [Math.SQRT1_2, -Math.SQRT1_2, 0], eD = still ? [0, 0, -1] : norm([1, 1, -2]);
  const s = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };
  let W = 0, H = 0, ptr = null, t0 = performance.now(), piv = [0, 0];
  const zone = () => [W * 0.08, Math.max(H * 0.1, piv[1] + 200), W * 0.92, H * 0.94]; // never above the lamp: pool stays at least 200px below its pin
  function wander(t) {
    const [x0, y0, x1, y1] = zone(), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, ax = (x1 - x0) / 2, ay = (y1 - y0) / 2, k = t / 1000;
    return [cx + ax * (0.78 * Math.sin(k / 4.1) + 0.2 * Math.sin(k / 1.7 + 1)), cy + ay * (0.7 * Math.sin(k / 3.3 + 2) + 0.25 * Math.sin(k / 1.3))];
  }
  function render() {
    const sb = area.getBoundingClientRect(); W = sb.width; H = sb.height;
    beam.setAttribute('viewBox', `0 0 ${f(W)} ${f(H)}`);
    const m = lampSvg.getScreenCTM(); if (!m) return;
    const toSec = (p) => [m.a * p[0] + m.c * p[1] + m.e - sb.left, m.b * p[0] + m.d * p[1] + m.f - sb.top];
    piv = toSec([0, 0]); const dx = s.x - piv[0], dy = s.y - piv[1];
    const a = norm(add(add(mul(eR, dx), mul(eD, dy)), mul(V, 0.55 * Math.max(260, Math.hypot(dx, dy)))));
    drawLamp(a);
    const L = toSec(P(mul(a, LENS_T))), T = [s.x, s.y], d = Math.hypot(T[0] - L[0], T[1] - L[1]) || 1;
    const g = [(T[0] - L[0]) / d, (T[1] - L[1]) / d], q = [-g[1], g[0]];
    const lr = 15 * m.a, R = Math.max(130, Math.min(240, W * 0.15));
    const quad = (k) => poly([[L[0] + q[0] * lr * k, L[1] + q[1] * lr * k], [T[0] + g[0] * R * 0.3 + q[0] * R * k, T[1] + g[1] * R * 0.3 + q[1] * R * k], [T[0] + g[0] * R * 0.3 - q[0] * R * k, T[1] + g[1] * R * 0.3 - q[1] * R * k], [L[0] - q[0] * lr * k, L[1] - q[1] * lr * k]], 1);
    cone.setAttribute('d', quad(1)); core.setAttribute('d', quad(0.45));
    grad.setAttribute('x1', f(L[0])); grad.setAttribute('y1', f(L[1])); grad.setAttribute('x2', f(T[0] + g[0] * R)); grad.setAttribute('y2', f(T[1] + g[1] * R));
    for (const e of [pool, ...fr]) { e.setAttribute('rx', f(R)); e.setAttribute('ry', f(R * 0.82)); }
    pool.setAttribute('cx', f(T[0])); pool.setAttribute('cy', f(T[1]));
    fr.forEach((e, i) => { const o = i ? -7 : 7; e.setAttribute('cx', f(T[0] + g[0] * o)); e.setAttribute('cy', f(T[1] + g[1] * o)); e.setAttribute('rx', f(R * 0.78)); e.setAttribute('ry', f(R * 0.64)); });
    [[0.32, 10], [0.55, 36], [0.74, 6]].forEach(([k, r], i) => { const c = ghosts[i]; c.setAttribute('cx', f(L[0] + (T[0] - L[0]) * k)); c.setAttribute('cy', f(L[1] + (T[1] - L[1]) * k)); c.setAttribute('r', r); });
    for (const el of lit) {
      const b = el.getBoundingClientRect(), x = Math.max(b.left - sb.left, Math.min(T[0], b.right - sb.left)), y = Math.max(b.top - sb.top, Math.min(T[1], b.bottom - sb.top));
      el.classList.toggle('lit', Math.hypot(T[0] - x, T[1] - y) < R * 0.35);
    }
  }

  let raf = 0, last = 0, vis = false;
  function tick(t) {
    const dt = Math.min((t - last) / 1000 || 0.016, 0.034); last = t;
    let [tx, ty] = ptr || (still ? rest() : wander(t - t0));
    const ex = tx - piv[0], ey = ty - piv[1], ed = Math.hypot(ex, ey) || 1, min = Math.min(420, W * 0.3); // keep the pool off the lamp
    if (ed < min) { tx = piv[0] + ex / ed * min; ty = piv[1] + ey / ed * min; }
    const k = ptr ? 90 : 30, c = ptr ? 19 : 11;
    s.vx += (k * (tx - s.x) - c * s.vx) * dt; s.vy += (k * (ty - s.y) - c * s.vy) * dt;
    s.x += s.vx * dt; s.y += s.vy * dt; render();
    raf = vis ? requestAnimationFrame(tick) : 0;
  }

  // start: rest on the middle fact
  const rest = () => { const sb = area.getBoundingClientRect(), b = (sec.querySelector('[data-rest] .headline') || lit[1] || sec).getBoundingClientRect(); return [b.left - sb.left + b.width / 2, b.top - sb.top + b.height * (still ? 0.5 : 0.35)]; };
  [s.x, s.y] = rest(); render();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    sec.classList.add('on'); addEventListener('resize', () => { [s.x, s.y] = rest(); render(); }); return;
  }
  t0 = performance.now() - 7000; // join the wander path mid-sweep
  new IntersectionObserver(([e]) => {
    vis = e.isIntersecting;
    if (vis) { sec.classList.add('on'); if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }
  }, { threshold: 0.05 }).observe(sec);
  sec.addEventListener('pointermove', (e) => { if (e.pointerType === 'touch') return; const b = area.getBoundingClientRect(); const [x0, y0, x1, y1] = zone(); ptr = [Math.max(x0, Math.min(x1, e.clientX - b.left)), Math.max(y0, Math.min(y1, e.clientY - b.top))]; });
  const home = () => { ptr = null; };
  sec.addEventListener('pointerleave', home); sec.addEventListener('pointercancel', home);
});
