# DemandSense Design System

Single source of truth for the AI Resource landing page and anything built in the DS Report language. Code tokens: [design-system/tokens.css](design-system/tokens.css). Visual check: [design-system/specimen.html](design-system/specimen.html).

**Extracted from**

| Source | What it gave us |
|---|---|
| Figma `jiNJOOlaeRo2jTiNU64MQh`, page `components` (`119:2806`) | 12 component sections, all variant axes, exact paddings/radii/fills (read via Plugin API) |
| Figma `Colors` collection + 18 local text styles | Every color and type token below (verified values, not eyeballed) |
| Figma tool landing `788:45522` (`form-fixes`) | Landing section anatomy, 12-column grid, section rhythm |
| Figma report `516:88440` | Black hero, sidebar + main grid, edge lines, section headers, data components |
| Figma `mobile-blockers` (`801:16043`) | The only 375px comps: mobile margins and edge lines |
| `../DS Report/prototype/dist/*.css` | Shipped motion tokens, breakpoints, mobile behavior |
| https://the-ai-standard.vercel.app/ | Content structure we keep. Its visual style (navy glass, glows, Geist sans, gradients) is **replaced** by this system |

**Visual reference = Figma, not stored images.** Open a node with `https://www.figma.com/design/jiNJOOlaeRo2jTiNU64MQh/DS-Report?node-id=<id with - instead of :>` or `get_screenshot` via Figma MCP.

| Section | Node | Section | Node |
|---|---|---|---|
| Landing hero | `795:14889` | Report hero | `516:90732` |
| Landing demo (sample reports) | `788:45613` | Report main column + dividers | `516:88441` |
| Landing feature chess rows | `788:45632` | Report grid (sidebar, edge lines) | `516:90727` |
| Landing testimonials | `788:45675` | Report summary / after | `516:91221`, `516:91351` |
| Landing CTA | `788:45687` | Mobile blockers (375) | `801:15362`, `803:16313` |
| Landing features | `788:46638` | Colors (brand / custom palette) | `103:1084`, `103:1364` |
| Landing numbers | `788:46683` | Dividers (vertical / horizontal) | `206:53015`, `346:57229` |
| Landing FAQ | `788:46697` | Section header | `247:66581` |

Values marked *(derived)* have no Figma comp yet and were set from the shipped report build. Confirm or adjust them in Figma when the mobile landing is designed.

---

## 1. Principles

1. **Structure is drawn with lines, not boxes.** 1px edge-to-edge horizontal dividers, vertical edge lines, and whitespace carry the layout. Cards stay flat: no shadows, no nesting rounded cards inside rounded cards.
2. **One headline, two tones.** A section speaks in one sentence split into black (the claim) and gray (the context). No headline plus body paragraph.
3. **Black frames the story, white carries the content.** Hero and CTAs are black. Everything else is white.
4. **Two voices.** Inter Medium is the human voice (headlines, body). Geist Mono SemiBold uppercase is the machine voice (labels, buttons, tabs, numbers, metadata).
5. **Monochrome first, color means something.** Neutrals do the work. Orange marks sections and focus. Blue is the conversion action. Chart and brand colors appear only inside data.
6. **Numbers are evidence.** Mono, tabular, large. Demo or scripted numbers carry a visible "Demo" label.
7. **Motion explains state change.** Every change transitions with `ease-out`; nothing animates for decoration; reduced motion keeps opacity and drops movement.

---

## 2. Surfaces

| Surface | Background | Used for | Text | Lines |
|---|---|---|---|---|
| **Black** (`.surface-black`) | `neutral/1000` #000 | Hero (always), CTA sections (always), strategic summary in report | white / `neutral/300` | `neutral/800` #2d2f33 |
| **White** (default) | `neutral/0` #fff | Every other section | `neutral/950` / `neutral/500` | `neutral/100` #e2e3e6 |
Rules
- Hero is black, always. CTA sections are black, always. The rest is white. Never alternate white/gray section backgrounds.
- Figma still shows a navy CTA card (`primary/900`) on the landing and a blue `#004ebf` CTA band in the report. Both are superseded: CTAs are black.
- The black hero carries the live wave (§8.12) behind the right side. Copy stays on solid black on the left.
- A white card on black (hero form card) is allowed: `neutral/0`, radius 4, padding 40, `backdrop-blur 40`.
- Flipping a surface flips semantic tokens, not component markup. Components read `--text`, `--line`, `--action`.

---

## 3. Headlines

The headline is one continuous text block with two color spans. Same size, same weight, same line height. The black part states the point; the gray part adds context. Gray can come first when the context leads ("What each brand **keeps saying**, and what it **offers to get the click**").

```html
<h2 class="headline t-h2">Read a full report before you request yours. <span class="tone-2">Three full reports from SaaS, agencies and IT services.</span></h2>
```

| Surface | Tone 1 | Tone 2 |
|---|---|---|
| White | `neutral/950` #0b0c0d | `neutral/500` #767980 |
| Black | `neutral/0` #fff | `neutral/300` #aaadb3 (report uses #767980 on large sizes) |

- Sizes in use: hero 48 (landing) / 56 (report), section 40, report section 28, feature block 24, quote 28/1.4.
- Optional **section marker** above: 8px orange square + Geist Mono 12 uppercase (`chip`, micro). It labels the section ("FAQ", "WHAT YOU'LL GET"). It is not a second headline and never a sentence.
- No body paragraph under the section headline. If one line of support is unavoidable (form card: "Pick the two your buyers mention most"), use `p1` in `neutral/800`, 8px below.
- Quotes use the same trick inverted: gray sentence, black highlights on the key phrases.
- Max line: 650px for hero and section headlines, 514px in report headers.

