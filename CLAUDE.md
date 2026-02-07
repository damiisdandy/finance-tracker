# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal finance dashboard for tracking income, expenses, subscriptions, savings, and cash flow. Per-user data isolation with email/password auth. Multi-currency support (NGN/USD) with live exchange rates.

## Tech Stack

- **Framework**: Next.js 16 App Router, React 19, TypeScript (strict)
- **Package manager**: pnpm
- **API**: tRPC v11 + TanStack Query v5
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Better Auth (email/password)
- **UI**: Tailwind CSS v4 + shadcn/ui (new-york style), Recharts
- **Email**: Resend
- **PWA**: next-pwa (production only)

## Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Production build (uses --webpack flag)
pnpm lint             # Run ESLint
pnpm lint -- app/page.tsx  # Lint a single file
pnpm db:migrate       # Apply Drizzle migrations
pnpm db:push          # Push schema directly to database
pnpm db:seed          # Seed with demo data
pnpm db:studio        # Open Drizzle Studio GUI
```

No test runner is configured yet. Use lint as the quality gate.

## Architecture

### Data Flow

Pages → tRPC hooks → tRPC routers (protectedProcedure) → Drizzle queries → PostgreSQL

All data queries are scoped by `userId` from the Better Auth session. This is enforced at the tRPC router level with `where(eq(table.userId, ctx.session.user.id))`.

### Key Directories

- `app/` — Next.js App Router pages and API routes
- `lib/trpc/routers/` — tRPC routers (expense, income, subscription, savings, savings-allocation, currency)
- `lib/trpc/trpc.ts` — tRPC init, defines `publicProcedure` and `protectedProcedure`
- `lib/db/schema.ts` — Single source of truth for all Drizzle table definitions and enums
- `lib/auth.ts` / `lib/auth-client.ts` — Better Auth server and client config
- `lib/env.ts` — Environment validation via @t3-oss/env-nextjs + Zod
- `lib/utils/` — Finance calculations, currency formatting, date helpers
- `components/<feature>/` — Feature-specific components (forms, tables, modals)
- `components/ui/` — shadcn/ui primitives
- `providers/` — React context providers (tRPC, currency)

### API Routes

- `/api/auth/*` — Better Auth endpoints
- `/api/trpc/[trpc]` — tRPC batch handler
- `/api/cron/savings-reminder` — Monthly email reminder (requires `Authorization: Bearer $CRON_SECRET`)

### Auth & Middleware

`middleware.ts` checks for Better Auth session cookie and redirects unauthenticated users to `/sign-in`. Excludes auth API routes, tRPC endpoint, sign-in/sign-up pages, and static files.

### Domain Logic

- `toMonthlyAmount()` in `lib/utils/finance.ts` normalizes any frequency to monthly for dashboard aggregations
- Savings allocations are **not** expenses — they're excluded from expense charts and treated as positive cash flow (transfers to savings accounts)
- Currency conversion uses an in-memory cached exchange rate from exchangerate-api.com (1-hour TTL)

## Code Conventions

- Files: kebab-case. Components: PascalCase. Variables/functions: camelCase.
- Router exports follow `xyzRouter` naming (e.g., `expenseRouter`).
- Use `"use client"` only where client hooks/state are needed.
- Import order: external packages → `@/` aliases → relative imports.
- Use `@/*` path alias over deep relative paths.
- Double quotes, semicolons, trailing commas in multiline.
- Reuse Drizzle inferred types (`$inferSelect`, `$inferInsert`) from schema.
- Define Zod input schemas alongside tRPC procedures.
- Keep enum values consistent across DB schema, Zod schemas, and UI selects.

## CRUD Page Pattern

Each feature page (expenses, income, subscriptions, savings) follows the same pattern:
1. Page component manages modal state and editing item
2. tRPC `list` query for data, `create`/`update`/`delete` mutations
3. Mutations invalidate the list query via `trpc.useUtils()` on success
4. Separate form, modal, and table components in `components/<feature>/`
5. Forms use React Hook Form + Zod + shadcn Form components

## Environment Variables

Validated in `lib/env.ts`. Required in `.env.local`:
- `DATABASE_URL` — PostgreSQL connection string
- `BETTER_AUTH_SECRET` — Min 32 chars
- `BETTER_AUTH_URL` — Auth base URL
- `NEXT_PUBLIC_APP_URL` — Public app URL
- `RESEND_API_KEY` — For email delivery
- `CRON_SECRET` — For cron endpoint auth

## Reference Docs for External Libraries

- Drizzle ORM: https://orm.drizzle.team/llms.txt
- shadcn/ui: https://ui.shadcn.com/llms.txt
- Resend: https://resend.com/docs/llms-full.txt
- Better Auth: https://www.better-auth.com/llms.txt
