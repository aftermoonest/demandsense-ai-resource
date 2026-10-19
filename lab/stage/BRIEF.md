# Stage lab brief

Project root: `/Users/aftermoonest/Files/Project Files/DemandSense/DS AI Resource`. Lab: `lab/stage/`.
Server already running: http://127.0.0.1:4181/ serves the project root (lab = http://127.0.0.1:4181/lab/stage/). Do not start another server.

## The task
Landing section `#stage` ("Why it is worth your time" / "We paid for the stage. You share the spotlight."): the left half holds an illustration, the right half the header and three facts (Main sponsor / 500-600 / Our ad budget). Today the illustration is an isometric hairline figure, a followspot on a truss over a stage (`illustrations/followspot.js`, built on `illustrations/hairline-kernel.js`). Oleksii's review:

- it reads **too small**, with **too few details**: make it bigger and much richer;
- **drop isometric: draw it in 2D** (elevation, section or plan, your call per variant);
- **show the audience: rows of seats below / in front of the stage** (Full Circle main room, 500-600 marketers);
- keep it **centred vertically** in the section next to the right column.

Make **five clearly different 2D variants** of this illustration. Keep the idea: DemandSense paid for the stage and the light; the contributor gets the spotlight. One spot of light on stage = "your place".

### Hard rules
1. **Only the illustration changes.** Header copy and the three facts stay verbatim (copy them from `index.html` `#stage`). Never edit files outside `lab/stage/`.
2. **Design language:** read `DESIGN.md` (§7 lines, §8.15 figures) and `design-system/tokens.css`; tokens only. White section, line drawing: 1px hairlines, neutral greys (`--neutral-800` edges, `--neutral-300` mid, `--neutral-100` faint), fills only as the plate colour to hide what is behind. No shadows, no glows, no gradients. **One accent only: primary blue (`--primary-450`), only on the spotlight / your spot.** Orange is not used in drawings.
3. **Edgy, not soft:** tight corners (radius ≤ 2px at display size), real detail: truss lattice, lamp fins, cables, stage boards, steps, monitors, mic stand, seat backs and armrests, aisle, row lines, exit sign shapes without words, etc. **No text, letters or digits inside the drawing.**
4. **Motion (mandatory):** read `.claude/skills/emil-design-engineering/animations.md`. Enter: the drawing draws in / settles on scroll into view (ease-out, ≤ 1.2s, staggered). Pointer: the spot follows the pointer across the stage (spring or ease-out, never linear), the lamp turns with it; leaving returns it to rest. `@media (hover: hover)` for hover-only behaviour; transforms/opacity/stroke-dashoffset only. `prefers-reduced-motion`: final state, static.
5. **Responsive:** 1512 desktop (figure ~612px wide in the left half, can be taller than wide) and 390 mobile (figure full width under the header). No horizontal scroll.
6. **Accessibility:** figure `role="img"` with an `aria-label`; decorative parts hidden.

## Deliverables (variant NN = 01…05)
- `lab/stage/base.html`: the section as it is now (links `../../landing.css`, `../../design-system/tokens.css`, the kernel, embed.js and followspot.js), for reference.
- `lab/stage/NN.html` (+ `NN.css`, optional `NN.js`, vanilla, small): same section, your figure in place of the followspot.
- `lab/stage/NN.json`: `{"title": "2–4 words", "what": "...", "why": "...", "how": "..."}`, 1–3 sentences each, plain English: **what** it shows, **why** this view and these details fit "we paid for the stage, you share the spotlight", **how** it is built (view, parts, motion, reduced motion, mobile).
- `lab/stage/index.html`: viewer in the style of `lab/hero/index.html` (desktop iframe + phone iframe + what/why/how per variant, base as 00).

## Process
For each variant: decide what/why/how first, build, then at least 2 polish rounds with screenshots:
`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --window-size=1512,1000 --virtual-time-budget=4000 --screenshot=/private/tmp/claude-501/stage-NN-desk.png http://127.0.0.1:4181/lab/stage/NN.html` and `--window-size=390,1400` for mobile. Read each PNG. Critique like a picky senior designer (scale, detail density without clutter, hairline crispness, one accent, nothing reads as text), fix. Stop when you would ship it.
