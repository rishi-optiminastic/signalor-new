# Contributing to Signalor Web

Thanks for taking the time to contribute. This guide covers everything you need to get a change merged.

## Before you start

- **Read [`CLAUDE.md`](./CLAUDE.md).** It's the architecture rulebook (file size limits, server-vs-client defaults, naming, state management, folder structure). Most review comments are just those rules, so reading it first saves us both a round trip.
- **For anything non-trivial, open an issue first.** A quick discussion beats a large PR that goes in the wrong direction. Small fixes (typos, obvious bugs) can go straight to a PR.
- **Check `NEXT_PUBLIC_USE_STUBS=true` covers your work.** Most UI changes need no backend at all.

## Setup

```bash
pnpm install
cp .env.example .env.local     # set NEXT_PUBLIC_USE_STUBS=true and SKIP_ENV_VALIDATION=1
pnpm dev
```

Node 20+ and pnpm are required. See the [README](./README.md) for running against real data.

## Before you push

Run these locally — CI runs the same and will fail your PR otherwise:

```bash
pnpm type-check    # tsc --noEmit
pnpm lint          # zero warnings allowed
pnpm test --run    # vitest
pnpm build         # must succeed
```

`pnpm format` applies Prettier. A pre-commit hook (husky + lint-staged) runs on staged files, but please don't rely on it alone.

## Conventions that come up most

These are from `CLAUDE.md`, but they're the ones people hit first:

- **No `any`.** Use `unknown` and narrow it, or write the type.
- **Default to server components.** Add `"use client"` only when you need state, effects, browser APIs or event handlers — and push it as far down the tree as possible.
- **Never `fetch()` inside a component.** Data access goes through `services/`.
- **Named exports only** (except `app/` pages and layouts, which Next.js requires to be default).
- **Validate all external data with Zod** — API responses, forms, env, URL params.
- **No new dependencies without discussion.** Open an issue first; the dep list is deliberately curated.
- **Files stay under 500 lines; functions under 40.** Split before you cross it.
- Reuse the shared `PrimaryButton` and the segmented `TickBar` rather than hand-rolling brand-coloured buttons or progress bars.

## Pull requests

- **One logical change per PR.** Unrelated refactors and formatting churn make review hard — keep them separate.
- **Write a real description**: what changed, why, and how you verified it. Screenshots or a short clip for UI changes are worth a lot.
- **Add tests for new logic**, and a regression test with every bug fix.
- **Update docs** when behaviour changes (README, `.env.example`, `CLAUDE.md` if you change a convention).
- Fill in the [PR template](./.github/pull_request_template.md).

Commits: we're not strict about format, but write messages that explain _why_, not just _what_.

## Reporting bugs

Include: what you expected, what happened, steps to reproduce, and your environment (OS, Node version, browser). A failing test or a minimal reproduction is the fastest path to a fix.

**Security issues do not belong in public issues** — see [`SECURITY.md`](./SECURITY.md).

## Scope of this repo

This is the front end. The analyzer backend (crawling, scoring, LLM pipeline) is a separate proprietary service, so PRs that require backend changes may need to wait on us — say so in the issue and we'll tell you what's feasible.

## Licensing of contributions

This project is [Apache-2.0](./LICENSE). By submitting a contribution you agree it is licensed under Apache-2.0, and you confirm you have the right to submit it (per Apache-2.0 Section 5). Don't paste code you don't have the rights to.

## Code of Conduct

By participating you agree to the [Code of Conduct](./CODE_OF_CONDUCT.md).
