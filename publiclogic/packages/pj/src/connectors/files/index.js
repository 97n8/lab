// PJ · file-surface connector (product-side). PJ watches a file surface for
// signals — it does not organize files.
export { filesConnector, assessHint } from "./filesConnector.js";
export { httpFilesPort, mockFilesPort } from "./ports.js";
export { createFilesAdapter } from "./filesAdapter.js";
