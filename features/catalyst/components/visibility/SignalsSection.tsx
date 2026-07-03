import { TrendingUp } from 'lucide-react'

import { MentionSplit } from '@/features/catalyst/components/visibility/MentionSplit'
import { PlatformReach } from '@/features/catalyst/components/visibility/PlatformReach'
import { ShareOfVoice } from '@/features/catalyst/components/visibility/ShareOfVoice'
import { BRAND, BRAND_SOFT, BRAND_STRONG } from '@/features/catalyst/constants'
import { SIGNALS_META } from '@/features/catalyst/visibility-data'

export function SignalsSection(): JSX.Element {
  return (
    <div className="cat-rise rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-[var(--cat-ink-2)] uppercase">
          <TrendingUp size={15} style={{ color: BRAND }} /> AI Engine &amp; Platform Signals
        </span>
        <span className="flex items-center gap-2 text-[12px] text-[var(--cat-ink-3)]">
          {SIGNALS_META.prompts}
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={{ background: BRAND_SOFT, color: BRAND_STRONG }}
          >
            {SIGNALS_META.avgSov}
          </span>
        </span>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <ShareOfVoice />
        <div className="lg:border-l lg:border-[var(--cat-border-soft)] lg:pl-6">
          <MentionSplit />
        </div>
        <div className="lg:border-l lg:border-[var(--cat-border-soft)] lg:pl-6">
          <PlatformReach />
        </div>
      </div>
    </div>
  )
}
