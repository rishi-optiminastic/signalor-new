import { List } from 'lucide-react'

import { DIRECTORIES } from '@/features/catalyst/agent-offpage-data'
import type { Directory, SubmitStatus } from '@/features/catalyst/agent-offpage-data'
import { AgentSectionPanel } from '@/features/catalyst/components/agent/AgentSectionPanel'
import { CreateTaskButton } from '@/features/catalyst/components/agent/CreateTaskButton'

const STATUS: Record<SubmitStatus, { label: string; className: string }> = {
  'not-submitted': {
    label: 'Not submitted',
    className: 'bg-[var(--cat-hover)] text-[var(--cat-ink-2)]',
  },
  submitted: { label: 'Submitted', className: 'bg-[rgba(59,158,246,0.12)] text-[#3B9EF6]' },
  live: { label: 'Live', className: 'bg-[rgba(47,190,126,0.14)] text-[#2FBE7E]' },
}

function DirectoryAction({ item }: { item: Directory }): JSX.Element {
  if (item.status !== 'not-submitted') {
    return (
      <button
        type="button"
        className="h-8 shrink-0 rounded-md border border-[var(--cat-border)] px-3 text-[12px] font-medium text-[var(--cat-ink-2)] transition-colors hover:bg-[var(--cat-hover)]"
      >
        View
      </button>
    )
  }
  return (
    <CreateTaskButton
      task={{
        id: `dir-${item.id}`,
        title: `Submit your site to ${item.name} (DA ${item.da})`,
        source: 'Directories',
        category: 'Directory',
      }}
      label="Submit"
      brand
    />
  )
}

function DirectoryRow({ item }: { item: Directory }): JSX.Element {
  const s = STATUS[item.status]
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-[var(--cat-ink)]">{item.name}</p>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--cat-ink-3)]">
          <span>DA {item.da}</span>
          <span>· {item.traffic}</span>
          <span className="rounded-sm bg-[var(--cat-hover)] px-1.5 py-0.5 font-medium text-[var(--cat-ink-2)]">
            {item.category}
          </span>
        </div>
      </div>
      <span
        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${s.className}`}
      >
        {s.label}
      </span>
      <div className="shrink-0">
        <DirectoryAction item={item} />
      </div>
    </div>
  )
}

export function DirectoriesSection(): JSX.Element {
  return (
    <AgentSectionPanel icon={List} title="Directories" count={DIRECTORIES.length}>
      <div className="divide-y divide-[var(--cat-border-soft)]">
        {DIRECTORIES.map(d => (
          <DirectoryRow key={d.id} item={d} />
        ))}
      </div>
    </AgentSectionPanel>
  )
}
