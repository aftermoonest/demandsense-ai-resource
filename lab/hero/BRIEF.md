# Hero lab brief (shared by all 10 variant agents)

Project root: `/Users/aftermoonest/Files/Project Files/DemandSense/DS AI Resource`. Lab: `lab/hero/`.
Server already running: http://127.0.0.1:4181/ serves the project root (lab = http://127.0.0.1:4181/lab/hero/). Do not start another server.

## The task
The landing hero (black section) has, in its right column (`.c-5`), an object: a tilted 3D document ("sheet stack") listing the Standard's contents. Baseline = `base.html` + `base.css` + `base.js` (commit 3ffcb91). The client liked the idea but said it "looked poor": it needs **more detail, more volume, more small parts — work on its FORM, not on what it shows.**

A previous attempt replaced it with an isometric "modular rack" with knobs, gauges and cables. The client hated it: "it has no meaning at all". So:

### Hard rules
1. **Content is locked.** The object shows exactly this and nothing more (copy verbatim):
   - head: `The B2B AI Standard` · `Open for votes`
   - title: `Rules, skills and scenarios` (with "scenarios" in tone-2)
   - rows: 01 Rule · Audience Network fit · [Practitioner] Small budget / 02 Skill · Frequency check · [Practitioner] ABM / 03 Scenario · Account audit · [Practitioner] Creative / 04 Rule · Seniority splits · [Practitioner] Measurement / 05 Scenario · Weekly budget check · [Practitioner] Enterprise / 06 Your part · Your seat · Open until 21 Oct (link to mailto:znak@demandsense.com)
   - Decorative non-text parts are fine (edges, page thickness, rings, clips, tabs, rules, placeholder text-lines like the existing `.bars`) as long as they belong to the physical object and add NO new words, numbers, icons-with-meaning, knobs, dials, gauges, cables, LEDs, or invented mechanics.
2. **Only the hero object changes.** Left copy, topbar, wave background stay as in base. Do not touch anything outside `lab/hero/`. Never edit `base.*`, `index.html` or other agents' files.
3. **Design language:** read `DESIGN.md` and `design-system/tokens.css` first; use tokens (`var(--…)`), not raw values. Black surface, neutral greys, lines over fills, 1px hairlines, no drop shadows / glows (subtle tone gradients for volume are OK). Inter Medium for text, Geist Mono SemiBold uppercase for labels. **One accent only: orange `--accent` (#fa8c16), and only on row 06 "Your part".** Kind badges (Rule/Skill/Scenario) keep the colours `base.css` gives them.
4. **Motion (mandatory):** read `.claude/skills/emil-design-engineering/animations.md`. Enter animation on load (ease-out, the object assembles: sheets/parts settle, rows write in, staggered, total ≤ ~1.2s), pointer tilt/parallax on the hero (as base.js does, keep subtle), hover/focus state on row 06 (ease, 100–150ms for colour; transforms for movement), `@media (hover: hover)` for hover. Animate only transform/opacity/clip-path/filter; no `transition: all`. `prefers-reduced-motion`: everything static at its final state.
5. **Responsive:** must look right at 1440×900 desktop and at 390px mobile (on mobile flatten the 3D and keep it readable; 44px tap target for row 06). No horizontal scroll.
6. **Accessibility:** decorative parts `aria-hidden="true"`, the list stays a real `<ol>`, row 06 stays a focusable link with visible focus.

## Deliverables (your variant number NN)
- `lab/hero/NN.html` — copy of `base.html` with `<link rel="stylesheet" href="NN.css">` replacing `variant.css` (and `<script src="NN.js" defer></script>` if needed). You may change the markup *inside* `.c-5` only. Keep `base.css`/`base.js` linked and override in your files; if base.js hero code conflicts, neutralise it in your CSS/JS rather than editing base.
- `lab/hero/NN.css` (+ optional `NN.js`, vanilla, small).
- `lab/hero/NN.json`: `{"title": "2–4 words", "what": "...", "why": "...", "how": "..."}` — the three blocks, 1–3 sentences each, plain English:
  - **what** we show (must equal the locked content; say so and name what the form adds),
  - **why** this form fits the hero logically (what the object says about the resource: open, community-built, a place for you),
  - **how** it is built (form, materials, details, motion, reduced-motion, mobile).

## Process (loop until it is final)
1. Answer what / why / how for yourself first; let "why" drive the form.
2. Build.
3. Screenshot and look, at least **3 polish rounds**:
   `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --window-size=1440,900 --virtual-time-budget=4000 --screenshot=/private/tmp/claude-501/hero-NN-desk.png http://127.0.0.1:4181/lab/hero/NN.html`
   and the same with `--window-size=390,844` for mobile. Read the PNG with the Read tool. Also capture a mid-animation frame (lower `--virtual-time-budget`, e.g. 500) to check the enter motion.
   Each round: critique it like a picky senior designer (alignment to the grid, hairline crispness, depth reads as real volume, detail density without clutter, text legible, nothing invented, accent only on 06), then fix. Use the `impeccable` / `hallmark` skill guidance if useful; `anatomy` / `hairline-create` only if they help draw detail in our palette (no knobs/mechanisms).
4. Stop only when you would ship it. Report back in ≤8 lines: files, what/why/how in one line each, what you are least sure about.
