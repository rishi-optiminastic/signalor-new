import { AuditHeader } from '@/features/catalyst/components/sitemap/AuditHeader'
import { AuditTable } from '@/features/catalyst/components/sitemap/AuditTable'
import { AuditToolbar } from '@/features/catalyst/components/sitemap/AuditToolbar'
import type { AuditFilter, AuditRow } from '@/features/catalyst/sitemap-data'

interface AuditSectionProps {
  filters: AuditFilter[]
  rows: AuditRow[]
}

export function AuditSection({ filters, rows }: AuditSectionProps): JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <AuditHeader filters={filters} />
      <AuditToolbar />
      <AuditTable rows={rows} />
    </div>
  )
}
