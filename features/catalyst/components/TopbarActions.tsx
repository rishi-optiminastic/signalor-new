import { Bell, Calendar, ChevronDown, Plus, Search, SlidersHorizontal } from 'lucide-react'

/* White secondary chips — subtle border + soft shadow, compact height. */
const CHIP =
  'inline-flex h-[34px] items-center gap-2 rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] px-3 text-[13px] font-medium text-[var(--cat-ink)] shadow-sm transition-colors hover:bg-[var(--cat-hover)]'

const ICON_BTN =
  'grid h-[34px] w-[34px] place-items-center rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] text-[var(--cat-ink-2)] shadow-sm transition-colors hover:bg-[var(--cat-hover)]'

export function TopbarActions(): JSX.Element {
  return (
    <div className="flex items-center gap-2 sm:gap-2.5">
      <button className={ICON_BTN} aria-label="Search">
        <Search size={18} strokeWidth={1.8} />
      </button>
      <button className={ICON_BTN} aria-label="Notifications">
        <Bell size={18} strokeWidth={1.8} />
      </button>
      <button className={`${CHIP} hidden sm:inline-flex`}>
        <Calendar size={16} className="text-[var(--cat-ink-2)]" /> Last month
        <ChevronDown size={15} className="text-[var(--cat-ink-3)]" />
      </button>
      <button className={`${CHIP} hidden md:inline-flex`}>
        <SlidersHorizontal size={16} className="text-[var(--cat-ink-2)]" /> Filter by
      </button>
      <button className="auth-cta-btn inline-flex h-[34px] shrink-0 items-center gap-2 rounded-md px-3.5 text-[13px] font-semibold text-white sm:px-4">
        <Plus size={16} strokeWidth={2.2} /> New Products
      </button>
    </div>
  )
}
