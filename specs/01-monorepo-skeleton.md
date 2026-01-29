# 01-monorepo-skeleton

## Summary
Create the Bun monorepo workspace skeleton with `apps/` and `packages/` directories and minimal root config to run multiple apps locally.

## Branching
- Implement this spec in its own branch named `feature/<slug>`.
- Example: `specs/01-monorepo-skeleton.md` => `feature/monorepo-skeleton`.


## Scope
- Create directory structure: `apps/`, `packages/`.
- Add root-level config needed for Bun workspaces (minimal, no strict linting).
- Add placeholder READMEs in key folders (optional, short).

## Tasks
- [x] Create directory structure: `apps/`, `packages/`.
- [x] Add root-level config needed for Bun workspaces (minimal, no strict linting).
- [x] Add placeholder READMEs in key folders (optional, short).


## Acceptance Criteria
- Workspace structure exists and is committed to disk.
- Root config recognizes `apps/*` and `packages/*` as workspaces.
- No lint/test tooling is added.

## Out of Scope
- App scaffolding (UI, agents, API).
- Any external dependencies beyond Bun workspace basics.

## Dependencies
- None.

## References
- PRD: `PRD.md`

## Dev Log
| Date | Entry |
| --- | --- |
| 2026-01-29 | Created root `package.json` with Bun workspaces for `apps/*` and `packages/*`. |
| 2026-01-29 | Added `apps/` and `packages/` directories with placeholder READMEs. |

## Decisions
- Minimal root config only (no lint/test tooling) per POC constraints.

## Next Task
- `specs/02-shared-types-schemas.md`
