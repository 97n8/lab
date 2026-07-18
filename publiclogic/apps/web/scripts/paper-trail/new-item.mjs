#!/usr/bin/env node
// Scaffolds a new Paper Trail item with the next sequential PT-YYYY-NNN id
// (build spec §9 / acceptance criterion 1: scaffold to published in one PR
// with zero hand-written metadata beyond what this script asks for).
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_ROOT = path.join(process.cwd(), "content", "paper-trail");
const REGISTRY_ROOT = path.join(CONTENT_ROOT, "_registry");

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next !== undefined && !next.startsWith("--")) {
      out[key] = next;
      i++;
    } else {
      out[key] = true;
    }
  }
  return out;
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(REGISTRY_ROOT, file), "utf8"));
}

function listExistingFrontmatter() {
  const years = fs
    .readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== "_registry")
    .map((d) => d.name);
  const all = [];
  for (const year of years) {
    const dir = path.join(CONTENT_ROOT, year);
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith(".md")) continue;
      const { data } = matter(fs.readFileSync(path.join(dir, name), "utf8"));
      all.push({ ...data, year });
    }
  }
  return all;
}

function nextId(year, existing) {
  const yearItems = existing.filter((i) => String(i.id || "").startsWith(`PT-${year}-`));
  const max = yearItems.reduce((m, i) => {
    const n = parseInt(String(i.id).split("-")[2], 10);
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return `PT-${year}-${String(max + 1).padStart(3, "0")}`;
}

function usage() {
  console.log(
    'Usage: node scripts/paper-trail/new-item.mjs --title "Title" --shelf release|finding --authors key1,key2 --tags tag1,tag2 [--abstract "..."] [--entities key1,key2]',
  );
}

const args = parseArgs(process.argv.slice(2));
if (!args.title || !args.shelf || !args.authors || !args.tags) {
  usage();
  process.exit(1);
}
if (args.shelf !== "release" && args.shelf !== "finding") {
  console.error('--shelf must be "release" or "finding"');
  process.exit(1);
}

const tagsRegistry = readJson("tags.json");
const authorsRegistry = readJson("authors.json");
const entitiesRegistry = readJson("entities.json");
const retired = readJson("retired-slugs.json");

const tagList = String(args.tags).split(",").map((s) => s.trim()).filter(Boolean);
const authorList = String(args.authors).split(",").map((s) => s.trim()).filter(Boolean);
const entityList = args.entities
  ? String(args.entities).split(",").map((s) => s.trim()).filter(Boolean)
  : [];

for (const t of tagList) {
  if (!tagsRegistry[t]) {
    console.error(`Unknown tag "${t}" — add it to content/paper-trail/_registry/tags.json first.`);
    process.exit(1);
  }
}
for (const a of authorList) {
  if (!authorsRegistry[a]) {
    console.error(`Unknown author "${a}" — add it to content/paper-trail/_registry/authors.json first.`);
    process.exit(1);
  }
}
for (const e of entityList) {
  if (!entitiesRegistry[e]) {
    console.error(`Unknown entity "${e}" — add it to content/paper-trail/_registry/entities.json first.`);
    process.exit(1);
  }
}

const now = new Date();
const year = String(now.getFullYear());
const existing = listExistingFrontmatter();
const id = nextId(year, existing);

const slug = slugify(args.title);
if (!slug) {
  console.error("Could not derive a slug from --title.");
  process.exit(1);
}
const usedSlugs = new Set(existing.filter((i) => i.year === year).map((i) => i.slug));
const retiredForYear = new Set(retired[year] || []);
if (usedSlugs.has(slug) || retiredForYear.has(slug)) {
  console.error(`Slug "${slug}" is already used or retired for ${year} — pick a different --title.`);
  process.exit(1);
}

const dir = path.join(CONTENT_ROOT, year);
fs.mkdirSync(dir, { recursive: true });
const filePath = path.join(dir, `${id.toLowerCase()}-${slug}.md`);
if (fs.existsSync(filePath)) {
  console.error(`${filePath} already exists.`);
  process.exit(1);
}

const abstract =
  args.abstract ||
  "TODO — replace with the forwardable one- to three-sentence summary of this item before it leaves draft. Must run at least eighty characters long.";
const isoDate = now.toISOString().slice(0, 10);

const frontmatter = {
  id,
  title: args.title,
  slug,
  shelf: args.shelf,
  status: "draft",
  abstract,
  authors: authorList,
  datePublished: isoDate,
  version: "1.0",
  tags: tagList,
  entities: entityList,
  corrections: [],
  ...(args.shelf === "finding" ? { sources: [] } : {}),
};

const fileContents = matter.stringify("\n## Summary\n\nTODO: write the body.\n", frontmatter);
fs.writeFileSync(filePath, fileContents);

console.log(`Scaffolded ${id} at ${path.relative(process.cwd(), filePath)}`);
console.log("Next: write the body, then move status through review -> approved -> published in the PR.");
