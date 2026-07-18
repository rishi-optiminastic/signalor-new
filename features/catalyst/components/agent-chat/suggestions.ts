import type { LucideIcon } from 'lucide-react'
import { Gauge, Swords, Wrench } from 'lucide-react'

export interface AgentSuggestion {
  icon: LucideIcon
  label: string
}

/** Starter prompts shown in the Agent empty state. Static, illustrative only. */
export const AGENT_SUGGESTIONS: AgentSuggestion[] = [
  { icon: Gauge, label: 'Why did my GEO score change this week?' },
  { icon: Wrench, label: 'What should I fix first to get cited more?' },
  { icon: Swords, label: 'Summarize where competitors beat me' },
]
