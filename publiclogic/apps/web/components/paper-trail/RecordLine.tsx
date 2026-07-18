import type { SealData } from "@/lib/paper-trail/seal";

export function RecordLine({ seal }: { seal: SealData }) {
  return (
    <p className="pt-record-line">
      {seal.id} · v{seal.version} · Published {seal.publishedLabel}
      {seal.isCorrected && (
        <>
          {" "}
          ·{" "}
          <a href="#corrections" className="pt-corrected-flag">
            Corrected —
          </a>
        </>
      )}
    </p>
  );
}
