import { NextResponse } from "next/server";

type ContactSubmission = {
  name?: unknown;
  organization?: unknown;
  email?: unknown;
  work?: unknown;
  situation?: unknown;
  timing?: unknown;
  website?: unknown;
};

const LIMITS = {
  name: 120,
  organization: 180,
  email: 254,
  work: 120,
  situation: 5000,
  timing: 500,
} as const;

const GOOGLE_FORM = {
  action:
    "https://docs.google.com/forms/d/e/1FAIpQLSey-WdJsIdronvWB3-S9lxWcTdrPcxxOLaHAY0fa-SLS0yxvg/formResponse",
  fields: {
    name: "entry.155851080",
    email: "entry.1677054972",
    inquiryType: "entry.922668788",
    summary: "entry.1896712449",
    urgency: "entry.918283958",
  },
} as const;

function readField(
  submission: ContactSubmission,
  field: keyof typeof LIMITS,
  required = false,
) {
  const value = submission[field];
  if (typeof value !== "string") {
    if (required) throw new Error(`Missing ${field}`);
    return "";
  }

  const normalized = value.trim();
  if (required && !normalized) throw new Error(`Missing ${field}`);
  if (normalized.length > LIMITS[field]) throw new Error(`${field} is too long`);
  return normalized;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let submission: ContactSubmission;

  try {
    submission = (await request.json()) as ContactSubmission;
  } catch {
    return NextResponse.json({ error: "The brief could not be read." }, { status: 400 });
  }

  if (typeof submission.website === "string" && submission.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  let brief: {
    name: string;
    organization: string;
    email: string;
    work: string;
    situation: string;
    timing: string;
  };

  try {
    brief = {
      name: readField(submission, "name", true),
      organization: readField(submission, "organization"),
      email: readField(submission, "email", true),
      work: readField(submission, "work", true),
      situation: readField(submission, "situation", true),
      timing: readField(submission, "timing"),
    };
  } catch {
    return NextResponse.json(
      { error: "Please complete the required fields and try again." },
      { status: 400 },
    );
  }

  if (!isValidEmail(brief.email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const receivedAt = new Date().toISOString();
  const summary = [
    `Organization: ${brief.organization || "Not provided"}`,
    `Area: ${brief.work}`,
    `Timing: ${brief.timing || "Not provided"}`,
    `Received: ${receivedAt}`,
    "",
    "What is active, stuck, scattered, or being carried by one person?",
    brief.situation,
  ].join("\n");

  const body = new URLSearchParams({
    [GOOGLE_FORM.fields.name]: brief.name,
    [GOOGLE_FORM.fields.email]: brief.email,
    [GOOGLE_FORM.fields.inquiryType]: "General Inquiry",
    [GOOGLE_FORM.fields.summary]: summary,
    [GOOGLE_FORM.fields.urgency]: "3",
  });

  try {
    const googleResponse = await fetch(GOOGLE_FORM.action, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body,
      cache: "no-store",
    });

    if (!googleResponse.ok) {
      console.error(`Google Forms returned ${googleResponse.status} for contact intake.`);
      return NextResponse.json(
        { error: "The brief could not be delivered. Please email hello@publiclogic.org." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Google Forms contact intake failed.", error);
    return NextResponse.json(
      { error: "The brief could not be delivered. Please email hello@publiclogic.org." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
