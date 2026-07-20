import Image from 'next/image'
import Link from 'next/link'

import { ArrowRight } from '@/features/site/components/icons'
import { formatBlogDate } from '@/features/site/lib/blog-date'
import type { SanityBlogPost } from '@/features/site/sanity/lib/queries'

interface BlogPostCardProps {
  post: SanityBlogPost
}

export function BlogPostCard({ post }: BlogPostCardProps): React.ReactElement {
  const imgUrl = post.coverImage?.url
  const href = `/blog/${post.slug}`

  return (
    <article className="group flex flex-col">
      <Link href={href} className="block">
        <div className="ring-foreground/10 relative aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1 ring-inset">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={post.coverImage?.alt ?? post.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="from-primary/15 via-muted to-info/15 h-full w-full bg-gradient-to-br" />
          )}
        </div>
      </Link>

      <p className="text-muted-foreground mt-5 text-sm">{formatBlogDate(post.publishedAt)}</p>

      <h3 className="mt-2 text-lg leading-snug font-bold tracking-tight">
        <Link href={href} className="text-foreground group-hover:text-primary transition-colors">
          {post.title}
        </Link>
      </h3>

      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{post.excerpt}</p>

      <div className="mt-6 flex items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold">
            S
          </span>
          <span className="text-foreground text-sm font-medium">SignalorAI</span>
        </div>

        <Link
          href={href}
          className="text-primary inline-flex items-center gap-1 text-sm font-medium transition hover:gap-1.5"
        >
          Read
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}
