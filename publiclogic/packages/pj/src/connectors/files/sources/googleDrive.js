// Google Drive — ONE file surface, not the connector. It maps Drive's file shape
// to the canonical record and reads via env config. Swapping in OneDrive, Dropbox,
// SharePoint, or a local watch folder is another file in this directory with the
// same contract — none of them change the connector or the resolver.

import { httpFileSource } from "./httpFileSource.js";

// Drive file → canonical file record. (A real deployment may resolve parent
// folder names into `folderPath`; here we pass through whatever the surface gives.)
function mapDriveFile(f) {
  return {
    id: f.id,
    name: f.name,
    mimeType: f.mimeType ?? null,
    modifiedTime: f.modifiedTime ?? f.createdTime ?? null,
    owners: f.owners ?? null,
    folderPath: f.folderPath ?? f.caseHint ?? (Array.isArray(f.parents) ? f.parents[0] : null) ?? null,
    webViewLink: f.webViewLink ?? null,
  };
}

/**
 * @returns {import("./source.js").FileSource} source id "google-drive"
 * Env: PJ_GOOGLE_DRIVE_URL (required), PJ_GOOGLE_DRIVE_TOKEN (optional).
 */
export function googleDriveSource(env = process.env, deps = {}) {
  return httpFileSource({
    source: "google-drive",
    urlEnv: "PJ_GOOGLE_DRIVE_URL",
    tokenEnv: "PJ_GOOGLE_DRIVE_TOKEN",
    map: mapDriveFile,
    env,
    deps,
  });
}
