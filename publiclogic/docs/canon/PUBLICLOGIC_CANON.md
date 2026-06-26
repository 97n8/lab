# PUBLICLOGIC_CANON.md — Series 1, **V1.1 (Reconciled + Bookend Doctrine)**

The PuddleJumper Product Ecosystem — Build Reference

Single source of truth for implementation. Read top to bottom and you will know exactly what to build.
Companion to the Series 1 Final Workbook (v2) — the control system. This is the understanding layer.
**Reconciled to the Canon workbook (Tab 02 Runtime Line, Tab 12 VAULT) at runtime commit `54cdaa5` (origin/logic-commons-v1).**

> ### Reconciliation changelog (v2 → V1)
> Reconciled against two files: the **Canon workbook** (locked doctrine — Tab 02 Runtime Line, Tab 12 VAULT) and the **Series 1 Final Workbook** (control system, 27 sheets).
> 1. **PRR restored to the record line.** The append-only recordstream is named in the enforcement spine and in the clean build sentence — it is the primitive that owns the operating record.
> 2. **VAULT demoted from stage back to doctrine.** Per the locked ruling, VAULT is governance proved by the runtime (enforced by CAL gates + the append-only PRR audit stream), **not** a pipeline step. A VAULT doctrine block (V·A·U·L·T) is added, matching Canon workbook Tab 12, including the Utility mechanism fenced as *proposed, not yet ratified.*
> 3. **Proof-history wording tightened.** "Appends to the parent's proof history" is now explicitly an append-only rollup / read model, never a mutation of parent truth.
> 4. **Weekly Update tagged core/exempt.** Resolves the §15 ↔ §20 ↔ §22 tension — core consonant tools are exempt from the client-specific Rule of Three.
> 5. **Canonical runtime line added** (reconciled to Tab 02) so an implementer reading top-to-bottom sees exactly where each primitive acts.
> 6. **Work Packs aligned to Series 1 Workbook sheet 06** — the canonical 10 now include **Procurement & Vendor Handoff**; Path Sheet Entry remains a launch door (§5) and a consonant tool (§20), not a packaged work pack.
> 7. **Policy/SOP Stewardship set to P0.** Resolves a conflict *inside* the Series 1 Workbook (sheet 06 cell read P2; sheet 05 and Final Audit A-010 say P0 — "core stewardship moat"). P0 is canonical; the P2 cell was stale.
> 8. **Permit & Bridge lanes given canonical IDs PB-01…PB-13** (and PB-07 includes Wetlands) to match Workbook sheet 08.
> 9. **Tonkean/Coupa watch note + Source Register appendix added** to reconcile with Workbook sheets 23/24.
>
> ### Addendum (V1 → V1.1)
> 10. **Bookend doctrine elevated to foundational.** Added the three foundational principles, the **Bookend Rule** (PJ owns the Entry Surface and the Repository), the **Agnostic Middle Rule** (content-agnostic, governance-aware), and the **Runtime Contract** diagram. Category sharpened in §16 to *"governed transitions between two immutable guarantees."*

---

| | |
|---|---|
| Product | PuddleJumper (Governed Work Library) |
| Operator | PublicLogic LLC |
| Doctrine | CaseSpace-only, one primitive, many surfaces |
| Date | June 26, 2026 |
| Series 1 | 16 ratified templates, 10 work packs, 13 Permit & Bridge lanes, 5 dashboard layers |
| Tagline | Structure is care. (ethos) · Systems that stick. (product) |
| Market Rule | Do not sell or explain PJ. Sell clarity: path, documents, next steps, decisions, proof. |
| Hero Claim | Closing work seals upward into standing work across systems. |
| Partner Protocol | We do not replace partner systems. We sell readiness, continuity, records, proof, stewardship, and work libraries around those systems. |
| Counsel-Ready Rule | PublicLogic does not provide legal advice, legal conclusions, or agency determinations. Templates are law-aware and record-ready: they organize facts, rules, documents, deadlines, authority questions, and proof so counsel, officials, staff, or decision-makers can act from a cleaner record. |
| Composer Rule | Users assemble their own experience from templates, tools, and information. PublicLogic stands up the CaseSpace — for a single user or a duo — runs the runtime, and maintains continuity from there. |
| Competitive Rule | Doctrine beats vocabulary. Do not lead with commoditizing words like audit trail or institutional memory. Lead with the primitive, seal-upward architecture, non-replacement discipline, and stewardship. |

---

## Table of Contents

1. Doctrine
2. The Two Problems
3. Client Experience (PJ Lite)
4. Schema
5. Series 1 — Launch Doors
6. Series 1 — Extended Templates
7. Work Packs
8. Dashboards
9. Permit & Bridge Lanes
10. Time & Attendance Work Pack
11. Path Generator MVP
12. Client CaseSpace View
13. Operator Page
14. Sample Path Sheets
15. Feature Gate — Rule of Three
16. Competitive Positioning
17. Battlecards
18. Partner Protocol
19. Encroachment Watchlist
20. Split-Row Combo Model
21. Industry Combos
22. Build Order
23. Governance

---

## 1. Doctrine

### The three foundational principles

These three statements explain almost the entire architecture — and are difficult for competitors to imitate without changing what they fundamentally are.

1. **CaseSpace is the only primitive.**
2. **PuddleJumper owns the two guarantees: Entry and Repository.**
3. **The middle is content-agnostic but governance-aware.**

### One Primitive, Many Surfaces

PublicLogic is a governed work library of templates, tools, and information that open as standing/closing CaseSpaces, backed by stewardship and designed not to replace existing systems.

