'use client'

import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { BrandFavicon } from '@/features/catalyst/components/competitors/BrandFavicon'
import { GREEN } from '@/features/catalyst/constants'
import { engineLabel, engineLogo } from '@/features/catalyst/engine-logos'
import { useActiveProject } from '@/hooks/useActiveProject'
import { useBrandPath } from '@/hooks/useBrandPath'
import { useCompetitorMatrix, type MatrixRow } from '@/hooks/useCompetitorMatrix'
import { UserRound } from '@/lib/icons'

/** 0.12–0.8 alpha over the data green, scaled to the table's hottest cell. */
function heatBackground(value: number, max: number): string {
  const alpha = 0.12 + 0.68 * (value / max)
  return `${GREEN}${Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0')}`
}

function HeatCell({ value, max }: { value: number; max: number }): JSX.Element {
  if (value <= 0) {
    return <td className="px-1 py-1 text-center text-[12px] text-[var(--cat-ink-3)]">—</td>
  }
  return (
    <td className="px-1 py-1">
      <div
        className="rounded-sm py-1.5 text-center text-[12px] font-semibold text-[var(--cat-ink)] tabular-nums"
        style={{ background: heatBackground(value, max) }}
      >
        {value}%
      </div>
    </td>
  )
}

function EngineHeader({ engine }: { engine: string }): JSX.Element {
  const logo = engineLogo(engine)
  return (
    <th className="px-1 pb-2 text-center">
      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--cat-ink-2)]">
        {logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" className="h-3.5 w-3.5" />
        )}
        {engineLabel(engine)}
      </span>
    </th>
  )
}

interface RowProps {
  row: MatrixRow
  engines: string[]
  max: number
}

function HeatRow({ row, engines, max }: RowProps): JSX.Element {
  return (
    <tr>
      <td
        className={`rounded-sm py-1 pr-3 pl-1.5 ${row.isBrand ? 'bg-[rgba(224,74,61,0.06)]' : ''}`}
      >
        <span className="flex items-center gap-2">
          <BrandFavicon domain={row.domain} name={row.name} color="#111827" size={24} />
          <span className="truncate text-[13px] font-medium text-[var(--cat-ink)]">{row.name}</span>
          {row.isBrand && <UserRound size={13} className="shrink-0 text-[#e04a3d]" />}
        </span>
      </td>
      {engines.map(engine => (
        <HeatCell key={engine} value={row.cells[engine] ?? 0} max={max} />
      ))}
    </tr>
  )
}

/**
 * Dashboard heatmap: how visible the brand and each competitor are per AI
 * engine, on the same mention-rate basis. Hidden until a run has prompt data.
 */
export function CompetitorHeatmapCard(): JSX.Element | null {
  const { slug } = useActiveProject()
  const brandPath = useBrandPath()
  const { data } = useCompetitorMatrix(slug)

  if (!data || data.engines.length === 0 || data.rows.length < 2) return null

  return (
    <Card className="sm:col-span-2">
      <CardHead title="Competitor Visibility" action="Details" href={brandPath('competitors')} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="w-[220px] pb-2 pl-1.5 text-left text-[11px] font-semibold tracking-wider text-[var(--cat-ink-3)] uppercase">
                Brand
              </th>
              {data.engines.map(engine => (
                <EngineHeader key={engine} engine={engine} />
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map(row => (
              <HeatRow
                key={row.domain || row.name}
                row={row}
                engines={data.engines}
                max={data.max}
              />
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-[var(--cat-ink-3)]">
        Share of answers per engine that mention your brand or cite the competitor domain.
      </p>
    </Card>
  )
}
