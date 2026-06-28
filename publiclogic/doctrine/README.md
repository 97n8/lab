# doctrine/ — Governance proved by the runtime

Doctrine is enforced by CAL gates and the append-only PRR audit stream — it is
**not** a pipeline stage. Source of truth lives in `docs/canon/`; this layer holds
the runtime-enforced pieces.

Planned structure:

- `vault/` — Verification · Authority · Utility · Legitimacy · Transfer
- `cal/` — authority gate (no action executes until allowability clears)
- `prm/` — preconditions: occupancy / conflict (Manifest)
- `authority/` · `legitimacy/` · `transfer/` · `utility/` · `verification/`
