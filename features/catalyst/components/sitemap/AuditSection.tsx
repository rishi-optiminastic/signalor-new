import { AuditHeader } from '@/features/catalyst/components/sitemap/AuditHeader'
import { AuditTable } from '@/features/catalyst/components/sitemap/AuditTable'
import { AuditToolbar } from '@/features/catalyst/components/sitemap/AuditToolbar'

export function AuditSection(): JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <AuditHeader />
      <AuditToolbar />
      <AuditTable />
    </div>
  )
}
