# Spec Delta: fullstack-platform

## ADDED Requirements

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
