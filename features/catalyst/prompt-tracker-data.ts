export type Trend = 'up' | 'down' | 'flat'

/** UI shape a PromptRow renders — adapted from the API by `usePrompts`. */
export interface TrackedPrompt {
  id: number
  prompt: string
  score: number
  cited: boolean
  engines: string[]
  runs: number
  trend: Trend
}
