// @publiclogic/pj — the product-side seam. The framework-agnostic engine lives
// in @publiclogic/golden-path; this package answers how an external surface
// becomes a governed signal. Today that surface is files.
export {
  fileSurfaceConnector,
  assessHint,
  createFileSurfaceAdapter,
  defineFileSource,
  mockFileSource,
  httpFileSource,
  googleDriveSource,
} from "./connectors/files/index.js";
