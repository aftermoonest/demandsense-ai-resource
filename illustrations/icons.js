// Static hairline icons: one small isometric object per idea, drawn with the kernel at rest and
// exported to SVG by export-icons.mjs. One bright mark per icon (class "hi" / "dot"), no text.
const { Cam, fit, proj, facing, rings, prism, solid, put, mk, circ, poly, seg, flatDot, place, rrect } = HL;

function scene(svg, pts) {
  const C = Cam(45, 0.5, 2);
  fit(C, pts, 200, 160);
  return { C, P: proj(C), front: facing(C), g: mk("g", {}, svg) };
}
const at = (ring, cx, cy) => ring.map((q) => ({ ...q, u: q.u + cx, v: q.v + cy }));
function box(s, x0, y0, x1, y1, z0, z1, hi = false, r = 2.2, b = 0.9) {
  const el = solid(s.g);
  put(el, prism(s.P, s.front, ...rings(x0, y0, x1, y1, r, b), z0, z1));
  if (hi) el.sil.classList.add("hi");
  return el;
}
function cyl(s, cx, cy, R, z0, z1, hi = false) {
  const el = solid(s.g);
  put(el, prism(s.P, s.front, at(circ(R, 32), cx, cy), at(circ(R - 0.9, 32), cx, cy), z0, z1));
  if (hi) el.sil.classList.add("hi");
  return el;
}
const line = (s, a, b, cls = "lo nf") => mk("path", { class: cls, d: seg(s.P(...a), s.P(...b)) }, s.g);
const dot = (s, x, y, z, cls = "dot off", r = 0.9) => place(flatDot(s.g, s.C, r, cls), s.P(x, y, z));
// A leaf or any rotated flat lozenge on the ground: an ellipse ring turned by a.
function lozenge(s, cx, cy, rx, ry, a, z0, z1, cls) {
  const ca = Math.cos(a), sa = Math.sin(a);
  const ring = circ(1, 20).map((q) => ({ u: cx + q.u * rx * ca - q.v * ry * sa, v: cy + q.u * rx * sa + q.v * ry * ca, nu: q.nu, nv: q.nv }));
  const el = solid(s.g);
  put(el, prism(s.P, s.front, ring, null, z0, z1));
  if (cls) el.sil.classList.add(cls);
}

