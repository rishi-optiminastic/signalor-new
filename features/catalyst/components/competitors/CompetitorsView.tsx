import { CompetitorsGrid } from '@/features/catalyst/components/competitors/CompetitorsGrid'
import { CompetitorsToolbar } from '@/features/catalyst/components/competitors/CompetitorsToolbar'

export function CompetitorsView(): JSX.Element {
  return (
    <>
      <div className="cat-rise flex shrink-0 flex-wrap items-center gap-3 border-b border-[var(--cat-border)] pb-4">
        <div className="min-w-0">
          <h1 className="text-[19px] font-bold tracking-tight text-[var(--cat-ink)]">
            Competitors
          </h1>
          <p className="text-[13px] text-[var(--cat-ink-2)]">
            Benchmark rival brands across AI surfaces.
          </p>
        </div>
        <CompetitorsToolbar />
      </div>
      <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-y-auto pr-0.5">
        <CompetitorsGrid />
      </div>
    </>
  )
}
