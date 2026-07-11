import { Sparkles } from 'lucide-react'

import { AgentPageHeader } from '@/features/catalyst/components/agent/AgentPageHeader'
import { AgentSections } from '@/features/catalyst/components/agent/AgentSections'
import { AnswerEngineInsights } from '@/features/catalyst/components/agent/insights/AnswerEngineInsights'
import { RunPlanButton } from '@/features/catalyst/components/agent/RunPlanButton'

export function AgentView(): JSX.Element {
  return (
    <>
      <AgentPageHeader
        icon={Sparkles}
        title="Growth Agent"
        subtitle="Every high-impact move for today — content, on-site, off-page and competitor intel in one place."
        action={<RunPlanButton />}
      />
      <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-0.5">
        <div className="cat-stagger flex flex-col gap-4">
          <AnswerEngineInsights />
          <AgentSections />
        </div>
      </div>
    </>
  )
}
