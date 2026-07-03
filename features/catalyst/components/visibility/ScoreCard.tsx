import { GaugeRing } from '@/features/catalyst/components/visibility/GaugeRing'
import { scoreColor, scoreStatus } from '@/features/catalyst/visibility-data'
import type { ScoreCardData } from '@/features/catalyst/visibility-data'

interface ScoreCardProps {
  data: ScoreCardData
}

export function ScoreCard({ data }: ScoreCardProps): JSX.Element {
  const { icon: Icon, label, value, unit } = data
  const color = scoreColor(value)
  return (
    <div className="flex flex-col items-center rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] p-3.5">
      <div className="flex w-full items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wide text-[var(--cat-ink-3)] uppercase">
          {label}
        </span>
        <span className="grid h-6 w-6 place-items-center rounded-md bg-[var(--cat-hover)]">
          <Icon size={13} style={{ color }} />
        </span>
      </div>
      <div className="my-2">
        <GaugeRing value={value} size={92} stroke={9} color={color}>
          <div>
            <div className="text-[22px] font-bold tracking-tight text-[var(--cat-ink)]">
              {value}
            </div>
            <div className="text-[10px] font-medium text-[var(--cat-ink-3)]">{unit}</div>
          </div>
        </GaugeRing>
      </div>
      <span
        className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
        style={{ color, background: 'var(--cat-hover)' }}
      >
        {scoreStatus(value)}
      </span>
    </div>
  )
}
