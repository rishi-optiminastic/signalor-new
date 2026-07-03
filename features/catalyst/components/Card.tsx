import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
}

export function Card({ children }: CardProps): JSX.Element {
  return (
    <div className="flex flex-col rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] p-3.5 transition-colors hover:border-[var(--cat-border)]">
      {children}
    </div>
  )
}