---

## 4. Color

### 4.1 Primitives (Figma `Colors` collection, all 66 variables)

**Neutral**: 0 `#ffffff` · 25 `#f8f8f9` · 50 `#f0f1f2` · 75 `#e9eaec` · 100 `#e2e3e6` · 200 `#c6c8cc` · 300 `#aaadb3` · 500 `#767980` · 800 `#2d2f33` · 850 `#212326` · 900 `#161719` · 950 `#0b0c0d` · 1000 `#000000`. Alpha: `0-10` `#ffffff1a`, `1000-10` `#0000001a`.

**Primary (blue)**: 200 `#a4bcff` · 300 `#7ba0ff` · 450 `#3875f6` · 850 `#001a4c` · 900 `#00113a` · side `#78d7ff`.

**Secondary (orange)**: 300 `#fa8c16` · 400 `#d47300`.

**Status**: danger 450 `#d64c53` · 550 `#b2313a`; success 300 `#49b94b` · 450 `#169027`.

**Brand slots** (the compared companies, in order): first `#fa8c16` · second `#02bcfd` · third `#1764ff`, each with `-10` (10%) and `-25` (25%) alpha tints.

**Chart (categorical)**: 1 `#531aa0` · 2 `#7e003f` · 3 `#7c0f99` · 4 `#00ac6f` · 5 `#ff6a4b` · 6 `#55c0f9` · 7 `#ffae6f` · 8 `#ffb900` · 9 `#55e4db` · 10 `#c0526e` · 11 `#0080a4`.

The extended Figma palette (4 ramps and the 20×20 hue grid, Figma `colors/custom-palette` `103:1364`) is a picking source, not a token set. Promote a value to a variable before using it.

### 4.2 Semantic roles

| Role | White surface | Black surface |
|---|---|---|
| `--text` (headline tone 1, body) | 950 | 0 |
| `--text-2` (headline tone 2) | 500 | 300 |
| `--text-body` (support copy under h5/h6) | 800 | 300 |
| `--text-meta` (disabled, decorative; not readable copy on white) | 300 | 500 |
| `--line` (dividers, edge lines) | 100 | 800 |
| `--line-card` (card, media border) | 75 | 850 |
| `--bg-subtle` (row hover) | 25 | 900 |
| `--bg-muted` (inactive pill, open FAQ/feature) | 50 | 850 |
| `--action` (primary button) | 950 | 0 |
| `--action-brand` (form submit) | primary/450 | primary/450 |
| `--accent` (section marker, focus ring, current) | secondary/300 | secondary/300 |

### 4.3 Interaction

From Figma `neutral/interaction/*`: hovered solid fills step one notch toward contrast (0 → 200, 950 → 800, 50 → 200, 100 → 300); pressed fills go to `neutral/500`. Alpha fills: hover `#0000001a → #00000040`, pressed `#00000066` (white equivalents `#ffffff40` / `#ffffff59`). Inputs and FAQ rows hover by darkening their bottom line to `neutral/950`.

### 4.4 Color in data

- Funnel: awareness chart/2, consideration chart/9, retargeting chart/5.
- CTA strength: hard chart/3, medium chart/6, soft chart/4.
- Proof types: chart/1, chart/10, chart/7, chart/11, chart/5.
- Severity chips: Critical danger/550, Important secondary/400, Strategic success/450.
- Brands are always first/second/third in the same order across every chart.
- Empty chart tracks: `neutral/100` on white, `neutral/800` on black.

### 4.5 Contrast

Measured WCAG ratios:

| Pair | Ratio | Verdict |
|---|---|---|
| `neutral/500` on white | 4.36 | Large text only (≥24px): fine for headline tone 2 at 24–56px. Below 24px use `neutral/800` (13.4). |
| `neutral/300` on white | 2.25 | Decorative only (dividers, disabled). Never for readable text on white. |
| `neutral/300` on black | 9.34 | Any size. |
| `neutral/500` on black | 4.82 | OK for ≥14px; avoid for 10px labels. |
| White on `primary/450` | 4.16 | **Fails AA** for the 14px button label. Darken the conversion button to `#2f68e0` (5.03) or confirm in Figma. |
| `primary/200` on `primary/900` | 9.83 | Any size. |

Figma components that miss AA as drawn (measured in the rendered specimen). Kept faithful until the design decision is made:

| Element | Ratio | Proposed fix |
|---|---|---|
| Number badge "01" (white 12px on `primary/450`) | 4.16 | Same as the conversion button: darken to `#2f68e0` |
| Status chip "Important" (white on `secondary/400`) | 3.36 | `#b35f00` fill, or `neutral/950` label |
| Status chip "Strategic" (white on `success/450`) | 4.16 | `#127a21` fill |
| Insight header labels (`neutral/950` at 50% opacity on brand-10 tint) | ~3.6 | 70% opacity, or `neutral/800` solid |
| Inactive tab index / feature index (`neutral/500` 12–14px on `neutral/50` or white) | 3.85–4.36 | `neutral/800` index, keep the label at 950 |

---

## 5. Typography

Fonts: **Inter** (Medium 500 everywhere; SemiBold 600 only for side tabs and brand names) and **Geist Mono** (Medium 500 for numbers, SemiBold 600 for labels). Both are bundled locally in the report (`assets/InterVariable.ttf`, `GeistMono-Medium.ttf`, `GeistMono-SemiBold.ttf`). No other weights.

