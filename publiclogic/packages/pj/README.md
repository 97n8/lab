# @publiclogic/pj

PuddleJumper — the **product-side** of the runtime. The framework-agnostic engine
(canonical model, resolver, receipts, review state, connector interface) lives in
`@publiclogic/golden-path`. This package answers a different question:

- **golden-path** — *how do governed decisions work?*
- **pj** — *how does an external surface become a governed signal?*

When the PJ product repo (`puddlejumper`) and this monorepo connect, this package is the seam.

## FileSurfaceConnector (`src/connectors/files`)

**PJ does not organize files.** PJ watches a file surface for *signals* and asks, for each:

1. Do we know where this belongs?
2. Can we prove why?
3. Should this append to an existing CaseSpace?
4. Is the evidence strong enough to open a new CaseSpace?
5. Or should a human decide?

It's vendor-neutral: **one connector, many sources.** Google Drive is just one
producer of file signals — OneDrive, Dropbox, SharePoint, or a local watch folder
are others, and none of them change the connector or the resolver.

```
src/connectors/files/
├── fileSurfaceConnector.js   one connector — receive + normalize (PJ behavior)
├── hint.js                   hint assessment (the evidence question for a file)
├── adapter.js                pull a Source → run the connector → collect receipts
└── sources/                  the vendor seam (the only Drive/OneDrive/… coupling)
    ├── source.js             defineFileSource / mockFileSource
    ├── httpFileSource.js     generic env-configured HTTPS producer
    └── googleDrive.js        googleDriveSource  (one surface)
```

### The decision is an evidence decision

| Evidence | Decision | Receipt |
|---|---|---|
| Existing CaseSpace proven (folder match) | `append` | `appended_to_casespace` |
| Strong evidence of a new case (structured folder, or a filename that clearly names a case) | `open` | `opened_casespace` |
| Weak evidence (vague filename like `scan 22.pdf`) | `needs_review` | `flagged_for_review` |
| No evidence | `needs_review` | `flagged_for_review` |

The same matrix powers any source. A vague filename — `notes.pdf`, `scan 22.pdf`,
`guest thing.docx`, `IMG_1044.jpeg` — **never** opens a CaseSpace by itself. Every
receipt carries `source`, `signalId`, `objectId`, `action`, `timestamp`,
`preserved: true`, `matchEvidence[]`, `missingEvidence[]`.

### Boundaries

- No silent file movement, no renaming, **no write-back** — it stops at the receipt.
- No scraping; official / env-configured access only (per-source env vars; see `.env.example`). No committed keys.
- Vendor logic (shape mapping, I/O) lives in a `Source`; hint assessment in `normalize`.
  The **core resolver only ever sees the normalized PJObject + evidence**
  (`fileSurfaceConnector.resolve === resolveCaseSpace`).

### Usage

```js
import { createFileSurfaceAdapter, googleDriveSource } from "@publiclogic/pj";

const adapter = createFileSurfaceAdapter({ source: googleDriveSource(process.env) });
const { results, review, summary } = await adapter.pull({ existing: activeCaseSpaces });
// summary.byAction → { open, append, needs_review, ignore }
// review.list("open") → held files awaiting a human
```

Inject `mockFileSource("google-drive", fixtures)` for tests/dev — no network, no secrets.

## Tests

`npm test` (`node --test`) — the evidence matrix per surface, a second source proving
vendor-agnosticism, `assessHint` strong-vs-weak, the env-configured Drive source, and
proof the core resolver is untouched.
