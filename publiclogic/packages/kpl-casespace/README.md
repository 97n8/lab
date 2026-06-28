# @publiclogic/kpl-casespace

A lightweight **STAY / CaseSpace** feed for **Kendall Pond Lodge (KPL)**. It ingests
the official Airbnb calendar **iCal export** and turns reservations into governed
**Booking** and **Turnover** cases. This is a v0 cockpit — not a property-management
system. No scraping, no unofficial Airbnb API, no stored credentials.

## What it does

1. Reads `AIRBNB_KPL_ICAL_URL` from the environment (config only).
2. Fetches the `.ics` feed (official Airbnb export URL).
3. Parses calendar events (reservations and owner blocks).
4. Normalizes each into a **Booking Case** (`KPL-BOOK-{check-in}-{hash}`).
5. Opens/updates a **Turnover Case** from each checkout (`KPL-TURN-{checkout}-{hash}`).
6. Stores normalized records as JSON under `data/kpl/`.
7. Is **idempotent** — re-running never duplicates cases, and never deletes them.
8. Produces a dashboard (`data/kpl/dashboard.json`).

### Date handling

Airbnb iCal events are treated as stay blocks: **check-in = event start**,
**checkout = event end**. All-day events use an exclusive end date — but per the
KPL rule we do **not** decrement it: the turnover happens **on the checkout date**.

## Setup

### 1. Get your Airbnb calendar export URL

In the Airbnb **host** dashboard:

1. Go to **Calendar** for the Kendall Pond Lodge listing.
2. Open **Availability** → **Connect / sync calendars**.
3. Choose **Export calendar**.
4. Copy the **iCal link** Airbnb gives you.

> The link contains a private token — treat it like a password. Do not paste it
> into code, commits, or chat.

### 2. Put it in local env only

Copy `.env.example` to `.env` at the repo root (`publiclogic/.env`) and set:

```
AIRBNB_KPL_ICAL_URL=https://www.airbnb.com/calendar/ical/XXXX.ics?s=YYYY
```

`.env` is gitignored. The URL is read from the environment at runtime and is never
logged or written to disk (the sync log records only a generic `source` label).

## Usage

From the repo root (`publiclogic/`):

```bash
npm run kpl:sync         # fetch AIRBNB_KPL_ICAL_URL, reconcile cases
npm run kpl:dashboard    # rebuild + print the dashboard from stored cases
npm run kpl:test         # run the test suite
```

Sync a local `.ics` instead of the live feed (handy for a dry run):

```bash
npm run kpl:sync -- --file packages/kpl-casespace/test/fixtures/kpl-sample.ics
```

Useful env vars:

- `AIRBNB_KPL_ICAL_URL` — the Airbnb export URL (required for a live sync).
- `KPL_ICAL_FILE` — path to a local `.ics` (alternative to the URL).
- `KPL_DATA_DIR` — override the output directory (defaults to `data/kpl`).
- `KPL_NOW` — pin the "as-of" date (`YYYY-MM-DD`) for testing/demos.

## Output files

- `data/kpl/cases.json` — all Booking + Turnover cases.
- `data/kpl/dashboard.json` — the dashboard view.
- `data/kpl/sync-log.jsonl` — one line per sync (timestamp, source label, counts).

These are gitignored because they can contain reservation data.

## CaseSpace rules

- A booking opens a Booking Case; a checkout opens/updates a Turnover Case.
- Next check-in **within 24h** → turnover priority `HIGH`; **same day** → `SAME_DAY`.
- Cleaner still `unassigned` **within 48h** of turnover → status `NEEDS_ASSIGNMENT`.
- Human-set fields (cleaner, checklist, `SCHEDULED`/`DONE` status) survive re-syncs.
- Cases are never auto-deleted. A still-relevant case whose source event vanished
  is flagged `SOURCE_MISSING_REVIEW`; past/closed cases that age out are left alone.

## Data model

**Booking Case** — `case_id`, `case_type=BOOKING`, `source=AIRBNB_ICAL`, `source_uid`,
`listing`, `check_in_date`, `checkout_date`, `guest_name` (defaults to `"Airbnb Guest"`),
`platform=Airbnb`, `status` (`CONFIRMED`/`ACTIVE`/`CLOSED`/`BLOCKED`),
`raw_summary`, `raw_description`, `linked_turnover_case_id`, `created_at`, `updated_at`.

**Turnover Case** — `case_id`, `case_type=TURNOVER`, `booking_case_id`, `turnover_date`,
`next_checkin_date`, `cleaner` (`unassigned` by default), `status`
(`NEEDED`/`SCHEDULED`/`DONE`/`BLOCKED`/`NEEDS_ASSIGNMENT`), `priority`
(`NORMAL`/`HIGH`/`SAME_DAY`), `checklist` (beds, bathrooms, kitchen, trash, towels,
hot tub, damage/photo, welcome items), `created_at`, `updated_at`.

## Notes / non-goals (v0)

- Uses a small built-in iCal reader (no third-party dependency) so all-day
  exclusive-end dates are handled exactly and tests run offline.
- No auth, UI, payments, or messaging yet — deliberately out of scope for v0.
