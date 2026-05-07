const DEFAULT_BASE_URL = "http://localhost:8000";

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_BASE_URL;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly body: unknown;

  constructor(status: number, body: unknown, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export type QueryValue = string | number | boolean | undefined | null;

export function buildQueryString(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.append(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export type ApiFetchOptions = RequestInit & {
  expectJson?: boolean;
};

async function parseBody(res: Response): Promise<unknown> {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  try {
    const text = await res.text();
    return text.length > 0 ? text : null;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { expectJson = true, headers, ...rest } = options;
  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await parseBody(res);
    const message = extractErrorMessage(body) ?? res.statusText ?? "Request failed";
    throw new ApiError(res.status, body, message);
  }

  if (!expectJson) {
    return null as T;
  }

  const body = await parseBody(res);
  return body as T;
}

function extractErrorMessage(body: unknown): string | null {
  if (!body) return null;
  if (typeof body === "string") return body;
  if (typeof body === "object" && body !== null && "message" in body) {
    const msg = (body as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  return null;
}
