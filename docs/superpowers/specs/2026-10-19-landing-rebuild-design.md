# Landing rebuild: The B2B AI Standard for LinkedIn® Ads

## Context

Rebuild https://the-ai-standard.vercel.app/ as a static landing in the DemandSense Report design language. Current site = navy glass/glow style; replaced by our system. Task 3 in `TASKS.md`.

Sources of truth (agreed with Oleksii, 2026-10-19):
- **Content + section order:** Vercel site, verbatim, 1:1. No copy edits except those the brief explicitly agreed (chip "Final" → "Past due").
- **Look:** Figma DS Report file (`jiNJOOlaeRo2jTiNU64MQh`) + live report + `DESIGN.md` / `design-system/tokens.css`.
- **Section decisions:** `landing-rebuild-brief.md`, overridden by the answers below.
- **Rule:** any new design solution not in Figma/report/DESIGN.md gets approved by Oleksii before it ships.

Decisions from grilling (override brief where they differ):
- Dates: submissions close **21 Oct**, launch **4 Nov** at Full Circle (brief's "4 Nov deadline" is wrong).
- Stack: static HTML/CSS/JS, deployed on Vercel. CSS transitions + IntersectionObserver; no framework.
- Hero right: keep the site's concept + interaction (stacked sheets, front sheet = "Rules, skills and scenarios" list 01–06, sheets behind peeking, "Your part" row interactive). Redrawn in hairline concept, our colors. Live wave behind it. **No** Free/4 Nov/Your name chips in hero.
- "What we are building" stays: marker + headline + body + three cards with big illustration-icons (Free / 4 Nov / Your name).
- All three recognition sections stay as on site: "We paid for the stage", "Your name stays on it", "What contributors get".
- Rule / Skill / Scenario: sticky tab bar (01 Rule · 02 Skill · 03 Scenario) that switches on scroll, on all breakpoints; tabs also clickable (scroll to panel).
- Headline + body: allowed for now: marker → two-tone headline → body p1 `neutral/800` (DESIGN §3 rule relaxed; revisit later).
- Dark cards: live WebGL wave (`wave.js`) in each dark card; Skill card thin fibers, Scenario card thick.
- Primary CTA on dark: blue `primary/450` filled, as in Figma, not darkened. (Known: white 14px label on it = 4.16, below AA 4.5. Accepted by decision.)

## Page map (Vercel order, surfaces per brief)

| # | Section (site copy) | Surface | Build with |
|---|---|---|---|
| 0 | Top bar: "A DemandSense resource" · "Launch at Full Circle · 4 Nov" | black | Logo chip + l1 |
| 1 | Hero: The B2B AI Standard for LinkedIn® Ads, Maintained by, lead, Bring your work / See what's inside, Submissions close 21 Oct | black + live wave | display two-tone; blue filled + outlined-on-black; right: hairline sheet stack (interactive Your part) |
| 2 | What we are building + Free / 4 Nov / Your name | white | header + 3 cells with vertical dividers, big icon each |
| 3 | We paid for the stage. You share the spotlight. + contributor pass card + Main sponsor / 500-600 / Our ad budget | white | header + pass card (dark card, tokens) + 3 metric cells, small icon per number |
| 4 | What the Standard is made of: Rule → Skill → Scenario + For every level (Business owner ↔ Specialist) | white | 3 cells joined by "checked by / runs inside" connectors; "Your part" accented (orange marker); level scale |
| 5–7 | How a rule works / How a skill works / A scenario does the whole job | white | sticky pill tabs (DESIGN §8.4), scroll-driven; panels = bordered `container` rows, point chain, scenario board (inputs grouped → main node → outputs grouped); mobile: L-shaped connector lines (GitHub style) |
| 8 | What you build with: Build the best stack + DemandSense MCP | **black** (key promise) | 6 tool cells with lines + MCP card; blue button like hero |
| 9 | Not another playbook | white | left muted "typical playbook" (chip **Past due**), right **dark** "The Standard" card with live wave + button |
| 10 | Your insight, under your name (Your name / Shared credit / Work to you) | white | 3 cells, small icons |
| 11 | Two ways in: Send a skill / Build a scenario + Short on time note | white | two **dark** cards, live wave thin vs thick, own button each; note as plain p2 text below |
| 12 | What contributors get: Your name, on stage at Full Circle + 6 benefits + Built with DemandSense | white | hairline stage top-view illustration (stage line, audience dots, 3 screens with name) + benefit rows with small icons |
| 13 | One launch, then a reason to post every week | white | horizontal stepper: l1 phase, n3 date, connecting line, orange dot on current |
| 14 | Take your seat in the Standard + 21 Oct / week of 26 Oct / 4 Nov + Write to Iurii + email + Bring your work | black + live wave | mailto `znak@demandsense.com`; reuse hero sheet stack |
| 15 | LinkedIn® trademark disclaimer | white | l2 line |

Open copy point (confirm during build, not invented): button labels for sections 8, 9 and 11 are not on the site. Default = reuse "Bring your work" → mailto; 11 uses the card titles. Will show Oleksii before shipping.

Mapping note: site's stage-with-names visual sits in section 12, so the hairline stage illustration goes there; section 3 keeps the pass card. Brief §3 put the stage in section 3. Flag to Oleksii in the Phase 1 review.

## Files

- `index.html`: the landing at repo root (Vercel static root).
- `landing.css`: page styles. Imports `design-system/tokens.css`; tokens only, no raw values.
- `landing.js`: reveal-on-enter, sticky scroll tabs, hero "Your part" interaction. Small, no deps.
- `design-system/wave.js`: reused as is. Multiple `[data-wave]` hosts already supported (`wave/index.js:4`), renders only on screen (`wave/mount.js:122`). Card variants via `data-wave='{"fibers":…, "frame":…}'`.
- `design-system/fonts/*`: reused.
- `illustrations/`: hairline figures + static SVG fallbacks + small icons.
- `.claude/launch.json`: add `landing` config (python http.server on repo root, port 4181).
- `PRODUCT.md`: product context (impeccable requires it): audience = B2B LinkedIn Ads practitioners (agency + in-house); job = submit a skill/scenario before 21 Oct; mode = Persuade; framed as a free community resource, not a product.
- `DESIGN.md`: amend §2 (black key section + dark cards with wave on white), §3 (body under headline, temporary), §8.1 (blue CTA on dark, not darkened), §8.12 (wave in cards, fibers variants), new sticky scroll tabs pattern.
- `docs/superpowers/specs/2026-10-19-landing-rebuild-design.md`: this spec.
- `TASKS.md`: Task 3 in progress.

## Motion and a11y (CLAUDE.md + DESIGN §11–12)

- Section enter: fade-up 8–16px, 240ms `--ease-out`, stagger for card triplets, once per section.
- Tabs: crossfade 200ms; text out 120 / in 160. Reduced motion: opacity only, no travel.
- Hover only in `@media (hover: hover) and (pointer: fine)`; `:active` scale .97; focus ring 2px `--accent` offset 4.
- 44px touch targets; tabs `role="tablist"` + arrow keys; skip link; `<details>` where expandable.
- WebGL: ≤6 wave instances (hero, 8?, 9 card, 11 ×2, 14). Hero/CTA only if perf check fails on cards → report back, don't silently drop.

## Phases (stop after each for Oleksii's go-ahead)

1. **Docs + skeleton.** Commit spec, PRODUCT.md, DESIGN.md amendments, launch config. Build all 15 sections with verbatim copy, grid (12/8/4 col, edge lines, 160 gaps), surfaces, buttons, cards, chips. Waves wired. Illustration slots = static placeholders. Review at 1512 / 768 / 375.
2. **Interaction + motion.** Hero sheet stack + Your part, sticky scroll tabs, reveal-on-enter, wave variants in cards (thin/thick), hover/focus states.
3. **Illustrations.** `/hairline-create` per slot (hero sheet stack, stage top-view; 2–3 concepts each, Oleksii picks), then small icon set (Free, 4 Nov, laurel, sponsor, 500-600, ad budget, benefits). Map hairline theme vars to DS tokens; accent `#fa8c16` only; static fallbacks; validator must pass.
4. **Audit + polish.** `/impeccable audit`, `hallmark audit`, contrast, reduced-motion, mobile 320/375/414/768, console clean, WebGL perf.

## Verification

- `preview_start` `landing` → `read_console_messages` (no errors), screenshots at 1512 / 768 / 375 vs Figma nodes in DESIGN.md (`get_screenshot` through the Figma MCP).
- Copy diff: `get_page_text` of local vs Vercel, only the agreed differences.
- `resize_window` with reduced motion emulated through JS media check; tabs still switch, no travel.
- Keyboard pass: tab order, tablist arrows, focus rings visible.
- Contrast check script on rendered pairs; hover vs default ≥1.4 for buttons.
