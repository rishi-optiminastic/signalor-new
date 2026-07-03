# Remove the AI Feel — UI Redesign Directive

> **Read this before touching any UI in this project.**
>
> **The mission:** this project's UI currently looks *AI-generated* — flat,
> templated, generic. Your job is not to preserve it. **Your job is to remove
> that feel and make it genuinely better** — editorial, intentional, and
> hand-composed. Treat every screen you touch as a redesign opportunity, not a
> reskin. When a screen already violates the rules below, **fix it**, don't
> match it.
>
> The colour tokens named here (`violet`, pastels, `--ink`, etc.) are one
> project's palette — **swap them for your own**. The *principles, ladders and
> numbers* (opacity, sizing, spacing, motion) are palette-agnostic — keep them.

---

## First: how to tell your UI feels AI-generated

If you can check more than two of these, the screen feels AI-made. **Each one is
a thing to remove.**

- [ ] One flat gray-on-white palette; colour used for decoration, not meaning.
- [ ] A wall of evenly spaced, identical-size cards — no focal point.
- [ ] A generic `<table>` / DataTable on every screen regardless of the data.
- [ ] Material / heavy drop shadows everywhere.
- [ ] Pure black text (`#000`) on pure white (`#fff`).
- [ ] One font at three weights doing all the work; no editorial contrast.
- [ ] Loose, uniform padding — everything breathes the same, nothing is anchored.
- [ ] Buzzword copy: *seamless, unlock, empower, "we're SO excited"*.
- [ ] Every page in a section looks like every other page.

**The fix, in one line:** two fonts, two colours, one accent — colour that
*means* something, one number that anchors each section, and exactly one
deliberate break from the grid.

---

## The core principle: two fonts, two colours, one accent

The busy-check to apply to every screen:

- **Serif for soul, sans for signal.** A characterful serif *only* on page
  titles, big metric numbers, and gauge values. A clean sans (Inter/Geist) on
  everything else — never a serif eyebrow, button, or pill. This single
  contrast is the fastest way to stop looking templated.
- **A body colour, one accent, a pastel chorus.** Lean on one brand colour,
  land the eye on exactly **one** accent detail per screen (a live dot, a
  progress fill), use pastels for meaning.
- If a screen feels noisy, **remove something** — don't add structure.

## Multi-coloured — but every colour *means* something

Colour is **data, not decoration**. This is the single biggest reason a UI
reads as intentional instead of AI-random. Define a small semantic palette and
use it *consistently* — a colour should map to a state or an identity, not to
"this looked nice here." Example mapping (swap colours for your brand):

| Role | Meaning |
| --- | --- |
| green | active / on-track / healthy |
| amber | idle / late / watch-list |
| red/pink | needs attention / at-risk |
| warm (peach) | secondary / tasks |
| blue (sky) | neutral / info |

- **Identity colour** — a department / user / category keeps *the same* colour everywhere.
- **Status colour** — live state (active / idle / offline …) always the same mapping.
- **Bands** — thresholds map to green / amber / red by rule, not by eye.
- **Use design tokens, never raw hex** — except data-driven state/band values.

## The four composition moves that kill the AI feel

1. **Anchor with a number.** Every section gets one figure you can read across
   the room, in serif (`78%`, `13 active`, `6h 12m`). This focal point is what
   stops a screen looking like a uniform grid of equal boxes.
2. **Break the grid once.** Exactly **one** asymmetric move per screen (a hero
   spanning 8 of 12 columns, an overlapping stack, a metric that breaks the
   column). One — never three.
3. **Make every page unique.** Two pages in the same section must **not** both
   be tables. Pick the form from the *shape* of the data: status→board,
   time→timeline/calendar, part-of-whole→gauge/segment/seat-map, trend→sparkline.
   Reuse the *primitives*, not the layout. **This is the biggest lever.**
4. **No hard shadows, never pure black.** Cards = a hairline border +
   `rounded-md` + a *soft* shadow. Text = a near-black ink (e.g. `#1a1530`),
   not `#000`. Surfaces = a tinted paper/off-white, not `#fff` everywhere.

## Copy

Imperative + specific, one number per claim: *"Assign task", "Open live monitor
→", "Idle for 45+ min"*. **Delete:** seamless / unlock / empower / revolutionise
/ "we're SO excited" — the words that scream AI marketing.

---

## Text-opacity ladder (build hierarchy without new colours)

