# 11-dev-scripts-env

## Summary
Add minimal dev scripts and environment configuration for running the full POC locally.

## Branching
- Implement this spec in its own branch named `feature/<slug>`.
- Example: `specs/01-monorepo-skeleton.md` => `feature/monorepo-skeleton`.


## Scope
- Add root `dev` scripts to run `web`, `agents`, and `api` together.
- Run agents via `npx @langchain/langgraph-cli dev` (not Bun).
- Add `.env.example` files per app with required variables.
- Document ports and base URLs in each app README (short).

## Acceptance Criteria
- `bun run dev` starts all services.
- Each app has a minimal `.env.example` with required vars.
- No strict linting or testing configs added.

## Out of Scope
- CI/CD pipelines.
- Production deployment configs.

## Dependencies
- `specs/01-monorepo-skeleton.md`
- `specs/03-mock-api-server-bun.md`
- `specs/05-agents-app-skeleton.md`
- `specs/08-web-ui-scaffold.md`

## References
- PRD: `PRD.md`

## Dev Log
- 

## Decisions
- 

## Next Task
- None.
