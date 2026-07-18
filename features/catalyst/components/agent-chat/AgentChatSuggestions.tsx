'use client'

import { ChevronRight } from 'lucide-react'

import { AGENT_SUGGESTIONS } from '@/features/catalyst/components/agent-chat/suggestions'

/** Static starter-prompt pills. Inert for now (no conversation backend). */
export function AgentChatSuggestions(): JSX.Element {
  return (
    <div className="space-y-1.5">
      {AGENT_SUGGESTIONS.map(({ icon: Icon, label }) => (
        <button
          key={label}
          type="button"
          className="group flex w-full items-center gap-2.5 rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] px-3 py-2.5 text-left text-[13px] text-[var(--cat-ink)] transition-colors hover:bg-[var(--cat-hover)]"
        >
          <Icon size={15} strokeWidth={1.9} className="shrink-0 text-[var(--cat-ink-3)]" />
          <span className="min-w-0 flex-1 truncate">{label}</span>
          <ChevronRight
            size={15}
            strokeWidth={1.9}
            className="shrink-0 text-[var(--cat-ink-3)] transition-transform group-hover:translate-x-0.5"
          />
        </button>
      ))}
    </div>
  )
}
