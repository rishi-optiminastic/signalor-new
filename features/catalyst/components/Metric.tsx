import { Badge } from '@/features/catalyst/components/Badge'

interface MetricProps {
  value: string
  positive: boolean
  badge: string
}

export function Metric({ value, positive, badge }: MetricProps): JSX.Element {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[26px] font-bold tracking-tight text-[var(--cat-ink)]">{value}</span>
      <Badge positive={positive}>{badge}</Badge>
    </div>
  )
}
