import { ChevronsUpDown } from 'lucide-react'

import { TaskRow } from '@/features/catalyst/components/tasks/TaskRow'
import type { TaskItem } from '@/features/catalyst/tasks-data'

// Project is dropped — the dashboard is scoped to one brand, so it was the same
// value on every row. Description and Due Date collapse on narrower widths so the
// table fits without a horizontal scroll. Keep in sync with TaskRow's cells.
const COLS: { label: string; className?: string }[] = [
  { label: 'Task', className: 'pr-3 pl-3' },
  { label: 'Description', className: 'hidden xl:table-cell' },
  { label: 'Assignee' },
  { label: 'Due Date', className: 'hidden lg:table-cell' },
  { label: 'Priority' },
  { label: 'Progress' },
  { label: 'Auto-fix' },
]

function TaskTableHead(): JSX.Element {
  return (
    <thead>
      <tr className="border-b border-[var(--cat-border)] bg-[var(--cat-hover)]">
        {COLS.map(col => (
          <th
            key={col.label}
            className={`py-2.5 text-left text-[12px] font-medium text-[var(--cat-ink-2)] ${col.className ?? 'px-3'}`}
          >
            <span className="inline-flex items-center gap-1">
              {col.label}
              <ChevronsUpDown size={12} className="text-[var(--cat-ink-3)]" />
            </span>
          </th>
        ))}
      </tr>
    </thead>
  )
}

export interface TaskTableProps {
  rows: TaskItem[]
  canAssign: boolean
  assignableEmails: string[]
  onAssign: (taskId: number, assigneeEmail: string) => void
  onToggleDone: (taskId: number, done: boolean) => void
  busy: boolean
}

export function TaskTable({
  rows,
  canAssign,
  assignableEmails,
  onAssign,
  onToggleDone,
  busy,
}: TaskTableProps): JSX.Element {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-[13px]">
        <TaskTableHead />
        <tbody>
          {rows.map(row => (
            <TaskRow
              key={row.taskId}
              row={row}
              canAssign={canAssign}
              assignableEmails={assignableEmails}
              onAssign={onAssign}
              onToggleDone={onToggleDone}
              busy={busy}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
