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

- `toMonthlyAmount()` in `lib/utils/finance.ts` normalizes any frequency to monthly for dashboard aggregations. Weekly uses `* 4` (not 4.33).
- Savings allocations are **not** expenses — they're excluded from expense charts and treated as positive cash flow (transfers to savings accounts)
- Currency conversion uses an in-memory cached exchange rate from exchangerate-api.com (1-hour TTL)
- Net worth = total savings balances + net cash flow (income - expenses - subscriptions - savings contributions)

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
- Category types are duplicated in 6 places: `schema.ts`, tRPC router Zod enum, form Zod enum, form `<SelectItem>`s, modal type, and page type. Update all when adding new values.

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

## Drizzle Nullable Date Columns

Drizzle's `date()` column type does **not** handle JS `null` correctly — it coerces `null` to an empty string, which Postgres rejects. When making a `date()` column nullable:

1. Remove `.notNull()` from the schema definition
2. Use `sql\`null\`` from `drizzle-orm` to send a proper SQL NULL:
   ```ts
   import { sql } from "drizzle-orm";
   function toDateOrNull(val: string | undefined) {
     return val && val.length > 0 ? val : sql`null`;
   }
   ```
3. Destructure the date field out of the input spread to prevent the empty string from overriding:
   ```ts
   const { date, ...rest } = input;
   db.insert(table).values({ ...rest, date: toDateOrNull(date), userId: ctx.session.user.id });
   ```
4. Run `pnpm db:push` (local) AND generate a migration (`npx drizzle-kit generate`) for deployment
5. `db:push` only affects the local database — deployed databases need the migration applied via `pnpm db:migrate`

## Deployment

- `pnpm db:push` applies schema changes to the **local** database only
- For production, generate a migration with `npx drizzle-kit generate` and deploy it with `pnpm db:migrate`
- Enum `ADD VALUE` statements cannot run inside transactions — Drizzle handles this with `statement-breakpoint` comments in migration files

## Reference Docs for External Libraries

- Drizzle ORM: https://orm.drizzle.team/llms.txt
- shadcn/ui: https://ui.shadcn.com/llms.txt
- Resend: https://resend.com/docs/llms-full.txt
- Better Auth: https://www.better-auth.com/llms.txt
