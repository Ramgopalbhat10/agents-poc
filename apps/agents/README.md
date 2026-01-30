# Agents Service

Run the LangGraph local dev server from this folder:

```
cd apps/agents
npx @langchain/langgraph-cli dev
```

The server exposes HTTP endpoints documented at `http://localhost:2024/docs`.
Default URL: `http://localhost:2024`.

Set `API_BASE_URL` to point tools at the mock API (defaults to `http://localhost:4000`).

## LLM setup (OpenAI-compatible)
- `OPENAI_API_KEY` (required for LLM responses)
- `OPENAI_BASE_URL` (optional for compatible providers)
- `LLM_MODEL` (default: `gpt-5`)

## Notes
- This app uses `@langchain/openai` for LLM calls and `zod`-validated tools.
- TypeScript module resolution is set to `Bundler` in `apps/agents/tsconfig.json`.

## Env
See `.env.example` for required variables.

Example non-streaming request (stateless run):

```
curl -s http://localhost:2024/runs/wait \
  -H "Content-Type: application/json" \
  -d '{"assistant_id":"orchestrator","input":{"messages":[{"role":"user","content":"Any news about security?"}]}}'
```
