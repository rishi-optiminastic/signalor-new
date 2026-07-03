import { Flag, FileCheck2, FileClock, FileText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { BRAND, GREEN, NEG, YELLOW } from '@/features/catalyst/constants'

/* ------------------------------------------------------------------- types */
export type Priority = 'High' | 'Medium' | 'Low'

export interface ProjectRef {
  name: string
  initial: string
  color: string
}

export interface TaskItem {
  name: string
  child: boolean
  project: ProjectRef
  description: string
  assignees: number[]
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

/* --------------------------------------------------------------- constants */
export const PRIORITY_COLOR: Record<Priority, string> = {
  High: NEG,
  Medium: YELLOW,
  Low: GREEN,
}

const SYNAPSE: ProjectRef = { name: 'Synapse', initial: 'S', color: '#111827' }
const HELIOS: ProjectRef = { name: 'Helios', initial: 'H', color: BRAND }
const LUMINA: ProjectRef = { name: 'Lumina', initial: 'L', color: '#3B82F6' }

export const TASK_STATS: StatCard[] = [
  { icon: Flag, color: GREEN, label: 'Low Priority', value: '19', fill: true },
  { icon: Flag, color: YELLOW, label: 'Medium Priority', value: '2', fill: true },
  { icon: Flag, color: NEG, label: 'High Priority', value: '30', fill: true },
  { icon: FileText, color: '#3B82F6', label: 'Total Task', value: '51' },
  { icon: FileCheck2, color: GREEN, label: 'Task Done', value: '883' },
  { icon: FileClock, color: BRAND, label: 'Task Ongoing', value: '40' },
]

export const TASK_TABS: StatusTab[] = [
  { label: 'To Do', count: 3 },
  { label: 'In Progress', count: 3 },
  { label: 'Overdue', count: 3 },
  { label: 'Completed', count: 3 },
  { label: 'All', count: 41, active: true },
]

/* ------------------------------------------------------------------- rows */
export const TASK_GROUPS: TaskItem[][] = [
  [
    {
      name: 'Design Production',
      child: false,
      project: SYNAPSE,
      description: 'Conduct user interviews and analyze findings.',
      assignees: [12, 32, 45],
      due: 'Nov 16, 2026',
      priority: 'High',
      progress: 75,
    },
    {
      name: 'UX Research',
      child: true,
      project: SYNAPSE,
      description: 'Gather insights from users through interviews.',
      assignees: [12, 32],
      due: 'Nov 2, 2026',
      priority: 'Medium',
      progress: 25,
    },
    {
      name: 'UI Design System Update',
      child: true,
      project: SYNAPSE,
      description: 'Engage with users in interviews and assess.',
      assignees: [45],
      due: 'Nov 4, 2026',
      priority: 'High',
      progress: 50,
    },
    {
      name: 'Wireframing',
      child: true,
      project: SYNAPSE,
      description: 'Interview users and evaluate their responses.',
      assignees: [32],
      due: 'Oct 28, 2026',
      priority: 'Low',
      progress: 100,
    },
    {
      name: 'Design Blueprinting',
      child: true,
      project: SYNAPSE,
      description: 'Conduct user interviews to gather insight.',
      assignees: [12],
      due: 'Oct 28, 2026',
      priority: 'Medium',
      progress: 100,
    },
  ],
  [
    {
      name: 'Design Production',
      child: false,
      project: HELIOS,
      description: 'Conduct user interviews and review their input.',
      assignees: [12, 32, 45, 5],
      due: 'Aug 12, 2026',
      priority: 'High',
      progress: 0,
    },
    {
      name: 'UX Research',
      child: true,
      project: HELIOS,
      description: 'Hold user interviews and analyze their feedback.',
      assignees: [12, 32, 45],
      due: 'Sep 5, 2026',
      priority: 'High',
      progress: 0,
    },
    {
      name: 'UI Design System Update',
      child: true,
      project: HELIOS,
      description: 'Interview users and analyze their input forms.',
      assignees: [8],
      due: 'Jul 19, 2026',
      priority: 'High',
      progress: 0,
    },
    {
      name: 'Wireframing',
      child: true,
      project: HELIOS,
      description: 'Conduct interviews with users and assess.',
      assignees: [8, 20],
      due: 'Dec 3, 2026',
      priority: 'High',
      progress: 0,
    },
  ],
  [
    {
      name: 'Design Production',
      child: false,
      project: HELIOS,
      description: 'Engage users in interviews and analyze them.',
      assignees: [12, 32, 45],
      due: 'Apr 25, 2026',
      priority: 'Medium',
      progress: 50,
    },
    {
      name: 'UX Research',
      child: true,
      project: HELIOS,
      description: 'Conduct interviews with users and evaluate.',
      assignees: [12, 32, 45],
      due: 'Jan 10, 2026',
      priority: 'Medium',
      progress: 50,
    },
    {
      name: 'UI Design System Update',
      child: true,
      project: HELIOS,
      description: 'Gather user insights through interviews today.',
      assignees: [12, 32],
      due: 'Oct 15, 2026',
      priority: 'Medium',
      progress: 75,
    },
    {
      name: 'Wireframing',
      child: true,
      project: HELIOS,
      description: 'Engage users in interviews and analyze.',
      assignees: [8],
      due: 'Nov 29, 2026',
      priority: 'Medium',
      progress: 100,
    },
  ],
  [
    {
      name: 'Design Production',
      child: false,
      project: LUMINA,
      description: 'Conduct user interviews and assess their needs.',
      assignees: [12, 32, 45],
      due: 'May 22, 2026',
      priority: 'High',
      progress: 50,
    },
    {
      name: 'UX Research',
      child: true,
      project: LUMINA,
      description: 'Interview users and analyze their feedback.',
      assignees: [12, 32],
      due: 'Feb 14, 2026',
      priority: 'Medium',
      progress: 75,
    },
    {
      name: 'UI Design System Update',
      child: true,
      project: LUMINA,
      description: 'Gather insights from user interviews to iterate.',
      assignees: [45],
      due: 'Mar 30, 2026',
      priority: 'Low',
      progress: 100,
    },
    {
      name: 'Wireframing',
      child: true,
      project: LUMINA,
      description: 'Conduct user interviews and analyze findings.',
      assignees: [8],
      due: 'Jun 7, 2026',
      priority: 'Low',
      progress: 50,
    },
  ],
]
