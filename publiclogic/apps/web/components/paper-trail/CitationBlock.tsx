import { CopyButton } from "./CopyButton";

export function CitationBlock({ citation }: { citation: string }) {
  return (
    <div className="pt-citation">
      <h2>Cite this record</h2>
      <p className="pt-citation-text">{citation}</p>
      <CopyButton text={citation} label="Copy citation" />
    </div>
  );
}
