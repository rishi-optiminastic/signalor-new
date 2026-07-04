import { ActionTable } from '@/features/catalyst/components/agent/ActionTable'
import { CommunitiesSection } from '@/features/catalyst/components/agent/CommunitiesSection'
import { DirectoriesSection } from '@/features/catalyst/components/agent/DirectoriesSection'
import { PartnershipsSection } from '@/features/catalyst/components/agent/PartnershipsSection'
import { PrSection } from '@/features/catalyst/components/agent/PrSection'

function GroupHeading({ children }: { children: string }): JSX.Element {
  return (
    <div className="flex items-center gap-3 pt-1">
      <span className="text-[13px] font-semibold text-[var(--cat-ink)]">{children}</span>
      <span className="h-px flex-1 bg-[var(--cat-border-soft)]" />
    </div>
  )
}

export function AgentSections(): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <GroupHeading>Today’s actions</GroupHeading>
      <ActionTable pillar="Content" />
      <ActionTable pillar="On-site" />
      <GroupHeading>Off-page opportunities</GroupHeading>
      <CommunitiesSection />
      <PartnershipsSection />
      <DirectoriesSection />
      <PrSection />
      <GroupHeading>Competitor intel</GroupHeading>
      <ActionTable pillar="Intel" />
    </div>
  )
}
