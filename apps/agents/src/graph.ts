import { AIMessage, type BaseMessage } from "@langchain/core/messages";
import { Annotation, END, START, StateGraph, messagesStateReducer } from "@langchain/langgraph";
import {
  bookDesk,
  cancelBooking,
  getIncident,
  getLatestNews,
  getOrgChart,
  getPerson,
  getTrendingNews,
  listAvailableDesks,
  listTickets,
  searchNews,
  searchPeople,
  searchTickets,
} from "./tools.js";
import { generateAgentResponse, generateFinalResponse } from "./llm.js";

const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),
  steps: Annotation<number>({
    reducer: (left, right) => left + right,
    default: () => 0,
  }),
  routes: Annotation<RouteKey[]>({
    reducer: (_left, right) => right ?? [],
    default: () => [],
  }),
  pendingRoutes: Annotation<RouteKey[]>({
    reducer: (_left, right) => right ?? [],
    default: () => [],
  }),
  parallel: Annotation<boolean>({
    reducer: (_left, right) => right ?? false,
    default: () => false,
  }),
  agentResults: Annotation<Record<string, unknown>>({
    reducer: (left, right) => ({ ...left, ...right }),
    default: () => ({}),
  }),
});

type GraphState = typeof AgentState.State;

type RouteKey = "news" | "servicenow" | "people" | "booking" | "clarify";

const MAX_STEPS = 6;

const orchestrator = async (state: GraphState) => {
  const lastMessage = state.messages[state.messages.length - 1];
  const content = typeof lastMessage?.content === "string" ? lastMessage.content.toLowerCase() : "";
  const routes = new Set<RouteKey>();

  if (content.match(/news|announcement/)) routes.add("news");
  if (content.match(/ticket|incident|snow|servicenow/)) routes.add("servicenow");
  if (content.match(/person|manager|org|directory/)) routes.add("people");
  if (content.match(/desk|book|reservation|room/)) routes.add("booking");

  const routeList = Array.from(routes);
  const wantsSequential = /sequential|one at a time|step by step/.test(content);
  const wantsParallel = /and|both|together|parallel/.test(content);
  const parallel = !wantsSequential && wantsParallel;

  return {
    routes: routeList,
    pendingRoutes: routeList,
    parallel,
  };
};

const routeByIntent = (state: GraphState) => {
  if (state.steps >= MAX_STEPS) {
    return "finalize";
  }

  if (state.routes.length === 0) {
    return "clarify";
  }

  if (state.parallel && state.routes.length > 1) {
    return state.routes.map((route) => `${route}_agent`);
  }

  return `${state.routes[0]}_agent`;
};

const extractDate = (text: string) => {
  const match = text.match(/\d{4}-\d{2}-\d{2}/);
  return match?.[0] ?? new Date().toISOString().slice(0, 10);
};

