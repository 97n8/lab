// PJ · FileSurfaceConnector. PJ watches a file surface for signals — it does not
// organize files. The decision is an EVIDENCE decision, the same for every vendor:
//   existing CaseSpace proven   → append
//   strong evidence of new case → open
//   weak evidence               → needs_review   (a vague filename is NOT enough)
//   no evidence                 → needs_review
// Every path emits a receipt. All offline via a mock source.

import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveCaseSpace } from "@publiclogic/golden-path";
import {
  fileSurfaceConnector,
  assessHint,
  createFileSurfaceAdapter,
  mockFileSource,
  googleDriveSource,
} from "../src/connectors/files/index.js";

const EXISTING = [
  { id: "stay:Kendall Pond Lodge:2026-07-03", type: "stay", keys: { folder_path: "stay:Kendall Pond Lodge:2026-07-03" } },
];

const FILES = {
  // 1. lives in the folder already linked to the active CaseSpace → APPEND
  folderMatch: { id: "f1", name: "Signed Rental Agreement.pdf", mimeType: "application/pdf", modifiedTime: "2026-06-28T16:00:00Z", owners: [{ emailAddress: "ops@kendallpond.example" }], folderPath: "stay:Kendall Pond Lodge:2026-07-03" },
  // 2. filename clearly names a NEW case, no existing match → OPEN
  strongName: { id: "f2", name: "KPL Reservation 2026-07-03.pdf", mimeType: "application/pdf", modifiedTime: "2026-06-28T16:01:00Z" },
  // 3. no usable hint at all → NEEDS_REVIEW
  noHint: { id: "f3", name: "Scan_001.jpg", mimeType: "image/jpeg", modifiedTime: "2026-06-28T16:02:00Z" },
  // 4. vague filename + generic folder → NEEDS_REVIEW (not enough to open)
  weakHint: { id: "f4", name: "guest thing.docx", mimeType: "application/vnd...", modifiedTime: "2026-06-28T16:03:00Z", folderPath: "/Uploads" },
};

async function decideVia(source, file, existing = EXISTING) {
  const adapter = createFileSurfaceAdapter({ source: mockFileSource(source, [file]) });
  const { results } = await adapter.pull({ existing });
  return results[0];
}

function assertReceiptShape(r, source) {
  for (const f of ["signalId", "objectId", "action", "timestamp", "source", "preserved", "matchEvidence", "missingEvidence"]) {
    assert.ok(f in r.receipt, `receipt missing ${f}`);
  }
  assert.equal(r.receipt.source, source);
  assert.equal(r.receipt.preserved, true);
  assert.ok(Array.isArray(r.receipt.matchEvidence));
  assert.ok(Array.isArray(r.receipt.missingEvidence));
}

// ---- The five acceptance tests (via the google-drive source) ----------------

test("1 · active folder match → append / appended_to_casespace", async () => {
  const r = await decideVia("google-drive", FILES.folderMatch);
  assert.equal(r.action.action, "append");
  assert.equal(r.action.caseSpaceId, "stay:Kendall Pond Lodge:2026-07-03");
  assert.equal(r.receipt.action, "appended_to_casespace");
  assertReceiptShape(r, "google-drive");
});

test("2 · strong hint, no match → open / opened_casespace", async () => {
  const r = await decideVia("google-drive", FILES.strongName);
  assert.equal(r.action.action, "open");
  assert.equal(r.receipt.action, "opened_casespace");
  assertReceiptShape(r, "google-drive");
});

test("3 · no hint → needs_review / flagged_for_review (held, not guessed)", async () => {
  const r = await decideVia("google-drive", FILES.noHint);
  assert.equal(r.action.action, "needs_review");
  assert.equal(r.receipt.action, "flagged_for_review");
  assert.ok(r.review, "preserved as a review item");
  assertReceiptShape(r, "google-drive");
});

test("4 · weak hint → needs_review (a vague filename is NOT enough to open)", async () => {
  const r = await decideVia("google-drive", FILES.weakHint);
  assert.equal(r.action.action, "needs_review");
  assert.equal(r.receipt.action, "flagged_for_review");
  assert.equal(r.object.metadata.hintStrength, "weak");
  assertReceiptShape(r, "google-drive");
});

