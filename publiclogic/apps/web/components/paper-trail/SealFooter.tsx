import type { SealData } from "@/lib/paper-trail/seal";

export function SealFooter({ seal }: { seal: SealData }) {
  return (
    <footer className="pt-seal-footer">
      <p className="pt-seal-label">Version of record as published by PublicLogic LLC</p>
      <p className="pt-seal-meta">
        {seal.id} · v{seal.version} · {seal.publishedLabel}
      </p>
    </footer>
  );
}
