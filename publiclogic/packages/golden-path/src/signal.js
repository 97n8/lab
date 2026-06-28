// GP-000 · intake — the Signal. Tool-agnostic intake made real: any inbound
// artifact from a tool (an email, a file, a calendar event, a spreadsheet row,
// a webhook payload) becomes a canonical Signal carrying a provenance block, and
// earns a Record Receipt at the custody boundary. That receipt IS the Entry
// guarantee — provenance captured the moment PJ received the bytes.
//
// This is to ingestion what Canonical Form v1 is to sealing: the small
// deterministic core the connectors stand on. Step 1 of SIGNAL_INTAKE_MCP.md —
// the Signal object + its receipt + verification. Wiring a Signal to FORM/PRR is
// a later step; here we only de-risk the boundary.

import { shortHash } from "./seed.js";
import { canonicalize, makeReceipt, verifyReceipt } from "./canonical.js";

// What kind of artifact the signal carries (not where it came from).
export const SIGNAL_KINDS = ["email", "file", "event", "row", "invoice", "webhook", "form", "other"];

// The connector families, mirroring the five MCP server types. PJ never reads a
// raw API directly; a connector (an MCP server) sits between PJ and the tool.
export const CONNECTOR_TYPES = ["files", "api", "db", "web", "local"];

function deepFreeze(v) {
  if (v && typeof v === "object") {
    for (const k of Object.keys(v)) deepFreeze(v[k]);
    Object.freeze(v);
  }
  return v;
}

/**
 * Normalize an inbound artifact into a canonical Signal.
 * @param {object} input
 *   - kind: one of SIGNAL_KINDS — what the artifact is
 *   - payload: the artifact's normalized content (any canonical-form value)
 *   - connector: which connector/MCP server delivered it (e.g. "mcp:google-drive")
 *   - connector_type: optional, one of CONNECTOR_TYPES
 *   - source_ref: stable id in the source system (e.g. "drive:file/<id>")
 *   - fetched_at: when PJ read it (or pass opts.timestamp)
 * @returns a frozen Signal object. The id is deterministic over
 *   (connector, source_ref, canonical payload), so re-ingesting the same
 *   artifact yields the same Signal — idempotent, like the KPL feed.
 */
export function makeSignal(input = {}, opts = {}) {
  const { kind, payload, connector, connector_type, source_ref } = input;
  if (!SIGNAL_KINDS.includes(kind)) throw new Error(`Signal: unknown kind "${kind}".`);
  if (!connector || typeof connector !== "string") throw new Error("Signal: a connector is required (provenance).");
  if (!source_ref || typeof source_ref !== "string") throw new Error("Signal: a source_ref is required (provenance).");
  if (connector_type !== undefined && !CONNECTOR_TYPES.includes(connector_type)) {
    throw new Error(`Signal: unknown connector_type "${connector_type}".`);
  }
  if (payload === undefined) throw new Error("Signal: a payload is required.");

  const fetched_at = opts.timestamp ?? input.fetched_at ?? null;
  // Canonical payload bytes go into the id, so identity is content-addressed and
  // independent of key order — two tools emitting the same artifact agree.
  const id = `SIG-${shortHash(`${connector}:${source_ref}:${canonicalize(payload)}`)}`;

  const source = { connector, source_ref, fetched_at };
  if (connector_type !== undefined) source.connector_type = connector_type;

  return deepFreeze({ object: "SIGNAL", id, kind, payload, source });
}

/** A Record Receipt over a Signal — commits to its exact bytes incl. provenance. */
export async function signalReceipt(signal, opts = {}) {
  return makeReceipt(signal, {
    object_type: "SIGNAL",
    object_id: signal.id,
    source: signal.source,
    at: opts.timestamp ?? signal.source?.fetched_at ?? null,
  });
}

/**
 * The intake operation: normalize → canonical object → Record Receipt, in order.
 * Returns the boundary pair. Alteration of either payload or provenance after
 * this point fails verifySignal — that's the Entry guarantee.
 */
export async function ingestSignal(input = {}, opts = {}) {
  const signal = makeSignal(input, opts);
  const receipt = await signalReceipt(signal, opts);
  return { signal, receipt };
}

/** Re-derive and compare. Tampering with the artifact OR its provenance is exposed. */
export async function verifySignal(signal, receipt) {
  return verifyReceipt(signal, receipt);
}

/**
 * Dedupe key by source, not content: the same source_ref re-fetched with new
 * content is the *same source, a new version* (same sourceKey, different id).
 * A store uses this to detect updates vs. genuinely new artifacts.
 */
export function sourceKey(signal) {
  return `${signal.source.connector}:${signal.source.source_ref}`;
}
