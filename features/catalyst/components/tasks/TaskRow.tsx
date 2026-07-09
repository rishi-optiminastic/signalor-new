import { Check, GripVertical } from 'lucide-react'

import { AssigneeStack } from '@/features/catalyst/components/tasks/AssigneeStack'
import { PriorityTag } from '@/features/catalyst/components/tasks/PriorityTag'
import { ProgressCell } from '@/features/catalyst/components/tasks/ProgressCell'
import { ProjectTag } from '@/features/catalyst/components/tasks/ProjectTag'
import type { TaskItem } from '@/features/catalyst/tasks-data'

export interface TaskRowProps {
  row: TaskItem
  /** Admin sees the assign dropdown; others see the assignee read-only. */
  canAssign: boolean
  /** Emails assignable by the admin (owner + members). */
  assignableEmails: string[]
  onAssign: (taskId: number, assigneeEmail: string) => void
  onToggleDone: (taskId: number, done: boolean) => void
  busy: boolean
}

function AssignControl({
  row,
  assignableEmails,
  onAssign,
  busy,
}: Pick<TaskRowProps, 'row' | 'assignableEmails' | 'onAssign' | 'busy'>): JSX.Element {
  return (
    <select
      value={row.assigneeEmail}
      disabled={busy}
      onChange={e => onAssign(row.taskId, e.target.value)}
      className="h-8 max-w-[170px] rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] px-2 text-[12px] font-medium text-[var(--cat-ink-2)] outline-none disabled:opacity-60"
    >
      <option value="">Unassigned</option>
      {assignableEmails.map(email => (
        <option key={email} value={email}>
          {email}
        </option>
      ))}
    </select>
  )
}

function TaskNameCell({
  row,
  done,
  busy,
  onToggleDone,
}: Pick<TaskRowProps, 'row' | 'busy' | 'onToggleDone'> & { done: boolean }): JSX.Element {
  return (
    <span className="flex items-center gap-1.5" style={{ paddingLeft: row.child ? 22 : 0 }}>
      <GripVertical size={14} className="shrink-0 text-[var(--cat-ink-3)]" />
      <button
        type="button"
        disabled={busy}
        onClick={() => onToggleDone(row.taskId, !done)}
        aria-label={done ? 'Mark task not done' : 'Mark task done'}
        className={`grid h-[15px] w-[15px] shrink-0 place-items-center rounded-sm border disabled:opacity-50 ${
          done
            ? 'border-[#e04a3d] bg-[#e04a3d] text-white'
            : 'border-[var(--cat-border)] hover:border-[#e04a3d]'
        }`}
      >
        {done && <Check size={11} strokeWidth={3} />}
      </button>
      <span
        className={`truncate ${row.child ? 'text-[var(--cat-ink)]' : 'font-semibold text-[var(--cat-ink)]'}`}
      >
        {row.name}
      </span>
    </span>
  )
}

function AssigneeCell({
  row,
  canAssign,
  assignableEmails,
  onAssign,
  busy,
}: Pick<
  TaskRowProps,
  'row' | 'canAssign' | 'assignableEmails' | 'onAssign' | 'busy'
>): JSX.Element {
  if (!canAssign) return <AssigneeStack email={row.assigneeEmail} />
  return (
    <AssignControl row={row} assignableEmails={assignableEmails} onAssign={onAssign} busy={busy} />
  )
}

export function TaskRow(props: TaskRowProps): JSX.Element {
  const { row } = props
  const done = row.progress === 100
  return (
    <tr className="border-t border-[var(--cat-border-soft)] transition-colors hover:bg-[var(--cat-hover)]">
      <td className="py-2.5 pr-3 pl-1">
        <TaskNameCell row={row} done={done} busy={props.busy} onToggleDone={props.onToggleDone} />
      </td>
      <td className="px-3 py-2.5">
        <ProjectTag project={row.project} />
      </td>
      <td className="max-w-[220px] px-3 py-2.5">
        <span className="block truncate text-[var(--cat-ink-2)]">{row.description}</span>
      </td>
      <td className="px-3 py-2.5">
        <AssigneeCell {...props} />
      </td>
      <td className="px-3 py-2.5 whitespace-nowrap text-[var(--cat-ink-2)]">{row.due}</td>
      <td className="px-3 py-2.5">
        <PriorityTag priority={row.priority} />
      </td>
      <td className="px-3 py-2.5">
        <ProgressCell value={row.progress} />
      </td>
    </tr>
  )
}
