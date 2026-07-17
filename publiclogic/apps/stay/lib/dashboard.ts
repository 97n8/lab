// Reads the operational STAY dashboard — Booking + Turnover CaseSpaces derived
// from the Airbnb iCal export by @publiclogic/kpl-casespace (`npm run kpl:sync`).
//
// The iCal feed never carries a guest name or a dollar amount (Airbnb doesn't
// put either in the export), so this is privacy-safe operational data: dates,
// status, cleaner, priority. Financial figures live in ./transactions.ts,
// sourced from a *different* Airbnb export (Transaction History CSV).

import { promises as fs } from "node:fs";
import path from "node:path";
import sample from "../data/sample-dashboard.json";

// Next.js bundles server components into .next/, so import.meta.url would
// resolve inside the build output rather than the source tree. process.cwd()
// is reliable instead: npm workspace scripts always run with cwd set to the
// package directory (apps/stay), regardless of dev/build/start.
// apps/stay -> apps -> publiclogic
const LIVE_PATH = path.resolve(process.cwd(), "..", "..", "data", "kpl", "dashboard.json");

export interface Booking {
  case_id: string;
  guest_name: string | null;
  check_in_date: string;
  checkout_date: string;
  status: string;
  linked_turnover_case_id: string | null;
}

export interface Turnover {
  case_id: string;
  booking_case_id: string;
  turnover_date: string;
  next_checkin_date: string | null;
  priority: "NORMAL" | "HIGH" | "SAME_DAY" | string;
  cleaner: string;
  status: string;
}

export interface Dashboard {
  property: string;
  generated_at: string;
  now_date: string;
  counts: {
    total_cases: number;
    active_bookings: number;
    upcoming_checkins: number;
    upcoming_checkouts: number;
    turnovers_needed: number;
    blocked_cases: number;
  };
  active_bookings: Booking[];
  upcoming_checkins: Booking[];
  upcoming_checkouts: Booking[];
  turnovers_needed: Turnover[];
  blocked_cases: (Booking | Turnover)[];
  all_cases: (Booking | Turnover)[];
}

export interface DashboardResult {
  dashboard: Dashboard;
  live: boolean;
}

/** Live sync output if `npm run kpl:sync` has been run locally; otherwise the
 *  committed sample fixture (same shape apps/web uses for /kpl and /stay). */
export async function loadDashboard(): Promise<DashboardResult> {
  try {
    const raw = await fs.readFile(LIVE_PATH, "utf8");
    return { dashboard: JSON.parse(raw) as Dashboard, live: true };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    return { dashboard: sample as Dashboard, live: false };
  }
}
