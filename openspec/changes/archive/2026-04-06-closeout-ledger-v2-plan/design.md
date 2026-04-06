# Design: closeout-ledger-v2-plan

## Scope

This closeout change is intentionally narrow and does not alter domain behavior or API contracts. It focuses on engineering completion criteria from the original refactor plan.

## Decisions

### 1. Introduce one baseline CI workflow

Create `.github/workflows/ci.yml` with a single `web` job that runs on pull requests and pushes to mainline branches.

Job steps:

1. checkout
2. setup `pnpm` and Node
3. `pnpm install --frozen-lockfile`
4. `pnpm run db:generate`
5. `pnpm run typecheck`
6. `pnpm run lint`
7. `pnpm run test`
8. `pnpm run build`

No external service containers are required for this baseline because current tests are not DB integration tests.

### 2. Keep E2E as non-blocking in CI baseline

Browser smoke remains valuable but environment-dependent. It is kept outside mandatory baseline CI to avoid flaky pipeline behavior during closeout.

### 3. Closeout evidence in OpenSpec

Record acceptance and execution context in this change and archive it after validation.

## Risks

- CI may expose hidden script instability in clean environments.
- `next lint` deprecation warning remains and should be handled in a future maintenance change.
