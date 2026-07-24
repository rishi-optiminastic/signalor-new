'use client'

import { ICON_TILE } from '@/features/catalyst/components/control-styles'
import { PanelLeft } from '@/lib/icons'
import { useUiStore } from '@/stores/useUiStore'

/** Collapse/expand the desktop sidebar rail — lives in the top bar (desktop only). */
export function SidebarToggle(): JSX.Element {
  const collapsed = useUiStore(s => s.collapsed)
  const toggle = useUiStore(s => s.toggleCollapsed)
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      className={`${ICON_TILE} max-lg:hidden`}
    >
      <PanelLeft size={18} strokeWidth={1.8} />
    </button>
  )
}
