import { Plus } from 'lucide-react'

import { formatDate } from '@/lib/format'
import type { AccountProject } from '@/services/account.service'

import { SectionCard } from './section-card'

function ProjectRow({ project }: { project: AccountProject }): JSX.Element {
  return (
    <li className="flex items-center gap-3 px-5 py-3.5">
      <span className="bg-muted text-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[13px] font-semibold uppercase">
        {project.name[0]}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-[13px] font-medium">{project.name}</p>
        <p className="truncate text-xs text-neutral-400">{project.url}</p>
      </div>
      <span className="shrink-0 text-xs text-neutral-400">
        Added {formatDate(project.createdAt)}
      </span>
    </li>
  )
}

interface ProjectsListProps {
  projects: AccountProject[]
  max: number
}

/** The user's projects/organizations with an add action. */
export function ProjectsList({ projects, max }: ProjectsListProps): JSX.Element {
  const addButton = (
    <button
      type="button"
      className="shadow-input text-foreground inline-flex h-8 items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 text-[13px] font-medium transition hover:bg-neutral-50 disabled:opacity-50"
      disabled={projects.length >= max}
    >
      <Plus className="h-3.5 w-3.5" />
      New
    </button>
  )
  return (
    <SectionCard
      title="Projects"
      description={`${projects.length} of ${max} used`}
      action={addButton}
      flush
    >
      <ul className="divide-y divide-neutral-100">
        {projects.map(p => (
          <ProjectRow key={p.id} project={p} />
        ))}
      </ul>
    </SectionCard>
  )
}