| Token | Font | Size / LH / Tracking | Use |
|---|---|---|---|
| headline/h1 | Inter 500 | 56 / 1.05 / -4% | Report hero title |
| display *(landing)* | Inter 500 | 48 / 1.05 / -4% | Landing hero headline |
| headline/h2 | Inter 500 | 40 / 1.1 / -4% | Landing section headline |
| headline/h3 | Inter 500 | 32 / 1.1 / -4% | Report summary headlines |
| headline/h4 | Inter 500 | 28 / 1.1 / -4% | Report section header, form card title |
| quote | Inter 500 | 28 / 1.4 / -4% | Testimonial body |
| headline/h5 | Inter 500 | 24 / 1.2 / -4% | Feature block title, card title |
| headline/h6 | Inter 500 | 20 / 1.2 / -4% | FAQ question, insight title, power-move card |
| headline/h7, body/p0 | Inter 500 | 18 / 1.4 / -4% | Lead, input value (large) |
| body/p1 | Inter 500 | 16 / 1.4 / -4% | Body, list rows |
| body/p2 | Inter 500 | 14 / 1.4 / -3% | Card body, FAQ answer, tooltip |
| body/p3 | Inter 500 | 12 / 1.4 / -3% | Captions |
| num/n1 | Geist Mono 500 | 64 / 1 / -4% | Big metric |
| num/n2 | Geist Mono 600 | 40 / 1 / 0, uppercase | Score labels |
| num/n3 | Geist Mono 500 | 24 / 1 / -4% | Inline stats (250 ADS ANALYZED) |
| label/l0 | Geist Mono 600 | 14 / 1.4 / 0, uppercase | Buttons default |
| label/l1 | Geist Mono 600 | 12 / 1.4 / 0, uppercase | Section marker, tabs, chips, small buttons, metric captions |
| label/l2 | Geist Mono 600 | 10 / 1.4 / 0, uppercase | Field labels, legal, micro meta |

Rules: tracking is negative for Inter, zero for mono. Mono is always uppercase. Numbers always `tabular-nums`. Use `text-wrap: balance` on headlines. Never bold Inter for emphasis: emphasis is color (tone 1 vs tone 2).

---

## 6. Grid and spacing

### 6.1 Desktop (design canvas 1512, applies ≥1000px)

```
|<40>|<-64->|<----------------- 1304 grid ----------------->|<-64->|<40>|
     ^ edge line (x=40)                               edge line (x=1472) ^
            |c1|16|c2|16| ... 12 columns, col 94px, gutter 16 ... |c12|
            ^ content starts at x=104                 ends at x=1408 ^
```

- **12 columns**, column **94px**, **gutter 16px**, **margin 104px** (= 40 to the edge line + 64 from the line to content). Grid width 1304.
- **The edge line sits outside the grid.** It never moves content: every section, ruled or not, aligns to the same 104px grid, so text lines up down the page. The 64px between line and content is a minimum and applies to everything, including headlines, cards, and cell rows.
- Above 1512 the grid stays 1304 wide and centered; the lines stay 64px outside it (at 1800 wide: line x=184, content x=248).
- This matches the Figma `divider` component: a 104px strip with the line at 40, so the line lands 40 from the edge and 64 from whatever follows.
- Span widths:

| Span | Width | Where |
|---|---|---|
| 3 col | 314 (326 as a gutterless cell) | Metric cell (4 per row, separated by vertical dividers instead of gutters) |
| 4 col | 424 | Sample report card (carousel) |
| 5 col | 534 | FAQ intro column |
| 6 col | 644 | Testimonial halves, "features" halves (6+6) |
| 7 col | 754 | FAQ list |
| 12 col | 1304 | Section header, full-width bands |

- Hero: copy 7 col (754) + form card 5 col (534). The Figma form card is 650 on the old 40px grid; at 534 it keeps its 40 padding.
- Feature **chess rows**: two halves of 612 with an **80px gap** (not the 16 gutter). Rows are 650 high, 128 apart.
- Cell rows (numbers, sample reports, testimonials): cells sit inside the grid and are separated by 1px vertical dividers instead of gutters.

*Figma's landing frames were drawn on a 40px margin with no vertical lines. The 104px grid supersedes them; measured Figma widths (708, 829, 676…) map to the spans above.*

**Report layout** (Figma `516:90727`): sidebar 220 at x=40 → vertical line at x=300 → main column 1172 (x=300–1472) whose content sits 64px inside the line (1044 wide at x=364) → right line at x=1472 → 40 margin. Both vertical lines run the full height of the analysis area (7,464px), from the bottom of the black hero to the summary. They do not continue into the black hero.

### 6.2 Spacing

Spacing scale (4px base): 2 · 4 · 6 · 8 · 12 · 16 · 24 · 32 · 40 · 64 · 80 · 128 · 160. Nothing off-scale except fixed component heights. Measured from the Figma auto-layout frames; desktop values, mobile in §6.4.

**Between sections**

| Gap | Desktop | Where it comes from |
|---|---|---|
| Hero → first section | 128 | `spaceholder/128` |
| Section → section (landing) | 160 | `spaceholder/160` |
| Section → section (report main column) | 128 band, divider line at 64 | `divider` 1172×128 |
| Chess row → chess row | 128 | report-features stack gap |
| Report hero rows (title / insights / gauges / cards) | 40 above + 40 below each full-bleed line | report hero |

**Section header** (marker → headline → tabs / actions → content)

| Gap | Value |
|---|---|
| Marker → headline | 16 |
| Headline → tabs or one support line | 24 (landing FAQ intro: headline → support line 16, support line → button 24) |
| Header → content | 40 (one exception: report "offers" uses 32; treat as 40) |
| Header actions (carousel arrows) → headline | aligned to headline bottom, arrows 8 apart, 24 from the headline column |
| Content block → next content block in the same section | 40 (`spaceholder/40`) |

