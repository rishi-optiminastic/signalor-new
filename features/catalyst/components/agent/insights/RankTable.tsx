import type { RankRow } from '@/features/catalyst/agent-insights-data'

interface RankTableProps {
  rows: RankRow[]
  nameHeader: string
  valueHeader: string
}

function RankRowLine({ row, rank }: { row: RankRow; rank: number }): JSX.Element {
  return (
    <div className="flex items-center gap-2.5 py-[7px]">
      <span className="w-4 shrink-0 text-center text-[12px] text-[var(--cat-ink-3)] tabular-nums">
        {rank}
      </span>
      <span
        className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white"
        style={{ background: row.color }}
      >
        {row.name.replace(/[“"]/g, '').charAt(0).toUpperCase()}
      </span>
      <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-[var(--cat-ink)]">
        {row.name}
      </span>
      {row.owned && (
        <span className="rounded-sm bg-[var(--cat-hover)] px-1 py-0.5 text-[9px] font-semibold tracking-wide text-[var(--cat-ink-3)] uppercase">
          Owned
        </span>
      )}
      <span className="w-12 shrink-0 text-right text-[12px] font-semibold text-[var(--cat-ink)] tabular-nums">
        {row.value}
      </span>
    </div>
  )
}

export function RankTable({ rows, nameHeader, valueHeader }: RankTableProps): JSX.Element {
  return (
    <div>
      <div className="flex items-center gap-2.5 border-b border-[var(--cat-border-soft)] pb-1.5 text-[10px] font-semibold tracking-wide text-[var(--cat-ink-3)] uppercase">
        <span className="w-4 shrink-0 text-center">#</span>
        <span className="flex-1">{nameHeader}</span>
        <span className="w-12 shrink-0 text-right">{valueHeader}</span>
      </div>
      <div className="divide-y divide-[var(--cat-border-soft)]">
        {rows.map((r, i) => (
          <RankRowLine key={r.name + i} row={r} rank={i + 1} />
        ))}
      </div>
    </div>
  )
}
