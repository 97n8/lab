# Canon merge gate

**The workbook must not assert what the code says. It must be told.**

`packages/golden-path` is the runtime. It defines vocabularies as exported
constants. `canon/PublicLogic_PuddleJumper_Runtime.xlsx` restates them in its
**Canon Registry** sheet. This gate proves the two agree — and, critically,
catches **code drifting away from a workbook nobody touched**, which no
in-workbook formula can see (the workbook compares against a static snapshot).

## Install

```
publiclogic/
  canon/PublicLogic_PuddleJumper_Runtime.xlsx
  scripts/canon-extract.mjs           # Node: imports the runtime, emits JSON
  scripts/validate_canon_registry.py  # Python: reads that JSON + the workbook
.github/workflows/canon.yml           # CI (repo root)

pip install openpyxl
```

## Use

```
npm run canon:check   # compare workbook against source, exit 1 on mismatch (CI)
npm run canon:write   # regenerate the workbook's F/I columns + Control!B55 from code, then commit
```

## What it owns in the workbook

`--write` touches **only**: Canon Registry `F` (count in source), `I` (expected
members), and `Control!B55` (REVIEW_THRESHOLD). It does **not** touch formulas,
named ranges, or the Validation sheet — a widened named range is a human fix in
the Name Manager (the gate reports it as `RANGE`).

## Failure classes

| Code | Meaning |
|---|---|
| `DRIFT` | workbook members differ from source (ordered, case-sensitive) |
| `COUNT` | the count-in-source literal was edited (members still match) |
| `RANGE` | the named range no longer spans the source's member count |
| `CONSTANT` | REVIEW_THRESHOLD differs from source |
| `UNMAPPED` | a registry vocabulary has no source at all — map it or remove it |
| `UNEXPORTED` | a registry vocabulary claims a code const that is not exported |
| `UNVERIFIABLE` | claimed code-owned, absent from this repo — the owner must resolve |

An unmapped or unexported vocabulary is a **failure, not a skip**. Silent
additions are the bypass this exists to prevent.

## Two languages, on purpose

`exceljs` and SheetJS throw on the table objects `openpyxl` wrote. So Node imports
the runtime modules and emits JSON; Python reads that JSON and the workbook.
`LOCKED_LANES` is read by **executing** `form.js`, not by grepping it — a regex
would pass on a commented-out constant. **There is no regex read of any
vocabulary.** The verb vocabularies (Receipt Verb / Human Verb / Resolution) are
read from **explicit exported arrays** (`RECEIPT_VERBS`, `HUMAN_VERBS`,
`RESOLUTION_ACTIONS`) — never from a map's key/value order, so canon does not shift
if someone reorders a literal. `UNEXPORTED` remains for the general case: a registry
row claiming a code const that isn't exported fails, rather than being scraped.

## Classification — code-owned vs workbook-owned

Per the workbook's own rule (`Control!A58`): **code is canon for vocabularies
enforced at runtime; the workbook is canon for governance vocabularies code does not
enforce.** Classify by *does code enforce it?* — never by where the vocabulary's
document came from. Two rows were mis-classified that way and are now corrected (see
`docs/canon/CROSS_REPO_DRIFT.md`):

- **`Sensitivity` → workbook-owned.** `sensitivity_level` is absent from all code in
  both `lab` and `puddlejumper`; nothing enforces it (it came from a superseded SQL
  schema). It keeps its own Validation gate in the workbook; it just stops claiming a
  source it never had.

### The three event vocabularies (VAULT Bookend Event Referent, 2026-07-10)

"Event Type" was one row standing in for three distinct vocabularies. The registry now
names them apart (see `docs/canon/CROSS_REPO_DRIFT.md` §6):

- **`Event Family` → code-owned by `golden-path`, gated, GREEN.** The closed 6-member
  set the seal commits (`AUDIT_EVENT_FAMILIES` = process, transition, role, auth,
  divergence, system), verifiable in-repo. The Bookend Rule: the thing that seals is the
  thing that enumerates.
- **`ARCHIEVE Event Family Map` → puddlejumper-owned, `UNVERIFIABLE`.** The map
  `ArchieveEventTypeValue → AuditEventFamily` (which family each of the 135 ARCHIEVE
  event types belongs to) — a **human sealing decision** made in `puddlejumper`, not
  enumerable here. Honestly red until puddlejumper publishes a deterministic,
  revision-pinned `families.json` + map that its own CI verifies. It is **not**
  `AuditEventSubtype` (the ledger's open dotted union) and must never be vendored in.
- **`Artifact Event` → workbook-owned.** The 15-member "Closed Event Vocabulary" on the
  `Event Vocabulary` sheet (`ArtifactCreated … SignalResolved`), enforced by the
  workbook's own Validation. It was briefly mislabeled as the ARCHIEVE catalog; restored
  to its true identity.

So a clean repo currently fails with exactly one item — `UNVERIFIABLE ARCHIEVE Event
Family Map` — by design. The `canon` **workflow is advisory** (`continue-on-error`) until
the puddlejumper handshake is green on both sides; the check itself stays strict, so the
red is visible without blocking merges. Flip it to required once the producer and
consumer are green.

## Known open

- **`97n8/puddlejumper`** is private and defines vocabularies (SYNCHRON8). Until it
  is read, this registry is incomplete; a collision there would not be caught here.
- **Four `docs/canon/*.xlsx`** restate vocabularies (e.g. the lanes, in
  `01_Final_Lanes`) but are **not** under this gate — they can drift from code
  silently. Only `canon/PublicLogic_PuddleJumper_Runtime.xlsx` is guarded.

## The ceiling

This is a **merge** gate, not runtime enforcement. A person with commit access and
`--no-verify` still wins. The gate is `RAISE(ABORT)` in a SQLite trigger; this is CI.
