#!/usr/bin/env node
// Publish golden-path's family authority as a DETERMINISTIC artifact.
//
//   node scripts/emit-families.mjs --write   # regenerate families.json (commit it)
//   node scripts/emit-families.mjs --check    # fail if the committed artifact is stale
//
// This is the producer side of the Bookend handshake (VAULT 2026-07-10):
// golden-path owns the closed family list; puddlejumper PINS this artifact by a
// golden-path revision and verifies its `source_blob`. It must not import an
// unpinned live branch, and must not keep an independent authoritative copy.
//
// Determinism is the whole point (a fresh --check must equal the committed file):
//   - NO wall-clock `generated_at` — that changes every run.
//   - NO containing-commit SHA — it does not exist until after this file is written.
//   - Provenance is the git BLOB sha of the source module, which is computable
//     before the commit exists and changes only when the source changes.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AUDIT_EVENT_FAMILIES } from "../packages/golden-path/src/audit.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const SRC = "packages/golden-path/src/audit.js";
const OUT = path.join(ROOT, "packages/golden-path/families.json");

// git blob sha of the authoritative source — deterministic, pre-commit-computable.
const sourceBlob = execFileSync("git", ["hash-object", SRC], { cwd: ROOT })
  .toString()
  .trim();

const artifact = {
  schema: "publiclogic.golden-path.families/1",
  // The closed, ordered family set the seal commits. Consumers check membership;
  // they never re-derive it.
  families: [...AUDIT_EVENT_FAMILIES],
  provenance: {
    source: SRC,
    export: "AUDIT_EVENT_FAMILIES",
    // Pin THIS when consuming: (golden_path_revision, source_blob) identifies the
    // exact bytes the families were derived from. The revision is the consumer's
    // to record — this file cannot know the commit that will contain it.
    source_blob: sourceBlob,
  },
};

// Stable serialization: 2-space indent, trailing newline, key order fixed above.
const serialized = JSON.stringify(artifact, null, 2) + "\n";

const mode = process.argv[2] ?? "--check";
if (mode === "--write") {
  fs.writeFileSync(OUT, serialized);
  console.log(`wrote ${path.relative(ROOT, OUT)} (source_blob ${sourceBlob.slice(0, 12)}…)`);
  process.exit(0);
}

// --check: the committed artifact must equal a fresh generation.
const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
if (current !== serialized) {
  console.error(
    "STALE_ARTIFACT: packages/golden-path/families.json is out of date.\n" +
      "  The committed artifact does not match a fresh generation from audit.js.\n" +
      "  Run: node scripts/emit-families.mjs --write   (then commit)",
  );
  process.exit(1);
}
console.log(`families.json is current (${artifact.families.length} families, source_blob ${sourceBlob.slice(0, 12)}…).`);
