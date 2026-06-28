# @publiclogic/connector-files

**Step 3 — the first network-backed PJ connector.** Reads a Files/Drive surface
(an MCP Files server's HTTP bridge, or an official Files listing endpoint) and runs
each file through the golden-path connector interface:

```
file record → Signal → PJObject → CaseSpaceAction → Receipt
```

It stops at the receipt. A file becomes a traceable object with a decision and a
proof — it does **not** wire into FORM/PRR (that is the next step).

## Doctrine preserved

- **Signal in → object/decision → receipt out.** Every file gets a receipt, even
  when the decision is to hold it.
- **PJ does not guess.** A file with no folder/hint to connect it is held as
  `needs_review` (a `flagged_for_review` receipt + a queued review item), not
  attached to a plausible-looking CaseSpace.
- **The core resolver is untouched.** This package adds only `receive`/`normalize`
  edges; placement and proof are golden-path core. `filesConnector.resolve === resolveCaseSpace`.
- **Receipts attest existence / provenance / placement — not truth.**

## Configuration (env only)

No secrets in code or git. The production port reads:

| Var | Required | Meaning |
|---|---|---|
| `PJ_FILES_SOURCE_URL` | yes | the Files/Drive listing endpoint (JSON) |
| `PJ_FILES_TOKEN` | no | bearer token for that surface |

No scraping — the port reads exactly the endpoint it was configured with. See `.env.example`.

## Usage

```js
import { httpFilesPort, createFilesAdapter } from "@publiclogic/connector-files";

const adapter = createFilesAdapter({ port: httpFilesPort(process.env) });
const { results, review, summary } = await adapter.pull({ existing: activeCaseSpaces });
// summary.byAction → { open, append, needs_review, ignore }
// review.list("open") → held files awaiting a human
```

Inject `mockFilesPort(fixtures)` for tests/dev — no network, no secrets.

## Tests

`npm test` (`node --test`) — 10 tests: full path over a mock surface, append/open/
hold dispositions, env-config read (stubbed fetch), non-OK handling, and proof that
the core resolver is identity (no vendor placement logic).
