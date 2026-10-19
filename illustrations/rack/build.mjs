// The Standard as a modular rack: practitioners' modules (rules, skills, scenarios) seated in one case,
// patched together; slot 06 is empty, its bus header waiting and one cable's plug resting on its rail.
// node illustrations/rack/build.mjs  ->  rack.html (review page), rack.svg (figure), rack-live.js (behaviour)
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../.agents/skills/anatomy/kit/iso-kit.mjs";
import { kitScript } from "../../.agents/skills/anatomy/scripts/inline-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const W = 600, H = 380;

// ---------- Model: the six seats of the Standard (copy from the site, verbatim) ----------
const MODULES = [
  { n: "01", kind: "rule", title: "Audience Network fit", who: "[Practitioner]", tag: "Small budget", w: 26 },
  { n: "02", kind: "skill", title: "Frequency check", who: "[Practitioner]", tag: "ABM", w: 38 },
  { n: "03", kind: "scenario", title: "Account audit", who: "[Practitioner]", tag: "Creative", w: 58 },
  { n: "04", kind: "rule", title: "Seniority splits", who: "[Practitioner]", tag: "Measurement", w: 26 },
  { n: "05", kind: "scenario", title: "Weekly budget check", who: "[Practitioner]", tag: "Enterprise", w: 58 },
  { n: "06", kind: "you", title: "Your part", who: "Your seat", tag: "Open until 21 Oct", w: 30 },
];

// ---------- World ----------
const CASE = { x: 0, y: 0, w: 260, d: 84, r: 5 };
const Z_BOTTOM = -22, Z_FLOOR = -16, Z_WALL = 3.2, Z_RAIL = 0, FACE = 1.6;
const CHEEK = 9, RAIL_Y = [7, 69], RAIL_D = 8;
const FACE_Y = 5, FACE_D = 74;
let cursor = CHEEK + 1;
MODULES.forEach((m) => { m.x = cursor; m.cx = cursor + m.w / 2; cursor += m.w + 0.8; });
const TOP = Z_RAIL + FACE; // faceplate top

const P = k.fitProjection([...k.boxCorners(CASE, Z_BOTTOM - 2, Z_WALL), [130, 40, 30]], W, H, { pad: 10, azimuth: 66, elevation: 36 });
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

