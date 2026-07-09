# Tenant isolation — the shape (read-only recon finding)

**Date:** 2026-07-09
**Repos read:**
- `97n8/puddlejumper` @ `7b05c5e` (shallow clone) — the product repo; `pnpm`/`turbo` monorepo. **Read-only. Nothing modified.**
- `97n8/lab` @ `adeb1a7` (this repo) — for the canon/thesis it is measured against.

This is a **shape report, not a verdict.** It records what the isolation boundary
*is made of* so the deployment decision can be made against a true picture. No fix was
applied in either repo; the one concrete recommendation (§7) is a deployment invariant,
not a code change.

---

## 0. The one-line shape

**Many SQLite files sharded by *subsystem*, each holding *all tenants'* rows, with
`tenant_id` as an optional column.** The database is an environment boundary for
*immutability* (append-only triggers that app code cannot bypass) and a *convention*
for *tenancy* (a `WHERE tenant_id = ?` a developer must remember at every one of 1,225
sites). There is no chokepoint to test and no single place to fix.

---

## 1. The decisive question: one file per org, or one file with a tenant column?

**One file (per subsystem) with a `tenant_id` column. It is all app code.**

- Every canon table — `identities`, `processes`, `assignments`, `audit_events`
  (`packages/db/migrations/001_schema_init.sql`) — carries `tenant_id TEXT NOT NULL`.
  The boundary between Erving and Phillipston is a **column value**, not a filesystem path.
- The physical DB path is `process.env.DATA_DIR || "./data"` — **process-global,
  identical for every request and every tenant** (`api/middleware/checkWorkspaceRole.ts:21`,
  `enforceTierLimit.ts:25`, `api/server.ts:923`, and ~8 more all read the same env var).
- Per-file isolation — the thing that would have made this moot — **does not exist.**
  Nothing about opening a connection knows which tenant is asking.

---

## 2. Convention, not environment — and weaker than "convention" implies

- `@pj/db` exports `getDb()`, which returns a **raw `better-sqlite3.Database` handle**
  (`packages/db/src/index.ts`, `db.ts:46`). No scoped wrapper, no query builder — callers
  write raw SQL.
- It is not even the sole connection owner in its own repo. There are **32 independent
  `new Database(...)` factories** across `apps` + `packages`. `engine/workspaceStore.ts:25`
  and `logicbridge/registry/definition-store.ts:38` each define their *own* `getDb`.
- These 32 files shard by **subsystem**, not tenant (`approvals.db`, `users.db`, `aed.db`,
  `sscb1.db`, `vault-pay.db`, prr, rate-limit …). Each file still holds *all* tenants'
  rows, told apart only by a column — where the table has one at all.

**Query-site count: 102 files, 1,225 `.prepare(` / `.exec(` statements.** Every one is a
place a developer must remember `WHERE tenant_id = ?`. ~30 SQL-bearing files carry **no
scope token at all** (`tenant_id`/`workspace_id`/`owner_id`); see §4 for why that is not
uniformly benign.

---

## 3. Audit attribution — the more serious problem, and it inverts the thesis

`audit_events` carries `tenant_id` as a column, and the triggers `audit_events_no_update` /
`audit_events_no_delete` are real `RAISE(ABORT)` — a genuine **immutability** boundary app
code cannot bypass.

But `tenant_id` is a **caller-supplied field**, not derived from the connection:

```ts
// packages/db/src/audit.ts
export function appendAuditEvent(db, input: { tenant_id: string, ... }) {
  db.prepare(`INSERT INTO audit_events (... tenant_id ...) VALUES (... ?)`)
    .run(..., input.tenant_id, ...);   // nothing checks this against the connection
}
```

The connection has no tenant identity to check against (§1), so nothing does. **A caller
can append an event stamped with any tenant it names, and `RAISE(ABORT)` will faithfully
preserve that lie forever.** The triggers make the trail *immutable*; they do not make it
*attributable*.

Immutable-and-wrong is worse than mutable-and-wrong: it is **tamper-evident provenance
built on unverified provenance.** That is the product thesis ("proof is the product")
inverted at the one layer where it is supposed to be load-bearing. This is separable from,
and arguably more serious than, the read-isolation problem: read-isolation leaks data
*out*; attribution lets a false record *in* and then guarantees it can never be corrected.

The fix is construction-independent of §7: derive `tenant_id` from an authenticated
connection/request context and reject any `appendAuditEvent` whose stamped tenant does not
match. Until then, the audit trail attests *that a row was written and never altered* — not
*by whom, for which town.*

---

## 4. Why a naive `DATA_DIR`-on-tenant re-key ships a cross-tenant read

The obvious fix — "re-key `DATA_DIR` on tenant, get per-town files for free" — **does
something worse than nothing**, because the 32 factories are **module-level singletons**.
Three flavors, all fatal to a re-key:

1. **`let _db; if (_db) return _db;`** — the dominant pattern (`api/userStore.ts:31`,
   `localUsersStore.ts`, `civic/civicStore.ts`, `logic-commons/.../audit-store.ts`,
   `refresh-store.ts`, `logicbridge/registry/definition-store.ts`, all `formkey/*`,
   `syncronate/index.ts`, `spark/kv.ts`). The getter **takes `dataDir` as an argument and
   ignores it after the first call.** The first request to touch the module pins that
   town's handle; every subsequent request — every other town — gets it back.
