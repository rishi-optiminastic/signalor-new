import type { ReactNode } from 'react'

interface SectionCardProps {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  /** Render children flush (no padding) — e.g. for full-bleed row lists. */
  flush?: boolean
}

/** Shared chrome for a profile section: header strip + body. */
export function SectionCard({
  title,
  description,
  action,
  children,
  flush = false,
}: SectionCardProps): JSX.Element {
  return (
    <section className="shadow-input overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <header className="flex items-start justify-between gap-3 border-b border-neutral-200 px-5 py-4">
        <div>
          <h2 className="text-foreground text-[15px] font-semibold">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs font-light text-neutral-400">{description}</p>
          )}
        </div>
        {action}
      </header>
      <div className={flush ? '' : 'p-5'}>{children}</div>
    </section>
  )
}
