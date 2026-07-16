// Orchestration: resolve the iCal source from env/config only, parse, reconcile,
// and persist. No secrets are ever logged or written — only a generic source
// label (the Airbnb iCal URL carries a private token in its path).
import { parseICS } from "./ical.js";
import { syncCases } from "./cases.js";
import { buildDashboard } from "./dashboard.js";
import { sealCases } from "./seal.js";
import {
  dataDir as resolveDataDir,
  loadCases,
  saveCases,
  saveDashboard,
  savePacket,
  appendLog,
} from "./storage.js";

export function nowDateOf(env = process.env, fallback = new Date()) {
  const raw = env.KPL_NOW || fallback;
  return (raw instanceof Date ? raw.toISOString() : String(raw)).slice(0, 10);
}

/**
 * Resolve the iCal text from configuration only.
 * Precedence: explicit icsText (tests) -> KPL_ICAL_FILE -> AIRBNB_KPL_ICAL_URL.
 * Returns { text, source } where `source` never contains the secret URL.
 */
export async function loadICSText({ env = process.env, icsText, fetchImpl = fetch, fs }) {
  if (typeof icsText === "string") return { text: icsText, source: "inline" };

  if (env.KPL_ICAL_FILE) {
    const nodeFs = fs || (await import("node:fs")).promises;
    const text = await nodeFs.readFile(env.KPL_ICAL_FILE, "utf8");
    return { text, source: "local-file" };
  }

  const url = env.AIRBNB_KPL_ICAL_URL;
  if (!url) {
    throw new Error(
      "AIRBNB_KPL_ICAL_URL is not set. Add it to your environment (see .env.example) " +
        "or pass --file <path> to sync a local .ics. The URL must come from config only."
    );
  }
  const res = await fetchImpl(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch Airbnb iCal feed (HTTP ${res.status}).`);
  }
  return { text: await res.text(), source: "airbnb-ical" };
}

/**
 * Run a full sync. Idempotent: deterministic case IDs + merge-in-place.
 * @returns {{cases, dashboard, stats, source, nowDate}}
 */
export async function runSync(opts = {}) {
  const env = opts.env || process.env;
  const dir = opts.dataDir || resolveDataDir(env);
  const nowDate = opts.nowDate || nowDateOf(env);
  const timestamp = opts.timestamp || new Date().toISOString();

  const { text, source } = await loadICSText({
    env,
    icsText: opts.icsText,
    fetchImpl: opts.fetchImpl,
  });

  const events = parseICS(text);
  const existing = await loadCases(dir);
  const { cases, stats } = syncCases({ events, nowDate, existing, timestamp });
  const dashboard = buildDashboard(cases, nowDate, timestamp);

  // Seal the record set into the verified spine: every case earns a receipt and
  // the ordered set closes under a Merkle root. This is what makes the STAY
  // record independently verifiable — offline, with no server in the loop.
  const packet = await sealCases(cases, { at: timestamp });

  await saveCases(dir, cases);
  await saveDashboard(dir, dashboard);
  await savePacket(dir, packet);
  await appendLog(dir, {
    ts: timestamp,
    source,
    now_date: nowDate,
    ...stats,
    merkle_root: packet.case_receipt.merkle_root,
    sealed_records: packet.case_receipt.record_count,
  });

  return { cases, dashboard, stats, source, nowDate, packet };
}
