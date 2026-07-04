import { Handshake } from 'lucide-react'

import { PARTNERSHIPS } from '@/features/catalyst/agent-offpage-data'
import type { Partner } from '@/features/catalyst/agent-offpage-data'
import { AgentSectionPanel } from '@/features/catalyst/components/agent/AgentSectionPanel'
import { CreateTaskButton } from '@/features/catalyst/components/agent/CreateTaskButton'
import { TickBar } from '@/features/catalyst/components/brands/BrandBits'

function PartnerRow({ item }: { item: Partner }): JSX.Element {
  return (
    <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
      <div className="w-full shrink-0 sm:w-48">
        <p className="text-[13px] font-semibold text-[var(--cat-ink)]">{item.name}</p>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-[var(--cat-ink-3)]">
          <span className="rounded-sm bg-[var(--cat-hover)] px-1.5 py-0.5 font-medium text-[var(--cat-ink-2)]">
            {item.type}
          </span>
          <span>{item.audience}</span>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] text-[var(--cat-ink-2)]">{item.note}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-[11px] text-[var(--cat-ink-3)]">Fit</span>
          <TickBar value={item.overlap} ticks={14} />
        </div>
      </div>
      <div className="shrink-0 sm:self-center">
        <CreateTaskButton
          task={{
            id: `partner-${item.id}`,
            title: `Draft outreach to ${item.name} (${item.type})`,
            source: 'Partnerships',
            category: 'Partnership',
          }}
          label="Draft outreach"
          brand
        />
      </div>
    </div>
  )
}

export function PartnershipsSection(): JSX.Element {
  return (
    <AgentSectionPanel icon={Handshake} title="Partnerships" count={PARTNERSHIPS.length}>
      <div className="divide-y divide-[var(--cat-border-soft)]">
        {PARTNERSHIPS.map(p => (
          <PartnerRow key={p.id} item={p} />
        ))}
      </div>
    </AgentSectionPanel>
  )
}
