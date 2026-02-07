# AGENTS.md

Guidance for coding agents working in `finance-tracker`.
This file is optimized for autonomous/agentic edits.

## Rule Sources Checked

- Checked `.cursor/rules/`: not present.
- Checked `.cursorrules`: not present.
- Checked `.github/copilot-instructions.md`: not present.
- Therefore, follow repository code and config conventions documented below.

## Project Snapshot

- Framework: Next.js 16 App Router (`app/` directory).
- Language: TypeScript (`strict: true`).
- Package manager: pnpm (`pnpm-lock.yaml` is committed).
- Linting: ESLint v9 with `eslint-config-next` + TypeScript rules.
- Styling: Tailwind CSS v4 + shadcn/ui style components.
- API layer: tRPC v11 with TanStack Query.
- Database: Postgres + Drizzle ORM.
- Auth: Better Auth.
- PWA: `next-pwa` enabled in production builds.

## Quick Start Commands

- Install deps: `pnpm install`
- Start dev server: `pnpm dev`
- Build production bundle: `pnpm build`
- Start production server: `pnpm start`
- Run lint: `pnpm lint`

## Build / Lint / Test Commands

### Build

- Full build: `pnpm build`
- Build uses Next.js (`next build --webpack` as defined in `package.json`).

### Lint

- Full lint: `pnpm lint`
- Lint a single file: `pnpm lint -- app/page.tsx`
- Lint a directory: `pnpm lint -- components/`

### Tests

- Current status: no test runner is configured in `package.json` yet.
- There are no `*.test.*` / `*.spec.*` files in the repo currently.
- Use lint + focused manual checks as the default quality gate.

### Running a Single Test (when test runner is added)

- If Vitest is added: `pnpm vitest run path/to/file.test.ts -t "test name"`
- If Jest is added: `pnpm jest path/to/file.test.ts -t "test name"`
- If Playwright is added: `pnpm playwright test tests/example.spec.ts --grep "test name"`
- Do not invent test commands in PRs; add/update scripts in `package.json` first.

## Database Commands

- Apply migrations: `pnpm db:migrate`
- Push schema: `pnpm db:push`
- Seed database: `pnpm db:seed`
- Open Drizzle Studio: `pnpm db:studio`
- Drizzle config loads env from `.env.local`.

## High-Level Architecture

- Pages/routes: `app/**`
- API routes: `app/api/**`
- tRPC routers: `lib/trpc/routers/**`
- tRPC server plumbing: `lib/trpc/server.ts`, `lib/trpc/trpc.ts`
- DB schema and client: `lib/db/schema.ts`, `lib/db/index.ts`
- Shared utilities: `lib/utils/**`
- UI components: `components/**`
- Providers: `providers/**`

## Code Style Guidelines

### Imports

- Order imports top-to-bottom as:
  1) framework/external packages,
  2) internal aliases (`@/...`),
  3) relative imports.
- Keep type imports explicit when useful (`import type { X } from "..."`).
- Prefer the `@/*` alias over deep relative paths.
- Avoid unused imports; keep import blocks minimal.

### Formatting

- Follow existing ESLint/Next formatting style.
- Use semicolons in TypeScript/TSX files (dominant repo style).
- Use double quotes for strings.
- Prefer trailing commas in multiline objects/arrays/params.
- Keep JSX readable: break props/children across lines when long.
- Do not introduce unrelated formatting churn.

### TypeScript and Types

- Preserve strict typing; do not use `any` unless unavoidable.
- Prefer inferred types from schemas and functions where clear.
- Use `zod` schemas for runtime input validation.
- Reuse Drizzle inferred types (`$inferSelect`, `$inferInsert`) from `lib/db/schema.ts`.
- Narrow nullable values before use; avoid non-null assertions unless justified.

### Naming Conventions

- Files: kebab-case (`expense-form.tsx`, `savings-allocation.ts`).
- React components: PascalCase (`ExpenseForm`, `AppShell`).
- Variables/functions: camelCase.
- Constants: camelCase unless truly global constants.
- Router exports: `xyzRouter` (e.g., `expenseRouter`, `appRouter`).

### React / Next.js

- Add `"use client"` only where client hooks/state are required.
- Keep server/client boundaries explicit in App Router.
- Use functional components and hooks, no class components.
- Co-locate feature UI inside `components/<feature>/`.
- Prefer composition of existing shadcn/ui primitives before new primitives.

### tRPC / API Patterns

- Define input schemas with `zod` near each procedure.
- Use `protectedProcedure` for user-scoped data mutations/queries.
- Enforce per-user filters at query level (`where(eq(table.userId, session.user.id))`).
- Return consistent payloads (`result[0] ?? null`, `{ success: true }`, etc.).
- Throw structured errors (`TRPCError`) for auth/permission failures.

### Database / Drizzle

- Keep schema authoritative in `lib/db/schema.ts`.
- Prefer migrations or controlled `db:push`; do not hand-edit generated artifacts unless needed.
- Keep enum values consistent across DB schema, Zod schemas, and UI selects.
- Maintain timestamp updates on mutable records (`updatedAt: new Date()`).

### Error Handling and Logging

- Fail fast on auth errors (401/UNAUTHORIZED).
- Validate external input (headers, body, query) before side effects.
- Use `try/catch` around external network calls (e.g., email provider).
- Log actionable context with `console.error` on server-side failures.
- Return safe, structured responses; do not leak secrets.

### Environment and Secrets

- Validate env with `lib/env.ts` (`@t3-oss/env-nextjs` + zod).
- Required server envs include `DATABASE_URL`, `BETTER_AUTH_SECRET`, `CRON_SECRET`, `RESEND_API_KEY`.
- Never hardcode secrets or commit `.env*` files.
- Use `.env.local` for local development values.

## Domain Reference Docs for Agents

- When working with Drizzle ORM, reference: `https://orm.drizzle.team/llms.txt`.
- When working with shadcn/ui, reference: `https://ui.shadcn.com/llms.txt`.
- When working with Resend, reference: `https://resend.com/docs/llms-full.txt`.
- When working with Better Auth, reference: `https://www.better-auth.com/llms.txt`.
- Use these docs to confirm current APIs/patterns before introducing new integrations or refactors.

## Agent Execution Checklist

- Before editing, inspect neighboring files for local patterns.
- Make focused changes; avoid broad refactors unless asked.
- Run `pnpm lint` after meaningful code edits.
- If touching DB schema, run appropriate Drizzle command(s).
- If no automated tests exist for your change, document manual verification steps.
- Update this `AGENTS.md` when conventions or scripts change.

## Notes for Future Test Setup

- Add a `test` script in `package.json` once framework is chosen.
- Add a `test:watch` and `test:single` script for agent ergonomics.
- Keep single-test invocation documented in this file.
