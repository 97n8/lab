# Cross-repo canon drift — findings

**Date:** 2026-07-09
**Repos read:**
- `97n8/lab` @ `03c1302` (branch `feature/canon-merge-gate`) — this repo; `publiclogic/`.
- `97n8/puddlejumper` @ `7b05c5e` (shallow clone) — the product repo; `pnpm`/`turbo` monorepo.
- `97n8/puddlejumper` **full source, 4 branches** (`main`, `feature/publiclogic-website`,
  `claude/publiclogic-federal-funding-JAmpy`, `chore/merge-logicos-as-workspace`) — read
  from owner-supplied source exports on 2026-07-09. This upgraded every "~" estimate below to
  a confirmed count and let the drift be checked on more than one branch (see **§7**).

Facts only. No renames or fixes proposed here — this document records what is, so the
decisions can be made against a true picture. Read-only recon; nothing in either repo
was modified to produce it.

---

## 1. Two classification inversions in the Canon Registry

The registry's own rule (`Control!A58`): *code is canon for a vocabulary enforced at
runtime; the workbook is canon for a governance vocabulary code does not enforce.* Two
rows were classified by **where the vocabulary's document came from**, not by that rule:

| Row | Registry said (v3.1) | Reality | Evidence |
|---|---|---|---|
| `Sensitivity` | **Code**-owned, source *"LogicOS Build Spec v3 (SQLite CHECK)"* | **Workbook**-owned | `sensitivity_level` is absent from `97n8/lab` **and** `97n8/puddlejumper` — all `.ts/.js/.sql/.prisma`, both `apps/` and `packages/`. No runtime reads, validates, or rejects it. It exists only in one superseded document. |
| `Event Type` | **Workbook**-owned, 15 members | **Code**-owned, ~135 members, enforced — in the other repo | `puddlejumper/apps/puddlejumper/src/archieve/event-catalog.ts` exports `const ArchieveEventType` with **135** members and `type ArchieveEventTypeValue`. The registry's 15-member `EventTypeList` is a stale partial snapshot of an enforced vocabulary. |

Net: the sheet whose job is to be right held one vocabulary that no code owns (claimed
code-owned) and one that code does own in a repo the gate cannot read (claimed
workbook-owned). Both are now corrected in `canon/PublicLogic_PuddleJumper_Runtime.xlsx`:
`Sensitivity` → workbook-owned; `Event Type` → code-owned, source noted, marked
`UNVERIFIABLE` until the gate can read `puddlejumper`.

---

## 2. Canon-vocabulary drift between the two repos

`docs/canon/PUBLICLOGIC_CANON.md` (V1.5) states vocabulary constraints. The live product
repo violates several of them. Verbatim evidence:

| Canon rule (`lab`) | `puddlejumper` @ `7b05c5e` | File |
|---|---|---|
| Never **"engine"** | *"The governed execution **engine** for PublicLogic municipal AI."* | `package.json:5` |
| — | `syncronate/dlp-**engine**.js` | `apps/puddlejumper/src/logicbridge/handler/interceptor.ts:8` |
| **Governance** Process Runtime | *"PuddleJumper GPR — **Government** Process Runtime."* | `package.json:5` |
| — | package name `puddlejumper-gpr`; scope `@gpr/logicos` | `package.json:2`, `apps/logicos/package.json:2` |
| **LogicOS** is retired | live app: `apps/logicos` (`@gpr/logicos`, *"PuddleJumper GPR mobile operator shell"*) | `apps/logicos/` |
| **Syncronate** is retired | live: `apps/puddlejumper/src/syncronate/`, `SYNCRONATE_*` events in the catalog | `event-catalog.ts` |
| **ARCHIEVE** spelled deliberately | ✓ honored — directory `apps/puddlejumper/src/archieve/` | — |

The acronym `GPR` is stable while its expansion diverged: *Governance* Process Runtime (the
defended category) vs *Government* Process Runtime (software for governments — the
commoditized positioning canon lists under **Avoid**). The token persists; the referent
changed.

The SYNCHRON8 build spec names a path that does not exist: there is no `src/modules/` in
`puddlejumper`. SYNCHRON8/Syncronate live under `apps/puddlejumper/src/{logicbridge,
syncronate,archieve}`.

