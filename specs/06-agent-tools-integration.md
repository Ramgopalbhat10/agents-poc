# 06-agent-tools-integration

## Summary
Implement tool functions for each agent and connect them to the mock API.

## Branching
- Implement this spec in its own branch named `feature/<slug>`.
- Example: `specs/01-monorepo-skeleton.md` => `feature/monorepo-skeleton`.


## Scope
- News tools: `getLatestNews`, `getTrendingNews`, `searchNews`.
- ServiceNow tools: `listTickets`, `searchTickets`, `getIncident`.
- People tools: `searchPeople`, `getPerson`, `getOrgChart`.
- Booking tools: `listAvailableDesks`, `bookDesk`, `cancelBooking`.
- Wire tools to the mock API base URL.

## Tasks
- [x] News tools: `getLatestNews`, `getTrendingNews`, `searchNews`.
- [x] ServiceNow tools: `listTickets`, `searchTickets`, `getIncident`.
- [x] People tools: `searchPeople`, `getPerson`, `getOrgChart`.
- [x] Booking tools: `listAvailableDesks`, `bookDesk`, `cancelBooking`.
- [x] Wire tools to the mock API base URL.


## Acceptance Criteria
- Each tool performs a real HTTP call to the mock API.
- Tools return structured JSON results.
- Minimal error handling (return empty arrays or error messages).

## Out of Scope
- Advanced ranking or embeddings.
- Real ServiceNow/HR integrations.

## Dependencies
- `specs/03-mock-api-server-bun.md`
- `specs/04-realistic-mock-dataset.md`
- `specs/05-agents-app-skeleton.md`

## References
- PRD: `PRD.md`

## Dev Log
| Date | Entry |
| --- | --- |
| 2026-01-30 | Implemented agent tools to call the mock API and wired them into the stub agent nodes. |

## Decisions
- 

## Next Task
- `specs/07-orchestrator-routing-loop.md`
