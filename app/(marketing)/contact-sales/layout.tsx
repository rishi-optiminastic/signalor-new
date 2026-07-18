import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { JsonLd } from '@/features/site/components/seo/json-ld'
import { CONTACT_SALES_FAQ } from '@/features/site/lib/landing-contact-content'
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from '@/features/site/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Contact Sales',
  description:
    'Talk to the SignalorAI team about Enterprise GEO, agency plans, and custom AI visibility rollouts.',
  path: '/contact-sales',
})

export default function ContactSalesLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <>
      <JsonLd
        id="ld-contact-sales-breadcrumb"
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Contact sales', path: '/contact-sales' },
        ])}
      />
      <JsonLd id="ld-contact-sales-faq" data={faqJsonLd([...CONTACT_SALES_FAQ])} />
      {children}
    </>
  )
}
