// Footer CTA: a typewriter. Contributors' lines type out one after another on the sheet, the struck key lights,
// the carriage steps left with each letter and returns for the next line. The sheet and the struck key are the live (.lit) parts.
import { kernel, k, f, type Piece } from './iso';

const LINES = ['Hi there, here is my skill', 'Hello, let me submit my scenario', 'Hey, I have one interesting rule to share'];
const WRAP = 24, CPS = 12, HOLD = 1.6, FEED = .5, STEP = 3, LH = 15;
const BW = 260, BD = 190, BZ = 24, PX = 45, PW = 170, PY = 30, PZ = 76, PH = 150;
const KEYS = Array.from({ length: 4 }, (_, r) => Array.from({ length: 11 - (r === 3 ? 1 : 0) }, (_, c) => [30 + r * 7 + c * 19.5, 100 + r * 19] as const)).flat();

// Word-wrap each line to the sheet's width; a phrase's timing is its letters plus a hold and a feed
const wrap = (s: string) => s.split(' ').reduce<string[]>((ls, w) => {
  const last = ls[ls.length - 1];
  if (last !== undefined && (last + ' ' + w).length <= WRAP) ls[ls.length - 1] = last + ' ' + w; else ls.push(w);
  return ls;
}, []);
const PHRASES = LINES.map((s) => ({ rows: wrap(s), n: s.length }));
const DUR = PHRASES.map((p) => p.n / CPS + HOLD + FEED);
const PERIOD = DUR.reduce((a, b) => a + b, 0);

const K = kernel([[-30, 0, 0], [BW + 30, 0, 0], [0, BD, 0], [BW, BD, 0], [PX, PY, PZ + PH], [PX + PW, PY, PZ + PH], [-30, 60, 100]], 14);
const { on, poly, box, cyl, cylX, FRONT, TOP, SIDE } = K;

function machine(dx: number, typed: string[], fade: number, key: number, press: number) {
  let s = '';
  // Base and its deck lines, then the raised back housing and the carriage rail
  s += box(0, 0, 0, BW, BD, BZ, 'paper', 'body', 'tint');
  s += on(FRONT(0, BD, BZ), `<line class="det" x1="16" y1="8" x2="${BW - 16}" y2="8"/><rect class="f blk" x="${BW / 2 - 22}" y="12" width="44" height="5" rx="1"/>`);
  s += on(SIDE(BW, BD, BZ), `<line class="det" x1="12" y1="8" x2="${BD - 12}" y2="8"/>`);
  s += on(TOP(0, 0, BZ), `<rect class="det" x="14" y="84" width="${BW - 28}" height="${BD - 94}" rx="1"/>`);
  s += box(10, 0, BZ, BW - 20, 70, 36, 'paper', 'body', 'tint');
  s += on(FRONT(10, 70, BZ + 36), `<rect class="det" x="70" y="10" width="${BW - 160}" height="14" rx="1"/><line class="det" x1="12" y1="30" x2="${BW - 32}" y2="30"/>`);
  s += box(-16 + dx, 20, BZ + 36, BW + 32, 34, 10, 'paper', 'body', 'tint');
  // Left knob, the sheet with its typed rows, the platen in front of it, the right knob
  s += cylX(-30 + dx, -16 + dx, 40, 84, 11, 'paper', 'body');
  let text = '';
  typed.forEach((row, i) => { text += `<text class="type" x="12" y="${PH - 26 - (typed.length - 1 - i) * LH}">${row}</text>`; });
  s += `<g class="lit">${poly([[PX + dx, PY, PZ], [PX + PW + dx, PY, PZ], [PX + PW + dx, PY, PZ + PH], [PX + dx, PY, PZ + PH]], 'f paper')}` +
    on(FRONT(PX + dx, PY, PZ + PH), `<g style="opacity:${f(fade)}">${text}</g>`) + '</g>';
  s += cylX(-16 + dx, BW + 16 + dx, 40, 84, 16, 'paper', 'body');
  s += cylX(BW + 16 + dx, BW + 30 + dx, 40, 84, 11, 'paper', 'body');
  // Keys, back row first; the struck one sinks and lights
  KEYS.forEach(([x, y], i) => {
    const down = i === key ? press : 0;
    const cap = cyl(x, y, BZ, 7, 8 - 3 * down, 'paper', 'body');
    s += down > 0.05 ? `<g class="lit">${cap}</g>` : cap;
  });
  s += box(76, 176, BZ, 110, 9, 6, 'paper', 'body', 'tint');
  return s;
}

export const typewriter: Piece = {
  aria: 'A typewriter typing out contributors’ lines: here is my skill, let me submit my scenario, I have a rule to share.',
  period: PERIOD, rest: PHRASES[0].n / CPS + .6, viewBox: K.viewBox, focus: [0.5, 0.45],
  draw(t) {
    let u = t % PERIOD, i = 0;
    while (u >= DUR[i]) u -= DUR[i++];
    const { rows, n } = PHRASES[i];
    const shown = Math.min(n, Math.floor(u * CPS));
    // Rows typed so far; the carriage sits at the current row's column
    const typed: string[] = [];
    let left = shown;
    for (const r of rows) { if (left <= 0) break; typed.push(r.slice(0, left)); left -= r.length + 1; }
    const col = typed.length ? typed[typed.length - 1].length : 0;
    const typing = shown < n;
    const ch = LINES[i].charCodeAt(Math.max(0, shown - 1)) || 0;
    const press = typing && shown > 0 ? 1 - k(u * CPS % 1, 0, .6) : 0;
    const fade = 1 - k(u, n / CPS + HOLD, n / CPS + HOLD + FEED);
    return machine(-col * STEP, typed, fade, (ch * 7) % KEYS.length, press);
  },
};
