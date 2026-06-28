// GP-002 — the Universal FORM. It opens AGAINST a compiled identity (GP-001),
// so it never re-asks what the Source Profile already knows. The shortest
// possible intake, then it opens a valid CaseSpace + the first PRR entry.
import { shortHash } from "./seed.js";

export const LOCKED_LANES = ["STAY", "MUNI", "PROJECT", "BIZ"];

// The shortest possible intake. `grounded` fields are pre-filled from the
// identity; the user confirms rather than types. `required` gates a valid open.
export const FORM_FIELDS = [
  { key: "role", label: "Your role", kind: "text", required: false, placeholder: "owner, clerk, consultant…" },
  { key: "problem", label: "What’s going on?", kind: "textarea", required: true },
  { key: "desired_outcome", label: "What does done look like?", kind: "textarea", required: true },
  { key: "source", label: "Source", kind: "text", grounded: true },
  { key: "deadline", label: "Deadline", kind: "date", required: false },
  { key: "owner", label: "Owner", kind: "text", grounded: true },
  { key: "lane", label: "Lane", kind: "lane", required: true, grounded: true },
];

/** Pre-fill the grounded fields from the compiled identity — the form's "teeth". */
export function deriveFormDefaults(identity) {
  const sp = identity?.source_profile ?? {};
  const source =
    (sp.source_links && sp.source_links[0]) ||
    (sp.connected_tools && sp.connected_tools.join(", ")) ||
    "";
  return {
    role: "",
    problem: "",
    desired_outcome: "",
    source,
    deadline: "",
    owner: "",
    lane: sp.lane_guess || "",
  };
}

/**
 * Open the work. Validates the shortest intake, then opens the Starter CaseSpace
 * (from GP-001) into an active CaseSpace with intake populated, and seeds PRR.
 * @returns {{valid:boolean, missing:string[], form_entry, casespace, prr}}
 */
export function openForm(identity, answers = {}, opts = {}) {
  if (!identity?.source_profile) throw new Error("openForm needs a compiled identity (run GP-001 first).");
  const sp = identity.source_profile;
  const ts = opts.timestamp ?? null;
  const a = { ...deriveFormDefaults(identity), ...answers };

  const missing = FORM_FIELDS.filter((f) => f.required && !String(a[f.key] || "").trim()).map((f) => f.key);
  const valid = missing.length === 0;

  const root = shortHash(`${sp.id}:${a.problem}:${a.desired_outcome}`);
  const owner = String(a.owner || "").trim() || "Unassigned";

  const form_entry = {
    object: "FORM",
    id: `FM-${root}`,
    source_profile_id: sp.id,
    role: a.role,
    problem: a.problem,
    desired_outcome: a.desired_outcome,
    source: a.source,
    deadline: a.deadline || null,
    owner,
    lane: a.lane, // confirmed; overrides the GP-001 lane_guess
    created_at: ts,
  };

  // The Starter CaseSpace (GP-001) opens into an active CaseSpace.
  const base = identity.casespace ?? {};
  const casespace = {
    ...base,
    status: "active",
    form_entry_id: form_entry.id,
    lane: a.lane,
    owner,
    opened_at: ts,
    tabs_content: {
      Overview: { desired_outcome: a.desired_outcome, lane: a.lane, owner, status: "active" },
      Intake: {
        role: a.role,
        problem: a.problem,
        source: a.source,
        deadline: a.deadline || null,
        known: { name: sp.name, website: sp.website, connected_tools: sp.connected_tools },
      },
      Documents: identity.document_set?.folders?.map((f) => f.folder) ?? [],
      Decisions: [],
      "Next Steps": [{ title: "Confirm intake and assign an owner", owner, status: "open" }],
    },
  };

  const prr = valid
    ? [{ seq: 1, at: ts, event: "FORM submitted — CaseSpace opened", by: owner }]
    : [];

  return { valid, missing, form_entry, casespace, prr };
}
