import { AutoBacklinkRow } from '@/features/catalyst/components/backlinks/AutoBacklinkRow'
import type { AutoBacklink } from '@/lib/api/backlinks'
import { ChevronsUpDown } from '@/lib/icons'

const COLS = ['Title', 'Status', 'Backlink', 'Published', 'Link', '']

interface AutoBacklinkTableProps {
  rows: AutoBacklink[]
}

/** The Tasks-style table rendered inside an expanded category. */
export function AutoBacklinkTable({ rows }: AutoBacklinkTableProps): JSX.Element {
  return (
    <table className="w-full min-w-[760px] border-collapse text-[13px]">
      <thead>
        <tr className="border-b border-[var(--cat-border)] bg-[var(--cat-hover)]">
          {COLS.map((c, i) => (
            <th
              key={c || `col-${i}`}
              className={`py-2.5 text-left text-[12px] font-medium text-[var(--cat-ink-2)] ${
                i === 0 ? 'pr-3 pl-4' : 'px-3'
              }`}
            >
              {c && (
                <span className="inline-flex items-center gap-1">
                  {c}
                  <ChevronsUpDown size={12} className="text-[var(--cat-ink-3)]" />
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <AutoBacklinkRow key={row.id || row.slug} row={row} />
        ))}
      </tbody>
    </table>
  )
}
