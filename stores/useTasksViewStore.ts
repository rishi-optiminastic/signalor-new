import { create } from 'zustand'

export type TasksView = 'list' | 'grid'

interface TasksViewState {
  view: TasksView
  setView: (view: TasksView) => void
}

export const useTasksViewStore = create<TasksViewState>(set => ({
  view: 'list',
  setView: view => set({ view }),
}))
