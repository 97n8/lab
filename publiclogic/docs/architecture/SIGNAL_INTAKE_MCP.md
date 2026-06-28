# Signal Intake via MCP — how PuddleJumper connects to the tools it governs

**Status:** Architecture / design. The verified spine it plugs into (canonical
form → Record Receipt → PRR → CaseReceipt → offline verification) is **built and
tested** in `@publiclogic/golden-path`. **Steps 1, 2, 2A, and 3 are built** — the
Signal object + receipt (`signal.js`), the source-agnostic connector interface
`receive → normalize → resolve → receipt` (`connector.js`), the human review loop
(`review.js`), and the first network-backed adapter (`@publiclogic/connector-files`,
env-config Files/Drive surface). Only **Step 4 — FORM/PRR wiring — remains proposed**.
Nothing here changes canon; it operationalizes the **Signal Behavior Rule** and the
**Bookend Rule (Entry = provenance)**.

---

## 1. The two stances are the same stance

PJ's product thesis and the way Claude connects to tools via MCP are the **same
architectural move**, one level apart:

> **MCP:** "Claude does not connect directly to a raw API. An MCP server sits
> between Claude and the API, app, or tool."

> **PuddleJumper:** "Don't replace your stack. Give it a spine. PJ connects the
> tools you already use into one accountable operating record."

Both refuse to *become* the tool. Both insert a governed connector in the middle
and take responsibility for the boundary. MCP governs **what an agent may read and
do**; PJ governs **what the work produces and whether it can be trusted later**.

So MCP is not a competitor to PJ — it is the **transport** PJ should ingest over.
MCP is how PJ reaches a tool without scraping it or pretending to be its API. PJ is
what happens to the signal *after* it arrives: it earns provenance at the boundary
and becomes part of an immutable record.

```
  the tool you already use            the connector            the record
  (Gmail, Drive, HRIS, QuickBooks)  →   MCP server    →   PuddleJumper runtime
                                        (sits between)      (Entry = provenance)
```

---

## 2. The Signal Behavior Rule, realized

Canon already says intake is **tool-agnostic**: PJ takes a *signal* from wherever
the work actually happens and does not force the user to change tools. MCP gives
that rule a concrete, standard mechanism.

**A Signal** is any inbound artifact from a tool: an email, a file, a calendar
event, a spreadsheet row, an invoice, a webhook payload. Today PJ has exactly one
real signal adapter — the KPL Airbnb iCal feed. MCP generalizes it to the five
server types in the "Claude MCP Setup" catalog:

| MCP server type | Example tools | What PJ ingests | Becomes |
|---|---|---|---|
| **Files & Docs** | Google Drive, SharePoint, local FS | PDFs, scans, forms | Evidence objects (Record Receipt at intake) |
| **API-backed apps** | Gmail, Calendar, QuickBooks, HRIS | emails, events, invoices, new-hire records | Signals that open or update a CaseSpace |
| **Databases** | Postgres, MySQL, warehouse | rows, exports | Bulk records / reconciliation sources |
| **Web / Search** | official export URLs, public registries | iCal feeds, public filings | External-context signals (KPL lives here) |
| **Local tools** | CLI, on-prem systems, scanners | command output, local artifacts | On-prem signals for air-gapped municipal work |

**The rule that makes this safe:** PJ ingests through *official* connectors only —
the same discipline already enforced for KPL (official iCal export, env-only URL,
**no scraping, no unofficial API, no stored credentials**). MCP is the standard
form of "official connector." It is the principled path, not a workaround.

---

## 3. Where a signal enters the spine

The verified spine we have already built does not change. The signal stage sits
*in front of* it, at the Entry bookend, where provenance is captured:

```
  SIGNAL                CANONICAL OBJECT        RECORD RECEIPT         then…
  (via MCP)        →    (canonical form v1)  →  (hash + provenance) →  ┐
  email / file /        deterministic bytes     object_hash, source,   │
  event / row           two verifiers agree     fetched_at, connector  │
                                                                       ▼
                                          ┌─ opens a CaseSpace?  → FORM (GP-004)
                                          └─ attaches to one?    → PRR append (GP-006)
                                                                       │
                                                                       ▼
                                              … Evidence → CAL/PRM → Digest →
                                              Packet → CaseReceipt → ARCHIEVE
```

