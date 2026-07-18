#!/usr/bin/env node
// Link check (build spec §6 item 3): internal /paper-trail links must
// resolve — hard fail. External source[] URLs return non-4xx — warn-only,
// external sites rot and shouldn't block a merge.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_ROOT = path.join(process.cwd(), "content", "paper-trail");
const REGISTRY_ROOT = path.join(CONTENT_ROOT, "_registry");

function listItems() {
  const years = fs
    .readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== "_registry")
    .map((d) => d.name);
  const items = [];
  for (const year of years) {
    const dir = path.join(CONTENT_ROOT, year);
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith(".md")) continue;
      const raw = fs.readFileSync(path.join(dir, name), "utf8");
      const { data, content } = matter(raw);
      items.push({ ...data, year, content, file: path.join(dir, name) });
    }
  }
  return items;
}

const items = listItems();
const tags = JSON.parse(fs.readFileSync(path.join(REGISTRY_ROOT, "tags.json"), "utf8"));

const knownPaths = new Set(items.map((i) => `/paper-trail/${i.year}/${i.slug}`));
["", "/releases", "/findings"].forEach((p) => knownPaths.add(`/paper-trail${p}`));
Object.keys(tags).forEach((t) => knownPaths.add(`/paper-trail/topics/${t}`));

const internalLinkRe = /\]\((\/paper-trail\/[^\s)]+)\)/g;
const failures = [];
for (const item of items) {
  let m;
  while ((m = internalLinkRe.exec(item.content))) {
    const link = m[1].split("#")[0].replace(/\/$/, "");
    if (!knownPaths.has(link)) {
      failures.push(`${path.relative(process.cwd(), item.file)}: internal link ${link} does not resolve`);
    }
  }
}

if (failures.length > 0) {
  console.error("Paper Trail link check FAILED (internal links):");
  failures.forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}

const externalUrls = items.flatMap((i) => (i.sources || []).map((s) => s.url).filter(Boolean));
if (externalUrls.length === 0) {
  console.log("Paper Trail link check passed (no external source URLs to check).");
  process.exit(0);
}

let warned = 0;
for (const url of externalUrls) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (res.status >= 400) {
      console.log(`  ! ${url} returned ${res.status}`);
      warned++;
    }
  } catch (err) {
    console.log(`  ! ${url} failed to fetch (${err.message})`);
    warned++;
  }
}
console.log(
  `Paper Trail link check passed — internal links OK, ${warned}/${externalUrls.length} external source(s) flagged (warn-only).`,
);
