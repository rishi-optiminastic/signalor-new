'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { assignAction, updateActionStatus } from '@/lib/api/tasks'

export interface TaskMutations {
  onAssign: (taskId: number, assigneeEmail: string) => void
  onToggleDone: (taskId: number, done: boolean) => void
  busy: boolean
}

/** Assign + mark-done mutations for the tasks board; invalidates the board on success. */
export function useTaskMutations(email: string | undefined): TaskMutations {
  const qc = useQueryClient()
  const invalidate = (): void => {
    void qc.invalidateQueries({ queryKey: ['catalyst', 'tasks'] })
  }

  const assign = useMutation({
    mutationFn: ({ taskId, assigneeEmail }: { taskId: number; assigneeEmail: string }) =>
      assignAction(taskId, email as string, assigneeEmail),
    onSuccess: invalidate,
  })

  const status = useMutation({
    mutationFn: ({ taskId, done }: { taskId: number; done: boolean }) =>
      updateActionStatus(taskId, done ? 'completed' : 'pending'),
    onSuccess: invalidate,
  })

  return {
    onAssign: (taskId, assigneeEmail) => assign.mutate({ taskId, assigneeEmail }),
    onToggleDone: (taskId, done) => status.mutate({ taskId, done }),
    busy: assign.isPending || status.isPending,
  }
}
