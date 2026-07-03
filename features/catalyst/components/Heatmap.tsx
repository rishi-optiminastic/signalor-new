import { BRAND } from '@/features/catalyst/constants'

const ROWS = 7
const COLS = 12

function cellOpacity(row: number, col: number): number {
  const v = 1 - col * 0.075 - row * 0.03
  return Math.max(0.05, Math.min(1, v))
}

export function Heatmap(): JSX.Element {
  const cells = Array.from({ length: ROWS * COLS }, (_, idx) => {
    const row = Math.floor(idx / COLS)
    const col = idx % COLS
    return (
      <span
        key={idx}
        className="aspect-square rounded-sm"
        style={{ background: BRAND, opacity: cellOpacity(row, col) }}
      />
    )
  })
  return <div className="my-3 grid grid-cols-12 gap-1">{cells}</div>
}
