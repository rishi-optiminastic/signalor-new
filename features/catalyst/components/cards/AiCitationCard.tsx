'use client'

import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { Delta } from '@/features/catalyst/components/Delta'
import { Metric } from '@/features/catalyst/components/Metric'
import { BLUE, GREEN, PURPLE } from '@/features/catalyst/constants'
import { useActiveProject } from '@/hooks/useActiveProject'
import { useCitations } from '@/hooks/useCitations'

interface SplitCell {
  label: string
  value: number
  color: string
}

function buildSplit(brand: number, competitor: number, other: number): SplitCell[] {
  return [
    { label: 'Brand', value: brand, color: PURPLE },
    { label: 'Competitor', value: competitor, color: GREEN },
    { label: 'Other', value: other, color: BLUE },
  ]
}

export function AiCitationCard(): JSX.Element {
  const { slug } = useActiveProject()
  const { data } = useCitations(slug)

  const split = data ? buildSplit(data.brand, data.competitor, data.other) : []

  return (
    <Card>
      <CardHead title="AI Citations" action="Report" />
      <Metric
        value={data ? data.total.toLocaleString('en-US') : '—'}
        positive={(data?.brand ?? 0) > 0}
        badge={data ? `${data.brandPct}% brand` : '—'}
      />
      <div className="mt-4 mb-auto grid grid-cols-3 gap-2">
        {split.map(cell => (
          <div key={cell.label}>
            <div className="mb-1 text-xs text-[var(--cat-ink-2)]">{cell.label}</div>
            <div className="text-[22px] font-bold text-[var(--cat-ink)]">{cell.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-3.5 grid grid-cols-3 gap-2">
        {split.map(cell => (
          <div key={cell.label}>
            <div className="mb-[7px]">
              <Delta positive={cell.value > 0}>
                {data && data.total > 0 ? `${Math.round((cell.value / data.total) * 100)}%` : '0%'}
              </Delta>
            </div>
            <div className="h-[5px] rounded-sm" style={{ background: cell.color }} />
          </div>
        ))}
      </div>
    </Card>
  )
}
