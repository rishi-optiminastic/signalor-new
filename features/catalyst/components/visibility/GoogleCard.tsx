import { Search } from 'lucide-react'

import { AnalysisHeader } from '@/features/catalyst/components/visibility/AnalysisHeader'
import { BreakdownBar } from '@/features/catalyst/components/visibility/BreakdownBar'
import { StatTile } from '@/features/catalyst/components/visibility/StatTile'
import { VisChip } from '@/features/catalyst/components/visibility/VisChip'
import { GOOGLE } from '@/features/catalyst/visibility-data'

export function GoogleCard(): JSX.Element {
  return (
    <div className="cat-rise rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] p-4">
      <AnalysisHeader icon={Search} name="Google" score={GOOGLE.score} />
      <div className="mt-3 grid grid-cols-3 gap-2">
        {GOOGLE.tiles.map(tile => (
          <StatTile key={tile.label} tile={tile} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {GOOGLE.flags.map(flag => (
          <VisChip key={flag.label} label={flag.label} state={flag.on ? 'on' : 'off'} />
        ))}
      </div>
      <div className="mt-4 mb-2 text-[13px] font-semibold text-[var(--cat-ink)]">Breakdown</div>
      <div className="flex flex-col gap-2.5">
        {GOOGLE.breakdown.map(bar => (
          <BreakdownBar key={bar.label} label={bar.label} value={bar.value} />
        ))}
      </div>
    </div>
  )
}
