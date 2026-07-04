import { TaskCard } from '@/features/catalyst/components/tasks/TaskCard'
import { TASK_GROUPS } from '@/features/catalyst/tasks-data'

const ALL_TASKS = TASK_GROUPS.flat()

export function TaskGrid(): JSX.Element {
  return (
    <div className="cat-stagger grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {ALL_TASKS.map((task, i) => (
        <TaskCard key={`${task.name}-${i}`} task={task} />
      ))}
    </div>
  )
}
