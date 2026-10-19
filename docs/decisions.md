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

## Open for you

- Button labels on "Build with", "The Standard" card and both "Two ways in" cards all say "Bring your work" (not on the Vercel site).
- Figma still draws band rules edge-to-edge (DESIGN §7 updated, comps not).
- Blue CTA hover uses the report's `brightness(.94)`; default→hover contrast is below the brief's 1.4 target. A darker hover needs a new token: see audit notes.
