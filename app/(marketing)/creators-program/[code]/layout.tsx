import type { Metadata } from 'next'

import { buildMetadata } from '@/features/site/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'SignalorAI | Creator Invite',
  description: 'Open this invite link to unlock 10% off SignalorAI with a creator referral.',
  path: '/creators-program',
  noindex: true,
})

export default function CreatorsProgramInviteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
