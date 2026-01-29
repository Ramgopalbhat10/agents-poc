# 09-chat-streaming-integration

## Summary
Add streaming support between the agents service and the web UI using `@langchain/langgraph-sdk`.

## Scope
- Add a streaming endpoint in `apps/agents` (SSE or WebSocket).
- Wire the web UI to consume streaming responses via `@langchain/langgraph-sdk` (React `useStream`).
- Provide a fallback non-streaming mode for local debug.

## Acceptance Criteria
- UI displays partial responses as they stream.
- Streaming endpoint works for at least one sample query.
- Fallback non-streaming path remains available.

## Out of Scope
- Authentication.
- Rate limiting or retries.

## Dependencies
- `specs/05-agents-app-skeleton.md`
- `specs/08-web-ui-scaffold.md`

## References
- PRD: `PRD.md`

## Dev Log
- 

## Decisions
- 

## Next Task
- `specs/10-agent-activity-panel.md`
