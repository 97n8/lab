#!/usr/bin/env node
// Invariant 3a (§2.2): datePublished is immutable once an item has been
// published. Diffs changed content files in this PR against the base
// branch and fails if a previously-published item's datePublished moved.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const baseRef = process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : "origin/main";
const PATHSPEC = "publiclogic/apps/web/content/paper-trail";

let repoRoot;
try {
  repoRoot = execSync("git rev-parse --show-toplevel", { encoding: "utf8" }).trim();
} catch {
  console.log("Not inside a git checkout — skipping immutable-date check.");
  process.exit(0);
}

function readFrontmatterAtRef(ref, relPath) {
  try {
    const raw = execSync(`git show ${ref}:${relPath}`, { cwd: repoRoot, encoding: "utf8" });
    return matter(raw).data;
  } catch {
    return null; // didn't exist at ref — a new file, nothing to guard
  }
}

let changed = [];
try {
  const out = execSync(`git diff --name-only ${baseRef}...HEAD -- ${PATHSPEC}`, {
    cwd: repoRoot,
    encoding: "utf8",
  });
  changed = out
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.endsWith(".md"));
} catch (err) {
  console.log(`Could not diff against ${baseRef} (${String(err.message).split("\n")[0]}) — skipping check.`);
  process.exit(0);
}

const problems = [];
for (const relPath of changed) {
  const before = readFrontmatterAtRef(baseRef, relPath);
  if (!before || before.status !== "published") continue;

  const absPath = path.join(repoRoot, relPath);
  if (!fs.existsSync(absPath)) continue;

  const after = matter(fs.readFileSync(absPath, "utf8")).data;
  const beforeDate = new Date(before.datePublished).toISOString();
  const afterDate = new Date(after.datePublished).toISOString();
  if (beforeDate !== afterDate) {
    problems.push(`${relPath}: datePublished changed from ${beforeDate} to ${afterDate} on an already-published item.`);
  }
}

if (problems.length > 0) {
  console.error("Paper Trail immutable-date check FAILED:");
  problems.forEach((p) => console.error(`  x ${p}`));
  process.exit(1);
}
console.log("Paper Trail immutable-date check passed.");
