import { useMemo, useState } from "react";
import type { Message } from "@langchain/langgraph-sdk";
import { useStream } from "@langchain/langgraph-sdk/react";
import {
  Bell,
  ChevronRight,
  Globe,
  MessageCircle,
  PanelLeft,
  Search,
  Sparkles,
} from "lucide-react";

const quickLinks = [
  { label: "Announcements", meta: "12 new" },
  { label: "Incidents", meta: "3 open" },
  { label: "People", meta: "Directory" },
  { label: "Bookings", meta: "This week" },
];

const focusItems = [
  { label: "VPN access intermittently fails", tone: "high" },
  { label: "Security training week", tone: "info" },
  { label: "Austin office open house", tone: "note" },
];

const API_URL = import.meta.env.VITE_LANGGRAPH_API_URL ?? "http://localhost:2024";
const ASSISTANT_ID = import.meta.env.VITE_LANGGRAPH_ASSISTANT_ID ?? "orchestrator";
const STREAMING_ENABLED = (import.meta.env.VITE_STREAMING ?? "true") !== "false";

type ActivityEvent = {
  agent: string;
  tool: string;
  status: "started" | "completed" | "skipped";
  timestamp: string;
};

export default function App() {
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([]);
  const thread = useStream<{ messages: Message[]; activity?: ActivityEvent[] }>({
    apiUrl: API_URL,
    assistantId: ASSISTANT_ID,
    messagesKey: "messages",
    onUpdateEvent: (data) => {
      const updates = Object.values(data ?? {});
      const nextEvents: ActivityEvent[] = [];
      updates.forEach((update) => {
        const typed = update as { activity?: ActivityEvent[] };
        if (typed?.activity?.length) {
          nextEvents.push(...typed.activity);
        }
      });
      if (nextEvents.length) {
        setActivityEvents((prev) => prev.concat(nextEvents));
      }
    },
  });
  const [message, setMessage] = useState("");
  const [fallbackMessages, setFallbackMessages] = useState<Message[]>([]);
  const [isFallbackLoading, setIsFallbackLoading] = useState(false);

  const messages = useMemo(
    () => (STREAMING_ENABLED ? thread.messages : fallbackMessages),
    [STREAMING_ENABLED, fallbackMessages, thread.messages],
  );

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    setMessage("");
    setActivityEvents([]);

    if (STREAMING_ENABLED) {
      thread.submit({
        messages: [{ type: "human", content: trimmed }],
      }, { streamMode: ["messages", "updates", "events"] });
      return;
    }

    setIsFallbackLoading(true);
    setFallbackMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "human",
        content: trimmed,
      },
    ]);

    try {
      const response = await fetch(`${API_URL}/runs/wait`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assistant_id: ASSISTANT_ID,
          input: { messages: [{ type: "human", content: trimmed }] },
          stream_mode: ["messages", "updates", "events"],
        }),
      });
      const payload = await response.json();
      setFallbackMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: "ai",
          content: JSON.stringify(payload, null, 2),
        },
      ]);
    } catch (error) {
      setFallbackMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: "ai",
          content: `Error: ${(error as Error).message}`,
        },
      ]);
    } finally {
      setIsFallbackLoading(false);
    }
  };

  const renderContent = (content: Message["content"]) => {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return content
        .map((part) => (typeof part === "string" ? part : JSON.stringify(part)))
        .join(" ");
    }
    return JSON.stringify(content);
  };

  return (
    <div className="app-shell text-slate-900">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl gap-6 px-6 py-8">
        <aside className="hidden w-72 shrink-0 flex-col gap-6 rounded-[32px] border border-black/10 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.45)] backdrop-blur md:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <PanelLeft className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Intranet</p>
              <p className="font-[var(--font-display)] text-xl">Signal Desk</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Quick</p>
            <div className="mt-4 space-y-3 text-sm">
              {quickLinks.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-slate-800">{item.label}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
                    {item.meta}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-400">
              <span>Focus</span>
              <ChevronRight className="h-3 w-3" />
            </div>
            <div className="mt-4 space-y-3">
              {focusItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200/70 bg-white/75 px-4 py-3 text-sm text-slate-700 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                    <Sparkles className="h-3 w-3" />
                    {item.tone}
                  </div>
                  <p className="mt-2 text-slate-800">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto rounded-2xl border border-slate-200/70 bg-slate-900 px-4 py-3 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">Status</p>
            <p className="mt-2 text-sm">All systems normal. Next update at 11:00.</p>
          </div>
        </aside>

        <main className="flex flex-1 flex-col gap-6">
          <header className="flex flex-col gap-4 rounded-[32px] border border-black/10 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Today</p>
                <h1 className="font-[var(--font-display)] text-3xl">
                  Agentic Help Desk
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Ask for updates, bookings, or people info. The orchestrator
                  will route it.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm">
                  <Globe className="h-4 w-4" />
                  All hubs
                </button>
                <button className="flex items-center gap-2 rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-sm text-white shadow-sm">
                  <Bell className="h-4 w-4" />
                  Alerts
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <span>Search for incidents, people, or desks</span>
            </div>
          </header>

          <section className="flex flex-1 flex-col gap-6 rounded-[32px] border border-black/10 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-400">
              <span>Conversation</span>
              <span>Live routing</span>
            </div>
            <div className="flex flex-1 flex-col gap-4">
              {messages.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200/70 px-6 py-5 text-sm text-slate-500">
                  Ask something like: “Show me open VPN tickets and desk availability in Austin.”
                </div>
              ) : null}
              {messages.map((item, index) => (
                <div
                  key={`${item.id ?? "msg"}-${index}`}
                  className={`max-w-[78%] rounded-3xl border border-slate-200/70 px-5 py-4 shadow-sm ${
                    item.type === "human"
                      ? "self-end bg-slate-900 text-white"
                      : "bg-white/80 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] opacity-70">
                    <MessageCircle className="h-3 w-3" />
                    {item.type === "human" ? "You" : "Orchestrator"}
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                    {renderContent(item.content)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <Sparkles className="h-4 w-4 text-slate-400" />
              <input
                className="flex-1 bg-transparent text-sm outline-none"
                placeholder="Ask for updates or book a desk..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
              />
              <button
                className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white"
                onClick={() => void sendMessage()}
              >
                {STREAMING_ENABLED ? (thread.isLoading ? "Streaming..." : "Send") : isFallbackLoading ? "Working..." : "Send"}
              </button>
            </div>
          </section>
        </main>

        <aside className="hidden w-72 shrink-0 flex-col gap-4 rounded-[32px] border border-black/10 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.45)] backdrop-blur xl:flex">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-400">
            <span>Activity</span>
            <span>{activityEvents.length} events</span>
          </div>
          <div className="flex-1 space-y-3 overflow-auto pr-1 text-sm">
            {activityEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200/70 px-4 py-3 text-xs text-slate-500">
                Activity will appear as the agents route and call tools.
              </div>
            ) : null}
            {activityEvents.map((event, index) => (
              <div
                key={`${event.timestamp}-${index}`}
                className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm"
              >
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  <span>{event.agent}</span>
                  <span>{event.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-700">{event.tool}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
