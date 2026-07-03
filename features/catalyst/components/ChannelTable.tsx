import { CHANNEL_TABLE } from '@/features/catalyst/constants'

export function ChannelTable(): JSX.Element {
  return (
    <table className="mt-3.5 w-full text-[13px]">
      <thead>
        <tr className="text-[11px] font-medium text-[var(--cat-ink-3)]">
          <th className="pb-2 text-left font-medium">Channels</th>
          <th className="pb-2 text-right font-medium">Percent</th>
          <th className="pb-2 text-right font-medium">Total</th>
        </tr>
      </thead>
      <tbody>
        {CHANNEL_TABLE.map(c => (
          <tr key={c.name}>
            <td className="py-[7px]">
              <span className="flex items-center gap-2 font-medium text-[var(--cat-ink)]">
                <c.icon size={16} style={{ color: c.color }} />
                {c.name}
              </span>
            </td>
            <td className="py-[7px] text-right">{c.percent}</td>
            <td className="py-[7px] text-right">{c.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
