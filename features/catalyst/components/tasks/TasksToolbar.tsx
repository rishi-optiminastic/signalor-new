import { Search } from 'lucide-react'

import { TaskStatusTabs } from '@/features/catalyst/components/tasks/TaskStatusTabs'
import { TasksViewToggle } from '@/features/catalyst/components/tasks/TasksViewToggle'
import { TaskToolbarActions } from '@/features/catalyst/components/tasks/TaskToolbarActions'
import type { StatusTab } from '@/features/catalyst/tasks-data'

export function TasksToolbar({ tabs }: { tabs: StatusTab[] }): JSX.Element {
  return (
    <div className="cat-rise flex shrink-0 flex-wrap items-center gap-2 border-b border-[var(--cat-border)] pb-3">
      <div className="relative">
        <Search
          size={16}
          className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--cat-ink-3)]"
        />
        <input
          placeholder="Search..."
          className="h-[36px] w-[200px] rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] pr-3 pl-9 text-[13px] text-[var(--cat-ink)] placeholder:text-[var(--cat-ink-3)] focus:border-[#e04a3d] focus:outline-none"
        />
      </div>
      <TasksViewToggle />
      <div className="hidden lg:block">
        <TaskStatusTabs tabs={tabs} />
      </div>
      <div className="ml-auto">
        <TaskToolbarActions />
      </div>
    </div>
  )
}
