import OpenAI from "openai";

const DEFAULT_MODEL = "gpt-5";

const model = process.env.LLM_MODEL ?? process.env.OPENAI_MODEL ?? DEFAULT_MODEL;
const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL;

const client = apiKey
  ? new OpenAI({
      apiKey,
      baseURL,
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

  const response = await client.responses.create({
    model,
    input: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: `You are the ${agent} agent for an internal help desk. Use the tool data to answer the user's question. Keep the response concise, structured, and grounded in the data. If data is empty, say so plainly.`,
          },
        ],
      },
      {
        role: "user",
        content: [
          { type: "text", text: `User question: ${question}` },
          { type: "text", text: `Tool data: ${JSON.stringify(toolData)}` },
        ],
      },
    ],
  });

  return response.output_text ?? "(no response)";
};

export const generateFinalResponse = async (params: {
  question: string;
  agentSummaries: Record<string, unknown>;
}) => {
  const { question, agentSummaries } = params;
  if (!client) {
    return formatFallback("final response", { question, agentSummaries });
  }

  const response = await client.responses.create({
    model,
    input: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: "You are the orchestrator. Merge agent summaries into a single, clear response. Prefer bullets, cite which agent provided which info when helpful.",
          },
        ],
      },
      {
        role: "user",
        content: [
          { type: "text", text: `User question: ${question}` },
          { type: "text", text: `Agent summaries: ${JSON.stringify(agentSummaries)}` },
        ],
      },
    ],
  });

  return response.output_text ?? "(no response)";
};
