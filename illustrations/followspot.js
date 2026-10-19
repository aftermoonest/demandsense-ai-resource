/**
 * Followspot: a stage with a lighting truss at its back. A followspot hangs
 * from the truss on a clamp rod; its barrel (lens hood, two bands, a rear
 * handle) turns to keep its beam on one spot of the stage floor. The pointer,
 * read on the stage top, moves the spot; the barrel follows it. The spot's
 * ring is the one bright line: whoever stands in it. The slider is its radius.
 *
 * The pattern: one continuous position. Two springs carry the spot; the barrel
 * is rebuilt from where the spot is, the hit test reads the fixed stage plane.
 */
const {
  Cam, clamp, fit, hull, open, poly, proj, rings, unproj, spring, stepS, circ,
  flatDot, mk, place, pointer, put, register, disposer, solid, seg, prism, facing,
} = HL;

const W = 140, D = 100, SH = 10, TZ = 84, TY0 = -13, TY1 = -6;
const PIV = [70, -9.5, 60];
const REST = [W * 0.6, D * 0.62];
// The way to the camera at Cam(45, 0.5): +x and +y come towards the viewer, z up (elevation 30°).
const EYE = [0.612, 0.612, 0.5];

const add = (a, b, s = 1) => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a) => { const l = Math.hypot(...a); return [a[0] / l, a[1] / l, a[2] / l]; };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-2, TY0, 0], [W + 2, TY0, TZ + 6], [W, D, 0], [0, D, 0], [-2, TY0, TZ + 6]], 200, 158);
  const P = proj(C), front = facing(C);
  let R = value, over = null;

  const g = mk("g", {}, svg);
  // Truss posts stand behind the stage; the truss rests on them.
  for (const x of [-2, W - 6]) {
    const [r, i] = rings(x, TY0 + 0.5, x + 8, TY1 - 0.5, 2, 0.8);
    put(solid(g), prism(P, front, r, i, 0, TZ));
  }
  const [tr, ti] = rings(-4, TY0, W + 4, TY1, 1.6, 1);
  put(solid(g), prism(P, front, tr, ti, TZ, TZ + 6));
  // The truss's lattice on its near face.
  const lat = [];
  for (let x = 0; x < W; x += 8) lat.push(seg(P(x, TY1, TZ + 0.8), P(x + 4, TY1, TZ + 5.2)), seg(P(x + 4, TY1, TZ + 5.2), P(x + 8, TY1, TZ + 0.8)));
  mk("path", { class: "lo nf", d: lat.join("") }, g);

  // The stage, its boards, and the spike mark where the spot rests.
  const [sr, si] = rings(0, 0, W, D, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, SH));
  const boards = [];
  for (let y = 16; y < D - 6; y += 14) boards.push(seg(P(4, y, SH), P(W - 4, y, SH)));
  mk("path", { class: "lo nf", d: boards.join("") }, g);
  place(flatDot(g, C, 1.2, "dot m"), P(REST[0], REST[1], SH));

  const ring = circ(1, 28);
  const beam = mk("path", { class: "dash nf" }, g);
  const spot = mk("path", { class: "hi nf" }, g);
  // Clamp rod from the truss down to the pivot, then the handle, then the barrel over both.
  const [rr, ri] = rings(PIV[0] - 1.6, PIV[1] - 1.6, PIV[0] + 1.6, PIV[1] + 1.6, 1.6, 0.5);
  put(solid(g), prism(P, front, rr, ri, PIV[2] + 13, TZ));
  const handle = mk("path", { class: "nf" }, g);
  const yoke = mk("path", { class: "nf" }, g);
  const body = mk("path", { class: "sil" }, g);
  const face = mk("path", { class: "nf" }, g);
  const lensEl = mk("path", { class: "lo nf" }, g);
  const bands = mk("path", { class: "lo nf" }, g);

  const sx = spring(REST[0], { eps: 0.05 }), sy = spring(REST[1], { eps: 0.05 });

  // A circle of radius r round the barrel's axis at c, as world points.
  function hoop(c, d, r, n = 28) {
    const u = unit(Math.abs(d[2]) < 0.9 ? cross(d, [0, 0, 1]) : cross(d, [1, 0, 0])), v = cross(d, u);
    const out = [];
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2, nrm = add(add([0, 0, 0], u, Math.cos(a)), v, Math.sin(a));
      out.push({ p: add(c, nrm, r), n: nrm });
    }
    return out;
  }
  const W2 = (q) => P(q.p[0], q.p[1], q.p[2]);
  // The half of a hoop that faces the camera, as one run of screen points.
  function near(h) {
    const k = h.findIndex((q, i) => dot(q.n, EYE) > 0 && dot(h[(i + h.length - 1) % h.length].n, EYE) <= 0);
    const pts = [];
    for (let i = 0; i < h.length; i++) { const q = h[(k + i) % h.length]; if (dot(q.n, EYE) > 0) pts.push(W2(q)); else break; }
    return pts;
  }

  let drawnX = NaN, drawnY = NaN, drawnR = NaN;
  function draw() {
    if (sx.x === drawnX && sy.x === drawnY && R === drawnR) return;
    drawnX = sx.x; drawnY = sy.x; drawnR = R;
    const floor = ring.map((q) => P(sx.x + q.u * R, sy.x + q.v * R, SH));
    spot.setAttribute("d", poly(floor));
    const d = unit([sx.x - PIV[0], sy.x - PIV[1], SH - PIV[2]]);
    const back = add(PIV, d, -12), lens = add(PIV, d, 11), hood = add(PIV, d, 16);
    const hb = hoop(back, d, 8.5), hl = hoop(lens, d, 10), hh = hoop(hood, d, 11.5);
    beam.setAttribute("d", poly(hull(hh.map(W2).concat(floor))));
    body.setAttribute("d", poly(hull(hb.concat(hl, hh).map(W2))));
    const looks = dot(d, EYE) > 0;
    face.setAttribute("d", looks ? poly(hh.map(W2)) : poly(hb.map(W2)));
    lensEl.setAttribute("d", looks ? poly(hoop(hood, d, 7.5).map(W2)) : "");
    bands.setAttribute("d", [hoop(add(PIV, d, -5), d, 8.9), hoop(add(PIV, d, 3), d, 9.4), hl].map((h) => open(near(h))).join(""));
    handle.setAttribute("d", seg(P(...back), P(...add(add(back, d, -11), [0, 0, -1], 4))));
    // The yoke: a U from the rod's foot round the barrel to its two trunnions.
    const side = unit(cross(d, [0, 0, 1])), top = add(PIV, [0, 0, 1], 13);
    const ends = [add(PIV, side, 10.5), add(PIV, side, -10.5)];
    yoke.setAttribute("d", ends.map((e) => open([P(...top), P(...add(top, side, dot(side, add(e, PIV, -1)))), P(...e)])).join(""));
  }

  const B = register(stage, (dt) => { const a = stepS(sx, dt), b = stepS(sy, dt); draw(); return a || b; });
  bag.add(B.unregister);

  function retarget() {
    const [x, y] = over || REST;
    sx.t = clamp(x, R + 4, W - R - 4); sy.t = clamp(y, R + 4, D - R - 4);
    read.textContent = over ? `spot ${1 + Math.min(2, Math.floor((sx.t / W) * 3))}·${sy.t < D / 2 ? 1 : 2}` : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const w = unproj(C, p[0], p[1], SH); over = w[0] > -16 && w[0] < W + 16 && w[1] > -10 && w[1] < D + 16 ? w : null; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();

  return { set: (v) => { R = v; drawnR = NaN; retarget(); draw(); }, destroy: bag.dispose };
}

hairline({
  name: "followspot",
  means: "A followspot on the sponsor's truss: the pointer moves the beam across the stage, and the lit ring is your place in it.",
  rules: [1, 4, 5, 8],
  range: [11, 15, 19],
  tour: [[150, 200], [270, 215], [200, 250], null],
  mount,
});
