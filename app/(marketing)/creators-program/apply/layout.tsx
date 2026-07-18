import type { Metadata } from 'next'

import { JsonLd } from '@/features/site/components/seo/json-ld'
import { breadcrumbJsonLd, buildMetadata } from '@/features/site/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Apply to the SignalorAI Creators Program',
  description:
    'Get your SignalorAI creator link in 30 seconds. Auto-approved, 20% commission on every first paid subscription, monthly payouts.',
  path: '/creators-program/apply',
  // Auth-gated form (guests are redirected to /creator/sign-up) — keep it out of the index.
  noindex: true,
})

export default function CreatorsProgramApplyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        id="ld-creators-program-apply-breadcrumb"
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Creators Program', path: '/creators-program' },
          { name: 'Apply', path: '/creators-program/apply' },
        ])}
      />
      {children}
    </>
  )
}
