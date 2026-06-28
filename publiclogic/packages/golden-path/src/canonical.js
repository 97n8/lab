// PJ Canonical Form v1 — the deliverable that makes independent verification
// real. Two honest verifiers must derive the same bytes before any hash or
// signature matters. Pure and deterministic; works in Node and the browser.
//
// Rules (go-forward sheet 14): UTF-8, NFC text, LF only, lexical key order by
// code point, no insignificant whitespace, lowercase true/false/null, fixed
// numbers (no exponent), arrays keep semantic order. Money / high-precision /
// very large numbers must be STRING-typed — numbers that need an exponent are
// rejected rather than hashed ambiguously.

export const CANONICAL_FORM_VERSION = "v1";

function normalizeStr(s) {
  return s.normalize("NFC").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

// JSON.stringify gives deterministic, spec-compliant escaping for a single string.
function encStr(s) {
  return JSON.stringify(normalizeStr(s));
}

function formatNumber(n) {
  if (!Number.isFinite(n)) throw new Error("Canonical form: non-finite number (NaN/Infinity) is not allowed.");
  if (Object.is(n, -0)) return "0";
  const s = n.toString();
  if (/[eE]/.test(s)) {
    throw new Error(`Canonical form: number ${s} needs an exponent — string-type very large/small or high-precision values.`);
  }
  return s;
}

// Compare strings by Unicode code point (not UTF-16 code unit).
function cpCompare(a, b) {
  const aa = Array.from(a);
  const bb = Array.from(b);
  const n = Math.min(aa.length, bb.length);
  for (let i = 0; i < n; i++) {
    const d = aa[i].codePointAt(0) - bb[i].codePointAt(0);
    if (d !== 0) return d;
  }
  return aa.length - bb.length;
}

function ser(v) {
  if (v === null) return "null";
  const t = typeof v;
  if (t === "boolean") return v ? "true" : "false";
  if (t === "number") return formatNumber(v);
  if (t === "string") return encStr(v);
  if (Array.isArray(v)) return "[" + v.map(ser).join(",") + "]";
  if (t === "object") {
    const seen = new Set();
    const entries = [];
    for (const k of Object.keys(v)) {
      if (v[k] === undefined) continue; // undefined is dropped, not serialized
      const nk = k.normalize("NFC");
      if (seen.has(nk)) throw new Error(`Canonical form: keys collide after NFC normalization: "${nk}".`);
      seen.add(nk);
      entries.push([nk, v[k]]);
    }
    entries.sort((a, b) => cpCompare(a[0], b[0]));
    return "{" + entries.map(([k, val]) => encStr(k) + ":" + ser(val)).join(",") + "}";
  }
  throw new Error(`Canonical form: unsupported type "${t}".`);
}

/** Produce the canonical string for a value. UTF-8 of this string is the bytes. */
export function canonicalize(value) {
  return ser(value);
}

/** SHA-256 (hex) of a UTF-8 string, using Web Crypto (Node 18+ and browsers). */
export async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const buf = await globalThis.crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Hash a value via its canonical form. */
export async function hashCanonical(value) {
  return sha256Hex(canonicalize(value));
}

/** Minimal Record Receipt: commit to the exact canonical bytes of an object. */
export async function makeReceipt(object, meta = {}) {
  return {
    object: "RECEIPT",
    canonical_form_version: CANONICAL_FORM_VERSION,
    object_hash: await hashCanonical(object),
    ...meta,
  };
}

/** Integrity check: re-derive the hash and compare. Alteration is exposed. */
export async function verifyReceipt(object, receipt) {
  if (!receipt || receipt.canonical_form_version !== CANONICAL_FORM_VERSION) return false;
  return (await hashCanonical(object)) === receipt.object_hash;
}
