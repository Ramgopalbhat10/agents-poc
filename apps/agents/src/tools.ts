import { tool } from "@langchain/core/tools";
import * as z from "zod";

const DEFAULT_API_BASE_URL = "http://localhost:4000";

const apiBaseUrl = process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL;

type JsonRecord = Record<string, unknown>;

const fetchJson = async (path: string, params?: Record<string, string | undefined>) => {
  const url = new URL(path, apiBaseUrl);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
};

const sortByDateDesc = (items: JsonRecord[], field = "date") =>
  [...items].sort((a, b) => String(b[field] ?? "").localeCompare(String(a[field] ?? "")));

const getLatestNewsTool = tool(
  async ({ limit }: { limit?: number }) => {
    const items = (await fetchJson("/news")) as JsonRecord[];
    return sortByDateDesc(items, "date").slice(0, limit ?? 5);
  },
  {
    name: "getLatestNews",
    description: "Get the latest news items.",
    schema: z.object({ limit: z.number().int().min(1).max(20).optional() }),
  },
);

const getTrendingNewsTool = tool(
  async ({ limit }: { limit?: number }) => {
    const items = (await fetchJson("/news")) as JsonRecord[];
    return sortByDateDesc(items, "date").slice(0, limit ?? 5);
  },
  {
    name: "getTrendingNews",
    description: "Get trending news items.",
    schema: z.object({ limit: z.number().int().min(1).max(20).optional() }),
  },
);

const searchNewsTool = tool(
  async ({ query }: { query: string }) => {
    return (await fetchJson("/news", { q: query })) as JsonRecord[];
  },
  {
    name: "searchNews",
    description: "Search news items by keyword.",
    schema: z.object({ query: z.string().min(1) }),
  },
);

const listTicketsTool = tool(
  async ({ status }: { status?: string }) => {
    return (await fetchJson("/tickets", status ? { status } : undefined)) as JsonRecord[];
  },
  {
    name: "listTickets",
    description: "List tickets with an optional status filter.",
    schema: z.object({ status: z.string().min(1).optional() }),
  },
);

const searchTicketsTool = tool(
  async ({ query }: { query: string }) => {
    return (await fetchJson("/tickets", { q: query })) as JsonRecord[];
  },
  {
    name: "searchTickets",
    description: "Search tickets by keyword.",
    schema: z.object({ query: z.string().min(1) }),
  },
);

const getIncidentTool = tool(
  async ({ id }: { id: string }) => {
    const items = (await fetchJson("/tickets", { id })) as JsonRecord[];
    return items[0] ?? null;
  },
  {
    name: "getIncident",
    description: "Get a single incident by id.",
    schema: z.object({ id: z.string().min(1) }),
  },
);

const searchPeopleTool = tool(
  async ({ name, team, location }: { name?: string; team?: string; location?: string }) => {
    const params: Record<string, string | undefined> = {};
    if (name) params.q = name;
    if (team) params.team = team;
    if (location) params.location = location;
    return (await fetchJson("/people", params)) as JsonRecord[];
  },
  {
    name: "searchPeople",
    description: "Search people by name, team, or location.",
    schema: z.object({
      name: z.string().min(1).optional(),
      team: z.string().min(1).optional(),
      location: z.string().min(1).optional(),
    }),
  },
);

const getPersonTool = tool(
  async ({ id }: { id: string }) => {
    const items = (await fetchJson("/people", { id })) as JsonRecord[];
    return items[0] ?? null;
  },
  {
    name: "getPerson",
    description: "Get a person by id.",
    schema: z.object({ id: z.string().min(1) }),
  },
);

const getOrgChartTool = tool(
  async ({ managerId }: { managerId: string }) => {
    return (await fetchJson("/people", { managerId })) as JsonRecord[];
  },
  {
    name: "getOrgChart",
    description: "Get org chart for a manager.",
    schema: z.object({ managerId: z.string().min(1) }),
  },
);

const listAvailableDesksTool = tool(
  async ({ date, location }: { date: string; location?: string }) => {
    const desks = (await fetchJson("/desks", location ? { location } : undefined)) as JsonRecord[];
    const bookings = (await fetchJson("/bookings", { date })) as JsonRecord[];
    const bookedIds = new Set(
      bookings
        .filter((booking) => booking.status !== "cancelled")
        .map((booking) => String(booking.deskId)),
    );
    return desks.filter((desk) => !bookedIds.has(String(desk.id)));
  },
  {
    name: "listAvailableDesks",
    description: "List available desks for a given date and location.",
    schema: z.object({
      date: z.string().min(1),
      location: z.string().min(1).optional(),
    }),
  },
);

const bookDeskTool = tool(
  async ({ userId, deskId, date }: { userId: string; deskId: string; date: string }) => {
    const existing = (await fetchJson("/bookings", { deskId, date })) as JsonRecord[];
    const conflicts = existing.filter((booking) => booking.status !== "cancelled");
    if (conflicts.length > 0) {
      return { ok: false, message: "Desk is already booked for that date.", conflicts };
    }

    return {
      ok: false,
      message: "Mock API is read-only. Booking would be created here.",
      booking: { userId, deskId, date, status: "pending" },
    };
  },
  {
    name: "bookDesk",
    description: "Book a desk for a user on a date.",
    schema: z.object({
      userId: z.string().min(1),
      deskId: z.string().min(1),
      date: z.string().min(1),
    }),
  },
);

const cancelBookingTool = tool(
  async ({ bookingId }: { bookingId: string }) => {
    const existing = (await fetchJson("/bookings", { id: bookingId })) as JsonRecord[];
    if (existing.length === 0) {
      return { ok: false, message: "Booking not found." };
    }

    return {
      ok: false,
      message: "Mock API is read-only. Booking would be cancelled here.",
      booking: existing[0],
    };
  },
  {
    name: "cancelBooking",
    description: "Cancel an existing booking.",
    schema: z.object({ bookingId: z.string().min(1) }),
  },
);

const safeInvoke = async <T>(fn: () => Promise<T>) => {
  try {
    return await fn();
  } catch (error) {
    return { error: (error as Error).message } as T;
  }
};

export const getLatestNews = async (limit = 5) =>
  safeInvoke(() => getLatestNewsTool.invoke({ limit }));
export const getTrendingNews = async (limit = 5) =>
  safeInvoke(() => getTrendingNewsTool.invoke({ limit }));
export const searchNews = async (query: string) =>
  safeInvoke(() => searchNewsTool.invoke({ query }));

export const listTickets = async (status?: string) =>
  safeInvoke(() => listTicketsTool.invoke({ status }));
export const searchTickets = async (query: string) =>
  safeInvoke(() => searchTicketsTool.invoke({ query }));
export const getIncident = async (id: string) =>
  safeInvoke(() => getIncidentTool.invoke({ id }));

export const searchPeople = async (name?: string, team?: string, location?: string) =>
  safeInvoke(() => searchPeopleTool.invoke({ name, team, location }));
export const getPerson = async (id: string) =>
  safeInvoke(() => getPersonTool.invoke({ id }));
export const getOrgChart = async (managerId: string) =>
  safeInvoke(() => getOrgChartTool.invoke({ managerId }));

export const listAvailableDesks = async (date: string, location?: string) =>
  safeInvoke(() => listAvailableDesksTool.invoke({ date, location }));
export const bookDesk = async (userId: string, deskId: string, date: string) =>
  safeInvoke(() => bookDeskTool.invoke({ userId, deskId, date }));
export const cancelBooking = async (bookingId: string) =>
  safeInvoke(() => cancelBookingTool.invoke({ bookingId }));