---

## 3. Vocabularies `puddlejumper` defines (inventory)

`packages/core/src` (TS types): `ProcessType`, `ProvisioningTier`, `CanonicalEffect`,
`RoleType`, `CanonicalAction`, `AuditEventFamily`, `AuditEventSubtype`, `SplitPointId`,
`LintFailureCode`, `IdentityKind`, `IntegrationIntent`, `IntegrationStack`,
`IntentQueueStatus`. Plus `apps/puddlejumper/src/archieve/event-catalog.ts` →
`ArchieveEventType` (135).

### Collisions with `golden-path`

- **No constant-name collisions.** None of `LOCKED_LANES`, `SIGNAL_KINDS`,
  `CONNECTOR_TYPES`, `CASE_ACTIONS`, `PRR_KINDS` appear in `puddlejumper`. The lane set
  (`STAY/MUNI/PROJECT/BIZ`) is not redefined there.
- **One material collision:** `Event Type` (§1) — a 15-member workbook snapshot of the
  135-member enforced `ArchieveEventType`.
- **Latent domain overlaps** (different names, unverified): `CanonicalAction` ↔ Decision;
  `IdentityKind` ↔ Signal Kind; `IntegrationStack` ↔ Connector Type.

---

## 4. What the gate can and cannot see

The merge gate reads only `97n8/lab`. It cannot verify a vocabulary enforced in
`puddlejumper`. `Event Type` is therefore marked `UNVERIFIABLE` — honestly red — rather
than left green on a stale snapshot. The durable shape (design, not built): `golden-path`
and `packages/core` each emit a `canon.json`; the gate consumes both. That needs a ruling
on which repo owns which vocabulary before it is written. **Not** cross-repo imports —
those produce a build that cannot run.

---

## 5. The drift class: **token-preservation drift**

The string survives; the referent moves; **no diff shows it**. This is not "UI drift" or a
typo — it is a distinct failure class, and naming it lets a reader go find it elsewhere.

| Token | Reads as (canon) | Became | State |
|---|---|---|---|
| `gpr` | **Governance** Process Runtime | **Government** Process Runtime | drifted |
| `PRR` | PuddleJumper **Runtime Recordstream** | **Public Records Request** | drifted |
| `ARCHIEVE` | archive + achieve | — | **held** |

Two of three drifted. **`ARCHIEVE` survived because it is misspelled.** Nobody can
autocomplete it; every developer who meets it has to ask. The deliberate error is a
tripwire. `gpr` and `PRR` are frictionless abbreviations of full forms nobody types, so
they rot silently: **an acronym whose expansion is never written is not a term — it is a
token awaiting reinterpretation.** And "Public Records Request" is the overwhelmingly
likelier expansion for anyone who has worked in a town hall — i.e. the whole market. The
drift is not a mistake; it is gravity.

**Rule.** Do not *reserve* a drifted token — reserving preserves the trap. Retire it as a
public label and use the full form: `PRR` → **Recordstream** (user-facing), and if a short
internal form is needed, spell it in the constant (`RUNTIME_RECORDSTREAM`), never `PRR`.
The `PRR = Public Records Request` instance was found live in a PuddleJumper `EmptyState`
surface (`label: "PRR"`, request lifecycle `received → … → responded → closed`) coexisting
with a separate, correct `Recordstream` surface. It is not a future risk — the surface
exists, and it already teaches the wrong expansion.

`gpr` is the same class; the §2 entry is one instance of it.

## 6. Three vocabularies enforced in `puddlejumper`, unknown to the registry

Each is the `Event Type` shape (§1): canon or UI in one place, enforcement in another, no
gate between. All three are **code-owned in `puddlejumper`** and absent from `golden-path`:

| Vocabulary | Enforced at (`puddlejumper` @ `7b05c5e`) | In `golden-path` |
|---|---|---|
| **FormKey** | `packages/pipeline/src/stages.ts` — `FORMKEY_INTAKE`, `FORMKEY_OUTPUT` stages; `packages/pipeline/src/output.ts` | not present — `golden-path` has `form_entry.id` (`FM-…`), no `FormKey` |
| **Retention** (Retention Catalog) | `apps/puddlejumper/src/archieve/retention.ts`; `ArchieveStore.{get,list}RetentionSchedule(s)` (`api/mcp.ts`); `RetentionRule` (`engine/connectors.ts`) | not present |
| **Capture** | `apps/logicos/app/components/CaptureView.tsx` — a live surface named by `@gpr/logicos`, **a brand canon lists retired** | not present |

