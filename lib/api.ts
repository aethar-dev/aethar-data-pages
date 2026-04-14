/** Fetch helpers for Aethar APIs */

const APIS = {
  salary: "https://salary.wageapi.com/api",
  cost: "https://col.wageapi.com/api",
  eurostat: "https://eurostat.wageapi.com/api",
  skills: "https://skills.wageapi.com/api",
} as const;

const API_KEY = process.env.AETHAR_API_KEY || "";
const headers: Record<string, string> = API_KEY ? { "X-API-Key": API_KEY } : {};

export async function fetchApi<T>(api: keyof typeof APIS, path: string): Promise<T | null> {
  try {
    const res = await fetch(`${APIS[api]}${path}`, {
      headers,
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data ?? json) as T;
  } catch {
    return null;
  }
}
