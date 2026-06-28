// Hint assessment — a PJ product concern, shared by every file surface.
//
// This is the evidence question for a file: how strongly does it tell us where
// it belongs? It is deliberately vendor-neutral: Google Drive, OneDrive, Dropbox,
// a local watch folder — all hand the connector the same shape, and this judges
// the hint the same way. A vague filename is never enough to open a CaseSpace.

const DATE = /\d{4}-\d{2}-\d{2}/;
// Words that name a governed document/case — not generic nouns like "guest" or "scan".
const CASE_KEYWORD = /\b(reservation|booking|stay|agreement|lease|rental|deed|interment|permit|invoice|contract|onboarding|offboarding|grant|application)\b/i;

function slug(s) {
  return String(s).toLowerCase().replace(/\.[a-z0-9]+$/i, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 48);
}

/**
 * @param {{name?: string, folder?: string|null}} file  a canonical file record
 * @returns {{key: string|null, strength: "strong"|"weak"|"none", via: string|null}}
 *  - strong (folder): a structured case container (lane key `:`, a date, or a
 *    nested path) — also the only thing that can match an existing CaseSpace.
 *  - strong (file_name): a filename that clearly names a case (a case keyword,
 *    capitalised — e.g. "KPL Reservation 2026-07-03.pdf", "Smith Stay Agreement.pdf").
 *  - weak / none: a vague filename ("notes.pdf", "scan 22.pdf", "guest thing.docx",
 *    "IMG_1044.jpeg") or a generic folder — never enough to open anything.
 */
export function assessHint(file) {
  const folder = file.folder ?? file.caseHint ?? null;
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
