import { Globe } from 'lucide-react'

import { AnalysisHeader } from '@/features/catalyst/components/visibility/AnalysisHeader'
import { BreakdownBar } from '@/features/catalyst/components/visibility/BreakdownBar'
import { StatTile } from '@/features/catalyst/components/visibility/StatTile'
import { VisChip } from '@/features/catalyst/components/visibility/VisChip'
import { WebTopLinks } from '@/features/catalyst/components/visibility/WebTopLinks'
import { WEB } from '@/features/catalyst/visibility-data'

export function WebCard(): JSX.Element {
  return (
    <div className="cat-rise flex flex-col rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] p-4">
      <AnalysisHeader icon={Globe} name="Web" score={WEB.score} />
      <div className="mt-3 grid grid-cols-3 gap-2">
        {WEB.tiles.map(tile => (
          <StatTile key={tile.label} tile={tile} />
        ))}
      </div>
      <div className="mt-4 mb-2 text-[13px] font-semibold text-[var(--cat-ink)]">Breakdown</div>
      <div className="flex flex-col gap-2.5">
        {WEB.breakdown.map(bar => (
          <BreakdownBar key={bar.label} label={bar.label} value={bar.value} />
        ))}
      </div>
      <div className="mt-4 mb-2 text-[13px] font-semibold text-[var(--cat-ink)]">By type</div>
      <div className="flex flex-wrap gap-2">
        {WEB.byType.map(type => (
          <VisChip key={type.label} label={type.label} count={type.count} />
        ))}
      </div>
      <div className="mt-4 mb-1 text-[13px] font-semibold text-[var(--cat-ink)]">Top links</div>
      <WebTopLinks />
    </div>
  )
}
