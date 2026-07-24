import Link from 'next/link'

import { ConnectSwitch } from '@/features/catalyst/components/integrations/ConnectSwitch'
import type { IntegrationWithStatus } from '@/features/catalyst/integrations-data'
import { Settings2 } from '@/lib/icons'

interface IntegrationCardProps {
  item: IntegrationWithStatus
  /** Omitted for providers with no self-serve flow — the switch renders inert. */
  onToggle?: (next: boolean) => void
  busy?: boolean
  /** When connected, where the manage gear links (e.g. GA property selection). */
  manageHref?: string
}

function CardActions({ item, onToggle, busy, manageHref }: IntegrationCardProps): JSX.Element {
  return (
    <div className="flex items-center gap-1">
      {item.connected && manageHref && (
        <Link
          href={manageHref}
          aria-label={`Manage ${item.name}`}
          title={`Manage ${item.name}`}
          className="grid h-7 w-7 place-items-center rounded-md text-[var(--cat-ink-3)] transition-colors hover:bg-[var(--cat-hover)] hover:text-[var(--cat-ink)]"
        >
          <Settings2 size={15} strokeWidth={2} />
        </Link>
      )}
      <ConnectSwitch checked={item.connected} label={item.name} onToggle={onToggle} busy={busy} />
    </div>
  )
}

export function IntegrationCard(props: IntegrationCardProps): JSX.Element {
  const { item } = props
  const { connected, accent } = item
  return (
    <div
      className={`group relative flex flex-col rounded-md border bg-[var(--cat-card)] p-3.5 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_4px_14px_rgba(16,24,40,.07)] ${
        connected
          ? 'border-[rgba(47,190,126,0.4)] bg-[rgba(47,190,126,0.035)]'
          : 'border-[var(--cat-border)]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-md"
          style={{ background: `${accent}14` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.logo} alt="" className="h-5 w-5 object-contain" />
        </span>
        <CardActions {...props} />
      </div>

      <p className="mt-3 text-[13.5px] font-semibold text-[var(--cat-ink)]">{item.name}</p>
      <p className="mt-1 text-[12px] leading-snug text-[var(--cat-ink-2)]">{item.description}</p>
    </div>
  )
}
