# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project state

Atelier Store is an early-stage eCommerce app. The storefront (home page and `/products/[slug]`) reads products, categories and stock from Postgres through Drizzle. There are no carts, orders, payments, reviews, wishlists or product variants yet, and no sign-in methods are enabled. `/collections/*`, `/cart`, `/search` and `/account` are linked from the header but not built.

## Commands

Package manager is pnpm.

```bash
pn run dev          # Next.js dev server
pn run build        # production build
pn run lint         # ESLint (eslint-config-next, flat config)
pn run typecheck    # tsc --noEmit

pn run db:generate  # Drizzle Kit: generate SQL migrations into ./drizzle from src/db/schema.ts
pn run db:migrate   # apply generated migrations
pn run db:push      # push schema straight to the database, no migration files
pn run db:studio    # Drizzle Studio

pn run auth:generate  # Better Auth CLI: write its Drizzle tables to src/db/auth-schema.ts
```

No test framework is installed.

## Environment

Copy `.env.example` to `.env.local`. Next.js loads it automatically; Drizzle Kit runs outside Next.js, so `drizzle.config.ts` loads `.env.local` explicitly with `dotenv`.

- `DATABASE_URL` – Neon Postgres connection string. `src/db/index.ts` calls `neon()` with it at module load, so importing `@/db` without it throws.
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` – read implicitly by Better Auth; they are not referenced in code.
- `NEXT_PUBLIC_APP_URL` – base URL for the Better Auth React client.

## Architecture

Next.js 16 App Router under `src/`, with `@/*` aliased to `src/*`. Tailwind CSS 4 has no PostCSS or `tailwind.config` file: it is loaded through the `@tailwindcss/turbopack` loader rule in `next.config.ts`, and theme tokens live in `src/app/globals.css` under `@theme`. `next.config.ts` also enables `cacheComponents`, `partialPrefetching` and the React Compiler.

The auth request path spans four files:

```
authClient (src/lib/auth-client.ts)            client components
  → src/app/api/auth/[...all]/route.ts         toNextJsHandler(auth), catch-all for /api/auth/*
  → auth (src/lib/auth.ts)                     betterAuth + drizzleAdapter(db, { provider: "pg" })
  → db (src/db/index.ts)                       drizzle over the Neon HTTP driver, with src/db/schema.ts
  → Neon Postgres
```

- `db` from `@/db` is the single database client and `auth` from `@/lib/auth` the single server-side auth entry point.
- The database client uses `drizzle-orm/neon-http`, which is stateless HTTP and does not support interactive transactions. Code that needs them requires switching to the Neon WebSocket/Pool driver.
- `src/db/schema.ts` is the only file Drizzle Kit and the `db` client read; each table file (`catalog-schema.ts`, and `auth-schema.ts` once generated) must be re-exported from it. Better Auth's tables are not there yet, so it logs "Missing tables: user, session, account, verification" at startup and auth calls fail until `pnpm auth:generate` output is re-exported and migrated.

### Database conventions

- Money is stored as integer cents (`price_cents`); only `formatPrice` in `src/data/catalog.ts` converts to dollars.
- Column keys are camelCase in TypeScript and snake_case in SQL. `casing: "snake_case"` must stay set in both `drizzle.config.ts` and `src/db/index.ts`.
- Schema changes go through migrations: `pnpm db:generate`, review the SQL in `./drizzle`, commit it, then `pnpm db:migrate`. Use `db:push` only for throwaway experiments.
- `categories` are product types (Knitwear, Outerwear, ...), not the home-page `collections`, which stay static in `src/data/catalog.ts`.
- Stock lives in its own 1:1 `stock` table (`quantity >= 0`), kept off `products` so stock writes never touch product rows. Stock is per product until variants exist; `products.sizes` is display-only.
- Soft-hide products with `is_active = false` rather than deleting them. `products.category_id` is `ON DELETE RESTRICT`.
- Read products through `src/lib/products.ts` only. Catalog queries are `'use cache'` with `cacheTag("products")`; after changing catalog data call `updateTag("products")` from a Server Action. `getStock` is deliberately uncached and must be called inside `<Suspense>`.
- `pnpm db:seed` is idempotent: it upserts catalog rows but inserts stock only when missing, so it never overwrites live quantities. A build needs seeded data because `generateStaticParams` must return at least one product.
