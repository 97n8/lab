# @publiclogic/golden-path

**GP-001 — the identity compiler.** The first real step of the PuddleJumper runtime.
One seed in, four governed objects out. Deliberately tiny. No AI, no agents, no
workflows — just a deterministic transform.

```
Seed → Source Profile → Asset Set → Document Set → CaseSpace
```

## What it answers

> "What are we building around?"

The user supplies one seed (a website, domain, Airbnb listing, Drive folder, GitHub
repo, PDF, document, brand — or nothing, "start from scratch"). That is enough.

## What it produces

Exactly four governed objects:

1. **Source Profile** — everything PJ knows: name, aliases, website, emails, phones,
   addresses, connected tools, confidence, source links (+ a recommended `lane_guess`,
   confirmed later in GP-002).
2. **Asset Set** — the canonical asset types the org owns or operates (properties,
   projects, services, products, clients, towns, sites, equipment, vehicles, vendors,
   people). Empty buckets; the lane guess pre-suggests a few.
3. **Document Set** — the housed structure: Identity · Intake · Evidence · Templates ·
   Operations · Policies · Projects · Archives.
4. **Starter CaseSpace** — the permanent five-tab shell everything grows from: Overview ·
   Intake · Documents · Decisions · Next Steps.

## The attach rule

> Everything in the runtime must attach to a Source Profile, an Asset, a Document, or a
> CaseSpace. If it can't attach to one of those four, it isn't part of the runtime.

`canAttach(kind)` enforces it; nothing else is a runtime root.

## Usage

```js
import { compileSeed } from "@publiclogic/golden-path";

const result = compileSeed({ type: "airbnb", value: "airbnb.com/rooms/12345" });
// → { seed, source_profile, asset_set, document_set, casespace }
```

`compileSeed` is pure and deterministic (same seed → same ids). Tests: `npm run gp:test`.
Demo surface: `/seed` in `apps/web`.