| Decision | Canonical | Binding Meaning | Fence |
|---|---|---|---|
| One Primitive | CaseSpace | A governed operating record for a unit of work. Standing/container or closing/leaf. | Doctrine |
| Standing CaseSpace | Container | Ongoing parent: property, department, project, client, program, app/repo, or operating area. | Doctrine |
| Closing CaseSpace | Leaf | Finite child: turnover, permit lane, grant submission, release, invoice, incident, policy update, request, or handoff. | Doctrine |
| Bookend Rule | Entry Surface + Repository | PuddleJumper owns exactly two guarantees: the **Entry Surface** (work becomes a CaseSpace — received → logged) and the **Repository** (work becomes a sealed, append-only record — closed → sealed → rolled up). Everything between belongs to the operator. | **Foundational** |
| Agnostic Middle Rule | Content-agnostic, governance-aware | The middle is where the operator works, with whatever systems, data, vendors, and processes fit. PJ governs the **movement** of the CaseSpace, not the software being used; every transition is wrapped by CAL. | **Foundational** |
| Seal-Upward Rule | Closing → Standing | Closing work resolves and seals upward into its standing parent as a referenceable proof package. It does not mutate parent truth. | Moat |
| Surface-not-State Rule | External tools are signals/surfaces | Email, Drive, PMS, CRM, permitting, grant, and finance systems can inform a CaseSpace. They are not the canonical PJ state. | Moat |
| Non-Replacement Rule | Do not become their system of record | PublicLogic makes work ready, visible, portable, and provable across systems without asking clients to rip and replace. | Partner-safe |
| PJ Lite Rule | Smaller at the edge, not smaller in ambition | Client sees Path Sheet, CaseSpace, Next Steps, Record. Runtime language stays behind the curtain. | Client-safe |
| All Doors Rule | Capture → Classify → Advance → Seal | Every work pack uses the same four-action loop and same CaseSpace recordstream. | Doctrine |
| Work Library Rule | Templates + tools + information, not products | The library is templates (structures), tools (generators, lane pickers, dashboards), and information (law-aware references). No single work pack — time & attendance included — is the output. | Doctrine |
| Stewardship Rule | Human-supported library upkeep | PublicLogic maintains templates, handoffs, readiness logic, and continuity records so the system stays usable after launch. | Moat |
| Counsel-Ready Rule | No legal advice / no determinations | Templates organize facts, rules, documents, deadlines, authority questions, and proof so counsel, officials, staff, or decision-makers can act from a cleaner record. | Legal fence |
| Composer Rule | User builds; PublicLogic takes it from there | Users assemble their own experience from templates, tools, and information. PublicLogic stands up the CaseSpace — for a single user or a duo — runs the runtime, and maintains continuity from there. | Moat |
| Competitive Rule | Doctrine beats vocabulary | Do not lead with commoditizing words like audit trail or institutional memory. Lead with the primitive, seal-upward architecture, non-replacement discipline, and stewardship. | Positioning |

### The canonical runtime line *(reconciled to Canon workbook Tab 02)*

**FORM** opens → **Module Maker** mints the reusable template → **CaseSpace** owns → **CAL** gates → **Manifest / PRM** checks → **PRR** records (append-only) → **VAULT** governs (doctrine) → **ARCHIEVE** seals closing children and exposes rollup proof through the standing parent.

Operator phrasing: **FORM opens. PRR records. CAL gates. PRM checks. VAULT governs. ARCHIEVE seals.**
CAL and Manifest/PRM are a *gate* and a *precondition*, not hand-off stages.

### Bookend Rule

**PuddleJumper owns the two guarantees.**

- **Entry Surface** — the point where work becomes a CaseSpace (received → logged).
- **Repository** — the point where work becomes a sealed, append-only record (closed → sealed → rolled up).

Everything between those two contracts belongs to the operator. PublicLogic does not require a specific workflow, database, CRM, permitting system, PMS, ERP, file store, or vendor. Those remain the operator's choice. **The middle is therefore content-agnostic, not unconstrained.**

### Agnostic Middle Rule

**The middle is where the operator works.** Users may use whatever systems, data, vendors, and processes fit their organization. PuddleJumper does not prescribe those systems, nor does it attempt to replace them.

What PuddleJumper governs is the **movement** of the CaseSpace, not the software being used. Every transition is wrapped by CAL. CAL does not evaluate what the work *is*; it evaluates whether the transition is:

- authorized
- valid
- complete enough to advance
- eligible to seal

The runtime is therefore **content-agnostic while remaining governance-aware.**

### Runtime Contract

```
Entry Surface
(received → logged)
        │
        ▼
CaseSpace opens
        │
        ▼
Capture
        │
        ▼
Classify
        │
        ▼
Advance      ← CAL wraps every transition
        │
        ▼
Seal
        │
        ▼
Repository
(closed → sealed → rollup)
```

Everything between Entry and Repository may involve Gmail, Drive, SharePoint, Munis, Tyler, OpenGov, Polimorphic, Airbnb, Hospitable, spreadsheets, paper, or people. **PJ doesn't care.** It only cares that every transition is **authorized**, **attributable**, and **preserved**.

### The enforcement spine

| Principle | Statement |
|---|---|
| CAL gates | No action executes until allowability clears (before the action, never after). |
| Manifest precondition | State-changing actions consult Manifest/PRM first. No double-booking, no acting into a known conflict. |
| **PRR records** | Every change appends to the recordstream (append-only). The recordstream **is** the operating record; external tools are sources/attachments. |
| Surface, not state | A standing CaseSpace holds references — launchers, aliases, links, runbooks. It never holds live runtime state. |
| Sources are not the record | External tools are signal sources and launch targets, never the operating record. |
| Closing seals into standing | A closing CaseSpace seals upward; its sealed record appends to the standing parent's **append-only rollup / proof history (a read model)** — it does not mutate parent truth. |
| **VAULT governs (doctrine, not a stage)** | VAULT is governance proved by the runtime, enforced by CAL gates and the append-only PRR audit stream — not a step in the line. |
| AI assists, never decides | Module Maker and every assist propose; an Org Manager–resolved authority ratifies. A suggestion can never satisfy a CAL gate or drive a transition. |

### VAULT — doctrine *(reconciled to Canon workbook Tab 12)*

VAULT = **V**erification · **A**uthority · **U**tility · **L**egitimacy · **T**ransfer. It is **doctrine, not a pipeline stage** — enforced by CAL gates and the append-only PRR audit stream.

| Letter | Principle | Enforcing mechanism | Status |
|---|---|---|---|
| V | Verification | ARCHIEVE seal + chain | ratified |
| A | Authority | CAL role gate | ratified |
| U | Utility | *Proposed:* skin-defined required fields + structured FORM intake make the record complete and retrievable, with the `missing_evidence` CAL conflict blocking close until the usable record is whole. | ◻ proposed — not yet ratified |
| L | Legitimacy | Propose-then-ratify + audit | ratified |
| T | Transfer | ARCHIEVE seal + chain | ratified |

