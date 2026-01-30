import { AIMessage } from "@langchain/core/messages";
import { END, MessagesAnnotation, START, StateGraph } from "@langchain/langgraph";
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

const extractDate = (text: string) => {
  const match = text.match(/\d{4}-\d{2}-\d{2}/);
  return match?.[0] ?? new Date().toISOString().slice(0, 10);
};

const makeStub = (label: string) => async (state: GraphState) => {
  const lastMessage = state.messages[state.messages.length - 1];
  const content = typeof lastMessage?.content === "string" ? lastMessage.content : "";

  if (label === "news") {
    const results = content ? await searchNews(content) : await getLatestNews();
    const trending = await getTrendingNews(3);
    return {
      messages: [
        new AIMessage(
          JSON.stringify({ agent: "news", results, trending }, null, 2),
        ),
      ],
    };
  }

  if (label === "servicenow") {
    const results = content ? await searchTickets(content) : await listTickets();
    const incident = content.match(/inc_\\d+/)?.[0];
    const incidentDetails = incident ? await getIncident(incident) : null;
    return {
      messages: [
        new AIMessage(
          JSON.stringify({ agent: "servicenow", results, incidentDetails }, null, 2),
        ),
      ],
    };
  }

  if (label === "people") {
    const results = content ? await searchPeople(content) : await searchPeople();
    const managerId = content.match(/emp_\\d+/)?.[0];
    const orgChart = managerId ? await getOrgChart(managerId) : null;
    return {
      messages: [
        new AIMessage(
          JSON.stringify({ agent: "people", results, orgChart }, null, 2),
        ),
      ],
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

    return {
      messages: [
        new AIMessage(
          JSON.stringify(
            { agent: "booking", date, availableDesks: desks, bookingAttempt },
            null,
            2,
          ),
        ),
      ],
    };
  }

  return {
    messages: [new AIMessage(`[stub] ${label} agent received: ${content}`.trim())],
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