2. **`const _dbs = new Map<dataDir, Database>()`** (`engine/workspaceStore.ts:23`) — keyed
   by the path string, but the path is `process.env.DATA_DIR` read once per process. Less
   wrong, still pinned; the map only ever holds the one process-global path.
3. **`const db = new Database(...)` at module top** (`vault-pay/routes.ts:6`) — evaluated
   **at import, before any request exists.** No argument, no key, nothing to re-key.

A `DATA_DIR` re-key would leave all three pinned to the first tenant seen and **pass every
test written by someone who assumed the fix worked.** The real re-key is therefore not a
config change — it is converting ~32 import-time / first-touch singletons into per-request
tenant-keyed handles, and flavor 3 cannot be re-keyed at all without restructuring. **A
quarter of work disguised as a week.** It is not proposed here.

---

## 5. The legitimate bypasses — named, because an unmarked bypass is indistinguishable from a bug

A bypass that isn't marked reads exactly like an accidental unscoped query. These are
sanctioned; they must be *named* as sanctioned:

| Bypass | File | Why it is legitimately unscoped |
|---|---|---|
| Seed | `apps/puddlejumper/seed/seed.ts` | writes across tenants to bootstrap; by design |
| Migration runners | `packages/db/src/db.ts` `migrate()`, `api/migrations.ts` | DDL; tenant-agnostic by nature |
| Backup / restore | `api/sqliteMaintenance.ts` (opens the file `readonly`, whole-file) | operates on the file, not rows |
| **Identity registry** | `api/userStore.ts` (`users.db`, global, keyed `(sub, provider)`, **no tenant column**) | login is cross-tenant: one person can belong to two towns via `workspace_members` (`getWorkspaceForMember` "looks across all workspaces"). Per-tenant files **break login** unless this stays global. |

The last one is a finding, not just a note: **identity is global and many-to-many**, so
per-tenant isolation can never be total — there is always at least one sanctioned global
file, and it holds the thing (who can log in where) most worth getting right.

---

## 6. The ~30 no-scope-token files are mixed — not all catalogs

Re-keying (or any "just add per-tenant dirs") silently files a no-column table under
whichever tenant's directory the process opened. That is safe for a *global* table and a
latent cross-tenant leak for *tenant data missing a column*. Both exist:

- **Genuinely global (correct):** `townregistry/routes.ts` — `mma_profiles`, `massgis_data`
  keyed by town name; public MA reference data.
- **Tenant data missing a column (dangerous):** `prr/store.ts` — `gov_prr_requests`
  (a town's public-records requests); `finance/store.ts` — `fiscal_years`,
  `financial_models` (a town's budget). Per-town records with no `tenant_id`.

So "no scope token" cannot be triaged in bulk. Each of the ~30 needs the same question the
registry rows needed: *is this global by nature, or tenant data that forgot its column?*

---

## 7. What to do today — free, by-construction, and honest

**PublicLogic has one town.** With one tenant per process there is no cross-tenant boundary
to breach: the isolation comes not from a `WHERE` clause or a re-key but from **one
deployment per municipality** — one Fly app, one `DATA_DIR`, one town's records. The process
boundary does the work the database won't, with **zero changes to 1,225 SQL sites.**

It is also the honest story a records custodian would prefer: *Erving's data is not in a
database that also contains Phillipston's.* That sentence is true today under one-per-process,
and it is still true after an audit.

**Deployment invariant (write it down, not as a preference):**

> Never run two municipalities in one process until the singleton refactor (§4) and the
> per-table column audit (§6) land. A `WHERE` clause is a cell; a separate Fly app is not.

**Corollary — do not put CJIS-adjacent or personnel data in this until the shape changes.**
Police records or personnel files under `WHERE tenant_id = ?` in a file that also holds
another town's rows is a conversation you do not want with a State CJIS auditor.
One-town-one-process makes that conversation unnecessary.

---

## 8. Holding PJ to its own checklist

The 90-day Erving plan (this repo) asks the Town to verify its backups and test-restore.
Held to that same Phase-One checklist today, **PuddleJumper would fail on tenant isolation
and on tested restore.** That is not a reason to stop — it is the reason this memo exists
*before* the pilot rather than after.

The spine is real: canonical form, receipts, offline verification, `RAISE(ABORT)` — those
are genuinely hard and genuinely done. The layer between the spine and the customer is
thinner than the canon documents suggest, and this finding is the proof. The good news is
the ratio: the fix for the most serious *deployment* problem in the stack is a decision
that can be made this afternoon (§7); the attribution fix (§3) is small and local; only the
multi-tenant future (§4) is a quarter — and it is not needed to ship one town.

---

*Provenance: read-only reconnaissance via a shallow clone of `97n8/puddlejumper` @ `7b05c5e`;
no file in that repo was read for secrets, and none was modified. Scope-add disclosed. Counts
are from `grep` over `apps` + `packages`, excluding `*.test.ts`.*
