'use client'

import { useQuery } from '@tanstack/react-query'

import type { DashStatData } from '@/features/catalyst/components/dash/DashStat'
import type { TrackedPrompt } from '@/features/catalyst/prompt-tracker-data'
import { getPrompts, type PromptTrack } from '@/lib/api/analyzer'
import { queryKeys } from '@/lib/query-keys'

const ENGINE_LABELS: Record<string, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  google: 'Google',
  perplexity: 'Perplexity',
  bing: 'Bing',
}

function engineLabel(engine: string): string {
  return ENGINE_LABELS[engine] ?? engine.charAt(0).toUpperCase() + engine.slice(1)
}

function enginesOf(prompt: PromptTrack): string[] {
  const seen = new Set<string>()
  for (const result of prompt.results) {
    if (result.engine) seen.add(engineLabel(result.engine))
  }
  return [...seen]
}

function toTracked(prompt: PromptTrack): TrackedPrompt {
  return {
    id: prompt.id,
    prompt: prompt.prompt_text,
    score: Math.round(prompt.score ?? 0),
    cited: (prompt.mentions ?? 0) > 0,
    engines: enginesOf(prompt),
    runs: prompt.total_runs ?? 0,
    // No historical series yet — trend stays flat until repeat runs exist.
    trend: 'flat',
  }
}

function buildStats(prompts: TrackedPrompt[], raw: PromptTrack[]): DashStatData[] {
  const count = prompts.length || 1
  const avgScore = Math.round(prompts.reduce((a, p) => a + p.score, 0) / count)
  const avgVis = Math.round(raw.reduce((a, p) => a + (p.visibility_pct ?? 0), 0) / count)
  const strong = prompts.filter(p => p.score >= 70).length
  const totalRuns = prompts.reduce((a, p) => a + p.runs, 0)
  return [
    { label: 'Avg score', value: String(avgScore) },
    { label: 'Visibility', value: `${avgVis}%` },
    { label: 'Strong prompts', value: `${strong} / ${prompts.length}` },
    { label: 'Total runs', value: String(totalRuns) },
  ]
}

export interface PromptTrackerData {
  prompts: TrackedPrompt[]
  stats: DashStatData[]
}

interface UsePromptsResult {
  data: PromptTrackerData | undefined
  isLoading: boolean
  isError: boolean
}

/** Fetches tracked prompts for a run slug and derives the header stat row. */
export function usePrompts(slug: string | undefined): UsePromptsResult {
  const query = useQuery({
    queryKey: queryKeys.catalyst.prompts(slug ?? ''),
    enabled: Boolean(slug),
    queryFn: async (): Promise<PromptTrackerData> => {
      const raw = await getPrompts(slug as string)
      const prompts = raw.map(toTracked)
      return { prompts, stats: buildStats(prompts, raw) }
    },
  })
  return { data: query.data, isLoading: query.isLoading, isError: query.isError }
}
