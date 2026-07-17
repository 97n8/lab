"use client";

import { FormEvent, useState } from "react";

const options = [
  "Governance or program support",
  "Grants or funding",
  "Permit & Bridge",
  "Documentation or continuity",
  "Community or partner work",
  "Not sure yet",
];

export function ContactBrief({ initialWork = "" }: { initialWork?: string }) {
  const [work, setWork] = useState(initialWork);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submitBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "The brief could not be sent.");
      }

      form.reset();
      setWork("");
      setStatus("sent");
      setMessage("Thank you. Your brief is with PublicLogic. We will read it and follow up personally.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "The brief could not be sent.");
    }
  }

  return (
    <form className="contact-brief" onSubmit={submitBrief}>
      <div className="website-field" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="field-row">
        <label>Name<input name="name" required autoComplete="name" /></label>
        <label>Organization<input name="organization" autoComplete="organization" /></label>
      </div>
      <label>Email<input name="email" type="email" required autoComplete="email" /></label>
      <label>
        Where does the work sit?
        <select name="work" value={work} onChange={(event) => setWork(event.target.value)} required>
          <option value="">Choose one</option>
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>
      <label>
        What is active, stuck, scattered, or being carried by one person?
        <textarea name="situation" rows={6} required />
      </label>
      <label>Is there a date, decision, or funding window driving the timing?<input name="timing" /></label>
      <button className="button primary" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send the brief"}
      </button>
      <p className="form-note">Your brief goes directly to PublicLogic. We do not add you to a mailing list.</p>
      {message ? (
        <p className={`form-status form-status-${status}`} role="status" aria-live="polite">
          {message}
        </p>
      ) : null}
    </form>
  );
}
