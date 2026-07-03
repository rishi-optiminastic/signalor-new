import type { Tile } from '@/features/catalyst/visibility-data'

interface StatTileProps {
  tile: Tile
  color?: string
}

export function StatTile({ tile, color }: StatTileProps): JSX.Element {
  const { icon: Icon, value, label } = tile
  return (
    <div className="flex flex-col items-center gap-1 rounded-md border border-[var(--cat-border)] bg-[var(--cat-hover)] px-2 py-3 text-center">
      <Icon size={15} style={{ color: color ?? 'var(--cat-ink-3)' }} />
      <span className="text-[20px] font-bold tracking-tight text-[var(--cat-ink)]">{value}</span>
      <span className="text-[10px] tracking-wide text-[var(--cat-ink-3)] uppercase">{label}</span>
    </div>
  )
}
