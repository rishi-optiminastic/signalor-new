'use client'

import type { SiteMeta } from '@/features/catalyst/backlinks-data'
import { ChevronRight } from '@/lib/icons'

interface CategoryHeaderProps {
  site: SiteMeta
  count: number
  liveCount: number
  open: boolean
  onToggle: () => void
}

/** The clickable accordion header row for a satellite-site category. */
export function CategoryHeader({
  site,
  count,
  liveCount,
  open,
  onToggle,
}: CategoryHeaderProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--cat-hover)]"
    >
      <ChevronRight
        size={15}
        className={`shrink-0 text-[var(--cat-ink-3)] transition-transform ${open ? 'rotate-90' : ''}`}
      />
      <span
        className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-[11px] font-bold text-white"
        style={{ background: site.color }}
      >
        {site.initial}
      </span>
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span className="text-[13px] font-semibold text-[var(--cat-ink)]">{site.label}</span>
        <span className="rounded-full bg-[var(--cat-hover)] px-2 py-0.5 text-[11px] font-medium text-[var(--cat-ink-3)] tabular-nums">
          {count}
        </span>
      </span>
      <span className="hidden text-[12px] text-[var(--cat-ink-3)] sm:block">
        {liveCount} live · {site.domain}
      </span>
    </button>
  )
}
