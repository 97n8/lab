#!/usr/bin/env node
// Emits the canon vocabularies as JSON, by IMPORTING the actual runtime modules.
// This is the ONLY place the source is read. Everything downstream is told, not
// asked. LOCKED_LANES is read by *executing* form.js — a regex would pass on a
// commented-out constant, so there is no regex here.
//
// Every code-owned vocabulary has an entry below. If its named export is missing
// from the module (an internal const the registry claims to own), it is reported
// `unexported: true` — the validator turns that into an UNEXPORTED failure. It is
// never silently regex-scraped out of the source text; that is the drift this gate
// exists to close.

import { pathToFileURL } from "node:url";
import path from "node:path";

const ROOT = process.argv[2] ?? "packages/golden-path";
const imp = (f) => import(pathToFileURL(path.resolve(ROOT, "src", f)).href);

// name -> where the vocabulary lives, and how to read it off the module.
//   read: "list"   -> the export is the array of members
//         "values" -> the export is a map; members are Object.values
//         "keys"   -> the export is a map; members are Object.keys
const MANIFEST = [
  { name: "Lane", file: "form.js", exp: "LOCKED_LANES", read: "list" },
  { name: "Signal Kind", file: "signal.js", exp: "SIGNAL_KINDS", read: "list" },
  { name: "Connector Type", file: "signal.js", exp: "CONNECTOR_TYPES", read: "list" },
  { name: "Decision", file: "connector.js", exp: "CASE_ACTIONS", read: "list" },
  // Verb vocabularies are explicit exported arrays (not derived from map order),
  // so canon does not depend on Object.keys/values ordering.
  { name: "Receipt Verb", file: "connector.js", exp: "RECEIPT_VERBS", read: "list" },
  { name: "Human Verb", file: "review.js", exp: "HUMAN_VERBS", read: "list" },
  { name: "Resolution", file: "review.js", exp: "RESOLUTION_ACTIONS", read: "list" },
  { name: "PRR Kind", file: "prr.js", exp: "PRR_KINDS", read: "list" },
];

// Load each referenced module once (importing executes it — the point).
const files = [...new Set(MANIFEST.map((m) => m.file))];
const mods = Object.fromEntries(await Promise.all(files.map(async (f) => [f, await imp(f)])));

function members(mod, exp, read) {
  const v = mod[exp];
  if (v === undefined) return undefined; // not exported
  if (read === "keys") return Object.keys(v);
  if (read === "values") return Object.values(v);
  return Array.isArray(v) ? [...v] : undefined;
}

const vocabularies = {};
for (const { name, file, exp, read } of MANIFEST) {
  const from = `${file} · ${exp}${read === "keys" ? " (keys)" : ""}`;
  const m = members(mods[file], exp, read);
  vocabularies[name] = m === undefined ? { unexported: true, from } : { members: m, from };
}

const connector = mods["connector.js"];
if (connector.REVIEW_THRESHOLD === undefined) throw new Error("connector.js does not export REVIEW_THRESHOLD");

process.stdout.write(
  JSON.stringify(
    {
      generated_from: `${ROOT}/src`,
      vocabularies,
      constants: { REVIEW_THRESHOLD: connector.REVIEW_THRESHOLD },
    },
    null,
    2,
  ),
);
