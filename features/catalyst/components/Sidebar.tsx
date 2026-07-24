'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { SidebarContent } from '@/features/catalyst/components/SidebarContent'
import { useUiStore } from '@/stores/useUiStore'

// Subtly tinted panel so the active nav item's white card lifts off it (the
// reference look). Uses surface tokens, so it inverts correctly in dark mode.
const BASE =
  'flex-none flex-col overflow-hidden rounded-md border border-[var(--cat-border)] bg-[var(--cat-hover)] p-3 shadow-[0_1px_2px_rgba(16,24,40,.05)]'

export function Sidebar(): JSX.Element {
  const collapsed = useUiStore(s => s.collapsed)
  const mobileOpen = useUiStore(s => s.mobileOpen)
  const setMobileOpen = useUiStore(s => s.setMobileOpen)
  const pathname = usePathname()

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname, setMobileOpen])

  return (
    <>
      <aside
        className={`hidden transition-[width] duration-200 lg:flex ${BASE} ${collapsed ? 'w-[68px]' : 'w-[240px]'}`}
      >
        <SidebarContent collapsed={collapsed} />
      </aside>

      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />
          <aside
            className={`fixed inset-y-2 left-2 z-50 flex w-[248px] shadow-xl lg:hidden ${BASE}`}
          >
            <SidebarContent collapsed={false} onClose={() => setMobileOpen(false)} />
          </aside>
        </>
      )}
    </>
  )
}
