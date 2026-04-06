# Proposal: rebuild-ledger-v2-fullstack-monorepo

## Summary

Rebuild `ledger-v2` as a TypeScript fullstack monorepo centered on a single Next.js application, replacing the `v1` split React/Express/Mongo structure with a unified App Router, Prisma, PostgreSQL, Redis, and workspace-based delivery model.

## Motivation

The current repository only preserves `v1` as a migration reference. `v1` mixes UI, API, and data concerns across separate projects and lacks a reusable fullstack boundary, shared types, stable validation, and repeatable local delivery. The repository also needs a documented `v2` target architecture that future iterations can extend without copying `v1` structure.

## Goals

- Establish `pnpm workspace` as the repository root workflow.
- Build a single `apps/web` fullstack application with Next.js App Router.
- Define stable `v2` entities: `User`, `Category`, `Unit`, `Commodity`, `Order`, `OrderItem`.
- Provide session-based authentication and internal Route Handlers.
- Rebuild the login, catalog, commodity, order list, and order detail flows.
- Add Prisma schema, Docker Compose, shared DTOs, and baseline verification commands.

## Non-Goals

- Migrate historical MongoDB data from `v1`.
- Preserve `v1` API shapes or route conventions.
- Introduce multi-role RBAC or separate worker services in the first version.

## Impact

- Repository layout changes from a `v1` reference folder to a workspace-driven `v2` implementation.
- Public internal API contracts are redefined under the new shared DTO model.
- Development, validation, and deployment commands move to root `pnpm` scripts and Docker Compose.
