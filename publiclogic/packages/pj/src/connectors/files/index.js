// PJ · file-surface connector (product-side). PJ watches a file surface for
// signals — it does not organize files. Vendor-neutral: one connector, many
// sources.
export { fileSurfaceConnector } from "./fileSurfaceConnector.js";
export { assessHint } from "./hint.js";
export { createFileSurfaceAdapter } from "./adapter.js";
export { defineFileSource, mockFileSource, httpFileSource, googleDriveSource } from "./sources/index.js";
