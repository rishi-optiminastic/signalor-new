interface AssigneeStackProps {
  ids: number[]
}

export function AssigneeStack({ ids }: AssigneeStackProps): JSX.Element {
  const shown = ids.slice(0, 3)
  const extra = ids.length - shown.length

  return (
    <span className="flex items-center" aria-label={`${ids.length} assignees`}>
      {shown.map((id, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={id}
          src={`https://i.pravatar.cc/48?img=${id}`}
          alt=""
          className="h-6 w-6 rounded-full ring-2 ring-[var(--cat-card)]"
          style={{ marginLeft: i === 0 ? 0 : -8 }}
        />
      ))}
      {extra > 0 && (
        <span
          className="grid h-6 w-6 place-items-center rounded-full bg-[var(--cat-track)] text-[10px] font-semibold text-[var(--cat-ink-2)] ring-2 ring-[var(--cat-card)]"
          style={{ marginLeft: -8 }}
        >
          +{extra}
        </span>
      )}
    </span>
  )
}
