import { ChevronsUpDown } from 'lucide-react'

import { TaskRow } from '@/features/catalyst/components/tasks/TaskRow'
import { TASK_GROUPS } from '@/features/catalyst/tasks-data'

const COLS = ['Task', 'Project', 'Description', 'Assignee', 'Due Date', 'Priority', 'Progress']

export function TaskTable(): JSX.Element {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] border-collapse text-[13px]">
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
        <tbody>
          {TASK_GROUPS.map((group, gi) => (
            <TaskGroupBody key={gi} rows={group} last={gi === TASK_GROUPS.length - 1} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TaskGroupBody({
  rows,
  last,
}: {
  rows: (typeof TASK_GROUPS)[number]
  last: boolean
}): JSX.Element {
  return (
    <>
      {rows.map((row, ri) => (
        <TaskRow key={`${row.name}-${ri}`} row={row} />
      ))}
      {!last && (
        <tr>
          <td colSpan={7} className="h-2 border-t-2 border-[var(--cat-border-soft)]" />
        </tr>
      )}
    </>
  )
}
