"use client";

import { useMemo, useState } from "react";
import { SEED_TYPES, compileSeed, PIPELINE } from "@publiclogic/golden-path";

export function SeedCompiler() {
  const [seedType, setSeedType] = useState("airbnb");
  const [value, setValue] = useState("airbnb.com/rooms/12345");

  const active = SEED_TYPES.find((s) => s.type === seedType) ?? SEED_TYPES[0];
  const result = useMemo(() => compileSeed({ type: seedType, value }), [seedType, value]);
  const sp = result.source_profile as Record<string, unknown>;
  const laneGuess = sp.lane_guess as string | null;
  const confidence = String(sp.confidence);

  return (
    <div className="seed-wrap">
      {/* Seed input — answers one question: what are we building around? */}
      <div className="panel seed-input">
        <p className="eyebrow">What are we building around?</p>
        <h2>Drop one seed.</h2>
        <div className="seed-types">
          {SEED_TYPES.map((s) => (
            <button
              key={s.type}
              className={s.type === seedType ? "seed-chip seed-chip-on" : "seed-chip"}
              onClick={() => {
                setSeedType(s.type);
                if (s.type === "scratch") setValue("");
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <input
          className="seed-field"
          value={value}
          placeholder={active.placeholder}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Seed value"
        />
        <p className="seed-hint">
          No AI. The compiler reads what the seed already tells it — you confirm and edit.
        </p>
      </div>

      {/* The first real automation: a deterministic pipeline */}
      <div className="flow-chips seed-pipeline">
        {PIPELINE.map((step, i) => (
          <span key={step} className="chip">
            {step}
            {i < PIPELINE.length - 1 ? <span className="chip-arrow" aria-hidden="true">→</span> : null}
          </span>
        ))}
      </div>

      {/* Four governed objects */}
      <div className="obj-grid">
        <div className="panel obj">
          <div className="obj-head">
            <h3>1 · Source Profile</h3>
            <code>{String(sp.id)}</code>
          </div>
          <div className="fact-list">
            <Fact k="Name" v={String(sp.name)} />
            {String(sp.website) ? <Fact k="Website" v={String(sp.website)} /> : null}
            {(sp.aliases as string[]).length ? <Fact k="Aliases" v={(sp.aliases as string[]).join(", ")} /> : null}
            <Fact k="Connected tools" v={(sp.connected_tools as string[]).join(", ") || "—"} />
            <Fact k="Source" v={(sp.source_links as string[])[0] ?? "—"} />
          </div>
          <div className="obj-tags">
            <span className={`tag ${confidence === "high" ? "tag-green" : confidence === "low" ? "tag-red" : "tag-gold"}`}>
              confidence: {confidence}
            </span>
            <span className={`tag ${laneGuess ? "tag-gold" : ""}`}>
              lane guess: {laneGuess ?? "unknown"}
            </span>
          </div>
          <p className="obj-note">Lane is a recommendation — confirmed when FORM opens (GP-002).</p>
        </div>

        <div className="panel obj">
          <div className="obj-head">
            <h3>2 · Asset Set</h3>
            <code>{result.asset_set.id}</code>
          </div>
          <p className="obj-sub">The things this operation owns or operates. Empty buckets — the lane guess suggests a few.</p>
          <div className="flow-chips">
            {result.asset_set.types.map((t) => (
              <span key={t.type} className={t.suggested ? "chip chip-suggested" : "chip"}>
                {t.type}
              </span>
            ))}
          </div>
        </div>

        <div className="panel obj">
          <div className="obj-head">
            <h3>3 · Document Set</h3>
            <code>{result.document_set.id}</code>
          </div>
          <p className="obj-sub">A housed document structure, created immediately.</p>
          <div className="flow-chips">
            {result.document_set.folders.map((f) => (
              <span key={f.folder} className="chip">{f.folder}</span>
            ))}
          </div>
        </div>

        <div className="panel obj obj-dark">
          <div className="obj-head">
            <h3>4 · Starter CaseSpace</h3>
            <code className="code-dark">{result.casespace.id}</code>
          </div>
          <p className="obj-sub obj-sub-dark">Not a project, not a client — the permanent shell everything grows from.</p>
          <div className="flow-chips">
            {result.casespace.tabs.map((t) => (
              <span key={t} className="chip chip-dark">{t}</span>
            ))}
          </div>
          <p className="obj-note obj-note-dark">Attaches to {result.casespace.source_profile_id}.</p>
        </div>
      </div>

      <p className="attach-rule">
        <strong>Attach rule:</strong> everything in the runtime must attach to a Source Profile,
        an Asset, a Document, or a CaseSpace. If it can’t, it isn’t part of the runtime.
      </p>
    </div>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="fact">
      <span className="fact-k">{k}</span>
      <span className="fact-v">{v}</span>
    </div>
  );
}
