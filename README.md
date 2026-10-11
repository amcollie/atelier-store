# Atelier Store

Next.js (App Router) + TypeScript + Tailwind CSS, with Better Auth, Drizzle ORM and Postgres on Neon.

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in DATABASE_URL and BETTER_AUTH_SECRET
npm run dev
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` / `typecheck` | ESLint / `tsc --noEmit` |
| `npm run db:generate` / `db:migrate` / `db:push` / `db:studio` | Drizzle Kit |
| `npm run auth:generate` | Generate Better Auth's Drizzle tables into `src/db/auth-schema.ts` |

## Structure

- `src/db/index.ts` – Drizzle client (Neon HTTP driver)
- `src/db/schema.ts` – Drizzle schema (empty)
- `src/lib/auth.ts` – Better Auth server instance
- `src/lib/auth-client.ts` – Better Auth React client
- `src/app/api/auth/[...all]/route.ts` – Better Auth route handler
- `drizzle.config.ts` – Drizzle Kit config (reads `.env.local`)
