# Build Notes

This folder is named `publiclogic` so it can become the real repo without renaming later.

## Status

- [x] Final page copy across Home, Work, CaseSpaces, PJ, VAULT, Contact.
- [x] Square favicon mark (replaces the wide horizontal logo used as a placeholder).
- [x] Header + footer with brand mark and full navigation.
- [x] Per-page metadata, OpenGraph/Twitter cards, sitemap, and robots.
- [x] Contact route with email CTA and intake guidance.
- [x] Dependencies pinned (Next 16 / React 19 / TS 6) — no `latest` specs.
- [x] ESLint 9 flat config (`eslint .`; `next lint` was removed in Next 16).
- [x] OG/Twitter social card generated at build via `next/og` (`app/opengraph-image.tsx`).
- [x] Sitemap covers all public routes; `/kpl` linked from the header nav.
- [x] CI gate: `.github/workflows/publiclogic.yml` (lint, build, pj/golden-path/kpl tests).
- [x] `@publiclogic/pj` 1.0.0 — real package entry + `exports` map (dead `PJCase` stub removed).

## Next steps

1. Replace placeholder logo SVGs with final brand artwork.
2. Confirm the public contact address (currently `hello@publiclogic.org`).
3. Add a server-backed contact form when a mail/backend provider is chosen.
4. Add Supabase only when the schemas stabilize.
5. Deploy to Vercel (root directory `apps/web`).
