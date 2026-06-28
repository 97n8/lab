"use client";

import { useState } from "react";
import {
  buildPacket,
  verifyPacket,
  hashCanonical,
  type Packet,
  type Verdict,
} from "@publiclogic/golden-path";

type Rec = { seq: number; at: string | null; kind: string; event: string; by: string; ref: string | null };

const shortRoot = (h?: string) => (h ? h.slice(0, 16) + "…" + h.slice(-8) : "—");

/**
 * The seal — proof made visible. Unsealed → Sealed · verified → Verification
 * failed. The verdict comes entirely from verifyPacket re-deriving hashes
 * offline; the failed state shows the sealed receipt hash vs. the hash
 * recomputed from the altered bytes, so it's the packet catching the change,
 * not the UI noticing an edit. Lane-agnostic: STAY and MUNI use the same panel.
 */
export function SealVerify({
  records,
  caseRef,
  closedBy,
  tamperIndex = 3,
  unsealedLines = ["Recordstream open.", "Events are still accumulating."],
  onSealedChange,
}: {
  records: Rec[];
  caseRef: Record<string, unknown>;
  closedBy: string;
  tamperIndex?: number;
  unsealedLines?: string[];
  onSealedChange?: (sealed: boolean) => void;
}) {
  const [packet, setPacket] = useState<Packet | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [tampered, setTampered] = useState(false);
  const [proof, setProof] = useState<{ seq: number; sealed: string; recomputed: string } | null>(null);

  const sealed = packet !== null;
  const setSealed = (p: Packet | null) => {
    setPacket(p);
    onSealedChange?.(p !== null);
  };

  async function seal() {
    const p = await buildPacket(caseRef, records, { closed_at: nowIso(), closed_by: closedBy });
    setSealed(p);
    setVerdict(await verifyPacket(p));
    setTampered(false);
    setProof(null);
  }

  // The sealed packet is frozen, so a tamper must produce a NEW packet that
  // verifyPacket re-derives and rejects.
  async function tamper() {
    if (!packet) return;
    const target = Math.min(tamperIndex, packet.items.length - 1);
    const next: Packet = {
      ...packet,
      items: packet.items.map((it, i) =>
        i === target ? { ...it, record: { ...it.record, event: it.record.event + " (edited)" } } : it,
      ),
    };
    const recomputed = await hashCanonical(next.items[target].record);
    setProof({ seq: next.items[target].seq, sealed: packet.items[target].receipt.object_hash, recomputed });
    setPacket(next);
    setVerdict(await verifyPacket(next));
    setTampered(true);
  }

  function reset() {
    setSealed(null);
    setVerdict(null);
    setTampered(false);
    setProof(null);
  }

  const failedItem =
    packet && verdict && !verdict.ok
      ? packet.items.find((it) => verdict.failures.some((f) => f.includes(`seq ${it.seq}`)))
      : undefined;

  return (
    <div className={`panel seal-panel${sealed ? (verdict?.ok ? " seal-ok" : " seal-fail") : ""}`}>
      <div className="section-head">
        <h3>Seal &amp; verify</h3>
        <span className="pill-soft">
          {!sealed ? "Unsealed" : verdict?.ok ? "Sealed · verified" : "Verification failed"}
        </span>
      </div>

      {!sealed && (
        <div className="seal-body">
          <p className="seal-line">
            <strong>{records.length} events captured</strong>
            {unsealedLines.map((l) => (
              <span key={l}>
                <br />
                {l}
              </span>
            ))}
          </p>
          <button className="button primary" onClick={seal}>Seal recordstream</button>
        </div>
      )}

      {sealed && (
        <div className="seal-body">
          <dl className="seal-grid">
            <div><dt>Events sealed</dt><dd>{packet!.case_receipt.record_count}</dd></div>
            <div><dt>CaseReceipt</dt><dd>committed</dd></div>
            <div><dt>Merkle root</dt><dd><code>{shortRoot(packet!.case_receipt.merkle_root)}</code></dd></div>
            <div><dt>Canonical form</dt><dd><code>{packet!.canonical_form_version}</code></dd></div>
          </dl>

          {verdict?.ok ? (
            <p className="seal-verdict ok">
              <strong>Offline packet verified</strong> — no PublicLogic server in the loop.
            </p>
          ) : (
            <div className="seal-verdict fail">
              <p><strong>Verification failed</strong></p>
              {failedItem && (
                <p className="seal-failed-item">
                  Record #{String(failedItem.seq).padStart(3, "0")} no longer matches its sealed receipt.
                </p>
              )}
              <p className="seal-detail-label">Failure detail:</p>
              <ul className="seal-failures">{verdict?.failures.map((f) => <li key={f}>{f}</li>)}</ul>

              {proof && (
                <dl className="seal-proof">
                  <div><dt>Sealed receipt (record #{String(proof.seq).padStart(3, "0")})</dt><dd><code>{proof.sealed}</code></dd></div>
                  <div><dt>Recomputed from current bytes</dt><dd><code className="hash-bad">{proof.recomputed}</code></dd></div>
                  <p className="seal-proof-note">Two different hashes — re-derived offline. The seal exposes the change without trusting the editor or a server.</p>
                </dl>
              )}
            </div>
          )}

          <div className="rs-actions">
            {!tampered && verdict?.ok && (
              <button className="button secondary" onClick={tamper}>Tamper with record #{String(Math.min(tamperIndex, records.length - 1) + 1).padStart(3, "0")}</button>
            )}
            <button className="button secondary" onClick={reset}>Reset</button>
          </div>
        </div>
      )}
    </div>
  );
}

function nowIso() {
  return new Date().toISOString();
}
