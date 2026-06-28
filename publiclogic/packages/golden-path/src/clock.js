// Time & attendance the right way: no timesheet. The crew taps Start Work,
// Lunch, End Day on the job; each tap is a TIME entry in the recordstream, and
// hours fall out of the punches. Payroll reads the record.
import { appendPRR } from "./prr.js";

export const PUNCH_LABELS = {
  start: "Started work",
  lunch_out: "Lunch",
  lunch_in: "Back from lunch",
  end: "Ended day",
};

/** Record one time punch on the job. `at` is an ISO timestamp. */
export function punch(rt, { type, who = "crew", at }, opts = {}) {
  if (!PUNCH_LABELS[type]) throw new Error(`Unknown punch type: ${type}`);
  const stamp = at ?? opts.timestamp ?? null;
  const p = { type, who, at: stamp };
  const prr = appendPRR(rt.prr, { kind: "TIME", event: `${PUNCH_LABELS[type]} — ${who}`, by: who, at: stamp }, { timestamp: stamp });
  return { ...rt, punches: [...(rt.punches ?? []), p], prr };
}

/**
 * Compute worked hours from a punch list. Working intervals are start→lunch_out
 * and lunch_in→end (or start→end with no lunch). Returns hours to 2 decimals.
 */
export function computeHours(punches = []) {
  const at = (type) => {
    const p = punches.find((x) => x.type === type);
    return p && p.at ? Date.parse(p.at) : null;
  };
  const start = at("start");
  const end = at("end");
  const lunchOut = at("lunch_out");
  const lunchIn = at("lunch_in");
  if (start == null || end == null) return 0;

  let ms = end - start;
  if (lunchOut != null && lunchIn != null && lunchIn > lunchOut) ms -= lunchIn - lunchOut;
  return Math.round((ms / 3_600_000) * 100) / 100;
}
