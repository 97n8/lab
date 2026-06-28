// The Files connector — source-specific edges only (receive, normalize). resolve
// and receipt come from the golden-path core, untouched. A raw file record from a
// Files/Drive surface becomes a canonical Signal, then a PJObject; the core then
// decides where it goes and proves it. No vendor logic past normalize().
//
// The hint-strength judgement lives HERE (it is file/Drive-specific), never in the
// core resolver. The doctrine it encodes: a strong hint (a structured case folder,
// or a filename that clearly names a case) is worth opening a CaseSpace for; a
// weak or absent hint is NOT — PJ preserves the signal and lets a human decide
// rather than inventing context from a vague filename.

import { defineConnector, toSignal, toPJObject } from "@publiclogic/golden-path";

function ownerOf(file) {
  if (typeof file.owner === "string") return file.owner;
  if (Array.isArray(file.owners) && file.owners[0]) {
    return file.owners[0].emailAddress || file.owners[0].email || null;
  }
  return null;
}

function folderOf(file) {
  return file.caseHint ?? file.folderPath ?? (Array.isArray(file.parents) ? file.parents[0] : null) ?? null;
}

const DATE = /\d{4}-\d{2}-\d{2}/;
// Words that name a governed document/case — not generic nouns like "guest" or "scan".
const CASE_KEYWORD = /\b(reservation|booking|stay|agreement|lease|rental|deed|interment|permit|invoice|contract|onboarding|offboarding|grant|application)\b/i;

function slug(s) {
  return String(s).toLowerCase().replace(/\.[a-z0-9]+$/i, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 48);
}

/**
 * How strong is the file's hint about where it belongs? Source-specific judgement,
 * kept out of the core resolver.
 *  - strong (folder): a structured case container (lane key `:`, a date, or a
 *    nested path) — also the only thing that can match an existing CaseSpace.
 *  - strong (file_name): a filename that clearly names a case (a case keyword,
 *    capitalised — e.g. "KPL Reservation 2026-07-03.pdf", "Smith Stay Agreement.pdf").
 *  - weak / none: a vague filename ("notes.pdf", "scan 22.pdf", "IMG_1044.jpeg")
 *    or a generic folder — not enough to open anything.
 * @returns {{key: string|null, strength: "strong"|"weak"|"none", via: string|null}}
 */
export function assessHint(file) {
  const folder = folderOf(file);
  const name = file.name ?? "";

  if (folder) {
    const segs = String(folder).split(/[/\\]/).filter(Boolean);
    const structured = String(folder).includes(":") || DATE.test(folder) || segs.length >= 2;
    if (structured) return { key: folder, strength: "strong", via: "folder_path" };
  }
  if (CASE_KEYWORD.test(name) && /[A-Z]/.test(name)) {
    return { key: slug(name), strength: "strong", via: "file_name" };
  }
  const bareName = name.replace(/\.[a-z0-9]+$/i, "").trim();
  if (folder || bareName) return { key: null, strength: "weak", via: null };
  return { key: null, strength: "none", via: null };
}

export const filesConnector = defineConnector({
  source: "drive",
  async receive(file) {
    return toSignal({
      source: "drive",
      signalType: "file.indexed",
      sourceId: file.id,
      occurredAt: file.modifiedTime || file.createdTime,
      actor: ownerOf(file),
      payload: {
        name: file.name,
        mimeType: file.mimeType ?? null,
        folder: folderOf(file),
        webViewLink: file.webViewLink ?? null,
      },
    });
  },
  async normalize(signal) {
    const hint = assessHint({ name: signal.payload.name, caseHint: signal.payload.folder });
    const strong = hint.strength === "strong";
    return toPJObject({
      objectType: "files.document",
      title: signal.payload.name,
      relatedFiles: [signal.payload.name],
      relatedPeople: signal.actor ? [signal.actor] : [],
      // Only a STRONG hint becomes a CaseSpace suggestion the resolver can act on.
      suggestedCaseSpace: strong ? hint.key : null,
      confidence: 0.7,
      metadata: {
        source: "drive",
        signalType: signal.signalType,
        mimeType: signal.payload.mimeType,
        hintStrength: hint.strength,
        // Folder evidence is only offered when it's strong enough to match a case.
        evidence: strong && hint.via === "folder_path" ? { folder_path: hint.key } : {},
        expects: ["folder_path", "reservation_name", "stay_date_match"],
      },
    });
  },
});
