import { VISIBILITY_SCORE } from '@/features/catalyst/agent-insights-data'
import { InsightCard } from '@/features/catalyst/components/agent/insights/InsightCard'
import { Sparkline } from '@/features/catalyst/components/visibility/Sparkline'
import { BRAND } from '@/features/catalyst/constants'

function ScoreValue(): JSX.Element {
  return (
    <div className="text-right">
      <p className="text-[20px] leading-none font-bold text-[var(--cat-ink)] tabular-nums">
        {VISIBILITY_SCORE.value}
      </p>
      <p className="mt-1 text-[10px] tracking-wide text-[var(--cat-ink-3)] uppercase">Score</p>
    </div>
  )
}

export function VisibilityScoreCard(): JSX.Element {
  return (
    <InsightCard
      title="Visibility Score"
      subtitle="How often you appear in AI-generated answers"
      right={<ScoreValue />}
    >
      <Sparkline points={VISIBILITY_SCORE.series} color={BRAND} className="h-28" />
      <div className="mt-1.5 flex justify-between text-[10px] text-[var(--cat-ink-3)]">
        {VISIBILITY_SCORE.axis.map(d => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-2.5 flex items-center gap-4 border-t border-[var(--cat-border-soft)] pt-2.5 text-[10px] text-[var(--cat-ink-3)]">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: BRAND }} />
          Current period
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--cat-ink-3)]" />
          Compare competitors
        </span>
      </div>
    </InsightCard>
  )
}
