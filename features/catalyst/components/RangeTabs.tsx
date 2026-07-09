export type Range = '1D' | '1W' | '1M' | '3M' | '1Y'

const RANGES: Range[] = ['1D', '1W', '1M', '3M', '1Y']

/** How many days of visibility history each range requests from the backend. */
export const RANGE_DAYS: Record<Range, number> = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '1Y': 365,
}

interface RangeTabsProps {
  value: Range
  onChange: (range: Range) => void
}

export function RangeTabs({ value, onChange }: RangeTabsProps): JSX.Element {
  return (
    <div className="my-2.5 inline-flex gap-0.5 self-start rounded-md bg-[var(--cat-track)] p-[3px]">
      {RANGES.map(t => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={`rounded-sm px-3 py-[5px] text-xs font-medium transition-colors ${
            t === value
              ? 'bg-[var(--cat-card)] font-semibold text-[var(--cat-ink)] shadow-sm'
              : 'text-[var(--cat-ink-2)] hover:text-[var(--cat-ink)]'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}
