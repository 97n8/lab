# @publiclogic/stay

STAY operator dashboard — the first STAY product configuration, for **Kendall
Pond Lodge**. Standalone Next.js app (its own dev server, port 3001), so it can
be worked on and deployed independently of `apps/web`.

It reads two Airbnb exports, each carrying different information:

| Source | Command | Gives you | Never gives you |
| --- | --- | --- | --- |
| iCal calendar export | `npm run kpl:sync` (writes `data/kpl/dashboard.json`) | dates, status, cleaner, priority | guest name, dollar amounts |
| Transaction History CSV export (Earnings → Transaction History) | manual download → save as `data/kpl/transactions.csv` | guest name, gross/net, fees, tax | live booking/turnover status |

Dashboard, Reservations, and Financials use the transaction export.
Turnovers and Calendar use the CaseSpace sync. Both files are gitignored
(`data/kpl/*.json`, `*.jsonl`, `*.csv`) since they can contain reservation
data; without them the app falls back to the committed sample fixtures in
`data/` and says so in the UI.

## Run

```bash
npm install            # from the repo root
npm run stay:dev        # http://localhost:3001
```

## Structure

- `app/page.tsx` — server component, loads both data sources
- `app/StayApp.tsx` — client component, sidebar nav + views
- `lib/dashboard.ts` — reads `data/kpl/dashboard.json` (kpl-casespace output)
- `lib/transactions.ts` — CSV parser + totals/monthly for the earnings export
- `data/` — committed sample fixtures used when no live file exists

See `ARCHITECTURE.md` at the repo root for how this fits the target
`apps/ → capabilities/ → models/ → doctrine/ → runtime/` layering — `stay`
currently talks to `@publiclogic/kpl-casespace` directly rather than through
`capabilities/booking` + `capabilities/turnover`, which is the next planned
extraction.
