import { BRAND, GREEN, RADAR_AXES, RADAR_NEW, RADAR_RETURNING } from '@/features/catalyst/constants'

const CX = 130
const CY = 120
const R = 74
const RINGS = [0.25, 0.5, 0.75, 1]

type Point = readonly [number, number]

function pt(i: number, frac: number): Point {
  const a = (Math.PI * 2 * i) / RADAR_AXES.length - Math.PI / 2
  return [CX + Math.cos(a) * R * frac, CY + Math.sin(a) * R * frac]
}

function poly(vals: number[]): string {
  return vals.map((v, i) => pt(i, v).join(',')).join(' ')
}

function Series({ vals, color }: { vals: number[]; color: string }): JSX.Element {
  return (
    <>
      <polygon
        points={poly(vals)}
        fill={color}
        fillOpacity={0.12}
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {vals.map((v, i) => {
        const [x, y] = pt(i, v)
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={3}
            fill="var(--cat-card)"
            stroke={color}
            strokeWidth={2}
          />
        )
      })}
    </>
  )
}

function Labels(): JSX.Element {
  return (
    <>
      {RADAR_AXES.map((name, i) => {
        const [x, y] = pt(i, 1.28)
        return (
          <span
            key={name}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] px-2 py-0.5 text-[11px] whitespace-nowrap text-[var(--cat-ink-2)]"
            style={{ left: `${(x / 260) * 100}%`, top: `${(y / 240) * 100}%` }}
          >
            {name}
          </span>
        )
      })}
    </>
  )
}

export function Radar(): JSX.Element {
  return (
    <div className="relative mx-auto mt-1 h-[240px] w-[260px]">
      <svg viewBox="0 0 260 240" className="h-[240px] w-full">
        {RINGS.map(f => (
          <polygon
            key={f}
            points={RADAR_AXES.map((_, i) => pt(i, f).join(',')).join(' ')}
            fill="none"
            stroke="var(--cat-grid)"
          />
        ))}
        {RADAR_AXES.map((_, i) => {
          const [x, y] = pt(i, 1)
          return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="var(--cat-grid)" />
        })}
        <Series vals={RADAR_NEW} color={BRAND} />
        <Series vals={RADAR_RETURNING} color={GREEN} />
      </svg>
      <Labels />
    </div>
  )
}
