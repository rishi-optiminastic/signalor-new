import { TaskStatCard } from '@/features/catalyst/components/tasks/TaskStatCard'
import { TASK_STATS } from '@/features/catalyst/tasks-data'

export function TaskStatCards(): JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
      {TASK_STATS.map(stat => (
        <TaskStatCard key={stat.label} stat={stat} />
      ))}
    </div>
  )
}
