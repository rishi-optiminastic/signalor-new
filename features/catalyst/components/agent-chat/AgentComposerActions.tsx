'use client'

import { ArrowUp, Paperclip } from 'lucide-react'

const GHOST =
  'grid h-7 w-7 place-items-center rounded-md text-[var(--cat-ink-3)] transition-colors hover:bg-[var(--cat-hover)] hover:text-[var(--cat-ink)]'

/** Attach + send row under the Agent textarea. Send is inert while `canSend`. */
export function AgentComposerActions({ canSend }: { canSend: boolean }): JSX.Element {
  const send = canSend
    ? 'auth-cta-btn grid h-7 w-7 place-items-center rounded-md text-white'
    : 'grid h-7 w-7 place-items-center rounded-md bg-[var(--cat-track)] text-[var(--cat-ink-3)]'

  return (
    <div className="mt-1.5 flex items-center justify-between">
      <button type="button" aria-label="Attach file" className={GHOST}>
        <Paperclip size={16} strokeWidth={1.9} />
      </button>
      <button type="button" disabled={!canSend} aria-label="Send message" className={send}>
        <ArrowUp size={16} strokeWidth={2.2} />
      </button>
    </div>
  )
}
