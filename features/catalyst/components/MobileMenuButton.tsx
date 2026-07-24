'use client'

import { ICON_TILE } from '@/features/catalyst/components/control-styles'
import { Menu } from '@/lib/icons'
import { useUiStore } from '@/stores/useUiStore'

/** Hamburger that opens the sidebar drawer — mobile only. */
export function MobileMenuButton(): JSX.Element {
  const setMobileOpen = useUiStore(s => s.setMobileOpen)
  return (
    <button
      type="button"
      aria-label="Open menu"
      onClick={() => setMobileOpen(true)}
      className={`${ICON_TILE} lg:hidden`}
    >
      <Menu size={18} strokeWidth={1.8} />
    </button>
  )
}
