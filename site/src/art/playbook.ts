// Home "Why AI can't get LinkedIn Ads right": three blocks on a tray — the data (mismatched exports taped together),
// the judgement (a dial nobody calibrated) and the context (an account's history on a ruled plate). The section's
// scroll picks one; it lifts and lights. On the closing line they stack into one bound block, the playbook.
// draw(a, u): a = how lit each block is (0..1, eased by the page), u = 0..1 merge progress. Pure, so the build renders the first frame.
import { kernel, k, lerp } from './iso';

const W = 120, D = 90, Z0 = 12, GAP = 150;           // block footprint, tray top, spacing along x
const H = [36, 40, 30];                               // data, judgement, context heights
const MX = GAP;                                       // merged column x (middle slot)
const K = kernel([[-24, -24, 0], [2 * GAP + W + 24, -24, 0], [-24, D + 24, 0], [2 * GAP + W + 24, D + 24, 0], [MX, 0, Z0 + 106 + 30], [0, 0, Z0 + 60]], 24);
const { on, poly, line, box, cyl, TOP, FRONT, SIDE } = K;
export const viewBox = K.viewBox;

const slits = (x0: number, x1: number, y: number, n: number, step: number) =>
  Array.from({ length: n }, (_, i) => `<line class="det" x1="${x0}" y1="${y + i * step}" x2="${x1}" y2="${y + i * step}"/>`).join('');
const screw = (x: number, y: number) => `<circle class="f paper" cx="${x}" cy="${y}" r="2.6"/><path class="det" d="M${x - 1.6} ${y + 1.6}L${x + 1.6} ${y - 1.6}"/>`;

// The data: three slabs from different exports, none quite lined up, held with tape
function data(x: number, y: number, z: number) {
  const s = [[0, 2, 12, W - 4, D - 4], [3, 0, 12, W - 3, D - 2], [1, 3, 12, W - 2, D - 3]];
  let g = '';
  s.forEach(([dx, dy, h, w, d], i) => {
    const zz = z + i * 12;
    g += box(x + dx, y + dy, zz, w, d, h, i === 2 ? 'paper' : 'tint', 'body', 'tint');
    g += on(FRONT(x + dx, y + dy + d, zz + h), slits(6, w - 6, 3, 3, 3) + `<rect class="det" x="${w - 22}" y="3" width="14" height="6"/>`);
    g += on(SIDE(x + dx + w, y + dy + d, zz + h), slits(6, d - 6, 4, 2, 4));
  });
  const top = z + 36;
  // sheet rows on top, and two tape bands across top and down the front
  g += on(TOP(x + 1, y + 3, top), `<rect class="det" x="10" y="10" width="${W - 30}" height="${D - 28}"/>` + slits(14, W - 24, 18, 6, 9) +
    `<line class="det" x1="40" y1="10" x2="40" y2="${D - 18}"/><line class="det" x1="70" y1="10" x2="70" y2="${D - 18}"/>`);
  for (const tx of [22, 82]) {
    g += on(TOP(x + 1, y + 3, top), `<path class="f tape" d="M${tx} -2L${tx + 14} -2L${tx + 18} ${D}L${tx + 4} ${D}Z"/>`);
    g += on(FRONT(x, y + D, top), `<path class="f tape" d="M${tx + 4} 0L${tx + 18} 0L${tx + 16} 36L${tx + 2} 36Z"/>`);
  }
  return g;
}

// The judgement: a housing with a dial on top, two switches and a lever on the side
function judgement(x: number, y: number, z: number) {
  const h = H[1];
  let g = box(x, y, z, W, D, h, 'paper', 'body', 'tint');
  g += on(FRONT(x, y + D, z + h), screw(7, 6) + screw(W - 7, 6) + slits(14, W - 50, 16, 4, 4) +
    `<rect class="f paper" x="${W - 40}" y="12" width="12" height="18" rx="1"/><rect class="f blk" x="${W - 37}" y="15" width="6" height="6"/>` +
    `<rect class="f paper" x="${W - 24}" y="12" width="12" height="18" rx="1"/><rect class="f blk" x="${W - 21}" y="23" width="6" height="6"/>`);
  g += on(SIDE(x + W, y + D, z + h), slits(8, D - 30, 8, 5, 5) + `<circle class="det" cx="${D - 16}" cy="${h / 2}" r="7"/>`);
  // lever on the side
  g += box(x + W, y + D - 22, z + h / 2 - 3, 6, 6, 6, 'paper', 'body') + box(x + W + 6, y + D - 21, z + h / 2 - 2, 14, 4, 4, 'paper', 'body');
  // dial: a bezel cylinder with ticks, a needle that never settles on one answer
  const cx = x + W / 2, cy = y + D / 2;
  g += cyl(cx, cy, z + h, 30, 5, 'paper', 'body');
  let ticks = '';
  for (let i = 0; i <= 12; i++) { const a = Math.PI * (0.8 + i * 1.4 / 12); ticks += `<line class="det" x1="${(24 * Math.cos(a)).toFixed(1)}" y1="${(24 * Math.sin(a)).toFixed(1)}" x2="${((i % 3 ? 21 : 18) * Math.cos(a)).toFixed(1)}" y2="${((i % 3 ? 21 : 18) * Math.sin(a)).toFixed(1)}"/>`; }
  g += on(TOP(cx, cy, z + h + 5), ticks + `<path class="det" d="M-20 10A22 22 0 0 1 20 10"/><path class="f hlf" d="M-2 0L14 -16L2 2Z"/><circle class="f blk" r="3.5"/>`);
  return g;
}

