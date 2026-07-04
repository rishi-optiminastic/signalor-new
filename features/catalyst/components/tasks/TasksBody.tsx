'use client'

import type { ReactNode } from 'react'

import { useTasksViewStore } from '@/stores/useTasksViewStore'

/** Switches between the table (list) and card (grid) views. Both are
 *  server-rendered and passed in as props; this client shell just picks one. */
export function TasksBody({ list, grid }: { list: ReactNode; grid: ReactNode }): JSX.Element {
  const view = useTasksViewStore(s => s.view)
  return <>{view === 'grid' ? grid : list}</>
}
