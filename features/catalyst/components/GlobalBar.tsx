import { Bell, HelpCircle, LifeBuoy } from 'lucide-react'
import Link from 'next/link'

import { GlobalSearch } from '@/features/catalyst/components/GlobalSearch'
import { MobileMenuButton } from '@/features/catalyst/components/MobileMenuButton'
import { SidebarToggle } from '@/features/catalyst/components/SidebarToggle'
import { ThemeToggleButton } from '@/features/catalyst/components/ThemeToggleButton'
import { TopbarUser } from '@/features/catalyst/components/TopbarUser'

const ICON_BTN =
  'relative grid h-[34px] w-[34px] shrink-0 place-items-center rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] text-[var(--cat-ink-2)] transition-colors hover:bg-[var(--cat-hover)] hover:text-[var(--cat-ink)]'

/** App-level top bar shown on every page: universal ⌘K search + quick actions. */
export function GlobalBar(): JSX.Element {
  return (
    <div className="cat-rise relative z-40 flex shrink-0 items-center gap-3 border-b border-[var(--cat-border)] pb-3">
      <MobileMenuButton />
      <SidebarToggle />
      <GlobalSearch />
      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggleButton />
        <Link href="#" aria-label="Support" className={ICON_BTN}>
          <LifeBuoy size={17} strokeWidth={1.8} />
        </Link>
        <Link href="#" aria-label="Help & docs" className={ICON_BTN}>
          <HelpCircle size={17} strokeWidth={1.8} />
        </Link>
        <button type="button" aria-label="Notifications" className={ICON_BTN}>
          <Bell size={17} strokeWidth={1.8} />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#e04a3d] ring-2 ring-[var(--cat-card)]" />
        </button>
        <span className="mx-1 h-5 w-px bg-[var(--cat-border)]" />
        <TopbarUser />
      </div>
    </div>
  )
}
