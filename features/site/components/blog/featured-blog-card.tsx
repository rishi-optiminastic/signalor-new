import Image from 'next/image'
import Link from 'next/link'

import { formatBlogDate } from '@/features/site/lib/blog-date'
import type { SanityBlogPost } from '@/features/site/sanity/lib/queries'

interface FeaturedBlogCardProps {
  post: SanityBlogPost
}

export function FeaturedBlogCard({ post }: FeaturedBlogCardProps): React.ReactElement {
  const imgUrl = post.coverImage?.url

  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col">
      <div className="ring-foreground/10 relative aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1 ring-inset">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={post.coverImage?.alt ?? post.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="from-primary/15 via-muted to-info/15 h-full w-full bg-gradient-to-br" />
        )}
      </div>

      <p className="text-muted-foreground mt-5 text-sm">{formatBlogDate(post.publishedAt)}</p>

      <h3 className="text-foreground group-hover:text-primary mt-2 text-xl leading-snug font-bold tracking-tight transition-colors sm:text-2xl">
        {post.title}
      </h3>
    </Link>
  )
}
