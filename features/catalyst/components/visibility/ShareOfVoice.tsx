import { BRAND } from '@/features/catalyst/constants'
import { SOV } from '@/features/catalyst/visibility-data'

const TICKS = [100, 75, 50, 25, 0]

function Bars(): JSX.Element {
  return (
    <div className="absolute inset-0 flex items-end justify-between gap-3 px-1">
      {SOV.map(bar => (
        <div
          key={bar.name}
          className="flex-1 rounded-t-sm"
          style={{ height: `${bar.value}%`, minHeight: bar.value > 0 ? 4 : 0, background: BRAND }}
        />
      ))}
    </div>
  )
}

export function ShareOfVoice(): JSX.Element {
  return (
    <div>
      <div className="mb-3 text-[12px] font-semibold tracking-wide text-[var(--cat-ink-3)] uppercase">
        Share of Voice
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-x-2">
        <div className="flex h-[160px] flex-col justify-between text-[10px] text-[var(--cat-ink-3)]">
          {TICKS.map(tick => (
            <span key={tick}>{tick}%</span>
          ))}
        </div>
        <div className="relative h-[160px]">
          {TICKS.map((tick, i) => (
            <div
              key={tick}
              className="absolute right-0 left-0 border-t border-[var(--cat-border-soft)]"
              style={{ top: `${(i / (TICKS.length - 1)) * 100}%` }}
            />
          ))}
          <Bars />
        </div>
        <div />
        <div className="flex justify-between gap-3 px-1 pt-2 text-[11px] text-[var(--cat-ink-3)]">
          {SOV.map(bar => (
            <span key={bar.name} className="flex-1 text-center">
              {bar.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
