import { Eye, FileText, Layout } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { AGENT_ACTIONS, CATEGORY_META } from '@/features/catalyst/agent-data'
import { ActionRow } from '@/features/catalyst/components/agent/ActionRow'
import { AgentSectionPanel } from '@/features/catalyst/components/agent/AgentSectionPanel'

const PILLAR_ICON: Record<'Content' | 'On-site' | 'Intel', LucideIcon> = {
  Content: FileText,
  'On-site': Layout,
  Intel: Eye,
}

function ColumnHeader(): JSX.Element {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--cat-border-soft)] px-4 py-2 text-[10px] font-semibold tracking-wide text-[var(--cat-ink-3)] uppercase">
      <span className="w-8 shrink-0" />
      <span className="flex-1">Action</span>
      <span className="hidden w-[70px] shrink-0 text-right md:block">Reach</span>
      <span className="w-[52px] shrink-0 text-right">Impact</span>
      <span className="hidden w-[56px] shrink-0 text-right lg:block">Effort</span>
      <span className="w-[132px] shrink-0" />
    </div>
  )
}

export function ActionTable({ pillar }: { pillar: 'Content' | 'On-site' | 'Intel' }): JSX.Element {
  const items = AGENT_ACTIONS.filter(a => CATEGORY_META[a.category].pillar === pillar).sort(
    (a, b) => a.points - b.points,
  )
  return (
    <AgentSectionPanel icon={PILLAR_ICON[pillar]} title={pillar} count={items.length}>
      <ColumnHeader />
      <div className="divide-y divide-[var(--cat-border-soft)]">
        {items.map(a => (
          <ActionRow key={a.id} action={a} />
        ))}
      </div>
    </AgentSectionPanel>
  )
}
