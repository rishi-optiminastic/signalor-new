'use client'

import { CheckCircle2, XCircle, Search, TrendingUp } from '@fe/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@fe/components/ui/card'
import { HorizontalScoreBar } from '@fe/components/ui/vis-charts'
import type { GoogleDetails } from '@fe/lib/api/visibility'
import { cn } from '@fe/lib/utils'

interface GoogleDetailsPanelProps {
  details: GoogleDetails
  score: number | null
  /** Dense layout for bento / above-the-fold grids */
  compact?: boolean
}

const METHOD_LABELS: Record<string, { label: string; color: string }> = {
  google_cse_api: {
    label: 'Google API',
    color: 'text-success bg-success/10 border-success/20',
  },
  googlesearch_scraper: {
    label: 'Web Scraper',
    color: 'text-warning bg-warning/10 border-warning/20',
  },
  llm_analysis: { label: 'AI Analysis', color: 'text-teal-600 bg-teal-500/10 border-teal-500/20' },
  llm_estimate: { label: 'AI Estimate', color: 'text-teal-600 bg-teal-500/10 border-teal-500/20' },
}

function scoreTone(s: number) {
  if (s >= 70) return { text: 'text-success' }
  if (s >= 40) return { text: 'text-warning' }
  return { text: 'text-primary' }
}

export function GoogleDetailsPanel({ details, score, compact = false }: GoogleDetailsPanelProps) {
  const method = details.method ? METHOD_LABELS[details.method] : null
  const roundedScore = score != null ? Math.round(score) : 0
  const tone = scoreTone(roundedScore)

  return (
    <Card className="glass-card border-border" data-tour-card="visibility-google">
      <CardHeader className={cn('pb-3', compact && 'pt-4 pb-2')}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="bg-destructive/10 flex size-7 items-center justify-center rounded-lg">
              <Search className="text-destructive size-3.5" />
            </div>
            <CardTitle className={cn('tracking-tight', compact ? 'text-sm' : 'text-base')}>
              Google
            </CardTitle>
            {method && (
              <span
                className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-medium ${method.color}`}
              >
                {method.label}
              </span>
            )}
          </div>
          <span
            className={cn(
              'shrink-0 font-mono font-bold tabular-nums',
              compact ? 'text-base' : 'text-lg',
              tone.text,
            )}
          >
            {score != null ? roundedScore : ','}
            <span className="text-muted-foreground font-sans text-xs font-normal">/100</span>
          </span>
        </div>
      </CardHeader>
      <CardContent className={cn('space-y-4', compact && 'space-y-3 pt-0 pb-4')}>
        {details.error && <p className="text-destructive text-sm">{details.error}</p>}

        {/* Key metrics row */}
        <div className={cn('grid grid-cols-3 gap-2', compact && 'gap-1.5')}>
          {[
            {
              label: 'Brand rank',
              value: details.brand_rank_position != null ? `#${details.brand_rank_position}` : ',',
              icon: <TrendingUp className="text-success size-3.5" />,
            },
            {
              label: 'Indexed',
              value: formatNumber(details.site_index_estimate ?? 0),
              icon: <Search className="text-info size-3.5" />,
            },
            {
              label: 'In SERP',
              value: `${details.brand_results_count ?? 0}/${details.total_results_checked ?? 10}`,
              icon: <CheckCircle2 className="text-warning size-3.5" />,
            },
          ].map(metric => (
            <div
              key={metric.label}
              className={cn(
                'border-border/60 bg-muted/20 hover:bg-muted/40 rounded-xl border text-center transition-colors',
                compact ? 'px-2 py-2.5' : 'px-3 py-3',
              )}
            >
              <div className="mb-1 flex justify-center">{metric.icon}</div>
              <p
                className={cn(
                  'font-bold tracking-tight tabular-nums',
                  compact ? 'text-lg' : 'text-xl',
                )}
              >
                {metric.value}
              </p>
              <p className="text-muted-foreground mt-0.5 text-[10px] font-medium tracking-wider uppercase">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        {/* Knowledge Panel & AI Overview badges */}
        {(details.has_knowledge_panel !== undefined || details.in_ai_overview !== undefined) && (
          <div className={cn('flex flex-wrap gap-1.5', compact && 'gap-1')}>
            {details.has_knowledge_panel !== undefined && (
              <div
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border transition-colors',
                  compact ? 'px-2.5 py-1 text-[11px]' : 'gap-1.5 px-3 py-1.5 text-xs',
                  details.has_knowledge_panel
                    ? 'border-success/25 bg-success/8 text-success'
                    : 'border-border/60 bg-muted/20 text-muted-foreground',
                )}
              >
                {details.has_knowledge_panel ? (
                  <CheckCircle2 className="size-3.5 shrink-0" />
                ) : (
                  <XCircle className="size-3.5 shrink-0 opacity-50" />
                )}
                <span className="font-medium">{compact ? 'Knowledge' : 'Knowledge Panel'}</span>
              </div>
            )}
            {details.in_ai_overview !== undefined && (
              <div
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border transition-colors',
                  compact ? 'px-2.5 py-1 text-[11px]' : 'gap-1.5 px-3 py-1.5 text-xs',
                  details.in_ai_overview
                    ? 'border-teal-500/25 bg-teal-500/8 text-teal-700'
                    : 'border-border/60 bg-muted/20 text-muted-foreground',
                )}
              >
                {details.in_ai_overview ? (
                  <CheckCircle2 className="size-3.5 shrink-0" />
                ) : (
                  <XCircle className="size-3.5 shrink-0 opacity-50" />
                )}
                <span className="font-medium">AI Overview</span>
              </div>
            )}
          </div>
        )}

        {/* Sub-scores breakdown with styled bars */}
        {details.sub_scores && (
          <div className="space-y-2.5">
            <p className={cn('font-semibold tracking-tight', compact ? 'text-xs' : 'text-sm')}>
              Breakdown
            </p>
            <div className="space-y-2">
              {Object.entries(details.sub_scores).map(([key, value]) => (
                <HorizontalScoreBar key={key} label={key} value={value} compact={compact} />
              ))}
            </div>
          </div>
        )}

        {/* Reasoning (LLM method) */}
        {!compact && details.reasoning && (
          <div className="bg-muted/20 border-border/50 rounded-xl border p-3.5">
            <p className="text-muted-foreground text-xs leading-relaxed">{details.reasoning}</p>
          </div>
        )}

        {/* Top Search Results */}
        {!compact && details.brand_search_results && details.brand_search_results.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold tracking-tight">Top Search Results</p>
            <div className="max-h-72 space-y-1.5 overflow-y-auto">
              {details.brand_search_results.map((r, i) => (
                <div
                  key={i}
                  className={cn(
                    'rounded-xl border p-2.5 text-xs transition-colors',
                    r.is_brand
                      ? 'bg-success/6 border-success/20 hover:bg-success/10'
                      : 'bg-muted/15 border-border/40 hover:bg-muted/30',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-5 shrink-0 font-mono text-[10px]">
                      #{r.position}
                    </span>
                    <div className="min-w-0 flex-1">
                      {r.title ? <p className="truncate font-medium">{r.title}</p> : null}
                      <p className="text-muted-foreground truncate text-[10px]">{r.url}</p>
                      {r.snippet ? (
                        <p className="text-muted-foreground/70 mt-0.5 line-clamp-2">{r.snippet}</p>
                      ) : null}
                    </div>
                    {r.is_brand && (
                      <span className="text-success bg-success/10 border-success/20 shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                        Brand
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatNumber(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(0)}k`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}
