import { CheckCircle2, XCircle } from 'lucide-react'

const GREEN = '#17A673'

interface VisChipProps {
  label: string
  count?: number
  state?: 'on' | 'off' | 'plain'
}

/** Small pill — flags (on/off with icon) or a labelled count chip (plain). */
export function VisChip({ label, count, state = 'plain' }: VisChipProps): JSX.Element {
  const on = state === 'on'
  const off = state === 'off'
  const style = on
    ? { color: GREEN, borderColor: 'rgba(23,166,115,.35)' }
    : { color: 'var(--cat-ink-2)', borderColor: 'var(--cat-border)' }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium"
      style={style}
    >
      {on && <CheckCircle2 size={13} />}
      {off && <XCircle size={13} className="text-[var(--cat-ink-3)]" />}
      {label}
      {count !== undefined && <span className="text-[var(--cat-ink-3)]">{count}</span>}
    </span>
  )
}
