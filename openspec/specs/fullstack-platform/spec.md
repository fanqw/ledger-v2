# fullstack-platform Specification

## Purpose
Define the stable `v2` platform baseline for `ledger-v2`: a single Next.js fullstack workspace with shared DTOs, Prisma-backed persistence, session auth, repeatable startup commands, and reusable CRUD patterns for future changes.
## Requirements
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

### Requirement: Platform baseline must be contributor-ready

The repository MUST document and preserve a contributor-ready first-run path for the current fullstack platform.

#### Scenario: New contributor boots the platform

- **WHEN** a contributor follows the repository documentation
- **THEN** they can install dependencies, start infrastructure, run migrations and seed data, start the app, and execute verification commands without relying on undocumented setup steps

### Requirement: Generated artifacts must stay outside the source commit boundary

The repository MUST keep generated application outputs and local runtime artifacts outside the intended source commit boundary.

#### Scenario: Workspace contains generated outputs

- **WHEN** build, test, or local runtime commands generate temporary artifacts
- **THEN** those artifacts are excluded by repository ignore rules
- **AND** source review remains focused on authored files only

### Requirement: CRUD UI patterns must be reusable

The frontend platform MUST provide reusable patterns for resource-oriented CRUD screens.

#### Scenario: New CRUD screen is added

- **WHEN** a future module introduces another resource management page
- **THEN** it can reuse shared table, dialog, and data-loading patterns
- **AND** it does not need to copy existing category, unit, commodity, or order orchestration verbatim

### Requirement: Browser-level smoke verification must exist

The platform MUST provide a browser-level smoke path for the core management journey.

#### Scenario: Core journey verification runs

- **WHEN** the verification baseline is executed
- **THEN** it covers login, core catalog creation, order creation, order item creation, and aggregate verification in a real browser flow

### Requirement: CRUD list screens must honor shared pagination contracts

Dashboard CRUD screens MUST consume the shared `page` / `pageSize` / `total` listing contract instead of hardcoding oversized fixed fetches.

#### Scenario: User navigates a management list

- **WHEN** a user opens a category, unit, commodity, or order management list
- **THEN** the screen loads data through explicit `page` and `pageSize` query parameters
- **AND** the screen shows pagination state derived from returned metadata rather than assuming a single oversized page

#### Scenario: User changes keyword or mutates list data

- **WHEN** a user changes the search keyword or creates, updates, or deletes an item
- **THEN** the list reloads through the shared pagination pattern
- **AND** page navigation remains internally consistent with the active result set

