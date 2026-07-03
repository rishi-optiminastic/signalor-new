const RANGES = ['1D', '1W', '1M', '3M', '1Y']
const ACTIVE = '1W'

export function RangeTabs(): JSX.Element {
  return (
    <div className="my-2.5 inline-flex gap-0.5 self-start rounded-md bg-[var(--cat-track)] p-[3px]">
      {RANGES.map(t => (
        <button
          key={t}
          className={`rounded-sm px-3 py-[5px] text-xs font-medium ${
            t === ACTIVE
              ? 'bg-[var(--cat-card)] font-semibold text-[var(--cat-ink)] shadow-sm'
              : 'text-[var(--cat-ink-2)]'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}
