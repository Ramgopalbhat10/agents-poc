import { AIMessage } from "@langchain/core/messages";
import { END, MessagesAnnotation, START, StateGraph } from "@langchain/langgraph";

type GraphState = typeof MessagesAnnotation.State;

type RouteKey = "news" | "servicenow" | "people" | "booking" | "clarify";

const orchestrator = async (_state: GraphState) => ({ });

const routeByIntent = (state: GraphState): RouteKey => {
  const lastMessage = state.messages[state.messages.length - 1];
  const content = typeof lastMessage?.content === "string" ? lastMessage.content.toLowerCase() : "";

  if (content.match(/news|announcement/)) {
    return "news";
  }
  if (content.match(/ticket|incident|snow|servicenow/)) {
    return "servicenow";
  }
  if (content.match(/person|manager|org|directory/)) {
    return "people";
  }
  if (content.match(/desk|book|reservation|room/)) {
    return "booking";
  }

  return "clarify";
};

const makeStub = (label: string) => async (state: GraphState) => {
  const lastMessage = state.messages[state.messages.length - 1];
  const content = typeof lastMessage?.content === "string" ? lastMessage.content : "";
  return {
    messages: [
      new AIMessage(`[stub] ${label} agent received: ${content}`.trim()),
    ],
  };
};

const clarify = async () => ({
  messages: [
    new AIMessage("Can you share a bit more detail so I can route this to the right agent?"),
  ],
});

const graph = new StateGraph(MessagesAnnotation)
  .addNode("orchestrator", orchestrator)
  .addNode("news_agent", makeStub("news"))
  .addNode("servicenow_agent", makeStub("servicenow"))
  .addNode("people_agent", makeStub("people"))
  .addNode("booking_agent", makeStub("booking"))
  .addNode("clarify", clarify)
  .addEdge(START, "orchestrator")
  .addConditionalEdges("orchestrator", routeByIntent, {
    news: "news_agent",
    servicenow: "servicenow_agent",
    people: "people_agent",
    booking: "booking_agent",
    clarify: "clarify",
  })
  .addEdge("news_agent", END)
  .addEdge("servicenow_agent", END)
  .addEdge("people_agent", END)
  .addEdge("booking_agent", END)
  .addEdge("clarify", END)
  .compile();

export { graph };
