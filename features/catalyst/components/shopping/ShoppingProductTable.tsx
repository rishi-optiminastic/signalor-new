import { TickBar } from '@/features/catalyst/components/brands/BrandBits'
import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { scoreColor } from '@/features/catalyst/visibility-data'
import type { ShoppingProduct, ShoppingReadiness } from '@/lib/api/shopping'
import { ExternalLink } from '@/lib/icons'

const ISSUE_SHORT: Record<string, string> = {
  thin_description: 'Thin copy',
  no_images: 'No images',
  no_price: 'No price',
  images_missing_alt: 'Missing alt',
  no_product_type: 'No type',
  no_tags: 'No tags',
}

function IssueChips({ issues }: { issues: string[] }): JSX.Element {
  if (issues.length === 0) {
    return (
      <span className="rounded-sm bg-[rgba(47,190,126,0.12)] px-1.5 py-0.5 text-[10px] font-semibold text-[#2FBE7E]">
        Ready
      </span>
    )
  }
  return (
    <span className="flex flex-wrap gap-1">
      {issues.map(issue => (
        <span
          key={issue}
          className="rounded-sm bg-[var(--cat-hover)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--cat-ink-2)]"
        >
          {ISSUE_SHORT[issue] ?? issue}
        </span>
      ))}
    </span>
  )
}

function ReadinessCell({ readiness }: { readiness: number }): JSX.Element {
  return (
    <span className="flex items-center gap-2">
      <TickBar value={readiness} ticks={12} showValue={false} />
      <span
        className="text-[12px] font-semibold tabular-nums"
        style={{ color: scoreColor(readiness) }}
      >
        {readiness}
      </span>
    </span>
  )
}

function ProductRow({
  product,
  adminBase,
}: {
  product: ShoppingProduct
  adminBase: string
}): JSX.Element {
  return (
    <tr className="border-t border-[var(--cat-border-soft)] transition-colors hover:bg-[var(--cat-hover)]">
      <td className="max-w-[320px] px-3 py-2.5">
        <a
          href={`${adminBase}${product.product_id}`}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex max-w-full items-center gap-1.5 text-[13px] font-medium text-[var(--cat-ink)] hover:underline"
        >
          <span className="truncate">{product.title || product.handle}</span>
          <ExternalLink size={11} className="shrink-0 text-[var(--cat-ink-3)]" />
        </a>
      </td>
      <td className="px-3 py-2.5">
        <ReadinessCell readiness={product.readiness} />
      </td>
      <td className="px-3 py-2.5">
        <IssueChips issues={product.issues} />
      </td>
      <td className="hidden px-3 py-2.5 text-right text-[12px] text-[var(--cat-ink-2)] tabular-nums md:table-cell">
        {product.price ? product.price : '—'}
      </td>
      <td className="hidden px-3 py-2.5 text-right text-[12px] text-[var(--cat-ink-2)] tabular-nums lg:table-cell">
        {product.description_chars}
      </td>
    </tr>
  )
}

/** Worst products first — each links straight to its Shopify admin editor. */
export function ShoppingProductTable({ data }: { data: ShoppingReadiness }): JSX.Element {
  const adminBase = `https://${data.shop_domain}/admin/products/`
  return (
    <Card>
      <CardHead title="Products to fix first" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="text-left text-[10px] font-semibold tracking-wide text-[var(--cat-ink-3)] uppercase">
              <th className="px-3 pb-2">Product</th>
              <th className="px-3 pb-2">Readiness</th>
              <th className="px-3 pb-2">Issues</th>
              <th className="hidden px-3 pb-2 text-right md:table-cell">Price</th>
              <th className="hidden px-3 pb-2 text-right lg:table-cell">Copy chars</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map(product => (
              <ProductRow key={product.product_id} product={product} adminBase={adminBase} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
