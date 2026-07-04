import type { AllocItem } from '@/features/catalyst/agent-insights-data'
import { GREEN, NEG } from '@/features/catalyst/constants'

interface AllocationBlockProps {
  items: AllocItem[]
  headline?: string
  delta?: string
  positive?: boolean
  note?: string
}

function AllocBar({ items }: { items: AllocItem[] }): JSX.Element {
  return (
    <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full">
      {items.map((it, i) => (
        <div
          key={it.name}
          title={`${it.name} · ${it.pct}%`}
          style={{ width: `${it.pct}%`, background: it.color }}
          className={i < items.length - 1 ? 'border-r-2 border-[var(--cat-card)]' : ''}
        />
      ))}
    </div>
  )
}

export function AllocationBlock({
  items,
  headline,
  delta,
  positive = true,
  note,
}: AllocationBlockProps): JSX.Element {
  return (
    <div>
      {headline && (
        <div className="flex items-end justify-between gap-2">
          <span className="text-[28px] leading-none font-bold text-[var(--cat-ink)] tabular-nums">
            {headline}
          </span>
          {delta && (
            <span className="text-[12px] text-[var(--cat-ink-3)]">
              <span className="font-semibold" style={{ color: positive ? GREEN : NEG }}>
                {delta}
              </span>{' '}
              {note}
            </span>
          )}
        </div>
      )}
      <AllocBar items={items} />
      <AllocLegend items={items} />
    </div>
  )
}

function AllocLegend({ items }: { items: AllocItem[] }): JSX.Element {
  return (
    <div className="mt-3 space-y-2">
      {items.map(it => (
        <div key={it.name} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: it.color }} />
          <span className="min-w-0 flex-1 truncate text-[12px] text-[var(--cat-ink-2)]">
            {it.name}
          </span>
          <span className="text-[12px] font-semibold text-[var(--cat-ink)] tabular-nums">
            {it.pct}%
          </span>
        </div>
      ))}
    </div>
  )
}
