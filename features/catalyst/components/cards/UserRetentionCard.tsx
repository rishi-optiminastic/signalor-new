'use client'

import { Info } from 'lucide-react'

import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { Heatmap } from '@/features/catalyst/components/Heatmap'
import { Metric } from '@/features/catalyst/components/Metric'
import { useActiveProject } from '@/hooks/useActiveProject'
import { usePrompts } from '@/hooks/usePrompts'

export function UserRetentionCard(): JSX.Element {
  const { slug } = useActiveProject()
  const { data } = usePrompts(slug)

  const prompts = data?.prompts ?? []
  const avg = prompts.length
    ? Math.round(prompts.reduce((a, p) => a + p.score, 0) / prompts.length)
    : 0
  const intensities = prompts.map(p => p.score / 100)

  return (
    <Card>
      <CardHead title="Prompt Coverage" action="Details" />
      <Metric
        value={data ? `${avg}%` : '—'}
        positive
        badge={data ? `${prompts.length} prompts` : '—'}
      />
      <Heatmap intensities={intensities} />
      <div className="grid grid-cols-12 gap-1 text-center text-[10px] text-[var(--cat-ink-3)]">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i}>{i + 1}</span>
        ))}
      </div>
      <div className="mt-3.5 flex items-center gap-2 rounded-md bg-[var(--cat-hover)] px-3 py-2.5 text-xs text-[var(--cat-ink-2)]">
        <Info size={14} className="text-[var(--cat-ink-3)]" />
        Per-prompt visibility across tracked prompts.
      </div>
    </Card>
  )
}
