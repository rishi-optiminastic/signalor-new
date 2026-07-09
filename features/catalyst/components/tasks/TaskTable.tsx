import { ChevronsUpDown } from 'lucide-react'

import { TaskRow } from '@/features/catalyst/components/tasks/TaskRow'
import type { TaskItem } from '@/features/catalyst/tasks-data'

const COLS = ['Task', 'Project', 'Description', 'Assignee', 'Due Date', 'Priority', 'Progress']

function TaskTableHead(): JSX.Element {
  return (
    <thead>
      <tr className="border-b border-[var(--cat-border)] bg-[var(--cat-hover)]">
        {COLS.map((c, i) => (
          <th
            key={c}
            className={`py-2.5 text-left text-[12px] font-medium text-[var(--cat-ink-2)] ${i === 0 ? 'pr-3 pl-3' : 'px-3'}`}
          >
            <span className="inline-flex items-center gap-1">
              {c}
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
      <table className="w-full min-w-[920px] border-collapse text-[13px]">
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
