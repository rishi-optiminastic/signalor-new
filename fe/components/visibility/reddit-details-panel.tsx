'use client'

import { MessageSquare, ArrowUp, MessageCircle, ExternalLink } from '@fe/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@fe/components/ui/card'
import { BrandDonutChart } from '@fe/components/ui/vis-charts'
import type { RedditDetails } from '@fe/lib/api/visibility'
import { cn } from '@fe/lib/utils'

interface RedditDetailsPanelProps {
  details: RedditDetails
  score: number | null
  /** Dense layout for bento / above-the-fold grids */
  compact?: boolean
  className?: string
}

function scoreTone(s: number) {
  if (s >= 70) return { text: 'text-success' }
  if (s >= 40) return { text: 'text-warning' }
  return { text: 'text-primary' }
}

const SENTIMENT_COLORS = {
  positive: '#22c55e',
  negative: '#ef4444',
  neutral: '#94a3b8',
}

export function RedditDetailsPanel({
  details,
  score,
  compact = false,
  className,
}: RedditDetailsPanelProps) {
  const sentiment = details.sentiment
  const roundedScore = score != null ? Math.round(score) : 0
  const tone = scoreTone(roundedScore)

  const sentimentData = sentiment
    ? [
        { name: 'positive', value: sentiment.positive, fill: SENTIMENT_COLORS.positive },
        { name: 'negative', value: sentiment.negative, fill: SENTIMENT_COLORS.negative },
        { name: 'neutral', value: sentiment.neutral, fill: SENTIMENT_COLORS.neutral },
      ].filter(d => d.value > 0)
    : []

  return (
    <Card className={cn('glass-card border-border', className)} data-tour-card="visibility-reddit">
      <CardHeader className={cn('pb-3', compact && 'pt-4 pb-2')}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-orange-500/10">
              <MessageSquare className="size-3.5 text-orange-600" />
            </div>
            <CardTitle className={cn('tracking-tight', compact ? 'text-sm' : 'text-base')}>
              Reddit
            </CardTitle>
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
        {details.error && (
          <div className="border-warning/30 bg-warning/70 flex items-start gap-2.5 rounded-xl border px-3.5 py-3">
            <span className="text-warning mt-0.5 shrink-0">⚠</span>
            <p className="text-warning text-xs leading-relaxed">{details.error}</p>
          </div>
        )}

        {!details.error && (details.total_mentions ?? 0) === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-7 text-center">
            <div className="bg-muted/30 flex size-10 items-center justify-center rounded-xl">
              <MessageSquare className="text-muted-foreground/40 size-4" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">No Reddit discussions found</p>
            <p className="text-muted-foreground/60 text-[11px]">
              This brand has no Reddit mentions yet
            </p>
          </div>
        ) : (
          <>
            {/* Key metrics row */}
            <div className={cn('grid grid-cols-3 gap-2', compact && 'gap-1.5')}>
              {[
                {
                  label: 'Mentions',
                  value: details.total_mentions ?? 0,
                  icon: <MessageSquare className="size-3.5 text-orange-500" />,
                },
                {
                  label: 'Upvotes',
                  value: details.total_upvotes ?? 0,
                  icon: <ArrowUp className="text-success size-3.5" />,
                },
                {
                  label: 'Comments',
                  value: details.total_comments ?? 0,
                  icon: <MessageCircle className="text-info size-3.5" />,
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

            {/* Sentiment donut + legend */}
            {sentiment && (
              <div
                className={cn(
                  'border-border/60 bg-muted/10 rounded-xl border',
                  compact ? 'p-2.5' : 'p-3.5',
                )}
              >
                <p
                  className={cn(
                    'mb-2 font-semibold tracking-tight',
                    compact ? 'text-xs' : 'text-sm',
                  )}
                >
                  Sentiment
                </p>
                {sentimentData.length > 0 ? (
                  <div className="flex items-center gap-3">
                    <BrandDonutChart
                      data={sentimentData.map(d => ({
                        name: d.name,
                        value: d.value,
                        color: d.fill,
                      }))}
                      size={64}
                      innerRadius={18}
                      outerRadius={28}
                    />
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="bg-success size-2 rounded-full" />
                        <span className="text-muted-foreground">{sentiment.positive} positive</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="bg-destructive size-2 rounded-full" />
                        <span className="text-muted-foreground">{sentiment.negative} negative</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="bg-muted size-2 rounded-full" />
                        <span className="text-muted-foreground">{sentiment.neutral} neutral</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
                    <span className="text-success">+{sentiment.positive} pos</span>
                    <span className="text-destructive">−{sentiment.negative} neg</span>
                    <span>{sentiment.neutral} neutral</span>
                  </div>
                )}
              </div>
            )}

            {/* Subreddits */}
            {details.subreddits && details.subreddits.length > 0 && (
              <div>
                <p
                  className={cn(
                    'mb-2 font-semibold tracking-tight',
                    compact ? 'text-xs' : 'text-sm',
                  )}
                >
                  Subreddits{compact ? '' : ` (${details.subreddits.length})`}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {details.subreddits.slice(0, compact ? 8 : undefined).map(sub => (
                    <span
                      key={sub}
                      className={cn(
                        'text-foreground rounded-lg border border-orange-500/15 bg-orange-500/8 font-medium',
                        compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]',
                      )}
                    >
                      r/{sub}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recent posts */}
            {details.posts && details.posts.length > 0 && (
              <div className="space-y-1.5">
                <p className={cn('font-semibold tracking-tight', compact ? 'text-xs' : 'text-sm')}>
                  Recent
                </p>
                <div
                  className={cn(
                    'space-y-1.5 overflow-y-auto',
                    compact ? 'max-h-[9rem]' : 'max-h-60',
                  )}
                >
                  {details.posts.slice(0, compact ? 4 : 10).map((post, i) => (
                    <a
                      key={i}
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group border-border/40 bg-muted/10 hover:bg-muted/30 hover:border-border/80 flex items-start gap-2 rounded-xl border p-2.5 transition-all"
                    >
                      <ExternalLink className="text-muted-foreground mt-0.5 size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">{post.title}</p>
                        <div className="text-muted-foreground mt-1 flex gap-3 text-[10px]">
                          <span className="font-medium text-orange-600/80">r/{post.subreddit}</span>
                          <span className="flex items-center gap-0.5">
                            <ArrowUp className="size-2.5" /> {post.upvotes}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <MessageCircle className="size-2.5" /> {post.comments}
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
