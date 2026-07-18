import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  paperTrailSchema,
  type AuthorRegistry,
  type EntityRegistry,
  type PaperTrailItem,
  type TagRegistry,
} from "./schema";

const CONTENT_ROOT = path.join(process.cwd(), "content", "paper-trail");
const REGISTRY_ROOT = path.join(CONTENT_ROOT, "_registry");

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(REGISTRY_ROOT, file), "utf8")) as T;
}

export function getTagRegistry(): TagRegistry {
  return readJson<TagRegistry>("tags.json");
}

export function getEntityRegistry(): EntityRegistry {
  return readJson<EntityRegistry>("entities.json");
}

export function getAuthorRegistry(): AuthorRegistry {
  return readJson<AuthorRegistry>("authors.json");
}

export function getRetiredSlugs(): Record<string, string[]> {
  const raw = readJson<Record<string, unknown>>("retired-slugs.json");
  const out: Record<string, string[]> = {};
  for (const [year, slugs] of Object.entries(raw)) {
    if (Array.isArray(slugs)) out[year] = slugs as string[];
  }
  return out;
}

function listMarkdownFiles(): string[] {
  const entries = fs.readdirSync(CONTENT_ROOT, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === "_registry") continue;
    const dir = path.join(CONTENT_ROOT, entry.name);
    for (const name of fs.readdirSync(dir)) {
      if (name.endsWith(".md")) files.push(path.join(dir, name));
    }
  }
  return files;
}

let cached: { items: PaperTrailItem[]; errors: string[] } | null = null;

/**
 * Parses and validates every item against the merge-gate invariants
 * (build spec §2.2). Never throws — collects violations so the CI
 * script and the Next build can both report the full list at once.
 */
export function loadCollection(): { items: PaperTrailItem[]; errors: string[] } {
  if (cached) return cached;

  const tags = getTagRegistry();
  const entities = getEntityRegistry();
  const authors = getAuthorRegistry();
  const retired = getRetiredSlugs();

  const errors: string[] = [];
  const items: PaperTrailItem[] = [];
  const seenIds = new Map<string, string>();
  const seenYearSlug = new Map<string, string>();

  for (const file of listMarkdownFiles()) {
    const rel = path.relative(process.cwd(), file);
    const year = path.basename(path.dirname(file));
    const raw = fs.readFileSync(file, "utf8");
    const { data, content } = matter(raw);
    const parsed = paperTrailSchema.safeParse(data);

    if (!parsed.success) {
      const detail = parsed.error.issues
        .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
        .join("; ");
      errors.push(`${rel}: schema violation — ${detail}`);
      continue;
    }
    const fm = parsed.data;

    // Invariant 1 — every tag must resolve against the controlled vocabulary.
    for (const t of fm.tags) {
      if (!tags[t]) errors.push(`${rel}: unknown tag "${t}" — add it to _registry/tags.json`);
    }
    // Invariant 2 — every entity/author key must resolve.
    for (const e of fm.entities) {
      if (!entities[e]) errors.push(`${rel}: unknown entity "${e}" — add it to _registry/entities.json`);
    }
    for (const a of fm.authors) {
      if (!authors[a]) errors.push(`${rel}: unknown author "${a}" — add it to _registry/authors.json`);
    }

    // Invariant 3 — id is globally unique.
    if (seenIds.has(fm.id)) {
      errors.push(`${rel}: duplicate id ${fm.id}, already used by ${seenIds.get(fm.id)}`);
    } else {
      seenIds.set(fm.id, rel);
    }

    // Invariant 3 — {year}/{slug} is the composite uniqueness key, and the
    // directory an item lives in must match datePublished's year (the year
    // segment is derived from the path, not re-declared in front-matter).
    const pubYear = String(fm.datePublished.getFullYear());
    if (pubYear !== year) {
      errors.push(
        `${rel}: lives under ${year}/ but datePublished is in ${pubYear} — move it to content/paper-trail/${pubYear}/`,
      );
    }
    const yearSlugKey = `${year}/${fm.slug}`;
    if (seenYearSlug.has(yearSlugKey)) {
      errors.push(`${rel}: duplicate {year}/{slug} "${yearSlugKey}", already used by ${seenYearSlug.get(yearSlugKey)}`);
    } else {
      seenYearSlug.set(yearSlugKey, rel);
    }
    if (retired[year]?.includes(fm.slug)) {
      errors.push(`${rel}: slug "${fm.slug}" is retired for ${year} — retired slugs are never reused`);
    }

    // Invariant 3a — no future-dating a published record.
    if (fm.status === "published") {
      const in24h = Date.now() + 24 * 60 * 60 * 1000;
      if (fm.datePublished.getTime() > in24h) {
        errors.push(`${rel}: status is "published" but datePublished is more than 24h in the future`);
      }
    }

    // Invariant 6 — no silent edits: dateModified requires a corrections entry.
    if (fm.dateModified && fm.corrections.length === 0) {
      errors.push(`${rel}: dateModified is set but corrections[] is empty — every edit needs a correction entry`);
    }

    items.push({ ...fm, year, sourcePath: rel, body: content });
  }

  cached = { items, errors };
  return cached;
}

/** Throws with the full list of merge-gate violations if any item is invalid. */
export function getAllItems(): PaperTrailItem[] {
  const { items, errors } = loadCollection();
  if (errors.length > 0) {
    throw new Error(`Paper Trail merge gate failed:\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  }
  return items;
}

/** Published items, newest first. Invariant 4: this is the only list feeds/sitemaps/indexes may read from. */
export function getPublishedItems(): PaperTrailItem[] {
  return [...getAllItems()]
    .filter((i) => i.status === "published")
    .sort((a, b) => b.datePublished.getTime() - a.datePublished.getTime());
}

export function getPublishedByShelf(shelf: "release" | "finding"): PaperTrailItem[] {
  return getPublishedItems().filter((i) => i.shelf === shelf);
}

export function getPublishedByTag(tag: string): PaperTrailItem[] {
  return getPublishedItems().filter((i) => i.tags.includes(tag));
}

/**
 * Looks up an item regardless of status so preview deploys can render the
 * exact seal appearance at `status: sealed` (§6). Callers that build public
 * surfaces (index, feeds, sitemap) must go through getPublishedItems instead.
 */
export function getItem(year: string, slug: string): PaperTrailItem | undefined {
  return getAllItems().find((i) => i.year === year && i.slug === slug);
}

/** Invariant 5 — Findings with no sources are a warning, not a build failure. */
export function getFindingsWarnings(): string[] {
  return getAllItems()
    .filter((i) => i.shelf === "finding" && i.sources.length === 0)
    .map((i) => `${i.sourcePath}: Finding has status "${i.status}" and no sources[]`);
}

export function getAllTagsInUse(): string[] {
  const set = new Set<string>();
  for (const item of getPublishedItems()) {
    for (const t of item.tags) set.add(t);
  }
  return [...set];
}
