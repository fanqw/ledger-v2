## ADDED Requirements

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
