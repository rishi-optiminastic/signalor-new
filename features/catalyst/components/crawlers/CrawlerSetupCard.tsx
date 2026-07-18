'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { config } from '@/lib/config'

function CopyChip({ label, text }: { label: string; text: string }): JSX.Element {
  const [copied, setCopied] = useState(false)
  const copy = (): void => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    })
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[var(--cat-border)] px-2.5 text-[11px] font-medium text-[var(--cat-ink-2)] transition-colors hover:bg-[var(--cat-hover)] hover:text-[var(--cat-ink)]"
    >
      {copied ? <Check size={12} className="text-[#2FBE7E]" /> : <Copy size={12} />}
      {copied ? 'Copied' : label}
    </button>
  )
}

const BOT_PATTERN =
  'gptbot|oai-searchbot|chatgpt-user|claudebot|claude-user|perplexitybot|perplexity-user|google-extended|googleother|bytespider|ccbot|meta-externalagent|amazonbot|applebot-extended'

function middlewareSnippet(ingestUrl: string, token: string): string {
  return [
    '// middleware.ts — report AI crawler visits to SignalorAI (fire-and-forget)',
    'import { NextResponse, type NextRequest } from "next/server"',
    '',
    `const AI_BOTS = /${BOT_PATTERN}/i`,
    '',
    'export function middleware(req: NextRequest) {',
    '  const ua = req.headers.get("user-agent") ?? ""',
    '  if (AI_BOTS.test(ua)) {',
    `    void fetch("${ingestUrl}", {`,
    '      method: "POST",',
    '      headers: { "content-type": "application/json" },',
    '      body: JSON.stringify({',
    `        token: "${token}",`,
    '        hits: [{ path: req.nextUrl.pathname, user_agent: ua }],',
    '      }),',
    '    }).catch(() => {})',
    '  }',
    '  return NextResponse.next()',
    '}',
  ].join('\n')
}

/** How to wire a site up: the ingest endpoint, the org token, and a paste-in
 * Next.js middleware. Any stack that can POST JSON on request works. */
export function CrawlerSetupCard({ token }: { token: string }): JSX.Element {
  const ingestUrl = new URL('/api/analyzer/crawler/ingest/', config.apiBaseUrl).toString()
  const snippet = middlewareSnippet(ingestUrl, token)
  return (
    <Card>
      <CardHead title="Connect your site" />
      <p className="text-[12px] leading-relaxed text-[var(--cat-ink-3)]">
        AI crawler visits only exist in your server logs, so your site reports them to SignalorAI.
        Paste the middleware below into a Next.js site, or POST the same JSON from nginx,
        CloudFront, a Cloudflare Worker, or your WordPress server. Only requests matching known AI
        bots are stored.
      </p>
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <CopyChip label="Copy ingest URL" text={ingestUrl} />
        <CopyChip label="Copy ingest token" text={token} />
        <CopyChip label="Copy Next.js middleware" text={snippet} />
      </div>
      <pre className="mt-2.5 max-h-64 overflow-auto rounded-md border border-[var(--cat-border)] bg-[var(--cat-content)] p-3 font-mono text-[11px] leading-relaxed whitespace-pre text-[var(--cat-ink-2)]">
        {snippet}
      </pre>
    </Card>
  )
}
