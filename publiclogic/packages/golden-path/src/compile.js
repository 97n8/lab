// GP-001 identity compiler. The first real automation — deterministic, no AI:
//   Seed -> Source Profile -> Asset Set -> Document Set -> CaseSpace
import { deriveSeed, shortHash } from "./seed.js";

// The four governed object kinds. The attach rule (below) says everything in the
// runtime must hang off one of these — nothing else is a root.
export const GOVERNED_OBJECTS = ["SOURCE_PROFILE", "ASSET", "DOCUMENT", "CASESPACE"];

// Canonical asset types — "the things this organization owns or operates." Nothing more.
export const ASSET_TYPES = [
  "properties", "projects", "services", "products", "clients", "towns",
  "sites", "equipment", "vehicles", "vendors", "people",
];

// Housed document structure — always these eight folders.
export const DOCUMENT_FOLDERS = [
  "Identity", "Intake", "Evidence", "Templates", "Operations", "Policies", "Projects", "Archives",
];

// The Starter CaseSpace is the five-tab edge — the permanent shell everything grows from.
export const CASESPACE_TABS = ["Overview", "Intake", "Documents", "Decisions", "Next Steps"];

// Which asset types a lane guess suggests pre-selecting (still empty buckets).
const LANE_ASSETS = {
  STAY: ["properties", "vendors", "people"],
  MUNI: ["towns", "sites", "people"],
  BIZ: ["clients", "services", "products"],
  PROJECT: ["projects", "sites", "vendors"],
};

/**
 * Compile one seed into exactly four governed objects.
 * @param {{type:string, value?:string}} seed
 * @param {{timestamp?:string}} [opts]
 */
export function compileSeed(seed, opts = {}) {
  if (!seed || !seed.type) throw new Error("A seed with a type is required.");
  const value = (seed.value ?? "").trim();
  const ts = opts.timestamp ?? null;
  const d = deriveSeed(seed.type, value);
  const root = shortHash(`${seed.type}:${value || d.name}`);

  const source_profile = {
    object: "SOURCE_PROFILE",
    id: `SP-${root}`,
    name: d.name,
    aliases: d.aliases,
    description: "",
    website: d.website,
    emails: [],
    phones: [],
    addresses: [],
    connected_tools: d.connected_tools,
    confidence: d.confidence,
    lane_guess: d.lane_guess, // recommended, not decided — confirmed in GP-002
    source_links: value ? [value] : [],
    created_at: ts,
  };

  const suggested = new Set(LANE_ASSETS[d.lane_guess] ?? []);
  const asset_set = {
    object: "ASSET_SET",
    id: `AS-${root}`,
    source_profile_id: source_profile.id,
    types: ASSET_TYPES.map((type) => ({
      object: "ASSET",
      type,
      count: 0,
      suggested: suggested.has(type),
    })),
    created_at: ts,
  };

  const document_set = {
    object: "DOCUMENT_SET",
    id: `DS-${root}`,
    source_profile_id: source_profile.id,
    folders: DOCUMENT_FOLDERS.map((name) => ({ object: "DOCUMENT", folder: name })),
    created_at: ts,
  };

  const casespace = {
    object: "CASESPACE",
    id: `CS-${root}`,
    name: d.name,
    source_profile_id: source_profile.id,
    asset_set_id: asset_set.id,
    document_set_id: document_set.id,
    tabs: CASESPACE_TABS,
    created_at: ts,
  };

  return { seed: { type: seed.type, value }, source_profile, asset_set, document_set, casespace };
}

/**
 * The attach rule: everything in the runtime must attach to one of the four
 * governed objects. If it can't, it isn't part of the runtime.
 */
export function canAttach(objectKind) {
  return GOVERNED_OBJECTS.includes(objectKind);
}

/** The deterministic pipeline, named for display. */
export const PIPELINE = ["Seed", "Source Profile", "Asset Set", "Document Set", "CaseSpace"];
