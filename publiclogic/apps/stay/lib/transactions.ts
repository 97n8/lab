// Financial figures come from a *second*, separate Airbnb export: the host
// Transaction History CSV (Earnings -> Transaction History -> Export CSV).
// Unlike the iCal feed, this report carries the guest's name and every dollar
// figure — but only for stays that have actually posted a payout, so it is
// not a substitute for the operational (iCal-derived) dashboard in ./dashboard.ts.

import { promises as fs } from "node:fs";
import path from "node:path";

// See lib/dashboard.ts for why this is process.cwd()-based rather than
// import.meta.url-based (Next.js bundles server modules into .next/).
// apps/stay -> apps -> publiclogic
const LIVE_PATH = path.resolve(process.cwd(), "..", "..", "data", "kpl", "transactions.csv");
const SAMPLE_PATH = path.resolve(process.cwd(), "data", "sample-transactions.csv");

export interface Reservation {
  guest: string;
  code: string;
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
  booked: string; // YYYY-MM-DD
  nights: number;
  amount: number; // net payout
  fee: number; // Airbnb service fee
  gross: number; // gross earnings
  pet: number;
  clean: number;
  tax: number;
}

export interface Totals {
  count: number;
  nights: number;
  gross: number;
  net: number;
  fee: number;
  pet: number;
  clean: number;
  tax: number;
  avgNightly: number;
}

export interface MonthlyRevenue {
  month: string; // "Jul 2026"
  gross: number;
}

export interface TransactionsResult {
  reservations: Reservation[];
  totals: Totals;
  monthly: MonthlyRevenue[];
  live: boolean;
}

const REQUIRED_HEADERS = [
  "Type",
  "Confirmation code",
  "Booking date",
  "Start date",
  "End date",
  "Nights",
  "Guest",
  "Currency",
  "Amount",
  "Service fee",
  "Cleaning fee",
  "Pet fee",
  "Gross earnings",
  "Airbnb remitted tax",
] as const;

/** RFC 4180-ish parse: handles quoted fields, escaped quotes, and commas inside quotes. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

/** Airbnb writes MM/DD/YYYY; retain ISO input for easier fixture authoring. */
function toIso(value: string, column: string, rowNumber: number): string {
  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) ??
    value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    throw new Error(`Invalid ${column} date "${value}" on CSV row ${rowNumber}.`);
  }

  const isoInput = value.includes("-");
  const y = Number(match[isoInput ? 1 : 3]);
  const m = Number(match[isoInput ? 2 : 1]);
  const d = Number(match[isoInput ? 3 : 2]);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) {
    throw new Error(`Invalid ${column} date "${value}" on CSV row ${rowNumber}.`);
  }
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function num(value: string | undefined, column: string, rowNumber: number): number {
  if (!value?.trim()) return 0;
  const trimmed = value.trim();
  const parenthesized = trimmed.startsWith("(") && trimmed.endsWith(")");
  const normalized = trimmed.replace(/[,$\s]/g, "").replace(/[()]/g, "");
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${column} value "${value}" on CSV row ${rowNumber}.`);
  }
  return parenthesized ? -parsed : parsed;
}

function toReservation(row: Record<string, string>, rowNumber: number): Reservation | null {
  if ((row["Type"] || "").trim() !== "Reservation") return null;
  const start = row["Start date"];
  if (!start) {
    throw new Error(`Missing Start date on CSV row ${rowNumber}.`);
  }
  const currency = row["Currency"]?.trim();
  if (currency && currency !== "USD") {
    throw new Error(`Unsupported currency "${currency}" on CSV row ${rowNumber}; STAY currently reports USD.`);
  }
  const code = row["Confirmation code"]?.trim();
  if (!code) {
    throw new Error(`Missing Confirmation code on CSV row ${rowNumber}.`);
  }
  return {
    guest: row["Guest"] || "Guest",
    code,
    start: toIso(start, "Start date", rowNumber),
    end: toIso(row["End date"] || start, "End date", rowNumber),
    booked: toIso(row["Booking date"] || start, "Booking date", rowNumber),
    nights: num(row["Nights"], "Nights", rowNumber),
    amount: num(row["Amount"], "Amount", rowNumber),
    fee: Math.abs(num(row["Service fee"], "Service fee", rowNumber)),
    gross: num(row["Gross earnings"], "Gross earnings", rowNumber),
    pet: num(row["Pet fee"], "Pet fee", rowNumber),
    clean: num(row["Cleaning fee"], "Cleaning fee", rowNumber),
    tax: num(row["Airbnb remitted tax"], "Airbnb remitted tax", rowNumber),
  };
}

export function parseTransactionsCsv(text: string): Omit<TransactionsResult, "live"> {
  const rows = parseCsv(text.trim().replace(/^\uFEFF/, ""));
  if (rows.length === 0) {
    throw new Error("The Airbnb transaction export is empty.");
  }
  const [header, ...body] = rows;
  const normalizedHeader = header.map((key) => key.trim());
  const missing = REQUIRED_HEADERS.filter((key) => !normalizedHeader.includes(key));
  if (missing.length > 0) {
    throw new Error(`Airbnb transaction export is missing required columns: ${missing.join(", ")}.`);
  }
  const reservations = body
    .map((cells, bodyIndex) => {
      const record: Record<string, string> = {};
      normalizedHeader.forEach((key, i) => (record[key] = (cells[i] ?? "").trim()));
      return toReservation(record, bodyIndex + 2);
    })
    .filter((r): r is Reservation => r !== null)
    .sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));

  const sum = (key: keyof Reservation) => reservations.reduce((t, r) => t + (r[key] as number), 0);
  const nights = sum("nights");
  const gross = sum("gross");
  const totals: Totals = {
    count: reservations.length,
    nights,
    gross,
    net: sum("amount"),
    fee: sum("fee"),
    pet: sum("pet"),
    clean: sum("clean"),
    tax: sum("tax"),
    avgNightly: nights > 0 ? gross / nights : 0,
  };

  const byMonth = new Map<string, number>();
  for (const r of reservations) {
    const month = r.start.slice(0, 7);
    byMonth.set(month, (byMonth.get(month) ?? 0) + r.gross);
  }
  const monthly: MonthlyRevenue[] = [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, monthGross]) => {
      const [year, monthNumber] = month.split("-").map(Number);
      return {
        month: new Date(Date.UTC(year, monthNumber - 1, 1)).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        }),
        gross: Math.round(monthGross),
      };
    });

  return { reservations, totals, monthly };
}

export async function loadTransactions(): Promise<TransactionsResult> {
  try {
    const raw = await fs.readFile(LIVE_PATH, "utf8");
    return { ...parseTransactionsCsv(raw), live: true };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    const raw = await fs.readFile(SAMPLE_PATH, "utf8");
    return { ...parseTransactionsCsv(raw), live: false };
  }
}