> The Utility (U) mechanism is fenced like an illustrative proposal: the **principle** is canon; the **mechanism** is a proposed mapping routed through propose-then-ratify before it becomes locked. Until ratified, treat U's mechanism as TBD, not settled.

---

## 2. The Two Problems

Every template must fix at least one, preferably both.

| ID | Problem | Template Requirement | Proof of Fix |
|---|---|---|---|
| P-001 | Simpler AI/Search Path — operator should not think about SQL, vectors, prompts, or search plumbing | Define searchable fields, record homes, proof events, and retrieval surfaces | Can retrieve the record and explain what is missing/next |
| P-002 | No Human Bridge Between Systems — operator should not babysit exports, re-key data, or manually glue tools together | Name the manual bridge removed and the CaseSpace event replacing it | CaseSpace event replaces handoff/re-entry or makes bridge visible |

---

## 3. Client Experience (PJ Lite)

The quiet workbench: PuddleJumper does the governing; the client sees a plain path, documents, what's next, and what was decided.

| Section | Doctrine | Client-Safe Meaning |
|---|---|---|
| One Rule | Do not sell or explain PJ. Sell the outcome. | We organize the work into one record, show what has to happen next, keep the documents straight, and make sure nothing important gets lost. |
| Four Questions | What are we trying to get done? What do we know? What is missing? What happens next? | Every client screen should reduce uncertainty. |
| Client Flow | Entry → Path Sheet → CaseSpace → Next Steps → Record | Same beats for all families. |
| Client Language | Path Sheet; CaseSpace; Next Steps; Record | No runtime, VAULT, CAL, PRM, Module Maker, governed process spine. |
| Free Tool Boundary | First-pass Path Sheet only | It says what probably has to be true before this can move. It does not solve the whole matter. |
| Promise | Nothing gets lost | The client should know where the document is, who owns it, what is next, and what was decided. |

---

## 4. Schema

Every CaseSpace shares a spine. Standing and closing diverge on a few fields.

| Field | Allowed Values | Applies To | Meaning | Requirement | Visibility |
|---|---|---|---|---|---|
| case_id | string | both | Unique CaseSpace identifier | Required | Internal |
| case_type | standing / closing | both | Proof-axis distinction | Required | Doctrine |
| family | STAY/MUNI/BIZ/GRANT/LIVE/HOME/PEOPLE/OPS/etc. | both | Skin/template family | Required | Client-safe |
| parent_case_id | string/null | closing | Standing parent for child/leaf cases | Required for closing | Internal |
| owners | 1-2 authenticated users; scales to team/department | both | Who owns this CaseSpace. Floor is a single user or a duo on one shared CaseSpace. | Required | Internal |
| desired_outcome | text | both | What are we trying to get done? | Required | Client |
| known_facts | array | both | What do we know? | Required | Client |
| missing_facts | array | both | What is missing? | Required | Client |
| documents_needed | array | both | Needed documents/evidence | Required | Client |
| next_steps | array | both | What happens next? | Required | Client |
| decisions | array | both | What was decided and by whom | Required | Client |
| proof_events | array | closing | Capture/advance/seal proof events (appended to PRR) | Required | Internal/client |
| bridge_score | number | both | Systems + manual re-entry + people + risk + missing proof | Recommended | Client |
| seal_status | open/sealed/rolled_up | closing | ARCHIEVE closeout state | Required | Internal/client |
| rollup_view | array/ref | standing | References sealed children without mutating parent truth (read model) | Required | Doctrine |

---

## 5. Series 1 — Launch Doors

Five **proof lanes** at P0, plus the service lane (also P0). Everything else is extended until pattern-proven.

| ID | Family | Door | Standing Parent | Closing Children | Primary Use | Status | Priority |
|---|---|---|---|---|---|---|---|
| S1-001 | ALL | Path Sheet Entry | Matter / Opportunity | Path Sheet; Quick Review | Prospect/client triage | Ratified | P0 |
| S1-002 | MUNI | Permit & Bridge | Applicant / Site / Project | Lane Review; Missing Fact; Agency Question; Draft Filing | Municipal/project readiness | Ratified | P0 |
| S1-003 | GRANT | Grant Readiness | Opportunity / Program | Eligibility; Match; Partner; Budget; Narrative; Submission | Grant before grant management | Ratified | P0 |
| S1-004 | STAY | Property Memory | Property | Guest Stay; Turnover; Maintenance; Incident; Receipt | Short-term-rental owner ops | Ratified | P0 |
| S1-005 | MUNI/BIZ | Policy / SOP Stewardship | Department / Process | Policy Change; SOP Update; Training; Acknowledgment | Continuity and implementation support | Ratified | P0 |

Service Lane (also P0):

| ID | Family | Door | Standing Parent | Closing Children | Primary Use | Status | Priority |
|---|---|---|---|---|---|---|---|
| S1-006 | ALL | Quick Review | Matter / Opportunity | Document Review; Call Notes; Decision | Prospect to paid review | Ratified | P0 |
| S1-007 | ALL | Bridge Package | Matter / Opportunity | Docs; Draft Correspondence; Timeline; Parties | Readiness package | Ratified | P0 |
| S1-008 | ALL | Live CaseSpace | Standing Matter | Weekly Update; Child Cases; Decisions | Ongoing managed work | Ratified | P0 |

*(5 proof lanes + 3 service-lane doors = 8 launch doors at P0.)*

---

## 6. Series 1 — Extended Templates

Ratified but not yet launch-ready. Remain extended/proving-ground until pattern-proven or explicitly requested.

