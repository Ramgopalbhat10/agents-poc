# 05-agents-app-skeleton

## Summary
Scaffold the agents service using LangChain.js + LangGraph.js and expose a simple HTTP API for chat requests, served via the LangGraph local dev server.

## Branching
- Implement this spec in its own branch named `feature/<slug>`.
- Example: `specs/01-monorepo-skeleton.md` => `feature/monorepo-skeleton`.


## Scope
- Create `apps/agents` with a LangGraph-compatible project structure.
- Set up LangGraph graph skeleton (orchestrator + placeholder nodes).
- Provide one HTTP endpoint for chat requests (non-streaming first).
- Run locally using `npx @langchain/langgraph-cli dev`.

## Tasks
- [x] Create `apps/agents` with a LangGraph-compatible project structure.
- [x] Set up LangGraph graph skeleton (orchestrator + placeholder nodes).
- [x] Provide one HTTP endpoint for chat requests (non-streaming first).
- [x] Run locally using `npx @langchain/langgraph-cli dev`.


## Acceptance Criteria
- Agents service starts locally via the LangGraph CLI dev server.
- POST request accepts user input and returns a stubbed response.
- LangGraph graph is initialized (even if minimal).

## Out of Scope
- Tool integrations.
- Streaming responses.
- UI integration.

## Dependencies
- `specs/01-monorepo-skeleton.md`

## References
- PRD: `PRD.md`

## Dev Log
| Date | Entry |
| --- | --- |
| 2026-01-30 | Scaffolded the agents app with a LangGraph config, a stub orchestrator graph, and CLI dev server instructions. |

## Decisions
- 

## Next Task
- `specs/06-agent-tools-integration.md`
