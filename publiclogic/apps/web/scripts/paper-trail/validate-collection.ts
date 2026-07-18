// CI entry point for the merge-gate invariants in lib/paper-trail/collection.ts
// (build spec §2.2 / §6). Run via `npm run pt:validate` (npx tsx).
import { getFindingsWarnings, loadCollection } from "../../lib/paper-trail/collection";

const { errors } = loadCollection();

if (errors.length > 0) {
  console.error(`\nPaper Trail schema/merge-gate check FAILED — ${errors.length} problem(s):\n`);
  errors.forEach((e) => console.error(`  x ${e}`));
  process.exit(1);
}

const warnings = getFindingsWarnings();
if (warnings.length > 0) {
  console.log(`Paper Trail: ${warnings.length} warning(s) (non-blocking):`);
  warnings.forEach((w) => console.log(`  ! ${w}`));
}

console.log("Paper Trail schema/merge-gate check passed.");
