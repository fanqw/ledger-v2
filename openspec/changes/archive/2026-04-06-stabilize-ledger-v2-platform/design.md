# Design: stabilize-ledger-v2-platform

## Summary

This change is a platform-hardening pass, not a new business feature pass. It keeps the current `v2` business scope intact and improves the repository in four directions:

- documentation and OpenSpec consistency
- repository hygiene and ignore rules
- frontend CRUD abstraction quality
- verification depth

## Documentation and spec layer

The archived first change already promoted `fullstack-platform` into the main spec, but the spec purpose is still placeholder text. This change updates the main spec to describe the actual role of the platform and aligns repository docs with the current first-run flow.

The README should become sufficient for a contributor to:

- install dependencies
- start infrastructure
- run migration and seed
- start the app
- execute validation commands

## Repository hygiene

The repository currently contains generated directories under `apps/web/.next` and runtime artifacts under local work areas. The stabilization pass should ensure ignore rules clearly exclude generated outputs and keep the commit boundary aligned with source artifacts only.

## Frontend architecture

The first pass intentionally prioritized shipping the full flow. As a result, CRUD panels for categories, units, commodities, orders, and order details still contain repeated local state, request, form, and dialog orchestration.

This change should move toward a reusable pattern:

- module-scoped data hooks for list and mutation flows
- reusable CRUD dialog and resource-table conventions
- clearer distinction between shell state and business data state

Redux should remain focused on global shell/session concerns unless a shared cross-page business state is justified.

## Verification

The current baseline already includes static checks and HTTP smoke. This change adds browser-level smoke validation as a first-class verifier path. The initial E2E surface should stay small and cover:

- login
- category creation
- unit creation
- commodity creation
- order creation
- order item creation
- order aggregate verification

## Constraints

- do not expand business scope
- do not reintroduce `v1` API compatibility
- do not split the app into multiple runtimes
- keep the current domain model and session architecture intact
