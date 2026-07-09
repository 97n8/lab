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
vocabulary.** `RECEIPT_VERB` / `HUMAN_VERB` are read as exports (see below); if a
registered const is not exported, it fails `UNEXPORTED` rather than being scraped.

## Known open — the owner decides, the gate does not

- **`Sensitivity`** — `sensitivity_level` (`public`/`internal`/`restricted`/`confidential`)
  is in **no code in this repo**. It appears only in the superseded LogicOS Build
  Spec, or in `97n8/puddlejumper` (private, never read here). The check fails on it
  **by design** with `UNVERIFIABLE`. Resolve by moving it into source, or
  reclassifying the row workbook-owned. **Do not delete the row to make CI green** —
  removing the check is the exact defect this system prevents.
- **`RECEIPT_VERB` / `HUMAN_VERB`** — resolved by **exporting** them from
  `golden-path` (they already existed as internal consts; exporting lets the gate
  read them by execution, per the doctrine). The alternative was to drop the
  Receipt Verb / Human Verb / Resolution rows from the registry. Export was chosen
  because it keeps three real runtime vocabularies under governance.
- **`97n8/puddlejumper`** is private and defines vocabularies (SYNCHRON8). Until it
  is read, this registry is incomplete; a collision there would not be caught.

## The ceiling

This is a **merge** gate, not runtime enforcement. A person with commit access and
`--no-verify` still wins. The gate is `RAISE(ABORT)` in a SQLite trigger; this is CI.
