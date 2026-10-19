# Self-made decisions (review list)

Made while you were away (2026-10-19). Each one is reversible; say "revert N" or "change N to …".

## Illustrations (Phase 3)

1. **Hero stack** is CSS 3D, not a hairline figure: the front sheet holds real text (the rules list), and hairline forbids text inside a figure. Hairline logic kept: opaque plates, bright top edge, one accent (Your part), dotted floor.
2. **Skeleton bars** under each row (from the Vercel original) are back on desktop; hidden below 1200px to keep the hero short.
3. **Main room** (hairline figure) sits right of the benefits list in "What contributors get", not in "We paid for the stage" (the Vercel original shows the stage-with-names there). No read-out label on the page (it read as debug text); the figure speaks through the lit screen only.
4. **Icons**: 15 static isometric hairline objects. Mapping: Free = box with lifted lid; 4 Nov = desk calendar with one marked day; Your name = medal in a laurel wreath; Main sponsor = podium; 500-600 = seat block with one orange seat; Ad budget = coins; Your name (credit) = name card; Shared credit = two equal cards; Work to you = briefcase; Your page = sheet stack; On stage = platform + screen; Launch week = seven posts, launch day tallest; Paid reach = rings from a post; After launch = rising steps; Built with DemandSense = featured tile raised from a grid.
5. **Pass card** is a tilted lanyard badge (-2°), matching the hero tilt.
6. **Boards** get a 12px dot canvas (DESIGN §8.11 pitch ×2) and wire joints; level scale became a tick track (DESIGN §8.7 scale).

## Motion (Phase 2)

7. **One build per block, in reading order**, not one identical fade everywhere. Boards build along their flow: inputs → wire draws → main node → wire → outputs.
8. **Hairline icons draw their strokes** (stroke-dashoffset) and then fill.
9. **Timeline rail draws left→right**, each dot lands as the line reaches it (top→bottom on mobile).
10. **Pass badge swings in** on its lanyard (slight overshoot, the only bouncy motion on the page). **"Past due" chip stamps** onto the old playbook. **The Standard card rises** higher than the paper.
11. **Sticky tabs**: scroll-spy (no pinning, page length unchanged). One black pill slides between tabs (420ms ease-in-out); an orange hairline inside it shows progress through the current panel. Click scrolls smoothly; arrow keys move focus.
12. **Hero stack leans toward the pointer** (±6° / ±4°, damped follow), fine pointers only.
13. **Your part**: hover/focus tints the row (`brand-first-10`) and "writes" the dashed line solid in orange: the seat gets filled.
14. **Button arrows** nudge 3px on hover.
15. **Reduced motion**: opacity-only fades, no travel, no draw, no tilt, no smooth scroll.

## From the audit

16. **Orange means "your part" only.** The DemandSense MCP wire and key chips are now neutral (white/gray) so DemandSense is never the highlighted path (PRODUCT.md: never the hero).
17. **Close section** drops the repeated rules sheet below 1000px (it was a long duplicate when stacked) and hides it from assistive tech everywhere (`inert`), since the hero already has it.
18. **Two ways in waves**: Skill card = narrow, fine-fibered ribbon; Scenario card = wide, heavy bands (brief §7: thin vs bold stripes).
19. Touch: buttons, tabs and the email link reach 44px on coarse pointers; tab numbers hide below 400px.
20. Muted text below 24px moved from `neutral-500` to `neutral-800` where it sat on white (DESIGN §4.5).
21. Board connectors are drawn per block (centre to centre), so wrapped blocks never leave spurs.

22. **New token `--primary-550: #2556c4`** for the blue button hover: 1.6:1 against the default (brief §0.5 asks ≥1.4), white label 6.3:1. Needs adding to the Figma `Colors` collection.
23. **Main room plays one lap** (screen 1 → screen 3 → back to centre) the first time it scrolls into view, so readers learn it answers the pointer; never under reduced motion, and a real pointer takes over.
24. **"500-600" counts up** once (DESIGN §11 count-up pattern), width held so nothing shifts.
25. **WebGL waves fade in** over 1.6s when ready instead of popping.

26. **Smooth scroll for in-page links** (See what's inside, tabs) unless reduced motion.

## Round 3 (your review of 19 Oct)

27. **Hero = anatomy figure: the Standard as a modular rack.** Five practitioner modules sit in one case, patched together: rules are reference gauges (a dial), the skill reads the rule (input, sense knob, 4 band lamps with 2 of 4 lit, output), scenarios are wide modules with three inputs, a status window and trims. Slot 06 is empty: bus header waiting, orange rim, one orange cable from scenario 05 hanging into it. Hover lifts a module and names it in the caption line (verbatim list from the site); hovering the seat lowers a ghost module into it; clicking it (or Enter) writes to us. Idle tour cycles the modules. The old sheet stack stays only in the closing section.
28. ~~**Type colours** come from DESIGN §9.5 (Rule chart/6 blue, Skill chart/9 teal, Scenario chart/1 violet): badges, tinted board canvases, the level track, link pulses. Orange stays reserved for "your part".~~ Replaced 2026-10-19: badges, "your part" plates, board canvases and the level track are grey; boards follow §8.15 (bracket tag, monochrome, accent only on the travelling packet).
29. **One link system** for boards and the Build-with hub: curves fanning into the main block (desktop), L-lines on a left spine (mobile), drawn on reveal; a pulse runs each link once and again on hover.
30. **Build with** follows the original layout: a stack of tool cards fanning into "Your scenario", then DemandSense.
31. **Pass badge** gets a holographic foil (chart colours, colour-dodge) and a tilt that follow the pointer.
32. Connector arrows and button arrows use the Figma `icon/arrow` (node 795:14942).

## Verified

- Headless Chrome at 1512 / 1100 / 768 / 375 / 320: no horizontal overflow, no console errors.
- Every reveal reaches its end state, with and without reduced motion (155 elements checked).
- Keyboard: skip link first, visible focus rings, tablist arrow keys.
- main-room figure passes the hairline validator and look checks; one-lap intro verified.
- Not verified: Safari/Firefox, real touch devices, WebGL performance on low-end GPUs (5 live waves).

## Open for you

- Button labels on "Build with", "The Standard" card and both "Two ways in" cards all say "Bring your work" (not on the Vercel site).
- Figma still draws band rules edge-to-edge (DESIGN §7 updated, comps not).

33. **Your part** in the made-of cards is a signature line: the DS underline field (§8.2) with a gray [Your name] placeholder and a blinking orange caret (approved 19 Oct).
34. **Stage section ("We paid for the stage")**: two halves (DESIGN §6.1 chess rows, 80px gap). Left: a hairline figure, a followspot hanging from the sponsor's truss over the stage; the pointer steers the beam and the lit ring on the floor is the one orange line (your place). Right: header and the three facts stacked as ruled rows with their icons. Below 1000px: header, figure, facts. The black pass card and its holo foil are gone (approved concept, 19 Oct).
