# Tasks: standardize-ledger-v2-listing-and-pagination

## 1. Spec

- [x] Extend the fullstack platform spec to require paginated CRUD listing behavior in dashboard modules.

## 2. Shared frontend infrastructure

- [x] Update `useCrudPanel` to own `page`, `pageSize`, `meta`, and page reset behavior.
- [x] Add a reusable pagination component for CRUD screens.

## 3. Screen integration

- [x] Migrate resource panels to consume paginated results instead of fixed-size fetches.
- [x] Migrate the commodity panel to use paginated commodity results while preserving category/unit lookups.
- [x] Migrate the orders panel to use paginated order results and visible totals.

## 4. Verification

- [x] Keep `typecheck`, `lint`, `test`, and `build` passing after the pagination refactor.
- [x] Confirm search, mutation refresh, and page navigation all work through the shared listing pattern.
