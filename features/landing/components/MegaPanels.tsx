import Link from 'next/link'

import { FeaturedGraph } from '@/features/landing/components/FeaturedGraph'
import {
  PRICING_LINKS,
  PRODUCT_COLS,
  RESOURCE_COLS,
  type MenuColumn,
  type MenuLink,
} from '@/features/landing/nav-data'

function MenuLinkRow({ link }: { link: MenuLink }): JSX.Element {
  return (
    <Link
      href={link.href}
      className="block rounded-md px-3 py-2 transition-colors hover:bg-[#f6f6f7]"
    >
      <span className="flex items-center gap-2">
        <span className="text-[14px] font-medium text-[#171717]">{link.label}</span>
        {link.badge && (
          <span className="rounded-full bg-[#e9f9ef] px-1.5 py-[1px] text-[10px] font-semibold text-[#12a150]">
            {link.badge}
          </span>
        )}
      </span>
      <span className="mt-0.5 block text-[12.5px] text-[#71717a]">{link.desc}</span>
    </Link>
  )
}

function MenuCol({ col }: { col: MenuColumn }): JSX.Element {
  return (
    <div className="min-w-[176px]">
      <div className="mb-1 px-3 text-[11px] font-semibold tracking-wider text-[#a1a1aa] uppercase">
        {col.title}
      </div>
      {col.links.map(l => (
        <MenuLinkRow key={l.label} link={l} />
      ))}
    </div>
  )
}

function MenuFooter({
  label,
  action,
  href,
}: {
  label: string
  action: string
  href: string
}): JSX.Element {
  return (
    <div className="mt-3 flex items-center justify-between border-t border-[#f0f0f0] px-3 pt-3">
      <span className="text-[12.5px] text-[#71717a]">{label}</span>
      <Link
        href={href}
        className="text-[12.5px] font-semibold text-[#171717] transition-colors hover:text-[#e04a3d]"
      >
        {action}
      </Link>
    </div>
  )
}

function FeaturedCard(): JSX.Element {
  return (
    <Link
      href="/api"
      className="flex w-[336px] flex-col rounded-md bg-gradient-to-b from-[#faf2f1] to-[#f6f6f7] p-4 transition-shadow hover:shadow-sm"
    >
      <div className="px-1">
        <span className="text-[11px] font-semibold tracking-wider text-[#a1a1aa] uppercase">
          Featured
        </span>
        <p className="mt-2 text-[14px] font-semibold text-[#171717]">API &amp; MCP</p>
        <p className="mt-0.5 text-[12.5px] text-[#71717a]">Build on top of Signalor data</p>
      </div>
      <FeaturedGraph />
    </Link>
  )
}

export function ProductPanel(): JSX.Element {
  return (
    <div className="w-[740px] p-4">
      <div className="flex gap-5">
        <div className="flex-1">
          <MenuCol col={PRODUCT_COLS[0]} />
        </div>
        <FeaturedCard />
      </div>
      <MenuFooter label="What's new in Signalor" action="Changelog" href="/changelog" />
    </div>
  )
}

export function ResourcesPanel(): JSX.Element {
  return (
    <div className="w-[720px] p-4">
      <div className="flex gap-1">
        {RESOURCE_COLS.map(c => (
          <MenuCol key={c.title} col={c} />
        ))}
      </div>
      <MenuFooter
        label="New research: How AI search reshapes B2B discovery"
        action="Read report"
        href="/blog"
      />
    </div>
  )
}

export function PricingPanel(): JSX.Element {
  return (
    <div className="w-[340px] p-4">
      <div className="mb-1 px-3 text-[11px] font-semibold tracking-wider text-[#a1a1aa] uppercase">
        Pricing models
      </div>
      {PRICING_LINKS.map(l => (
        <MenuLinkRow key={l.label} link={l} />
      ))}
      <MenuFooter label="Not sure which is right?" action="Talk to us" href="/contact-sales" />
    </div>
  )
}
