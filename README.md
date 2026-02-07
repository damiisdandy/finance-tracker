# Finance Tracker

A personal finance dashboard for tracking income, expenses, subscriptions, savings, and cash flow with per-user accounts.

## Features

- Email/password authentication (Better Auth)
- Per-user data isolation for all records
- Dashboard with net worth, cash flow, and category breakdowns
- Savings accounts and savings allocations (treated as transfers, not expenses)
- Multi-currency support with conversion
- Subscriptions tracking and reminders

## Tech Stack

- Next.js App Router
- tRPC + TanStack Query
- Drizzle ORM + Postgres
- Better Auth
- Recharts

## Local Setup

### 1) Install dependencies

```bash
pnpm install
```

### 2) Environment variables

Create `.env.local`:

```env
DATABASE_URL=postgres://user:pass@localhost:5432/finance_tracker
BETTER_AUTH_SECRET=replace_with_32+_chars_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=replace_or_dummy_if_not_sending_emails
CRON_SECRET=your_cron_secret
```

### 3) Database migrations

Generate and apply migrations for the app tables and Better Auth tables:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 4) Seed data

```bash
pnpm db:seed
```

Seeded demo credentials:

- Email: `damilola.jerugba@gmail.com`
- Password: `password123`

### 5) Run the app

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Scripts

- `pnpm dev` - Start the dev server
- `pnpm build` - Build for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm db:migrate` - Run Drizzle migrations
- `pnpm db:push` - Push schema to the database
- `pnpm db:seed` - Seed the database
- `pnpm db:studio` - Open Drizzle Studio

## Notes

- Authentication routes live at `/api/auth/*`.
- All data is scoped by the authenticated user and enforced in tRPC routers.
- Savings allocations are excluded from expense charts and included as a positive allocation in cash flow.
- Monthly savings reminders can be triggered via `GET /api/cron/savings-reminder` with header `Authorization: Bearer $CRON_SECRET`.
