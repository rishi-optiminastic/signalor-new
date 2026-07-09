import { TaskStatCard } from '@/features/catalyst/components/tasks/TaskStatCard'
import type { StatCard } from '@/features/catalyst/tasks-data'

export function TaskStatCards({ stats }: { stats: StatCard[] }): JSX.Element {
  return (
    <div className="cat-stagger grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
      {stats.map(stat => (
        <TaskStatCard key={stat.label} stat={stat} />
      ))}
    </div>
  )
}
