import type { LucideIcon } from 'lucide-react'

import { GREEN, NEG, YELLOW } from '@/features/catalyst/constants'

export type Priority = 'High' | 'Medium' | 'Low'

export interface ProjectRef {
  name: string
  initial: string
  color: string
}

export interface TaskItem {
  /** Backend UserAction id — the key for assign / status mutations. */
  taskId: number
  name: string
  child: boolean
  project: ProjectRef
  description: string
  /** Email of the assigned teammate, or '' when unassigned. */
  assigneeEmail: string
  due: string
  priority: Priority
  /** 0 = Not Started, 100 = Done, else "N% Completed". */
  progress: number
}

export interface StatCard {
  icon: LucideIcon
  color: string
  label: string
  value: string
  fill?: boolean
}

export interface StatusTab {
  label: string
  count: number
  active?: boolean
}

export const PRIORITY_COLOR: Record<Priority, string> = {
  High: NEG,
  Medium: YELLOW,
  Low: GREEN,
}