**Headline → body**: by rule there is no body paragraph under a section headline. Where a block does carry copy (features column, content card, form card), the gaps are:

| Block | Headline → body | Body → action | Action → note |
|---|---|---|---|
| Features copy column | 16 | 16 | 8 (button → check row) |
| Content card | 4 (h5 → p2) | 24 | — |
| Form card | 8 (title → support) | — fields block follows at 40; fields 24 apart; fields → submit 80 | 16 (submit → legal) |
| Chess copy column | 16 (marker → headline → list, all 16) | list rows pad 16 / 0 | testimonial strip at bottom, 40 top padding, 24 between photo and text |

**Inside components**

| Component | Padding | Gap |
|---|---|---|
| Hero (landing) | 106 top (40 under the 66 site header), 40 sides, 40 bottom | 80 between headline group and list; 16 inside headline group; 8 list label → list |
| Hero form card | 40 | 80 fields → submit |
| Trust row under form | 40 above | 40 between rating and badges, 24 between badges |
| Sample report card | body 40 / 24 | 24 |
| Testimonial card | 40 | 40 logo+quote → person; 24 photo → name |
| Metric cell | 80 / 40 | 12 |
| `card/feature` row | 16 (active 16/16/20/16) | 16 icon → text, 12 inside text |
| `card/faq` row | 0 / 32 outer, 24 / 0 inner | 16 |
| Insight card | 4 outer, 6 / 12 header, 12 panel | 4 |
| Section marker | — | 6 icon → label |

### 6.3 Tablet (700–999px) *(derived from report build)*

- **8 columns**, gutter 16. Edge line at 24, content 40 inside it → **margin 64**.
- Two-column splits stack: copy first, media/form second, 32px apart.
- Carousels keep horizontal scroll-snap; cards become 300px wide.
- Section gap 120, hero gap 96, header→content 32.
- Horizontal dividers in the report become an 80px band with the line at 40.

### 6.4 Mobile (<700px, design base 375) *(Figma mobile comps + derived)*

```
|16|16|<----------- 311 grid ----------->|16|16|
 ^ edge line x=16 (fades 5% top/bottom)      ^ edge line x=359
       ^ content x=32                ends x=343 ^
```

- **4 columns**, column 65.75px, gutter 16, **margin 32** (= 16 to the edge line + 16 from the line to content; matches the Figma 375 frames). Edge lines at x=16 and x=359, 1px `neutral/100`, gradient-faded over the first and last 5% (Figma `divider` 32px strip).
- Horizontal dividers run between the edge lines (16 → 359), not to the screen edge.
- All content, including cell rows, sits 16px inside the lines (311 wide).
- Section gap 80, hero gap 64, header→content 24.
- Type steps down: display 36, h2 32, h4 24, n1 48 (report build uses `clamp(36px, 7.5vw, 64px)` for its hero).
- Everything stacks to one column. Metric cells go 2×2. FAQ goes full width under its intro. Buttons go full width in forms only.
- Minimum touch target 44px: xs (32) and small (36) buttons get padding or an invisible hit area on touch.

### 6.5 Breakpoints

| Name | Range | Columns | Edge line | Line → content | Grid margin |
|---|---|---|---|---|---|
| sm | < 700 | 4 | 16 | 16 | 32 |
| md | 700–999 | 8 | 24 | 40 | 64 |
| lg | 1000–1511 | 12 | 40 | 64 | 104 (fluid columns) |
| xl | ≥ 1512 | 12 | 64 outside the grid | 64 | grid stays 1304, centered |

Tokens: `--edge`, `--edge-inset`, `--margin` (= edge + inset), `--content-max` (1304).

---

## 7. Dividers and edge lines

The defining layout device. All lines are 1px, `--line` (`neutral/100` on white, `neutral/800` on black).

Three scales of line, from widest to narrowest:

| Line | Spans | Where |
|---|---|---|
| Full-bleed horizontal | 0 → 1512 (viewport edge to edge, ignores margins) | Report hero rows; top and bottom of landing cell bands (sample reports, testimonials, numbers); report summary sections |
| Framed horizontal | Between the two vertical lines only (report: 300 → 1472) | Report section dividers (`divider` 1172×128, line at y=64) |
| Column horizontal | Inside one column | List rows: feature list, FAQ, hero inbox list, `container` rows |

**Vertical edge lines (left and right).** They sit **outside the grid**: 40px from the viewport edge, then at least **64px of space before any content** (mobile 16 + 16). Adding or removing a line never shifts content; every section aligns to the same grid whether it is ruled or not.
- Desktop: lines at x=40 and x=1472, content 104 → 1408. Above 1512 the lines follow the centered grid, always 64 outside it. Mobile: x=16 and x=359, content 32 → 343.
- **Report**: same rule. The left line at x=300 is the sidebar/main boundary and content starts 64 later at x=364; the right line is at x=1472 with content ending at 1408. Both run the full height of the analysis area as one continuous rule, and the framed horizontal dividers stop at them.
- **Landing**: lines frame content bands (ruled sections and CTAs). Full-bleed horizontal lines close the band top and bottom, so each band reads as a ruled box that bleeds horizontally.
- **Mobile**: one continuous pair, fading over the first and last 5% of their height (Figma `divider` 32px strip with a gradient stroke).
- Figma component `divider` (`206:53015`): a 104px-wide strip, line at 40 (`left`), 64 (`right`), or 52 (`full`). It encodes the rule directly: 40 to the edge, 64 to content.

**Vertical, between cells.** Inside a bordered row, cells are separated by single vertical lines (metric cells, report hero brand gauges, category/edge split with 16px padding each side of the line).

**Horizontal band divider.** `divider` 1172×128 with the line centered (y=64) separates report sections; `is-transparent` keeps the space without the line.

