import { BRAND, SALES_LINE } from '@/features/catalyst/constants'

const W = 340
const H = 90

function buildPoints(): string {
  const max = Math.max(...SALES_LINE)
  const min = Math.min(...SALES_LINE)
  return SALES_LINE.map((v, i) => {
    const x = (i / (SALES_LINE.length - 1)) * W
    const y = H - ((v - min) / (max - min)) * (H - 12) - 6
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}

export function LineChart(): JSX.Element {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-[90px] w-full">
      <polyline
        points={buildPoints()}
        fill="none"
        stroke={BRAND}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
