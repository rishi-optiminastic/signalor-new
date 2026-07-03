import { GREEN } from '@/features/catalyst/constants'
import { INDEXED, INDEXED_ICON } from '@/features/catalyst/sitemap-data'

export function IndexedCard(): JSX.Element {
  const Icon = INDEXED_ICON
  const pct = INDEXED.total ? (INDEXED.value / INDEXED.total) * 100 : 0
  return (
    <div className="flex flex-col rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wide text-[var(--cat-ink-3)] uppercase">
          Indexed Pages
        </span>
        <span
          className="grid h-6 w-6 place-items-center rounded-md"
          style={{ background: 'rgba(47,190,126,.14)' }}
        >
          <Icon size={13} style={{ color: GREEN }} />
        </span>
      </div>
      <div className="mt-2 text-[26px] font-bold tracking-tight text-[var(--cat-ink)]">
        {INDEXED.value}
        <span className="text-[15px] font-semibold text-[var(--cat-ink-3)]">
          {' '}
          / {INDEXED.total}
        </span>
      </div>
      <div className="mt-auto pt-3">
        <div className="h-2 overflow-hidden rounded-full bg-[var(--cat-track)]">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: GREEN }} />
        </div>
        <div className="mt-1.5 text-[12px] text-[var(--cat-ink-3)]">
          Crawl limit: {INDEXED.crawlLimit}
        </div>
      </div>
    </div>
  )
}
