/** Maps an AI engine name/key to its logo in /public/logos. Returns null when
 * there's no bundled logo (caller falls back to the text label). */
const ENGINE_LOGOS: Record<string, string> = {
  chatgpt: '/logos/chatgpt.svg',
  claude: '/logos/claude.svg',
  gemini: '/logos/gemini.svg',
  google: '/logos/google.svg',
  perplexity: '/logos/perplexity.svg',
}

export function engineLogo(name: string): string | null {
  return ENGINE_LOGOS[name.toLowerCase()] ?? null
}
