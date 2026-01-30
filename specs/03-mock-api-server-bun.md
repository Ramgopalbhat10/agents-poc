# 03-mock-api-server-bun

## Summary
Create a Bun-based mock API server that serves JSON data with json-server-style query parameters for filtering.

## Branching
- Implement this spec in its own branch named `feature/<slug>`.
- Example: `specs/01-monorepo-skeleton.md` => `feature/monorepo-skeleton`.


## Scope
- Create `apps/api` with a Bun server.
- Load dataset from a local JSON file (path configurable).
- Implement GET endpoints: `/news`, `/tickets`, `/people`, `/desks`, `/bookings`.
- Support basic query filtering (exact match and `_like` style for strings).

## Tasks
- [x] Create `apps/api` with a Bun server.
- [x] Load dataset from a local JSON file (path configurable).
- [x] Implement GET endpoints: `/news`, `/tickets`, `/people`, `/desks`, `/bookings`.
- [x] Support basic query filtering (exact match and `_like` style for strings).


## Acceptance Criteria
- Server starts locally and responds with JSON arrays for each endpoint.
- Query params work for at least: `?q=`, `?field=`, `?field_like=`.
- No auth or rate limiting.

## Out of Scope
- Write endpoints (POST/PUT/DELETE) unless trivial to add later.
- Persistence beyond in-memory/file load.

## Dependencies
- `specs/01-monorepo-skeleton.md`
- `specs/02-shared-types-schemas.md`

## References
- PRD: `PRD.md`

## Dev Log
| Date | Entry |
| --- | --- |
| 2026-01-29 | Implemented Bun mock API server with configurable dataset loading and query filters. |
| 2026-01-29 | Added Bun-specific TS config and switched env access to Bun.env to fix TS type errors. |
| 2026-01-29 | Documented requirement to log missed-item corrections in Dev Log entries. |
| 2026-01-29 | Added bun-types dev dependency and reinstalled to resolve Bun type errors. |
| 2026-01-29 | Expanded mock dataset with richer records for news, tickets, people, desks, and bookings. |
| 2026-01-29 | Expanded news bodies to 400-500 words each with a casual tone. |
| 2026-01-30 | Reapplied long-form news bodies after detecting overwrite. |

## Decisions
- Log missed-item fixes in the spec Dev Log when corrections are made.

## Next Task
- `specs/04-realistic-mock-dataset.md`
