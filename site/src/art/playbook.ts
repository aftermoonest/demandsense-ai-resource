// Home "Why AI can't get LinkedIn Ads right": an exploded stack of three blocks — the data (mismatched exports taped
// together), the judgement (a dial nobody calibrated) and the context (an account's history on a ruled plate). The
// section's scroll picks one; it slides out and lights. On the closing line the gaps close and a cover drops on: one
// bound block, the playbook. draw(a, u): a = how lit each block is (0..1, eased by the page), u = 0..1 merge progress.
import { kernel, k, lerp } from './iso';

const W = 120, D = 90, G = 64, POP = 18;              // footprint, gap between exploded layers, slide-out of the lit one
const H = [36, 40, 30];                               // data, judgement, context heights
const TOP_Z = H[0] + H[1] + H[2] + 2 * G + 14;        // highest point, spread
const K = kernel([[0, 0, 0], [W + POP, 0, 0], [0, D, 0], [W + POP, D, 0], [0, 0, TOP_Z], [W + POP, D, TOP_Z]], 20);
const { on, line, box, cyl, TOP, FRONT, SIDE } = K;
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
function binding(x: number, y: number, total: number, u: number) {
  if (u <= 0) return '';
  const cz = total + lerp(40, 0, u);
  let g = `<g style="opacity:${u.toFixed(3)}">` + box(x - 4, y - 4, cz, W + 8, D + 8, 7, 'paper', 'body', 'tint') +
    on(TOP(x - 4, y - 4, cz + 7), `<rect class="det" x="12" y="12" width="${W - 16}" height="${D - 16}" rx="1"/><rect class="f hlf" x="20" y="22" width="${W / 2}" height="6"/><rect class="det" x="20" y="34" width="${W / 3}" height="4"/>`);
  // rings down the front-left edge, through every layer
  for (let i = 0; i < 4; i++) g += line([[x + 10 + i * 8, y + D + 1, 4], [x + 10 + i * 8, y + D + 1, total + 2]], 'det spine');
  return g + '</g>';
}

// The lit copy cross-fades over the plain one, so a block never pops into colour
const lit = (a: number, inner: string) => (a < 1 ? inner : '') + (a > .005 ? `<g class="lit" style="opacity:${a.toFixed(3)}">${inner}</g>` : '');

export function draw(a: number[], u: number) {
  // the gaps close first, then the cover drops
  const close = k(u, 0, .7), cover = k(u, .6, 1), gap = G * (1 - close);
  const z = [0, H[0] + gap, H[0] + H[1] + 2 * gap];
  const x = (i: number) => a[i] * POP * (1 - close);
  let g = '';
  // exploded-view guides: dashed lines from each layer's visible corners up to the next one
  if (close < 1) {
    const o = (1 - close).toFixed(3);
    for (let i = 0; i < 2; i++) for (const [cx, cy] of [[W, 0], [W, D], [0, D]] as const)
      g += `<g style="opacity:${o}">${line([[cx, cy, z[i] + H[i]], [cx, cy, z[i + 1]]], 'det dashed')}</g>`;
  }
  g += lit(a[0], data(x(0), 0, z[0]));
  g += lit(a[1], judgement(x(1), 0, z[1]));
  g += lit(a[2], context(x(2), 0, z[2]));
  g += lit(cover, binding(0, 0, H[0] + H[1] + H[2], cover));
  return g;
}

export const aria = 'An exploded stack of three blocks: taped-together data exports, an uncalibrated dial, and a plate with an account’s history. At the end they close up into one bound playbook.';
