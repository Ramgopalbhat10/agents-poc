# 04-realistic-mock-dataset

## Summary
Create a realistic mock dataset for news, tickets, people, desks, and bookings.

## Branching
- Implement this spec in its own branch named `feature/<slug>`.
- Example: `specs/01-monorepo-skeleton.md` => `feature/monorepo-skeleton`.


## Scope
- Create a JSON dataset file used by the mock API.
- Include realistic quantities and variety across fields (names, teams, locations, statuses).
- Ensure referential consistency (e.g., booking deskId exists).

## Tasks
- [x] Create a JSON dataset file used by the mock API.
- [x] Include realistic quantities and variety across fields (names, teams, locations, statuses).
- [x] Ensure referential consistency (e.g., booking deskId exists).


## Acceptance Criteria
- Dataset file exists and loads in the mock API without errors.
- Each collection has enough records to demo searching and filtering.
- IDs are unique and consistent across relations.

## Out of Scope
- Automated data generation scripts (optional later).
- Localization/multi-language data.

## Dependencies
- `specs/02-shared-types-schemas.md`
- `specs/03-mock-api-server-bun.md`

## References
- PRD: `PRD.md`

## Dev Log
| Date | Entry |
| --- | --- |
| 2026-01-30 | Verified and expanded the mock dataset with additional people, desks, bookings, and tickets while maintaining referential consistency. |

## Decisions
- 

## Next Task
- `specs/05-agents-app-skeleton.md`
