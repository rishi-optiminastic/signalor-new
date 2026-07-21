/** Maps an AI engine name/key to its logo in /public/logos. Returns null when
 * there's no bundled logo (caller falls back to the text label). */
const ENGINE_LOGOS: Record<string, string> = {
  chatgpt: '/logos/chatgpt.svg',
  claude: '/logos/claude.svg',
  copilot: '/logos/copilot.svg',
  gemini: '/logos/gemini.svg',
  google: '/logos/google.svg',
  perplexity: '/logos/perplexity.svg',
  bing: '/logos/bing.svg',
  deepseek: '/logos/deepseek.svg',
  grok: '/logos/grok.svg',
  llama: '/logos/llama.svg',
}

/**
 * Resolves a logo from either an engine key ("llama") or a display label
 * ("Meta Llama") — callers legitimately hold one or the other. Falls back
 * through de-spacing and the last word so labelled variants still match.
 */
export function engineLogo(name: string): string | null {
  const key = name.trim().toLowerCase()
  if (ENGINE_LOGOS[key]) return ENGINE_LOGOS[key]

  const squashed = key.replace(/[^a-z0-9]/g, '')
  if (ENGINE_LOGOS[squashed]) return ENGINE_LOGOS[squashed]

  const lastWord = key.split(/\s+/).pop() ?? ''
  return ENGINE_LOGOS[lastWord] ?? null
}

const ENGINE_LABELS: Record<string, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  copilot: 'Copilot',
  gemini: 'Gemini',
  google: 'Google',
  perplexity: 'Perplexity',
  bing: 'Bing',
  deepseek: 'DeepSeek',
  grok: 'Grok',
  llama: 'Meta Llama',
}

/** Display name for an engine key ("chatgpt" → "ChatGPT"). */
export function engineLabel(engine: string): string {
  const key = engine.trim().toLowerCase()
  return ENGINE_LABELS[key] ?? (engine ? engine.charAt(0).toUpperCase() + engine.slice(1) : engine)
}
