# Cross-repo canon drift — findings

**Date:** 2026-07-09
**Repos read:**
- `97n8/lab` @ `03c1302` (branch `feature/canon-merge-gate`) — this repo; `publiclogic/`.
- `97n8/puddlejumper` @ `7b05c5e` (shallow clone) — the product repo; `pnpm`/`turbo` monorepo.

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
