# @publiclogic/marketing

The standalone PublicLogic marketing site — Next.js App Router, Tailwind v4,
no workspace dependencies. Seeded from a v0-generated template and rewritten
with PublicLogic's own product content (PuddleJumper, CaseSpaces, the STAY /
MUNI / BIZ / GRANT product skins, and the three working pilots).

This app is intentionally separate from `publiclogic/apps/web`, which is the
integrated platform app (dashboards for `kpl`, `vault`, `muni`, `stay`, etc.).
This app is marketing-only and has no dependency on `@publiclogic/golden-path`
or any other workspace package, so it can be deployed on its own.

## Pages

- `/` — home
- `/product` — how the PuddleJumper runtime and product skins fit together
- `/pilots` — the three working pilots (small contractor, town HR, cemetery records)
- `/about` — mission and values
- `/contact` — contact form
- `/privacy`, `/terms` — legal

## Run

```bash
npm install
npm run dev
```

## Deploy

Connect this directory to Vercel with:

- Framework: Next.js
- Root Directory: `publiclogic/apps/marketing`
- Build Command: `npm run build` (default)
- Install Command: `npm install` (default)
