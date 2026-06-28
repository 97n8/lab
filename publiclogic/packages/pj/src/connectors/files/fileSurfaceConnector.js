// FileSurfaceConnector — PJ's one connector for *file signals*, vendor-neutral.
//
// PJ does not organize files. PJ watches a file surface for signals. Google Drive
// is just one producer of those signals; OneDrive, Dropbox, SharePoint, or a local
// watch folder are others. They all hand this connector the same canonical file
// shape, so the normalization + hint assessment + decision are identical no matter
// the vendor. The decision is really an *evidence* decision:
//
//   existing CaseSpace proven   → append
//   strong evidence of new case → open
//   weak evidence               → needs_review
//   no evidence                 → needs_review
//
// Only `receive`/`normalize` live here (PJ product behavior). Placement (the
// resolver), receipts, and review state are the golden-path runtime core,
// untouched: the resolver only ever sees the normalized PJObject + evidence.

import { defineConnector, toSignal, toPJObject } from "@publiclogic/golden-path";
import { assessHint } from "./hint.js";

function ownerOf(file) {
  if (typeof file.owner === "string") return file.owner;
  if (Array.isArray(file.owners) && file.owners[0]) {
    return file.owners[0].emailAddress || file.owners[0].email || null;
  }
  return null;
}

function folderOf(file) {
  return file.folder ?? file.caseHint ?? file.folderPath ?? (Array.isArray(file.parents) ? file.parents[0] : null) ?? null;
}

export const fileSurfaceConnector = defineConnector({
  // The connector's own label; the SIGNAL's source is the actual producer
  // ("google-drive", "onedrive", …), so receipts name the real surface.
  source: "file-surface",
  async receive({ source, file }) {
    return toSignal({
      source, // the producing surface, e.g. "google-drive"
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
    const hint = assessHint({ name: signal.payload.name, folder: signal.payload.folder });
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
        source: signal.source,
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
