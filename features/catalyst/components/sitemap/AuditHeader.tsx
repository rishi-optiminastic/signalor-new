import { BRAND, BRAND_STRONG } from '@/features/catalyst/constants'
import type { AuditFilter } from '@/features/catalyst/sitemap-data'

function FilterPill({ filter }: { filter: AuditFilter }): JSX.Element {
  const active = filter.active
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors ${
        active ? '' : 'hover:bg-[var(--cat-hover)]'
      }`}
      style={
        active
          ? { background: BRAND, color: '#fff', borderColor: BRAND }
          : { color: 'var(--cat-ink-2)', borderColor: 'var(--cat-border)' }
      }
    >
      {filter.label}
      <span
        className="rounded px-1.5 text-[11px] font-semibold"
        style={active ? { background: BRAND_STRONG } : { color: 'var(--cat-ink-3)' }}
      >
        {filter.count}
      </span>
    </button>
  )
}

export function AuditHeader({ filters }: { filters: AuditFilter[] }): JSX.Element {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-[18px] font-bold tracking-tight text-[var(--cat-ink)]">
          Sitemap Audit
        </h2>
        <p className="mt-0.5 max-w-2xl text-[13px] text-[var(--cat-ink-2)]">
          Fetch your sitemap, score every page for Core Web Vitals, structure, and AI readiness. Up
          to 200 URLs per run.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {filters.map(filter => (
          <FilterPill key={filter.label} filter={filter} />
        ))}
      </div>
    </div>
  )
}
