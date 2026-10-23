// Footer CTA: a catalogue card tray, cards tabbed by library (scenarios a, skills b, rules c), one slot empty.
// A blank card drops into the gap, its tab fills in and it stays filed: your work joins the Standard. Monochrome; only
// the new card (.lit) takes the accent.
import { kernel, hue, k, f, type Piece } from './iso';

const TW = 90, TL = 200, TH = 44, CH = 62, STEP = 10, GAP = 9, Y0 = 16, LIFT = 90;
const yGap = Y0 + STEP * GAP;
const K = kernel([[0, 0, 0], [TW, 0, 0], [0, TL + 8, 0], [TW + 4, TL + 8, 0], [-4, TL + 8, TH + 18], [0, 0, CH + 8], [TW, 0, CH + 8], [8, yGap, CH + LIFT + 30], [TW - 8, yGap, CH + LIFT + 10]], 14);
const { on, poly, box, FRONT } = K;
const TABS = ['a', 'b', 'c'] as const;

// A card standing across the tray at depth y, bottom raised by dz; its tab sits at one of three stops by library.
const card = (y: number, i: number, dz = 0, { blank = false, tab = 1 } = {}) => {
  const x0 = 8, w = TW - 16, z = 2 + dz, at = [6, 29, 52][i % 3];
  let g = poly([[x0, y, z], [x0 + w, y, z], [x0 + w, y, z + CH], [x0, y, z + CH]], `f paper${blank ? ' dashed' : ''}`);
  g += on(FRONT(x0, y, z + CH), `<rect class="f body" style="opacity:${f(tab)}" x="${at}" y="-7" width="16" height="7" rx="1"/>` +
    (blank ? `<circle class="f body" cx="${w / 2}" cy="18" r="7"/><path class="det" d="M${w / 2 - 3.5} 18h7M${w / 2} 14.5v7"/>` : `<line class="det" x1="6" y1="9" x2="${w - 18}" y2="9"/>`));
  return hue(TABS[i % 3], g);
};

function tray(dz: number, show: number, lit: number) {
  let svg = '';
  // Floor, back wall, left wall (inner faces), all in the scenarios hue
  svg += hue('a', poly([[4, 4, 0], [TW - 4, 4, 0], [TW - 4, TL, 0], [4, TL, 0]], 'f tint') +
    box(0, 0, 0, TW, 4, TH, 'paper', 'body', 'tint') + box(0, 4, 0, 4, TL - 4, TH, 'paper', 'tint'));
  for (let i = 0; Y0 + i * STEP < TL - 10; i++) {
    const y = Y0 + i * STEP;
    if (i !== GAP) { svg += card(y, i); continue; }
    if (show > 0.01) svg += `<g class="lit" style="opacity:${f(show)}">${card(y, i, dz, { blank: lit < 0.5, tab: lit })}</g>`;
  }
  // Right wall, then the front panel: label holder, pull, rod end; its thickness is the black edge
  svg += hue('a', box(TW - 4, 4, 0, 4, TL - 4, TH, 'paper', 'body') + box(-4, TL, 0, TW + 8, 8, TH + 18, 'paper', 'blk', 'tint'));
  svg += on(FRONT(-4, TL + 8, TH + 18), `<rect class="f paper" x="${(TW + 8) / 2 - 17}" y="10" width="34" height="15" rx=".5"/><line class="det" x1="${(TW + 8) / 2 - 11}" y1="17.5" x2="${(TW + 8) / 2 + 11}" y2="17.5"/>` +
    `<rect class="f paper" x="${(TW + 8) / 2 - 13}" y="34" width="26" height="9" rx="4.5"/><circle class="blk" cx="${(TW + 8) / 2}" cy="54" r="3.5"/>`);
  return svg;
}

export const cta: Piece = {
  aria: 'A card catalogue tray with one empty slot. A blank card drops into the gap and is filed with the others.',
  period: 4.5, rest: .9, viewBox: K.viewBox, focus: [0.5, 0.42],
  draw(t) {
    const u = t % 4.5;
    const dz = LIFT * (1 - k(u, .35, 1.55)), lit = k(u, 1.45, 1.95);
    return tray(dz, k(u, 0, .45) * (1 - k(u, 3.7, 4.5)), lit);
  },
};
