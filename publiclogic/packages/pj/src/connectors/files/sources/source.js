// A FileSource produces raw file records from ONE external surface (one vendor).
// It owns the I/O and the vendor-shape → canonical-file mapping, and nothing else.
// It does not normalize, decide, or prove — that is the connector + the runtime
// core. This is the only coupling point to a specific vendor.
//
// Canonical file record (what every source must emit):
//   { id, name, mimeType?, modifiedTime?, owner?|owners?, folder?|folderPath?|parents?, webViewLink? }

/**
 * @typedef {Object} FileSource
 * @property {string} source                     - the surface id, e.g. "google-drive"
 * @property {() => Promise<object[]>} listFiles  - canonical file records
 */

/** Wrap a source id + a listFiles() into a validated FileSource. */
export function defineFileSource({ source, listFiles }) {
  if (!source || typeof source !== "string") throw new Error("FileSource: a source id is required.");
  if (typeof listFiles !== "function") throw new Error("FileSource: listFiles() is required.");
  return { source, listFiles };
}

/** Test/dev source: hand it a surface id + fixtures, get them back. No network. */
export function mockFileSource(source, files = []) {
  return defineFileSource({
    source,
    async listFiles() {
      return files;
    },
  });
}
