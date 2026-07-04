'use client'

import { Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

import { useMounted } from '@/hooks/useMounted'
import { useTaskStore } from '@/stores/useTaskStore'

export interface TaskSeed {
  id: string
  title: string
  source: string
  category?: string
}

interface CreateTaskButtonProps {
  task: TaskSeed
  label: string
  icon?: LucideIcon
  brand?: boolean
}

/** Adds a task to the shared inbox (Tasks tab) and confirms in place. */
export function CreateTaskButton({
  task,
  label,
  icon: Icon,
  brand = false,
}: CreateTaskButtonProps): JSX.Element {
  const mounted = useMounted()
  const added = useTaskStore(s => s.tasks.some(t => t.id === task.id))
  const addTask = useTaskStore(s => s.addTask)

  if (mounted && added) {
    return (
      <Link
        href="/dashboard/tasks"
        className="inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-[12px] font-medium text-[#2FBE7E]"
      >
        <Check size={14} />
        In tasks
      </Link>
    )
  }
  return (
    <button
      type="button"
      onClick={() => addTask(task)}
      className={
        brand
          ? 'inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[12px] font-medium text-white'
          : 'inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--cat-border)] px-3 text-[12px] font-medium text-[var(--cat-ink-2)] transition-colors hover:bg-[var(--cat-hover)]'
      }
      style={brand ? { background: '#e04a3d' } : undefined}
    >
      {Icon && <Icon size={13} />}
      {label}
    </button>
  )
}
