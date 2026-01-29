# 02-shared-types-schemas

## Summary
Add a shared types package for core domain models (news, tickets, people, desks, bookings) used by agents, API, and UI.

## Scope
- Create `packages/shared`.
- Define TypeScript types/interfaces for the core models.
- Export types from a single entry point.

## Acceptance Criteria
- Shared package exists and is referenced by path (no publish needed).
- Types cover fields listed in `PRD.md` data models.
- No runtime validation required (types only).

## Out of Scope
- Schema validation (zod, io-ts).
- Mock data generation.

## Dependencies
- `specs/01-monorepo-skeleton.md`

## References
- PRD: `PRD.md`

## Dev Log
- 

## Decisions
- 

## Next Task
- `specs/03-mock-api-server-bun.md`
