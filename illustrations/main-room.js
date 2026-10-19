/**
 * Main room: the Full Circle hall seen from above. A stage at the back, three
 * screens standing behind it, rows of seats fanning out towards the viewer.
 * The pointer walks a spotlight along the stage; the screen it reaches takes
 * the bright edge and its name bar lights. At rest the light sits on the
 * centre screen. The slider is the spotlight's radius.
 *
 * The pattern: one of many, chosen by a continuous position. A spring carries
 * the light, the choice of screen is read from the spring's target.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, unproj, spring, stepS,
  flatDot, mk, place, pointer, put, register, disposer, solid, seg, poly, circ,
} = HL;

const W = 150, D = 124, SCREENS = [[18, 50], [59, 91], [100, 132]];
const CX = (s) => (s[0] + s[1]) / 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[-6, -12, -4], [W + 6, -12, -4], [W + 6, D, -4], [-6, D, -4], [W / 2, -6, 48]], 200, 166);
  const P = proj(C), front = facing(C);
  let R = value, over = null, lit = 1;

  const g = mk("g", {}, svg);
  // Floor plinth, the far edge first.
  const [fr, fi] = rings(-6, -12, W + 6, D, 10, 2.2);
  put(solid(g), prism(P, front, fr, fi, -4, 0));

  // Stage platform: screens stand on its back edge.
  const [sr, si] = rings(8, -6, W - 8, 22, 4, 1.4);
  put(solid(g), prism(P, front, sr, si, 0, 6));

  // The light on the stage floor, painted before the screens that stand on it.
  const ring = circ(1, 28);
  const spot = mk("path", { class: "nf" }, g);
  const sp = spring(CX(SCREENS[1]), { eps: 0.05 });

  // Screens: thin slabs behind the stage; a name bar on the face that looks at the room.
  const screens = SCREENS.map(([x0, x1]) => {
    const [r, i] = rings(x0, -1, x1, 2, 1.2, 0.6);
    const el = solid(g);
    put(el, prism(P, front, r, i, 6, 40));
    const bar = mk("path", { class: "lo nf", d: seg(P(x0 + 6, 2, 27), P(x1 - 6, 2, 27)) }, g);
    const sub = mk("path", { class: "lo nf", d: seg(P(x0 + 10, 2, 21), P(x1 - 10, 2, 21)) }, g);
    return { el, bar, sub, x: (x0 + x1) / 2 };
  });

  // Seats: arcs facing the stage centre. The seats that face the lit screen
  // turn towards it (a medium dot); the wedge widens with the light's radius.
  const seats = [];
  for (let r = 38; r <= 110; r += 8) {
    const n = Math.round(r / 4.6);
    for (let k = 0; k <= n; k++) {
      const a = Math.PI * (0.16 + (0.68 * k) / n);
      const x = W / 2 - Math.cos(a) * r, y = 6 + Math.sin(a) * r;
      if (x < 3 || x > W - 3 || y < 30 || y > D - 5) continue;
      const el = flatDot(g, C, 1.05, "dot off");
      place(el, P(x, y, 0));
      seats.push({ el, x, y });
    }
  }

  let drawnX = NaN, drawnR = NaN;
  function draw() {
    if (sp.x !== drawnX || R !== drawnR) {
      drawnX = sp.x; drawnR = R;
      spot.setAttribute("d", poly(ring.map((q) => P(sp.x + q.u * R, 9.5 + q.v * R * 0.62, 6))));
    }
  }
  function choose() {
    const t = sp.t;
    let best = 0;
    screens.forEach((s, i) => { if (Math.abs(s.x - t) < Math.abs(screens[best].x - t)) best = i; });
    lit = best;
    const sx = screens[lit].x;
    seats.forEach((q) => {
      // the line of sight from the seat to the lit screen, measured at the stage edge
      const off = Math.abs(q.x - sx) - (q.y - 30) * 0.18;
      q.el.setAttribute("class", off < R * 1.6 ? "dot m" : "dot off");
    });
    screens.forEach((s, i) => {
      s.el.sil.classList.toggle("hi", i === lit);
      s.bar.setAttribute("class", i === lit ? "hi nf" : "lo nf");
    });
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function retarget() {
    sp.t = over ? clamp(over[0], 22, W - 22) : CX(SCREENS[1]);
    choose();
    read.textContent = over ? `screen ${lit + 1}` : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { over = unproj(C, p[0], p[1], 0); retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  choose(); draw();

  return { set: (v) => { R = v; choose(); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "main-room",
  means: "A hall from above: a spotlight walks the stage, and the screen it reaches lights up with your name.",
  rules: [1, 4, 5, 8],
  range: [6, 10, 14],
  tour: [[150, 120], [250, 175], [205, 145], null],
  mount,
});
