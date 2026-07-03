# Catalyst Dashboard — Design System & Rules

This documents the design language behind the **Catalyst — Marketing & Sales** dashboard,
routed at `/catalyst` and implemented as a feature module under `features/catalyst/`. It is a
self-contained, pixel-faithful replica built with Tailwind v4 + `lucide-react`, using
**dummy/static data**. This file is the source of truth for the visual rules so the layout can
be extended without drifting.

The module is decomposed to satisfy the repo's ESLint rules (one component per file, ≤40 lines
per function, ≤350 lines per file, explicit return types, named exports, no `any`). All colors
and dummy data live in `features/catalyst/constants.ts`; every card is a leaf server component.

---

## 1. Design philosophy

- **Calm, card-based analytics.** Everything lives on two floating rounded panels (sidebar +
  main) over a soft neutral canvas. Each metric is its own bordered card — no heavy shadows
  between cards, only a hairline border.
- **One accent, many neutrals.** A single warm red (the app's `--primary` brand) carries brand +
  primary data. The rest of the UI is grayscale. Secondary data colors (blue / purple / yellow /
  green) appear _only_ inside charts, never in chrome.
- **Data-ink first.** Charts are borderless, axis-light, and gridless where possible. The
  number is the hero (26px bold); the chart is supporting evidence.
- **Quiet chrome, loud numbers.** Labels are muted gray; values are near-black and bold.

---

## 2. Color tokens

Defined once as named constants in `features/catalyst/constants.ts` (mirror of the standalone
token block). **The brand color is pulled from the app's auth theme** (sign-in / sign-up) —
`--primary: #e04a3d` with `.auth-cta-btn` hover `#c53f34` / active `#b9382d` and `bg-primary/10`
tints — so the dashboard reads as the same Signalor brand, not a one-off orange. The "New
Products" CTA literally reuses the global `.auth-cta-btn` class.

| Token          | Hex                      | Usage                                                     |
| -------------- | ------------------------ | --------------------------------------------------------- |
| `BRAND`        | `#e04a3d` (`--primary`)  | Primary button, active nav, primary chart series, Organic |
| `BRAND_STRONG` | `#c53f34`                | Hover / active-nav text                                   |
| `BRAND_SOFT`   | `rgba(224,74,61,.10)`    | Active nav background (= `bg-primary/10`)                 |
| Positive       | `#2FBE7E` / bg `#E7F7EF` | Up-deltas, positive badges                                |
| Negative       | `#E5484D` / bg `#FDECEC` | Down-deltas, negative badges                              |
| Data blue      | `#3B9EF6`                | Tablet, Referral, Facebook row                            |
| Data purple    | `#8B5CF6`                | Mobile, Direct, Instagram row                             |
| Data yellow    | `#F6B93B`                | Desktop bar                                               |
| Data green     | `#2FBE7E`                | Radar "Returning visitors" series                         |
| Canvas         | `var(--cat-canvas)`      | Page background behind the two panels                     |
| Surface        | `var(--cat-card)`        | Sidebar + cards (main panel = `var(--cat-content)`)       |
| Ink / -2 / -3  | `var(--cat-ink[-2/-3])`  | Text tiers: value / label / meta                          |
| Border         | `var(--cat-border)`      | Panel + card borders (dividers = `--cat-border-soft`)     |

All neutrals are **theme tokens** that flip in dark mode — see §8b. The brand + data hues below are
fixed hex constants (identical in both themes).

**Rule:** the brand warm-red (`--primary`) is the only hue allowed in navigation, buttons and
active states. Blue/purple/yellow/green are reserved for data marks and their inline legends.

---

## 3. Typography

- **Family:** **Mona Sans** (GitHub's variable font, weights 200–900), loaded via
  `next/font/local` from `app/fonts/MonaSans.woff2` and wired app-wide as `--font-inter` →
  `font-sans`. Replaces Inter everywhere.
- **Scale**
  - Metric value — `26px / 700 / tracking-tight`
  - Sub-metric (device %) — `22px / 700`
  - Section title in card — `13px / 500`, `neutral-500`
  - Nav item — `14px / 500`
  - Section header (MAIN, SALES CHANNELS) — `11px / 600 / uppercase / tracking-wider`, `neutral-400`
  - Badges / deltas — `11–12px / 600`
  - Axis ticks — `10px`, `neutral-400`

**Rule:** never bold a label; never leave a value un-bolded. Contrast carries the hierarchy.

---

## 4. Spacing, radius, elevation

Tuned for a compact, calm feel: **one uniform medium radius, tight padding, minimal gaps, minimal
shadow.**

- **Radius — single scale:** everything box-like uses Tailwind `rounded-md` (`--radius-md` =
  `0.625rem − 2px` ≈ **8px**): the two panels, all cards, buttons, chips, segmented-control tracks,
  the logo tile, the % badges and radar labels. Inner segmented chips step down to `rounded-sm`
  (≈6px) so the nested pill still reads inside its track. Small **data marks** (heatmap cells,
  legend/split bars, checkboxes, view-toggle buttons) also use `rounded-sm`. Only genuinely circular
  marks stay round (`rounded-full`): avatars, legend dots, radar vertex dots.
- **Gaps (tight):** `8px` between the two panels **and** between cards; `8px` outer app padding;
  `10px` above the card grid. One consistent, snug rhythm.
- **Padding:** cards `12px` and sidebar `12px` (`p-3`); main panel `14px` (`p-3.5`).
- **Borders:** every surface is outlined with a `1px var(--cat-border)` border — the two outer
  panels **and** each card — for crisp definition against the canvas. Internal dividers (topbar
  underline, sidebar user separator) stay a step lighter at `var(--cat-border-soft)`.
- **Elevation (minimal):** on top of the border, only the two outer panels carry a single soft
  shadow (`0 1px 2px rgba(16,24,40,.05)`). Cards are **border-only, no shadow**. The primary button
  inherits `.auth-cta-btn`'s inset highlight only.

**Rule:** one radius, one gap value, one border weight — depth comes from the panel border+float,
not per-card shadows. Keep cards flat and spacing tight and even.

---

## 5. Layout

```
┌───────────── app (flex, gap 8, full-width w-full) ─────────────┐
│ ┌ sidebar 240px ┐  ┌────────────── main (flex-1) ────────────┐ │
│ │ Signalor logo  │  │ topbar (identity · tools · CTA)          │ │
│ │ workspace ⇅    │  │ ────────────────────────────────────    │ │
│ │ MAIN menu      │  │ grid: 3 cols × 2 rows, gap 8             │ │
│ │ SALES CHANNELS │  │   Sales · Visitors · Conversion          │ │
│ │ (spacer)       │  │   Channels · Retention · Weekly          │ │
│ │ theme·settings │  │                                          │ │
│ │ user footer    │  │                                          │ │
│ └────────────────┘  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

- **Width:** the app is **full-bleed** (`w-full`, no max cap) so the two panels stretch to fill
  the viewport; `main` is `flex-1` and each card flexes within the 3-column grid.
- **Scroll model:** the app is a fixed **`h-screen` / `overflow-hidden`** shell. The **sidebar
  never scrolls** (`flex-none`, footer pinned by a `flex-1` spacer) and the **topbar is pinned**
  (`shrink-0`). Only the **card grid scrolls** — it's the single `overflow-y-auto` region
  (`flex-1 min-h-0`) inside the `overflow-hidden` main panel. Never let the page body scroll.
- **Surfaces / gray:** `var(--cat-canvas)` behind everything, the **sidebar on `--cat-card`**, and
  the **main content panel on `--cat-content`** (a step darker) so the `--cat-card` cards read as
  raised tiles. The same track/hover tokens carry the segmented controls and the retention info box.
- **Responsive:**
  - Card grid reflows `xl:grid-cols-3` → `sm:grid-cols-2` → `grid-cols-1`.
  - **Sidebar** is `hidden lg:flex` — it drops out below `1024px` and the main panel takes the
    full width.
  - **Topbar** wraps (`flex-wrap`): the actions cluster moves to its own right-aligned row on
    narrow widths; identity text truncates. The **Filter** chip hides `< md`, the **date** chip
    hides `< sm`, leaving the icon buttons + CTA.
- **Sidebar footer pinned to bottom** via a `flex-1` spacer between the channel nav and the
  Settings/Support block.

---

## 6. Component patterns

### Metric header (every card)

`CardHead` (muted title + right-aligned text action) → `Metric` (big value + colored Badge).
The action link ("Report" / "Details") is always top-right, `neutral-500`, hover → `neutral-900`.

### Badge vs Delta

- **Badge** — the headline-number indicator chip: **white, `rounded-md`, `neutral-200` border**,
  a faint `1px` shadow, a **thin vertical accent bar** (`3px` wide, green up / red down) then the
  value in **dark `neutral-900` text**. The color lives only in the bar, not the text/background —
  a calm, tabular look next to the big metric.
- **Delta** — inline arrow + % for row-level changes; **no background**, icon is
  `ArrowUpRight` (positive) / `ArrowDownRight` (negative) at `strokeWidth 2.4`, colored by sign.

**Rule:** color + direction must always agree with sign. Positive = green (bar up-right), negative
= red (bar down-right).

### Segmented control

Neutral-100 track, `3px` padding, active chip = white pill with `shadow-sm` and bold text.
Used for time range (`1D…1Y`) and the radar series toggle.

### Navigation item

- Rest: `neutral-500`, icon `strokeWidth 1.8`.
- Active: `BRAND_SOFT` background, `BRAND_STRONG` text/icon, plus a **3px brand rail** bleeding
  off the panel's left edge (`left: -14px`) and a trailing chevron.

### List row (sales channels, funnel, table)

`icon · name … value · delta`, right-aligned numerics, `13px`. Table headers are `11px`
`neutral-400`; numeric columns right-aligned.

### Topbar controls (three-tone set)

- **Primary** — solid brand fill, white text (reuses `.auth-cta-btn`); `New Products` CTA only.
- **White chips** — the date + filter selectors and the search/bell icon buttons: **white fill,
  `neutral-200` border, a soft `shadow-sm`, compact `34px` height**, neutral text with `neutral-500`
  icons, hover `neutral-50`. Clean and lightly raised — the CTA carries the only color.
- **Ghost** — full-width bordered ("View reports"), hover `neutral-50`.

---

## 7. Charts (all inline SVG, no chart lib)

| Chart          | Card              | Technique                                                                                                                                                   |
| -------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Line           | Total Sales       | `<polyline>` from a normalized dummy series, brand stroke 2px, no axes                                                                                      |
| Split bars     | Total Visitors    | three flat rounded bars (yellow/blue/purple) + device %                                                                                                     |
| Area           | Conversion Rate   | data-driven from `CONV_SERIES` — two stacked area layers (brand→transparent gradients) + stroke line, aligned to the 6 month ticks                          |
| Stacked bar    | Visitors Channels | flex-weighted segments (`flex:5/4/2`) + dot legend                                                                                                          |
| Heatmap        | User Retention    | 7×12 grid of brand squares, opacity = `1 − col·0.075 − row·0.03` (dense bottom-left cohort fade)                                                            |
| Radar / spider | Weekly Visitors   | 7 axes = days of week (`RADAR_AXES`), grid rings + spokes, two overlaid polygons (New vs Returning), vertex dots filled with `--cat-card`, labels at 1.28×R |

**Chart rules**

- Compute geometry from data in code (see `LineChart`, `Radar`) — never hand-place points.
- Gridlines are `#EDEDED`, 1px; ticks are `10px neutral-400`.
- Series fill opacity `0.12`; series stroke `2px` solid.
- Primary series = brand; a second series may use green. No third series color in one chart.

---

## 7b. Multi-page shell & the Tasks page

The dashboard and Tasks share one frame, `CatalystShell` (fixed `h-screen` sidebar + one
scrollable content panel). Each page supplies its own **pinned header + scroll body** as children:

- **Routing:** `/catalyst` → `DashboardContent`, `/catalyst/tasks` → `TasksView`. The sidebar
  `NavItem` is a client `Link` that derives its active state from `usePathname()` (exact match for
  `/catalyst`, prefix match otherwise); non-active items may show a brand count badge (Tasks = 7).
  `Sidebar` is `'use client'` because it hands lucide icon components to the client `NavItem`.
- **Tasks toolbar** (pinned) — search field, list/board view toggle, status pills
  (`To Do / In Progress / Overdue / Completed / All`, active pill = brand-soft with a brand count),
  neutral `Assignee` / `Priority` dropdowns, and the brand `Create Task` CTA (`.auth-cta-btn`).
- **Stat cards** — 6-up responsive row (`2 → md:3 → xl:6`) of white bordered cards: colored icon +
  label + `⋮`, big `26px` value. Priority flags are filled (green/amber/red); doc icons stay outline.
- **Task table** — one white card wrapping a horizontally-scrollable `<table>` (`min-w-[920px]`).
  Columns: Task · Project · Description · Assignee · Due Date · Priority · Progress. Rows group by
  project; the parent row is bold, children indent `22px`. Cells reuse small parts: `ProjectTag`
  (colored initial tile), `AssigneeStack` (overlapping ring-2 avatars, `+N` overflow), `PriorityTag`
  (filled flag + label), and `ProgressCell` — an SVG ring (green = Done, gray = Not Started, brand =
  `N% Completed`).

---

## 7c. The Visibility page (`/catalyst/visibility`)

"Brand presence" — how AI engines surface the brand. Same shell (pinned header + scroll body).

- **Metric design — radial gauges (the signature viz here).** Each platform score is a **270°
  `GaugeRing`** (arc fills clockwise, gap centered at bottom, rounded caps) with the number centered,
  a small platform icon badge, and a status pill (`scoreStatus`: Strong / Moderate / Low / None).
  Arc + status color come from `scoreColor` (≥70 green, ≥40 amber, else red). The **Overall** card
  uses a **full `ScoreRing`** (not a gauge) so the headline reads distinct from the sub-scores. A
  0-value gauge draws only its track (no cap dot).
- **AI Engine & Platform Signals:** a `Share of Voice` bar chart (gridlines + per-engine bars),
  a `Mention Split` donut (`ScoreRing`), and a `Platform Reach` list — split by `lg:border-l`.
- **Platform Analysis:** `Google` / `Web` / `Reddit` cards sharing `AnalysisHeader` (icon badge +
  name + green "AI Analysis" pill + `scoreColor` score). Reusable parts: `StatTile` (mini metric),
  `BreakdownBar` (labelled meter), `VisChip` (on/off flags + count chips), `WebTopLinks`. Reddit is
  an empty state.

---

## 7d. The Sitemap page (`/catalyst/sitemap`)

"Sitemap Audit" — crawl + score every URL. Pinned tabs (`Sitemap` / `Agent log · SOON`) + scroll
body: the sitemap URL bar (`Re-run audit` CTA), a 4-up **Core Web Vitals** row, then the audit table.

- **Vitals cards:** `IndexedCard` (a completion bar, 36/36) + three `WebVitalCard`s (LCP/FCP/TTFB).
  Each web vital renders a **threshold bar** (`ThresholdBar` — green→amber→red gradient) with a
  marker dot at the value; "no data" dims the bar and shows an em-dash. Icons sit in tinted badges;
  the status caption is tinted (green "Good").
- **The audit table (the showcase):** one horizontally-scrollable table (`min-w-[1160px]`), columns
  URL · Status · Content · LCP · FCP · TTFB · Server · Resources · Links · AI · severity · Crawled.
  Rows are built by mapping a `cells[]` array (keeps `AuditRow` small) through reusable cell
  helpers: `TwoLine` (value + sub), `Dash`, `StatusPill` (green 200), `Ttfb` (colored by latency via
  `ttfbColor`), `AiCell` (score + amber mini-bar), `Warn`. **Interaction polish:** rows are
  `group cursor-pointer` — on hover the row tints, the path underlines, and the chevron nudges right.

---

## 7e. The Competitors page (`/catalyst/competitors`)

"Benchmark rival brands across AI surfaces." Deliberately **not a table** — a responsive **card
grid** (`3 → md:2 → 1`, `cat-stagger`) reads more premium than rows.

- **`CompetitorCard`:** brand monogram tile + name + clickable domain (brand-red link) + `⋯`; a
  reused **`GaugeRing`** for the AI score (colored via `scoreColor`, label via `scoreStatus`); a
  footer with a `RelationPill` and a dashed **"+ Add tags"** affordance. Cards lift on hover
  (subtle shadow — these are interactive list items, unlike the flat dashboard metric cards).
- **"My brand"** (Signalor) card is highlighted with `BRAND_SOFT` + a solid brand `My brand` pill;
  competitors show a `Direct` (amber) / `Indirect` (neutral) relation dropdown pill.
- Header toolbar: search + `All confidence` / `All scores` dropdowns + a square brand `+` CTA.

---

## 8. Iconography

- Library: **lucide-react**, default `strokeWidth 1.8` for nav / UI, `2.2–2.4` for delta arrows.
- Sizes: nav `18`, inline row `16`, delta `12`, topbar actions `19`.
- Brand logo is a hand-drawn 4-point sparkle on a conic-gradient brand-red tile.

---

## 8b. Theming (light + dark)

Dark mode is **self-contained to `/catalyst`** — it never touches global/root styles, so other
routes are unaffected.

- **Mechanism:** every surface reads a CSS variable (`bg-[var(--cat-card)]`,
  `text-[var(--cat-ink)]`, `border-[var(--cat-border)]`, chart grid `var(--cat-grid)`, canvas
  `var(--cat-canvas)`, …). The tokens are defined light on `:root` and overridden inside a `.dark`
  wrapper in `app/globals.css`. Flipping one class recolors the whole feature — no `dark:`
  utilities per element.
- **Surface tokens:** `--cat-canvas` (outer) · `--cat-content` (main panel) · `--cat-card`
  (sidebar, cards, chips) · `--cat-track` (segmented tracks) · `--cat-hover` · `--cat-border` /
  `--cat-border-soft` · `--cat-grid` (chart gridlines) · `--cat-ink` / `--cat-ink-2` / `--cat-ink-3`
  (text tiers). Layering (light→dark): canvas < content < card so cards float on both themes.
- **What stays fixed:** the brand red and the data hues (green/blue/purple/yellow) are identical in
  both modes — they read on light and dark alike.
- **Provider:** `CatalystThemeProvider` (client, in `app/catalyst/layout.tsx`) holds the boolean +
  `localStorage('catalyst-theme')`, and renders a `.dark` wrapper. It starts light on the server /
  first client render (hydration-safe) then syncs the saved preference on mount. `ThemeToggle` in
  the sidebar footer flips it (sun/moon).

---

## 8c. Motion

Intentionally minimal — a single **rise + fade** on mount so content settles in on load / refresh /
route change, then never moves again.

- One keyframe `cat-rise` (opacity 0→1, `translateY(8px)→0`, `0.42s`, ease-out). Two utilities:
  `.cat-rise` for a single element and `.cat-stagger` which animates its direct children with a
  `+0.05s` cascade (via `nth-child`).
- Applied to: the topbar / tasks toolbar (`.cat-rise`), the dashboard card grid and the tasks stat
  row (`.cat-stagger`), and the tasks table (`.cat-rise`). Metrics ride in with their card.
- **Respects `prefers-reduced-motion: reduce`** — the animation is disabled entirely.
- No hover/scroll animation and no per-number count-ups; motion is an entrance only, never ambient.

---

## 9. Extending this dashboard

1. **New card** → wrap in `<Card>`, lead with `<CardHead>` + `<Metric>`, keep it flat/bordered.
2. **New chart** → inline SVG, derive points from data, reuse the gridline/tick tokens above.
3. **New status color** → only if it's _data_; chrome stays brand + neutral.
4. **Wire real data** → replace the dummy `const` arrays in `features/catalyst/constants.ts`;
   the render layer already maps over them, so shape-compatible data drops in without JSX changes.
5. Keep the **26px bold value + muted label** hierarchy on every metric.

---

## 10. File map

```
app/catalyst/layout.tsx                     # CatalystThemeProvider (dark-mode wrapper)
app/catalyst/page.tsx                       # thin route → <CatalystDashboard/>
app/catalyst/tasks/page.tsx                 # thin route → shell + <TasksView/>
app/fonts/MonaSans.woff2                    # global sans font (next/font/local)
features/catalyst/
  constants.ts / tasks-data.ts              # tokens + typed dummy data (single source)
  index.ts                                  # public API (exports CatalystDashboard)
  components/
    CatalystShell.tsx                       # shared frame: sidebar + scroll panel
    CatalystDashboard.tsx / DashboardContent.tsx
    CatalystThemeProvider.tsx / ThemeToggle.tsx                      # dark mode
    Sidebar.tsx                             # SidebarLogo (Signalor) → WorkspaceSwitcher → menu
    SidebarLogo / WorkspaceSwitcher / SidebarUser / NavItem
    Topbar.tsx / TopbarActions
    Card / CardHead / Metric / Badge / Delta / RangeTabs             # primitives
    LineChart / AreaChart / Heatmap / Radar                          # inline-SVG charts
    ChannelLegend / ChannelTable                                     # shared card parts
    cards/          TotalSales, TotalVisitors, ConversionRate, VisitorsChannels, …
    tasks/          TasksView, TasksToolbar, TaskStatCards, TaskTable, TaskRow, …
```

**Sidebar structure (top→bottom):** `SidebarLogo` (Signalor app brand — solid-red tile + signal
glyph + collapse) → `WorkspaceSwitcher` (bordered `rounded-md` card for the active _Catalyst_
workspace with switch chevrons) → `Main` menu → `Sales Channels` → footer (`ThemeToggle`, Settings,
Support) → `SidebarUser`. Every row is `rounded-md`; active item = brand-soft fill + left rail.

- **To wire real data:** replace the exported `const` arrays in `constants.ts` — the render
  layer already maps over them, so shape-compatible data drops in with no JSX changes.
- A framework-free `catalyst-dashboard/index.html` mirror also exists at the repo root for a
  zero-toolchain preview of the same design.
