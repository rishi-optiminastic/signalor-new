'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useLayoutEffect, useRef, useState } from 'react'

import {
  PricingPanel,
  ProductPanel,
  ResourcesPanel,
} from '@/features/landing/components/MegaPanels'

type MenuKey = 'product' | 'pricing' | 'resources'

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
      onMouseEnter={onOpen}
      onFocus={onOpen}
      className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-[14px] font-medium transition-colors ${active ? 'bg-[#f4f4f5] text-[#171717]' : 'text-[#3f3f46] hover:text-[#171717]'}`}
    >
      {label}
      <ChevronDown
        size={15}
        className={`text-[#a1a1aa] transition-transform duration-200 ${active ? 'rotate-180' : ''}`}
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
            className="rounded-md px-3 py-2 text-[14px] font-medium text-[#3f3f46] transition-colors hover:text-[#171717]"
          >
            {t.label}
          </Link>
        ),
      )}
    </div>
  )
}

interface ViewportProps {
  active: MenuKey | null
  dims: { w: number; h: number }
  setRef: (k: MenuKey, el: HTMLDivElement | null) => void
  onEnter: () => void
  onClose: () => void
}

function Viewport({ active, dims, setRef, onEnter, onClose }: ViewportProps): JSX.Element {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onClose}
      style={{ width: dims.w || undefined, height: dims.h || undefined }}
      className={`absolute top-[calc(100%+10px)] left-1/2 z-50 -translate-x-1/2 overflow-hidden rounded-md border border-[#ececec] bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.28)] transition-[width,height,opacity,transform] duration-300 ease-out ${active ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0'}`}
    >
      {PANELS.map(p => (
        <div
          key={p.key}
          ref={el => setRef(p.key, el)}
          className={`absolute top-0 left-0 transition-opacity duration-200 ${active === p.key ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        >
          {p.node}
        </div>
      ))}
    </div>
  )
}

export function LandingNavMenu(): JSX.Element {
  const [active, setActive] = useState<MenuKey | null>(null)
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
  }
  const close = (): void => {
    timer.current = setTimeout(() => setActive(null), 120)
  }

  return (
    <div className="relative hidden md:block" onMouseLeave={close}>
      <TriggerRow active={active} onOpen={open} onClose={close} />
      <Viewport
        active={active}
        dims={dims}
        setRef={(k, el) => {
          panels.current[k] = el
        }}
        onEnter={() => clearTimeout(timer.current)}
        onClose={close}
      />
    </div>
  )
}
