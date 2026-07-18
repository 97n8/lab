import { z } from "zod";

// Front-matter schema for a Paper Trail item. See docs/paper-trail/README.md
// for the build spec this implements (§2.2). This is the interchange
// contract — Phase 2 (PJ intake) emits the same shape (§8).
export const paperTrailSchema = z.object({
  id: z.string().regex(/^PT-\d{4}-\d{3}$/),
  title: z.string().max(110),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(60),
  shelf: z.enum(["release", "finding"]),
  status: z.enum(["draft", "review", "approved", "sealed", "published"]),
  abstract: z.string().min(80).max(400),
  authors: z.array(z.string()).min(1),
  datePublished: z.coerce.date(),
  dateModified: z.coerce.date().optional(),
  version: z.string().default("1.0"),
  tags: z.array(z.string()).min(1).max(5),
  entities: z.array(z.string()).default([]),
  heroAlt: z.string().optional(),
  canonicalOverride: z.string().url().optional(),
  corrections: z
    .array(
      z.object({
        date: z.coerce.date(),
        version: z.string(),
        note: z.string().max(500),
      }),
    )
    .default([]),
  sources: z
    .array(
      z.object({
        label: z.string(),
        url: z.string().url().optional(),
      }),
    )
    .default([]),
});

export type PaperTrailFrontmatter = z.infer<typeof paperTrailSchema>;

export type PaperTrailItem = PaperTrailFrontmatter & {
  /** Year segment of the file's directory — must equal datePublished's year. */
  year: string;
  /** Path to the source markdown file, repo-relative. */
  sourcePath: string;
  /** Raw markdown body (front-matter stripped). */
  body: string;
};

export type TagRegistry = Record<string, { label: string }>;
export type EntityRegistry = Record<
  string,
  { name: string; short?: string; descriptor?: string }
>;
export type AuthorRegistry = Record<string, { name: string; jobTitle?: string }>;
