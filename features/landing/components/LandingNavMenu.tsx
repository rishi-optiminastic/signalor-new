'use client'

import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import {
  PricingPanel,
  ProductPanel,
  ResourcesPanel,
} from '@/features/landing/components/MegaPanels'
import { ChevronDown } from '@/lib/icons'

type MenuKey = 'product' | 'pricing' | 'resources'

const CLOSE_DELAY_MS = 140
const EASE = 'cubic-bezier(0.4,0,0.2,1)'
// Tailwind v4: translate/scale are standalone CSS properties, so they must be
// named explicitly for the morph + zoom to animate.
const VIEWPORT_TRANSITION = `width 300ms ${EASE}, height 300ms ${EASE}, opacity 200ms ${EASE}, scale 200ms ${EASE}`

const TRIGGERS: Array<{ label: string; key?: MenuKey; href?: string }> = [
  { label: 'Product', key: 'product' },
  { label: 'Pricing', key: 'pricing' },
  { label: 'Resources', key: 'resources' },
  { label: 'Partnerships', href: '/creators-program' },
  { label: 'Free Tools', href: '/tools' },
]

const PANELS: Array<{ key: MenuKey; node: JSX.Element }> = [
  { key: 'product', node: <ProductPanel /> },
  { key: 'pricing', node: <PricingPanel /> },
  { key: 'resources', node: <ResourcesPanel /> },
]

function Trigger({
  label,
  active,
  onOpen,
}: {
  label: string
  active: boolean
  onOpen: () => void
}): JSX.Element {
  return (
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={active}
      onMouseEnter={onOpen}
      onFocus={onOpen}
      onClick={onOpen}
      className={`inline-flex h-9 items-center gap-1 rounded-lg px-3.5 text-[14px] font-medium transition-colors duration-150 ${active ? 'bg-[#f4f4f5] text-[#171717]' : 'text-[#3f3f46] hover:text-[#171717]'}`}
    >
      {label}
      <ChevronDown
        size={15}
        className={`transition-transform duration-200 ${active ? 'rotate-180 text-[#71717a]' : 'text-[#a1a1aa]'}`}
      />
    </button>
  )
}

function TriggerRow({
  active,
  onOpen,
  onClose,
}: {
  active: MenuKey | null
  onOpen: (k: MenuKey) => void
  onClose: () => void
}): JSX.Element {
  return (
    <div className="flex items-center gap-0.5">
      {TRIGGERS.map(t =>
        t.key ? (
          <Trigger
            key={t.label}
            label={t.label}
            active={active === t.key}
            onOpen={() => onOpen(t.key as MenuKey)}
          />
        ) : (
          <Link
            key={t.label}
            href={t.href ?? '#'}
            onMouseEnter={onClose}
            className="inline-flex h-9 items-center rounded-lg px-3.5 text-[14px] font-medium text-[#3f3f46] transition-colors duration-150 hover:text-[#171717]"
          >
            {t.label}
          </Link>
        ),
      )}
    </div>
  )
}

function panelMotion(index: number, activeIndex: number): string {
  if (index === activeIndex) return 'translate-x-0 opacity-100'
  const slide = index < activeIndex ? '-translate-x-50' : 'translate-x-50'
  return `pointer-events-none ${slide} opacity-0`
}

interface ViewportProps {
  active: MenuKey | null
  lastIndex: number
  dims: { w: number; h: number }
  setRef: (k: MenuKey, el: HTMLDivElement | null) => void
  onEnter: () => void
  onLeave: () => void
  onNavigate: () => void
}

function Viewport(props: ViewportProps): JSX.Element {
  const { active, lastIndex, dims, setRef, onEnter, onLeave, onNavigate } = props
  const activeIndex = active ? PANELS.findIndex(p => p.key === active) : lastIndex
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onNavigate}
      style={{
        width: dims.w || undefined,
        height: dims.h || undefined,
        transition: VIEWPORT_TRANSITION,
      }}
      className={`absolute top-[calc(100%+8px)] left-1/2 z-50 origin-top -translate-x-1/2 overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-4px_rgba(0,0,0,0.07)] ${active ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'}`}
    >
      {PANELS.map((p, i) => (
        <div
          key={p.key}
          ref={el => setRef(p.key, el)}
          className={`absolute top-0 left-0 transition-[translate,opacity] duration-200 ease-in-out ${panelMotion(i, activeIndex)}`}
        >
          {p.node}
        </div>
      ))}
    </div>
  )
}

function useEscapeToClose(active: boolean, close: () => void): void {
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, close])
}

export function LandingNavMenu(): JSX.Element {
  const [active, setActive] = useState<MenuKey | null>(null)
  const [lastIndex, setLastIndex] = useState(0)
  const [dims, setDims] = useState<{ w: number; h: number }>({ w: 0, h: 0 })
  const panels = useRef<Record<MenuKey, HTMLDivElement | null>>({
    product: null,
    pricing: null,
    resources: null,
  })
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useLayoutEffect(() => {
    if (!active) return
    const el = panels.current[active]
    if (el) setDims({ w: el.offsetWidth, h: el.offsetHeight })
  }, [active])

  const open = (k: MenuKey): void => {
    clearTimeout(timer.current)
    setActive(k)
    setLastIndex(PANELS.findIndex(p => p.key === k))
  }
  const scheduleClose = (): void => {
    timer.current = setTimeout(() => setActive(null), CLOSE_DELAY_MS)
  }
  const closeNow = (): void => {
    clearTimeout(timer.current)
    setActive(null)
  }

  useEscapeToClose(active !== null, closeNow)

  return (
    <div className="relative hidden md:block" onMouseLeave={scheduleClose}>
      <TriggerRow active={active} onOpen={open} onClose={scheduleClose} />
      <Viewport
        active={active}
        lastIndex={lastIndex}
        dims={dims}
        setRef={(k, el) => {
          panels.current[k] = el
        }}
        onEnter={() => clearTimeout(timer.current)}
        onLeave={scheduleClose}
        onNavigate={closeNow}
      />
    </div>
  )
}
