import { STATUS_STYLE, type BacklinkOpp } from '@/features/catalyst/backlinks-data'
import { ExternalLink } from '@/lib/icons'

const TH =
  'px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--cat-ink-3)]'
const TD = 'px-4 py-3 align-middle text-[13px]'

interface OppTableProps {
  items: BacklinkOpp[]
}

/** The flat Source / Category / DR / Status opportunities table (Free & Paid tabs). */
export function OppTable({ items }: OppTableProps): JSX.Element {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--cat-border)] bg-[var(--cat-card)]">
      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr>
            {['Source', 'Category', 'DR', 'Status', ''].map((h, i) => (
              <th key={h || `col-${i}`} className={TH}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <OppRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function OppRow({ item }: { item: BacklinkOpp }): JSX.Element {
  return (
    <tr className="border-t border-[var(--cat-border)] transition-colors hover:bg-[var(--cat-hover)]">
      <td className={TD}>
        <p className="font-medium text-[var(--cat-ink)]">{item.name}</p>
        <p className="text-[12px] text-[var(--cat-ink-3)]">{item.domain}</p>
      </td>
      <td className={TD}>
        <span className="rounded-md bg-[var(--cat-hover)] px-2 py-0.5 text-[12px] font-medium text-[var(--cat-ink-2)]">
          {item.category}
        </span>
      </td>
      <td className={`${TD} font-semibold text-[var(--cat-ink)] tabular-nums`}>{item.dr}</td>
      <td className={TD}>
        <span
          className={`rounded-md px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_STYLE[item.status]}`}
        >
          {item.status}
        </span>
      </td>
      <td className={`${TD} text-right`}>
        {item.status === 'live' ? (
          <span className="text-[12px] text-[var(--cat-ink-3)]">—</span>
        ) : (
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--cat-border)] px-3 text-[12px] font-medium text-[var(--cat-ink-2)] transition-colors hover:bg-[var(--cat-hover)]"
          >
            <ExternalLink size={13} />
            Submit
          </button>
        )}
      </td>
    </tr>
  )
}
