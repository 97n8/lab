# apps/ — Product skins (thin)

User-facing products. Each composes shared `capabilities/`, `ui/`, and templates;
it holds configuration and branding, not business logic.

Current:

- `web/` — platform app: product dashboards and previews (`/kpl`, `/vault`, `/muni`,
  `/stay`, `/casespaces`, etc.) (Next.js).
- `stay/` — standalone STAY operator dashboard (Next.js, port 3001). First
  property: Kendall Pond Lodge. Reads operational status (bookings, turnovers,
  calendar) from `@publiclogic/kpl-casespace`'s `data/kpl/dashboard.json`, and
  financials (guest name, payouts, fees) from a separately-exported Airbnb
  Transaction History CSV at `data/kpl/transactions.csv` — the iCal feed that
  drives kpl-casespace carries neither. Falls back to committed sample fixtures
  when neither live file is present. Run with `npm run stay:dev`.
- `marketing/` — standalone public marketing site (Next.js, no workspace-package
  dependencies, deployable on its own).

Planned skins:

- `muni/` · `biz/` · `grant/` — domain skins
- `admin/` — internal operations
- `docs/` — public docs / marketing (may absorb `web/`)

A product skin contains almost no logic. STAY, for example, assembles
`capabilities/booking`, `capabilities/turnover`, `capabilities/guestbook`, etc.,
and supplies `templates/` (lakehouse · cabin · condo · boutique) + `branding/`.
