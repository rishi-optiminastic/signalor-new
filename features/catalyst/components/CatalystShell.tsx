import type { ReactNode } from 'react'

import { AgentChatPanel } from '@/features/catalyst/components/agent-chat/AgentChatPanel'
import { GlobalBar } from '@/features/catalyst/components/GlobalBar'
import { Sidebar } from '@/features/catalyst/components/Sidebar'

const PANEL =
  'cat-vt-panel flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-md border border-[var(--cat-border)] bg-[var(--cat-content)] px-3.5 pt-3.5 pb-3.5 shadow-[0_1px_2px_rgba(16,24,40,.05)]'

interface CatalystShellProps {
  children: ReactNode
}

/** Fixed-height app frame: pinned sidebar + a single scrollable content panel. */
export function CatalystShell({ children }: CatalystShellProps): JSX.Element {
  return (
    <div
      className="flex h-screen w-full gap-2 overflow-hidden p-2 font-sans"
      style={{ background: 'var(--cat-canvas)' }}
    >
      <Sidebar />
      <main className={PANEL}>
        <GlobalBar />
        <div className="mt-3 flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto pr-0.5">
          {children}
        </div>
      </main>
      <AgentChatPanel />
    </div>
  )
}