| ID | Family | Door | Standing Parent | Closing Children | Status | Priority |
|---|---|---|---|---|---|---|
| S1-009 | PEOPLE | Time & Attendance | Department / Crew / Project | Shift; Timesheet; Leave; Overtime; Training; Incident | Ratified | P1 |
| S1-010 | MUNI | Public Records / Board Packet | Department / Board | Request; Document; Review; Redaction; Packet Item | Ratified | P1 |
| S1-011 | BIZ | Client Deliverable | Client / Project | Task; Draft; Decision; Invoice; Handoff | Ratified | P1 |
| S1-012 | LIVE | Release / Deployment | App / Repo | Bug; Feature; Release; Incident; Env Change | Ratified | P1 |
| S1-013 | PROPERTY | Maintenance / Incident | Property / Asset | Issue; Vendor; Inspection; Receipt; Closeout | Ratified | P1 |
| S1-014 | FINANCE | Invoice / Receipt / Payment Proof | Client / Property / Project | Invoice; Receipt; Approval; Reimbursement | Ratified | P2 |
| S1-015 | OPS | Procurement / Vendor Handoff | Project / Department | Quote; Vendor; PO; Delivery; Acceptance | Ratified | P2 |
| S1-016 | PEOPLE | Hiring / Onboarding | Department / Role | Posting; Candidate; Offer; Onboarding Task | Ratified | P2 |

*(8 extended + 8 launch/service = 16 ratified templates.)*

---

## 7. Work Packs

A work pack packages one standing CaseSpace, repeatable child CaseSpaces, default proof rules, and client-safe dashboards.

*Canonical 10, reconciled to Series 1 Workbook sheet 06. Path Sheet Entry is the entry **door** (§5) and a consonant **tool** (§20), not a packaged work pack.*

