'use client'

import { useMemo, useState } from 'react'

import { BlogPostCard } from '@/features/site/components/blog/blog-post-card'
import { FeaturedBlogCard } from '@/features/site/components/blog/featured-blog-card'
import { BLOG_CATEGORIES, type BlogCategory } from '@/features/site/lib/landing-blog-content'
import { cn } from '@/features/site/lib/utils'
import type { SanityBlogPost } from '@/features/site/sanity/lib/queries'

const ALL_FILTER = 'All' as const
type Filter = typeof ALL_FILTER | BlogCategory

const FILTERS: Filter[] = [ALL_FILTER, ...BLOG_CATEGORIES]
const FEATURED_COUNT = 2

interface BlogListingProps {
  posts: SanityBlogPost[]
}

export function BlogListing({ posts }: BlogListingProps): React.ReactElement {
  const [active, setActive] = useState<Filter>(ALL_FILTER)

  const filtered = useMemo(
    () => (active === ALL_FILTER ? posts : posts.filter(p => p.category === active)),
    [posts, active],
  )

  const featured = filtered.slice(0, FEATURED_COUNT)
  const rest = filtered.slice(FEATURED_COUNT)

  return (
    <section className="bg-background px-6 pt-20 pb-24 lg:px-8 lg:pt-28">
      <div className="mx-auto max-w-6xl">
        {/* ─── Header ────────────────────────────────────────────────── */}
        <p className="text-muted-foreground text-sm">Blog</p>
        <h1 className="text-foreground/80 mt-3 max-w-2xl text-4xl leading-[1.1] font-medium tracking-tight sm:text-5xl">
          News, insights and more from <span className="text-foreground font-bold">SignalorAI</span>
        </h1>

        {/* ─── Category filters ──────────────────────────────────────── */}
        <div className="mt-10 flex flex-wrap items-center gap-1.5">
          {FILTERS.map(filter => {
            const isActive = filter === active
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActive(filter)}
                aria-pressed={isActive}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition',
                  isActive
                    ? 'text-foreground border border-black/10 bg-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {filter}
              </button>
            )
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-20 text-center">
            <p className="text-foreground text-2xl font-bold tracking-tight">No posts yet</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Check back soon, posts will appear here once published.
            </p>
          </div>
        ) : (
          <>
            {/* ─── Featured ────────────────────────────────────────── */}
            {featured.length > 0 && (
              <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
                {featured.map(post => (
                  <FeaturedBlogCard key={post.slug} post={post} />
                ))}
              </div>
            )}

            {/* ─── More articles ───────────────────────────────────── */}
            {rest.length > 0 && (
              <div className="mt-24">
                <h2 className="text-foreground text-2xl font-bold tracking-tight">More Articles</h2>
                <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map(post => (
                    <BlogPostCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
