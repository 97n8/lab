#!/usr/bin/env node
// PDF export for The Paper Trail (build spec §7). Runs as a post-build CI
// step, not the main build — Playwright prints the dedicated /print route
// for every published item. Retains prior-version PDFs alongside the
// current pointer file, per the spec's "the trail keeps its footprints."
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { chromium } from "playwright";

const BASE_URL = process.env.PAPER_TRAIL_BASE_URL || "http://localhost:3000";
const CONTENT_ROOT = path.join(process.cwd(), "content", "paper-trail");
const OUT_ROOT = path.join(process.cwd(), "public", "paper-trail", "pdf");

function listPublishedItems() {
  const years = fs
    .readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== "_registry")
    .map((d) => d.name);

  const items = [];
  for (const year of years) {
    const dir = path.join(CONTENT_ROOT, year);
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith(".md")) continue;
      const { data } = matter(fs.readFileSync(path.join(dir, name), "utf8"));
      if (data.status === "published") {
        items.push({ year, slug: data.slug, id: data.id, version: data.version ?? "1.0" });
      }
    }
  }
  return items;
}

async function main() {
  const items = listPublishedItems();
  if (items.length === 0) {
    console.log("No published Paper Trail items — nothing to render.");
    return;
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const item of items) {
    const url = `${BASE_URL}/paper-trail/${item.year}/${item.slug}/print`;
    console.log(`Rendering ${url}`);
    await page.goto(url, { waitUntil: "networkidle" });

    const footerTemplate = `
      <div style="font-size:8px; width:100%; text-align:center; color:#5d6a70; padding:0 0.5in;">
        ${item.id} · v${item.version} · publiclogic.org ·
        <span class="pageNumber"></span> of <span class="totalPages"></span>
      </div>`;

    const outDir = path.join(OUT_ROOT, item.year);
    fs.mkdirSync(outDir, { recursive: true });

    const buffer = await page.pdf({
      format: "Letter",
      margin: { top: "1in", bottom: "0.75in", left: "1in", right: "1in" },
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate,
      printBackground: true,
    });

    // The current pointer, always at the item's canonical .pdf path...
    fs.writeFileSync(path.join(outDir, `${item.slug}.pdf`), buffer);
    // ...and a version-pinned copy so a version bump doesn't erase the last one.
    fs.writeFileSync(path.join(outDir, `${item.slug}-v${item.version}.pdf`), buffer);
    console.log(`Wrote ${item.year}/${item.slug}.pdf (v${item.version})`);
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
