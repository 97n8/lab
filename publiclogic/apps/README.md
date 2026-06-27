# apps/ — Product skins (thin)

User-facing products. Each composes shared `capabilities/`, `ui/`, and templates;
it holds configuration and branding, not business logic.

Current:

- `web/` — marketing site + `/kpl` STAY dashboard preview (Next.js).

Planned skins:

- `stay/` — short-term rental ops (first property: Kendall Pond Lodge)
- `muni/` · `biz/` · `grant/` — domain skins
- `admin/` — internal operations
- `docs/` — public docs / marketing (may absorb `web/`)

A product skin contains almost no logic. STAY, for example, assembles
`capabilities/booking`, `capabilities/turnover`, `capabilities/guestbook`, etc.,
and supplies `templates/` (lakehouse · cabin · condo · boutique) + `branding/`.
