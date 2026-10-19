/**
 * Followspot: a stage under a box truss on two towers. A followspot hangs
 * from the truss on a clamp and yoke; its barrel (cooling fins, iris lever,
 * lens hood) turns to keep its beam on one spot of the stage floor. At rest
 * the spot rings the mic stand on the spike mark. The pointer, read on the
 * stage top, moves the spot; the barrel follows. The spot's ring is the one
 * bright line: whoever stands in it. The slider is its radius.
 *
 * Corners are tight (radius about 1): the landing's illustrations are edgy.
 * The pattern: one continuous position. Two springs carry the spot; the barrel
 * is rebuilt from where the spot is, the hit test reads the fixed stage plane.
 */
const {
  Cam, clamp, fit, hull, open, poly, proj, rings, unproj, spring, stepS, circ,
  flatDot, mk, place, pointer, put, register, disposer, solid, seg, prism, facing,
} = HL;

const W = 150, D = 104, SH = 10, TZ = 92, TY0 = -14, TY1 = -6;
const PIV = [80, -10, 66];
const MIC = [W * 0.42, D * 0.6];
// The way to the camera at Cam(45, 0.5): +x and +y come towards the viewer, z up (elevation 30°).
const EYE = [0.612, 0.612, 0.5];

const add = (a, b, s = 1) => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a) => { const l = Math.hypot(...a); return [a[0] / l, a[1] / l, a[2] / l]; };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.7);
  fit(C, [[-8, TY0 - 4, 0], [W + 8, TY0 - 4, TZ + 8], [W, D + 14, 0], [0, D + 14, 0], [-8, TY0, TZ + 8]], 200, 162);
  const P = proj(C), front = facing(C);
  let R = value, over = null;

  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 1, b = 0.7) => { const el = solid(g); put(el, prism(P, front, ...rings(x0, y0, x1, y1, r, b), z0, z1)); return el; };
  const lines = (segs, cls = "lo nf") => mk("path", { class: cls, d: segs.join("") }, g);

  // Towers: square lattice masts on base plates, behind the stage.
  for (const x of [-4, W - 4]) {
    box(x - 4, TY0 - 4, x + 12, TY1 + 4, 0, 1.6);
    box(x, TY0, x + 8, TY1, 1.6, TZ);
    const z = [];
    for (let h = 6; h < TZ - 8; h += 10) z.push(seg(P(x + 0.6, TY1, h), P(x + 7.4, TY1, h + 5)), seg(P(x + 7.4, TY1, h + 5), P(x + 0.6, TY1, h + 10)));
    lines(z);
  }
  // The truss: two chords and a zigzag web on its near face, resting on the towers.
  box(-6, TY0, W + 6, TY1, TZ, TZ + 8);
  const web = [seg(P(-5, TY1, TZ + 4), P(W + 5, TY1, TZ + 4))];
  for (let x = -4; x < W + 4; x += 8) web.push(seg(P(x, TY1, TZ + 0.8), P(x + 4, TY1, TZ + 7.2)), seg(P(x + 4, TY1, TZ + 7.2), P(x + 8, TY1, TZ + 0.8)));
  lines(web);

  // The stage deck, its boards, footlights on the front lip, the spike mark.
  box(0, 0, W, D, 0, SH, 1.2, 1);
  const boards = [];
  for (let y = 12; y < D - 4; y += 11) boards.push(seg(P(3, y, SH), P(W - 3, y, SH)));
  lines(boards);
  for (let x = 10; x < W - 6; x += 12) place(flatDot(g, C, 0.8, "dot off"), P(x, D - 3, SH));
  place(flatDot(g, C, 1.2, "dot m"), P(MIC[0], MIC[1], SH));

  const ring = circ(1, 32);
  const beam = mk("path", { class: "dash nf" }, g);
  const spot = mk("path", { class: "hi nf" }, g);

  // Mic stand on the spike mark: round base, pole, boom with the mic at its end.
  {
    const [r, i] = [circ(3.4, 16), circ(2.6, 16)].map((c) => c.map((q) => ({ ...q, u: q.u + MIC[0], v: q.v + MIC[1] })));
    put(solid(g), prism(P, front, r, i, SH, SH + 0.8));
    const top = [MIC[0], MIC[1], SH + 24], tip = [MIC[0] + 5, MIC[1] + 5, SH + 27];
    lines([seg(P(MIC[0], MIC[1], SH + 0.8), P(...top)), seg(P(...top), P(...tip))], "sil nf");
    place(flatDot(g, C, 1.3, "dot m"), P(...tip));
  }

  // Stairs up the front, and two wedge monitors on the lip.
  [[7, D, D + 4], [4.6, D + 4, D + 8], [2.3, D + 8, D + 12]].forEach(([h, y0, y1]) => box(10, y0, 32, y1, 0, h, 0.6, 0.4));
  for (const x of [W * 0.55, W * 0.8]) {
    const foot = [[x, D - 14], [x + 16, D - 14], [x + 16, D - 3], [x, D - 3]];
    const pts = foot.flatMap(([u, v]) => [P(u, v, SH), P(u, v, SH + (v < D - 8 ? 3 : 8))]);
    mk("path", { class: "sil", d: poly(hull(pts)) }, g);
    lines([seg(P(x, D - 14, SH + 3), P(x, D - 3, SH + 8)), seg(P(x + 2, D - 9, SH + 5.3), P(x + 14, D - 9, SH + 5.3))]);
  }

  // Clamp and pan rod from the truss to the yoke, then a safety cable, the handle, the barrel over all.
  box(PIV[0] - 3, PIV[1] - 3, PIV[0] + 3, PIV[1] + 3, TZ - 3, TZ, 0.5, 0.3);
  box(PIV[0] - 1.2, PIV[1] - 1.2, PIV[0] + 1.2, PIV[1] + 1.2, PIV[2] + 14, TZ - 3, 0.4, 0.3);
  const cable = mk("path", { class: "lo nf" }, g);
  const handle = mk("path", { class: "nf" }, g);
  const yoke = mk("path", { class: "nf" }, g);
  const body = mk("path", { class: "sil" }, g);
  const face = mk("path", { class: "nf" }, g);
  const lens = mk("path", { class: "lo nf" }, g);
  const fins = mk("path", { class: "lo nf" }, g);
  const lever = mk("path", { class: "nf" }, g);

  const sx = spring(MIC[0], { eps: 0.05 }), sy = spring(MIC[1], { eps: 0.05 });

  // A ring of radius r round the barrel's axis d at c, with its outward normals.
  function hoop(c, d, r, n = 32) {
    const u = unit(cross(d, [0, 0, 1])), v = cross(d, u), out = [];
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2, nrm = add(add([0, 0, 0], u, Math.cos(a)), v, Math.sin(a));
      out.push({ p: add(c, nrm, r), n: nrm });
    }
    return out;
  }
  const W2 = (q) => P(...q.p);
  // The half of a hoop that faces the camera, as one run of screen points.
  function near(h) {
    const k = h.findIndex((q, i) => dot(q.n, EYE) > 0 && dot(h[(i + h.length - 1) % h.length].n, EYE) <= 0), pts = [];
    for (let i = 0; i < h.length; i++) { const q = h[(k + i) % h.length]; if (dot(q.n, EYE) > 0) pts.push(W2(q)); else break; }
    return pts;
  }

  let drawn = "";
  function draw() {
    const key = `${sx.x.toFixed(2)},${sy.x.toFixed(2)},${R}`;
    if (key === drawn) return;
    drawn = key;
    const floor = ring.map((q) => P(sx.x + q.u * R, sy.x + q.v * R, SH));
    spot.setAttribute("d", poly(floor));
    const d = unit([sx.x - PIV[0], sy.x - PIV[1], SH - PIV[2]]);
    const back = add(PIV, d, -14), mid = add(PIV, d, 8), hood = add(PIV, d, 18);
    const hb = hoop(back, d, 9), hm = hoop(mid, d, 9.6), hh = hoop(hood, d, 10.4);
    beam.setAttribute("d", poly(hull(hh.map(W2).concat(floor))));
    body.setAttribute("d", poly(hull(hb.concat(hm, hh).map(W2))));
    const looks = dot(d, EYE) > 0;
    face.setAttribute("d", looks ? poly(hh.map(W2)) : poly(hb.map(W2)));
    lens.setAttribute("d", looks ? poly(hoop(hood, d, 7.6).map(W2)) + poly(hoop(add(hood, d, -1.2), d, 5).map(W2)) : "");
    fins.setAttribute("d", [-12, -10, -8, -6, -4, 2, 8].map((t) => open(near(hoop(add(PIV, d, t), d, t < 0 ? 9.1 : 9.7)))).join(""));
    const side = unit(cross(d, [0, 0, 1])), up = cross(side, d), top = add(PIV, [0, 0, 1], 14);
    lever.setAttribute("d", seg(P(...add(add(PIV, d, -2), up, 8.6)), P(...add(add(add(PIV, d, -4), up, 13), side, 2))));
    handle.setAttribute("d", seg(P(...back), P(...add(add(back, d, -10), [0, 0, -1], 4))));
    const arms = [11.5, -11.5].map((s) => add(PIV, side, s));
    yoke.setAttribute("d", seg(P(...add(top, side, 11.5)), P(...add(top, side, -11.5))) + arms.map((e) => open([P(...add(top, side, dot(side, add(e, PIV, -1)))), P(...e)])).join(""));
    const tail = add(add(back, d, -6), [0, 0, -1], 2);
    cable.setAttribute("d", open([P(...back), P(...tail), P(...add(tail, [0, -1, 0], 6)), P(PIV[0] + 10, TY1, TZ)]));
  }

  const B = register(stage, (dt) => { const a = stepS(sx, dt), b = stepS(sy, dt); draw(); return a || b; });
  bag.add(B.unregister);

  function retarget() {
    const [x, y] = over || MIC;
    sx.t = clamp(x, R + 4, W - R - 4); sy.t = clamp(y, R + 4, D - R - 16); // the front strip belongs to the monitors
    read.textContent = over ? `spot ${1 + Math.min(2, Math.floor((sx.t / W) * 3))}·${sy.t < D / 2 ? 1 : 2}` : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const w = unproj(C, p[0], p[1], SH); over = w[0] > -16 && w[0] < W + 16 && w[1] > -10 && w[1] < D + 16 ? w : null; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();

  return { set: (v) => { R = v; retarget(); draw(); }, destroy: bag.dispose };
}

hairline({
  name: "followspot",
  means: "A followspot on the sponsor's truss: the pointer moves the beam across the stage, and the lit ring is your place in it.",
  rules: [1, 4, 5, 8],
  range: [12, 16, 20],
  tour: [[150, 190], [280, 205], [215, 250], null],
  mount,
});
