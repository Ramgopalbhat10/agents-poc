import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

const DEFAULT_MODEL = "gpt-5";

const modelName = process.env.LLM_MODEL ?? process.env.OPENAI_MODEL ?? DEFAULT_MODEL;
const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL;

const client = apiKey
  ? new ChatOpenAI({
      model: modelName,
      apiKey,
      configuration: baseURL ? { baseURL } : undefined,
    })
  : null;

const formatFallback = (title: string, payload: unknown) => {
  return `${title} (LLM not configured)\n\n${JSON.stringify(payload, null, 2)}`;
};

export const generateAgentResponse = async (params: {
  agent: string;
  question: string;
  toolData: unknown;
}) => {
  const { agent, question, toolData } = params;
  if (!client) {
    return formatFallback(`${agent} response`, { question, toolData });
  }

  const response = await client.invoke([
    new SystemMessage(
      `You are the ${agent} agent for an internal help desk. Use the tool data to answer the user's question. Keep the response concise, structured, and grounded in the data. If data is empty, say so plainly.`,
    ),
    new HumanMessage(
      `User question: ${question}\nTool data: ${JSON.stringify(toolData)}`,
    ),
  ]);

  if (typeof response.content === "string") {
    return response.content;
  }
  if (Array.isArray(response.content)) {
    return response.content
      .map((part) => (typeof part === "string" ? part : JSON.stringify(part)))
      .join(" ");
  }
  return JSON.stringify(response.content ?? "(no response)");
};

export const generateFinalResponse = async (params: {
  question: string;
  agentSummaries: Record<string, unknown>;
}) => {
  const { question, agentSummaries } = params;
  if (!client) {
    return formatFallback("final response", { question, agentSummaries });
  }

  const response = await client.invoke([
    new SystemMessage(
      "You are the orchestrator. Merge agent summaries into a single, clear response. Prefer bullets, cite which agent provided which info when helpful.",
    ),
    new HumanMessage(
      `User question: ${question}\nAgent summaries: ${JSON.stringify(agentSummaries)}`,
    ),
  ]);

  if (typeof response.content === "string") {
    return response.content;
  }
  if (Array.isArray(response.content)) {
    return response.content
      .map((part) => (typeof part === "string" ? part : JSON.stringify(part)))
      .join(" ");
  }
  return JSON.stringify(response.content ?? "(no response)");
};
