'use client'

import { Calendar, Check, ChevronDown, Loader2, RotateCw, SlidersHorizontal } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState, type ReactNode } from 'react'

import { CONTROL_CHIP, CONTROL_RING } from '@/features/catalyst/components/control-styles'
import { EngineLogo } from '@/features/catalyst/components/EngineLogo'
import { PrimaryButton } from '@/features/catalyst/components/PrimaryButton'
import { engineLogo } from '@/features/catalyst/engine-logos'
import { useActiveProject } from '@/hooks/useActiveProject'
import { useNewAnalysis } from '@/hooks/useNewAnalysis'

const PANEL = `absolute right-0 z-50 mt-2 min-w-[190px] rounded-md bg-[var(--cat-card)] p-1 shadow-lg ${CONTROL_RING}`

/** Lightweight dropdown: a trigger + a click-away backdrop + a panel. */
function Dropdown({
  trigger,
  children,
}: {
  trigger: (toggle: () => void) => ReactNode
  children: (close: () => void) => ReactNode
}): JSX.Element {
  const [open, setOpen] = useState(false)
  return (
    // shrink-0: without it this wrapper collapses under a crowded bar and the
    // chip inside is squeezed regardless of its own shrink-0.
    <div className="relative shrink-0">
      {trigger(() => setOpen(o => !o))}
      {open && (
        <>
          <button
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className={PANEL}>{children(() => setOpen(false))}</div>
        </>
      )}
    </div>
  )
}

function MenuItem({
  active,
  onClick,
  children,
}: {
  active?: boolean
  onClick: () => void
  children: ReactNode
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-sm px-2.5 py-1.5 text-left text-[13px] text-[var(--cat-ink)] transition-colors hover:bg-[var(--cat-hover)]"
    >
      <Check size={13} className={active ? 'text-[#e04a3d]' : 'opacity-0'} />
      {children}
    </button>
  )
}

interface SelectChipProps {
  icon: LucideIcon
  options: string[]
  value: string
  onChange: (v: string) => void
  /** Show each engine's logo (Topbar engine filter). */
  withLogos?: boolean
}

/** Leading glyph for a labelled option — the engine logo when available. */
function OptionGlyph({
  name,
  size,
  withLogos,
}: {
  name: string
  size: number
  withLogos: boolean
}): JSX.Element | null {
  if (withLogos && engineLogo(name)) return <EngineLogo name={name} size={size} />
  return null
}

function SelectChip({
  icon: Icon,
  options,
  value,
  onChange,
  withLogos = false,
}: SelectChipProps): JSX.Element {
  const trigger = (toggle: () => void): JSX.Element => (
    <button type="button" className={CONTROL_CHIP} onClick={toggle}>
      {withLogos && engineLogo(value) ? (
        <EngineLogo name={value} size={18} />
      ) : (
        <Icon size={16} className="text-[var(--cat-ink-2)]" />
      )}{' '}
      {value}
      <ChevronDown size={15} className="text-[var(--cat-ink-3)]" />
    </button>
  )
  return (
    <Dropdown trigger={trigger}>
      {close =>
        options.map(opt => (
          <MenuItem
            key={opt}
            active={opt === value}
            onClick={() => {
              onChange(opt)
              close()
            }}
          >
            <span className="flex items-center gap-2">
              <OptionGlyph name={opt} size={16} withLogos={withLogos} />
              {opt}
            </span>
          </MenuItem>
        ))
      }
    </Dropdown>
  )
}

const RANGES = ['Last 7 days', 'Last month', 'Last 3 months', 'Last year']
const FILTERS = ['All engines', 'ChatGPT', 'Claude', 'Gemini', 'Google', 'Perplexity']

function ReAnalyzeButton(): JSX.Element {
  const { email, activeOrg } = useActiveProject()
  const { trigger, isRunning } = useNewAnalysis()

  return (
    <PrimaryButton
      icon={isRunning ? undefined : RotateCw}
      disabled={!email || !activeOrg || isRunning}
      onClick={trigger}
    >
      {isRunning && <Loader2 size={16} className="animate-spin" />}
      {isRunning ? 'Analyzing…' : 'Re-analyze'}
    </PrimaryButton>
  )
}

/**
 * Overview toolbar: date range, engine filter and Re-analyze. Sits on the
 * greeting row in the content flow (not the global top bar), so the controls
 * have room and no longer need to be hidden on smaller widths.
 */
export function OverviewActions(): JSX.Element {
  const [range, setRange] = useState('Last month')
  const [filter, setFilter] = useState('All engines')

  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
      <SelectChip icon={Calendar} options={RANGES} value={range} onChange={setRange} />
      <SelectChip
        icon={SlidersHorizontal}
        options={FILTERS}
        value={filter}
        onChange={setFilter}
        withLogos
      />
      <ReAnalyzeButton />
    </div>
  )
}
