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
  month: string; // "Jul"
  gross: number;
}

export interface TransactionsResult {
  reservations: Reservation[];
  totals: Totals;
  monthly: MonthlyRevenue[];
  live: boolean;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

/** Airbnb writes MM/DD/YYYY; we store ISO so it sorts and formats predictably. */
function toIso(mdy: string): string {
  const [m, d, y] = mdy.split("/").map(Number);
  if (!m || !d || !y) return mdy;
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

const num = (v: string | undefined) => Number(v || 0) || 0;

function toReservation(row: Record<string, string>): Reservation | null {
  if ((row["Type"] || "").trim() !== "Reservation") return null;
  const start = row["Start date"];
  if (!start) return null;
  return {
    guest: row["Guest"] || "Guest",
    code: row["Confirmation code"] || "",
    start: toIso(start),
    end: toIso(row["End date"] || start),
    booked: toIso(row["Booking date"] || start),
    nights: num(row["Nights"]),
    amount: num(row["Amount"]),
    fee: num(row["Service fee"]),
    gross: num(row["Gross earnings"]),
    pet: num(row["Pet fee"]),
    clean: num(row["Cleaning fee"]),
    tax: num(row["Airbnb remitted tax"]),
  };
}

export function parseTransactionsCsv(text: string): Omit<TransactionsResult, "live"> {
  const rows = parseCsv(text.trim());
  const [header, ...body] = rows;
  const reservations = body
    .map((cells) => {
      const record: Record<string, string> = {};
      header.forEach((key, i) => (record[key.trim()] = (cells[i] ?? "").trim()));
      return toReservation(record);
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
    const month = MONTHS[Number(r.start.slice(5, 7)) - 1];
    byMonth.set(month, (byMonth.get(month) ?? 0) + r.gross);
  }
  const monthly: MonthlyRevenue[] = MONTHS.filter((m) => byMonth.has(m)).map((m) => ({
    month: m,
    gross: Math.round(byMonth.get(m)!),
  }));

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
