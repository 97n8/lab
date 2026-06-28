// "Unexpected Proof" — municipal cemetery records, on the same verified spine.
// The poster's point: this is the case where the record itself IS the service,
// and where retention is permanent. So it's the purest test of "the record
// should stay." Same golden-path primitives as STAY and MUNI; the difference is
// presentation (one timeline) and that the sealed packet is the permanent record.

import {
  compileSeed,
  openRuntime,
  requestEvidence,
  provideEvidence,
  recordNote,
  logDecision,
  runPRM,
  type Runtime,
} from "@publiclogic/golden-path";

export type CemeteryEvent = { date: string; kind: string; label: string; file?: string };
export type CemeteryRecord = {
  id: string;
  subject: string;
  applicant: string;
  plot: { section: string; plot: string; deed: string };
  status: string;
  retention: string;
  owner: string;
  opened_at: string;
  intake: { problem: string; desired_outcome: string };
  timeline: CemeteryEvent[];
  files: string[];
};

// Steps that record a ruling/assignment vs. a plain note.
const DECISION_KINDS = new Set(["decision", "schedule"]);

/**
 * Map a cemetery record onto the runtime. Deterministic (uses opened_at for
 * every write so the same record always seals to the same packet).
 * - Step with a file → evidence requested + provided (the artifact, receipted).
 * - Plot assignment / scheduling → a recorded decision.
 * - Interment / other milestones → a note.
 */
export function buildCemeteryRuntime(
  r: CemeteryRecord,
  org: { name: string; domain: string },
): { runtime: Runtime; caseRef: Record<string, unknown> } {
  const ts = r.opened_at;
  const identity = compileSeed({ type: "domain", value: org.domain }, { timestamp: ts });

  let rt = openRuntime(
    identity,
    {
      role: r.owner,
      problem: r.intake.problem,
      desired_outcome: r.intake.desired_outcome,
      owner: r.owner,
      lane: "MUNI",
    },
    { timestamp: ts },
  );

  for (const e of r.timeline) {
    if (e.file) {
      rt = requestEvidence(rt, { item: e.file, owner: r.owner, by: r.owner }, { timestamp: ts });
      const ev = rt.evidence[rt.evidence.length - 1];
      rt = provideEvidence(rt, { evidenceId: ev.id, by: r.owner }, { timestamp: ts });
    } else if (DECISION_KINDS.has(e.kind)) {
      rt = logDecision(rt, { decision: e.label, by: r.owner }, { timestamp: ts });
    } else {
      rt = recordNote(rt, { event: e.label, by: r.owner }, { timestamp: ts });
    }
  }

  rt = runPRM(rt, { milestone: "permanent record", by: r.owner }, { timestamp: ts });

  const caseRef = {
    id: r.id,
    lane: "MUNI",
    owner: r.owner,
    subject: r.subject,
    plot: `${r.plot.section} ${r.plot.plot}`,
    deed: r.plot.deed,
    retention: r.retention,
  };
  return { runtime: rt, caseRef };
}
