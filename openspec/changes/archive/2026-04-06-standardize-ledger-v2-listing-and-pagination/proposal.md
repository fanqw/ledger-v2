# Proposal: standardize-ledger-v2-listing-and-pagination

## Why

The current `v2` dashboard already exposes paginated APIs, but the frontend management panels still behave like temporary admin screens: they fetch a fixed batch size, do not surface result totals, and do not expose stable pagination controls to contributors or users. This creates an architectural mismatch between the shared API contracts and the real UI behavior.

If future modules continue copying the current pattern, the platform will accumulate large-list performance risk and duplicated pagination logic. A dedicated normalization pass is needed before more business modules are layered on top.

## What Changes

- add reusable frontend pagination state and controls for CRUD-style listing screens
- make resource, commodity, and order panels consume real `page` / `pageSize` / `total` metadata
- keep keyword filtering compatible with pagination resets and post-mutation reloads
- extend the platform spec so contributor-ready CRUD screens explicitly include paginated list behavior

## Expected Outcome

After this change, the dashboard list pages should match the shared pagination contract end to end: APIs return metadata, the frontend shows and changes pages intentionally, and future CRUD screens can reuse the same listing pattern instead of hardcoding oversized fetches.
