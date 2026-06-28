// The network seam. A FilesPort just lists raw file records; how it gets them is
// the only place I/O lives. The production port reads a real external surface
// from env config (an MCP Files server's HTTP bridge, or an official Drive/Files
// listing endpoint). The mock port returns fixtures, so the adapter and the whole
// signal→object→decision→receipt path are testable with zero network and zero
// secrets. No scraping: the port reads exactly the endpoint it was configured with.

/**
 * @typedef {Object} FilesPort
 * @property {() => Promise<object[]>} listFiles  - raw file records from the surface
 */

// Tolerate the common envelope shapes a Files/MCP endpoint might return.
function extractFiles(data) {
  if (Array.isArray(data)) return data;
  return data.files ?? data.items ?? data.value ?? [];
}

/**
 * Production port: read a Files surface over HTTPS using env config only.
 * Required: PJ_FILES_SOURCE_URL. Optional: PJ_FILES_TOKEN (bearer). Nothing is
 * hardcoded and nothing is committed — same discipline as the KPL iCal feed.
 * @returns {FilesPort}
 */
export function httpFilesPort(env = process.env, deps = {}) {
  const url = env.PJ_FILES_SOURCE_URL;
  if (!url) {
    throw new Error("connector-files: PJ_FILES_SOURCE_URL is required (env/config only — never hardcode or commit it).");
  }
  const token = env.PJ_FILES_TOKEN || null;
  const doFetch = deps.fetch || globalThis.fetch;
  if (typeof doFetch !== "function") throw new Error("connector-files: no fetch available.");

  return {
    async listFiles() {
      const headers = { Accept: "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await doFetch(url, { headers });
      if (!res.ok) throw new Error(`connector-files: source responded ${res.status}.`);
      return extractFiles(await res.json());
    },
  };
}

/**
 * Test/dev port: hand it fixtures, get them back. No network.
 * @param {object[]} files
 * @returns {FilesPort}
 */
export function mockFilesPort(files = []) {
  return {
    async listFiles() {
      return files;
    },
  };
}
