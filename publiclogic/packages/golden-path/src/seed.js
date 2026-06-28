// Seed types and deterministic derivation. No AI — just parse what the seed
// string already tells us. The user confirms/edits afterward (GP-001 rule).

export const SEED_TYPES = [
  { type: "website", label: "Website", placeholder: "kendallpond.com" },
  { type: "domain", label: "Domain", placeholder: "example.org" },
  { type: "airbnb", label: "Airbnb listing", placeholder: "airbnb.com/rooms/12345" },
  { type: "drive", label: "Google Drive folder", placeholder: "drive.google.com/… or folder name" },
  { type: "github", label: "GitHub repo", placeholder: "github.com/owner/repo" },
  { type: "gbp", label: "Google Business", placeholder: "Business name" },
  { type: "logo", label: "Logo / brand", placeholder: "Brand name" },
  { type: "pdf", label: "PDF", placeholder: "operating-agreement.pdf" },
  { type: "document", label: "Existing document", placeholder: "Document title" },
  { type: "scratch", label: "Start from scratch", placeholder: "Name your operation" },
];

// djb2 — tiny synchronous hash that works in both Node and the browser.
export function shortHash(input) {
  let h = 5381;
  const s = String(input);
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36).slice(0, 6).padStart(6, "0");
}

function titleCase(s) {
  return s
    .replace(/[-_.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function hostLabel(url) {
  const clean = String(url).replace(/^[a-z]+:\/\//i, "").replace(/^www\./i, "");
  const host = clean.split(/[/?#]/)[0];
  const parts = host.split(".");
  return { host, label: parts.length > 1 ? parts[parts.length - 2] : parts[0], tld: parts[parts.length - 1] };
}

/** Derive a display name + signal facts from a raw seed (deterministic). */
export function deriveSeed(seedType, value) {
  const v = String(value || "").trim();
  const out = {
    name: "",
    aliases: [],
    website: "",
    connected_tools: [],
    lane_guess: null,
    confidence: "low",
  };

  switch (seedType) {
    case "website":
    case "domain": {
      const { host, label, tld } = hostLabel(v || "");
      out.name = label ? titleCase(label) : "Untitled";
      out.website = host ? `https://${host}` : "";
      out.connected_tools = ["Website"];
      out.confidence = host ? "high" : "low";
      if (tld === "gov" || tld === "us") out.lane_guess = "MUNI";
      break;
    }
    case "airbnb": {
      const m = v.match(/rooms\/(\d+)/i) || v.match(/\/h\/([a-z0-9-]+)/i);
      const id = m ? m[1] : "";
      out.name = id ? (/^\d+$/.test(id) ? `Airbnb Listing ${id}` : titleCase(id)) : "Airbnb Listing";
      out.connected_tools = ["Airbnb", "iCal"];
      out.lane_guess = "STAY";
      out.confidence = "high";
      break;
    }
    case "github": {
      const m = v.replace(/^[a-z]+:\/\//i, "").match(/github\.com\/([^/]+)\/([^/?#]+)/i) || v.match(/^([^/]+)\/([^/?#]+)/);
      if (m) {
        out.name = titleCase(m[2]);
        out.aliases = [m[1]];
      } else out.name = v ? titleCase(v) : "Repository";
      out.connected_tools = ["GitHub"];
      out.lane_guess = "BIZ";
      out.confidence = "high";
      break;
    }
    case "drive": {
      const m = v.match(/folders\/([a-z0-9_-]+)/i);
      out.name = m ? "Drive Folder" : v ? titleCase(v) : "Drive Folder";
      out.connected_tools = ["Google Drive"];
      out.confidence = v ? "medium" : "low";
      break;
    }
    case "gbp": {
      out.name = v ? titleCase(v) : "Business";
      out.connected_tools = ["Google Business Profile"];
      out.confidence = v ? "medium" : "low";
      break;
    }
    case "pdf":
    case "document": {
      out.name = v ? titleCase(v.replace(/\.[a-z0-9]+$/i, "")) : "Document";
      out.confidence = v ? "medium" : "low";
      break;
    }
    case "logo": {
      out.name = v ? titleCase(v) : "Brand";
      out.confidence = v ? "medium" : "low";
      break;
    }
    case "scratch":
    default: {
      out.name = v ? titleCase(v) : "New Operation";
      out.confidence = "low";
      break;
    }
  }
  return out;
}