Never: double lines, lines with gaps at the ends (except the mobile fade), dashed lines outside charts, shadows instead of lines.

---

## 8. Components

All measurements from Figma. `pad` is top/right/bottom/left.

### 8.1 Button

Axes: `type` filled · outlined · blur · ghost; `class` text-only · leading-icon · trailing-icon · icon-only; `size` default · small · xs; `surface` on-white · on-black.

| Size | Height | Padding | Gap | Label | Icon |
|---|---|---|---|---|---|
| default | 40 | 10 / 16 (icon-only 11 / 20) | 16 | l0 14px | 18 |
| small | 36 | 9.5 / 14 | 12 | l1 12px | 16 |
| xs | 32 | 7.5 / 12 (icon-only 8 / 16) | 10 | l1 12px | 16 |

| Type | On white | On black |
|---|---|---|
| filled | `neutral/950` fill, white label | white fill, `neutral/950` label |
| outlined | 1px `neutral/100` stroke (padding −1), black label | 1px `neutral/800`, white label |
| blur | `neutral/1000-10` fill + background blur 24 | `neutral/0-10` + blur 24 |
| ghost | no fill | no fill |

- All buttons: radius 100, Geist Mono SemiBold uppercase.
- **Conversion button** (landing form): `primary/450`, full width, pad 16 / 24 / 16 / 28, label l0 + a row of 10px mono check items (FREE · NO CREDIT CARD · …) at 60% luminosity beneath, 28px arrow on the right.
- **Carousel arrows**: icon-only pair; previous = outlined, next = filled.
- States: hover per §4.3 (report build uses `filter: brightness(.94)`); pressed `neutral/500`; focus ring 2px `secondary/300`, offset 4px.
- Missing in Figma: disabled and loading. Use 40% opacity + `cursor: not-allowed`; loading swaps the icon for a 16px spinner, label stays.

### 8.2 Text field

- Underline field, no box. Height 48 (default) / 53 (large). Bottom border 1px `neutral/1000-10` (on black `neutral/800`); hover and focus: `neutral/950` (on black white). Padding bottom 8, inner gap 4.
- Label above value: label/l2 10px, `neutral/800` (on black `neutral/500`).
- Value: p1 16px `neutral/950`; large uses 18px. Placeholder `neutral/500`.
- Fields stack 24px apart inside a form card.
- Missing in Figma: error and success. Error: underline and helper text `danger/550`, helper l2 under the line, 4px gap. Success: `success/450`.

### 8.3 Toggle

Switch 40×20, radius 1000. Off track `neutral/100`, on track `neutral/950`, knob 24×16 white (pill knob, not a circle). Labeled toggle: l1 label + switch, pad 8, gap 8, height 36.

### 8.4 Tabs

- **Pill tab** (`tab`): 36 high, pad 9.5 / 16, gap 16, radius 100. Index number + label in l1. Active: `neutral/950` fill, number `neutral/300`, label white. Inactive: `neutral/50` fill, number `neutral/500`, label `neutral/950`. `is-progress` adds an angular-gradient 2px ring that fills over time (auto-advancing tabs).
- **Compact tab** (`tab` 220×32): 28px square index badge (radius 1, active black with icon, inactive white with mono number) + l1 label.
- **Side tab** (`tab/side`): 40 high, pad 12, gap 6, radius 8, 16px icon + Inter SemiBold 14. Active: white fill + 1px `neutral/75`; inactive: no fill, `neutral/500`. Report sidebar navigation.

### 8.5 Chips and markers

| Chip | Spec | Use |
|---|---|---|
| Section marker | 16px icon (8px orange square) + l1, gap 6, no fill | Above every section headline |
| Outline chip | pad 4/8, radius 6, 1px `neutral/100` (black: `neutral/850`), Inter 14 | Filters, tags in text |
| Filled chip | pad 4/8, radius 2, `neutral/50` (black: `neutral/800`), p2 | Visual motifs, inline values ("+15%") |
| Status chip | pad 4/8, radius 2, l1 white on danger/550 · secondary/400 · success/450 | Severity |
| Tone chip | 28 high, radius 2, `neutral/50`, pair labels split by "/" | Tone scales |
| Logo chip | white pill, 1px `neutral/75`, pad 6.5/12/6.5/15, logo + l1 | Hero eyebrow ("LinkedIn · FREE LINKEDIN COMPETITOR ANALYSIS") |
| Tooltip | white, radius 2, pad 4/8, p2 black, 8×4 caret | Chip hover |

### 8.6 Cards

All cards: radius 4 (dark card radius 2), no shadow.

- **card/ad**: 362 wide, white, 1px `neutral/75`. Header row pad 16 (40px avatar + name/meta), media 16:9 with top/bottom line, body pad 24 with h6-ish text.
- **Sample report card** (landing demo): 467 wide cell with left/right lines, image 260 high, body: logo + market chip, h5-sized question (24/1.2), three `n3` stats with l1 captions.
- **Content card** (`card` 359): white, pad 40, gap 24: marker → h5 title + p2 body (gap 4) → outlined button.
- **Dark card** (`card` 300×250): `neutral/900`, radius 2, pad 24, gap 80; label l1 `neutral/500` at the bottom. Report "power moves" on black (emoji/icon, h6 title, p2 body, l1 index).
- **card/faq**: row pad 0 / 32, inner pad 24 / 0, bottom line `neutral/100`; hover: line `neutral/950`; open: `neutral/50` fill, radius 4, no line, answer p2 `neutral/800`. Plus/minus icon 20px right.
- **card/feature** (accordion list): row pad 16, gap 16, bottom line. Collapsed: 28px mono index `neutral/500` + h6 label. Active: `neutral/50` fill, radius 4, index badge becomes black square with check, body + small filled button revealed. `is-last` drops the line.
- **card/insight**: outer pad 4, radius 4, fill `brand/*-10` (on black `-25`). Header pad 6 / 12: l2 "Insight from" + brand + l2 id at 50%. Inner panel radius 2, white (on black `neutral/1000`), pad 12: h6 title + p2 body. Hypothesis variant: black outer, `neutral/850` inner.
- **Testimonial card**: 708 cell with left/right lines, pad 40, gap 40: logo, quote (28/1.4, gray with black highlights), 120px photo (radius 2, 1px `neutral/75`) + name p0 + role l1 + G2 rating.
- **Form card** (hero/CTA): white, radius 4, pad 40, gap 80 between fields block and submit block. Title h4 two-tone, support p1 `neutral/800`.

