# PublicLogic — Target Architecture

Four layers, top to bottom. PuddleJumper stays a thin execution **runtime**; STAY,
MUNI, BIZ, and GRANT are thin product **skins** that compose shared capabilities.

```
PublicLogic            (platform / monorepo)
      │
      ▼
PuddleJumper Runtime   (runtime/ — kernel, lifecycle, transitions, events…)
      │
      ▼
Doctrine (VAULT)       (doctrine/ — VAULT · CAL · PRM · authority · legitimacy…)
      │
      ▼
Core Models            (models/ — CaseSpace + its parts: form, record, thread…)
      │
      ▼
Reusable Capabilities  (capabilities/ — booking, turnover, guestbook, calendar…)
      │
      ▼
Product Skins          (apps/ — STAY · MUNI · BIZ · GRANT)
```

## Why this separation

- **PuddleJumper is the runtime, not a product.** It opens, moves, and seals
  CaseSpaces. It never knows what a "booking" or a "permit" is.
- **Capabilities are reusable operational abilities** (Booking, Turnover,
  Guestbook, Calendar, Maintenance). Any product skin composes the same
  capability without changing its behavior.
- **Products are configuration.** STAY assembles capabilities + templates +
  branding. It contains almost no logic of its own.

> Naming: we use **`capabilities/`** (not `modules/`). "Capability" reflects a
> reusable runtime-exposed ability, avoids confusion with application modules,
> and — importantly — does not collide with the canon's **Module** (a ratified
> CaseSpace template family authored by Module Maker). See `docs/canon/`.

> Naming: PuddleJumper is a **runtime**, never an "engine" (PRR = PuddleJumper
> Runtime Recordstream). The folder is `runtime/` for that reason.

## Target tree

```
PublicLogic/
├── apps/                     # User-facing product skins (thin)
│   ├── stay/  muni/  biz/  grant/  admin/  docs/
│
├── runtime/                  # PUDDLEJUMPER (execution runtime)
│   ├── core/  ( kernel · runtime · state · lifecycle · transitions
│   │           · orchestration · scheduler )
│   ├── forms/  events/  routing/  actions/  queues/
│   ├── evidence/  permissions/  notifications/  integrations/  api/
│
├── doctrine/                 # Governance proved by the runtime
│   ├── vault/  cal/  prm/  authority/  legitimacy/
│   ├── transfer/  utility/  verification/
│
├── models/                   # Core domain models (CaseSpace + its parts)
│   ├── casespace/  form/  module/  record/  thread/
│   ├── organization/  person/  asset/  location/  timeline/
│
├── capabilities/             # Reusable business capabilities (was: modules/)
│   ├── guestbook/  booking/  turnover/  maintenance/  inventory/
│   ├── finance/  messaging/  calendar/  vendors/  analytics/
│   ├── files/  photos/  tasks/  reviews/  signatures/  reports/
│
├── integrations/             # External system adapters
│   ├── airbnb/  google/  stripe/  twilio/  openai/
│   ├── resend/  github/  icloud/  webhooks/
│
├── ui/                       # Shared design system
│   ├── components/  icons/  themes/  layouts/  forms/  charts/
│
├── packages/                 # Shared infrastructure
│   ├── database/  auth/  logging/  config/
│   ├── types/  utilities/  testing/  sdk/
│
├── tooling/                  # Repo tooling (lint, codegen, CI helpers)
└── turbo.json                # (planned) Turborepo task graph
```

## STAY is (almost) entirely configuration

```
apps/stay/
├── dashboard/  bookings/  guestbook/  calendar/  turnover/
├── maintenance/  inventory/  finance/  analytics/  settings/
├── templates/   ( lakehouse · cabin · condo · boutique )
└── branding/
```

There is **no booking logic, no guestbook logic, no maintenance logic** inside the
STAY app. Those live in `capabilities/booking`, `capabilities/guestbook`,
`capabilities/maintenance`. STAY assembles them and supplies templates + branding.

## How today's code maps onto the target

The current working code stays functional where it is until each piece is migrated
deliberately (no big-bang move). Target homes:

| Today | Target home |
|---|---|
| `packages/kpl-casespace` iCal parsing + booking normalization | `capabilities/booking` |
| `packages/kpl-casespace` turnover derivation + checklist | `capabilities/turnover` |
| Airbnb iCal fetch (env-only URL) | `integrations/airbnb` |
| `KPL-*` case IDs, dashboard JSON, sync log | product config under `apps/stay` (Kendall Pond = one STAY property/template) |
| `apps/web` marketing site + `/kpl` page | `apps/docs` (marketing) and a STAY view; `/kpl` becomes a STAY dashboard route |
| `docs/canon/*` | doctrine source of truth; `doctrine/` holds the runtime-enforced pieces |

## Adoption status

- **Now:** this document + a navigable top-level skeleton (READMEs per layer).
  `capabilities/` adopted as the name.
- **Not yet (deliberate):** empty leaf directories, the Turborepo migration
  (`turbo.json` + `tooling/`), and moving `kpl-casespace` — these land as real
  code does, so we don't ship ~100 empty folders or a half-done build migration.
- **Next step when ready:** extract `capabilities/booking` + `capabilities/turnover`
  + `integrations/airbnb` from `kpl-casespace`, and stand up `apps/stay` that
  composes them (Kendall Pond as the first STAY configuration).
