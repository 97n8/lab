# capabilities/ — Reusable business capabilities

(Renamed from `modules/`.) A capability is a reusable operational ability the
runtime exposes — Booking, Turnover, Guestbook, Calendar, Maintenance — that any
product skin composes **without changing its core behavior**.

> "Capability" avoids confusion with application modules and does not collide with
> the canon's **Module** (a ratified CaseSpace template family). See `docs/canon/`.

Planned capabilities:

- `guestbook/` · `booking/` · `turnover/` · `maintenance/` · `inventory/`
- `finance/` · `messaging/` · `calendar/` · `vendors/` · `analytics/`
- `files/` · `photos/` · `tasks/` · `reviews/` · `signatures/` · `reports/`

First extraction target: `booking/` and `turnover/` from `packages/kpl-casespace`.
