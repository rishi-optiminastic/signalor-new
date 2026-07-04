import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AgentBrief } from '@/features/catalyst/agent-data'
import { DEFAULT_BRIEF } from '@/features/catalyst/agent-data'

interface AgentState {
  brief: AgentBrief
  setBrief: (brief: AgentBrief) => void
  /** Actions the user dismissed from today's brief. */
  dismissedIds: string[]
  dismiss: (id: string) => void
}

export const useAgentStore = create<AgentState>()(
  persist(
    set => ({
      brief: DEFAULT_BRIEF,
      setBrief: brief => set({ brief }),
      dismissedIds: [],
      dismiss: id =>
        set(s => (s.dismissedIds.includes(id) ? s : { dismissedIds: [...s.dismissedIds, id] })),
    }),
    { name: 'signalor.agent' },
  ),
)
