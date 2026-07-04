'use client'

import { Sparkles } from 'lucide-react'

import { AGENT_ACTIONS, CATEGORY_META } from '@/features/catalyst/agent-data'
import { PrimaryButton } from '@/features/catalyst/components/PrimaryButton'
import { useTaskStore } from '@/stores/useTaskStore'

/** Queues every auto-executable action into the Tasks inbox in one click. */
export function RunPlanButton(): JSX.Element {
  const addTask = useTaskStore(s => s.addTask)
  const run = (): void => {
    AGENT_ACTIONS.filter(a => a.kind === 'auto').forEach(a =>
      addTask({
        id: `agent-${a.id}`,
        title: a.title,
        source: 'Growth Agent',
        category: CATEGORY_META[a.category].label,
      }),
    )
  }
  return (
    <PrimaryButton icon={Sparkles} onClick={run}>
      Run today’s plan
    </PrimaryButton>
  )
}
