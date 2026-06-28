# @publiclogic/pj

PuddleJumper — the **product-side** of the runtime. This package holds PJ's
product concerns; the framework-agnostic engine lives in `@publiclogic/golden-path`.
When the PJ product repo (`puddlejumper`) and this monorepo connect, this package
is the seam.

## File-surface connector (`src/connectors/files`)

**PJ does not organize files.** PJ watches an external file surface (Google Drive,
a Files MCP server, SharePoint…) for *signals*, and for each one asks:

1. Do we know where this belongs?
2. Can we prove why?
3. Should this append to an existing CaseSpace?
4. Is the evidence strong enough to open a new CaseSpace?
5. Or should a human decide?

### Decision matrix

| File condition | Decision | Receipt |
|---|---|---|
| Folder path matches an active CaseSpace | `append` | `appended_to_casespace` |
| **Strong** hint (structured case folder, or a filename that clearly names a case) with no match | `open` | `opened_casespace` |
| **Weak** hint (vague filename like `scan 22.pdf`) | `needs_review` | `flagged_for_review` |
| No hint at all | `needs_review` | `flagged_for_review` |

A vague filename — `notes.pdf`, `scan 22.pdf`, `guest thing.docx`, `IMG_1044.jpeg`
— **never** opens a CaseSpace by itself. Every receipt carries `source`, `signalId`,
`objectId`, `action`, `timestamp`, `preserved: true`, `matchEvidence[]`, `missingEvidence[]`.

### Boundaries

- No silent file movement, no renaming, **no write-back** — it stops at the receipt.
- No scraping; official / env-configured access only (`PJ_FILES_SOURCE_URL` + optional
  `PJ_FILES_TOKEN`; see `.env.example`). No committed keys.
- Drive/File-specific matching (the strong/weak hint judgement) stays in the connector's
  `normalize`; the **core resolver only ever sees the normalized PJObject + evidence**
  (`filesConnector.resolve === resolveCaseSpace`).

### Usage

```js
import { httpFilesPort, createFilesAdapter } from "@publiclogic/pj/src/connectors/files/index.js";

const adapter = createFilesAdapter({ port: httpFilesPort(process.env) });
const { results, review, summary } = await adapter.pull({ existing: activeCaseSpaces });
// summary.byAction → { open, append, needs_review, ignore }
// review.list("open") → held files awaiting a human
```

Inject `mockFilesPort(fixtures)` for tests/dev — no network, no secrets.

## Tests

`npm test` (`node --test`) — the decision matrix (append / open / weak→hold /
no-hint→hold), `assessHint` strong-vs-weak, env-config read, and proof the core
resolver is untouched.
