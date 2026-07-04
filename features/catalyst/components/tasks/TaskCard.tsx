import { AssigneeStack } from '@/features/catalyst/components/tasks/AssigneeStack'
import { PriorityTag } from '@/features/catalyst/components/tasks/PriorityTag'
import { ProgressCell } from '@/features/catalyst/components/tasks/ProgressCell'
import { ProjectTag } from '@/features/catalyst/components/tasks/ProjectTag'
import type { TaskItem } from '@/features/catalyst/tasks-data'

export function TaskCard({ task }: { task: TaskItem }): JSX.Element {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] p-4 transition-shadow hover:shadow-[0_6px_20px_rgba(16,24,40,0.06)]">
      <div className="flex items-center justify-between gap-2">
        <ProjectTag project={task.project} />
        <PriorityTag priority={task.priority} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[14px] font-semibold text-[var(--cat-ink)]">{task.name}</p>
        <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[var(--cat-ink-3)]">
          {task.description}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--cat-border-soft)] pt-3">
        <ProgressCell value={task.progress} />
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[var(--cat-ink-3)]">{task.due}</span>
          <AssigneeStack ids={task.assignees} />
        </div>
      </div>
    </div>
  )
}
