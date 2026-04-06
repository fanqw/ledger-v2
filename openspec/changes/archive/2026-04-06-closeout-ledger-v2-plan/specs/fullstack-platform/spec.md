## ADDED Requirements

### Requirement: Baseline CI validation must be repository-native

The repository MUST provide a baseline CI workflow that validates install, type generation, static checks, tests, and build using workspace root commands.

#### Scenario: Contributor opens a pull request

- **WHEN** CI runs on the repository
- **THEN** it executes install, Prisma client generation, typecheck, lint, test, and build
- **AND** the workflow uses workspace-root command entrypoints rather than undocumented local-only scripts
