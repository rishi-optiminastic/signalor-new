import Link from 'next/link'

const LEGAL = [
  { href: '/policy', label: 'Privacy policy' },
  { href: '/terms', label: 'Terms of service' },
  { href: 'mailto:hello@signalor.ai', label: 'Contact us' },
  { href: '/about-us', label: 'About' },
]

export function FooterLegal(): JSX.Element {
  const year = new Date().getFullYear()
  return (
    <div className="border-t border-black/[0.06] bg-[#f7f7f6] px-6 py-5 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav
          aria-label="Legal"
          className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-medium text-[#6b6b6b]"
        >
          {LEGAL.map((item, i) => (
            <span key={item.label} className="inline-flex items-center gap-2">
              {i > 0 && <span aria-hidden>·</span>}
              <Link href={item.href} className="transition-colors hover:text-[#171717]">
                {item.label}
              </Link>
            </span>
          ))}
        </nav>
        <div className="flex flex-col items-start gap-2 lg:items-end">
          <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-medium text-[#171717]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#16a34a]" aria-hidden />
            All systems online
          </span>
          <p className="text-[12px] text-[#9ca3af]">© {year} SignalorAI. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
