import { test } from "node:test";
import assert from "node:assert/strict";
import {
  compileSeed,
  canAttach,
  GOVERNED_OBJECTS,
  ASSET_TYPES,
  DOCUMENT_FOLDERS,
  CASESPACE_TABS,
} from "../src/index.js";

const TS = "2026-06-28T00:00:00.000Z";

test("a seed produces exactly four governed objects", () => {
  const r = compileSeed({ type: "website", value: "kendallpond.com" }, { timestamp: TS });
  assert.equal(r.source_profile.object, "SOURCE_PROFILE");
  assert.equal(r.asset_set.object, "ASSET_SET");
  assert.equal(r.document_set.object, "DOCUMENT_SET");
  assert.equal(r.casespace.object, "CASESPACE");
});

test("derives a name and website from a domain seed", () => {
  const r = compileSeed({ type: "website", value: "https://www.kendall-pond.com/" });
  assert.equal(r.source_profile.name, "Kendall Pond");
  assert.equal(r.source_profile.website, "https://kendall-pond.com");
  assert.equal(r.source_profile.confidence, "high");
});

test("airbnb seed guesses STAY and connects Airbnb + iCal", () => {
  const r = compileSeed({ type: "airbnb", value: "https://www.airbnb.com/rooms/12345" });
  assert.equal(r.source_profile.name, "Airbnb Listing 12345");
  assert.equal(r.source_profile.lane_guess, "STAY");
  assert.deepEqual(r.source_profile.connected_tools, ["Airbnb", "iCal"]);
  // STAY suggests the property-shaped asset buckets
  const suggested = r.asset_set.types.filter((t) => t.suggested).map((t) => t.type);
  assert.ok(suggested.includes("properties"));
});

test("github seed names the repo, aliases the owner, guesses BIZ", () => {
  const r = compileSeed({ type: "github", value: "github.com/97n8/lab" });
  assert.equal(r.source_profile.name, "Lab");
  assert.deepEqual(r.source_profile.aliases, ["97n8"]);
  assert.equal(r.source_profile.lane_guess, "BIZ");
});

test(".gov domain guesses MUNI", () => {
  const r = compileSeed({ type: "domain", value: "townofx.gov" });
  assert.equal(r.source_profile.lane_guess, "MUNI");
});

test("start-from-scratch still yields the four objects with low confidence", () => {
  const r = compileSeed({ type: "scratch", value: "" });
  assert.equal(r.source_profile.name, "New Operation");
  assert.equal(r.source_profile.confidence, "low");
  assert.equal(r.casespace.object, "CASESPACE");
});

test("document set is always the eight housed folders", () => {
  const r = compileSeed({ type: "scratch", value: "x" });
  assert.deepEqual(r.document_set.folders.map((f) => f.folder), DOCUMENT_FOLDERS);
});

test("asset set is the canonical asset types, nothing more", () => {
  const r = compileSeed({ type: "scratch", value: "x" });
  assert.deepEqual(r.asset_set.types.map((t) => t.type), ASSET_TYPES);
});

test("starter CaseSpace is the five-tab edge", () => {
  const r = compileSeed({ type: "scratch", value: "x" });
  assert.deepEqual(r.casespace.tabs, CASESPACE_TABS);
});

test("compile is deterministic — same seed, same ids", () => {
  const a = compileSeed({ type: "airbnb", value: "airbnb.com/rooms/999" });
  const b = compileSeed({ type: "airbnb", value: "airbnb.com/rooms/999" });
  assert.equal(a.source_profile.id, b.source_profile.id);
  assert.equal(a.casespace.id, b.casespace.id);
});

test("the four objects cross-reference back to the Source Profile", () => {
  const r = compileSeed({ type: "website", value: "x.com" });
  assert.equal(r.asset_set.source_profile_id, r.source_profile.id);
  assert.equal(r.document_set.source_profile_id, r.source_profile.id);
  assert.equal(r.casespace.source_profile_id, r.source_profile.id);
});

test("attach rule: only the four governed kinds are runtime roots", () => {
  for (const k of GOVERNED_OBJECTS) assert.equal(canAttach(k), true);
  for (const k of ["WORKFLOW", "AUTOMATION", "AGENT", "FORM", ""]) {
    assert.equal(canAttach(k), false);
  }
});
