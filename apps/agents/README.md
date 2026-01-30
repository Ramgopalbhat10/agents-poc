# Agents Service

Run the LangGraph local dev server from this folder:

```
cd apps/agents
npx @langchain/langgraph-cli dev
```

The server exposes HTTP endpoints documented at `http://localhost:2024/docs`.

Example non-streaming request (stateless run):

```
curl -s http://localhost:2024/runs/wait \
  -H "Content-Type: application/json" \
  -d '{"assistant_id":"orchestrator","input":{"messages":[{"role":"user","content":"Any news about security?"}]}}'
```