// ---------- Case ----------
function caseBack() {
  const out = [`<path class="iso-halo" d="${k.haloOf(CASE, Z_BOTTOM - 4, 6, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(CASE, 14))) {
    out.push(S(k.cylinder(x, y, 6, Z_BOTTOM - 4, 1.2, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 4.6, Z_BOTTOM - 2.8, 2.8, P, 28), { tone: "mid" }));
  }
  // shell up to the floor, then the floor seen through the open seat
  out.push(S(k.slabOf(CASE, Z_BOTTOM, Z_FLOOR - Z_BOTTOM, P, 8, 1.2), { tone: "mid", inner: L(k.sideSeam(CASE, Z_BOTTOM + 2.4, P, 8), { tone: "faint" }) }));
  // far walls (back long wall and the left cheek) stand behind everything
  out.push(S(k.slabOf({ x: 0, y: 0, w: CASE.w, d: 4, r: 1.6 }, Z_FLOOR, Z_WALL - Z_FLOOR, P, 4, 0.5), { tone: "mid" }));
  out.push(S(k.slabOf({ x: 0, y: 0, w: CHEEK, d: CASE.d, r: 2 }, Z_FLOOR, Z_WALL + 1.2 - Z_FLOOR, P, 4, 0.8), { tone: "mid" }));
  out.push(L(k.planOutline({ x: 2.6, y: 24, w: 3.8, d: 36, r: 1.9 }, Z_WALL + 1.2, P, 4), { tone: "lo" }));
  return out.join("");
}

// The open seat: floor, bus board with its 2×8 header, the slot rim (the one lit accent).
function seat() {
  const m = MODULES[5], out = [];
  const floor = { x: m.x - 0.4, y: 4, w: m.w + 0.8, d: CASE.d - 8, r: 0.6 };
  out.push(S(k.slabOf(floor, Z_FLOOR, 0.4, P, 3), { tone: "lo", crease: "none" }));
  const bus = { x: m.x + 3, y: 26, w: m.w - 6, d: 30, r: 1 };
  out.push(S(k.slabOf(bus, Z_FLOOR + 0.4, 1.2, P, 3, 0.3), { tone: "lo" }));
  out.push(L(k.planOutline(k.insetPlan(bus, 1.6), Z_FLOOR + 1.6, P, 3), { tone: "faint" }));
  const head = { x: m.cx - 4, y: 33, w: 8, d: 16, r: 0.8 };
  out.push(S(k.slabOf(head, Z_FLOOR + 1.6, 5, P, 3, 0.4), { tone: "mid" }));
  const pins = [];
  for (let i = 0; i < 2; i++) for (let j = 0; j < 8; j++) pins.push(at([head.x + 2.6 + i * 2.8, head.y + 1.4 + j * 1.9, Z_FLOOR + 6.6]));
  out.push(D(pins, { size: 0.42, tone: "hi" }));
  out.push(D([at([bus.x + 2.2, bus.y + 2.2, Z_FLOOR + 1.6]), at([bus.x + bus.w - 2.2, bus.y + bus.d - 2.2, Z_FLOOR + 1.6])], { size: 0.45, tone: "mid" }));
  return out.join("");
}

function rails() {
  const out = [];
  for (const y of RAIL_Y) {
    const rail = { x: CHEEK, y, w: CASE.w - 2 * CHEEK, d: RAIL_D, r: 0.8 };
    out.push(S(k.slabOf(rail, Z_RAIL - 3, 3, P, 3, 0.4), { tone: "mid" }));
    // the threaded strip: a slot with one hole every HP (5.08) that sits under no module
    const slot = { x: CHEEK + 1.5, y: y + RAIL_D / 2 - 1, w: CASE.w - 2 * CHEEK - 3, d: 2, r: 1 };
    out.push(L(k.planOutline(slot, Z_RAIL, P, 3), { tone: "faint" }));
    const m = MODULES[5];
    const holes = [];
    for (let x = m.x + 2.5; x < m.x + m.w - 1; x += 5.08) holes.push(at([x, y + RAIL_D / 2, Z_RAIL]));
    out.push(D(holes, { size: 0.55, tone: "lo" }));
  }
  return out.join("");
}

// ---------- Module parts ----------
const jack = (x, y, z) => [
  S(k.cylinder(x, y, 2.4, z, 0.9, P, 20), { tone: "mid" }),
  S(k.cylinder(x, y, 1.8, z + 0.9, 0.7, P, 6), { tone: "mid", crease: "none" }),
  L(k.ring(x, y, 1, z + 1.6, P, 16), { tone: "lo" }),
  D([at([x, y, z + 1.6])], { size: 0.5, tone: "lo" }),
].join("");
const knob = (x, y, z, r, turn) => [
  S(k.cylinder(x, y, r + 0.8, z, 0.6, P, 28), { tone: "lo" }),
  S(k.cylinder(x, y, r, z + 0.6, 3.4, P, 32, 0.4), { tone: "hi", crease: "lo" }),
  L(k.knurl(x, y, r, z + 0.9, z + 3.6, Math.round(r * 7), P), { tone: "lo" }),
  L(k.lineOnTop([x, y], [x + Math.sin(turn) * (r - 0.6), y - Math.cos(turn) * (r - 0.6)], z + 4, P), { tone: "hi", free: "start" }),
].join("");
const led = (x, y, z, on) => [
  L(k.ring(x, y, 1.6, z, P, 14), { tone: "faint" }),
  S(k.cylinder(x, y, 0.9, z, 0.7, P, 12), { tone: on ? "hi" : "lo", crease: "none" }),
].join("");
const screws = (m, z) => {
  const pts = m.w < 34 ? [[m.x + 3.2, FACE_Y + 3.2], [m.x + m.w - 3.2, FACE_Y + FACE_D - 3.2]] : [[m.x + 3.2, FACE_Y + 3.2], [m.x + m.w - 3.2, FACE_Y + 3.2], [m.x + 3.2, FACE_Y + FACE_D - 3.2], [m.x + m.w - 3.2, FACE_Y + FACE_D - 3.2]];
  return L(pts.map(([x, y]) => k.ring(x, y, 1.5, z, P, 14)).join(""), { tone: "lo" }) + D(pts.map(([x, y]) => at([x, y, z])), { size: 0.5, tone: "mid" });
};

// A rule is a reference gauge: a dial that says what good looks like, a trim knob, one output.
function rule(m, z) {
  const out = [];
  const dial = [m.cx, 26];
  out.push(S(k.cylinder(dial[0], dial[1], 9.4, z, 2.4, P, 56, 0.5), { tone: "hi", crease: "lo" }));
  out.push(L(k.ring(dial[0], dial[1], 8, z + 2.4, P, 56), { tone: "lo" }));
  const t = k.radialTicks(dial[0], dial[1], 7.6, 20, 5, z + 2.4, [1, 2], P, -Math.PI * 0.75, Math.PI * 1.5);
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  out.push(L(k.ring(dial[0], dial[1], 0.9, z + 2.4, P, 12), { tone: "mid" }));
  out.push(`<path data-needle class="iso-line" data-tone="hi" data-free="start" d="${k.lineOnTop(dial, [dial[0] + 5.6, dial[1] - 3.2], z + 2.6, P)}" style="stroke-width:.9"/>`);
  out.push(knob(m.cx, 48, z, 3.6, 0.9));
  out.push(led(m.cx - 7.6, 58, z, true));
  out.push(jack(m.cx, 66, z));
  return out.join("");
}
// A skill reads the rule against an account: one input, a sense knob, four band lamps (2 of 4 out), one output.
function skill(m, z) {
  const out = [];
  out.push(jack(m.cx - 9, 14, z), jack(m.cx + 9, 14, z));
  out.push(knob(m.cx, 33, z, 6.4, -0.5));
  [0, 1, 2, 3].forEach((i) => out.push(led(m.x + 8 + i * ((m.w - 16) / 3), 50, z, i === 1 || i === 3)));
  out.push(jack(m.cx, 66, z));
  return out.join("");
}
// A scenario runs skills inside: three inputs, a status window, three trims, one output.
function scenario(m, z) {
  const out = [];
  [0, 1, 2].forEach((i) => out.push(jack(m.x + 11 + i * ((m.w - 22) / 2), 14, z)));
  const win = { x: m.x + 6, y: 21, w: m.w - 12, d: 17, r: 1.2 };
  out.push(S(k.slabOf(win, z - 0.6, 0.6, P, 3), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(win, z, P, 3), { tone: "mid" }));
  const grid = k.dotGrid(win.x + 3, win.y + 3, 12, 5, (win.w - 6) / 11, z - 0.2, P);
  out.push(D(grid.map((p, i) => [...p, [3, 4, 5, 15, 16, 17, 28, 39, 40, 41].includes(i) ? 1 : 0.35]), { size: 0.42, tone: "hi" }));
  [0, 1, 2].forEach((i) => out.push(knob(m.x + 11 + i * ((m.w - 22) / 2), 48, z, 3.4, -0.8 + i * 0.7)));
  out.push(led(m.x + 8, 62, z, true));
  out.push(jack(m.cx + 8, 66, z));
  return out.join("");
}

function moduleSvg(m) {
  const face = { x: m.x, y: FACE_Y, w: m.w, d: FACE_D, r: 1.2 };
  const out = [S(k.slabOf(face, Z_RAIL, FACE, P, 3, 0.5), { tone: "hi", crease: "lo" })];
  out.push(screws(m, TOP));
  // engraved index plate: a tiny label strip at the foot, three rule lines stand for the maker's mark
  const plate = { x: m.x + 3, y: FACE_Y + FACE_D - 9.6, w: Math.min(m.w - 6, 16), d: 3.2, r: 0.6 };
  out.push(L(k.planOutline(plate, TOP, P, 3), { tone: "faint" }));
  out.push(L(k.lineOnTop([plate.x + 1.2, plate.y + 1.6], [plate.x + plate.w * 0.7, plate.y + 1.6], TOP, P), { tone: "lo", free: true }));
  out.push(m.kind === "rule" ? rule(m, TOP) : m.kind === "skill" ? skill(m, TOP) : scenario(m, TOP));
  return out.join("");
}

// Jacks, in world units, for the cables: [module index, x, y]
const OUT = (i) => { const m = MODULES[i]; return m.kind === "scenario" ? [m.cx + 8, 66] : [m.cx, 66]; };
const IN = (i, slot = 0) => { const m = MODULES[i]; return m.kind === "skill" ? [m.cx - 9, 14] : [m.x + 11 + slot * ((m.w - 22) / 2), 14]; };
const CABLES = [
  { from: [0, ...OUT(0)], to: [1, ...IN(1)], sag: 13 },
  { from: [1, ...OUT(1)], to: [2, ...IN(2, 0)], sag: 15 },
  { from: [3, ...OUT(3)], to: [4, ...IN(4, 0)], sag: 12 },
  { from: [1, MODULES[1].cx + 9, 14], to: [4, ...IN(4, 1)], sag: 20 },
];
// One cable waits for you: from scenario 05's last input, its plug lies on the open seat's front rail.
const WAITING = { from: [4, ...IN(4, 2)], rest: [MODULES[5].x + 6, 58, Z_FLOOR + 1.6] };

const front = () => [
  S(k.slabOf({ x: CASE.w - CHEEK, y: 0, w: CHEEK, d: CASE.d, r: 2 }, Z_FLOOR, Z_WALL + 1.2 - Z_FLOOR, P, 4, 0.8), { tone: "mid" }),
  L(k.planOutline({ x: CASE.w - CHEEK + 2.6, y: 24, w: 3.8, d: 36, r: 1.9 }, Z_WALL + 1.2, P, 4), { tone: "lo" }),
  S(k.slabOf({ x: 0, y: CASE.d - 4, w: CASE.w, d: 4, r: 1.6 }, Z_FLOOR, Z_WALL - Z_FLOOR, P, 4, 0.5), { tone: "mid", inner: L(k.sideSeam({ x: 0, y: CASE.d - 4, w: CASE.w, d: 4, r: 1.6 }, Z_FLOOR + 6, P, 4), { tone: "faint" }) }),
  // HP ruler strip on the front lip, ticks hang from its edge: one tick per HP, a major every 4
  S(k.slabOf({ x: CHEEK + 4, y: CASE.d - 3.4, w: CASE.w - 2 * CHEEK - 8, d: 2.4, r: 0.6 }, Z_WALL, 0.4, P, 3), { tone: "lo", crease: "none" }),
  // maker plate riveted to the front wall, three rule lines for the engraving
  S(k.slabOf({ x: 22, y: CASE.d, w: 46, d: 0.8, r: 0.3 }, -12, 9, P, 2), { tone: "lo" }),
  L([-5.2, -7.4, -9.6].map((z, i) => k.segment([25, CASE.d + 0.8, z], [25 + [30, 22, 26][i], CASE.d + 0.8, z], P)).join(""), { tone: "lo", free: true }),
  D([[24, -4.4], [66, -4.4], [24, -10.6], [66, -10.6]].map(([x, z]) => at([x, CASE.d + 0.8, z])), { size: 0.45, tone: "mid" }),
  // a row of closed vent slots
  L(Array.from({ length: 16 }, (_, i) => { const x = 92 + i * 6.2; return "M" + [[x, -12], [x + 2.6, -12], [x + 2.6, -3.5], [x, -3.5]].map(([a, z]) => at([a, CASE.d, z]).join(" ")).join("L") + "Z"; }).join(""), { tone: "lo" }),
  // power: a rocker in its bezel and a status lamp
  S(k.slabOf({ x: CASE.w - 46, y: CASE.d, w: 12, d: 0.6, r: 0.4 }, -12, 8.6, P, 2), { tone: "lo" }),
  S(k.slabOf({ x: CASE.w - 44, y: CASE.d + 0.6, w: 8, d: 1.6, r: 0.6 }, -10.6, 5.8, P, 2, 0.3), { tone: "mid" }),
  L(k.segment([CASE.w - 44, CASE.d + 2.2, -7.7], [CASE.w - 36, CASE.d + 2.2, -7.7], P), { tone: "lo" }),
  S(k.slabOf({ x: CASE.w - 30, y: CASE.d, w: 2.4, d: 0.8, r: 0.6 }, -8.6, 2.4, P, 3), { tone: "hi", crease: "none" }),
].join("") + (() => {
  const t = k.topTicks(CHEEK + 6, CASE.w - CHEEK - 6, 5.08, 4, CASE.d - 3.4, Z_WALL + 0.4, [0.9, 1.8], P);
  return L(t.minor, { tone: "lo" }) + L(t.major, { tone: "mid" });
})() + D([[CHEEK + 2, 2], [CASE.w - CHEEK - 2, 2], [CHEEK + 2, CASE.d - 2], [CASE.w - CHEEK - 2, CASE.d - 2]].map(([x, y]) => at([x, y, Z_WALL + 1.2])), { size: 0.5, tone: "mid" });

// ---------- Figure ----------
const body = [
  caseBack(),
  `<g data-seat>${seat()}</g>`,
  rails(),
  `<path data-rim class="iso-line" data-tone="lit" d="${k.planOutline({ x: MODULES[5].x - 0.2, y: FACE_Y, w: MODULES[5].w + 0.4, d: FACE_D, r: 1.2 }, Z_RAIL + 0.1, P, 3)}"/>`,
  ...MODULES.slice(0, 5).map((m, i) => `<g data-module="${i}">${moduleSvg(m)}</g>`),
  `<path data-ghost class="iso-line" data-tone="lit" d=""/>`,
  `<g data-cables></g>`,
  front(),
].join("");

const svg = k.figureSvg({
  width: W,
  height: H,
  label: "The B2B AI Standard as a modular rack. Five practitioner modules are seated and patched together: two rules, a skill and two scenarios. Slot 06 is empty, its bus header waiting, and one patch cable from the last scenario rests on its rail: your part.",
  body,
});

// ---------- Live ----------
const live = `
const P = ${JSON.stringify(P)};
const MODULES = ${JSON.stringify(MODULES)};
const CABLES = ${JSON.stringify(CABLES)};
const WAITING = ${JSON.stringify(WAITING)};
const TOP = ${TOP}, FACE_Y = ${FACE_Y}, FACE_D = ${FACE_D}, LIFT = 7;
export function mountRack(stage, { readout, onPick } = {}) {
  const svg = stage.querySelector("svg");
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const groups = MODULES.slice(0, 5).map((_, i) => svg.querySelector('[data-module="' + i + '"]'));
  const cablesG = svg.querySelector("[data-cables]");
  const rim = svg.querySelector("[data-rim]");
  const ghostEl = svg.querySelector("[data-ghost]");
  const seatPlan = { x: MODULES[5].x, y: FACE_Y, w: MODULES[5].w, d: FACE_D, r: 1.2 };
  const ghost = { x: 0, t: 0, phase: 0 };
  const lift = MODULES.map(() => ({ x: 0, v: 0, t: 0 }));
  let pick = -1, tour = true, clock = 0, last = 0, frame = 0, visible = false, idle = 0;
  const say = (i) => {
    if (!readout) return;
    const m = MODULES[i];
    readout.textContent = i < 0 ? "Rules, skills and scenarios" : m.n + " · " + (m.kind === "you" ? "Your part" : m.kind + " · " + m.title) + " · " + m.who + " · " + m.tag;
  };
  // A patch cable: plug at each jack, a sagging catenary between them, re-drawn when a module lifts.
  const cable = (a, ha, b, hb, sag, lit) => {
    const pts = [];
    for (let s = 0; s <= 1.0001; s += 1 / 18) {
      const x = a[0] + (b[0] - a[0]) * s, y = a[1] + (b[1] - a[1]) * s;
      const z = TOP + 4 + ha + (hb - ha) * s + sag * 4 * s * (1 - s);
      pts.push(iso([x, y, z], P));
    }
    const d = "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L");
    const plug = (p, h) => {
      const top = iso([p[0], p[1], TOP + 4 + h], P), base = iso([p[0], p[1], TOP + h], P);
      return '<path class="iso-line" data-tone="mid" d="M' + base[0].toFixed(1) + " " + base[1].toFixed(1) + "L" + top[0].toFixed(1) + " " + top[1].toFixed(1) + '" style="stroke-width:3.2;stroke-linecap:round"/>';
    };
    return '<g class="rk-cable"' + (lit ? ' data-lit=""' : "") + '><path class="rk-cable-body" d="' + d + '"/><path class="iso-line rk-cable-core" data-tone="' + (lit ? "lit" : "hi") + '" d="' + d + '"/>' + plug(a, ha) + (b.length ? plug(b, hb) : "") + "</g>";
  };
  function draw() {
    groups.forEach((g, i) => g.setAttribute("transform", translateAlong(P, [0, 0, lift[i].x])));
    const parts = CABLES.map((c) => cable(c.from.slice(1), lift[c.from[0]].x, c.to.slice(1), lift[c.to[0]].x, c.sag, false));
    const w = WAITING, h = lift[w.from[0]].x;
    // the waiting cable: from its jack, over the edge of scenario 05, down to the plug resting on the rail
    const a = w.from.slice(1), r = w.rest, pts = [];
    for (let s = 0; s <= 1.0001; s += 1 / 22) {
      const x = a[0] + (r[0] - a[0]) * s, y = a[1] + (r[1] - a[1]) * s;
      const z = (TOP + 4 + h) * (1 - s) * (1 - s) + (TOP + 22 + h * 0.5) * 2 * s * (1 - s) + r[2] * s * s;
      pts.push(iso([x + 10 * Math.sin(Math.PI * s), y, z], P));
    }
    const d = "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L");
    const tip = iso([r[0] + 1, r[1] + 5, r[2]], P), tail = iso([r[0], r[1], r[2] + 0.4], P), top = iso([a[0], a[1], TOP + 4 + h], P), base = iso([a[0], a[1], TOP + h], P);
    parts.push('<g class="rk-cable" data-lit=""><path class="rk-cable-body" d="' + d + '"/><path class="iso-line rk-cable-core" data-tone="lit" d="' + d + '"/>' +
      '<path class="iso-line" data-tone="mid" d="M' + base[0].toFixed(1) + " " + base[1].toFixed(1) + "L" + top[0].toFixed(1) + " " + top[1].toFixed(1) + '" style="stroke-width:3.2;stroke-linecap:round"/>' +
      '<path class="iso-line" data-tone="lit" d="M' + tail[0].toFixed(1) + " " + tail[1].toFixed(1) + "L" + tip[0].toFixed(1) + " " + tip[1].toFixed(1) + '" style="stroke-width:3.4;stroke-linecap:round"/></g>');
    cablesG.innerHTML = parts.join("");
    rim.toggleAttribute("data-on", pick === 5);
    // your module, hovering over the open seat and settling towards it while the seat is chosen
    if (ghost.x < 0.01) { ghostEl.setAttribute("d", ""); return; }
    const z = TOP + 2 + 16 * (1 - (ghost.phase % 1));
    ghostEl.setAttribute("d", planOutline(seatPlan, z, P, 3));
    ghostEl.style.opacity = (ghost.x * Math.min(1, (1 - (ghost.phase % 1)) * 3)).toFixed(3);
  }
  function tick(now) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    if (tour) { clock += dt; const step = Math.floor(clock / 2.4) % 7; setPick(step === 6 ? -1 : step, true); }
    let moving = false;
    ghost.t = pick === 5 && !still.matches ? 1 : 0;
    ghost.x += (ghost.t - ghost.x) * (1 - Math.exp(-dt / 0.25));
    if (ghost.t) { ghost.phase += dt / 1.8; moving = true; } else if (ghost.x > 0.01) moving = true; else ghost.phase = 0;
    lift.forEach((l, i) => {
      l.t = i === pick && i < 5 ? LIFT : 0;
      if (still.matches) { l.x = l.t; l.v = 0; return; }
      for (let s = 0; s < 4; s++) { l.v += ((l.t - l.x) * 180 - l.v * 22) * dt / 4; l.x += l.v * dt / 4; }
      if (Math.abs(l.t - l.x) < 0.01 && Math.abs(l.v) < 0.01) { l.x = l.t; l.v = 0; } else moving = true;
    });
    draw();
    frame = visible && (moving || tour) ? requestAnimationFrame(tick) : 0;
  }
  const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
  function setPick(i, fromTour) {
    if (i === pick) return;
    pick = i; say(i);
    stage.setAttribute("aria-valuenow", String(i + 1));
    if (!fromTour) run();
  }
  const steer = (i) => { tour = false; clearTimeout(idle); idle = setTimeout(() => { tour = !still.matches; clock = 0; run(); }, 4200); setPick(i); run(); };
  // Hit test against the modules' faceplates on screen (rest pose, so lifting never moves the target).
  const faces = MODULES.map((m) => [[m.x, FACE_Y], [m.x + m.w, FACE_Y], [m.x + m.w, FACE_Y + FACE_D], [m.x, FACE_Y + FACE_D]].map(([x, y]) => iso([x, y, TOP], P)));
  const inside = (pt, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c; } return c; };
  const hit = (e) => { const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse()); return faces.findIndex((f) => inside([p.x, p.y], f)); };
  stage.addEventListener("pointermove", (e) => { const i = hit(e); stage.style.cursor = i === 5 ? "pointer" : ""; steer(i); });
  stage.addEventListener("pointerleave", () => steer(-1));
  stage.addEventListener("click", (e) => { if (hit(e) === 5 && onPick) onPick(); });
  stage.addEventListener("keydown", (e) => {
    let i = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") i = Math.min(5, pick + 1);
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") i = Math.max(0, pick - 1);
    if (e.key === "Home") i = 0;
    if (e.key === "End") i = 5;
    if ((e.key === "Enter" || e.key === " ") && pick === 5 && onPick) { e.preventDefault(); onPick(); return; }
    if (i === null) return;
    e.preventDefault(); steer(i);
  });
  new IntersectionObserver((es) => { visible = es[es.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "80px 0px" }).observe(stage);
  if (still.matches) tour = false;
  say(-1); draw();
}
`;

writeFileSync(join(HERE, "rack.svg"), svg + "\n");
writeFileSync(join(HERE, "rack-live.js"), "// Generated by build.mjs. Kit runtime + rack behaviour.\n" + kitScript().replace(/^export /gm, "") + "\n" + live);
const review = k.plateHtml({ fig: "Fig 1", title: "The Standard, as a rack", hint: "Hover a module", readout: "Rules, skills and scenarios", body: `<div class="iso-stage rk" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="6" aria-label="The Standard's modules: arrow keys move between them">${svg}</div>` });
const css = `.rk-cable-body{fill:none;stroke:var(--anatomy-paper);stroke-width:3.4;stroke-linecap:round}.rk-cable-core{stroke-width:1.6!important;stroke-linecap:round}[data-rim][data-on]{stroke-width:1.6}`;
writeFileSync(join(HERE, "rack.html"), k.pageHtml({ title: "Rack", theme: "dark", body: `<style>${css}</style>` + review, script: kitScript() + live.replace("export function", "function") + `\nmountRack(document.querySelector(".rk"), { readout: document.querySelector("[data-readout]"), onPick: () => location.href = "mailto:znak@demandsense.com" });` }));
console.log("wrote rack.svg, rack-live.js, rack.html");
