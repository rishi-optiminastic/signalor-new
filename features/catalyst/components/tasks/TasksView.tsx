import { TaskStatCards } from '@/features/catalyst/components/tasks/TaskStatCards'
import { TasksToolbar } from '@/features/catalyst/components/tasks/TasksToolbar'
import { TaskTable } from '@/features/catalyst/components/tasks/TaskTable'

export function TasksView(): JSX.Element {
  return (
    <>
      <TasksToolbar />
      <div className="mt-3 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-0.5">
        <TaskStatCards />
        <div className="cat-rise overflow-hidden rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)]">
          <TaskTable />
        </div>
      </div>
    </>
  )
}
