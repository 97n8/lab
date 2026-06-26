// Minimal, dependency-free iCalendar (RFC 5545) reader scoped to what the
// Airbnb host calendar export actually emits: VEVENTs with DTSTART/DTEND/UID/
// SUMMARY/DESCRIPTION. It is deliberately small and deterministic so all-day
// (VALUE=DATE) handling is exact — we read the raw YYYYMMDD token rather than
// routing through a Date object, which avoids timezone drift on the
// exclusive-end checkout date.

/** Unfold RFC 5545 line folding: continuation lines start with a space or tab. */
function unfold(text) {
  const raw = text.replace(/\r\n/g, "\n").split("\n");
  const lines = [];
  for (const line of raw) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && lines.length) {
      lines[lines.length - 1] += line.slice(1);
    } else {
      lines.push(line);
    }
  }
  return lines;
}

function unescapeText(v) {
  return v
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

/** Parse an iCal date or date-time value into a `YYYY-MM-DD` string. */
export function parseICSDate(value) {
  const v = String(value).trim();
  const digits = v.replace(/[^0-9]/g, "");
  if (digits.length < 8) return null;
  const y = digits.slice(0, 4);
  const m = digits.slice(4, 6);
  const d = digits.slice(6, 8);
  return `${y}-${m}-${d}`;
}

/**
 * Parse VEVENTs out of an iCal string.
 * @returns {Array<{uid,summary,description,start,end,allDay,rawStart,rawEnd}>}
 */
export function parseICS(text) {
  const lines = unfold(text || "");
  const events = [];
  let cur = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "BEGIN:VEVENT") {
      cur = {};
      continue;
    }
    if (trimmed === "END:VEVENT") {
      if (cur) events.push(finalize(cur));
      cur = null;
      continue;
    }
    if (!cur) continue;

    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const left = line.slice(0, idx);
    const value = line.slice(idx + 1);
    const name = left.split(";")[0].toUpperCase();

    switch (name) {
      case "UID":
        cur.uid = value.trim();
        break;
      case "SUMMARY":
        cur.summary = unescapeText(value.trim());
        break;
      case "DESCRIPTION":
        cur.description = unescapeText(value.trim());
        break;
      case "DTSTART":
        cur.rawStart = value.trim();
        break;
      case "DTEND":
        cur.rawEnd = value.trim();
        break;
      default:
        break;
    }
  }
  return events;
}

function finalize(ev) {
  const start = parseICSDate(ev.rawStart);
  const end = parseICSDate(ev.rawEnd);
  const allDay = !!ev.rawStart && !/[T]/.test(ev.rawStart || "");
  // Fall back to a stable synthetic UID if the feed omits one.
  const uid =
    ev.uid || `${start || "?"}_${end || "?"}_${(ev.summary || "event").replace(/\s+/g, "-")}`;
  return {
    uid,
    summary: ev.summary || "",
    description: ev.description || "",
    start, // check-in date (event start)
    end, // checkout date (event end) — used as-is, NOT decremented
    allDay,
    rawStart: ev.rawStart || "",
    rawEnd: ev.rawEnd || "",
  };
}
