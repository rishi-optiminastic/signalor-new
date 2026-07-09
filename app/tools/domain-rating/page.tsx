'use client'

import { MarketingShell } from '@/features/landing/components/MarketingShell'

import { RelatedLinks } from '@fe/components/seo/related-links'
import { DomainRatingInline } from '@fe/components/tools/domain-rating-inline'
import { ToolPage } from '@fe/components/tools/tool-page'

export default function DomainRatingToolPage() {
  return (
    <MarketingShell>
      <p className="sr-only">
        The Signalor Domain Rating checker is a free tool that scores any website&rsquo;s authority
        on a 0&ndash;100 Domain Rating (DR) scale. Enter a domain and the checker returns its DR,
        sourced from Ahrefs&rsquo; authority index. Domain Rating reflects the strength of the sites
        linking to a domain, an important off-page signal that AI engines and search engines weigh
        when deciding which sources to trust and cite. Results are instant with no account required.
      </p>
      <ToolPage
        theme="blue"
        eyebrow="[ free tool · domain rating ]"
        eyebrowClassName="text-muted-foreground"
        title="Check the authority of"
        titleAccent="any domain"
        description="Enter a domain and we'll return its Domain Rating (0-100), free, no sign-up."
        secondaryDescription="The checker returns a 0-100 Domain Rating sourced from Ahrefs' authority index. Domain Rating reflects how authoritative the sites linking to a domain are, an off-page signal search and AI engines weigh when choosing sources to cite."
        form={<DomainRatingInline />}
        features={[
          {
            title: 'Domain Rating (DR)',
            description:
              "A 0-100 score of a domain's authority, the strength of the sites linking to it.",
          },
          {
            title: 'Powered by Ahrefs',
            description:
              "DR is sourced live from Ahrefs' authority index, the industry-standard backlink dataset.",
          },
          {
            title: 'Instant results',
            description: 'Enter a domain and get its DR in seconds, no account or setup.',
          },
          { title: 'Free forever', description: 'Run unlimited domain checks without an account.' },
        ]}
        previewEyebrow="[ what's inside the full report ]"
        previewTitle="Go beyond a snapshot ,"
        previewTitleAccent="track it over time"
        previewDescription="The free tool shows a point-in-time authority snapshot. Sign up or upgrade to track Domain Rating growth over time and benchmark against competitors."
        previewRows={[
          { content: <PreviewBacklinkHistory />, locked: true },
          { content: <PreviewCompetitorBenchmark />, locked: true },
        ]}
      />
      <RelatedLinks page="/tools/domain-rating" />
    </MarketingShell>
  )
}

function PreviewBacklinkHistory() {
  return (
    <div>
      <p className="text-foreground text-sm font-semibold">Backlink & DR history</p>
      <p className="text-muted-foreground mt-1 text-xs">
        Week-over-week Domain Rating, new vs. lost backlinks, and referring-domain growth trends.
      </p>
    </div>
  )
}

function PreviewCompetitorBenchmark() {
  return (
    <div>
      <p className="text-foreground text-sm font-semibold">Competitor authority benchmark</p>
      <p className="text-muted-foreground mt-1 text-xs">
        Compare your Domain Rating and referring domains against rivals to find link gaps to close.
      </p>
    </div>
  )
}
