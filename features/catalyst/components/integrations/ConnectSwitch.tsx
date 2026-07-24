'use client'

import { Loader2 } from '@/lib/icons'

interface ConnectSwitchProps {
  /** Live connection state from the server — this component owns no state. */
  checked: boolean
  label: string
  /** Omit for providers with no self-serve flow yet; the switch renders inert. */
  onToggle?: (next: boolean) => void
  busy?: boolean
}

/**
 * Toggle used to connect / disconnect an integration.
 *
 * Controlled on purpose. This was previously `useState(defaultOn)`, which made it
 * lie twice: it captured the connection state on first render (so it never caught
 * up when the async status query resolved, leaving connected integrations showing
 * OFF), and its onClick only flipped that local boolean — connecting nothing.
 */
export function ConnectSwitch({
  checked,
  label,
  onToggle,
  busy = false,
}: ConnectSwitchProps): JSX.Element {
  const interactive = Boolean(onToggle) && !busy
  const action = checked ? 'Disconnect' : 'Connect'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={onToggle ? `${action} ${label}` : `${label} — connect from its own setup flow`}
      disabled={!interactive}
      title={onToggle ? undefined : 'Not available yet'}
      onClick={() => onToggle?.(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-[#e04a3d]' : 'bg-[var(--cat-hover)]'
      } ${interactive ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
    >
      {busy ? (
        <Loader2 className="mx-auto h-3 w-3 animate-spin text-white" />
      ) : (
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-[0_1px_2px_rgba(16,24,40,.2)] transition-transform duration-200 ${
            checked ? 'translate-x-[18px]' : 'translate-x-[2px]'
          }`}
        />
      )}
    </button>
  )
}
