# Tasks: stabilize-ledger-v2-platform

## 1. Spec and docs stabilization

- [x] Update `openspec/specs/fullstack-platform/spec.md` Purpose to a non-placeholder description.
- [x] Update `README.md` to document the complete first-run flow: install, compose, migrate, seed, start, validate.
- [x] Normalize OpenSpec proposal structure so new changes follow `Why` / `What Changes` expectations.

## 2. Repository hygiene

- [x] Tighten `.gitignore` so generated outputs such as `.next`, coverage, and local artifacts are clearly excluded.
- [x] Verify source-only commit boundaries for workspace packages and app code.

## 3. Frontend platform refactor

- [x] Extract reusable CRUD list/dialog behavior from current resource panels into shared hooks or components.
- [x] Reduce duplicated data-loading and mutation orchestration across categories, units, commodities, and orders.
- [x] Clarify Redux responsibility boundaries so shell/session state remains global and business data stays module-local unless justified.

## 4. Verification upgrade

- [x] Add browser-level smoke automation for login and core CRUD flows.
- [x] Keep existing typecheck, lint, test, build, and HTTP smoke validations passing after the refactor.

## 5. Acceptance

- [x] Confirm README-based first-run flow is sufficient without relying on tribal knowledge.
- [ ] Confirm the E2E smoke path covers the critical user journey end to end.

E2E note: the Playwright smoke spec and config are now in place, but a full local run is still environment-dependent because `smoke:e2e` currently resolves `@playwright/test` via `npx`, which failed under restricted registry access during verification.
