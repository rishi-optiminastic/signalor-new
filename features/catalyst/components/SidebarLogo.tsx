import { PanelLeft, Radio } from 'lucide-react'

import { BRAND } from '@/features/catalyst/constants'

/** Signalor app identity — the top-level brand above the workspace switcher. */
export function SidebarLogo(): JSX.Element {
  return (
    <div className="flex items-center gap-2.5 px-1 pb-0.5">
      <span
        className="grid h-7 w-7 shrink-0 place-items-center rounded-md"
        style={{ background: BRAND }}
      >
        <Radio size={16} strokeWidth={2} className="text-white" />
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-[var(--cat-ink)]">
        Signalor
      </span>
      <button
        type="button"
        aria-label="Collapse sidebar"
        className="ml-auto grid h-7 w-7 place-items-center rounded-md text-[var(--cat-ink-3)] transition-colors hover:bg-[var(--cat-hover)]"
      >
        <PanelLeft size={16} />
      </button>
    </div>
  )
}
