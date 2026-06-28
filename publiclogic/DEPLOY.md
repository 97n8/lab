# Deploying PublicLogic to Vercel

The repo `97n8/lab` contains the project under `publiclogic/`, and the Next.js
app under `publiclogic/apps/web` (an npm-workspaces monorepo). Use these settings.

## One-time: connect the project

1. Vercel → **Add New… → Project**.
2. **Import** the GitHub repo `97n8/lab`.
3. Set **Root Directory** to:
   ```
   publiclogic/apps/web
   ```
4. **Framework Preset:** Next.js (auto-detected).
5. **Build Command:** `next build` (default).
6. **Install Command:** `npm install` (default — Vercel finds the workspace
   `package-lock.json` at `publiclogic/` automatically).
7. **Output Directory:** leave default (Vercel handles Next.js).
8. Deploy.

No environment variables are required for the site itself. The `/kpl` page renders
a committed **sample** snapshot — it does not need the Airbnb URL.

> Do **not** add `AIRBNB_KPL_ICAL_URL` to the Vercel project. The KPL sync is a
> local CLI (`npm run kpl:sync`); the Airbnb export URL carries a private token
> and should stay in your local `.env` only.

## Branch previews

Once connected, every push to a branch gets its own preview deployment, and the
URL is posted automatically on the corresponding pull request (e.g. PR #1 for
`claude/bold-wright-s7l9z7`). Merging to `main` updates production.

## Fallback (if a workspace install errors)

If Vercel's install fails from the app subdirectory, set **Root Directory** to
`publiclogic` instead and add a project-level override:

- **Build Command:** `npm run build`
- **Output Directory:** `apps/web/.next`

(`publiclogic/package.json` already proxies `build` to the web workspace.)
