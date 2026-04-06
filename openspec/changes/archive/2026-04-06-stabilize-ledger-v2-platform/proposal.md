# Proposal: stabilize-ledger-v2-platform

## Why

The first `v2` delivery has already established a runnable fullstack monorepo, but the repository still has platform-level gaps that will slow down future changes. The root spec still contains placeholder purpose text, the startup path is only partially documented, the current UI layer repeats CRUD patterns across modules, and browser-level acceptance is not yet part of the regular verification baseline.

Without a stabilization pass, the next feature iteration would continue on top of a platform that is usable but not yet cleanly repeatable, documented, or easy to extend.

## What Changes

- finalize and document the stable `v2` platform baseline
- harden repository ignore rules and startup documentation
- extract shared CRUD page patterns into more durable frontend abstractions
- add browser-level end-to-end smoke coverage for login and core CRUD flows
- update OpenSpec main spec purpose and reduce archive-time documentation warnings

## Expected Outcome

After this change, `ledger-v2` should have a cleaner repository baseline, a documented first-run path, less duplicated UI CRUD structure, a repeatable E2E smoke path, and a better-maintained OpenSpec spec surface for future changes.