Depth comes from **opacity over the ink/white base**, not extra grays. Build
3–4 levels from *one* colour before reaching for a second.

- **On light surfaces:** primary `text-ink` → secondary `/80 → /70 → /60` →
  meta `text-muted`, softened with `text-muted/55` (the workhorse) down to `/40`.
- **On dark / coloured heroes:** headline `text-white` or `/90` → body `/85 →
  /75 → /70` → secondary `/65 → /60 → /55` → faintest `/45 → /40`. **Never**
  drop white below ~40% — it stops being legible.
- **Fills / hairlines:** `bg-white/10 · /15 · /20` for chips on colour;
  `bg-ink/3 · /5 · /10` for inset panels / hover on light; `bg-ink/40` scrims.
  Borders lean on a single low-alpha `--line` token (e.g. `rgba(26,21,48,0.1)`).

## Type-size ramp (dense & editorial, not bloated)

AI UIs run everything at 14–16px. Go **smaller and denser** for signal, bigger
only for the anchor.

- **Body / table:** `12px` (most common), `13px`.
- **Captions / meta:** `11px`, `10px`; micro-labels `9px`.
- **Eyebrows:** 11px / weight 500 / uppercase / `0.18em` letter-spacing.
- **Numbers in tables:** sans + `tabular-nums`. Metric blocks / gauges: serif.
- **Serif ramp:** panel title `16` · section heading `18` · KPI value `~23` ·
  page title `28 → md:36` · hero metric `44 → md:58`.
- Don't invent sizes outside this ramp — bake them into shared
  `PageHeader` / `SectionHeading` / `StatCard` / `Panel` components.

## Gap / spacing rhythm (why it feels tight & intentional)

Whitespace is **earned**, not loose. If a block feels full, delete an element
before adding structure.

- **Vertical:** page/section stacks `space-y-3`; inside cards `space-y-1.5 /
  space-y-2 / space-y-2.5`. Cards padded `p-3 md:p-4` — not `p-6 md:p-8`.
- **Horizontal / flex:** `gap-1.5` & `gap-2` are the defaults (icon↔label,
  chips); `gap-3` between cards; `gap-1 / gap-0.5` tight clusters; `gap-4 /
  gap-5` only for major column splits.

## Responsive discipline

Mobile-first with **explicit** `sm:` / `md:` / `lg:` ramps — never a desktop
layout that happens to shrink.

- Filter rows stack: `flex-col sm:flex-row`.
- Tables wrap in `overflow-x-auto` and drop secondary columns on small
  (`hidden md:table-cell`).
- Multi-column heroes collapse their split; type ramps carry `md:` bumps.

## Motion

Gentle, organic, and **always** degrades under `prefers-reduced-motion`. A
staggered entrance (80–160ms), a bar/ring that animates to its value, a soft
hover lift — never animate more than the hero + one section at once. A 300ms
reveal is what makes a grid of numbers feel *considered* rather than dumped.

---

## How to fix an existing "AI-feeling" screen (step by step)

1. **Diagnose** against the checklist at the top — list what's wrong.
2. **Kill pure black/white and heavy shadows** first — swap to ink/paper tokens
   and soft shadows. Instant de-AI win, low risk.
3. **Introduce the serif** on the page title + the one hero number.
4. **Assign colour meaning** — replace decorative colour with the semantic map;
   route everything through tokens.
5. **Find the anchor number** for each section; make it big and serif.
6. **Re-pick the primary viz** if the screen is "just a table" — match it to the
   data's shape so the page gets its own identity.
7. **Tighten spacing** to the rhythm above; **add one grid-break**.
8. **Build the opacity/size/gap ladders in**, add restrained motion, verify the
   responsive ramps.
9. Re-run the smell test below.

## Pre-ship smell test

- [ ] Two fonts, two colours, one accent — nothing more.
- [ ] Every colour maps to a state / identity / band, not decoration.
- [ ] One read-across-the-room serif number per section.
- [ ] Exactly one grid-break / asymmetric move.
- [ ] Not "just a table" — the viz fits *this* data's shape; pages differ.
- [ ] Hairline border + `rounded-md` + soft shadow — no hard shadows, no pure black.
- [ ] Squeezed rhythm: `space-y-3`, `p-3 md:p-4`, dense type ramp.
- [ ] Hierarchy built from opacity, not new grays.
- [ ] Mobile-first with explicit `sm:` / `md:` / `lg:` ramps.
- [ ] Copy imperative, specific, buzzword-free.
