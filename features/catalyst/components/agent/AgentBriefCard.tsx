'use client'

import { Globe, Pencil, Target } from 'lucide-react'
import { useState } from 'react'

import { DEFAULT_BRIEF } from '@/features/catalyst/agent-data'
import type { AgentBrief } from '@/features/catalyst/agent-data'
import { AgentSetupForm } from '@/features/catalyst/components/agent/AgentSetupForm'
import { useMounted } from '@/hooks/useMounted'
import { useAgentStore } from '@/stores/useAgentStore'

function BriefSummary({ brief }: { brief: AgentBrief }): JSX.Element {
  return (
    <div className="min-w-0 space-y-2">
      <div className="flex items-center gap-2 text-[13px]">
        <Globe size={15} className="text-[var(--cat-ink-3)]" />
        <span className="font-semibold text-[var(--cat-ink)]">{brief.website}</span>
      </div>
      <p className="max-w-2xl text-[13px] text-[var(--cat-ink-2)]">{brief.product}</p>
      <div className="flex flex-wrap gap-1.5">
        {brief.goals.map(goal => (
          <span
            key={goal}
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--cat-hover)] px-2 py-1 text-[11px] font-medium text-[var(--cat-ink-2)]"
          >
            <Target size={12} className="text-[#e04a3d]" />
            {goal}
          </span>
        ))}
      </div>
    </div>
  )
}

export function AgentBriefCard(): JSX.Element {
  const mounted = useMounted()
  const stored = useAgentStore(s => s.brief)
  const setBrief = useAgentStore(s => s.setBrief)
  const brief = mounted ? stored : DEFAULT_BRIEF
  const [editing, setEditing] = useState(false)

  return (
    <div className="rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] p-4">
      <div className="flex items-start justify-between gap-3">
        <BriefSummary brief={brief} />
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-[var(--cat-border)] px-3 text-[12px] font-medium text-[var(--cat-ink-2)] transition-colors hover:bg-[var(--cat-hover)]"
        >
          <Pencil size={13} />
          Edit brief
        </button>
      </div>
      {editing && (
        <AgentSetupForm brief={brief} onSave={setBrief} onClose={() => setEditing(false)} />
      )}
    </div>
  )
}
