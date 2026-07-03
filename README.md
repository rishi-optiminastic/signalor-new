# Next.js Production Template

An opinionated, production-ready Next.js 14 (App Router) template wired for shipping real apps. Comes with type-safe env, validated forms, server-state caching, auth, database, lint/format/test guardrails, and pre-commit hooks already configured.

> Conventions and architectural rules this template enforces are documented in [`CLAUDE.md`](./CLAUDE.md). Read that file before adding code.

---

## Features

### Core stack

- **Next.js 14** (App Router) + **React 19**
- **TypeScript 5** with `strict: true`, `noImplicitReturns`, `noFallthroughCasesInSwitch`
- **Tailwind CSS v4** with `tw-animate-css`, `tailwind-merge`, `class-variance-authority`
- **shadcn/ui** primitives (Radix-based) preinstalled in `components/ui/`

### Authentication & data

- **Better Auth** with email/password, session cookies, 30-day expiry, cookie cache
- **Prisma 5** + **PostgreSQL** (pooled `DATABASE_URL` + direct `DIRECT_URL` for migrations)
- **Built-in rate limiting** on auth endpoints (5/min on sign-in, sign-up, reset)
- Auth-gated routes via `middleware.ts` (redirects to `/sign-in` with `callbackUrl`)

### State & data fetching

- **TanStack Query 5** with SSR-safe `getQueryClient` factory and devtools (dev-only)
- **Zustand 5** for client state (example: `stores/useUiStore.ts`)
- **react-hook-form** + **Zod** + `@hookform/resolvers` for validated forms
- **next-safe-action** for typed server actions (installed, unwired)

### Validation & env

- **Zod** schemas live next to types (`lib/validators/`, `features/*/types.ts`)
- **`@t3-oss/env-nextjs`** for type-safe env vars (validated at startup)
- `.env.example` documents every required variable

### Observability

- **pino** + **pino-pretty** structured logger (`lib/logger.ts`) — never `console.log`
- `createLogger(module)` factory for per-module child loggers

### Code quality

- **ESLint 9** flat config extending `eslint-config-next` + `@typescript-eslint`
  - Hard rules: `max-lines: 350`, `max-lines-per-function: 40`, `max-params: 3`, `max-depth: 3`, `complexity: 10`
  - No `any`, no default exports (except App Router files), explicit return types
  - Strict import order via `eslint-plugin-import`
- **Prettier** with `prettier-plugin-tailwindcss` (auto-sorts utility classes)
- **commitlint** with `@commitlint/config-conventional` (enforced by `commit-msg` hook)
- **lint-staged** runs `eslint --fix` + `prettier --write` on staged files
- **husky** pre-commit + commit-msg hooks
- **knip** for dead-code / unused-export detection

### Testing

- **Vitest** for unit tests
- **Playwright** for E2E
- Test files automatically skip strict file/function size limits

### Security

- Hardened `next.config.mjs` headers: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-XSS-Protection
- `poweredByHeader: false`, `reactStrictMode: true`
- Better Auth rate limiting on `/sign-in/email`, `/sign-up/email`, `/forget-password`, `/reset-password`

### Security headroom (not yet wired)

