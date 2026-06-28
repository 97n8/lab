// The Files connector — source-specific edges only (receive, normalize). resolve
// and receipt come from the golden-path core, untouched. A raw file record from a
// Files/Drive surface becomes a canonical Signal, then a PJObject; the core then
// decides where it goes and proves it. No vendor logic past normalize().

import { defineConnector, toSignal, toPJObject } from "@publiclogic/golden-path";

/**
 * Pull a single owner email out of a Drive-ish file record (tolerant of shapes:
 * `owner` string, `owners: [{emailAddress}]`, or none).
 */
function ownerOf(file) {
  if (typeof file.owner === "string") return file.owner;
  if (Array.isArray(file.owners) && file.owners[0]) {
    return file.owners[0].emailAddress || file.owners[0].email || null;
  }
  return null;
}

// A folder path / case hint the surface may carry (never inferred by guessing
// content — only read if the source provides it).
function hintOf(file) {
  return file.caseHint ?? file.folderPath ?? (Array.isArray(file.parents) ? file.parents[0] : null) ?? null;
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
        hint: hintOf(file),
        webViewLink: file.webViewLink ?? null,
      },
    });
  },
  async normalize(signal) {
    const hint = signal.payload.hint;
    return toPJObject({
      objectType: "files.document",
      title: signal.payload.name,
      relatedFiles: [signal.payload.name],
      relatedPeople: signal.actor ? [signal.actor] : [],
      suggestedCaseSpace: hint,
      confidence: 0.7,
      metadata: {
        source: "drive",
        signalType: signal.signalType,
        mimeType: signal.payload.mimeType,
        // What this file can prove about where it belongs: only its folder/hint.
        evidence: hint ? { folder_path: hint } : {},
        expects: ["folder_path", "reservation_name", "stay_date_match"],
      },
    });
  },
});
