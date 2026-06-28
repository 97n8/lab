// Step 2A — the human review resolution loop. The point of PJ: it preserves a
// held signal without guessing, a person resolves it, and the decision is
// proven by a SECOND receipt linked to the first. Nothing is overwritten.

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  resolveCaseSpace,
  resolveReviewItem,
  createReviewQueue,
  toPJObject,
} from "../src/index.js";
import { gmailConnector, airbnbConnector, fileConnector, SAMPLE_INPUTS } from "../src/connectors/samples.js";

// A CaseSpace that carries identifying keys, so evidence matching is exercised.
const KPL = {
  id: "stay:Kendall Pond Lodge:2026-07-03",
  type: "stay",
  keys: {
    reservation_id: "HMABCD1234",
    guest_email_match: "guest.martin@example.com",
    stay_date_match: ["2026-07-03", "2026-07-07"],
    folder_path: "stay:Kendall Pond Lodge:2026-07-03",
  },
};
const TS = "2026-06-28T15:00:00Z";

// ---- CaseSpaceDecision now carries confidence + evidence --------------------

test("airbnb appends with high confidence and named match evidence", async () => {
  const { action } = await airbnbConnector.process(SAMPLE_INPUTS.airbnb.input, { existing: [KPL] });
  assert.equal(action.action, "append");
  assert.ok(action.confidence >= 0.9, `confidence ${action.confidence}`);
  for (const dim of ["reservation_id", "guest_email_match", "stay_date_match"]) {
    assert.ok(action.matchEvidence.includes(dim), `missing match dim ${dim}`);
  }
  assert.deepEqual(action.missingEvidence, []);
});

test("drive document appends but reports what evidence it lacked", async () => {
  const { action } = await fileConnector.process(SAMPLE_INPUTS.drive.input, { existing: [KPL] });
  assert.equal(action.action, "append");
  assert.ok(action.matchEvidence.includes("folder_path"));
  assert.ok(action.missingEvidence.includes("reservation_name"));
});

test("gmail is HELD — low confidence, no match evidence, named missing evidence", async () => {
  const { action } = await gmailConnector.process(SAMPLE_INPUTS.gmail.input, { existing: [KPL] });
  assert.equal(action.action, "needs_review");
  assert.ok(action.confidence < 0.6, `confidence ${action.confidence}`);
  assert.deepEqual(action.matchEvidence, ["source:gmail"]);
  assert.deepEqual(action.missingEvidence, ["reservation_id", "guest_email_match", "stay_date_match"]);
});

// ---- needs_review preserves the signal as a ReviewItem ----------------------

test("a held gmail signal is preserved as a review item + flagged receipt", async () => {
  const q = createReviewQueue();
  const { signal, object, review, receipt } = await gmailConnector.process(
    SAMPLE_INPUTS.gmail.input,
    { existing: [KPL], review: q },
  );
  assert.equal(receipt.action, "flagged_for_review");
  assert.equal(receipt.preserved, true);
  assert.ok(review, "a review item was created");
  assert.equal(review.status, "open");
  assert.equal(review.firstReceiptId, receipt.id);
  // The original signal and object ride along, untouched.
  assert.equal(review.signal, signal);
  assert.equal(review.object, object);
  assert.equal(q.list("open").length, 1);
});

// ---- A human resolves it; a SECOND receipt links to the first ---------------

test("a human appends the held gmail signal; the second receipt links to the first", async () => {
  const q = createReviewQueue();
  const { review, receipt: first } = await gmailConnector.process(
    SAMPLE_INPUTS.gmail.input,
    { existing: [KPL], review: q },
  );

  const { reviewItem, receipt: second } = await q.resolve(
    review.id,
    { action: "append", caseSpaceId: KPL.id, resolvedBy: "nate", reason: "Matched guest email after review" },
    { timestamp: TS },
  );

  assert.equal(second.action, "human_appended_to_casespace");
  assert.equal(second.priorReceiptId, first.id); // linked
  assert.equal(second.signalId, review.signalId);
  assert.equal(second.objectId, review.objectId);
  assert.equal(second.caseSpaceId, KPL.id);
  assert.equal(second.resolvedBy, "nate");
  assert.equal(second.reason, "Matched guest email after review");
  assert.equal(second.preserved, true);
  assert.match(second.checksum, /^[0-9a-f]{64}$/);

  assert.equal(reviewItem.status, "resolved");
  assert.equal(reviewItem.secondReceiptId, second.id);
});

test("resolving does NOT overwrite the original signal, object, or first receipt", async () => {
  const q = createReviewQueue();
  const { review, signal, object, receipt: first } = await gmailConnector.process(
    SAMPLE_INPUTS.gmail.input,
    { existing: [KPL], review: q },
  );
  await q.resolve(review.id, { action: "append", caseSpaceId: KPL.id, resolvedBy: "nate" }, { timestamp: TS });
  const resolved = q.get(review.id);
  // first receipt is still flagged_for_review; original signal/object preserved by reference
  assert.equal(first.action, "flagged_for_review");
  assert.equal(resolved.signal, signal);
  assert.equal(resolved.object, object);
  assert.equal(resolved.firstReceiptId, first.id);
});

test("no silent overwrite — an item cannot be resolved twice", async () => {
  const q = createReviewQueue();
  const { review } = await gmailConnector.process(SAMPLE_INPUTS.gmail.input, { existing: [KPL], review: q });
  await q.resolve(review.id, { action: "ignore", resolvedBy: "nate" }, { timestamp: TS });
  await assert.rejects(
    () => q.resolve(review.id, { action: "append", caseSpaceId: KPL.id, resolvedBy: "nate" }, { timestamp: TS }),
    /already resolved/,
  );
});

// ---- The three human verbs + validation ------------------------------------

test("human open and ignore emit their own verbs", async () => {
  const item = makeHeldItem();
  const opened = await resolveReviewItem(item, { action: "open", caseSpaceType: "stay", resolvedBy: "nate" }, { timestamp: TS });
  assert.equal(opened.receipt.action, "human_opened_casespace");
  assert.equal(opened.receipt.caseSpaceType, "stay");
  const ignored = await resolveReviewItem(item, { action: "ignore", resolvedBy: "nate" }, { timestamp: TS });
  assert.equal(ignored.receipt.action, "human_ignored_signal");
});

test("human resolution is validated", async () => {
  const item = makeHeldItem();
  await assert.rejects(() => resolveReviewItem(item, { action: "append", resolvedBy: "nate" }), /append requires a caseSpaceId/);
  await assert.rejects(() => resolveReviewItem(item, { action: "open", resolvedBy: "nate" }), /open requires a caseSpaceType/);
  await assert.rejects(() => resolveReviewItem(item, { action: "append", caseSpaceId: "x" }), /resolvedBy is required/);
  await assert.rejects(() => resolveReviewItem(item, { action: "teleport", resolvedBy: "nate" }), /append \| open \| ignore/);
});

// Build a held item directly (no connector) for unit-testing the resolver.
function makeHeldItem() {
  const signal = { id: "sig_test1", source: "gmail" };
  const object = toPJObject({ objectType: "stay.message", title: "Check-in question", metadata: {} });
  const decision = resolveCaseSpace(object);
  return {
    id: "rev_test1",
    status: "open",
    signalId: signal.id,
    objectId: object.id,
    signal,
    object,
    decision,
    firstReceiptId: "rcpt_first",
    createdAt: TS,
  };
}
