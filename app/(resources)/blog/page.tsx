import { MarketingShell } from '@/features/landing/components/MarketingShell'

import { BlogListing } from '@/features/site/components/blog/blog-listing'
import { client } from '@/features/site/sanity/lib/client'
import { ALL_POSTS_QUERY, type SanityBlogPost } from '@/features/site/sanity/lib/queries'

export const revalidate = 60

export default async function BlogPage() {
  const posts = await client
    .fetch<SanityBlogPost[]>(ALL_POSTS_QUERY)
    .catch(() => [] as SanityBlogPost[])

  return (
    <MarketingShell>
      <BlogListing posts={posts} />
    </MarketingShell>
  )
}
