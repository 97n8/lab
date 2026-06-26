import { test } from "node:test";
import assert from "node:assert/strict";
import { promises as fs, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { runSync } from "../src/sync.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const ICS = readFileSync(path.join(here, "fixtures", "kpl-sample.ics"), "utf8");
const NOW = "2026-02-10";
const TS = "2026-02-10T12:00:00.000Z";

async function tmpDir() {
  const dir = path.join(os.tmpdir(), `kpl-test-${randomUUID()}`);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

function byType(cases, type) {
  return cases.filter((c) => c.case_type === type);
}

test("sync creates booking cases and turnover cases from the feed", async () => {
  const dataDir = await tmpDir();
  const { cases } = await runSync({ icsText: ICS, dataDir, nowDate: NOW, timestamp: TS, env: {} });
  assert.equal(byType(cases, "BOOKING").length, 5); // 4 reservations + 1 block
  assert.equal(byType(cases, "TURNOVER").length, 4); // turnovers only for reservations
  assert.equal(cases.length, 9);
});

test("booking statuses reflect the as-of date", async () => {
  const dataDir = await tmpDir();
  const { cases } = await runSync({ icsText: ICS, dataDir, nowDate: NOW, timestamp: TS, env: {} });
  const find = (uid) => cases.find((c) => c.case_type === "BOOKING" && c.source_uid === uid);
  assert.equal(find("uid-active@airbnb.example").status, "ACTIVE");
  assert.equal(find("uid-future@airbnb.example").status, "CONFIRMED");
  assert.equal(find("uid-block@airbnb.example").status, "BLOCKED");
});

test("same-day checkout/check-in turnover is flagged SAME_DAY", async () => {
  const dataDir = await tmpDir();
  const { cases } = await runSync({ icsText: ICS, dataDir, nowDate: NOW, timestamp: TS, env: {} });
  const sda = cases.find((c) => c.case_type === "TURNOVER" && c.turnover_date === "2026-02-14");
  assert.equal(sda.next_checkin_date, "2026-02-14");
  assert.equal(sda.priority, "SAME_DAY");
});

test("unassigned cleaner within 48h of turnover is flagged NEEDS_ASSIGNMENT", async () => {
  const dataDir = await tmpDir();
  const { cases } = await runSync({ icsText: ICS, dataDir, nowDate: NOW, timestamp: TS, env: {} });
  const soon = cases.find((c) => c.case_type === "TURNOVER" && c.turnover_date === "2026-02-11");
  assert.equal(soon.cleaner, "unassigned");
  assert.equal(soon.status, "NEEDS_ASSIGNMENT");
  assert.equal(soon.priority, "HIGH"); // next check-in 2026-02-12 is ~24h later
});

test("re-running sync is idempotent — no duplicates, nothing re-updated", async () => {
  const dataDir = await tmpDir();
  const first = await runSync({ icsText: ICS, dataDir, nowDate: NOW, timestamp: TS, env: {} });
  const second = await runSync({ icsText: ICS, dataDir, nowDate: NOW, timestamp: TS, env: {} });
  assert.equal(second.cases.length, first.cases.length);
  const ids1 = new Set(first.cases.map((c) => c.case_id));
  const ids2 = new Set(second.cases.map((c) => c.case_id));
  assert.deepEqual([...ids1].sort(), [...ids2].sort());
  assert.equal(second.stats.bookings_created, 0);
  assert.equal(second.stats.turnovers_created, 0);
  assert.equal(second.stats.bookings_updated, 0);
  assert.equal(second.stats.turnovers_updated, 0);
});

test("human-set cleaner and progress survive a re-sync", async () => {
  const dataDir = await tmpDir();
  await runSync({ icsText: ICS, dataDir, nowDate: NOW, timestamp: TS, env: {} });

  const casesPath = path.join(dataDir, "cases.json");
  const cases = JSON.parse(await fs.readFile(casesPath, "utf8"));
  const turn = cases.find((c) => c.case_type === "TURNOVER" && c.turnover_date === "2026-02-14");
  turn.cleaner = "Maria";
  turn.checklist.beds_reset = true;
  await fs.writeFile(casesPath, JSON.stringify(cases, null, 2));

  await runSync({ icsText: ICS, dataDir, nowDate: NOW, timestamp: TS, env: {} });
  const after = JSON.parse(await fs.readFile(casesPath, "utf8"));
  const again = after.find((c) => c.case_id === turn.case_id);
  assert.equal(again.cleaner, "Maria"); // not reverted to "unassigned"
  assert.equal(again.checklist.beds_reset, true); // progress preserved
  assert.equal(again.status, "SCHEDULED"); // assigned cleaner => scheduled, not NEEDED
});

test("an event that disappears is flagged SOURCE_MISSING_REVIEW, never deleted", async () => {
  const dataDir = await tmpDir();
  await runSync({ icsText: ICS, dataDir, nowDate: NOW, timestamp: TS, env: {} });

  // Drop the future reservation from the feed and re-sync.
  const trimmed = ICS.replace(
    /BEGIN:VEVENT\n(?:(?!END:VEVENT)[\s\S])*uid-future@airbnb\.example[\s\S]*?END:VEVENT\n/,
    ""
  );
  const { cases } = await runSync({
    icsText: trimmed,
    dataDir,
    nowDate: NOW,
    timestamp: TS,
    env: {},
  });
  const future = cases.find(
    (c) => c.case_type === "BOOKING" && c.source_uid === "uid-future@airbnb.example"
  );
  assert.ok(future, "case is retained, not deleted");
  assert.equal(future.status, "SOURCE_MISSING_REVIEW");
});

test("dashboard has the required shape and no secrets are stored", async () => {
  const dataDir = await tmpDir();
  const { dashboard } = await runSync({
    icsText: ICS,
    dataDir,
    nowDate: NOW,
    timestamp: TS,
    env: {},
  });
  for (const key of [
    "property",
    "generated_at",
    "active_bookings",
    "upcoming_checkins",
    "upcoming_checkouts",
    "turnovers_needed",
    "blocked_cases",
    "all_cases",
  ]) {
    assert.ok(key in dashboard, `dashboard missing ${key}`);
  }
  assert.equal(dashboard.property, "Kendall Pond Lodge");
  assert.equal(dashboard.active_bookings.length, 1);

  // The sync log must not leak any URL/token.
  const log = await fs.readFile(path.join(dataDir, "sync-log.jsonl"), "utf8");
  assert.doesNotMatch(log, /https?:\/\//);
});
