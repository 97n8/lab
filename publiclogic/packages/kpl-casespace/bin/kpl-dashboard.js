#!/usr/bin/env node
// Rebuild and print the KPL dashboard from stored cases. Read-only over the feed
// (does not fetch Airbnb); recomputes the view against today's date.
import { buildDashboard } from "../src/dashboard.js";
import { nowDateOf } from "../src/sync.js";
import { dataDir, loadCases, saveDashboard } from "../src/storage.js";

const env = { ...process.env };
const dir = dataDir(env);
const nowDate = nowDateOf(env);
const cases = await loadCases(dir);

if (!cases.length) {
  console.log("No KPL cases found yet. Run `npm run kpl:sync` first.");
  process.exit(0);
}

const dashboard = buildDashboard(cases, nowDate, new Date().toISOString());
await saveDashboard(dir, dashboard);

const c = dashboard.counts;
console.log(`Kendall Pond Lodge — CaseSpace dashboard (as of ${nowDate})`);
console.log("─".repeat(52));
console.log(`  Active bookings    : ${c.active_bookings}`);
console.log(`  Upcoming check-ins : ${c.upcoming_checkins}`);
console.log(`  Upcoming checkouts : ${c.upcoming_checkouts}`);
console.log(`  Turnovers needed   : ${c.turnovers_needed}`);
console.log(`  Blocked / review   : ${c.blocked_cases}`);
console.log(`  Total cases        : ${c.total_cases}`);

if (dashboard.turnovers_needed.length) {
  console.log("\n  Turnovers:");
  for (const t of dashboard.turnovers_needed) {
    const flag = t.priority === "SAME_DAY" ? " [SAME_DAY]" : t.priority === "HIGH" ? " [HIGH]" : "";
    console.log(
      `   • ${t.turnover_date}  ${t.status.padEnd(16)} cleaner:${t.cleaner}${flag}`
    );
  }
}
if (dashboard.blocked_cases.length) {
  console.log("\n  Needs attention:");
  for (const b of dashboard.blocked_cases) {
    console.log(`   • ${b.case_id}  ${b.status}`);
  }
}
console.log(`\n  Full JSON: ${dir}/dashboard.json`);
