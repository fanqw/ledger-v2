# Spec Delta: fullstack-platform

## ADDED Requirements

### Requirement: Workspace-based fullstack repository

The repository MUST use `pnpm workspace` as the top-level package and execution model for `v2`.

#### Scenario: Root workspace commands exist

- **WHEN** a contributor works on `ledger-v2`
- **THEN** install, build, lint, typecheck, test, and database generation commands are available from the repository root
- **AND** implementation code lives under workspace-managed `apps/*` and `packages/*` paths

### Requirement: Single fullstack web application

`v2` MUST implement the product through a single Next.js fullstack application under `apps/web`.

#### Scenario: Application boundary is unified

- **WHEN** a user opens the dashboard
- **THEN** page routes, internal API routes, and service orchestration are hosted in the same application
- **AND** the application does not depend on a separate Express or Nest runtime for core CRUD behavior

### Requirement: Stable internal API contracts

The system MUST expose internal API responses through a shared result envelope and typed DTOs.

#### Scenario: CRUD API returns typed results

- **WHEN** a client calls category, unit, commodity, order, or order item endpoints
- **THEN** the API returns a stable `success/data/error/meta` structure
- **AND** DTOs are defined in shared workspace packages rather than duplicated per page

### Requirement: Session-authenticated dashboard access

The dashboard MUST require an authenticated session established through a signed cookie.

#### Scenario: Anonymous user visits a protected page

- **WHEN** a request targets a protected dashboard route without a valid session cookie
- **THEN** the user is redirected to `/login`

#### Scenario: API request is unauthenticated

- **WHEN** a request targets a protected internal API route without a valid session cookie
- **THEN** the API responds with an unauthorized error

### Requirement: Canonical v2 domain model

The system MUST use a PostgreSQL-backed canonical model consisting of `User`, `Category`, `Unit`, `Commodity`, `Order`, and `OrderItem`.

#### Scenario: Order item replaces v1 naming

- **WHEN** order line data is stored or returned in `v2`
- **THEN** the entity is named `OrderItem`
- **AND** the system does not expose `order_commodity` as a `v2` canonical model name

#### Scenario: Entity lifecycle fields are normalized

- **WHEN** persistent business entities are defined
- **THEN** they use `createdAt`, `updatedAt`, and nullable `deletedAt`
- **AND** they do not rely on `create_at`, `update_at`, or boolean `deleted` as canonical `v2` fields

### Requirement: First-version business coverage

The first `v2` delivery MUST cover login, catalog management, commodity management, order list management, and order detail item management.

#### Scenario: Order detail returns aggregate totals

- **WHEN** a client loads an order detail page
- **THEN** the server returns order header data, order items, and aggregate totals in one result
- **AND** the client does not need to reimplement `v1` aggregation logic locally

#### Scenario: Delete guards preserve referential behavior

- **WHEN** a user attempts to delete a category, unit, commodity, or order that is still referenced by active downstream entities
- **THEN** the operation is rejected with a business error
