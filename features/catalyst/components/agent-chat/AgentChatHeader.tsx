'use client'

import { Maximize2, Minimize2, X } from '@/lib/icons'
import { useAgentChat } from '@/stores/useAgentChat'

const GHOST =
  'grid h-7 w-7 place-items-center rounded-md text-[var(--cat-ink-3)] transition-colors hover:bg-[var(--cat-hover)] hover:text-[var(--cat-ink)]'

/** The Agent panel top bar: expand / collapse and close. */
export function AgentChatHeader(): JSX.Element {
  const expanded = useAgentChat(s => s.expanded)
  const toggleExpanded = useAgentChat(s => s.toggleExpanded)
  const closePanel = useAgentChat(s => s.closePanel)

  return (
    <div className="flex shrink-0 items-center justify-between border-b border-[var(--cat-border)] px-3 py-2.5">
      <span className="text-[12px] font-semibold tracking-wide text-[var(--cat-ink-2)] uppercase">
        SignalorAI Agent
      </span>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={toggleExpanded}
          aria-label={expanded ? 'Collapse panel' : 'Expand panel'}
          className={GHOST}
        >
          {expanded ? (
            <Minimize2 size={15} strokeWidth={1.9} />
          ) : (
            <Maximize2 size={15} strokeWidth={1.9} />
          )}
        </button>
        <button type="button" onClick={closePanel} aria-label="Close Agent" className={GHOST}>
          <X size={16} strokeWidth={1.9} />
        </button>
      </div>
    </div>
  )
}
