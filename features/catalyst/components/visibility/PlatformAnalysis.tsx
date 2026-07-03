import { Activity } from 'lucide-react'

import { GoogleCard } from '@/features/catalyst/components/visibility/GoogleCard'
import { RedditCard } from '@/features/catalyst/components/visibility/RedditCard'
import { WebCard } from '@/features/catalyst/components/visibility/WebCard'

export function PlatformAnalysis(): JSX.Element {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold tracking-wide text-[var(--cat-ink-3)] uppercase">
        <Activity size={15} /> Platform Analysis
      </div>
      <div className="grid grid-cols-1 items-start gap-2 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <GoogleCard />
          <RedditCard />
        </div>
        <WebCard />
      </div>
    </div>
  )
}
