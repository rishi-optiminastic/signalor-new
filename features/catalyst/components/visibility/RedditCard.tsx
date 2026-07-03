import { MessageSquare } from 'lucide-react'

import { AnalysisHeader } from '@/features/catalyst/components/visibility/AnalysisHeader'
import { REDDIT } from '@/features/catalyst/visibility-data'

export function RedditCard(): JSX.Element {
  return (
    <div className="cat-rise rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] p-4">
      <AnalysisHeader icon={MessageSquare} name="Reddit" score={REDDIT.score} badge={false} />
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--cat-hover)]">
          <MessageSquare size={18} className="text-[var(--cat-ink-3)]" />
        </span>
        <span className="text-[13px] text-[var(--cat-ink-3)]">No Reddit discussions found</span>
      </div>
    </div>
  )
}
