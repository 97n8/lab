import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseICS, parseICSDate } from "../src/ical.js";
import { isBlockEvent } from "../src/cases.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const ics = readFileSync(path.join(here, "fixtures", "kpl-sample.ics"), "utf8");

test("parseICSDate handles all-day and date-time values", () => {
  assert.equal(parseICSDate("20260208"), "2026-02-08");
  assert.equal(parseICSDate("20260208T150000Z"), "2026-02-08");
  assert.equal(parseICSDate("nonsense"), null);
});

test("parses every VEVENT from the Airbnb fixture", () => {
  const events = parseICS(ics);
  assert.equal(events.length, 5);
});

test("uses event end as checkout date without decrementing (exclusive end kept as-is)", () => {
  const events = parseICS(ics);
  const active = events.find((e) => e.uid === "uid-active@airbnb.example");
  assert.equal(active.start, "2026-02-08"); // check-in = event start
  assert.equal(active.end, "2026-02-11"); // checkout = event end, NOT 02-10
  assert.equal(active.allDay, true);
});

test("unfolds folded DESCRIPTION lines", () => {
  const events = parseICS(ics);
  const active = events.find((e) => e.uid === "uid-active@airbnb.example");
  assert.match(active.description, /reservations\/details\/ACTIVE1/);
  assert.match(active.description, /Phone Number/);
});

test("detects Airbnb blocked dates", () => {
  const events = parseICS(ics);
  const block = events.find((e) => e.uid === "uid-block@airbnb.example");
  assert.equal(isBlockEvent(block.summary), true);
  assert.equal(isBlockEvent("Reserved"), false);
});
