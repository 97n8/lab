// MUNI lane, on the same spine. This proves the verified runtime isn't
// STAY-specific: a municipal HR onboarding/offboarding case is driven through
// the exact golden-path primitives (compileSeed → openRuntime → evidence /
// notes / decision / PRM), so its PRR can be sealed and verified identically.
//
// A .gov domain seed auto-grounds the MUNI lane (deriveSeed), which is the
// point — PJ reads what the source already says instead of re-asking.

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

export type MuniTask = { key: string; label: string; done: boolean; file?: string };
export type MuniCase = {
  id: string;
  kind: "onboarding" | "offboarding";
  person: { name: string; role: string };
  status: string;
  key_date: { label: string; value: string };
  next_step: { label: string; due: string };
  owner: string;
  opened_at: string;
  intake: { problem: string; desired_outcome: string };
  tasks: MuniTask[];
  files: string[];
  deadlines: { date: string; label: string }[];
};

export type MuniRuntime = { runtime: Runtime; caseRef: Record<string, unknown> };

/**
 * Map a MUNI HR case onto the real runtime. Deterministic: every write uses the
 * case's opened_at timestamp, so the same case always seals to the same packet.
 * - Completed task with a file → evidence requested + provided (proof attached).
 * - Completed task with no file → a note (it still earns a record).
 * - Pending task → evidence requested and left outstanding → PRM surfaces it.
 */
export function buildMuniRuntime(c: MuniCase, org: { name: string; domain: string }): MuniRuntime {
  const ts = c.opened_at;
  const identity = compileSeed({ type: "domain", value: org.domain }, { timestamp: ts });

  let rt = openRuntime(
    identity,
    {
      role: c.owner,
      problem: c.intake.problem,
      desired_outcome: c.intake.desired_outcome,
      owner: c.owner,
      lane: "MUNI",
    },
    { timestamp: ts },
  );

  for (const t of c.tasks) {
    if (t.done && t.file) {
      rt = requestEvidence(rt, { item: t.file, owner: c.owner, by: c.owner }, { timestamp: ts });
      const ev = rt.evidence[rt.evidence.length - 1];
      rt = provideEvidence(rt, { evidenceId: ev.id, by: c.owner }, { timestamp: ts });
    } else if (t.done) {
      rt = recordNote(rt, { event: `Completed: ${t.label}`, by: c.owner }, { timestamp: ts });
    } else {
      rt = requestEvidence(rt, { item: t.label, owner: c.owner, by: c.owner }, { timestamp: ts });
    }
  }

  const decision =
    c.kind === "onboarding"
      ? `Approved start date ${c.key_date.value}`
      : `Approved final pay through ${c.key_date.value}`;
  rt = logDecision(rt, { decision, by: c.owner }, { timestamp: ts });

  rt = runPRM(
    rt,
    { milestone: c.kind === "onboarding" ? "fully onboarded" : "fully offboarded", by: c.owner },
    { timestamp: ts },
  );

  const caseRef = { id: c.id, lane: "MUNI", owner: c.owner, person: c.person.name, kind: c.kind };
  return { runtime: rt, caseRef };
}
