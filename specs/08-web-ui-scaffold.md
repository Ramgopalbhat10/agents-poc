# 08-web-ui-scaffold

## Summary
Scaffold the React + Vite web app with Tailwind v4 and shadcn/ui (BaseUI preset), and build the base chat layout.

## Branching
- Implement this spec in its own branch named `feature/<slug>`.
- Example: `specs/01-monorepo-skeleton.md` => `feature/monorepo-skeleton`.


## Scope
- Create `apps/web` via the shadcn CLI BaseUI preset:
  - `bunx --bun shadcn@latest create --preset "https://ui.shadcn.com/init?base=base&style=vega&baseColor=neutral&theme=neutral&iconLibrary=lucide&font=inter&menuAccent=subtle&menuColor=default&radius=default&template=vite" --template vite`
- Set up Tailwind v4 and shadcn/ui (BaseUI).
- Build base layout: chat area and sidebar placeholder.

## Tasks
- [ ] Create `apps/web` via the shadcn CLI BaseUI preset:
- [ ] `bunx --bun shadcn@latest create --preset "https://ui.shadcn.com/init?base=base&style=vega&baseColor=neutral&theme=neutral&iconLibrary=lucide&font=inter&menuAccent=subtle&menuColor=default&radius=default&template=vite" --template vite`
- [ ] Set up Tailwind v4 and shadcn/ui (BaseUI).
- [ ] Build base layout: chat area and sidebar placeholder.


## Implementation Notes
- When adding shadcn/ui components, always use the CLI (e.g., `bunx --bun shadcn@latest add alert-dialog`).
- Use the shadcn MCP to explore components before adding them.

## Acceptance Criteria
- App starts locally with Bun.
- Tailwind styles apply correctly.
- Base layout renders without runtime errors.

## Out of Scope
- Streaming logic.
- Agent wiring.

## Dependencies
- `specs/01-monorepo-skeleton.md`

## References
- PRD: `PRD.md`

## Dev Log
| Date | Entry |
| --- | --- |
|  |  |

## Decisions
- 

## Next Task
- `specs/09-chat-streaming-integration.md`