### The ruling that gates all of this — DECIDED 2026-07-09 (the Bookend Rule)

**`golden-path` owns the family list. `packages/core` stops declaring `AuditEventFamily`
and imports it.**

The decision is not "which repo is more product." It is the **Bookend Rule**: a closing
seal must validate the *family* of every record it commits — that is a Repository
guarantee, and **the thing that seals must be the thing that enumerates.** `packages/core`
is a shared package *consumed by* apps; an app-layer dependency cannot own a constraint the
seal's correctness depends on, or the seal ends up defined by its own callers. So the closed
family set lives in `golden-path` (the runtime that seals); `core` defers to it.

The split, precisely:

| Concern | What it actually is | Owner | Gated? |
|---|---|---|---|
| **Family list** — closed set | `process/transition/role/auth/divergence/system` (6) | **`golden-path`** | yes — closed, verifiable in-repo |
| **`AuditEventSubtype`** — the ledger's dotted subtype | open union: `process.created`, `transition.fired`, `ai_assist.suggested`, … ending `(string & {})`. **~20 declared, NOT 135, unbounded** | **`packages/core`** (keeps it) | **no** — the gate never checks the subtype *list* |
| **`ArchieveEventType`** — the executable ARCHIEVE catalog | **135** operational events (`VAULT_RECORD_CREATED`, `S8_*`, …) | **app** (`apps/puddlejumper/src/archieve`) | via the published map, below |
| **`ArchieveEventTypeValue → AuditEventFamily` map** | which sealable family each ARCHIEVE event belongs to | published by `puddlejumper`, checked by **its own CI** | yes — every value must map to a *known* family |

> **CORRECTION (2026-07-09, later same day).** An earlier version of this table wrote
> "`AuditEventSubtype` — 135 today." That conflated two distinct event vocabularies that §3
> and §7.3 of this same document correctly kept apart. **The 135 is `ArchieveEventType`, not
> `AuditEventSubtype`.** `AuditEventSubtype` is the open dotted union above (~20 declared).
> The conflation, left unfixed, would have made the CI check unpassable and would have
> *changed the runtime's audit-event contract* by deriving one model from the other. The
> family ownership ruling is unaffected; only the subtype *referent* is corrected.

The gate checks only that **every published ARCHIEVE value maps to a known family** — never a
subtype *list*. That catches the failure that matters (an event assigned a family the runtime
cannot seal) and ignores the non-failure (an app adding events). This **re-frames the
`UNVERIFIABLE Event Type` red** (§7.3): the lab gate was never supposed to match 135 anything;
it owns the closed *family* list, verifiable inside `lab`. Honest green comes from the
family/map split — **not** a vendored 135-member snapshot, and **not** weakening the check.

**Recommended resolution — keep the two models separate** (do not unify unless VAULT
explicitly declares them identical):
1. `AuditEventSubtype` stays the ledger's extensible dotted subtype (`core`, unchanged).
2. `ArchieveEventType` stays the executable ARCHIEVE operational-event catalog (app, unchanged).
3. `canon.json` publishes the map `ArchieveEventTypeValue → AuditEventFamily`.
4. A `subtype`-bridge check is added **only if** every ARCHIEVE event must become an
   `audit_events` entry — then the chain is `ArchieveEventTypeValue → AuditEventFamily →
   AuditEventSubtype`. Until VAULT rules that, no bridge.

**Dependency direction is fixed, not free:** `@publiclogic/puddlejumper` already depends on
`@publiclogic/core`. `core` must **not** import from `apps/puddlejumper/src/archieve` — that
reverses the edge and risks a cycle. If VAULT ever unifies the models, the executable const
moves *down* into `core` (or a lower neutral package) and the app re-exports it; never up.

