import { TrendingUp } from 'lucide-react'

import type { TaskDetail } from '@/hooks/useTaskDetail'

/** "Why this matters" content (rendered inside a TaskSection accordion): the
 *  task description plus the analyzer's impact estimate. */
export function TaskDescriptionBody({ task }: { task: TaskDetail }): JSX.Element {
  return (
    <>
      <p className="text-[13px] leading-relaxed whitespace-pre-line text-[var(--cat-ink-2)]">
        {task.description || 'No description was generated for this task.'}
      </p>
      {task.impactNote && (
        <p className="mt-3 flex items-center gap-1.5 border-t border-[var(--cat-border-soft)] pt-2.5 text-[12px] font-medium text-[#2FBE7E]">
          <TrendingUp size={14} strokeWidth={2.2} />
          {task.impactNote}
        </p>
      )}
    </>
  )
}
