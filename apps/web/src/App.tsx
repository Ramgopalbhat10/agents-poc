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

const sampleMessages = [
  {
    from: "You",
    time: "09:32",
    body: "Any updates on the VPN incident and desk availability in Austin?",
  },
  {
    from: "Orchestrator",
    time: "09:33",
    body: "Routing to ServiceNow and Booking agents. Pulling latest status and open desks.",
  },
  {
    from: "Orchestrator",
    time: "09:34",
    body: "ServiceNow: 2 open VPN tickets, SLA in 4h. Booking: 3 desks open in Austin for today.",
  },
];

export default function App() {
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
              {sampleMessages.map((message, index) => (
                <div
                  key={`${message.time}-${index}`}
                  className={`max-w-[78%] rounded-3xl border border-slate-200/70 px-5 py-4 shadow-sm ${
                    message.from === "You"
                      ? "self-end bg-slate-900 text-white"
                      : "bg-white/80 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] opacity-70">
                    <MessageCircle className="h-3 w-3" />
                    {message.from} - {message.time}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed">{message.body}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <Sparkles className="h-4 w-4 text-slate-400" />
              <input
                className="flex-1 bg-transparent text-sm outline-none"
                placeholder="Ask for updates or book a desk..."
              />
              <button className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white">
                Send
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
