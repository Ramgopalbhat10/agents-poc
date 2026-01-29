# 03-mock-api-server-bun

## Summary
Create a Bun-based mock API server that serves JSON data with json-server-style query parameters for filtering.

## Scope
- Create `apps/api` with a Bun server.
- Load dataset from a local JSON file (path configurable).
- Implement GET endpoints: `/news`, `/tickets`, `/people`, `/desks`, `/bookings`.
- Support basic query filtering (exact match and `_like` style for strings).

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
- 

## Decisions
- 

## Next Task
- `specs/04-realistic-mock-dataset.md`
