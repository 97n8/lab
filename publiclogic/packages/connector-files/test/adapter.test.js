// Step 3 — the first network-backed adapter. The decision matrix:
//   folder matches active CaseSpace            → append
//   strong case hint (folder/filename), no match → open
//   weak hint or no hint                        → needs_review  (held, not guessed)
// Every path emits a receipt. All offline via mocks.

import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveCaseSpace } from "@publiclogic/golden-path";
import { filesConnector, assessHint, mockFilesPort, httpFilesPort, createFilesAdapter } from "../src/index.js";

// One active CaseSpace to match against (carries identifying keys).
const EXISTING = [
  { id: "stay:Kendall Pond Lodge:2026-07-03", type: "stay", keys: { folder_path: "stay:Kendall Pond Lodge:2026-07-03" } },
];

const FILES = {
  // 1. lives in the folder already linked to the active CaseSpace → APPEND
  folderMatch: { id: "f1", name: "Signed Rental Agreement.pdf", mimeType: "application/pdf", modifiedTime: "2026-06-28T16:00:00Z", owners: [{ emailAddress: "ops@kendallpond.example" }], caseHint: "stay:Kendall Pond Lodge:2026-07-03" },
  // 2. filename clearly names a NEW case, no existing match → OPEN
  strongName: { id: "f2", name: "KPL Reservation 2026-07-03.pdf", mimeType: "application/pdf", modifiedTime: "2026-06-28T16:01:00Z" },
  // 3. no usable hint at all → NEEDS_REVIEW
  noHint: { id: "f3", name: "Scan_001.jpg", mimeType: "image/jpeg", modifiedTime: "2026-06-28T16:02:00Z" },
  // 4. vague filename + generic folder → NEEDS_REVIEW (not enough to open)
  weakHint: { id: "f4", name: "guest thing.docx", mimeType: "application/vnd...", modifiedTime: "2026-06-28T16:03:00Z", caseHint: "/Uploads" },
};

async function decide(file, existing = EXISTING) {
  const adapter = createFilesAdapter({ port: mockFilesPort([file]) });
  const { results } = await adapter.pull({ existing });
  return results[0];
}

function assertReceiptShape(r, source = "drive") {
  for (const f of ["signalId", "objectId", "action", "timestamp", "source", "preserved", "matchEvidence", "missingEvidence"]) {
    assert.ok(f in r.receipt, `receipt missing ${f}`);
  }
  assert.equal(r.receipt.source, source);
  assert.equal(r.receipt.preserved, true);
  assert.ok(Array.isArray(r.receipt.matchEvidence));
  assert.ok(Array.isArray(r.receipt.missingEvidence));
}

// ---- The five acceptance tests ---------------------------------------------

test("1 · active folder match → append / appended_to_casespace", async () => {
  const r = await decide(FILES.folderMatch);
  assert.equal(r.action.action, "append");
  assert.equal(r.action.caseSpaceId, "stay:Kendall Pond Lodge:2026-07-03");
  assert.equal(r.receipt.action, "appended_to_casespace");
  assertReceiptShape(r);
});

test("2 · strong hint, no match → open / opened_casespace", async () => {
  const r = await decide(FILES.strongName);
  assert.equal(r.action.action, "open");
  assert.equal(r.receipt.action, "opened_casespace");
  assertReceiptShape(r);
});

test("3 · no hint → needs_review / flagged_for_review (held, not guessed)", async () => {
  const r = await decide(FILES.noHint);
  assert.equal(r.action.action, "needs_review");
  assert.equal(r.receipt.action, "flagged_for_review");
  assert.ok(r.review, "preserved as a review item");
  assertReceiptShape(r);
});

test("4 · weak hint → needs_review (a vague filename is NOT enough to open)", async () => {
  const r = await decide(FILES.weakHint);
  assert.equal(r.action.action, "needs_review");
  assert.equal(r.receipt.action, "flagged_for_review");
  assert.equal(r.object.metadata.hintStrength, "weak");
  assertReceiptShape(r);
});

test("5 · no core leakage — the resolver only sees the normalized object", () => {
  // The Files connector adds no custom resolver; placement is core identity.
  assert.equal(filesConnector.resolve, resolveCaseSpace);
  // Same normalized object → same decision regardless of source label.
  const a = resolveCaseSpace({ objectType: "files.document", title: "T", suggestedCaseSpace: "cs1", confidence: 0.7, metadata: { source: "drive", evidence: {}, expects: [] } }, { existing: [{ id: "cs1" }] });
  const b = resolveCaseSpace({ objectType: "files.document", title: "T", suggestedCaseSpace: "cs1", confidence: 0.7, metadata: { source: "anything", evidence: {}, expects: [] } }, { existing: [{ id: "cs1" }] });
  assert.equal(a.action, b.action);
  assert.equal(a.caseSpaceId, b.caseSpaceId);
});

// ---- The strong/weak judgement, directly -----------------------------------

test("assessHint: structured folders and case-naming filenames are strong", () => {
  assert.equal(assessHint({ name: "x.pdf", caseHint: "stay:KPL:2026-07-03" }).strength, "strong");
  assert.equal(assessHint({ name: "x.pdf", caseHint: "/Kendall Pond Lodge/Reservations/2026-07-03 Smith" }).strength, "strong");
  assert.equal(assessHint({ name: "Smith Stay Agreement.pdf" }).strength, "strong");
  assert.equal(assessHint({ name: "KPL Reservation 2026-07-03.pdf" }).strength, "strong");
});

test("assessHint: vague filenames are weak, empties are none", () => {
  for (const name of ["notes.pdf", "guest thing.docx", "scan 22.pdf", "IMG_1044.jpeg"]) {
    assert.notEqual(assessHint({ name }).strength, "strong", name);
  }
  assert.equal(assessHint({ name: "" }).strength, "none");
});

// ---- Run summary + held queue ----------------------------------------------

test("a full pull counts each disposition and queues the held files", async () => {
  const adapter = createFilesAdapter({ port: mockFilesPort(Object.values(FILES)) });
  const { summary, review } = await adapter.pull({ existing: EXISTING });
  assert.deepEqual(summary.byAction, { open: 1, append: 1, needs_review: 2, ignore: 0 });
  assert.equal(review.list("open").length, 2); // both held files awaiting a human
});

// ---- The env-configured real surface (no network: stubbed fetch) -----------

test("httpFilesPort reads the endpoint from env config and applies the token", async () => {
  let calledUrl = null;
  let authHeader = null;
  const fakeFetch = async (url, opts) => {
    calledUrl = url;
    authHeader = opts.headers.Authorization ?? null;
    return { ok: true, async json() { return { files: Object.values(FILES) }; } };
  };
  const port = httpFilesPort(
    { PJ_FILES_SOURCE_URL: "https://files.example/api/list", PJ_FILES_TOKEN: "t0ken" },
    { fetch: fakeFetch },
  );
  const files = await port.listFiles();
  assert.equal(calledUrl, "https://files.example/api/list");
  assert.equal(authHeader, "Bearer t0ken");
  assert.equal(files.length, 4);
});

test("httpFilesPort refuses to run without env config; non-OK is surfaced", async () => {
  assert.throws(() => httpFilesPort({}, { fetch: async () => ({}) }), /PJ_FILES_SOURCE_URL is required/);
  const port = httpFilesPort({ PJ_FILES_SOURCE_URL: "https://files.example/api" }, { fetch: async () => ({ ok: false, status: 403 }) });
  await assert.rejects(() => port.listFiles(), /responded 403/);
});
