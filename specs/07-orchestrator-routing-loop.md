# 07-orchestrator-routing-loop

## Summary
Implement the orchestrator routing logic and iterative loop for multi-tool/agent calls until a sufficient response is produced.

## Branching
- Implement this spec in its own branch named `feature/<slug>`.
- Example: `specs/01-monorepo-skeleton.md` => `feature/monorepo-skeleton`.


## Scope
- Add routing heuristics based on keywords.
- Allow sequential and parallel tool calls (as supported by LangGraph).
- Add a max-steps guard (e.g., 6 tool calls).
- Produce a merged response across agents.

## Tasks
- [x] Add routing heuristics based on keywords.
- [x] Allow sequential and parallel tool calls (as supported by LangGraph).
- [x] Add a max-steps guard (e.g., 6 tool calls).
- [x] Produce a merged response across agents.


## Acceptance Criteria
- Orchestrator routes to at least two different agents correctly.
- Loop stops when response is adequate or max steps hit.
- Clarification question is returned when intent is unclear.

## Out of Scope
- Full LLM-based planner with advanced scoring.
- Multi-user session persistence.

## Dependencies
- `specs/05-agents-app-skeleton.md`
- `specs/06-agent-tools-integration.md`

## References
- PRD: `PRD.md`

## Dev Log
| Date | Entry |
| --- | --- |
| 2026-01-30 | Added orchestrator routing with sequential/parallel fan-out, step guard, and merged agent summaries. |

## Decisions
- 

## Next Task
- `specs/08-web-ui-scaffold.md`
