import { Users } from 'lucide-react'

import { COMMUNITIES } from '@/features/catalyst/agent-offpage-data'
import type { Community } from '@/features/catalyst/agent-offpage-data'
import { AgentSectionPanel } from '@/features/catalyst/components/agent/AgentSectionPanel'
import { CreateTaskButton } from '@/features/catalyst/components/agent/CreateTaskButton'
import { TickBar } from '@/features/catalyst/components/brands/BrandBits'

const ACTIVITY: Record<Community['activity'], string> = {
  High: 'text-[#2FBE7E]',
  Medium: 'text-[#F6B93B]',
  Low: 'text-[var(--cat-ink-3)]',
}

function CommunityRow({ item }: { item: Community }): JSX.Element {
  return (
    <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
      <div className="w-full shrink-0 sm:w-44">
        <p className="text-[13px] font-semibold text-[var(--cat-ink)]">{item.name}</p>
        <p className="text-[11px] text-[var(--cat-ink-3)]">
          {item.platform} · {item.members} members
        </p>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] text-[var(--cat-ink-2)]">{item.hook}</p>
        <div className="mt-1.5 flex items-center gap-3">
          <TickBar value={item.relevance} ticks={14} />
          <span className={`text-[11px] font-medium ${ACTIVITY[item.activity]}`}>
            {item.activity}
          </span>
        </div>
      </div>
      <div className="shrink-0 sm:self-center">
        <CreateTaskButton
          task={{
            id: `comm-${item.id}`,
            title: `Engage in ${item.name} — ${item.hook}`,
            source: 'Communities',
            category: 'Community',
          }}
          label="Engage"
        />
      </div>
    </div>
  )
}

export function CommunitiesSection(): JSX.Element {
  return (
    <AgentSectionPanel
      icon={Users}
      title="Communities"
      count={COMMUNITIES.length}
      hint="Join today"
    >
      <div className="divide-y divide-[var(--cat-border-soft)]">
        {COMMUNITIES.map(c => (
          <CommunityRow key={c.id} item={c} />
        ))}
      </div>
    </AgentSectionPanel>
  )
}
