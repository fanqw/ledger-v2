# Design: rebuild-ledger-v2-fullstack-monorepo

## Architecture

`v2` uses one primary runtime application in `apps/web`. The application owns:

- App Router pages for login and dashboard flows.
- Route Handlers under `app/api/*` for internal API boundaries.
- Service and repository layers in `lib/services` and `lib/db`.
- Session authentication through signed cookies.
- Prisma-backed persistence for PostgreSQL.

Shared DTOs and result envelopes live in `packages/shared`, while root workspace files standardize install, lint, typecheck, test, and database generation commands.

## Data Model

The database layer defines six first-class models:

- `User`
- `Category`
- `Unit`
- `Commodity`
- `Order`
- `OrderItem`

`OrderItem` replaces the `v1` `order_commodity` naming. All entities use `createdAt`, `updatedAt`, and nullable `deletedAt` for lifecycle consistency.

## API Boundary

The fullstack application keeps a clear internal API boundary:

- Client components call `/api/*` through Axios.
- Route Handlers validate input, enforce authentication, and return a shared `success/data/error/meta` shape.
- Services own business rules such as duplicate name checks and deletion guards.
- Repositories isolate Prisma access and query shape.

## UI Structure

The UI uses Tailwind-driven reusable primitives and dashboard-specific panels:

- Login page with session establishment.
- Shared shell layout for authenticated routes.
- CRUD panels for categories, units, and commodities.
- Order list and order detail screens.
- Order detail supports create, update, delete, and server-computed totals for line items.

## Verification Strategy

Baseline verification for this change includes:

- `pnpm run db:generate`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run lint`

Further runtime validation can extend to `docker compose up`, Prisma migrations, seed execution, and browser-level checks.
