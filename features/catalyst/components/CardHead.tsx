interface CardHeadProps {
  title: string
  action: string
}

export function CardHead({ title, action }: CardHeadProps): JSX.Element {
  return (
    <div className="mb-1 flex items-start justify-between">
      <span className="text-[13px] font-medium text-[var(--cat-ink-2)]">{title}</span>
      <button className="text-xs font-medium text-[var(--cat-ink-2)] transition-colors hover:text-[var(--cat-ink)]">
        {action}
      </button>
    </div>
  )
}
