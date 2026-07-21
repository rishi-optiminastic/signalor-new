'use client'

import { EngineLogo } from '@/features/catalyst/components/EngineLogo'
import { MultiLineChart } from '@/features/catalyst/components/insights/MultiLineChart'
import { useInsights, type TrendSeries } from '@/hooks/useInsights'

/** Half the chart's default 180 viewBox height — a compact strip above the table. */
const CHART_HEIGHT = 90

type TrendState = 'loading' | 'error' | 'empty' | 'ready'

const NOTES: Record<Exclude<TrendState, 'ready'>, string> = {
  loading: 'Loading citation trend…',
  error: "Couldn't load the citation trend.",
  empty: 'No citation data yet — track prompts to start the trend.',
}

function trendState(
  flags: { isLoading: boolean; isError: boolean },
  seriesCount: number,
  weekCount: number,
): TrendState {
  if (flags.isLoading) return 'loading'
  if (flags.isError) return 'error'
  // A week with zero mentions is real data: the chart draws it flat on the 0
  // baseline rather than hiding behind a "needs more data" note.
  if (seriesCount === 0 || weekCount === 0) return 'empty'
  return 'ready'
}

/** A lone data point can't form a polyline — mirror it so the line still draws. */
function padForLine(
  series: TrendSeries[],
  weeks: string[],
): { series: TrendSeries[]; weeks: string[] } {
  if (weeks.length !== 1) return { series, weeks }
  return {
    weeks: [weeks[0], ''],
    series: series.map(s => ({ ...s, points: [s.points[0] ?? 0, s.points[0] ?? 0] })),
  }
}

/** Per-model legend with each engine's most recent mention rate. */
function TrendLegend({ series }: { series: TrendSeries[] }): JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {series.map(s => (
        <span
          key={s.key}
          className="inline-flex items-center gap-1.5 text-[12px] text-[var(--cat-ink-2)]"
        >
          <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: s.color }} />
          <EngineLogo name={s.label} size={16} />
          <span>{s.label}</span>
          <span className="font-semibold text-[var(--cat-ink)] tabular-nums">
            {s.points[s.points.length - 1] ?? 0}%
          </span>
        </span>
      ))}
    </div>
  )
}

interface TrendBodyProps {
  state: TrendState
  series: TrendSeries[]
  weeks: string[]
}

function TrendBody({ state, series, weeks }: TrendBodyProps): JSX.Element {
  if (state === 'ready') {
    const padded = padForLine(series, weeks)
    return <MultiLineChart series={padded.series} xLabels={padded.weeks} height={CHART_HEIGHT} />
  }
  return <p className="py-10 text-center text-[12px] text-[var(--cat-ink-3)]">{NOTES[state]}</p>
}

/**
 * Full-width weekly citation trend, one line per AI model. Backed by the
 * `citation-trend` endpoint (weekly brand mention rate per engine).
 */
export function CitationTrendCard({ slug }: { slug: string | undefined }): JSX.Element {
  const { data, isLoading, isError } = useInsights(slug)
  const series = data?.series ?? []
  const weeks = data?.weeks ?? []
  const state = trendState({ isLoading, isError }, series.length, weeks.length)

  return (
    <div className="cat-rise mb-3 rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold text-[var(--cat-ink)]">Citations by model</h3>
          <p className="text-[11px] text-[var(--cat-ink-3)]">
            Weekly share of tracked prompts where each model cited your brand
          </p>
        </div>
        {series.length > 0 && <TrendLegend series={series} />}
      </div>
      <TrendBody state={state} series={series} weeks={weeks} />
    </div>
  )
}