### 8.7 Data components

- **metric**: cell 358 × 270, pad 80 / 40, gap 12, centered: n1 64px value + l1 caption `neutral/800` (2 lines max).
- **Inline stat**: n3 24px value over l1 caption, 40px between stats.
- **Gauge**: segmented half-ring, segments 2px apart, filled in brand color, empty `neutral/800` on black. Value in h5/n2 + l1 caption inside.
- **Segmented bar**: rectangular segments with 2px gaps, filled left to right by category color; empty track `neutral/100`.
- **scale** (tone spectrum): row 52 high, pad 8, two pill labels at the ends (stroke `neutral/50` 2px), tick scale between with brand markers (avatar pins). Hover: row fill `neutral/50`, labels go black.
- **legend**: 16px square swatch (8px fill) + l1, or l2 only; gap 6.
- **point**: 20px numbered bullet + p2 (on black).
- **Number badge**: 24×24, `primary/450`, radius 1, l1 white centered ("01"). Used in the hero "what lands in your inbox" list.
- **Chart tooltip** (code): `neutral/950`, radius 6, pad 12 / 14, shadow-pop, n3 24px value, l1 rank line under a `#ffffff22` rule.

### 8.8 Layout components

- **header** (section header): type 1 = marker → 16 → headline (514 max in report) → 24 → tabs; type 2 = marker left column, headline + tabs right column; type 3 = type 1 + action button aligned to the headline baseline. Landing variant: headline 40px, carousel arrows right (124 wide, gap 8).
- **container** (bordered stack): row pad 24 / 0, top line, gap 24; `is-last` drops bottom padding.
- **divider**: see §7.
- **spaceholder**: 40 / 64 / 80 / 128 / 160 fixed spacers. Use them, not ad-hoc margins.
- **Site header and footer**: the main demandsense.com chrome (white bar, Inter 14, `#356ee7` Start free, blue newsletter card in footer). It is a different system; embed as-is, do not restyle to match.

### 8.9 Media and brand

- Logo: DemandSense wordmark 204×24, on-white and on-black versions.
- Avatars 80 (and 40, 20) circles with 1px `neutral/850` ring.
- Ad previews: 16:9 (200×113), 1:1, vertical 200×233. Always a 1px `neutral/75` inner border.
- Product screenshots sit on a saturated gradient panel (blue `primary/450` → `primary/side`, teal, or violet), 708×700, no radius, cards floating with soft blur. One panel per feature row, opposite the copy (chess layout).
- Trust row: G2 logo + 5.0 + five stars, certificate badges (GDPR, SOC 2, High Performer) 64 high, 24 apart.

### 8.10 Icons

