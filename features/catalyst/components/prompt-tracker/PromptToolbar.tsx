'use client'

interface PromptToolbarProps {
  shown: number
  total: number
}

/** Small row above the stat cards showing how many prompts are in view. The date
 *  filter lives up in the header (next to New prompt). */
export function PromptToolbar({ shown, total }: PromptToolbarProps): JSX.Element {
  return (
    <div className="cat-rise mb-3 text-[12px] font-medium text-[var(--cat-ink-3)]">
      {shown} of {total} prompts
    </div>
  )
}
