import { create } from 'zustand'

interface AgentChatState {
  /** Whether the docked Agent panel is visible. */
  open: boolean
  /** Wide (expanded) vs the default compact dock width. */
  expanded: boolean
  openPanel: () => void
  closePanel: () => void
  toggle: () => void
  toggleExpanded: () => void
}

/**
 * UI-only state for the Signalor Agent chat panel. Holds nothing but the
 * open/expanded flags - there is no conversation backend yet, so this drives
 * the shell layout and the topbar trigger and nothing else.
 */
export const useAgentChat = create<AgentChatState>(set => ({
  open: false,
  expanded: false,
  openPanel: () => set({ open: true }),
  closePanel: () => set({ open: false }),
  toggle: () => set(s => ({ open: !s.open })),
  toggleExpanded: () => set(s => ({ expanded: !s.expanded })),
}))
