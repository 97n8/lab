// JSON / JSONL storage under <repo>/data/kpl. Path is resolved relative to this
// file (not cwd) so the commands work from any directory, and is overridable via
// KPL_DATA_DIR (used by tests to write into a temp dir).
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
// src -> kpl-casespace -> packages -> publiclogic
export const DEFAULT_DATA_DIR = path.resolve(here, "..", "..", "..", "data", "kpl");

export function dataDir(env = process.env) {
  return env.KPL_DATA_DIR ? path.resolve(env.KPL_DATA_DIR) : DEFAULT_DATA_DIR;
}

export const fileNames = {
  cases: "cases.json",
  dashboard: "dashboard.json",
  log: "sync-log.jsonl",
};

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

export async function readJSON(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return fallback;
    throw err;
  }
}

export async function writeJSON(filePath, value) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

export async function appendJSONL(filePath, value) {
  await ensureDir(path.dirname(filePath));
  await fs.appendFile(filePath, JSON.stringify(value) + "\n", "utf8");
}

export async function loadCases(dir) {
  return readJSON(path.join(dir, fileNames.cases), []);
}

export async function saveCases(dir, cases) {
  await writeJSON(path.join(dir, fileNames.cases), cases);
}

export async function saveDashboard(dir, dashboard) {
  await writeJSON(path.join(dir, fileNames.dashboard), dashboard);
}

export async function appendLog(dir, entry) {
  await appendJSONL(path.join(dir, fileNames.log), entry);
}
