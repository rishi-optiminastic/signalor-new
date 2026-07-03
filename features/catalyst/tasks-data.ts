import { Flag, FileCheck2, FileClock, FileText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { BLUE, BRAND, GREEN, NEG, PURPLE, YELLOW } from '@/features/catalyst/constants'

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

const SYNAPSE: ProjectRef = { name: 'Synapse', initial: 'S', color: PURPLE }
const HELIOS: ProjectRef = { name: 'Helios', initial: 'H', color: BRAND }
const LUMINA: ProjectRef = { name: 'Lumina', initial: 'L', color: BLUE }

// Coherent totals: priorities 19+2+30 = 51 = Total Tasks; Done 11 + Ongoing 40 = 51.
export const TASK_STATS: StatCard[] = [
  { icon: Flag, color: GREEN, label: 'Low Priority', value: '19', fill: true },
  { icon: Flag, color: YELLOW, label: 'Medium Priority', value: '2', fill: true },
  { icon: Flag, color: NEG, label: 'High Priority', value: '30', fill: true },
  { icon: FileText, color: BLUE, label: 'Total Tasks', value: '51' },
  { icon: FileCheck2, color: GREEN, label: 'Task Done', value: '11' },
  { icon: FileClock, color: BRAND, label: 'Task Ongoing', value: '40' },
]

// To Do + In Progress + Overdue = 40 (ongoing); Completed = 11 (done); All = 51.
export const TASK_TABS: StatusTab[] = [
  { label: 'To Do', count: 15 },
  { label: 'In Progress', count: 19 },
  { label: 'Overdue', count: 6 },
  { label: 'Completed', count: 11 },
  { label: 'All', count: 51, active: true },
]

/* --------------------------------------------------------------------- rows
   First row of each group is the parent (child:false); the rest are subtasks. */
export const TASK_GROUPS: TaskItem[][] = [
  [
    {
      name: 'Design Production',
      child: false,
      project: SYNAPSE,
      description: 'Ship the production-ready component set for launch.',
      assignees: [12, 32, 45],
      due: 'Nov 16, 2026',
      priority: 'High',
      progress: 75,
    },
    {
      name: 'UX Research',
      child: true,
      project: SYNAPSE,
      description: 'Synthesize insights from 12 moderated usability sessions.',
      assignees: [12, 32],
      due: 'Nov 2, 2026',
      priority: 'Medium',
      progress: 25,
    },
    {
      name: 'UI Design System Update',
      child: true,
      project: SYNAPSE,
      description: 'Migrate legacy tokens onto the new color scale.',
      assignees: [45],
      due: 'Nov 4, 2026',
      priority: 'High',
      progress: 50,
    },
    {
      name: 'Wireframing',
      child: true,
      project: SYNAPSE,
      description: 'Low-fidelity flows for onboarding and checkout.',
      assignees: [32],
      due: 'Oct 28, 2026',
      priority: 'Low',
      progress: 100,
    },
    {
      name: 'Design Blueprinting',
      child: true,
      project: SYNAPSE,
      description: 'Map the information architecture before hi-fi.',
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
      description: 'Prepare hand-off specs and assets for engineering.',
      assignees: [12, 32, 45, 5],
      due: 'Aug 12, 2026',
      priority: 'High',
      progress: 0,
    },
    {
      name: 'UX Research',
      child: true,
      project: HELIOS,
      description: 'Recruit participants for the pricing-page study.',
      assignees: [12, 32, 45],
      due: 'Sep 5, 2026',
      priority: 'High',
      progress: 0,
    },
    {
      name: 'UI Design System Update',
      child: true,
      project: HELIOS,
      description: 'Add dark-mode variants to every form control.',
      assignees: [8],
      due: 'Jul 19, 2026',
      priority: 'High',
      progress: 0,
    },
    {
      name: 'Wireframing',
      child: true,
      project: HELIOS,
      description: 'Sketch the dashboard at three breakpoints.',
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
      description: 'Polish micro-interactions across the settings area.',
      assignees: [12, 32, 45],
      due: 'Apr 25, 2026',
      priority: 'Medium',
      progress: 50,
    },
    {
      name: 'UX Research',
      child: true,
      project: HELIOS,
      description: 'Analyze drop-off in the sign-up funnel.',
      assignees: [12, 32, 45],
      due: 'Jan 10, 2026',
      priority: 'Medium',
      progress: 50,
    },
    {
      name: 'UI Design System Update',
      child: true,
      project: HELIOS,
      description: 'Document spacing and elevation guidelines.',
      assignees: [12, 32],
      due: 'Oct 15, 2026',
      priority: 'Medium',
      progress: 75,
    },
    {
      name: 'Wireframing',
      child: true,
      project: HELIOS,
      description: 'Iterate the empty and error states.',
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
      description: 'Assemble page templates for the marketing site.',
      assignees: [12, 32, 45],
      due: 'May 22, 2026',
      priority: 'High',
      progress: 50,
    },
    {
      name: 'UX Research',
      child: true,
      project: LUMINA,
      description: 'Interview five power users on reporting needs.',
      assignees: [12, 32],
      due: 'Feb 14, 2026',
      priority: 'Medium',
      progress: 75,
    },
    {
      name: 'UI Design System Update',
      child: true,
      project: LUMINA,
      description: 'Standardize icon sizing and stroke weights.',
      assignees: [45],
      due: 'Mar 30, 2026',
      priority: 'Low',
      progress: 100,
    },
    {
      name: 'Wireframing',
      child: true,
      project: LUMINA,
      description: 'Rough out the mobile navigation pattern.',
      assignees: [8],
      due: 'Jun 7, 2026',
      priority: 'Low',
      progress: 50,
    },
  ],
]
