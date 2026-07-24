import Link from 'next/link'

import type { Brand } from '@/features/catalyst/brands-data'
import { BrandIdentity, StatusPill, TickBar } from '@/features/catalyst/components/brands/BrandBits'
import { scoreColor } from '@/features/catalyst/visibility-data'
import { Settings } from '@/lib/icons'

const TH =
  'px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--cat-ink-3)]'
const TD = 'px-4 py-3 align-middle'

function BrandRow({ brand }: { brand: Brand }): JSX.Element {
  return (
    <tr className="border-t border-[var(--cat-border)] transition-colors hover:bg-[var(--cat-hover)]">
      <td className={TD}>
        <BrandIdentity brand={brand} />
      </td>
      <td className={TD}>
        <span className="text-[14px] font-semibold" style={{ color: scoreColor(brand.geoScore) }}>
          {brand.geoScore}
        </span>
      </td>
      <td className={TD}>
        <TickBar value={brand.visibility} />
      </td>
      <td className={TD}>
        <span className="rounded-md bg-[var(--cat-hover)] px-2 py-0.5 text-[12px] font-medium text-[var(--cat-ink-2)]">
          {brand.plan}
        </span>
      </td>
      <td className={`${TD} text-[13px] text-[var(--cat-ink-2)]`}>{brand.members}</td>
      <td className={`${TD} text-[13px] text-[var(--cat-ink-3)]`}>{brand.lastRun}</td>
      <td className={TD}>
        <StatusPill status={brand.status} />
      </td>
      <td className={`${TD} text-right`}>
        <Link
          href={`/dashboard/brands/${brand.slug}/settings`}
          className="inline-grid h-8 w-8 place-items-center rounded-md text-[var(--cat-ink-3)] transition-colors hover:bg-[var(--cat-hover)] hover:text-[var(--cat-ink)]"
          aria-label={`${brand.name} settings`}
        >
          <Settings size={16} />
        </Link>
      </td>
    </tr>
  )
}

export function BrandsTable({ brands }: { brands: Brand[] }): JSX.Element {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--cat-border)] bg-[var(--cat-card)]">
      <table className="w-full min-w-[720px] border-collapse">
        <thead>
          <tr>
            {['Brand', 'GEO', 'Visibility', 'Plan', 'Members', 'Last run', 'Status', ''].map(h => (
              <th key={h || 'actions'} className={TH}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {brands.map(b => (
            <BrandRow key={b.slug} brand={b} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