**The handshake is a pinned artifact, not a live branch read:** `golden-path` export →
deterministic `families.json` → version/SHA pin → `puddlejumper` CI verification → provenance
echoed in `canon.json`. "Live" means *execution-derived from the authoritative export*, not
"whatever is on `main` today" — an unpinned upstream would turn a green PJ commit red with no
PJ change. Generation must be deterministic: no wall-clock `generated_at` (omit, or
`SOURCE_DATE_EPOCH`), and provenance by **input blob SHAs** (`event_catalog_blob`,
`family_map_blob`, `golden_path_revision`), never the containing commit's own SHA (which does
not exist until after the file is written).

**The 135 family assignments require human authority.** Assigning each ARCHIEVE event to
`process/transition/role/auth/divergence/system` is a semantic sealing decision. The model may
*propose* mappings and flag ambiguity; it may **not approve** them. The mapping PR carries a
review surface — `Subtype | Proposed family | Rationale | Authority | Status` — and only
approved rows enter the executable map; ambiguous rows **fail publication** rather than
receive a guessed family.

`FormKey`, `Retention`, and `Capture` still sort by one test — **does the seal need to know
it?** Retention almost certainly **yes**; Capture almost certainly **no**.

**VAULT decision (DECIDED 2026-07-10) — Bookend Event Referent.** The governed event referent
is **`ArchieveEventTypeValue`**. PuddleJumper publishes `ArchieveEventTypeValue → AuditEventFamily`.
The two event models stay **separate**: `AuditEventSubtype` is *not* the 135-member catalog, is
*not* enumerated by this handshake, and shall *not* derive from `ArchieveEventTypeValue`. **No
bridge** between them is authorized — its absence is intentional, not incomplete; a bridge
requires a separate VAULT ruling (one-to-one/conditional/many-to-one, transactionality, retries,
owning artifact, evidence). Family authority stays in `golden-path`, consumed via a
deterministic, revision-pinned `families.json` (no unpinned live-branch read, no independent
authoritative copy). Edge stays `app → core`. Each `ArchieveEventTypeValue → AuditEventFamily`
assignment is a **human sealing decision** (AI proposes + flags ambiguity, never approves;
ambiguous rows block publication). Naming: prefer *ARCHIEVE event type* / `ArchieveEventTypeValue`
/ *ARCHIEVE event-family mapping* — never shorten to "subtype" where it could be confused with
`AuditEventSubtype`.

Workbook treatment (per the decision): three distinct control-surface rows —
**Event Family** (6, golden-path-owned, gated, verifiable) · **ARCHIEVE Event Family Map**
(PuddleJumper-owned, cross-repo `UNVERIFIABLE` until the pinned publication + consumer are
operational) · **Artifact Event** (the 15-member workbook-owned vocabulary, kept under its own
identity). The workbook must **not** contain or imply a fixed "Event Subtype (135)" vocabulary.
The lab workflow stays **advisory** until producer and consumer are both green, then becomes
required.

