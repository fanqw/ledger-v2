# Proposal: closeout-ledger-v2-plan

## Why

The v2 refactor is functionally complete for the core business chain, but the original plan still has closeout gaps around repeatable CI validation and explicit final acceptance handoff. Without this final pass, quality signals remain partially manual and future contributors cannot rely on repository-native automation for baseline checks.

## What Changes

- add a baseline GitHub Actions CI workflow for install, typecheck, lint, test, and build
- align workflow environment with current workspace and web app scripts
- finalize OpenSpec closeout records for the plan completion stage
- document final validation status and residual operational risks

## Expected Outcome

After this change, the repository has plan-level closeout completeness: core refactor features are archived, CI baseline is in place, and the final review/acceptance record is traceable through OpenSpec artifacts.
