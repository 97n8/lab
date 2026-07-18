import type { PaperTrailItem } from "@/lib/paper-trail/schema";

export function CorrectionsLog({ corrections }: { corrections: PaperTrailItem["corrections"] }) {
  if (corrections.length === 0) return null;

  return (
    <section id="corrections" className="pt-corrections">
      <h2>Corrections log</h2>
      <ul>
        {corrections.map((c, i) => (
          <li key={i}>
            <span className="pt-correction-date">
              {c.date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
            <span className="pt-correction-version">v{c.version}</span>
            <span className="pt-correction-note">{c.note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
