/**
 * API client com interceptor de JWT e refresh automático.
 * Configure NEXT_PUBLIC_API_URL no `.env.local` (ex.: http://localhost:3333).
 *
 * Estratégia de Segurança:
 * - Access token: Armazenado em memória (protegido contra XSS)
 * - Refresh token: Armazenado em httpOnly cookie (protegido contra XSS e CSRF)
 * - Token em memória é perdido ao recarregar a página (requer novo login ou refresh via cookie)
 * - credentials: "include" garante que cookies httpOnly sejam enviados automaticamente
 */

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:3333"
).replace(/\/$/, "");
const API_PREFIX = "/api";

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  query?:
    | Record<string, string | number | boolean | undefined | null>
    | Record<string, unknown>;
  auth?: boolean;
  skipPrefix?: boolean;
  signal?: AbortSignal;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}${API_PREFIX}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return null;
      const json = await res.json();
      const token = json?.data?.accessToken ?? null;
      if (token) setAccessToken(token);
      return token;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

function buildUrl(endpoint: string, opts: RequestOptions): string {
  const prefix = opts.skipPrefix ? "" : API_PREFIX;
  let url = `${BASE_URL}${prefix}${endpoint}`;
  if (opts.query) {
    const qs = Object.entries(opts.query)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(
        ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
      )
      .join("&");
    if (qs) url += (url.includes("?") ? "&" : "?") + qs;
  }
  return url;
}

async function request<T>(
  endpoint: string,
  opts: RequestOptions = {},
  retry = true,
): Promise<T> {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (opts.auth !== false) {
    const tok = getAccessToken();
    if (tok) headers["Authorization"] = `Bearer ${tok}`;
  }

  const res = await fetch(buildUrl(endpoint, opts), {
    method: opts.method || "GET",
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    credentials: "include",
    signal: opts.signal,
  });

  if (res.status === 401 && retry && opts.auth !== false) {
    const newToken = await refreshAccessToken();
    if (newToken) return request<T>(endpoint, opts, false);
    setAccessToken(null);
  }

  let data: any = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) || `Erro ${res.status}`;
    throw new ApiError(message, res.status, data);
  }

  // Unwrap { success, data } envelope when present
  if (data && typeof data === "object" && "success" in data && "data" in data) {
    return data.data as T;
  }
  return data as T;
}

export const api = {
  get: <T>(
    endpoint: string,
    opts: Omit<RequestOptions, "method" | "body"> = {},
  ) => request<T>(endpoint, { ...opts, method: "GET" }),
  post: <T>(
    endpoint: string,
    body?: unknown,
    opts: Omit<RequestOptions, "method"> = {},
  ) => request<T>(endpoint, { ...opts, method: "POST", body }),
  patch: <T>(
    endpoint: string,
    body?: unknown,
    opts: Omit<RequestOptions, "method"> = {},
  ) => request<T>(endpoint, { ...opts, method: "PATCH", body }),
  put: <T>(
    endpoint: string,
    body?: unknown,
    opts: Omit<RequestOptions, "method"> = {},
  ) => request<T>(endpoint, { ...opts, method: "PUT", body }),
  delete: <T>(
    endpoint: string,
    opts: Omit<RequestOptions, "method" | "body"> = {},
  ) => request<T>(endpoint, { ...opts, method: "DELETE" }),
  refresh: refreshAccessToken,
};

export { BASE_URL };
