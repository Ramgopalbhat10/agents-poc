# ADR

## ADR-0001: POC Baseline Architecture
Date: 2026-01-28

### Context
Need a simple POC for an agentic intranet assistant with a ChatGPT-style UI, mock data backend, and multiple specialized agents routed by an orchestrator.

### Decision
- No authentication for the POC.
- Use Bun workspaces with apps: `web`, `agents`, `api` and a `shared` package.
- Use a Bun-based mock server compatible with json-server-style queries.
- Include an agent activity sidebar in the UI.
- Target OpenAI-compatible providers (e.g., Groq or OpenRouter).
- Keep configuration minimal; no tests or strict linting.

### Consequences
- Faster local setup and iteration.
- Mock API behavior should remain compatible with json-server to allow swapping later.
- Security and production hardening are out of scope.

## ADR-0002: LangGraph Local Server + SDK Streaming
Date: 2026-01-28

### Context
LangGraph agent server does not currently run on Bun; streaming in the UI should use the official LangGraph SDK.

### Decision
- Run the agents service using `npx @langchain/langgraph-cli dev`.
- Use `@langchain/langgraph-sdk` (React `useStream`) for UI streaming.
- Keep Bun for all other apps (web and mock API).

### Consequences
- Dev scripts must invoke the LangGraph CLI for the agents service.
- UI streaming relies on LangGraph SDK patterns.
