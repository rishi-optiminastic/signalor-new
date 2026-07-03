import { XCircle } from 'lucide-react'

import { PLATFORM_REACH } from '@/features/catalyst/visibility-data'

export function PlatformReach(): JSX.Element {
  return (
    <div>
      <div className="mb-3 text-[12px] font-semibold tracking-wide text-[var(--cat-ink-3)] uppercase">
        Platform Reach
      </div>
      <div className="flex flex-col">
        {PLATFORM_REACH.map(platform => (
          <div key={platform.name} className="flex items-center gap-2.5 py-[7px] text-[13px]">
            <platform.icon size={16} className="text-[var(--cat-ink-2)]" />
            <span className="text-[var(--cat-ink)]">{platform.name}</span>
            <XCircle size={15} className="ml-auto text-[var(--cat-ink-3)]" />
          </div>
        ))}
      </div>
    </div>
  )
}
