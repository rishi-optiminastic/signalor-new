import { BLUE, BRAND, PURPLE } from '@/features/catalyst/constants'

const LEGEND = [
  { label: 'Organic', color: BRAND },
  { label: 'Referral', color: BLUE },
  { label: 'Direct', color: PURPLE },
]

export function ChannelLegend(): JSX.Element {
  return (
    <>
      <div className="my-3.5 flex h-2 gap-1">
        <span className="rounded" style={{ flex: 5, background: BRAND }} />
        <span className="rounded" style={{ flex: 4, background: BLUE }} />
        <span className="rounded" style={{ flex: 2, background: PURPLE }} />
      </div>
      <div className="flex gap-4 text-xs text-[var(--cat-ink-2)]">
        {LEGEND.map(x => (
          <span key={x.label} className="inline-flex items-center gap-1.5">
            <i className="h-2 w-2 rounded-full" style={{ background: x.color }} />
            {x.label}
          </span>
        ))}
      </div>
    </>
  )
}
