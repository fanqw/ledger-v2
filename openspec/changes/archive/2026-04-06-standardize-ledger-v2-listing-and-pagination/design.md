# Design: standardize-ledger-v2-listing-and-pagination

## Context

`@ledger/shared` already defines `PageQuery`, `PageMeta`, `PageData`, `DEFAULT_PAGE`, and `DEFAULT_PAGE_SIZE`. The API routes and services use those semantics correctly. The remaining inconsistency is on the frontend: current resource panels call list endpoints with `pageSize=100`, ignore returned `meta`, and do not provide page navigation.

The existing `useCrudPanel` hook is the right integration point because it already owns keyword state, reload behavior, dialog state, and mutation flow.

## Decisions

### 1. Move pagination orchestration into the shared CRUD hook

`useCrudPanel` will become responsible for:

- current `page`
- current `pageSize`
- received `meta`
- resetting to page 1 on keyword change
- reloading the current page after mutations
- stepping back to the previous page if the current page becomes empty after deletion and there are earlier pages

The hook should accept a paginated `fetchItems` function rather than a keyword-only loader.

### 2. Provide a dedicated pagination component

A lightweight shared pagination component will render:

- current range and total count
- previous / next controls
- page-size selector

It will stay intentionally simple and Tailwind-based so it matches the current UI system without introducing another dependency.

### 3. Keep list endpoints unchanged

The API contract is already correct. This change should not introduce new route shapes or server DTO changes unless a frontend integration gap is discovered.

## Risks and Mitigations

- Reset loops between keyword and page changes:
  handled by centralizing reset logic inside the hook rather than in each panel.
- Deletion on the last item of a page:
  mitigate by letting the hook move back one page when a successful delete empties the current page and earlier pages exist.
- Commodity panel auxiliary lookups:
  keep category/unit lookup behavior intact while only switching the commodity list itself to real pagination.
