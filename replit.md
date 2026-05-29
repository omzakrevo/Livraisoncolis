# Livrelo

Plateforme de livraison à la demande pour le Burkina Faso. Trois interfaces : Client, Livreur (Driver) et Admin.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at `/api`)
- `pnpm --filter @workspace/delivery-platform run dev` — run the frontend (port 20065, proxied at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — session encryption key

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 + express-session (cookie-based auth)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Frontend: React 19 + Vite 7, TanStack Query, wouter, shadcn/ui, Tailwind v4
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/src/schema/` — Drizzle DB schemas (users, drivers, orders, notifications, partners, products, pricing)
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth for API)
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks (do not edit)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/api-server/src/lib/orderAssignment.ts` — nearest-driver assignment logic (Haversine, 30s timeout)
- `artifacts/delivery-platform/src/pages/` — React pages (public, client, driver, admin)
- `artifacts/delivery-platform/src/lib/auth.tsx` — AuthContext with useGetMe hook
- `artifacts/delivery-platform/src/index.css` — Tailwind theme (warm West African palette)

## Architecture decisions

- **Contract-first API**: OpenAPI spec is written first; React hooks and Zod schemas are generated from it. Never edit generated files.
- **Cookie sessions**: Express-session with `SESSION_SECRET` — no JWT. Sessions are httpOnly cookies.
- **Order assignment**: On `POST /api/orders`, the server immediately finds the nearest available verified driver (Haversine distance). If the driver doesn't accept within 30 seconds, the system reassigns to the next nearest.
- **OTP delivery confirmation**: A 4-digit OTP is generated at order creation and shown to the client. The driver enters it on delivery to complete the order.
- **Public register only allows client/driver**: Admin users must be seeded directly in the database.

## Product

- **Client**: registers, creates delivery or errand orders, tracks status, views OTP code, receives notifications
- **Driver**: toggles availability, accepts/rejects assigned orders, updates order status through pickup → delivery, enters OTP to confirm delivery
- **Admin**: full dashboard with order management, client/driver moderation, partner & product catalog, pricing configuration, revenue stats

## Seed data (dev)

| Role   | Email                  | Password   |
|--------|------------------------|------------|
| Admin  | admin@livrelo.bf       | admin123   |
| Client | client@livrelo.bf      | client123  |
| Driver | driver@livrelo.bf      | driver123  |

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Pricing table is called `pricing` (not `pricing_config`), no `price_per_km` column.
- Admin cannot be created via `/api/auth/register` (role validation rejects it) — seed via direct SQL with a bcrypt hash.
- When calling generated hooks, React Query v5 requires `queryKey` in the options object. Use the generated `get*QueryKey()` helpers.
- Always run `pnpm --filter @workspace/api-spec run codegen` after editing `openapi.yaml`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
