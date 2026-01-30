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

export const getLatestNews = async (limit = 5) => {
  try {
    const items = (await fetchJson("/news")) as JsonRecord[];
    return sortByDateDesc(items, "date").slice(0, limit);
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const getTrendingNews = async (limit = 5) => {
  try {
    const items = (await fetchJson("/news")) as JsonRecord[];
    return sortByDateDesc(items, "date").slice(0, limit);
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const searchNews = async (query: string) => {
  try {
    return (await fetchJson("/news", { q: query })) as JsonRecord[];
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const listTickets = async (status?: string) => {
  try {
    return (await fetchJson("/tickets", status ? { status } : undefined)) as JsonRecord[];
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const searchTickets = async (query: string) => {
  try {
    return (await fetchJson("/tickets", { q: query })) as JsonRecord[];
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const getIncident = async (id: string) => {
  try {
    const items = (await fetchJson("/tickets", { id })) as JsonRecord[];
    return items[0] ?? null;
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const searchPeople = async (name?: string, team?: string, location?: string) => {
  try {
    const params: Record<string, string | undefined> = {};
    if (name) params.q = name;
    if (team) params.team = team;
    if (location) params.location = location;
    return (await fetchJson("/people", params)) as JsonRecord[];
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const getPerson = async (id: string) => {
  try {
    const items = (await fetchJson("/people", { id })) as JsonRecord[];
    return items[0] ?? null;
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const getOrgChart = async (managerId: string) => {
  try {
    return (await fetchJson("/people", { managerId })) as JsonRecord[];
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const listAvailableDesks = async (date: string, location?: string) => {
  try {
    const desks = (await fetchJson("/desks", location ? { location } : undefined)) as JsonRecord[];
    const bookings = (await fetchJson("/bookings", { date })) as JsonRecord[];
    const bookedIds = new Set(
      bookings
        .filter((booking) => booking.status !== "cancelled")
        .map((booking) => String(booking.deskId)),
    );

    return desks.filter((desk) => !bookedIds.has(String(desk.id)));
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const bookDesk = async (userId: string, deskId: string, date: string) => {
  try {
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
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export const cancelBooking = async (bookingId: string) => {
  try {
    const existing = (await fetchJson("/bookings", { id: bookingId })) as JsonRecord[];
    if (existing.length === 0) {
      return { ok: false, message: "Booking not found." };
    }

    return {
      ok: false,
      message: "Mock API is read-only. Booking would be cancelled here.",
      booking: existing[0],
    };
  } catch (error) {
    return { error: (error as Error).message };
  }
};