24×24 line icons, `currentColor`, exported from Figma as SVG (never redrawn). Sizes in use: 12 (inside buttons' check rows), 16 (small buttons, chips), 18 (default buttons), 20 (FAQ, feature check), 24, 28 (conversion arrow). Set: arrow ×4, chevron ×4, check, check-circle, cross, link, minus, plus, square, play, no-card, chart-gantt, medal, newspaper, signpost, lightbulb, carousel, file-check, filter, gallery, gift, list, placeholder, scales, smile, speak, target, star, linkedin, g2.

### 8.11 Dot patterns

Dot grids fill empty structural space: the report sidebar below the navigation, the black overview panel behind the radar. They will be used more widely, so they are coded as CSS (`tokens.css`), not images.

**How Figma builds them.** Five 24×24 tiles on the components page (`04 · Patterns`, `358:36667`…`364:42784`), applied as Figma *pattern fills* at scale 0.25 (overview 0.26). That makes a **6px pitch with a 2px dot**, dot centered in its tile.

| Tile | Dot | Background | Used for | CSS |
|---|---|---|---|---|
| Sidebar (`206:54238`) | 8px `neutral/950` at 25% | white | Report sidebar, 220 × 430 under the nav | `.pattern` |
| Overview (`270:96477`) | 8px `neutral/900` | transparent, on black | Black overview panel, 1170 × 763, 5% fade on all four edges | `.pattern-on-black .pattern-fade` |
| `358:36667` | 8px `neutral/900` | transparent | Dark texture on white | `.pattern` + `--dot: var(--neutral-900)` |
| `358:36669` | 8px `neutral/0` | transparent | Light dots on black or color | `--dot: var(--neutral-0)` |
| `358:36671` | 16px `neutral/50` | transparent | Coarse, quiet texture | `.pattern-lg` |
| `364:42776` / `364:42784` | 8px 950 on white / 8px white on black | solid | Chart fills, legend swatches | `.pattern` with `--dot` and a background color |

Rules
- Pitch stays 6px for texture fills; scale only in multiples of 6 (12, 24) for chart fills.
- A pattern always sits in a bounded area (a panel or column), never across a whole section behind text.
- On black, always fade the edges (`.pattern-fade`, 5%) so the dots dissolve into the surface. Put the fade on a pattern-only layer: the mask also hides that element's own background.
- The report build approximated the overview with 1.3px `#2d2f33` dots at 55% opacity. Figma is the reference: 2px `neutral/900` dots.

### 8.12 Wave

The live ribbon on black heroes and CTAs. Code: `design-system/wave/` (sources) → `design-system/wave.js` (one self-contained bundle, three.js 0.180 included, 477 KB). Same engine as the Wave Lab study (`~/Documents/ChatGPT/Random/stripe-wave-lab`) and the report (`DS Report/prototype/scripts/wave/`).

```html
<div class="hero-wave" data-wave></div>                  <!-- defaults from wave/settings.json -->
<div class="hero-wave" data-wave='{"speed":0.05}'></div> <!-- per-instance overrides -->
<script src="design-system/wave.js" defer></script>
```

Placement: the host covers the whole hero; the script places the canvas with the live report's hero framing (`DS Report/prototype/scripts/wave/embed.js`, identical to ds-report.vercel.app): canvas at x = 33.13% of the hero width, y = 0, width 80.83%, height 94.94%; scene scale ×1.37; start time −1.5. The canvas overflows the right edge and is clipped by the host. Copy stays on solid black on the left. On mobile the host drops to 50% opacity behind the copy. Override per instance with `data-wave='{"frame":{"x":0,"w":1}}'`.

Behavior: renders only while on screen; `prefers-reduced-motion` draws one still frame; without WebGL the host stays plain black. Pixel ratio capped at 1.5.

Settings (`wave/settings.json`, from the Wave Lab inspector):

| Group | Values |
|---|---|
| Color | Gradient: `#3875F6` (primary/450) → `#FA8C16` (secondary/300) → `#3875F6`; background `#000000` |
| Motion | speed 0.100 · undulation −1.52 · wave frequency X 0.0058 · Z 0.0160 |
| Fold and twist | twist X −0.601 · Y 0.403 · Z −0.608 · falloff X 2.74 · Y 0.57 · Z 4.22 |
| Surface | fine lines 0.148 · glow 0.00 · grain 0.043 · saturation 0.44 · contrast 1.59 · hue shift 0.00 |
| Composition | Same as the live report: position (380, −301.7, −11.1) · rotation (−0.4496, −0.1176, 1.8744) · scale (9, 8, 5) · zoom 1 · time offset 17.5 |

To change the wave: export settings JSON from Wave Lab, replace `wave/settings.json`, run `npm install && npm run build` in `design-system/wave/`.

---

## 9. Page patterns

### 9.1 Section anatomy (white)

```
[ spaceholder 160 ]
[ marker ]                                   (l1, orange square)
[ two-tone headline, max 650 ]   [ arrows ]  (h2 40px)
[ 40 ]
─────────────────────────────────────────── full-bleed line (cell rows only)
│ 64 │ cell │ cell │ cell │ 64 │             edge lines outside the grid, 64 to the cells
───────────────────────────────────────────
```

Header alignment: left-aligned by default; centered for the "what you'll get" and "numbers" statement sections.

### 9.2 Hero (black)

Pad 106 top (below 66 site header), 40 sides, 40 bottom. Left column 766: logo chip → 16 → display headline (48, white, max 650) → 16 → lead p1 `neutral/300` with the promise sentence in white → push to bottom → l1 list label `neutral/300` + numbered list (blue badges, white p1, `neutral/800` row lines). Right column 650: white form card + trust row. Wave background behind the right side.

### 9.3 CTA (black)

Black band, full bleed. Left 766: marker + two-tone headline (white + `neutral/300`) + floating data cards (gauges, tone scale) over the wave. Right 650: white form card. Same layout as the hero, so a CTA reads as a return to the opening.

### 9.4 Feature chess rows

Two 6-col halves, 128 between rows. Copy half: marker → 24 two-tone headline (gray-led) → numbered list (mono index `neutral/500`, p1, bottom lines, 48 row height) → testimonial strip at the bottom. Media half: gradient panel with product UI.

### 9.5 Mapping the AI Standard structure onto this system

| Current section | Build with |
|---|---|
| Top bar "A DemandSense resource" + launch note | Logo chip + l1 date, in the black hero |
| Hero: title, maintained-by, deadline, 2 CTAs | Black hero, display two-tone, filled-on-black + outlined-on-black buttons |
| Numbered list (Rule/Skill/Scenario, practitioner, "Your seat") | `card/feature`-style rows: mono index, type chip (status-chip shape, neutral fill), title, practitioner l1; last row = CTA row |
| What we are building + 3 stats | White section, two-tone h2, metric cells in a bordered row |
| Why it is worth your time | Chess row with event photo/data panel |
| Rule / Skill / Scenario explainer | Pill tabs (01. RULE / 02. SKILL / 03. SCENARIO) switching one panel |
| Worked example table | Bordered `container` rows with line separators, mono column labels |
| Step flow (question → skill → rule → data → answer) | Numbered `point` chain on a lined grid; nodes = white cards radius 4 with `neutral/75` border |
| Scenario board | Same nodes on a `neutral/25` panel, connectors 1px `neutral/300`, chart colors only for node types |
| Tool grid | 4-col cells with vertical lines |
| Standard vs typical playbook | Two 6-col cells; left muted (`neutral/500` text), right full contrast; success/danger status chips |
| Credit, joining paths, benefits | `card/feature` accordion + content cards |
| Distribution timeline | Horizontal stepper: l1 phase labels, n3 dates, line connecting, orange dot on current |
| Closing CTA "Take your seat" | Black CTA band with form or email action |
| Footer disclaimer | Site footer + l2 LinkedIn® trademark line |

Type badges for Rule / Skill / Scenario: same shape as status chips (pad 4/8, radius 2, l1), filled `neutral/950` / `neutral/50` / outlined. Do not reuse the old blue/teal/violet coding; if color is needed, take chart/6, chart/9, chart/1 and keep it inside the badge.

---

## 10. Hover and pointer

From the report build (`report-v2.css`, `report-v2.js`, `tone-overlay.css`) and Figma interaction variables. All hover styles live inside `@media (hover: hover) and (pointer: fine)`; touch gets tap equivalents, never hover-only information.

| Element | Hover | Press / other |
|---|---|---|
| Button (all types) | One step toward contrast (§4.3); report build shortcut `filter: brightness(.94)` | `scale(.97)` on `:active`, fill `neutral/500` |
| Side nav link | label `neutral/500` → `neutral/950` | current: `neutral/50` fill (`aria-current`) |
| Table / matrix row | row fill `neutral/25`, 150ms | — |
| Tone scale row | row fill `neutral/50`, both end pills turn black with white text | click or Enter opens the side panel; same style on `:focus-visible` |
| FAQ row | bottom line `neutral/100` → `neutral/950` | open: `neutral/50` fill, line hidden |
| Text field | underline → `neutral/950` | same on focus |
| Ad card | preview image `scale(1.02)`, 300ms, clipped by the 1px frame | — |
| Insight / power-move card (in a rail) | lift `translateY(-2px)` + `0 8px 24px #0000000f`, 240ms | — |
| Chart segment or legend item | **focus + context**: every other segment in the same chart, and in charts that share the data scope, drops to 28% opacity; the hovered key and its legend item stay full | click pins the tooltip; click outside unpins |
| Chart tooltip | follows the pointer at +16px, flips to the other side near the viewport edge; fades in 150ms; re-entering within 300ms shows it instantly (no fade); hides after 40ms | dark `neutral/950`, radius 6 |
| Positioning chart avatar | guide lines grow from the avatar to both axes | — |
| Card rail (carousels) | auto-scrolling rails pause while hovered or focused | mouse drag scrolls after a 5px threshold and suppresses the click; arrow keys and the arrow buttons step one card with an eased scroll |

Never: hover-only content, color-only hover on text below 14px, font-weight change on hover (layout shift), hover on touch devices.

---

## 11. Motion

| Token | Value | Use |
|---|---|---|
| `--t-fast` | 150ms | hover color, opacity, tooltip in |
| `--t-base` | 240ms | enter/exit, accordion, tab swap |
| `--t-build` | 700ms | chart build-in |
| `--ease-out` | cubic-bezier(.23, 1, .32, 1) | default for everything entering or changing |
| `--ease-in-out` | cubic-bezier(.77, 0, .175, 1) | elements moving across the screen |

Shipped patterns to reuse:
- Tab panel crossfade 200ms; text swap out 120ms, in 160ms.
- Segmented bars refill `scaleX(.2 → 1)` from the left, stagger 40ms per row.
- Chart columns `scaleY(0 → 1)` from the bottom, stagger 40ms; segments stagger 4–8ms.
- Gauges/rings fade + `scale(.92 → 1)`.
- Card image hover `scale(1.02)` over 300ms; row hover fills `neutral/25`.
- Toast and tooltip: 8–16px rise + fade.
- Count-up numbers with tabular figures.
- Build-ins start when the block enters the viewport, run once.

Rules: animate `transform` and `opacity` only; name the properties (no `transition: all`); hover effects only inside `@media (hover: hover) and (pointer: fine)`; `prefers-reduced-motion: reduce` removes travel and scale, keeps opacity and timing. Accordions animate `grid-template-rows` 0fr → 1fr, not height.

---

## 12. Accessibility

- Focus: `outline: 2px solid var(--accent); outline-offset: 4px` on `:focus-visible` for buttons, links, tabs, summary.
- Skip link to main content.
- Tabs: `role="tablist"`, `aria-selected`, arrow-key navigation. Side nav: `aria-current="location"`.
- FAQ: `<details>/<summary>`. Dialogs: native `<dialog>`, Esc closes, `::backdrop` `#0008` + blur 4.
- Field labels are real `<label>`s; the l2 visual label is the label.
- Touch targets 44px minimum on mobile.
- Never put text under 24px in `neutral/500` on white, or any readable text in `neutral/300` on white (see §4.5).
- Charts get a text equivalent (caption or table) and never rely on color alone: legend labels sit next to values.

---

## 13. Do / Don't

Do
- Split every headline into black + gray in one block.
- Draw structure with 1px lines that reach the edges.
- Keep hero and CTA black, everything else white.
- Put numbers in Geist Mono and let them be large.
- Use `spaceholder` values for vertical gaps.

Don't
- Add a body paragraph under a section headline.
- Use shadows, gradients, or glows on cards (gradient panels behind product shots are the only gradient).
- Round anything except: buttons/tabs/pills (100), cards (4), chips (2/6), side tab and dialog (8).
- Use Inter bold or any weight other than 500 (600 only for side tabs and brand names).
- Introduce colors outside the token list.
- Carry over the current site's navy glass, glowing orbs, or 3D tilted sheets.

---

## 14. Open questions

1. No mobile landing comps exist. §6.3–6.4 numbers come from the shipped report and the 375 blocker frames; design one mobile landing in Figma to lock them.
2. Disabled, loading, and error states are not in Figma (§8.1, §8.2 give defaults).
3. Five Figma components miss AA contrast (§4.5 table). Darken or accept.
4. Site header/footer belong to the demandsense.com system. Confirm the resource page embeds them unchanged.
