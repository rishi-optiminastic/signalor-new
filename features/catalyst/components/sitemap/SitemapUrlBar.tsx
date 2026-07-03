import { Layers, Play } from 'lucide-react'

import { BRAND, BRAND_SOFT } from '@/features/catalyst/constants'

export function SitemapUrlBar(): JSX.Element {
  return (
    <div className="cat-rise flex items-center gap-3 rounded-md border border-[var(--cat-border)] bg-[var(--cat-hover)] p-4">
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-md"
        style={{ background: BRAND_SOFT }}
      >
        <Layers size={18} style={{ color: BRAND }} />
      </span>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold tracking-wide text-[var(--cat-ink-3)] uppercase">
          Sitemap
        </div>
        <div className="truncate text-[15px] font-semibold text-[var(--cat-ink)]">
          https://signalor.ai/sitemap.xml
        </div>
      </div>
      <button className="auth-cta-btn ml-auto inline-flex h-[34px] shrink-0 items-center gap-2 rounded-md px-3.5 text-[13px] font-semibold text-white">
        <Play size={14} /> Re-run audit
      </button>
    </div>
  )
}
