# 10-agent-activity-panel

## Summary
Implement the agent activity sidebar to show routing decisions and tool calls in real time.

## Branching
- Implement this spec in its own branch named `feature/<slug>`.
- Example: `specs/01-monorepo-skeleton.md` => `feature/monorepo-skeleton`.


## Scope
- Add UI panel in `apps/web` showing agent events.
- Stream or poll events from the agents service.
- Display minimal metadata: agent name, tool name, status, timestamp.

## Tasks
- [x] Add UI panel in `apps/web` showing agent events.
- [x] Stream or poll events from the agents service.
- [x] Display minimal metadata: agent name, tool name, status, timestamp.


## Acceptance Criteria
- Panel is visible and updates during a chat run.
- Events are ordered newest-last.
- Works in parallel with the main chat stream.

## Out of Scope
- Full observability dashboards.
- Persistent logs.

## Dependencies
- `specs/08-web-ui-scaffold.md`
- `specs/09-chat-streaming-integration.md`

## References
- PRD: `PRD.md`

## Dev Log
| Date | Entry |
| --- | --- |
| 2026-01-30 | Added an activity sidebar fed by LangGraph update events and agent activity logs. |

## Decisions
- 

## Next Task
- `specs/11-dev-scripts-env.md`