- CSP header — left out because it must be tuned per-app
- OAuth providers (Better Auth supports them — add client IDs)
- Email verification (Better Auth supports it — add SMTP/Resend)
- Sentry (`@sentry/nextjs` not installed; needs DSN)
- Distributed rate-limit storage (swap Better Auth's in-memory store for Redis/Upstash in multi-instance deploys)

---

## Project structure

```
app/                      # Next.js App Router pages, layouts, route handlers
├── api/auth/[...all]/    # Better Auth catch-all route
├── dashboard/            # Auth-gated example route
├── sign-in/              # RHF + Zod, wrapped in Suspense for useSearchParams
├── sign-up/              # RHF + Zod
├── early-access/         # Marketing capture form
├── layout.tsx            # Root layout — mounts QueryProvider
└── page.tsx              # Landing page

components/               # Shared, reusable UI components
├── providers/            # React context providers (Query, Theme, ...)
└── ui/                   # shadcn/ui primitives — exempt from strict ESLint rules

features/                 # Self-contained feature modules
└── [feature-name]/
    ├── components/
    ├── hooks/
    ├── types.ts          # Types + Zod schemas
    └── index.ts          # Public API barrel

hooks/                    # Shared cross-feature hooks
lib/
├── auth.ts               # Better Auth server config
├── auth-client.ts        # Better Auth React client
├── env.ts                # Validated env (t3-oss/env-nextjs)
├── logger.ts             # pino logger
├── prisma.ts             # Prisma singleton (HMR-safe)
├── query-client.ts       # TanStack Query client factory (SSR-safe)
├── query-keys.ts         # Centralized query keys
├── utils.ts              # cn() helper
└── validators/           # Cross-feature Zod schemas

services/                 # All external API / data-access calls — typed
└── auth.service.ts       # Wraps Better Auth client calls

stores/                   # Zustand stores
└── useUiStore.ts         # Sidebar open state

prisma/
└── schema.prisma         # User, Session, Account, Verification models

middleware.ts             # Edge middleware: redirects /dashboard → /sign-in
```

Rules:

- Features cannot import from other features. Only from `lib/`, `components/`, `hooks/`.
- Components never `fetch()` directly — go through `services/`.
- All external data is validated with Zod at the boundary.
- One component per file. No file > 500 lines (ESLint enforces 350 hard cap).

---

## Path aliases

| Alias   | Resolves to |
| ------- | ----------- |
| `@/...` | repo root   |

Example: `import { auth } from '@/lib/auth'`

---

## Scripts

| Command             | What it does                                          |
| ------------------- | ----------------------------------------------------- |
| `pnpm dev`          | Start dev server on `:3000`                           |
| `pnpm build`        | Production build                                      |
| `pnpm start`        | Run the production server                             |
| `pnpm lint`         | ESLint with `--max-warnings 0` (CI-strict)            |
| `pnpm lint:fix`     | Auto-fix lint errors                                  |
| `pnpm type-check`   | `tsc --noEmit`                                        |
| `pnpm format`       | Prettier write all files                              |
| `pnpm format:check` | Verify formatting (CI)                                |
| `pnpm test`         | Vitest (unit)                                         |
| `pnpm test:e2e`     | Playwright (e2e)                                      |
| `pnpm analyze`      | Bundle analysis (`ANALYZE=true next build`)           |
| `pnpm dead-code`    | Knip — find unused files/exports/deps                 |
| `pnpm db:generate`  | `prisma generate`                                     |
| `pnpm db:push`      | `prisma db push` (no migrations)                      |
| `pnpm db:migrate`   | `prisma migrate dev`                                  |
| `pnpm db:studio`    | Open Prisma Studio                                    |
| `pnpm prepare`      | Reinstall husky hooks (runs automatically on install) |

---

## Quick start

```bash
# 1. Install dependencies (uses pnpm)
pnpm install

# 2. Copy env template and fill in real values
cp .env.example .env.local

# 3. Generate the Prisma client
pnpm db:generate

# 4. Push the schema to your Postgres database
pnpm db:push

# 5. Start the dev server
pnpm dev
```

Open <http://localhost:3000>.

To verify everything is wired up correctly:

```bash
pnpm lint && pnpm type-check && pnpm build
```

---

## Environment variables

All variables are validated at startup by `lib/env.ts`. See [`.env.example`](./.env.example) for the canonical list.

| Variable              | Required                       | Purpose                                                      |
| --------------------- | ------------------------------ | ------------------------------------------------------------ |
| `NODE_ENV`            | no (defaults to `development`) | `development` \| `test` \| `production`                      |
| `DATABASE_URL`        | yes                            | Pooled Postgres connection string                            |
| `DIRECT_URL`          | yes                            | Direct (non-pooled) connection — used for migrations         |
| `BETTER_AUTH_SECRET`  | yes                            | ≥ 32 chars. Generate with `openssl rand -base64 32`          |
| `BETTER_AUTH_URL`     | yes                            | Public URL of the auth server (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | yes                            | Public app URL (used by `auth-client`)                       |
| `SKIP_ENV_VALIDATION` | no                             | Set to `true` to bypass validation (CI builds)               |

---

## Dependencies

### Runtime

#### Framework / runtime

| Package               | Version | Purpose                         |
| --------------------- | ------- | ------------------------------- |
| `next`                | 14.2.25 | App Router, RSC, server actions |
| `react` / `react-dom` | ^19     | UI runtime                      |
| `geist`               | ^1.3.1  | Geist font                      |

#### Auth & DB

| Package          | Version | Purpose                                      |
| ---------------- | ------- | -------------------------------------------- |
| `better-auth`    | ^1.6.9  | Email/password auth, sessions, rate limiting |
| `@prisma/client` | ^5.22.0 | Prisma runtime                               |
| `prisma`         | ^5.22.0 | Prisma CLI/engine                            |

#### State / data

| Package                 | Version  | Purpose                   |
| ----------------------- | -------- | ------------------------- |
| `@tanstack/react-query` | ^5.100.1 | Server state cache        |
| `zustand`               | ^5.0.12  | Client state              |
| `react-hook-form`       | ^7.60.0  | Form state                |
| `@hookform/resolvers`   | ^3.10.0  | Zod ↔ RHF bridge          |
| `zod`                   | 3.25.67  | Runtime schema validation |
| `next-safe-action`      | ^8.5.2   | Typed server actions      |

#### Logging / env

| Package              | Version  | Purpose                   |
| -------------------- | -------- | ------------------------- |
| `pino`               | ^10.3.1  | Structured logger         |
| `pino-pretty`        | ^13.1.3  | Dev-pretty pino transport |
| `@t3-oss/env-nextjs` | ^0.13.11 | Type-safe env validation  |

#### UI primitives (shadcn/ui via Radix)

`@radix-ui/react-accordion`, `react-alert-dialog`, `react-aspect-ratio`, `react-avatar`, `react-checkbox`, `react-collapsible`, `react-context-menu`, `react-dialog`, `react-dropdown-menu`, `react-hover-card`, `react-label`, `react-menubar`, `react-navigation-menu`, `react-popover`, `react-progress`, `react-radio-group`, `react-scroll-area`, `react-select`, `react-separator`, `react-slider`, `react-slot`, `react-switch`, `react-tabs`, `react-toast`, `react-toggle`, `react-toggle-group`, `react-tooltip`

Plus: `lucide-react` (icons), `cmdk` (command palette), `sonner` (toasts), `vaul` (drawer), `embla-carousel-react`, `react-day-picker`, `react-resizable-panels`, `input-otp`, `recharts`, `next-themes`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate`, `date-fns`.

#### Misc

| Package             | Version | Purpose              |
| ------------------- | ------- | -------------------- |
| `@vercel/analytics` | 1.3.1   | Vercel web analytics |

### Dev

#### Lint / format

| Package                            | Version |
| ---------------------------------- | ------- |
| `eslint`                           | ^9.39.4 |
| `eslint-config-next`               | ^16.2.4 |
| `@typescript-eslint/eslint-plugin` | ^8.59.0 |
| `@typescript-eslint/parser`        | ^8.59.0 |
| `eslint-plugin-import`             | ^2.32.0 |
| `eslint-plugin-prettier`           | ^5.5.5  |
| `prettier`                         | ^3.8.3  |
| `prettier-plugin-tailwindcss`      | ^0.7.3  |
| `@eslint/eslintrc`                 | ^3.3.5  |

#### Git hooks / commits

| Package                           | Version |
| --------------------------------- | ------- |
| `husky`                           | ^9.1.7  |
| `lint-staged`                     | ^16.4.0 |
| `@commitlint/cli`                 | ^20.5.0 |
| `@commitlint/config-conventional` | ^20.5.0 |

#### Testing

| Package            | Version |
| ------------------ | ------- |
| `vitest`           | ^4.1.5  |
| `@playwright/test` | ^1.59.1 |

#### Tooling

| Package                          | Version  |
| -------------------------------- | -------- |
| `typescript`                     | ^5       |
| `knip`                           | ^6.6.3   |
| `@tanstack/react-query-devtools` | ^5.100.5 |
| `tailwindcss`                    | ^4.1.9   |
| `@tailwindcss/postcss`           | ^4.1.9   |
| `tw-animate-css`                 | 1.3.3    |
| `postcss`                        | ^8.5     |
| `autoprefixer`                   | ^10.4.20 |
| `@types/node`                    | ^22      |
| `@types/react`                   | ^18      |
| `@types/react-dom`               | ^18      |

---

## Git hooks

Installed by `pnpm prepare` (runs automatically after `pnpm install`).

| Hook         | Command                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------ |
| `pre-commit` | `pnpm lint-staged` — runs `eslint --fix --max-warnings 0` and `prettier --write` on staged files |
| `commit-msg` | `npx --no -- commitlint --edit "$1"` — enforces Conventional Commits                             |

Allowed commit types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `ci`, `perf`, `revert`.

Subject ≤ 72 chars; body lines ≤ 100 chars.

---

## CI

`.github/workflows/ci.yml` runs on every push and PR to `main`:

1. `pnpm install --frozen-lockfile`
2. `pnpm type-check`
3. `pnpm lint`
4. `pnpm test --run`
5. `pnpm build` (with `SKIP_ENV_VALIDATION=true`)

---

## Authoring rules (must-read)

[`CLAUDE.md`](./CLAUDE.md) is the source of truth for:

- File-size and function-size limits (500 lines / 40 lines / 3 params / depth 3 / complexity 10)
- Server vs client component defaults (server-first; push `"use client"` to leaves)
- Folder placement (`features/`, `components/`, `lib/`, `services/`, `stores/`, `hooks/`)
- Naming conventions
- State-management decision tree
- Forbidden patterns (`any`, default exports outside `app/`, `console.log`, prop-drilling > 2 levels, raw `fetch` in components, hardcoded secrets)
- Pre-flight checklist before writing code

---

## Troubleshooting

**`Cannot find module '@prisma/client'`** — run `pnpm db:generate`.

**Build fails with env errors** — copy `.env.example` to `.env.local` and fill it in, or set `SKIP_ENV_VALIDATION=true` (CI only).

**Hooks not running** — re-run `pnpm prepare` and verify `.husky/pre-commit` and `.husky/commit-msg` are executable (`chmod +x`).

**`useSearchParams() should be wrapped in a suspense boundary`** — any client component reading search params during SSG must be inside `<Suspense>`. The existing `app/sign-in/page.tsx` is already structured correctly; mirror that pattern.

**ESLint complains about file size in landing components** — those files are intentionally exempted in `eslint.config.mjs`. Don't grow new code in them; create new feature modules instead.
