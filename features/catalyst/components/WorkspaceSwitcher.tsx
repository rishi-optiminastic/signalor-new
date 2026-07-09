'use client'

import { Building2, Check, ChevronsUpDown, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { useActiveProject } from '@/hooks/useActiveProject'

const LOGO_BG = 'conic-gradient(from 210deg at 50% 50%, #F2A79E, #e04a3d, #b9382d, #F2A79E)'

interface Project {
  id: number
  name: string
  url: string
}

function Tile({ label }: { label: string }): JSX.Element {
  return (
    <span
      className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-[13px] font-semibold text-white uppercase"
      style={{ background: LOGO_BG }}
    >
      {label[0] ?? '?'}
    </span>
  )
}

interface MenuProps {
  projects: Project[]
  activeId: number | undefined
  onSelect: (id: number) => void
}

function MenuFooter(): JSX.Element {
  const item =
    'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[13px] font-medium text-[var(--cat-ink-2)] transition-colors hover:bg-[var(--cat-hover)]'
  return (
    <>
      <div className="my-1 h-px bg-[var(--cat-border)]" />
      <Link href="/dashboard/brands" className={item}>
        <Building2 size={15} className="text-[var(--cat-ink-3)]" />
        Manage brands
      </Link>
      <Link href="/dashboard/brands" className={item}>
        <Plus size={15} className="text-[var(--cat-ink-3)]" />
        Create new brand
      </Link>
    </>
  )
}

function ProjectMenu({ projects, activeId, onSelect }: MenuProps): JSX.Element {
  return (
    <div className="absolute top-[calc(100%+4px)] right-0 left-0 z-30 overflow-hidden rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] p-1 shadow-lg">
      <p className="px-2 py-1.5 text-[10px] font-semibold tracking-wider text-[var(--cat-ink-3)] uppercase">
        Switch project
      </p>
      {projects.map(p => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelect(p.id)}
          className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-[var(--cat-hover)]"
        >
          <Tile label={p.name} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium text-[var(--cat-ink)]">
              {p.name}
            </span>
            <span className="block truncate text-[11px] text-[var(--cat-ink-3)]">{p.url}</span>
          </span>
          {p.id === activeId && <Check size={15} className="shrink-0 text-[#e04a3d]" />}
        </button>
      ))}
      {projects.length === 0 && (
        <p className="px-2 py-2 text-[12px] text-[var(--cat-ink-3)]">No projects yet.</p>
      )}
      <MenuFooter />
    </div>
  )
}

function SwitcherTrigger({
  project,
  onToggle,
}: {
  project: Project
  onToggle: () => void
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center gap-2.5 rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] px-2 py-1.5 text-left transition-colors hover:bg-[var(--cat-hover)]"
    >
      <Tile label={project.name} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-[var(--cat-ink)]">
          {project.name}
        </span>
        <span className="block truncate text-[11px] text-[var(--cat-ink-3)]">{project.url}</span>
      </span>
      <ChevronsUpDown size={15} className="shrink-0 text-[var(--cat-ink-3)]" />
    </button>
  )
}

const EMPTY_PROJECT: Project = { id: 0, name: 'No project', url: 'Create a brand to start' }

export function WorkspaceSwitcher({ collapsed }: { collapsed?: boolean }): JSX.Element {
  const { projects, activeOrg, select } = useActiveProject()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDown(e: MouseEvent): void {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const active: Project = activeOrg
    ? { id: activeOrg.id, name: activeOrg.name, url: activeOrg.url }
    : EMPTY_PROJECT
  const list: Project[] = projects.map(p => ({ id: p.id, name: p.name, url: p.url }))

  const choose = (id: number): void => {
    select(id)
    setOpen(false)
    const org = projects.find(p => p.id === id)
    if (org?.slug) router.push(`/dashboard/${org.slug}`)
  }

  if (collapsed) {
    return (
      <Link
        href="/dashboard/brands"
        title={active.name}
        className="mt-3 flex justify-center rounded-md py-1 transition-colors hover:bg-[var(--cat-hover)]"
      >
        <Tile label={active.name} />
      </Link>
    )
  }

  return (
    <div ref={ref} className="relative mt-3">
      <SwitcherTrigger project={active} onToggle={() => setOpen(o => !o)} />
      {open && <ProjectMenu projects={list} activeId={activeOrg?.id} onSelect={choose} />}
    </div>
  )
}
