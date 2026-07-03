import { GripVertical } from 'lucide-react'

import { AssigneeStack } from '@/features/catalyst/components/tasks/AssigneeStack'
import { PriorityTag } from '@/features/catalyst/components/tasks/PriorityTag'
import { ProgressCell } from '@/features/catalyst/components/tasks/ProgressCell'
import { ProjectTag } from '@/features/catalyst/components/tasks/ProjectTag'
import type { TaskItem } from '@/features/catalyst/tasks-data'

interface TaskRowProps {
  row: TaskItem
}

export function TaskRow({ row }: TaskRowProps): JSX.Element {
  return (
    <tr className="border-t border-[var(--cat-border-soft)] transition-colors hover:bg-[var(--cat-hover)]">
      <td className="py-2.5 pr-3 pl-1">
        <span className="flex items-center gap-1.5" style={{ paddingLeft: row.child ? 22 : 0 }}>
          <GripVertical size={14} className="shrink-0 text-[var(--cat-ink-3)]" />
          <span className="h-[15px] w-[15px] shrink-0 rounded-sm border border-[var(--cat-border)]" />
          <span
            className={`truncate ${row.child ? 'text-[var(--cat-ink)]' : 'font-semibold text-[var(--cat-ink)]'}`}
          >
            {row.name}
          </span>
        </span>
      </td>
      <td className="px-3 py-2.5">
        <ProjectTag project={row.project} />
      </td>
      <td className="max-w-[220px] px-3 py-2.5">
        <span className="block truncate text-[var(--cat-ink-2)]">{row.description}</span>
      </td>
      <td className="px-3 py-2.5">
        <AssigneeStack ids={row.assignees} />
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
