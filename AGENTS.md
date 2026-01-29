# Repository Guidelines

## Project Structure & Module Organization
This repository currently contains product and implementation specifications. Source code will be added later per the specs.
- `PRD.md`: product requirements, tech stack, and proposed structure.
- `specs/`: numbered build specs and decisions (`ADR.md`, `PROGRESS.md`).
- Proposed app layout (from `PRD.md`):
  - `apps/web` (React + Vite UI)
  - `apps/api` (Bun mock JSON server)
  - `apps/agents` (LangGraph/LangChain agent server)
  - `packages/shared` (shared types/utilities)

## Build, Test, and Development Commands
No runnable scripts exist yet; the following are **planned** commands from `PRD.md`:
- `bun run dev`: start all services (web + agents + mock API).
- `bun run dev:web`: run the web UI.
- `bun run dev:api`: run the mock API server.
- `bun run dev:agents`: run agents via `npx @langchain/langgraph-cli dev` (agents do **not** run on Bun).

## Coding Style & Naming Conventions
- Keep configurations minimal and POC-focused; avoid strict linting and formatting rules.
- Prefer clear, descriptive names for tools and endpoints (e.g., `getLatestNews`, `searchTickets`).
- When adding files, follow the proposed monorepo structure and match spec naming (e.g., `specs/08-web-ui-scaffold.md`).

## UI Scaffolding & shadcn/ui Usage
- For new React + Vite + Tailwind v4 + shadcn/ui scaffolds, use:
  - `bunx --bun shadcn@latest create --preset "https://ui.shadcn.com/init?base=base&style=vega&baseColor=neutral&theme=neutral&iconLibrary=lucide&font=inter&menuAccent=subtle&menuColor=default&radius=default&template=vite" --template vite`
- For adding shadcn/ui components, always use the CLI (e.g., `bunx --bun shadcn@latest add alert-dialog`).
- Use the shadcn MCP to explore available components before adding them.

## Testing Guidelines
- This POC explicitly avoids tests and strict coverage requirements.
- If you add tests anyway, document the framework and add a simple `bun run test` script.

## Commit & Pull Request Guidelines
- No Git history is present in this repository, so no existing commit convention is established.
- If you introduce Git history, use short, imperative commit messages (or Conventional Commits) and keep changes scoped.
- For PRs, include: a brief summary, linked spec/ADR updates, and screenshots for UI changes.

## Branching
- Implement each spec in its own branch named `feature/<slug>`.
- Example: `specs/01-monorepo-skeleton.md` => `feature/monorepo-skeleton`.

## Spec Completion Checklist
- Update the spec’s `## Dev Log` as a dated table entry (`YYYY-MM-DD`) describing completed work.
- Add any relevant `## Decisions` entries for tradeoffs or constraints.
- Update `specs/PROGRESS.md` so the current task shows completed status on the active feature branch.
- Keep the spec’s `## Tasks` checklist updated, marking items complete as work finishes.
- Before starting a new spec, confirm you are on its `feature/<slug>` branch; if not, create/switch first.

## Configuration & Environment Tips
- Expected env vars (per `PRD.md`): `LLM_PROVIDER`, `LLM_MODEL`, `API_BASE_URL`, `PORT`, `AGENTS_PORT`, `MOCK_API_PORT`.
- Keep integrations mocked and local-only; no authentication for this POC.
- If GitHub SSH auth fails, ensure `~/.ssh/config` points `github.com` to `~/.ssh/id_ed25519_codex` with `IdentitiesOnly yes`.

## Agent-Specific Notes
- The agents service must run via the LangGraph CLI dev server, not Bun.
- Orchestrator should route to specialized agents based on simple keyword heuristics and allow a short tool-call loop.
