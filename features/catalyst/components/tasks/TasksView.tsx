'use client'

import { useMemo } from 'react'

import { DataState } from '@/features/catalyst/components/DataState'
import { TaskStatCards } from '@/features/catalyst/components/tasks/TaskStatCards'
import { TasksToolbar } from '@/features/catalyst/components/tasks/TasksToolbar'
import { TaskTable } from '@/features/catalyst/components/tasks/TaskTable'
import { BRAND } from '@/features/catalyst/constants'
import type { ProjectRef, StatusTab } from '@/features/catalyst/tasks-data'
import { useActiveProject } from '@/hooks/useActiveProject'
import { useAgencyMembers } from '@/hooks/useAgencyMembers'
import { useAgencyRole } from '@/hooks/useAgencyRole'
import { useTaskMutations, type TaskMutations } from '@/hooks/useTaskMutations'
import { useTasks, type TasksData } from '@/hooks/useTasks'

const EMPTY_TABS: StatusTab[] = [
  { label: 'To Do', count: 0 },
  { label: 'In Progress', count: 0 },
  { label: 'Overdue', count: 0 },
  { label: 'Completed', count: 0 },
  { label: 'All', count: 0, active: true },
]

interface TaskBoardProps {
  data: TasksData | undefined
  isLoading: boolean
  isError: boolean
  canAssign: boolean
  assignableEmails: string[]
  mut: TaskMutations
}

function TaskBoard({
  data,
  isLoading,
  isError,
  canAssign,
  assignableEmails,
  mut,
}: TaskBoardProps): JSX.Element {
  return (
    <div className="mt-3 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-0.5">
      <DataState
        isLoading={isLoading}
        isError={isError}
        isEmpty={!data || data.rows.length === 0}
        emptyTitle="No tasks yet"
        emptyHint="Run an analysis on this brand to auto-generate GEO improvement tasks here."
      >
        {data && (
          <>
            <TaskStatCards stats={data.stats} />
            <div className="cat-rise overflow-hidden rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)]">
              <TaskTable
                rows={data.rows}
                canAssign={canAssign}
                assignableEmails={assignableEmails}
                onAssign={mut.onAssign}
                onToggleDone={mut.onToggleDone}
                busy={mut.busy}
              />
            </div>
          </>
        )}
      </DataState>
    </div>
  )
}

export function TasksView(): JSX.Element {
  const { email, activeOrg } = useActiveProject()
  const { isAdmin, agencyEmail } = useAgencyRole()
  const { members } = useAgencyMembers(isAdmin)
  const mut = useTaskMutations(email)

  const project = useMemo<ProjectRef>(
    () => ({
      name: activeOrg?.name ?? 'Brand',
      initial: (activeOrg?.name?.[0] ?? 'B').toUpperCase(),
      color: BRAND,
    }),
    [activeOrg?.name],
  )

  const { data, isLoading, isError } = useTasks(email, project, activeOrg?.id)

  const assignableEmails = useMemo(
    () => [agencyEmail, ...members.map(m => m.member_email)].filter(Boolean) as string[],
    [agencyEmail, members],
  )

  return (
    <>
      <TasksToolbar tabs={data?.tabs ?? EMPTY_TABS} />
      <TaskBoard
        data={data}
        isLoading={isLoading}
        isError={isError}
        canAssign={isAdmin}
        assignableEmails={assignableEmails}
        mut={mut}
      />
    </>
  )
}
