# PublicLogic Canon

Reconciled doctrine + product reference for the PuddleJumper ecosystem.

| File | Role |
|---|---|
| `PuddleJumper_Final_Go_Forward_Workbook_VERIFIABLE_CANON.xlsx` | **🔒 Current go-forward (Verifiable Record edition, 2026-06-28).** The build constitution + the no-custody verifiable trust model (19 sheets): adds Verifiable Record doctrine, Receipt spec, Canonical Form v1, closing CaseReceipt manifest, keys/anchors, offline verifier, canon patch. Golden Path renumbered to GP-001→014 (canonical object + record receipt inserted; CaseReceipt + trust anchor at the seal). **Authoritative.** |
| `PuddleJumper_Final_Go_Forward_Workbook_BUILD_LOCKED.xlsx` | Prior go-forward snapshot (GP-001→012). **Superseded** by the Verifiable Record edition; kept for history. |
| `PROOF.md` | The spine — the three foundational principles the rest hangs off. Read first. |
| `PUBLICLOGIC_CANON.md` | **V1.4 (… + Verifiable Record)** build reference — the understanding layer. Read top to bottom. |
| `PublicLogic_Series1_Final_Workbook.xlsx` | The control system — Series 1 templates, work packs, lanes, dashboards, governance (27 sheets). |
| `PublicLogic-Canon.xlsx` | Locked doctrine workbook — runtime line (Tab 02) and VAULT (Tab 12) that the markdown reconciles to. |

## Reconciliation status

The three artifacts agree on:

- **The three foundational principles** — (1) CaseSpace is the only **top-level** primitive (Owner/Subject/Resource/Window are its parts, not peers); (2) PuddleJumper owns the two guarantees, Entry (provenance) and Repository (immutability) — the **Bookend Rule**; (3) the middle is content-agnostic but governance-aware — the **Agnostic Middle Rule**. The category is *governed transitions between two fixed contracts — provenance at entry, immutability at exit.* The moat is #2 and #3: a stance competitors can't take while staying a workflow tool or a system of record.

- **Runtime line** — FORM → Module Maker → CaseSpace → CAL (gate) → Manifest/PRM (precondition) → **PRR records** → **VAULT governs (doctrine, not a stage)** → ARCHIEVE seals (rollup, not parent mutation).
- **VAULT** — V·A·U·L·T; the Utility (U) mechanism is fenced as *proposed, not yet ratified*.
- **Series 1** — 16 ratified templates (8 launch/service + 8 extended), 10 work packs (incl. Procurement & Vendor Handoff), 13 Permit & Bridge lanes (PB-01…PB-13), 5 dashboard layers.
- **Policy/SOP Stewardship = P0** (corrected from a stale `CONTINUITY/P2` cell in the workbook's sheet 06).

See Appendix B of `PUBLICLOGIC_CANON.md` for the full reconciliation matrix.

## Go-forward supersession (2026-06-28)

The locked go-forward workbook updates two things where it differs from the earlier
Series 1 canon. The go-forward wins for build/GTM; the doctrine workbooks remain the
architecture reference.

- **Public lanes narrowed to four: STAY · MUNI · PROJECT · BIZ** (CORE is the internal
  runtime, not a public lane). **GRANT is folded into PROJECT** as a module family, and
  LIVE/HOME/PEOPLE/FINANCE/OPS become modules or entry modes rather than standalone public
  lanes. (Series 1 listed the broader set; decision **D-001/D-002**.) The marketing site
  (`apps/web`) already reflects the four-lane set.
- **Build order is locked to the Golden Path first** — Seed → FORM → CaseSpace → PRR →
  Evidence → CAL/PRM → Digest → Packet → ARCHIEVE — before any lane depth (decision **D-003**,
  Launch Lock "Golden Path Priority"). This matches the homepage discipline pipeline.

Everything else (category = Governed Work Runtime; thesis = Proof is the product; five-tab
client edge; "your tools can stay messy, the record cannot") is consistent across the site,
the canon, and the go-forward file.

## Verifiable Record upgrade (2026-06-28)

The Verifiable Record edition turns "proof is the product" into literally verifiable proof —
a **no-custody trust model** (decisions D-009…D-013):

- **Immutability is redefined as tamper-evidence across custody boundaries** — alteration is
  *exposed*, not prevented by PJ holding every copy. Your tools can hold the files; PJ proves
  the record. (Updates the Bookend Repository guarantee.)
- **Record Receipt vs closing CaseReceipt** — a Record Receipt proves object integrity +
  provenance; the closing CaseReceipt commits to the *full receipt set* (ordered/Merkle root)
  so silent omission is exposed, not just alteration.
- **Canonical Form v1** is a build blocker before signatures (deterministic UTF-8/NFC/LF/
  RFC3339/sorted-keys bytes; two honest verifiers derive the same hash).
- **Offline verification is the invariant** — packet + receipts + public keys verify without
  PublicLogic servers; any verification URL is convenience only.
- **Keys & anchors** — separate runtime / organization / closure signatures (dual attestation
  default for MUNI/PROJECT); high-trust seals publish an external root.
- **ARCHIEVE** = a sealed, manifest-backed, independently-verifiable bundle (canonical objects +
  receipts + CaseReceipt + signatures + optional anchor), not a PDF export.

**Golden Path renumber:** the runtime gains Canonical Object (GP-002) and Record Receipt
(GP-003) before FORM (now GP-004), and CaseReceipt Manifest (GP-013) + ARCHIEVE Seal/Anchor
(GP-014) at close. The built demo routes map: `/seed` = GP-001, `/form` = GP-004, `/recordstream`
= GP-006 (each event now earns a receipt).
