# PublicLogic

**Systems That Stick**

Production-oriented monorepo for the PublicLogic website and operating-system foundation.

## Apps

- `apps/web` — PublicLogic website
- `packages/pj` — PuddleJumper starter logic
- `packages/casespace` — CaseSpace schemas
- `packages/vault` — VAULT continuity/audit stubs
- `packages/shared` — shared brand/system constants
- `packages/ui` — shared UI primitives

## Run

```bash
npm install
npm run dev
```

## Deploy

Connect this repo to Vercel.

- Framework: Next.js
- Root Directory: `apps/web`
- Build Command: `npm run build`
- Output: handled by Vercel