The moment of intake is the **Entry guarantee** in canon: PJ commits a Record
Receipt over the canonical form of the artifact *as it was received*, plus its
provenance (which connector, which source id, fetched at what time). This is
**no-custody trust** applied at ingestion — the tool keeps the file; PJ proves
what it saw and when. Alteration after that point is exposed by the same
verification we demonstrated on `/recordstream`.

### Provenance fields a signal Record Receipt carries

```jsonc
{
  "object": "RECEIPT",
  "canonical_form_version": "v1",
  "object_hash": "<sha-256 of canonical bytes of the artifact>",
  "source": {
    "connector": "mcp:google-drive",     // which MCP server
    "source_ref": "drive:file/<id>",     // stable id in the source system
    "fetched_at": "2026-06-28T12:00:00Z" // when PJ read it
  }
}
```

Provenance is *attested*, not *trusted*: the receipt proves PJ received these exact
bytes from this source at this time. It does **not** claim the artifact is true,
complete, or legally sufficient — that overclaim is out of bounds in canon.

---

## 4. The connection lifecycle mirrors the MCP 5 steps

The "Claude MCP Setup" workflow maps one-to-one onto PJ connector governance — and
every step is itself recorded, because in PJ the provenance of the connection is
part of the record:

| MCP setup step | PJ connector governance |
|---|---|
| **1. Pick the server** | Register a connector from an allowlist of official MCP servers. Untrusted servers are not addable. |
| **2. Get the details** | Connector config (HTTP URL or stdio command) is stored as config/env only — never hardcoded, never committed. (KPL precedent.) |
| **3. Add it** | A connector is a governed object with an owner, a scope, and the lanes it may feed. |
| **4. Auth + permissions** | OAuth / keys are held by the **organization**, not PJ (no custody). Least-privilege, read-scoped by default. Each grant is a recorded decision. |
| **5. Test the tools** | A connector dry-run produces a sample signal + Record Receipt and shows exactly what access it has — reviewed before it goes live. |

Each read a connector performs is itself a PRR record (provenance of the
provenance). VAULT — doctrine, not a stage — governs which connectors a lane may
use and what they may touch.

---

## 5. Worked example — MUNI onboarding (ties both images together)

This is the `/muni` demo we just shipped, with the ingestion mechanism named:

1. **HRIS** emits a new-hire record for Jane Smith over an **API-backed MCP
   server**. PJ canonicalizes it → Record Receipt (provenance: `mcp:hris`,
   source id, fetched-at) → **FORM** opens the *New Hire: Jane Smith* CaseSpace,
   MUNI lane (a `.gov` source already grounds the lane).
2. **Google Drive** (a **Files & Docs MCP server**) supplies the I-9, W-4, and
   offer letter PDFs. Each file is canonicalized and earns a Record Receipt at
   intake, then appends a PRR evidence record — exactly the events `/muni` seals.
3. **Calendar / Gmail** (API-backed) supply orientation scheduling and
   acknowledgments as further signals.
4. The PRR for the case **seals into a packet** and **verifies offline**. When the
   person leaves, the record stays with the Town — and it is *provably* the record
   that was built, because every signal carries a receipt back to its source.

Nothing about Gmail, Drive, or the HRIS changed. PJ did not replace them, did not
become their API, and did not hold their data hostage. It connected them and gave
the work a spine.

---

## 6. What this is NOT

- **Not scraping.** Official MCP servers / official export URLs only. (Canon +
  KPL rule.)
- **Not custody.** PJ proves the record; the tools keep the files. Auth lives with
  the org.
- **Not a replacement.** PJ never becomes the system of record *for the tool* — it
  is the accountable record *across* tools.
- **Not truth.** A receipt attests existence-at-time and provenance, never that the
  content is correct or legally sufficient.
- **Not built yet.** The connectors are design. The spine they feed is built and
  tested; KPL is the one real adapter and the pattern to generalize.

