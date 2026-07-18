import type { Metadata } from 'next'

import { buildMetadata } from '@/features/site/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Payments',
  description: 'SignalorAI checkout and billing pages.',
  noindex: true,
})

export default function PaymentsLayout({ children }: { children: React.ReactNode }) {
  return children
}
