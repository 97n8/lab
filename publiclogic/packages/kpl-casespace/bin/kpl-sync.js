#!/usr/bin/env node
// KPL CaseSpace sync CLI. Reads the Airbnb iCal source from env/config only.
//   node bin/kpl-sync.js                 (uses AIRBNB_KPL_ICAL_URL)
//   node bin/kpl-sync.js --file path.ics (sync a local .ics instead)
import { runSync } from "../src/sync.js";
import { dataDir } from "../src/storage.js";

const argv = process.argv.slice(2);
const fileIdx = argv.indexOf("--file");
const env = { ...process.env };
if (fileIdx !== -1 && argv[fileIdx + 1]) env.KPL_ICAL_FILE = argv[fileIdx + 1];

try {
  const { stats, source, nowDate } = await runSync({ env });
  console.log("KPL CaseSpace sync — Kendall Pond Lodge");
  console.log(`  source      : ${source}`); // never the URL/token
  console.log(`  as-of date  : ${nowDate}`);
  console.log(`  events      : ${stats.events}`);
  console.log(
    `  bookings    : +${stats.bookings_created} new, ~${stats.bookings_updated} updated`
  );
  console.log(
    `  turnovers   : +${stats.turnovers_created} new, ~${stats.turnovers_updated} updated`
  );
  if (stats.source_missing_flagged) {
    console.log(`  ⚠ flagged   : ${stats.source_missing_flagged} SOURCE_MISSING_REVIEW`);
  }
  console.log(`  total cases : ${stats.total_cases}`);
  console.log(`  written to  : ${dataDir(env)}`);
} catch (err) {
  console.error(`KPL sync failed: ${err.message}`);
  process.exitCode = 1;
}
