type Dataset = Record<string, unknown[]>;

const DEFAULT_PORT = 4000;
const DEFAULT_DB_PATH = new URL("../db.json", import.meta.url).pathname;

const datasetPath = Bun.env.MOCK_API_DB_PATH ?? Bun.env.DB_PATH ?? DEFAULT_DB_PATH;
const port = Number(Bun.env.MOCK_API_PORT ?? DEFAULT_PORT);

const dataset = await loadDataset(datasetPath);

const routes = new Set(["news", "tickets", "people", "desks", "bookings"]);

Bun.serve({
  port,
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/+/, "");

    if (request.method === "OPTIONS") {
      return withCors(new Response(null, { status: 204 }));
    }

    if (request.method !== "GET") {
      return withCors(
        new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { "content-type": "application/json" },
        }),
      );
    }

    if (!routes.has(path)) {
      return withCors(
        new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
          headers: { "content-type": "application/json" },
        }),
      );
    }

    const items = Array.isArray(dataset[path]) ? dataset[path] : [];
    const filtered = applyFilters(items, url.searchParams);

    return withCors(
      new Response(JSON.stringify(filtered), {
        headers: { "content-type": "application/json" },
      }),
    );
  },
});

console.log(`[mock-api] loaded ${datasetPath}`);
console.log(`[mock-api] listening on http://localhost:${port}`);

async function loadDataset(path: string): Promise<Dataset> {
  try {
    const file = Bun.file(path);
    if (!(await file.exists())) {
      return emptyDataset();
    }
    const text = await file.text();
    return JSON.parse(text) as Dataset;
  } catch (error) {
    console.error(`[mock-api] failed to load ${path}`, error);
    return emptyDataset();
  }
}

function emptyDataset(): Dataset {
  return {
    news: [],
    tickets: [],
    people: [],
    desks: [],
    bookings: [],
  };
}

function applyFilters(items: unknown[], params: URLSearchParams): unknown[] {
  if (!params.size) {
    return items;
  }

  const q = params.get("q");
  const entries = Array.from(params.entries()).filter(([key]) => key !== "q");

  return items.filter((item) => {
    if (typeof item !== "object" || item === null) {
      return false;
    }

    const record = item as Record<string, unknown>;

    if (q && !matchesQuery(record, q)) {
      return false;
    }

    for (const [key, value] of entries) {
      if (key.endsWith("_like")) {
        const field = key.slice(0, -5);
        if (!matchesLike(record[field], value)) {
          return false;
        }
      } else {
        if (!matchesExact(record[key], value)) {
          return false;
        }
      }
    }

    return true;
  });
}

function matchesQuery(record: Record<string, unknown>, q: string): boolean {
  const needle = q.toLowerCase();
  for (const value of Object.values(record)) {
    if (value == null) {
      continue;
    }

    if (Array.isArray(value)) {
      if (value.some((entry) => typeof entry === "string" && entry.toLowerCase().includes(needle))) {
        return true;
      }
      continue;
    }

    if (typeof value === "string" && value.toLowerCase().includes(needle)) {
      return true;
    }
  }
  return false;
}

function matchesLike(value: unknown, query: string): boolean {
  if (value == null) {
    return false;
  }

  const needle = query.toLowerCase();

  if (Array.isArray(value)) {
    return value.some((entry) => typeof entry === "string" && entry.toLowerCase().includes(needle));
  }

  if (typeof value === "string") {
    return value.toLowerCase().includes(needle);
  }

  return false;
}

function matchesExact(value: unknown, query: string): boolean {
  if (value == null) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some((entry) => String(entry) === query);
  }

  return String(value) === query;
}

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("access-control-allow-origin", "*");
  headers.set("access-control-allow-methods", "GET,OPTIONS");
  headers.set("access-control-allow-headers", "content-type");
  return new Response(response.body, { status: response.status, headers });
}
