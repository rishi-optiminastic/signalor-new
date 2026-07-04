import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CreatedTask {
  id: string
  title: string
  source: string
  category?: string
  done: boolean
}

interface TaskState {
  tasks: CreatedTask[]
  /** Idempotent by id — acting on the same suggestion twice won't duplicate. */
  addTask: (task: Omit<CreatedTask, 'done'>) => void
  toggleTask: (id: string) => void
  removeTask: (id: string) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    set => ({
      tasks: [],
      addTask: task =>
        set(s =>
          s.tasks.some(t => t.id === task.id)
            ? s
            : { tasks: [{ ...task, done: false }, ...s.tasks] },
        ),
      toggleTask: id =>
        set(s => ({ tasks: s.tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t)) })),
      removeTask: id => set(s => ({ tasks: s.tasks.filter(t => t.id !== id) })),
    }),
    { name: 'signalor.tasks' },
  ),
)
