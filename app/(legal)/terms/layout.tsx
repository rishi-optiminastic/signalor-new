import type { Metadata } from 'next'

import { JsonLd } from '@/features/site/components/seo/json-ld'
import { breadcrumbJsonLd, buildMetadata } from '@/features/site/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Terms and conditions',
  description:
    'The terms of service governing the use of SignalorAI, including subscription, acceptable use, and liability terms.',
  path: '/terms',
})

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        id="ld-terms-breadcrumb"
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Terms and conditions', path: '/terms' },
        ])}
      />
      {children}
    </>
  )
}
