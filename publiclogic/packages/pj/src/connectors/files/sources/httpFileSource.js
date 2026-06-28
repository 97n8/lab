// Generic env-configured HTTPS producer. Every vendor source that reads over an
// HTTP(S) listing endpoint (an MCP Files bridge, an official Drive/Graph/Dropbox
// API) is one call to this with its own env vars + shape mapper. No scraping: it
// reads exactly the configured endpoint. No committed keys: URL + token come from
// env only.

import { defineFileSource } from "./source.js";

/**
 * @param {{ source: string, urlEnv: string, tokenEnv?: string, map?: (raw:any)=>object,
 *           env?: Record<string,string|undefined>, deps?: { fetch?: Function } }} cfg
 * @returns {import("./source.js").FileSource}
 */
export function httpFileSource({ source, urlEnv, tokenEnv, map = (x) => x, env = process.env, deps = {} }) {
  const url = env[urlEnv];
  if (!url) {
    throw new Error(`FileSource(${source}): ${urlEnv} is required (env/config only — never hardcode or commit it).`);
  }
  const token = tokenEnv ? env[tokenEnv] || null : null;
  const doFetch = deps.fetch || globalThis.fetch;
  if (typeof doFetch !== "function") throw new Error(`FileSource(${source}): no fetch available.`);

  return defineFileSource({
    source,
    async listFiles() {
      const headers = { Accept: "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await doFetch(url, { headers });
      if (!res.ok) throw new Error(`FileSource(${source}): responded ${res.status}.`);
      const data = await res.json();
      const raw = Array.isArray(data) ? data : data.files ?? data.items ?? data.value ?? [];
      return raw.map(map);
    },
  });
}
