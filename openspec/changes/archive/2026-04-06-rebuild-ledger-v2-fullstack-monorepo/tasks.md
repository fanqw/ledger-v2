# Tasks: rebuild-ledger-v2-fullstack-monorepo

## 1. Workspace foundation

- [x] Add root `package.json`, `pnpm-workspace.yaml`, shared config package, shared DTO package, and formatting config.
- [x] Add Docker Compose, environment template, and update repository documentation.

## 2. Fullstack application scaffold

- [x] Create `apps/web` with Next.js App Router, Tailwind, Redux store, Axios client, and reusable UI primitives.
- [x] Add middleware and session utilities for cookie-based authentication.

## 3. Data and service layer

- [x] Add Prisma schema for `User`, `Category`, `Unit`, `Commodity`, `Order`, and `OrderItem`.
- [x] Add repository and service layers for authentication, catalog CRUD, order CRUD, and order item CRUD.
- [x] Add Prisma seed script for the default administrator account.

## 4. User-facing flows

- [x] Rebuild login page and authenticated dashboard shell.
- [x] Rebuild category, unit, commodity, order list, and order detail flows.
- [x] Return order detail with server-side line-item totals and summary fields.

## 5. Verification

- [x] Generate Prisma client.
- [x] Pass typecheck.
- [x] Pass tests.
- [x] Pass lint.
- [x] Pass production build.
- [x] Complete runtime smoke validation for login, catalog CRUD, order creation, order item creation, and order aggregate reads.

## 6. Follow-up

- [ ] Add Prisma migrations and first-run database bootstrap instructions.
- [ ] Add browser-level end-to-end verification for login and core CRUD paths.
- [ ] Archive this change after runtime validation is complete.
