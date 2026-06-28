export { defineFileSource, mockFileSource } from "./source.js";
export { httpFileSource } from "./httpFileSource.js";
export { googleDriveSource } from "./googleDrive.js";
// Future surfaces drop in here with the same FileSource contract, no connector or
// resolver changes: oneDriveSource, dropboxSource, sharePointSource,
// localWatchFolderSource, …
