import { ChevronsUpDown } from 'lucide-react'

const LOGO_BG = 'conic-gradient(from 210deg at 50% 50%, #F2A79E, #e04a3d, #b9382d, #F2A79E)'

/** Active workspace card with a switch affordance — sits under the app logo. */
export function WorkspaceSwitcher(): JSX.Element {
  return (
    <button
      type="button"
      className="mt-3 flex w-full items-center gap-2.5 rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] px-2 py-1.5 text-left transition-colors hover:bg-[var(--cat-hover)]"
    >
      <span
        className="grid h-8 w-8 shrink-0 place-items-center rounded-md"
        style={{ background: LOGO_BG }}
      >
        <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="#fff">
          <path d="M12 2c1.5 4 4.5 6.5 8 8-3.5 1.5-6.5 4-8 8-1.5-4-4.5-6.5-8-8 3.5-1.5 6.5-4 8-8Z" />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-[var(--cat-ink)]">
          Catalyst
        </span>
        <span className="block truncate text-[11px] text-[var(--cat-ink-3)]">
          Marketing &amp; Sales
        </span>
      </span>
      <ChevronsUpDown size={15} className="shrink-0 text-[var(--cat-ink-3)]" />
    </button>
  )
}
