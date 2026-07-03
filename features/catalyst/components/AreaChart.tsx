import { BRAND, CONV_SERIES } from '@/features/catalyst/constants'

const W = 340
const H = 90
const PAD = 8
const MAX = Math.max(...CONV_SERIES)
const MIN = Math.min(...CONV_SERIES)

/** Build the `<polyline>` points and the closed area `<path>` for one layer. */
function toLayer(scale: number): { poly: string; path: string } {
  const pts = CONV_SERIES.map((v, i) => {
    const x = (i / (CONV_SERIES.length - 1)) * W
    const y = H - PAD - ((v - MIN) / (MAX - MIN || 1)) * scale * (H - PAD * 2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  return { poly: pts.join(' '), path: `M${pts.join(' L')} L${W},${H} L0,${H} Z` }
}

export function AreaChart(): JSX.Element {
  const band = toLayer(1.25)
  const main = toLayer(1)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-20 w-full">
      <defs>
        <linearGradient id="cv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={BRAND} stopOpacity="0.35" />
          <stop offset="1" stopColor={BRAND} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cv2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={BRAND} stopOpacity="0.12" />
          <stop offset="1" stopColor={BRAND} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={band.path} fill="url(#cv2)" />
      <path d={main.path} fill="url(#cv)" />
      <polyline points={main.poly} fill="none" stroke={BRAND} strokeWidth={2} />
    </svg>
  )
}
