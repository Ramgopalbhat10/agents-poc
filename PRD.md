# PRD.md

## Purpose
Build a POC agentic intranet assistant that routes user requests to specialized agents (News, ServiceNow, People, Booking). The assistant runs a ChatGPT-style UI and uses a mock JSON backend for all data operations. No tests, strict linting, or production-grade configs are required.

## Constraints (POC)
- Keep everything simple and local.
- No tests.
- No strict eslint/prettier rules.
- Mock data only (no real integrations).
- Prefer clarity and working demo over perfection.
- No authentication.

## Tech Stack
- Runtime: Bun (except the agents server runtime)
- Monorepo: Bun workspaces
- UI: React + Vite + shadcn/ui + Tailwind CSS v4 (BaseUI preset)
- Agents: LangChain.js + LangGraph.js (run via LangGraph CLI dev server)
- LLM: LangGraph.js streaming with `@langchain/langgraph-sdk` in the UI
- Backend data: Mock JSON server (local)

## High-Level Architecture
- **Orchestrator Agent**
  - Receives the user request.
  - Decides which agent(s) to call.
  - Can call agents sequentially or in parallel.
  - Re-evaluates results and continues until response is sufficient (loop).

- **Specialized Agents**
  - News Agent: company news
  - ServiceNow Agent: tickets/incidents
  - People Agent: employee directory, org info
  - Booking Agent: office space bookings

- **Tools**
  - Each agent has small, single-action tools (e.g., `getLatestNews`, `searchTickets`, `findPeople`, `bookDesk`).
  - Tools call the mock JSON server for data.
  - Tools can be called multiple times per request.

- **Mock JSON Server**
  - Stores all mock data for agents.
  - Supports search and filtering for select endpoints.
  - Local-only and easy to reset.

## Monorepo Structure (Proposed)
```
apps/
  web/                # React + Vite UI
  api/                # Mock JSON server
  agents/             # LangGraph/LangChain orchestrator + agents
packages/
  shared/             # Shared types, utils, schemas
```

## UI (apps/web)
- ChatGPT-style interface with streaming responses.
- Panels:
  - Main chat
  - “agent activity” sidebar (tool calls, routing)
- Must support real-time streaming from agent orchestrator.
- Use `@langchain/langgraph-sdk` React `useStream` hook for streaming.

### UI Guidelines
- Keep UI minimal; focus on POC behavior.
- Use shadcn/ui components where convenient; add via CLI only:
  - `bunx --bun shadcn@latest add alert-dialog`
- Scaffold new web apps with the BaseUI preset:
  - `bunx --bun shadcn@latest create --preset "https://ui.shadcn.com/init?base=base&style=vega&baseColor=neutral&theme=neutral&iconLibrary=lucide&font=inter&menuAccent=subtle&menuColor=default&radius=default&template=vite" --template vite`
- Use the shadcn MCP to explore components before adding them.
- Tailwind v4 setup only (no heavy customization).

## Agents (apps/agents)
### Orchestrator Agent
Responsibilities:
- Parse the user intent.
- Route to specialized agents.
- Decide whether to continue (loop) or respond.
- Merge results from multiple agents.
Agent server runtime:
- Run the agents service via `npx @langchain/langgraph-cli dev` (LangGraph local server).
- Do not use Bun for the agents server runtime.

Routing heuristics (simple):
- Keywords “news”, “announcement” => News Agent
- Keywords “ticket”, “incident”, “SNOW”, “ServiceNow” => ServiceNow Agent
- Keywords “person”, “manager”, “org”, “directory” => People Agent
- Keywords “desk”, “book”, “reservation”, “room” => Booking Agent
- If unclear, ask a clarification question.

### News Agent
Tools (examples):
- `getLatestNews()`
- `getTrendingNews()`
- `searchNews(query)`

### ServiceNow Agent
Tools (examples):
- `listTickets(status?)`
- `searchTickets(query)`
- `getIncident(id)`

### People Agent
Tools (examples):
- `searchPeople(name, team?, location?)`
- `getPerson(id)`
- `getOrgChart(managerId)`

### Booking Agent
Tools (examples):
- `listAvailableDesks(date, location)`
- `bookDesk(userId, deskId, date)`
- `cancelBooking(bookingId)`

## Mock JSON Server (apps/api)
- Start with a Bun-based server that serves a JSON dataset.
- Keep the API surface compatible with json-server conventions for easy swap-in.
- Keep all mock data in a single `db.json` or split by domain.
- Provide search/filtering for:
  - News by `title`, `tags`, `date`
  - Tickets by `status`, `assignee`, `priority`
  - People by `name`, `team`, `location`
  - Bookings by `date`, `location`, `userId`

Example endpoints (suggested):
- `GET /news` (filters: `?q=`, `?tags_like=`, `?date_gte=`)
- `GET /tickets` (filters: `?status=`, `?assignee=`, `?priority=`)
- `GET /people` (filters: `?name_like=`, `?team=`, `?location=`)
- `GET /desks` (filters: `?location=`, `?available=true`)
- `POST /bookings`
- `GET /bookings` (filters: `?userId=`, `?date=`)

## Data Models (Example)
- News: `{ id, title, body, date, tags[] }`
- Ticket: `{ id, title, status, priority, assignee, createdAt }`
- Person: `{ id, name, title, team, managerId, location, email }`
- Desk: `{ id, location, name, amenities[] }`
- Booking: `{ id, userId, deskId, date, status }`

## Agent Loop Behavior
- Each agent/tool returns structured JSON.
- Orchestrator evaluates whether response is sufficient:
  - If yes, respond to user.
  - If no, call more tools/agents.
- Stop conditions:
  - Max tool calls per request (configurable, e.g. 6).
  - Or explicit “need clarification”.

## Streaming
- Use LangGraph streaming to push tokens to the UI.
- UI subscribes to streaming endpoint (SSE or WebSocket).
- Provide a fallback non-streamed response (for debug).

## Config / Env
Minimal env vars:
- `LLM_PROVIDER` (OpenAI-compatible, e.g., `groq`, `openrouter`)
- `LLM_MODEL`
- `API_BASE_URL` (mock server base URL)
- `PORT` (web)
- `AGENTS_PORT` (agent server)
- `MOCK_API_PORT` (json server)

## Scripts (Suggested)
- `bun run dev` — start the mock api (web + agents will join once scaffolded)
- `bun run dev:web` — proxy to `apps/web`
- `bun run dev:agents` — proxy to `apps/agents` (should call `npx @langchain/langgraph-cli dev`)
- `bun run dev:api` — proxy to `apps/api`

## Development Principles
- Prefer small, explicit tools.
- Keep agent orchestration logic readable.
- Avoid overengineering; this is a POC.

## Branching
- Implement each spec in its own branch named `feature/<slug>`.
- Example: `specs/01-monorepo-skeleton.md` => `feature/monorepo-skeleton`.

## Spec Completion Checklist
- Update the spec’s `## Dev Log` as a dated table entry (`YYYY-MM-DD`) describing completed work.
- Add any relevant `## Decisions` entries for tradeoffs or constraints.
- Update `specs/PROGRESS.md` so the current task shows completed status on the active feature branch.
- Keep the spec’s `## Tasks` checklist updated, marking items complete as work finishes.

## Decisions (Confirmed)
- No authentication for the POC.
- Include a visible “agent activity” panel in the UI.
- Start with a Bun-based mock server, keeping json-server compatibility.
- Use a realistic dataset size.
- Target an OpenAI-compatible provider (e.g., Groq or OpenRouter).
