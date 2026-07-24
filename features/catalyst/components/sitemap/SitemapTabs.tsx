import { BRAND } from '@/features/catalyst/constants'
import { Map, Radio } from '@/lib/icons'

export function SitemapTabs(): JSX.Element {
  return (
    <div className="cat-rise flex shrink-0 items-center gap-6 border-b border-[var(--cat-border)]">
      <button
        className="flex items-center gap-2 border-b-2 pb-3 text-[14px] font-semibold text-[var(--cat-ink)]"
        style={{ borderColor: BRAND }}
      >
        <Map size={16} style={{ color: BRAND }} /> Sitemap
      </button>
      <button className="flex items-center gap-2 border-b-2 border-transparent pb-3 text-[14px] font-medium text-[var(--cat-ink-3)]">
        <Radio size={16} /> Agent log
        <span className="rounded bg-[var(--cat-track)] px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--cat-ink-3)]">
          SOON
        </span>
      </button>
    </div>
  )
}