const ICONS = {
  // Free: a box with its lid lifted off; dashed drops say the lid belongs to it.
  free(svg) {
    const s = scene(svg, [[0, 0, 0], [34, 34, 0], [0, 34, 0], [34, 0, 0], [17, 17, 34]]);
    box(s, 2, 2, 32, 32, 0, 16);
    for (const [x, y] of [[4, 32], [32, 32], [32, 4]]) line(s, [x, y, 16], [x, y, 26], "dash nf");
    box(s, 0, 0, 34, 34, 26, 30, true);
  },
  // 4 Nov: a desk calendar; one day carries the mark.
  date(svg) {
    const s = scene(svg, [[0, 0, 0], [36, 30, 0], [0, 30, 0], [36, 0, 0], [18, 15, 22]]);
    box(s, 0, 0, 36, 30, 0, 8);
    box(s, 1, 1, 35, 29, 8, 10);
    box(s, 1, 1, 35, 29, 10.5, 12.5);
    for (const x of [9, 27]) cyl(s, x, 3, 1.6, 12.5, 18);
    for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) {
      const hi = i === 3 && j === 1;
      dot(s, 5 + i * 5.2, 9 + j * 5, 12.5, hi ? "dot" : "dot off", hi ? 1.6 : 0.9);
    }
  },
  // Your name: a medal inside a laurel wreath; the wreath closes towards the viewer and opens away.
  name(svg) {
    const s = scene(svg, [[-26, -26, 0], [26, 26, 0], [-26, 26, 0], [26, -26, 0], [0, 0, 6]]);
    const leaves = [];
    for (let k = 0; k < 7; k++) {
      const t = 0.1 + k * 0.105;
      for (const side of [-1, 1]) {
        const a = Math.PI / 4 + side * Math.PI * t; // round from the near point, one branch each way
        const out = (k % 2 ? 0.5 : 0.15) * side;
        leaves.push({ x: Math.cos(a) * 19, y: Math.sin(a) * 19, r: a + Math.PI / 2 + out });
      }
    }
    leaves.sort((p, q) => p.x + p.y - (q.x + q.y)).forEach((l) => lozenge(s, l.x, l.y, 5, 1.5, l.r, 0, 1));
    cyl(s, 0, 0, 10, 0, 3.5, true);
    cyl(s, 0, 0, 6.5, 3.5, 4.5);
  },
  // Main sponsor: a podium, first place carries the mark.
  podium(svg) {
    const s = scene(svg, [[0, 0, 0], [14, 36, 0], [0, 36, 0], [14, 0, 0], [7, 18, 24]]);
    box(s, 0, 0, 14, 12, 0, 9);
    box(s, 0, 12, 14, 24, 0, 22, true);
    box(s, 0, 24, 14, 36, 0, 14);
  },
  // 500-600: a block of seats; one of them is yours.
  audience(svg) {
    const s = scene(svg, [[0, 0, 0], [36, 30, 0], [0, 30, 0], [36, 0, 0], [18, 15, 4]]);
    box(s, 0, 0, 36, 30, 0, 3);
    for (let i = 0; i < 7; i++) for (let j = 0; j < 6; j++) {
      const you = i === 4 && j === 3;
      dot(s, 4 + i * 4.7, 4 + j * 4.5, 3, you ? "dot" : j < 2 ? "dot m" : "dot off", you ? 1.5 : 0.95);
    }
  },
  // Our ad budget: a stack of coins and one beside it.
  coins(svg) {
    const s = scene(svg, [[-12, -12, 0], [26, 22, 0], [-12, 22, 0], [26, -12, 0], [0, 0, 22]]);
    for (let k = 0; k < 4; k++) cyl(s, 0, 0, 10, k * 5, k * 5 + 4.4, k === 3);
    cyl(s, 15, 12, 10, 0, 4.4);
  },
  // Your name (credit): a name card standing on its foot.
  badge(svg) {
    const s = scene(svg, [[0, 0, 0], [34, 12, 0], [0, 12, 0], [34, 0, 0], [17, 6, 28]]);
    box(s, 2, 2, 32, 12, 0, 3);
    box(s, 4, 5, 30, 7, 3, 26, true, 0.8, 0.4);
    line(s, [8, 7, 18], [24, 7, 18], "hi nf");
    line(s, [8, 7, 13], [19, 7, 13]);
  },
  // Shared credit: two cards side by side, the same height.
  pair(svg) {
    const s = scene(svg, [[0, 0, 0], [40, 16, 0], [0, 16, 0], [40, 0, 0], [20, 8, 26]]);
    box(s, 0, 0, 40, 16, 0, 3);
    box(s, 4, 4, 18, 6, 3, 24, false, 0.8, 0.4);
    line(s, [7, 6, 16], [15, 6, 16]);
    box(s, 22, 10, 36, 12, 3, 24, true, 0.8, 0.4);
    line(s, [25, 12, 16], [33, 12, 16], "hi nf");
  },
  // Work to you: a briefcase with its handle.
  case(svg) {
    const s = scene(svg, [[0, 0, 0], [36, 14, 0], [0, 14, 0], [36, 0, 0], [18, 7, 30]]);
    box(s, 0, 0, 36, 14, 0, 22);
    box(s, 12, 5, 24, 9, 22, 27, true, 1.6, 0.6);
    box(s, 15, 5.8, 21, 8.2, 22, 25, false, 0.6, 0.3);
    line(s, [0, 14, 13], [36, 14, 13]);
  },
  // Your page: a sheet with lines, on two sheets below.
  page(svg) {
    const s = scene(svg, [[0, 0, 0], [30, 36, 0], [0, 36, 0], [30, 0, 0], [15, 18, 8]]);
    box(s, 4, 4, 30, 36, 0, 1.5);
    box(s, 2, 2, 28, 34, 2, 3.5);
    box(s, 0, 0, 26, 32, 4, 5.5, true);
    for (let k = 0; k < 4; k++) line(s, [5, 7 + k * 5, 5.5], [k === 0 ? 20 : 17, 7 + k * 5, 5.5], k === 0 ? "nf" : "lo nf");
  },
  // On stage: a platform with one screen standing on it.
  stage(svg) {
    const s = scene(svg, [[0, 0, 0], [38, 22, 0], [0, 22, 0], [38, 0, 0], [19, 4, 28]]);
    box(s, 0, 0, 38, 22, 0, 5);
    box(s, 8, 2, 30, 4.5, 5, 27, true, 0.8, 0.4);
    line(s, [12, 4.5, 18], [26, 4.5, 18], "hi nf");
    dot(s, 19, 14, 5, "dot m", 2.6);
  },
  // Launch week: seven posts, one a day; launch day stands tallest.
  week(svg) {
    const s = scene(svg, [[0, 0, 0], [42, 8, 0], [0, 8, 0], [42, 0, 0], [6, 4, 26]]);
    [10, 26, 14, 12, 10, 9, 8].forEach((h, i) => box(s, i * 6, 0, i * 6 + 4.6, 8, 0, h, i === 1, 1.2, 0.5));
  },
  // Paid reach: rings spreading on the ground from one post.
  reach(svg) {
    const s = scene(svg, [[-22, -22, 0], [22, 22, 0], [-22, 22, 0], [22, -22, 0], [0, 0, 16]]);
    for (const R of [21, 15, 9]) mk("path", { class: R === 21 ? "dash nf" : "lo nf", d: poly(circ(R, 48).map((q) => s.P(q.u, q.v, 0))) }, s.g);
    cyl(s, 0, 0, 3, 0, 14, true);
  },
  // After launch: steps that keep rising.
  steps(svg) {
    const s = scene(svg, [[0, 0, 0], [36, 12, 0], [0, 12, 0], [36, 0, 0], [6, 6, 28]]);
    [25, 17, 11, 6].forEach((h, i) => box(s, i * 9, 0, i * 9 + 8, 12, 0, h, i === 0, 1.4, 0.6));
  },
  // Built with DemandSense: a featured spot, one tile raised out of the grid.
  plug(svg) {
    const s = scene(svg, [[0, 0, 0], [36, 36, 0], [0, 36, 0], [36, 0, 0], [18, 18, 14]]);
    for (let d = 0; d <= 4; d++) for (let i = 0; i < 3; i++) {
      const j = d - i;
      if (j < 0 || j > 2) continue;
      const hi = i === 1 && j === 1;
      box(s, i * 12 + 1, j * 12 + 1, i * 12 + 11, j * 12 + 11, 0, hi ? 12 : 2.5, hi, 2, 0.8);
    }
  },
};
window.ICONS = ICONS;
