#!/usr/bin/env node
// Canon lint for The Paper Trail (build spec §6), two tiers:
//   - hard fails: deterministic denylist (LogicOS anywhere; ARCHIVE where
//     ARCHIEVE is the correct spelling) — blocks merge.
//   - warnings: contextual and non-blocking ("engine" near runtime/
//     PuddleJumper/GPR context; bare GPR/PRR on first use). Regex context
//     windows are brittle NLP and will false-positive — put legitimate uses
//     in .canon-allowlist (one pattern per line, committed) rather than
//     silencing the rule.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_ROOT = path.join(process.cwd(), "content", "paper-trail");
const ALLOWLIST_PATH = path.join(process.cwd(), ".canon-allowlist");

function loadAllowlist() {
  if (!fs.existsSync(ALLOWLIST_PATH)) return [];
  return fs
    .readFileSync(ALLOWLIST_PATH, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
}

function isAllowlisted(text, allowlist) {
  return allowlist.some((pattern) => text.includes(pattern));
}

function listMarkdownFiles() {
  const years = fs
    .readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== "_registry")
    .map((d) => d.name);
  const files = [];
  for (const year of years) {
    const dir = path.join(CONTENT_ROOT, year);
    for (const name of fs.readdirSync(dir)) {
      if (name.endsWith(".md")) files.push(path.join(dir, name));
    }
  }
  return files;
}

const allowlist = loadAllowlist();
const hardFails = [];
const warnings = [];

for (const file of listMarkdownFiles()) {
  const rel = path.relative(process.cwd(), file);
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const fullText = `${data.title || ""}\n${data.abstract || ""}\n${content}`;
  const lines = fullText.split("\n");

  lines.forEach((line, idx) => {
    if (/\bLogicOS\b/i.test(line) && !isAllowlisted(line, allowlist)) {
      hardFails.push(`${rel}:${idx + 1}: "LogicOS" is denylisted — ${line.trim()}`);
    }
    if (/\bARCHIVE\b/.test(line) && !isAllowlisted(line, allowlist)) {
      hardFails.push(`${rel}:${idx + 1}: "ARCHIVE" — did you mean "ARCHIEVE"? — ${line.trim()}`);
    }

    const words = line.split(/\s+/);
    words.forEach((word, wi) => {
      if (/^engines?$/i.test(word.replace(/[^\w]/g, "")) && !isAllowlisted(line, allowlist)) {
        const windowText = words.slice(Math.max(0, wi - 3), Math.min(words.length, wi + 4)).join(" ");
        if (/\b(runtime|puddlejumper|gpr)\b/i.test(windowText)) {
          warnings.push(`${rel}:${idx + 1}: "engine" near runtime/PuddleJumper/GPR context — ${line.trim()}`);
        }
      }
    });
  });

  for (const [acronym, expansion] of [
    ["GPR", "Governance Process Runtime"],
    ["PRR", "Public Records Request"],
  ]) {
    const firstIdx = fullText.indexOf(acronym);
    if (firstIdx === -1) continue;
    const windowText = fullText.slice(Math.max(0, firstIdx - 60), firstIdx + 60);
    if (!windowText.includes(expansion) && !isAllowlisted(windowText, allowlist)) {
      warnings.push(`${rel}: bare "${acronym}" on first use without "${expansion}" nearby`);
    }
  }
}

if (warnings.length > 0) {
  console.log(`canon: ${warnings.length} warning(s) (non-blocking):`);
  warnings.forEach((w) => console.log(`  ! ${w}`));
}

if (hardFails.length > 0) {
  console.error(`\ncanon check FAILED — ${hardFails.length} hard violation(s):`);
  hardFails.forEach((f) => console.error(`  x ${f}`));
  console.error("\nLegitimate uses go in .canon-allowlist (one pattern per line, committed).");
  process.exit(1);
}

console.log(`canon check passed${warnings.length ? ` (${warnings.length} warning(s) above)` : ""}.`);
