export interface ChannelSegment {
  label: string
  color: string
  weight: number
}

/** Proportional stacked bar + legend. Falls back to equal segments when every
 * weight is zero (e.g. no share of voice yet). */
export function ChannelLegend({ segments }: { segments: ChannelSegment[] }): JSX.Element {
  const total = segments.reduce((a, s) => a + s.weight, 0)
  return (
    <>
      <div className="my-3.5 flex h-2 gap-1">
        {segments.map(s => (
          <span
            key={s.label}
            className="rounded-sm"
            style={{ flex: total > 0 ? s.weight : 1, background: s.color }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-[var(--cat-ink-2)]">
        {segments.map(s => (
          <span key={s.label} className="inline-flex items-center gap-1.5">
            <i className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </>
  )
}
