import { Megaphone } from 'lucide-react'

import { PR_OPPORTUNITIES } from '@/features/catalyst/agent-offpage-data'
import type { PrOpp } from '@/features/catalyst/agent-offpage-data'
import { AgentSectionPanel } from '@/features/catalyst/components/agent/AgentSectionPanel'
import { CreateTaskButton } from '@/features/catalyst/components/agent/CreateTaskButton'
import { TickBar } from '@/features/catalyst/components/brands/BrandBits'

function PrRow({ item }: { item: PrOpp }): JSX.Element {
  return (
    <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
      <div className="w-full shrink-0 sm:w-44">
        <p className="text-[13px] font-semibold text-[var(--cat-ink)]">{item.outlet}</p>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-[var(--cat-ink-3)]">
          <span className="rounded-sm bg-[var(--cat-hover)] px-1.5 py-0.5 font-medium text-[var(--cat-ink-2)]">
            {item.type}
          </span>
          <span>Due {item.deadline}</span>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] text-[var(--cat-ink-2)]">{item.angle}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-[11px] text-[var(--cat-ink-3)]">Relevance</span>
          <TickBar value={item.relevance} ticks={14} />
        </div>
      </div>
      <div className="shrink-0 sm:self-center">
        <CreateTaskButton
          task={{
            id: `pr-${item.id}`,
            title: `Pitch ${item.outlet}: ${item.angle}`,
            source: 'Digital PR',
            category: 'PR',
          }}
          label="Draft pitch"
          brand
        />
      </div>
    </div>
  )
}

export function PrSection(): JSX.Element {
  return (
    <AgentSectionPanel icon={Megaphone} title="Digital PR" count={PR_OPPORTUNITIES.length}>
      <div className="divide-y divide-[var(--cat-border-soft)]">
        {PR_OPPORTUNITIES.map(p => (
          <PrRow key={p.id} item={p} />
        ))}
      </div>
    </AgentSectionPanel>
  )
}
