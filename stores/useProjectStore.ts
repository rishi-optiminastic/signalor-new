import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * The dashboard's active project (an Organization id). All catalyst pages read
 * the resolved run `slug` via `useActiveProject`, which maps this org → its
 * latest analysis run. Persisted so the choice survives reloads; the key matches
 * the legacy WorkspaceSwitcher storage.
 */
interface ProjectState {
  activeOrgId: number | null
  setActiveOrgId: (id: number) => void
}

export const useProjectStore = create<ProjectState>()(
  persist(
    set => ({
      activeOrgId: null,
      setActiveOrgId: (id: number): void => {
        set({ activeOrgId: id })
      },
    }),
    { name: 'signalor.activeProject' },
  ),
)