| Work Pack | Client Door | Standing CaseSpace | Manual Bridge Removed | Seal Rule | Series |
|---|---|---|---|---|---|
| Permit & Bridge | Start Permit Path | Project / Applicant / Site | manual permit-lane guessing, re-keying, email chasing | all required lanes have decision or deferral + packet sealed | MUNI/P0 |
| Grant Readiness | Check Grant Readiness | Opportunity / Applicant | NOFO translation and document scramble | application submitted or no-go decision sealed | GRANT/P0 |
| STAY Property Memory | Run Property Record | Property | owner as memory and bridge between PMS/cleaner/vendors | stay/turnover/issue closed with proof and rollup | STAY/P0 |
| Policy/SOP Stewardship | Update SOP | Department / Process | policy in docs but not in operating memory | ratified SOP/policy with rollup history | CONTINUITY/**P0** |
| Workforce Time & Attendance | Run Timesheet Record | Department / Crew / Project | supervisor babysitting timesheets and exports | timesheet approved/exported or exception sealed | PEOPLE/P1 |
| MUNI Records & Board | Build Board/Record Packet | Department / Board | packet/record hunting across inboxes and drives | packet published or request response sealed | MUNI/P1 |
| BIZ Client Delivery | Run Client Matter | Client / Project | operator rewriting status from memory | deliverable sent and handoff/next step sealed | BIZ/P1 |
| LIVE Release Control | Run Release Record | App / Repo | manual local/live bridge and lost release notes | release/incident closed with proof | LIVE/P1 |
| Property Maintenance | Close Issue | Property / Asset | owner/vendor memory bridge | issue closed with before/after proof | PROPERTY/P1 |
| Procurement & Vendor Handoff | Organize Purchase | Project / Department | manual quote comparison and approval handoff | purchase accepted or rejected and sealed | OPS/P2 |

---

## 8. Dashboards

Dashboards are views over the same CaseSpace state. Client sees calm; operator sees movement; system keeps proof.

| Dashboard Layer | Audience | Question Answered | Primary Widgets | Do Not Show |
|---|---|---|---|---|
| Client CaseSpace | Client | What are we doing, what do we know, what is missing, what happens next? | five tabs; Path Sheet; Next Steps; Record | runtime names, CAL/PRM, internal audit mechanics |
| Operator Movement Board | Nate/PublicLogic | What needs movement today? | Today; Waiting Client; Waiting Third Party; Needs Judgment; Ready to Send; Stuck/Risk; Recently Sealed | full architecture or backend logs |
| Stewardship Dashboard | PublicLogic admin | Which work packs/templates are active, repeated, and worth productizing? | work pack counts; 1x/2x/3x pattern tracker; backlog | client private details |
| Proof Dashboard | System/Internal | What was captured, advanced, decided, and sealed? | open proof gaps; sealed records; missing proof | subjective status without evidence |
| Bridge Dashboard | Sales/Product | Where are humans still bridging systems? | bridge score; bridge removed; integration map | claims that the system automated what is still manual |

---

## 9. Permit & Bridge Lanes

Permit & Bridge is a readiness lane system: it asks what probably has to be true before a matter can move. It is not permitting software — it is a readiness and bridge layer around municipal work.

**Fence:** Permit & Bridge does not approve, deny, file, or adjudicate permits. It organizes readiness before a filing, review, meeting, or handoff.

| Lane ID | Lane | Plain-English Question | Gate / Decision | Seal Condition |
|---|---|---|---|---|
| PB-01 | Path Sheet Entry | What are they trying to do? | scope boundary + no legal/agency decision | recommended next step visible |
| PB-02 | Authority / Applicant | Who can ask, sign, own, or authorize? | authority check before sending | authority accepted or flagged |
| PB-03 | Parcel / Site Facts | Where is it and what facts define the site? | site fact completeness gate | site facts ready or flagged |
| PB-04 | Use / Zoning Lane | What use is proposed and what local lane likely applies? | zoning lane/no-go question | lane selected/deferred |
| PB-05 | Health / Environmental | Does the work touch health, waste, septic, food, air, water, or hazardous issues? | environmental trigger gate | trigger closed or escalated |
| PB-06 | Building / Fire / Life Safety | Does the work need building/fire review or inspection? | safety/code lane gate | ready for filing or flagged |
| PB-07 | Conservation / Stormwater / Wetlands | Does land/water protection review apply? | conservation/stormwater gate | lane closed or escalated |
| PB-08 | DPW / Utilities / Access | Does the project affect road, driveway, water, sewer, drainage, or access? | DPW/utility gate | lane ready or waiting |
| PB-09 | Board / Notice / Hearing | Does a board, public notice, abutter notice, or hearing control timing? | calendar/notice gate | scheduled or no board needed |
| PB-10 | Fees / Procurement / Vendor | What money, quotes, vendors, or approvals must be in place? | approval/procurement gate | approved or blocked |
| PB-11 | Funding / Grant / Match | Is money or grant readiness part of the bridge? | grant readiness gate | grant path/no-go sealed |
| PB-12 | Draft Packet / Correspondence | What must be sent, and in what order? | ready-to-send gate | packet sent or held |
| PB-13 | Inspection / Closeout | How does this finish and what proof survives? | seal gate | ARCHIEVE sealed child rollup |

---

## 10. Time & Attendance Work Pack

Time and attendance fits as governed work: clock facts, exceptions, approvals, payroll handoff, and audit proof. It is not an HRIS — it is one template among many.

| Component | Definition |
|---|---|
| Doctrine | PublicLogic does not sell timekeeping software. Time & Attendance is a work pack door into CaseSpace. |
| Standing CaseSpace | Department / Crew / Project / Property |
| Closing Children | Shift; Timesheet; Leave; Overtime; Training; Incident |
| Capture Sources | Clock/time entries, schedule, calendar, supervisor notes, employee messages, payroll export, photos/docs |
| Advance Gates | Supervisor approval; exception review; payroll export readiness; compliance/risk review |
| Seal Outputs | approved shift, approved timesheet, leave decision, overtime approval, training completion, incident closeout, payroll export proof |

### Bridge score components

| Component | Score 0 | Score 1 | Score 2 | Score 3 |
|---|---|---|---|---|
| Systems involved | 1 system | 2 systems | 3 systems | 4+ systems |
| Manual re-entry | none | one re-entry | two re-entries | three+ re-entries |
| People/approvers | 1 person | 2 people | 3 people | 4+ people |
| Compliance/deadline risk | none | internal deadline | payroll deadline | law/contract/compliance risk |
| Missing proof burden | none | minor proof missing | multiple proofs missing | core proof missing |

**Bridge Score** = systems + manual re-entry + people/approvers + risk + missing proof (max 15)
· Low: 0–4 · Medium: 5–8 · High: 9–12 · Critical: 13+

---

## 11. Path Generator MVP

First clickable proof: Entry answers → Path Sheet → Bridge Rating → CaseSpace seed → Next Steps.

| Field | Prompt / Meaning | Required? | Output Surface |
|---|---|---|---|
| Desired Outcome | What are we trying to get done? | Required | Path Sheet |
| Matter Type | STAY/MUNI/BIZ/GRANT/LIVE/HOME/PEOPLE/OPS/PROPERTY | Required | CaseSpace seed |
| Current Reality | What is true today? | Required | Path Sheet |
| Known Facts | Facts already available | Required | CaseSpace seed |
| Missing Facts | Facts needed before movement | Required | Path Sheet |
| Documents Available | Documents already supplied | Recommended | Documents tab |
| Documents Needed | Needed documents | Required | Path Sheet |
| People / Parties | Owners, approvers, vendors, agencies, clients | Required | Bridge Score |
| Systems Involved | Drive, Gmail, calendar, portal, PMS, payroll, etc. | Required | Bridge Score |
| Manual Re-entry Points | Places humans copy/export/re-key | Required | Bridge Score |
| Deadline / Regulatory Risk | 0-3 score | Required | Bridge Score |
| Missing Proof Burden | 0-3 score | Required | Bridge Score |
| Recommended Next Step | What happens next? | Required | Next Steps |

### MVP outputs

| Component | Output | Fields |
|---|---|---|
| MVP Output 1 | Printable Path Sheet | Desired Outcome; Likely Lanes; Missing Facts; Needed Documents; Red Flags; Questions; Bridge Rating; Next Step |
| MVP Output 2 | CaseSpace seed JSON | case_type, family, desired_outcome, known_facts, missing_facts, documents_needed, bridge_score, next_steps |
| MVP Output 3 | First Next Steps block | Current Status; What changed; Need from client; PublicLogic next; Risks/decisions; Next checkpoint |

---

## 12. Client CaseSpace View

Every client-facing CaseSpace uses the same calm surface. Five tabs maximum.

| Tab | Shows | Question Answered |
|---|---|---|
| Overview | Desired outcome; current status; bridge rating; next checkpoint | What are we trying to get done? |
| Intake | Known facts; missing facts; people; deadlines; open questions | What do we know and what is missing? |
| Documents | Available docs; needed docs; record home; proof gaps | Where are the documents? |
| Decisions | Decision log; who decided; date; authority/reference | What was decided? |
| Next Steps | What we need from you; what PublicLogic is doing; risks; next checkpoint | What happens next? |

---

## 13. Operator Page

One daily page for Nate/PublicLogic. It answers: what needs movement today?

| Bucket | Definition | Action |
|---|---|---|
| Today | Work with an action due now or due today | Move or defer |
| Waiting On Client | Needs client input/document/decision | Send request or hold |
| Waiting On Third Party | Agency/vendor/partner/other party is the blocker | Follow up or update risk |
| Needs Nate Judgment | Cannot advance without Nate/PublicLogic decision | Decide or schedule review |
| Ready to Send | Draft/packet/update is ready for final review/send | Send or revise |
| Stuck / Risk | Deadline, missing proof, conflict, or unclear ownership | Escalate and document |
| Recently Sealed | Closed cases this week | Show progress and proof |

### Weekly update format

```
PUBLICLOGIC — WEEK OF [date]

PROVEN THIS WEEK
- [operation]: [n] cases sealed → [headline proof events]

OPEN / IN FLIGHT
- [operation]: [n] open, [blocker if any]

NEEDS A DECISION
- [item]: [the call to make]

NEXT WEEK
- [the 1–3 things that actually matter]
```

---

## 14. Sample Path Sheets

### Phillipston Web / Workflow Cleanup (MUNI)

| Field | Content |
|---|---|
| Desired Outcome | Make a municipal page/workflow ready, accurate, and staff-usable without creating a new system. |
| Known Facts | Existing CivicPlus/Web Central migration; known department pages; public-facing hours/contacts; staff needs continuity. |
| Missing Facts | Which page owns the workflow? Who approves language? What documents are canonical? |
| Documents Needed | Current page copy; approval notes; board/department source docs; staff contact list; change log. |
| Bridge Rating | Medium (5) |
| Recommended Next Step | Open a MUNI CaseSpace; classify as Policy/SOP or Public Records/Board Packet as needed. |

### Resource Recovery / Grant Readiness (GRANT)

| Field | Content |
|---|---|
| Desired Outcome | Turn a funding opportunity into a readiness record before submission or partner review. |
| Known Facts | NOFO/opportunity exists; partners/sites/entities are being assembled; budget/timeline/narrative needed. |
| Missing Facts | Who is applicant? What authority exists? What match/source commitments exist? |
| Documents Needed | NOFO; site facts; partner letters; budget; timeline; eligibility proof. |
| Bridge Rating | High (11) |
| Recommended Next Step | Open Grant Readiness CaseSpace; create eligibility/match/document map. |

### Kendall Pond Maintenance / Turnover (STAY)

| Field | Content |
|---|---|
| Desired Outcome | Keep property operations usable when guest stays, cleaning, maintenance, and vendor issues overlap. |
| Known Facts | Property has bookings, cleaners, hot tub/pump/maintenance issues, guest expectations, receipts, and owner decisions. |
| Missing Facts | What changed since last turnover? What is safety/comfort-critical? What proof photos/receipts exist? |
| Documents Needed | Booking dates; cleaner notes; maintenance photos; vendor quote/receipt; guest messages. |
| Bridge Rating | Critical (14) |
| Recommended Next Step | Open STAY Property Memory child CaseSpace; track issue → vendor → proof → closeout. |

---

## 15. Feature Gate — Rule of Three

No new **client-specific** feature until the same need appears three times. **Core consonant tools (§20) are exempt** — they are runtime, not client-specific features.

| Stage | Threshold | Allowed Action |
|---|---|---|
| Observation | 1x | Log in backlog. Do not build. |
| Pattern Candidate | 2x | Create checklist/template note. Do not build runtime feature. |
| Template | 3x | Promote to template/work pack if it fits CaseSpace loop. |
| Product Surface | After template proves usage | Build UI/launcher/dashboard only after pattern is stable. |

| ID | Need | Family | Seen Count | Current Treatment |
|---|---|---|---|---|
| O-001 | Permit lane confusion | Permit & Bridge | 1 | Template note |
| O-002 | Weekly update rewrite burden | All | 2 | **Core tool (Weekly Update Generator) — exempt from Rule of Three; see §20 / §22 B-006** |
| O-003 | Timesheet approval bridge | PEOPLE | 1 | Work pack seed |

---

## 16. Competitive Positioning

**The real category.** We are not selling *workflow*, not a *system of record*, not an *integration platform*. We are selling **governed transitions between two immutable guarantees (Entry and Repository).** That is a much rarer statement.

| Section | Position | Action |
|---|---|---|
| Category We Own | Governed work library + CaseSpace runtime; **governed transitions between two immutable guarantees** | Use |
| Plain English | Complicated work → standing/closing CaseSpace → next steps → seal upward | Use |
| Hero Claim | Closing work seals upward into standing work across systems | Lead |
| Non-Replacement Claim | We do not want to be your system of record | Lead |
| Stewardship Claim | Human-supported library upkeep | Lead |
| Avoid | AI operating system / front door / inbound services / municipal CRM / case management from intake to resolution / legal advice engine / PMS / grant management software | Avoid |

| Competitor | They sell | PublicLogic sells | Threat |
|---|---|---|---|
| Polimorphic | AI front desk, resident service, CRM, case management, institutional knowledge | Governed work templates, nesting, seal-upward proof, stewardship | High |
| GovWell | AI OS for government, permitting/licensing system of record | Permit & Bridge readiness before/beside formal systems | High |
| Granicus/OpenGov/Tyler | Government systems of record, digital services, AI agents | Pre-system and cross-system work organization, evidence, handoff | Low→Medium |
| BRYTER/Checkbox | Legal/compliance front door, matter management, auditable records | Counsel-ready operational readiness without legal determinations | Medium |
| Airtable/Kissflow/Knack | Generic no-code workflow platforms | Opinionated governed work packs with primitive, gates, proof, stewardship | Medium |

---

## 17. Battlecards

| Competitor | PublicLogic Answer | Avoid Saying |
|---|---|---|
| Polimorphic | Polimorphic may be the CRM/service record. PJ is the governed work layer that nests work into the property, department, grant, project, policy, or operating record it belongs to, then seals closing work upward across systems. | Inbound services; AI front desk; resident intake; from intake to resolution |
| GovWell | GovWell runs formal permitting/licensing. Permit & Bridge organizes readiness before/beside/after formal systems: facts, missing docs, authority questions, risks, next steps, and proof. | AI permitting OS; permitting software; code-compliance engine |
| Tyler/OpenGov/Granicus | Those platforms own domain records. PJ makes cross-system work portable and provable without replacing them: email, docs, vendor notes, board decisions, grants, and child cases roll into a standing record. | Replacement platform; source of truth for all agency operations |
| Airtable/Kissflow/Knack | They can build a base for one client. They do not ship the doctrine, standing/closing primitive, seal-upward rule, law-aware templates, or stewardship upkeep across customers. | No-code platform; workflow automation tool |
| BRYTER/Checkbox | PublicLogic is counsel-ready, not counsel-replacing. It organizes facts, documents, deadlines, authority questions, and proof so the right decision-maker can act from a cleaner record. | Legal advice; legal determinations; matter management |
| Guesty/Hostaway/OwnerRez | Guesty runs bookings. PJ remembers the property: turnover proof, maintenance issues, vendor history, guest exceptions, incident records, and owner continuity. | Booking engine; channel manager; PMS |

---

## 18. Partner Protocol

| Rule | Allowed | Not Allowed |
|---|---|---|
| Non-Replacement | Sit beside/around existing systems | Say PJ replaces CRM, permitting, ERP, PMS, HRIS, legal, grant, or records systems |
| Polimorphic Fence | Describe as readiness, grant, policy/SOP, stewardship, CaseSpace layer | Pitch inbound resident service, AI front desk, CRM, case management from intake to resolution |
| GovWell Fence | Organize readiness before/beside/after formal filing or review | Call it permitting software, code-compliance, or permit approval/denial |
| Legal Fence | Use law-aware, counsel-ready, record-ready, authority-question language | Provide legal advice, legal conclusions, agency determinations, or automated approvals/denials |

**Partner-safe one-liner:** PublicLogic provides ready-to-run templates for governed work; each opens as a CaseSpace so the work can move, be handed off, and seal into a record without replacing the systems already in place.

---

## 19. Encroachment Watchlist

| Entity | Current Rating | Trigger to Escalate |
|---|---|---|
| Polimorphic | High narrative threat | Adds explicit cross-domain nesting or says it sits beside systems |
| GovWell | High budget threat | Expands from permitting/licensing into broader cross-system municipal operations |
| Granicus | Low→Medium | Markets cross-system records rollup, institutional memory, or readiness layer |
| OpenGov | Low→Medium | Markets an AI logic layer or cross-domain work/record layer |
| Tyler | Low→Medium | Embeds agentic records/readiness features across permitting/licensing/courts |
| BRYTER/Checkbox | Medium | Moves downmarket into non-lawyer operational readiness libraries |
| Airtable/Kissflow/Knack | Medium | Consultancies package governed templates as a service |
| STR PMS Platforms | Low | Adds serious incident/maintenance/vendor proof and owner-continuity layer |

> **Watched, not battlecarded:** Tonkean (acquired by Coupa, 2026 — agentic intake/orchestration) is a conceptual cousin with low buyer collision. Noted on the competitive sheet, not battlecarded. Source SRC-006.

---

## 20. Split-Row Combo Model

Tools are the consonant row (invariant runtime). Templates and industry skins are the vowel row (overlay). Every offering is one tool interlocked with one template. **A combo that is not declared is not allowed to execute.**

Free = first-pass Path Sheet only. Everything past first pass is paid.

### Consonant tools (invariant)

| Tool | What it does | Free / Paid |
|---|---|---|
| Path Sheet Generator | Turns messy intake into first-pass Path Sheet, bridge rating, CaseSpace seed | FREE (first-pass); Paid inside CaseSpace |
| Door Seeder | Creates standing/closing CaseSpace seed from any chosen template | Paid |
| CaseSpace + Seal-Upward Closeout | Opens the record, closes children, seals proof into standing parent | Paid |
| Bridge / Readiness Scorer | Scores systems + re-entry + people + risk + missing proof | FREE at first-pass; Paid live |
| Permit & Bridge Lane Picker | Plain-English readiness lanes, each ending in a decision or deferral | Paid |
| Dashboards | Views over CaseSpace state; never a separate record | Paid |
| Weekly Update Generator | Six-field client update generated from CaseSpace state | Paid |
| Work Pack Installer | Installs parent + children + dashboard + proof rules in one move | Paid |
| Posting Desk | Computes Open Meeting Law 48-hour posting deadlines with statutory logic | Paid/bundled |
| Law-aware libraries | Statute/policy/NOFO references templates organize around | Paid/bundled |

### Vowel templates (overlay)

| Template | Interlocks with |
|---|---|
| Path Sheet Entry | Path Sheet Gen; Door Seeder |
| Permit & Bridge | Lane Picker; Posting Desk; Dashboards |
| Grant Readiness | Door Seeder; Bridge Scorer |
| Property Memory (STAY) | Door Seeder; Maintenance template |
| Policy/SOP Stewardship | Posting Desk; Dashboards |
| Quick Review | Path Sheet Gen |
| Bridge Package | Door Seeder; Dashboards |
| Live CaseSpace | Weekly Update Gen; Dashboards |
| Time & Attendance | Door Seeder; approval gates |
| Public Records / Board Packet | Posting Desk; Dashboards |
| Client Deliverable | Live CaseSpace; Weekly Update |
| Release / Deployment | Door Seeder; deploy checklist |
| Maintenance / Incident | Door Seeder; Dashboards |
| Invoice / Receipt / Payment Proof | Door Seeder; approval gate |
| Procurement / Vendor Handoff | Door Seeder; Dashboards |
| Hiring / Onboarding | Door Seeder; Dashboards |

---

## 21. Industry Combos

Same tools across every industry; only the template overlay changes.

| Industry | Lead Template(s) | Vowel Overlay (what diverges) | Paid Combo |
|---|---|---|---|
| ALL / Cross-cutting | Path Sheet Entry; Quick Review; Bridge Package; Live CaseSpace | Whichever family the matter belongs to | Quick Review → Bridge Package → Live CaseSpace |
| MUNI | Permit & Bridge; Public Records/Board Packet; Policy/SOP Stewardship | Permit/board/agency lanes; OML deadlines; authority & site facts | MUNI + Continuity Work Packs + Lane Picker + Posting Desk + stewardship |
| GRANT | Grant Readiness | Eligibility/match/partner/budget/narrative; NOFO references | GRANT Work Pack + submission proof |
| STAY | Property Memory; Maintenance/Incident | Guest/turnover/maintenance/receipt events; occupancy conflict check | STAY Work Pack + maintenance proof |
| BIZ | Client Deliverable; Live CaseSpace | Deliverable/draft/decision/invoice/handoff | BIZ Work Pack + weekly updates |
| LIVE | Release / Deployment | Bug/feature/release/incident/env; surface-not-state | LIVE Work Pack + release proof |
| PEOPLE | Time & Attendance; Hiring/Onboarding | Shift/timesheet/leave/OT/training/incident; posting/candidate/offer | Workforce Work Pack |
| PROPERTY | Maintenance / Incident | Issue/vendor/inspection/receipt/closeout; safety gate | Property Work Pack + before/after proof |
| FINANCE | Invoice / Receipt / Payment Proof | Invoice/receipt/approval/reimbursement | Finance Work Pack |
| OPS | Procurement / Vendor Handoff | Quote/vendor/PO/delivery/acceptance | Operations Work Pack |

---

## 22. Build Order

The first clickable loop must prove: Path Sheet Entry → CaseSpace seed → standing/closing child → next steps → **PRR records each change** → seal upward into parent (rollup) → stewardship note.

| ID | Build Item | Priority | First Demo |
|---|---|---|---|
| B-001 | Path Sheet Entry Generator | P0 | Path Sheet + bridge rating + seed JSON |
| B-002 | Series 1 Door Seeder | P0 | Door → CaseSpace JSON |
| B-003 | Standing/Closing CaseSpace Demo | P0 | Property/Project parent with one closing child |
| B-004 | Seal-Upward Closeout | P0 | Close child → sealed proof package → parent rollup reference |
| B-005 | Operator Movement Board | P0 | Today/Waiting/Judgment board |
| B-006 | Weekly Next Steps View | P1 | six-field update |
| B-007 | Permit & Bridge Lane Picker | P1 | Applicant/site Path Sheet |
| B-008 | Grant Readiness CaseSpace | P1 | Opportunity parent + submission child |
| B-009 | STAY Property Memory CaseSpace | P1 | Property parent + maintenance/turnover child |
| B-010 | Stewardship Tier Pack | P1 | Stewardship scope + update cadence |
| B-011 | Work Pack Installer | P2 | one installed work pack |

---

## 23. Governance

| Mechanism | Function |
|---|---|
| Ratifier | Every new template/work pack must pass 11 checks before becoming Series 1/2/3. |
| Consistency Audit | Periodic check that no CaseSpace holds live runtime state, no source has become the record, and no action path bypasses CAL. |
| Doctrine Fence | Architecture canon separated from GTM packaging. Changing a price never touches doctrine. |
| Pattern Rule | No client-specific feature until need appears three times (core tools exempt). |
| Partner Protocol | We do not replace partner systems. We sell readiness, continuity, records, proof, stewardship, and work libraries. |
| Counsel-Ready Rule | PublicLogic does not provide legal advice, legal conclusions, or agency determinations. |
| Composer Rule | Users assemble their own experience. PublicLogic stands up the CaseSpace and runs the runtime. |

### Ratifier checks

| ID | Check | Level |
|---|---|---|
| R-001 | Maps to standing/closing CaseSpace | Required |
| R-002 | Uses Capture/Classify/Advance/Seal | Required |
| R-003 | Names manual bridge removed | Required |
| R-004 | Defines searchable fields | Required |
| R-005 | Client surface stays PJ Lite | Required |
| R-006 | Not a systems replacement claim | Required |
| R-007 | Seal rule included (rollup, not parent mutation) | Required |
| R-008 | Dashboard is a view, not record | Required |
| R-009 | Counsel-ready / no determinations | Required |
| R-010 | Partner-safe positioning | Required |
| R-011 | Standing parent declared | Required |

---

### The clean build sentence *(reconciled)*

PublicLogic is a governed work library: ready-to-run CaseSpace templates for rule-bound operational work, backed by stewardship. Every door — path sheet, permits, grants, property, policy — opens into the same system. **FORM** captures the signal, **CaseSpace** owns the work and surfaces the launchers, **CAL** clears the action, **Manifest/PRM** checks the state, **PRR** records the change (append-only), and **ARCHIEVE** seals each closing case into its parent as rollup proof — with **VAULT** the doctrine that proves authority and evidence over that record, enforced by CAL gates and the append-only audit stream, never a stage in the line.

We don't replace your tools. We turn them into a command center — and the proof of what happened outlives whoever was running it.

---

---

## Appendix A — Source Register *(reconciled to Series 1 Workbook sheet 24)*

Plain-text public URLs used to ground the competitive pressure-test. Not NDA or private partner materials.

| ID | Entity | Fact / Use | URL | Last Checked |
|---|---|---|---|---|
| SRC-001 | Polimorphic | Platform positioning: complete AI platform for government services; intake to resolution; audit logging language. | https://www.polimorphic.com/platform | 2026-06-26 |
| SRC-002 | Polimorphic | General home page positioning for government services. | https://www.polimorphic.com/ | 2026-06-26 |
| SRC-003 | Polimorphic | Institutional knowledge public eBook / positioning. | https://www.polimorphic.com/ebooks/institutional-knowledge-is-walking-out-the-door | 2026-06-26 |
| SRC-004 | GovWell | Official Series A announcement: $25M Series A / AI operating system for modern government. | https://govwell.com/resources/govwell-series-a | 2026-06-26 |
| SRC-005 | Insight Partners | GovWell Series A release from lead investor. | https://www.insightpartners.com/ideas/govwell-raises-25m-series-a-led-by-insight-partners-to-build-the-ai-operating-system-for-modern-government/ | 2026-06-26 |
| SRC-006 | Coupa | Coupa acquisition of Tonkean for agentic intake and orchestration. | https://www.coupa.com/newsroom/coupa-acquires-tonkean-to-accelerate-agentic-intake-and-orchestration-for-global-trade/ | 2026-06-26 |
| SRC-007 | Granicus | Government Experience Agent public-sector AI self-service positioning. | https://granicus.com/gxa/ | 2026-06-26 |
| SRC-008 | Granicus | January 2026 update on AI agents and expanded Government Experience Agent capabilities. | https://granicus.com/blog/granicus-january-2026-semiannual-update-ai-agents-and-federal-cloud-solutions/ | 2026-06-26 |
| SRC-009 | Tyler Technologies | Investor release mentioning For The Record acquisition agreement and judicial intelligence. | https://investors.tylertech.com/news/news-details/2026/March-2026-Investor-News/default.aspx | 2026-06-26 |
| SRC-010 | Tyler Technologies / Yahoo Finance | Completion of For The Record acquisition on April 14, 2026. | https://finance.yahoo.com/markets/stocks/articles/tyler-technologies-completes-acquisition-record-144700050.html | 2026-06-26 |

---

## Appendix B — Reconciliation matrix

| Concern | Canon workbook | Series 1 Workbook | V1 markdown |
|---|---|---|---|
| Runtime line (PRR records / VAULT governs) | Tab 02 | 01_Core_Doctrine (doctrine table) | §1 — aligned |
| VAULT = doctrine, not a stage (V·A·U·L·T; U proposed) | Tab 12 | — | §1 VAULT block — aligned |
| Templates S1-001…S1-016 (16) | — | 05 (Track column) | §5–§6 — aligned |
| Work packs (10, incl. Procurement) | — | 06 | §7 — aligned |
| Policy/SOP Stewardship = P0 | — | 05 + A-010 (06 cell stale) | §7 — set to P0 |
| Permit lanes PB-01…PB-13 | — | 08 | §9 — aligned |
| Ratifier R-001…R-011 | — | 18 | §23 — aligned |
| Source Register | — | 24 | Appendix A — added |

---

*End of canon — V1 (Reconciled). Build from §22, prove on Path Sheet → standing/closing demo → PRR record → seal-upward rollup → Series 1 launch doors, expand the rest behind the fence.*