---

## 7. Build order

1. ✅ **Define the Signal object + signal Record Receipt** in `golden-path` —
   **Shipped** (`golden-path/signal.js`). A canonical, content-addressed (idempotent)
   `SIGNAL` with a `source` provenance block (connector, source_ref, fetched_at,
   connector_type), `ingestSignal` (normalize → canonical object → Record Receipt),
   and `verifySignal`. The receipt commits to **both the artifact and its provenance**,
   so altering either after intake fails verification — the Entry guarantee, in code.
   20 adversarial tests (idempotency, key-order independence, source-vs-content
   identity, payload/provenance tamper). This is to ingestion what Canonical Form v1
   is to sealing: the deterministic core.
2. ✅ **Generalize KPL into a connector interface** — **Shipped** (`golden-path/connector.js`).
   A source-agnostic contract — `receive → normalize → resolve → receipt` — with core
   types (`Signal`, `PJObject`, `CaseSpaceAction`, `Receipt`). A connector implements only
   its source edges (`receive`, `normalize`); the **resolver** (open / append / needs_review /
   ignore) and the **receipt emitter** are core, so no vendor logic leaks past normalize.
   The receipt's `checksum` is the Canonical Form v1 hash of the placed object (Step 1's core),
   so "we can prove where it went" is also "we can prove it wasn't altered." Three sample
   connectors (gmail / airbnb / file) with fixtures prove it end to end — the Airbnb one mirrors
   the KPL reservation shape (*KPL today*). 14 tests. The real KPL feed wiring through this
   interface is the next proof; the contract is ready for it.
2A. ✅ **Human review resolution loop** — **Shipped** (`golden-path/review.js`). The decision now
   carries `confidence`, `matchEvidence[]`, and `missingEvidence[]`, so a held signal *names what
   it couldn't prove*. `needs_review` preserves the signal as a `ReviewItem` + a `flagged_for_review`
   receipt; `resolveReviewItem` lets a human append/open/ignore and emits a **second receipt linked
   via `priorReceiptId`** (`human_appended_to_casespace`, etc.) with `resolvedBy`. Nothing is
   overwritten; an item can't be resolved twice. This is the moat: PJ does not pretend scattered
   information is connected unless it has evidence — and when it doesn't, a person decides and the
   decision is preserved. 9 tests.
3. ✅ **Add one network-backed adapter** (Files & Docs) behind the interface —
   **Shipped** (`@publiclogic/connector-files`). An env-configured `FilesPort` reads a
   Files/Drive surface (an MCP Files HTTP bridge or an official listing endpoint;
   `PJ_FILES_SOURCE_URL` + optional `PJ_FILES_TOKEN`, **no scraping, no committed keys**),
   converts each file into the existing `Signal` shape, and runs it through the connector
   interface. Every file earns a receipt; a file with no folder/hint to connect it is **held
   as `needs_review`**, not guessed. The core resolver is untouched (`filesConnector.resolve
   === resolveCaseSpace`). A `mockFilesPort` makes the whole path testable with no network.
   10 tests. *Stops at the receipt — no FORM/PRR.*
4. **Wire signals to FORM / PRR** so a signal either opens a CaseSpace or appends to
   one — closing the loop into the verified spine already on `/recordstream`, `/muni`,
   and `/cemetery`. *Next.*

### Step 1 surface (`@publiclogic/golden-path`)

```js
import { ingestSignal, verifySignal, sourceKey } from "@publiclogic/golden-path";

const { signal, receipt } = await ingestSignal({
  kind: "file",                       // SIGNAL_KINDS
  payload: { name: "I-9 Form.pdf", bytes_sha: "…", size: 18234 },
  connector: "mcp:google-drive",      // which MCP server delivered it
  connector_type: "files",            // CONNECTOR_TYPES (the 5 server types)
  source_ref: "drive:file/9z",        // stable id in the source system
}, { timestamp: fetchedAtIso });

await verifySignal(signal, receipt);  // true; false if artifact OR source altered
sourceKey(signal);                    // "mcp:google-drive:drive:file/9z" — dedupe by source
```
