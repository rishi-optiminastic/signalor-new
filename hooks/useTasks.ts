'use client'

import { useQuery } from '@tanstack/react-query'
import { FileCheck2, FileClock, FileText, Flag } from 'lucide-react'

import { BLUE, BRAND, GREEN, NEG, YELLOW } from '@/features/catalyst/constants'
import type {
  Priority,
  ProjectRef,
  StatCard,
  StatusTab,
  TaskItem,
} from '@/features/catalyst/tasks-data'
import { getActions, type UserAction } from '@/lib/api/analyzer'
import { syncActions } from '@/lib/api/tasks'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

function priorityOf(points: number | null | undefined): Priority {
  const p = points ?? 0
  if (p >= 8) return 'High'
  if (p >= 4) return 'Medium'
  return 'Low'
}

function progressOf(status: string): number {
  if (status === 'completed' || status === 'verified') return 100
  if (status === 'in_progress') return 50
  return 0
}

function toTask(action: UserAction, project: ProjectRef): TaskItem {
  return {
    taskId: action.id,
    name: action.title || action.action_type || 'Untitled action',
    child: false,
    project,
    description: action.description,
    assigneeEmail: action.assignee_email ?? '',
    due: formatDate(action.created_at),
    priority: priorityOf(action.points_value),
    progress: progressOf(action.status),
  }
}

function buildStats(tasks: TaskItem[]): StatCard[] {
  const byPriority = (p: Priority): number => tasks.filter(t => t.priority === p).length
  const done = tasks.filter(t => t.progress === 100).length
  return [
    {
      icon: Flag,
      color: GREEN,
      label: 'Low Priority',
      value: String(byPriority('Low')),
      fill: true,
    },
    {
      icon: Flag,
      color: YELLOW,
      label: 'Medium Priority',
      value: String(byPriority('Medium')),
      fill: true,
    },
    {
      icon: Flag,
      color: NEG,
      label: 'High Priority',
      value: String(byPriority('High')),
      fill: true,
    },
    { icon: FileText, color: BLUE, label: 'Total Tasks', value: String(tasks.length) },
    { icon: FileCheck2, color: GREEN, label: 'Task Done', value: String(done) },
    { icon: FileClock, color: BRAND, label: 'Task Ongoing', value: String(tasks.length - done) },
  ]
}

function buildTabs(actions: UserAction[]): StatusTab[] {
  const count = (s: string): number => actions.filter(a => a.status === s).length
  const completed = count('completed') + count('verified')
  return [
    { label: 'To Do', count: count('pending') },
    { label: 'In Progress', count: count('in_progress') },
    { label: 'Overdue', count: 0 },
    { label: 'Completed', count: completed },
    { label: 'All', count: actions.length, active: true },
  ]
}

export interface TasksData {
  rows: TaskItem[]
  stats: StatCard[]
  tabs: StatusTab[]
}

interface UseTasksResult {
  data: TasksData | undefined
  isLoading: boolean
  isError: boolean
}

/**
 * Fetches role-scoped GEO tasks and adapts them to the board. When `orgId` is
 * given it first materializes the brand's recommendations into tasks (idempotent
 * server-side) so the list is auto-populated — no manual "start action" step.
 */
export function useTasks(
  email: string | undefined,
  project: ProjectRef,
  orgId?: number,
): UseTasksResult {
  const query = useQuery({
    queryKey: ['catalyst', 'tasks', email ?? '', orgId ?? 0],
    enabled: Boolean(email),
    queryFn: async (): Promise<TasksData> => {
      if (orgId) {
        await syncActions(email as string, orgId).catch(() => undefined)
      }
      const actions = await getActions(email as string)
      const rows = actions.map(a => toTask(a, project))
      return { rows, stats: buildStats(rows), tabs: buildTabs(actions) }
    },
  })
  return { data: query.data, isLoading: query.isLoading, isError: query.isError }
}