const makeStub = (label: string) => async (state: GraphState) => {
  const lastMessage = state.messages[state.messages.length - 1];
  const content = typeof lastMessage?.content === "string" ? lastMessage.content : "";
  const question = content || "Provide the latest available information.";

  if (label === "news") {
    const results = content ? await searchNews(content) : await getLatestNews();
    const trending = await getTrendingNews(3);
    const responseText = await generateAgentResponse({
      agent: "news",
      question,
      toolData: { results, trending },
    });
    return {
      steps: 1,
      pendingRoutes: state.parallel
        ? state.pendingRoutes
        : state.pendingRoutes.filter((route) => route !== label),
      agentResults: { [label]: { results, trending, responseText } },
      messages: [new AIMessage(responseText)],
    };
  }

  if (label === "servicenow") {
    const results = content ? await searchTickets(content) : await listTickets();
    const incident = content.match(/inc_\\d+/)?.[0];
    const incidentDetails = incident ? await getIncident(incident) : null;
    const responseText = await generateAgentResponse({
      agent: "servicenow",
      question,
      toolData: { results, incidentDetails },
    });
    return {
      steps: 1,
      pendingRoutes: state.parallel
        ? state.pendingRoutes
        : state.pendingRoutes.filter((route) => route !== label),
      agentResults: { [label]: { results, incidentDetails, responseText } },
      messages: [new AIMessage(responseText)],
    };
  }

  if (label === "people") {
    const results = content ? await searchPeople(content) : await searchPeople();
    const managerId = content.match(/emp_\\d+/)?.[0];
    const orgChart = managerId ? await getOrgChart(managerId) : null;
    const responseText = await generateAgentResponse({
      agent: "people",
      question,
      toolData: { results, orgChart },
    });
    return {
      steps: 1,
      pendingRoutes: state.parallel
        ? state.pendingRoutes
        : state.pendingRoutes.filter((route) => route !== label),
      agentResults: { [label]: { results, orgChart, responseText } },
      messages: [new AIMessage(responseText)],
    };
  }

  if (label === "booking") {
    const date = extractDate(content);
    const desks = await listAvailableDesks(date);
    const bookingId = content.match(/book_\\d+/)?.[0];
    const deskId = content.match(/desk_[a-z]+_\\d+/)?.[0] ?? "";
    const userId = content.match(/emp_\\d+/)?.[0] ?? "";
    const bookingAttempt = bookingId
      ? await cancelBooking(bookingId)
      : deskId && userId
        ? await bookDesk(userId, deskId, date)
        : null;
    const responseText = await generateAgentResponse({
      agent: "booking",
      question,
      toolData: { date, availableDesks: desks, bookingAttempt },
    });

    return {
      steps: 1,
      pendingRoutes: state.parallel
        ? state.pendingRoutes
        : state.pendingRoutes.filter((route) => route !== label),
      agentResults: { [label]: { availableDesks: desks, bookingAttempt, responseText } },
      messages: [new AIMessage(responseText)],
    };
  }

  return {
    steps: 1,
    pendingRoutes: state.parallel
      ? state.pendingRoutes
      : state.pendingRoutes.filter((route) => route !== label),
    messages: [new AIMessage(`[stub] ${label} agent received: ${content}`.trim())],
  };
};

const clarify = async () => ({
  messages: [
    new AIMessage("Can you share a bit more detail so I can route this to the right agent?"),
  ],
});

const mergeResults = async (state: GraphState) => {
  const done = state.parallel || state.pendingRoutes.length === 0;
  const shouldSummarize = done && state.routes.length > 1;

  if (!shouldSummarize) {
    return {
      pendingRoutes: state.parallel ? [] : state.pendingRoutes,
    };
  }

  const lastMessage = state.messages[state.messages.length - 1];
  const question = typeof lastMessage?.content === "string" ? lastMessage.content : "";

  const summaryText = await generateFinalResponse({
    question,
    agentSummaries: state.agentResults,
  });

  return {
    pendingRoutes: [],
    messages: [new AIMessage(summaryText)],
  };
};

const routeNext = (state: GraphState) => {
  if (state.steps >= MAX_STEPS) {
    return END;
  }

  if (state.pendingRoutes.length === 0) {
    return END;
  }

  return `${state.pendingRoutes[0]}_agent`;
};

const graph = new StateGraph(AgentState)
  .addNode("orchestrator", orchestrator)
  .addNode("news_agent", makeStub("news"))
  .addNode("servicenow_agent", makeStub("servicenow"))
  .addNode("people_agent", makeStub("people"))
  .addNode("booking_agent", makeStub("booking"))
  .addNode("clarify", clarify)
  .addNode("merge", mergeResults)
  .addNode("finalize", mergeResults)
  .addEdge(START, "orchestrator")
  .addConditionalEdges("orchestrator", routeByIntent, {
    news_agent: "news_agent",
    servicenow_agent: "servicenow_agent",
    people_agent: "people_agent",
    booking_agent: "booking_agent",
    clarify: "clarify",
    finalize: "finalize",
  })
  .addEdge("news_agent", "merge")
  .addEdge("servicenow_agent", "merge")
  .addEdge("people_agent", "merge")
  .addEdge("booking_agent", "merge")
  .addEdge("clarify", END)
  .addEdge("finalize", END)
  .addConditionalEdges("merge", routeNext, {
    [END]: END,
    news_agent: "news_agent",
    servicenow_agent: "servicenow_agent",
    people_agent: "people_agent",
    booking_agent: "booking_agent",
  })
  .compile();

export { graph };
