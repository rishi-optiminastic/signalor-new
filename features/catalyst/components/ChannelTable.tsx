export interface ChannelTableRow {
  name: string
  color: string
  percent: string
  total: string
}

export function ChannelTable({ rows }: { rows: ChannelTableRow[] }): JSX.Element {
  return (
    <table className="mt-3.5 w-full text-[13px]">
      <thead>
        <tr className="text-[11px] font-medium text-[var(--cat-ink-3)]">
          <th className="pb-2 text-left font-medium">Engine</th>
          <th className="pb-2 text-right font-medium">Share</th>
          <th className="pb-2 text-right font-medium">Mentions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.name}>
            <td className="py-[7px]">
              <span className="flex items-center gap-2 font-medium text-[var(--cat-ink)]">
                <i className="h-2.5 w-2.5 rounded-full" style={{ background: row.color }} />
                {row.name}
              </span>
            </td>
            <td className="py-[7px] text-right">{row.percent}</td>
            <td className="py-[7px] text-right">{row.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
