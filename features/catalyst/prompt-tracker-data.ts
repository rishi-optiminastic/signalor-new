/** A source cited in an engine's answer. */
export interface Citation {
  url: string
  domain: string
  isBrand: boolean
  isCompetitor: boolean
}

/** One engine's answer, adapted for the expandable result panel. */
export interface PromptEngineResult {
  id: number
  /** Raw engine key (chatgpt, gemini, …) — feeds the logo lookup. */
  engine: string
  engineLabel: string
  mentioned: boolean
  /** positive | neutral | negative | '' when unknown. */
  sentiment: string
  position: number | null
  snippet: string
  checkedAt: string
  citations: Citation[]
  /** True when the brand's own domain was cited as a source (real citation, not
   *  just a name-mention). Drives the "Cited" state. */
  brandCited: boolean
}

/** UI shape a PromptRow renders — adapted from the API by `usePrompts`. */
export interface TrackedPrompt {
  id: number
  prompt: string
  /** True when the user added it (vs auto-generated during onboarding). */
  isCustom: boolean
  intent: string
  promptType: string
  score: number
  /** Share of runs that mentioned the brand, 0-100. */
  visibility: number
  avgPosition: number | null
  cited: boolean
  mentions: number
  runs: number
  results: PromptEngineResult[]
}
