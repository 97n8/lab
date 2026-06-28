// Build the dashboard view over stored cases. Pure function, no I/O.

const ATTENTION_STATUSES = new Set(["NEEDS_ASSIGNMENT", "BLOCKED", "SOURCE_MISSING_REVIEW"]);

function bookingView(c) {
  return {
    case_id: c.case_id,
    guest_name: c.guest_name,
    check_in_date: c.check_in_date,
    checkout_date: c.checkout_date,
    status: c.status,
    linked_turnover_case_id: c.linked_turnover_case_id,
  };
}

function turnoverView(c) {
  return {
    case_id: c.case_id,
    booking_case_id: c.booking_case_id,
    turnover_date: c.turnover_date,
    next_checkin_date: c.next_checkin_date,
    priority: c.priority,
    cleaner: c.cleaner,
    status: c.status,
  };
}

export function buildDashboard(cases, nowDate, generatedAt) {
  const bookings = cases.filter((c) => c.case_type === "BOOKING");
  const turnovers = cases.filter((c) => c.case_type === "TURNOVER");
  const byDate = (key) => (a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0);

  const active = bookings.filter((c) => c.status === "ACTIVE").sort(byDate("checkout_date"));

  const upcomingCheckins = bookings
    .filter((c) => c.status === "CONFIRMED" && c.check_in_date >= nowDate)
    .sort(byDate("check_in_date"));

  const upcomingCheckouts = bookings
    .filter(
      (c) => (c.status === "ACTIVE" || c.status === "CONFIRMED") && c.checkout_date >= nowDate
    )
    .sort(byDate("checkout_date"));

  const turnoversNeeded = turnovers
    .filter((c) => c.status !== "DONE" && c.turnover_date >= nowDate)
    .sort(byDate("turnover_date"));

  // Attention list: turnovers needing a cleaner/blocked, plus anything whose
  // source event disappeared. Owner-intended Airbnb BLOCKED bookings are not noise.
  const blocked = cases
    .filter(
      (c) =>
        ATTENTION_STATUSES.has(c.status) &&
        !(c.case_type === "BOOKING" && c.status === "BLOCKED")
    )
    .map((c) => (c.case_type === "BOOKING" ? bookingView(c) : turnoverView(c)));

  return {
    property: "Kendall Pond Lodge",
    generated_at: generatedAt,
    now_date: nowDate,
    counts: {
      total_cases: cases.length,
      active_bookings: active.length,
      upcoming_checkins: upcomingCheckins.length,
      upcoming_checkouts: upcomingCheckouts.length,
      turnovers_needed: turnoversNeeded.length,
      blocked_cases: blocked.length,
    },
    active_bookings: active.map(bookingView),
    upcoming_checkins: upcomingCheckins.map(bookingView),
    upcoming_checkouts: upcomingCheckouts.map(bookingView),
    turnovers_needed: turnoversNeeded.map(turnoverView),
    blocked_cases: blocked,
    all_cases: cases.map((c) =>
      c.case_type === "BOOKING" ? bookingView(c) : turnoverView(c)
    ),
  };
}
