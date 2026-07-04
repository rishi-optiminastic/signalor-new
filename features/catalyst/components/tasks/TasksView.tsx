import { CreatedTasksPanel } from '@/features/catalyst/components/tasks/CreatedTasksPanel'
import { TaskGrid } from '@/features/catalyst/components/tasks/TaskGrid'
import { TasksBody } from '@/features/catalyst/components/tasks/TasksBody'
import { TaskStatCards } from '@/features/catalyst/components/tasks/TaskStatCards'
import { TasksToolbar } from '@/features/catalyst/components/tasks/TasksToolbar'
import { TaskTable } from '@/features/catalyst/components/tasks/TaskTable'

export function TasksView(): JSX.Element {
  const listView = (
    <div className="cat-rise shrink-0 overflow-hidden rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)]">
      <TaskTable />
    </div>
  )
  return (
    <>
      <TasksToolbar />
      <div className="mt-3 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-0.5">
        <CreatedTasksPanel />
        <TaskStatCards />
        <TasksBody list={listView} grid={<TaskGrid />} />
      </div>
    </>
  )
}