(Note: this **overrides** an interim "packages/core owns it" answer collected earlier in the
same session — the Bookend Rule is the authoritative ruling for *families*. The subtype
referent above is a correction to the ruling's wording, not a change to family ownership.)

(Also observed, same run: `apps/puddlejumper/src/engine/`, `packages/pipeline/src/output.ts`
"FormKey output **engine**" — further "engine" usages beyond §2. Recorded, not actioned.)

---

## 7. Ground-truth confirmation — full source, four branches (2026-07-09)

§1–§6 were written against a shallow clone at one SHA (`7b05c5e`). The owner then supplied
the full source of four branches. Reading them replaced every estimate with a count and
tested whether the drift is one branch's accident or the product's shape. **It is the shape:
every finding below is identical across `main`, `feature/publiclogic-website`,
`claude/publiclogic-federal-funding-JAmpy`, and `chore/merge-logicos-as-workspace`.**

### 7.1 Governance is not Government — and the prose already knows it

The drift is **not diffuse**. Across the whole tree, `Governance` *dominates* `Government`:

| Branch | `Governance` (word) | `Government` (word) | `Governance Process Runtime` | `Government Process Runtime` |
|---|---:|---:|---:|---:|
| `main` | 301 | 13 | 10 | **3** |
| `feature/publiclogic-website` | 298 | 11 | 1 | **3** |
| `claude/…federal-funding-JAmpy` | 361 | 16 | 1 | **3** |
| `chore/merge-logicos-as-workspace` | 897 | 59 | 3 | **3** |

The prose is overwhelmingly correct. What persists — **exactly 3 sites, unchanged on every
branch** — is the crystallized *brand string*, the one place a name gets copied instead of
written:

1. `README.md:3` — "**Government Process Runtime** — the governed execution **engine** …"
2. `package.json:5` — `"description": "PuddleJumper GPR — Government Process Runtime. The governed execution engine …"`
3. `docs/claude-memory.md:7` — "**Government Process Runtime**. The fail-closed **governance** engine for PublicLogic."

Site 3 is the specimen this whole drift class exists to name: **the token says *Government*
and the very next clause says *governance*, in one sentence.** The abbreviation `GPR` rotted
in place while the surrounding prose stayed alive — token-preservation drift (§5) caught
mid-act. The other `Government` hits are legitimate domain prose, not the runtime's name
(`docs/USER_GUIDE.md:283` "Civic & Government" flow category; a system-prompt line "Government
is what this software is made of") — they are the *domain*, correctly named; the 3 above are
the *product*, misnamed.

Because it is 3 fixed sites, not 300, this is a **surgical** fix, and `package.json:5` is the
seed: it is what an LLM or a new hire reads first and then repeats. Fix the seed and the
copies stop.

### 7.2 `engine` — the diffuse twin

Unlike Government, the **"engine"** violation *is* diffuse: **332 hits on `main`** (383 on
`mergelogicos`), including `packages/pipeline/src/output.ts:1` "C8 FormKey output **engine**"
and the `apps/puddlejumper/src/engine/` directory itself. PJ is a **Runtime, never an
engine** (canon). This one cannot be fixed at a seed; it is a rename campaign, and it is
recorded here as scope, not actioned.

### 7.3 Event Type — the estimate is now exact

`apps/puddlejumper/src/archieve/event-catalog.ts` → `ArchieveEventType` has **exactly 135
members**, byte-identical across all four branches (§1 said "~135"; confirmed). Families in
the catalog: Vault, Synchron8, Axis, LogicBridge, Syncronate (full §13 catalog), FormKey,
System/ARCHIEVE, SEAL, Org Manager, ARCHIEVE Rules — plus explicit *backward-compat aliases*
(so 135 is the exported surface, not 135 distinct concepts). The registry's 15-member
`EventTypeList` remains a stale ~11% snapshot of an enforced 135-member vocabulary.

**This does not change the gate's verdict.** In CI the gate still reads only `lab`, so
`Event Type` stays `UNVERIFIABLE` — honestly red — until `puddlejumper` publishes a
`canon.json` its own CI verifies. Reading the source *here* makes the recon exact; it does
**not** license vendoring a 135-member snapshot into `lab`, which would re-create precisely
the drift trap this project exists to close (a static copy nothing re-verifies). The gate
annotation is tightened from "~135" to "135", with the four-branch basis noted — nothing more.

### 7.4 FormKey / Retention / Capture — confirmed code-owned on real source

All three from §6 verified against full source (`main`, identical on the others):

- **FormKey** — `packages/pipeline/src/stages.ts` (`FORMKEY_INTAKE`, `FORMKEY_OUTPUT`),
  `packages/pipeline/src/output.ts`, `run.ts:255`. Enforced pipeline stages.
- **Retention** — `apps/puddlejumper/src/archieve/retention.ts` (present, as recorded).
- **Capture** — `apps/logicos/app/components/CaptureView.tsx` — a live surface under
  `@gpr/logicos`, a brand canon lists **retired**. Still shipping on every branch.

The §6 ruling is now **made** (2026-07-09, the Bookend Rule): `golden-path` owns the closed
family list, `core` keeps subtypes, the gate checks subtype→family mapping. By that test,
**Retention** sorts as seal-relevant (likely gated) and **Capture** as not (an app surface
the seal never commits against) — FormKey pending the same question. This clears the last
recon gap; what remains is implementation of the `canon.json` handshake, not a decision.