// The context: a ruled plate carrying the account's own history and a marker where this campaign sits
function context(x: number, y: number, z: number) {
  const h = H[2];
  let g = box(x, y, z, W, D, h, 'paper', 'body', 'tint');
  let ruler = '';
  for (let i = 4, c = 0; i < W - 2; i += 4, c++) ruler += `<line class="det" x1="${i}" y1="0" x2="${i}" y2="${c % 5 ? 4 : 8}"/>`;
  g += on(FRONT(x, y + D, z + h), ruler + slits(8, W - 8, 16, 3, 4) + screw(W - 8, h - 7));
  g += on(SIDE(x + W, y + D, z + h), slits(6, D - 6, 10, 4, 5));
  // history on top: bars per month, a band for the account's normal range, and a crosshair on this campaign
  const bars = [22, 30, 26, 40, 34, 46, 38, 52, 44, 30];
  const top = bars.map((b, i) => `<rect class="f tint" x="${12 + i * 9.5}" y="${D - 12 - b * 1.2}" width="6" height="${b * 1.2}"/>`).join('');
  g += on(TOP(x, y, z + h), `<rect class="det" x="6" y="6" width="${W - 12}" height="${D - 12}"/>` +
    `<rect class="f band" x="8" y="${D - 12 - 46 * 1.2}" width="${W - 16}" height="${20 * 1.2}"/>` + top +
    `<g class="hlf-s"><line x1="${12 + 7 * 9.5 + 3}" y1="8" x2="${12 + 7 * 9.5 + 3}" y2="${D - 8}"/><line x1="8" y1="${D - 12 - 52 * 1.2}" x2="${W - 8}" y2="${D - 12 - 52 * 1.2}"/></g>` +
    `<circle class="f hlf" cx="${12 + 7 * 9.5 + 3}" cy="${D - 12 - 52 * 1.2}" r="3"/>`);
  return g;
}

// The playbook's cover and spine: drop on at the end of the merge
function binding(x: number, y: number, z: number, total: number, u: number) {
  if (u <= 0) return '';
  const cz = z + total + lerp(40, 0, u);
  let g = `<g style="opacity:${u.toFixed(3)}">` + box(x - 4, y - 4, cz, W + 8, D + 8, 7, 'paper', 'body', 'tint') +
    on(TOP(x - 4, y - 4, cz + 7), `<rect class="det" x="12" y="12" width="${W - 16}" height="${D - 16}" rx="1"/><rect class="f hlf" x="20" y="22" width="${W / 2}" height="6"/><rect class="det" x="20" y="34" width="${W / 3}" height="4"/>`);
  // rings down the front-left edge, through every layer
  for (let i = 0; i < 4; i++) g += line([[x + 10 + i * 8, y + D + 1, z + 4], [x + 10 + i * 8, y + D + 1, z + total + 2]], 'det spine');
  return g + '</g>';
}

// The lit copy cross-fades over the plain one, so a block never pops into colour
const lit = (a: number, inner: string) => (a < 1 ? inner : '') + (a > .005 ? `<g class="lit" style="opacity:${a.toFixed(3)}">${inner}</g>` : '');

export function draw(a: number[], u: number) {
  // merge in phases: the upper two rise clear, then data slides under and context slides over, then the cover drops
  const rise = k(u, 0, .4), slide = k(u, .35, .8), cover = k(u, .75, 1);
  const lift = (i: number) => a[i] * 10 * (1 - rise);
  const zJ = lerp(Z0, Z0 + H[0], rise), zC = lerp(Z0, Z0 + H[0] + H[1], rise);
  const xD = lerp(0, MX, slide), xC = lerp(2 * GAP, MX, slide);
  let g = '';
  // tray with rails and a slot under each block
  g += box(-24, -24, 0, 2 * GAP + W + 48, D + 48, Z0, 'paper', 'body', 'tint');
  g += on(TOP(-24, -24, Z0), [0, GAP, 2 * GAP].map((sx) => `<rect class="det" x="${sx + 16}" y="16" width="${W + 16}" height="${D + 16}" rx="2"/>`).join('') +
    screw(10, 10) + screw(2 * GAP + W + 38, 10) + screw(10, D + 38) + screw(2 * GAP + W + 38, D + 38));
  g += on(FRONT(-24, D + 24, Z0), slits(10, 2 * GAP + W + 38, 6, 1, 0));
  g += lit(a[0], data(xD, 0, Z0 + lift(0)));
  g += lit(a[1], judgement(MX, 0, zJ + lift(1)));
  g += lit(a[2], context(xC, 0, zC + lift(2)));
  g += lit(cover, binding(MX, 0, Z0, H[0] + H[1] + H[2], cover));
  return g;
}

export const aria = 'Three blocks on a tray: taped-together data exports, an uncalibrated dial, and a plate with an account’s history. At the end they stack into one bound playbook.';
