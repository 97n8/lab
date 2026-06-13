export type PJCase = {
  id: string;
  title: string;
  owner: string;
  lane: "FORM" | "CaseSpace" | "PJ" | "VAULT" | "Archive";
  status: "draft" | "active" | "waiting" | "review" | "closed";
  evidence: string[];
  nextAction: string;
};

export function createPJCase(partial: Partial<PJCase>): PJCase {
  return {
    id: partial.id ?? `pj-${Date.now()}`,
    title: partial.title ?? "Untitled Case",
    owner: partial.owner ?? "Unassigned",
    lane: partial.lane ?? "FORM",
    status: partial.status ?? "draft",
    evidence: partial.evidence ?? [],
    nextAction: partial.nextAction ?? "Define intake, owner, evidence, and next review."
  };
}
