'use client'

import { AgentChatComposer } from '@/features/catalyst/components/agent-chat/AgentChatComposer'
import { AgentChatEmptyState } from '@/features/catalyst/components/agent-chat/AgentChatEmptyState'
import { AgentChatHeader } from '@/features/catalyst/components/agent-chat/AgentChatHeader'
import { useAgentChat } from '@/stores/useAgentChat'

/**
 * The SignalorAI Agent side panel - docks to the right of the content within the
 * shell so the main area shrinks to make room (matching the reference layout).
 * UI only: no conversation backend is wired yet.
 */
export function AgentChatPanel(): JSX.Element | null {
  const open = useAgentChat(s => s.open)
  const expanded = useAgentChat(s => s.expanded)

  if (!open) return null

  const width = expanded ? 'w-[min(560px,92vw)]' : 'w-[min(380px,88vw)]'

  return (
    <aside
      aria-label="SignalorAI Agent"
      className={`cat-vt-panel flex min-h-0 shrink-0 flex-col overflow-hidden rounded-md border border-[var(--cat-border)] bg-[var(--cat-content)] shadow-[0_1px_2px_rgba(16,24,40,.05)] ${width}`}
    >
      <AgentChatHeader />
      <AgentChatEmptyState />
      <AgentChatComposer />
    </aside>
  )
}
