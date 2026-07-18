/**
 * Shared chrome for every dashboard control — icon tiles, dropdown chips and the
 * search field. Centralised so the edge and lift stay identical across the app.
 */

/**
 * The hairline edge + lift carried by every control.
 *
 * Ringed rather than bordered so the edge paints outside the box and controls
 * keep their exact 34px height. The explicit dark ring is required: `--foreground`
 * is defined only in `:root` and is never redefined under `.dark`, so
 * `ring-foreground/10` on its own renders 10% black on a near-black card.
 */
export const CONTROL_RING = 'shadow-sm ring-1 ring-foreground/10 dark:ring-white/10'

/** Square, icon-only control — theme toggle, feedback, help, notifications. */
export const ICON_TILE =
  `grid h-[34px] w-[34px] shrink-0 place-items-center rounded-md bg-[var(--cat-card)] ` +
  `text-[var(--cat-ink-2)] transition-colors hover:bg-[var(--cat-hover)] ` +
  `hover:text-[var(--cat-ink)] ${CONTROL_RING}`

/**
 * Labelled control with a caret — date range, engine filter.
 *
 * `whitespace-nowrap` is load-bearing: the label is a bare text node, so without
 * it a crowded top bar wraps "Last month" onto two lines and the chip outgrows
 * its 34px height.
 */
export const CONTROL_CHIP =
  `inline-flex h-[34px] shrink-0 items-center gap-2 rounded-md bg-[var(--cat-card)] px-3 ` +
  `text-[13px] font-medium whitespace-nowrap text-[var(--cat-ink)] transition-colors ` +
  `hover:bg-[var(--cat-hover)] ${CONTROL_RING}`

/**
 * The ⌘K search field. Focus deliberately restates the brand ring for both
 * themes: `focus:` and `dark:` carry equal specificity, so the dark focus ring
 * must be spelled out to beat `dark:ring-white/10` rather than rely on source order.
 */
export const SEARCH_FIELD =
  `h-[34px] w-full rounded-md bg-[var(--cat-card)] pr-10 pl-9 text-[13px] ` +
  `text-[var(--cat-ink)] outline-none placeholder:text-[var(--cat-ink-3)] ` +
  `focus:ring-2 focus:ring-[#e04a3d] dark:focus:ring-2 dark:focus:ring-[#e04a3d] ${CONTROL_RING}`
