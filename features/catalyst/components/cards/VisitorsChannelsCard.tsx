import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { ChannelLegend } from '@/features/catalyst/components/ChannelLegend'
import { ChannelTable } from '@/features/catalyst/components/ChannelTable'
import { Metric } from '@/features/catalyst/components/Metric'

export function VisitorsChannelsCard(): JSX.Element {
  return (
    <Card>
      <CardHead title="Visitors Channels" action="Details" />
      <Metric value="78%" positive={false} badge="-0.4%" />
      <ChannelLegend />
      <ChannelTable />
      <button className="mt-3 h-[38px] w-full rounded-md border border-[var(--cat-border)] text-[13px] font-semibold text-[var(--cat-ink)] transition-colors hover:bg-[var(--cat-hover)]">
        View reports
      </button>
    </Card>
  )
}