test("5 · no core leakage — the resolver only sees the normalized object", () => {
  assert.equal(fileSurfaceConnector.resolve, resolveCaseSpace);
  const a = resolveCaseSpace({ objectType: "files.document", title: "T", suggestedCaseSpace: "cs1", confidence: 0.7, metadata: { source: "google-drive", evidence: {}, expects: [] } }, { existing: [{ id: "cs1" }] });
  const b = resolveCaseSpace({ objectType: "files.document", title: "T", suggestedCaseSpace: "cs1", confidence: 0.7, metadata: { source: "dropbox", evidence: {}, expects: [] } }, { existing: [{ id: "cs1" }] });
  assert.equal(a.action, b.action);
  assert.equal(a.caseSpaceId, b.caseSpaceId);
});

// ---- Vendor-agnostic: a different source, same decisions --------------------

test("a different file surface produces the same decisions — only the source label changes", async () => {
  for (const [key, expected] of [["folderMatch", "append"], ["strongName", "open"], ["weakHint", "needs_review"]]) {
    const drive = await decideVia("google-drive", FILES[key]);
    const dropbox = await decideVia("dropbox", FILES[key]);
    assert.equal(drive.action.action, expected, `drive ${key}`);
    assert.equal(dropbox.action.action, expected, `dropbox ${key}`);
    assert.equal(drive.receipt.source, "google-drive");
    assert.equal(dropbox.receipt.source, "dropbox"); // only the surface label differs
  }
});

// ---- Hint assessment, directly ---------------------------------------------

test("assessHint: structured folders and case-naming filenames are strong", () => {
  assert.equal(assessHint({ name: "x.pdf", folder: "stay:KPL:2026-07-03" }).strength, "strong");
  assert.equal(assessHint({ name: "x.pdf", folder: "/Kendall Pond Lodge/Reservations/2026-07-03 Smith" }).strength, "strong");
  assert.equal(assessHint({ name: "Smith Stay Agreement.pdf" }).strength, "strong");
  assert.equal(assessHint({ name: "KPL Reservation 2026-07-03.pdf" }).strength, "strong");
});

test("assessHint: vague filenames never open a CaseSpace", () => {
  for (const name of ["notes.pdf", "guest thing.docx", "scan 22.pdf", "IMG_1044.jpeg"]) {
    assert.notEqual(assessHint({ name }).strength, "strong", name);
  }
  assert.equal(assessHint({ name: "" }).strength, "none");
});

// ---- Run summary + held queue ----------------------------------------------

test("a full pull counts each disposition and queues the held files", async () => {
  const adapter = createFileSurfaceAdapter({ source: mockFileSource("google-drive", Object.values(FILES)) });
  const { summary, review } = await adapter.pull({ existing: EXISTING });
  assert.deepEqual(summary.byAction, { open: 1, append: 1, needs_review: 2, ignore: 0 });
  assert.equal(review.list("open").length, 2);
});

// ---- The Google Drive source reads via env config (no network) -------------

test("googleDriveSource reads PJ_GOOGLE_DRIVE_URL and maps Drive shape", async () => {
  let calledUrl = null;
  let authHeader = null;
  const fakeFetch = async (url, opts) => {
    calledUrl = url;
    authHeader = opts.headers.Authorization ?? null;
    return { ok: true, async json() { return { files: [{ id: "d1", name: "KPL Reservation 2026-07-03.pdf", mimeType: "application/pdf", modifiedTime: "2026-06-28T10:00:00Z", parents: ["folderX"] }] }; } };
  };
  const src = googleDriveSource(
    { PJ_GOOGLE_DRIVE_URL: "https://www.googleapis.com/drive/v3/files", PJ_GOOGLE_DRIVE_TOKEN: "t0ken" },
    { fetch: fakeFetch },
  );
  const files = await src.listFiles();
  assert.equal(calledUrl, "https://www.googleapis.com/drive/v3/files");
  assert.equal(authHeader, "Bearer t0ken");
  assert.equal(files[0].folderPath, "folderX"); // mapped from parents[0]
  assert.equal(src.source, "google-drive");
});

test("googleDriveSource refuses to run without env config; non-OK is surfaced", async () => {
  assert.throws(() => googleDriveSource({}, { fetch: async () => ({}) }), /PJ_GOOGLE_DRIVE_URL is required/);
  const src = googleDriveSource({ PJ_GOOGLE_DRIVE_URL: "https://x" }, { fetch: async () => ({ ok: false, status: 403 }) });
  await assert.rejects(() => src.listFiles(), /responded 403/);
});
