// Normalization: turn parsed iCal events into idempotent Booking and Turnover
// CaseSpace records, and merge them against whatever already exists on disk.
import { createHash } from "node:crypto";

export const TURNOVER_CHECKLIST_KEYS = [
  "beds_reset",
  "bathrooms_reset",
  "kitchen_reset",
  "trash_removed",
  "towels_stocked",
  "hot_tub_checked",
  "damage_photo_check",
  "welcome_items_placed",
];

// Turnover statuses a human has driven — never auto-overwritten by a re-sync.
const HUMAN_TURNOVER_STATUS = new Set(["SCHEDULED", "DONE"]);

export function shortHash(input) {
  return createHash("sha256").update(String(input)).digest("hex").slice(0, 8);
}

export function bookingCaseId(checkInDate, sourceUid) {
  return `KPL-BOOK-${checkInDate}-${shortHash(sourceUid)}`;
}

export function turnoverCaseId(checkoutDate, bookingId) {
  return `KPL-TURN-${checkoutDate}-${shortHash(bookingId)}`;
}

export function isBlockEvent(summary = "") {
  return /not\s*available|unavailable|blocked/i.test(summary);
}

export function defaultChecklist() {
  return Object.fromEntries(TURNOVER_CHECKLIST_KEYS.map((k) => [k, false]));
}

/** Date helpers operate on `YYYY-MM-DD` strings (lexicographic === chronological). */
export function daysBetween(fromDate, toDate) {
  const a = Date.parse(`${fromDate}T00:00:00Z`);
  const b = Date.parse(`${toDate}T00:00:00Z`);
  return Math.round((b - a) / 86400000);
}

export function bookingStatus(checkIn, checkout, block, nowDate) {
  if (block) return "BLOCKED";
  if (nowDate < checkIn) return "CONFIRMED";
  if (nowDate >= checkout) return "CLOSED";
  return "ACTIVE";
}

export function turnoverPriority(checkout, nextCheckin) {
  if (!nextCheckin) return "NORMAL";
  const d = daysBetween(checkout, nextCheckin);
  if (d === 0) return "SAME_DAY";
  if (d <= 1) return "HIGH"; // next check-in within ~24h
  return "NORMAL";
}

export function autoTurnoverStatus(cleaner, turnoverDate, nowDate) {
  if (cleaner && cleaner !== "unassigned") return "SCHEDULED";
  const d = daysBetween(nowDate, turnoverDate);
  if (d >= 0 && d <= 2) return "NEEDS_ASSIGNMENT"; // unassigned within 48h
  return "NEEDED";
}

/**
 * Reconcile parsed events with existing cases.
 * Pure function: no I/O. Returns { cases, stats }.
 */
export function syncCases({ events, nowDate, existing = [], timestamp }) {
  const existingById = new Map(existing.map((c) => [c.case_id, c]));
  const out = new Map(existing.map((c) => [c.case_id, { ...c }]));
  const desired = new Set();
  const stats = {
    events: events.length,
    bookings_created: 0,
    bookings_updated: 0,
    turnovers_created: 0,
    turnovers_updated: 0,
    source_missing_flagged: 0,
  };

  const evs = events
    .filter((e) => e.start && e.end)
    .map((e) => ({ ...e, block: isBlockEvent(e.summary) }));

  const reservationCheckins = evs
    .filter((e) => !e.block)
    .map((e) => e.start)
    .sort();

  // ---- Booking cases (reservations and blocks both open a booking case) ----
  for (const e of evs) {
    const id = bookingCaseId(e.start, e.uid);
    desired.add(id);
    const turnoverId = e.block ? null : turnoverCaseId(e.end, id);
    const fields = {
      case_id: id,
      case_type: "BOOKING",
      source: "AIRBNB_ICAL",
      source_uid: e.uid,
      listing: "Kendall Pond Lodge",
      check_in_date: e.start,
      checkout_date: e.end,
      guest_name: e.block ? null : "Airbnb Guest",
      platform: "Airbnb",
      status: bookingStatus(e.start, e.end, e.block, nowDate),
      raw_summary: e.summary,
      raw_description: e.description,
      linked_turnover_case_id: turnoverId,
    };
    const verb = upsertFlat(out, existingById, id, fields, timestamp);
    if (verb === "created") stats.bookings_created++;
    else if (verb === "updated") stats.bookings_updated++;
  }

  // ---- Turnover cases (one per reservation checkout) ----
  for (const e of evs) {
    if (e.block) continue;
    const bookingId = bookingCaseId(e.start, e.uid);
    const checkout = e.end;
    const id = turnoverCaseId(checkout, bookingId);
    desired.add(id);

    const nextCheckin =
      reservationCheckins.find((d) => d >= checkout) || null; // soonest check-in on/after checkout
    const priority = turnoverPriority(checkout, nextCheckin);
    const prev = existingById.get(id);

    if (!prev) {
      const cleaner = "unassigned";
      out.set(id, {
        case_id: id,
        case_type: "TURNOVER",
        booking_case_id: bookingId,
        turnover_date: checkout,
        next_checkin_date: nextCheckin,
        priority,
        cleaner,
        status: autoTurnoverStatus(cleaner, checkout, nowDate),
        checklist: defaultChecklist(),
        created_at: timestamp,
        updated_at: timestamp,
      });
      stats.turnovers_created++;
      continue;
    }

    const merged = { ...prev };
    let changed = false;
    const derived = {
      booking_case_id: bookingId,
      turnover_date: checkout,
      next_checkin_date: nextCheckin,
      priority,
    };
    for (const [k, v] of Object.entries(derived)) {
      if (merged[k] !== v) {
        merged[k] = v;
        changed = true;
      }
    }
    // Auto-manage status only when a human has not taken it over.
    if (!HUMAN_TURNOVER_STATUS.has(merged.status)) {
      const auto = autoTurnoverStatus(merged.cleaner, checkout, nowDate);
      if (merged.status !== auto) {
        merged.status = auto;
        changed = true;
      }
    }
    if (changed) {
      merged.updated_at = timestamp;
      stats.turnovers_updated++;
    }
    out.set(id, merged);
  }

  // ---- Cases whose source event vanished: flag, never delete ----
  for (const c of out.values()) {
    if (desired.has(c.case_id)) continue;
    if (c.status === "SOURCE_MISSING_REVIEW") continue;
    const relevantDate = c.case_type === "BOOKING" ? c.checkout_date : c.turnover_date;
    const stillRelevant = relevantDate && relevantDate >= nowDate;
    const terminal = c.status === "CLOSED" || c.status === "DONE";
    const sourceDerived = c.source === "AIRBNB_ICAL" || c.case_type === "TURNOVER";
    // "unless clearly safe": a case that already aged out (past/terminal) is left alone.
    if (stillRelevant && !terminal && sourceDerived) {
      c.status = "SOURCE_MISSING_REVIEW";
      c.updated_at = timestamp;
      stats.source_missing_flagged++;
    }
  }

  const cases = [...out.values()];
  stats.total_cases = cases.length;
  return { cases, stats };
}

function upsertFlat(out, existingById, id, fields, timestamp) {
  const prev = existingById.get(id);
  if (!prev) {
    out.set(id, { ...fields, created_at: timestamp, updated_at: timestamp });
    return "created";
  }
  const merged = { ...prev };
  let changed = false;
  for (const [k, v] of Object.entries(fields)) {
    if (merged[k] !== v) {
      merged[k] = v;
      changed = true;
    }
  }
  if (changed) merged.updated_at = timestamp;
  out.set(id, merged);
  return changed ? "updated" : "unchanged";
}
