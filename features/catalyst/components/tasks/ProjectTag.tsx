import type { ProjectRef } from '@/features/catalyst/tasks-data'

interface ProjectTagProps {
  project: ProjectRef
}

export function ProjectTag({ project }: ProjectTagProps): JSX.Element {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span
        className="grid h-5 w-5 shrink-0 place-items-center rounded-md text-[10px] font-bold text-white"
        style={{ background: project.color }}
      >
        {project.initial}
      </span>
      <span className="font-medium text-[var(--cat-ink)]">{project.name}</span>
    </span>
  )
}
