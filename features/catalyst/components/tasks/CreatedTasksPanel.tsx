'use client'

import { CheckCircle2, Circle, Inbox, X } from 'lucide-react'

import { useMounted } from '@/hooks/useMounted'
import { useTaskStore } from '@/stores/useTaskStore'
import type { CreatedTask } from '@/stores/useTaskStore'

function TaskLine({ task }: { task: CreatedTask }): JSX.Element {
  const toggle = useTaskStore(s => s.toggleTask)
  const remove = useTaskStore(s => s.removeTask)
  return (
    <div className="group flex items-center gap-3 px-4 py-2.5">
      <button
        type="button"
        onClick={() => toggle(task.id)}
        aria-label="Toggle done"
        className="shrink-0"
      >
        {task.done ? (
          <CheckCircle2 size={17} className="text-[#2FBE7E]" />
        ) : (
          <Circle size={17} className="text-[var(--cat-ink-3)]" />
        )}
      </button>
      <span
        className={`min-w-0 flex-1 truncate text-[13px] ${task.done ? 'text-[var(--cat-ink-3)] line-through' : 'text-[var(--cat-ink)]'}`}
      >
        {task.title}
      </span>
      <span className="shrink-0 rounded-sm bg-[var(--cat-hover)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--cat-ink-2)]">
        {task.source}
      </span>
      <button
        type="button"
        onClick={() => remove(task.id)}
        aria-label="Remove"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-[var(--cat-ink-3)] opacity-0 transition-all group-hover:opacity-100 hover:bg-[var(--cat-hover)]"
      >
        <X size={13} />
      </button>
    </div>
  )
}

export function CreatedTasksPanel(): JSX.Element {
  const mounted = useMounted()
  const tasks = useTaskStore(s => s.tasks)
  const list = mounted ? tasks : []
  const open = list.filter(t => !t.done).length
  return (
    <div className="cat-rise shrink-0 overflow-hidden rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)]">
      <div className="flex items-center gap-2 border-b border-[var(--cat-border)] px-4 py-3">
        <Inbox size={15} className="text-[#e04a3d]" />
        <span className="text-[13px] font-semibold text-[var(--cat-ink)]">Agent inbox</span>
        <span className="rounded-full bg-[var(--cat-hover)] px-2 py-0.5 text-[11px] font-medium text-[var(--cat-ink-2)] tabular-nums">
          {open} open
        </span>
      </div>
      {list.length === 0 ? (
        <p className="px-4 py-8 text-center text-[13px] text-[var(--cat-ink-3)]">
          Tasks you act on across Signalor land here — try “Run today’s plan” in the Growth Agent.
        </p>
      ) : (
        <div className="divide-y divide-[var(--cat-border-soft)]">
          {list.map(t => (
            <TaskLine key={t.id} task={t} />
          ))}
        </div>
      )}
    </div>
  )
}
