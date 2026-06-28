// Step 3 — the first network-backed adapter. Proves: a real-surface read (env
// config), conversion into the existing Signal shape, the connector interface,
// receipts for everything, no-match held as needs_review, and that NO vendor
// logic touched the core resolver. All offline via mocks.

import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveCaseSpace } from "@publiclogic/golden-path";
import { filesConnector, mockFilesPort, httpFilesPort, createFilesAdapter } from "../src/index.js";

// One active CaseSpace to match against (carries identifying keys).
const EXISTING = [
  { id: "stay:Kendall Pond Lodge:2026-07-03", type: "stay", keys: { folder_path: "stay:Kendall Pond Lodge:2026-07-03" } },
];

// Three raw files as a Drive/MCP surface would hand them over.
const FILES = [
  // matches the active CaseSpace by folder → APPEND
  { id: "f1", name: "Signed Rental Agreement.pdf", mimeType: "application/pdf", modifiedTime: "2026-06-28T16:00:00Z", owners: [{ emailAddress: "ops@kendallpond.example" }], caseHint: "stay:Kendall Pond Lodge:2026-07-03" },
  // a hint, but no matching CaseSpace → OPEN
  { id: "f2", name: "RFP Housing 2026 Brief.docx", mimeType: "application/vnd.openxmlformats", modifiedTime: "2026-06-28T16:01:00Z", caseHint: "project:rfp-2026-housing" },
  // no hint at all → HELD for a human (needs_review)
  { id: "f3", name: "Scan_001.jpg", mimeType: "image/jpeg", modifiedTime: "2026-06-28T16:02:00Z" },
];

// ---- The whole path, over a mock surface -----------------------------------

test("pull() reads the surface and produces a signal/object/decision/receipt per file", async () => {
  const adapter = createFilesAdapter({ port: mockFilesPort(FILES) });
  const { results, summary } = await adapter.pull({ existing: EXISTING });

  assert.equal(results.length, 3);
  for (const r of results) {
    assert.match(r.signal.id, /^sig_/);
    assert.equal(r.signal.source, "drive");
    assert.match(r.object.id, /^obj_/);
    assert.equal(r.object.objectType, "files.document");
    assert.ok(r.action.reason);
    assert.match(r.receipt.id, /^rcpt_/);
    assert.equal(r.receipt.preserved, true);
    assert.match(r.receipt.checksum, /^[0-9a-f]{64}$/);
  }
  assert.equal(summary.receipts, 3);
});

test("the matching file APPENDS to the active CaseSpace", async () => {
  const adapter = createFilesAdapter({ port: mockFilesPort([FILES[0]]) });
  const { results } = await adapter.pull({ existing: EXISTING });
  assert.equal(results[0].action.action, "append");
  assert.equal(results[0].action.caseSpaceId, "stay:Kendall Pond Lodge:2026-07-03");
  assert.equal(results[0].receipt.action, "appended_to_casespace");
});

test("a hinted-but-unmatched file OPENS a new CaseSpace", async () => {
  const adapter = createFilesAdapter({ port: mockFilesPort([FILES[1]]) });
  const { results } = await adapter.pull({ existing: EXISTING });
  assert.equal(results[0].action.action, "open");
  assert.equal(results[0].receipt.action, "opened_casespace");
});

test("a file with no hint is HELD as needs_review, not guessed", async () => {
  const adapter = createFilesAdapter({ port: mockFilesPort([FILES[2]]) });
  const { results, review } = await adapter.pull({ existing: EXISTING });
  assert.equal(results[0].action.action, "needs_review");
  assert.equal(results[0].receipt.action, "flagged_for_review");
  assert.ok(results[0].review, "preserved as a review item");
  assert.equal(review.list("open").length, 1); // queued for a human
});

test("the run summary counts each disposition", async () => {
  const adapter = createFilesAdapter({ port: mockFilesPort(FILES) });
  const { summary } = await adapter.pull({ existing: EXISTING });
  assert.deepEqual(summary.byAction, { open: 1, append: 1, needs_review: 1, ignore: 0 });
});

// ---- The env-configured real surface (no network: stubbed fetch) -----------

test("httpFilesPort reads the endpoint from env config and lists files", async () => {
  let calledUrl = null;
  let authHeader = null;
  const fakeFetch = async (url, opts) => {
    calledUrl = url;
    authHeader = opts.headers.Authorization ?? null;
    return { ok: true, async json() { return { files: FILES }; } };
  };
  const port = httpFilesPort(
    { PJ_FILES_SOURCE_URL: "https://files.example/api/list", PJ_FILES_TOKEN: "t0ken" },
    { fetch: fakeFetch },
  );
  const files = await port.listFiles();
  assert.equal(calledUrl, "https://files.example/api/list"); // read from env, not hardcoded
  assert.equal(authHeader, "Bearer t0ken"); // token applied from env
  assert.equal(files.length, 3);
});

test("httpFilesPort refuses to run without env config", () => {
  assert.throws(() => httpFilesPort({}, { fetch: async () => ({}) }), /PJ_FILES_SOURCE_URL is required/);
});

test("a non-OK response is surfaced, not swallowed", async () => {
  const port = httpFilesPort(
    { PJ_FILES_SOURCE_URL: "https://files.example/api/list" },
    { fetch: async () => ({ ok: false, status: 403 }) },
  );
  await assert.rejects(() => port.listFiles(), /responded 403/);
});

// ---- The core resolver is untouched ----------------------------------------

test("the connector uses the core resolver — no vendor placement logic", () => {
  // defineConnector defaults resolve to the core resolveCaseSpace; the Files
  // connector passes no custom resolver, so this is identity, not a copy.
  assert.equal(filesConnector.resolve, resolveCaseSpace);
});

test("identical objects resolve identically whether or not they came from Drive", () => {
  // The resolver decides from the object alone. A 'drive'-sourced object and a
  // hand-built one with the same fields get the same decision.
  const fromDrive = { objectType: "files.document", title: "T", suggestedCaseSpace: "cs1", confidence: 0.7, metadata: { source: "drive", evidence: {}, expects: [] } };
  const generic = { objectType: "files.document", title: "T", suggestedCaseSpace: "cs1", confidence: 0.7, metadata: { source: "anything", evidence: {}, expects: [] } };
  const a = resolveCaseSpace(fromDrive, { existing: [{ id: "cs1" }] });
  const b = resolveCaseSpace(generic, { existing: [{ id: "cs1" }] });
  assert.equal(a.action, b.action);
  assert.equal(a.caseSpaceId, b.caseSpaceId);
});
