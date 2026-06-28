# runtime/ — PuddleJumper

The execution **runtime** (never an "engine"). It opens, moves, and seals
CaseSpaces and knows nothing about bookings, permits, or grants.

Planned structure:

- `core/` — `kernel`, `runtime`, `state`, `lifecycle`, `transitions`, `orchestration`, `scheduler`
- `forms/` · `events/` · `routing/` · `actions/` · `queues/`
- `evidence/` · `permissions/` · `notifications/` · `integrations/` · `api/`

Runtime line (see `docs/canon/`): FORM opens → CaseSpace owns → CAL gates →
Manifest/PRM checks → PRR records → VAULT governs → ARCHIEVE seals.
