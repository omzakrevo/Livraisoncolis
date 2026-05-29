---
name: TELIMA project setup
description: Key conventions, seed data, and gotchas for the TELIMA on-demand delivery platform (Burkina Faso).
---

## Seed accounts (dev)

| Role   | Email                  | Password  |
|--------|------------------------|-----------|
| Admin  | admin@livrelo.bf       | admin123  |
| Client | client@livrelo.bf      | client123 |
| Driver | driver@livrelo.bf      | driver123 |

Admin cannot be created via `/api/auth/register` (enum validates only "client" | "driver").
To add admin users: register as client, then update `role = 'admin'` in DB directly.
Or: register a throwaway client account, copy its bcrypt hash to the desired admin row, then delete the throwaway.

## Database tables

Pricing table is `pricing` (not `pricing_config`). Columns: `id`, `base_delivery_fee`, `commission_rate`, `min_delivery_fee`, `updated_at`. No `price_per_km` column exists in the current schema.

## React Query v5 hook usage

Orval-generated hooks require `queryKey` in options when passing custom query config:
```tsx
useGetMe({ query: { queryKey: getGetMeQueryKey(), retry: false } })
```
Without `queryKey`, TypeScript throws "Property 'queryKey' is missing".

## Order route HTTP methods

Order action routes use PATCH, not POST:
- `PATCH /api/orders/:id/accept`
- `PATCH /api/orders/:id/reject`
- `PATCH /api/orders/:id/status`
- `PATCH /api/orders/:id/confirm-delivery`

**Why:** Matches REST semantics for partial updates; generated URL helpers in api-client-react are correct.

## Driver auto-assignment

On `POST /api/orders`, the server finds the nearest available + verified driver via Haversine distance.
If driver has no GPS coords, distance defaults to Infinity (still assigned if they're the only driver).
30-second timeout in `orderAssignment.ts` — if not accepted, next nearest driver is tried.
