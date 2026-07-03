import { AuditSection } from '@/features/catalyst/components/sitemap/AuditSection'
import { SitemapTabs } from '@/features/catalyst/components/sitemap/SitemapTabs'
import { SitemapUrlBar } from '@/features/catalyst/components/sitemap/SitemapUrlBar'
import { VitalsRow } from '@/features/catalyst/components/sitemap/VitalsRow'

export function SitemapView(): JSX.Element {
  return (
    <>
      <SitemapTabs />
      <div className="mt-3 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-0.5">
        <SitemapUrlBar />
        <VitalsRow />
        <AuditSection />
      </div>
    </>
  )
}
