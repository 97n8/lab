import { CopyButton } from "./CopyButton";

export function ShareRow({
  url,
  title,
  abstract,
  pdfUrl,
  pdfReady,
}: {
  url: string;
  title: string;
  abstract: string;
  pdfUrl: string;
  pdfReady: boolean;
}) {
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const mailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${abstract}\n\n${url}`)}`;

  return (
    <div className="pt-share-row">
      <CopyButton text={url} label="Copy link" />
      <a className="button secondary" href={linkedInHref} target="_blank" rel="noopener noreferrer">
        Share on LinkedIn
      </a>
      <a className="button secondary" href={mailHref}>
        Email
      </a>
      {pdfReady ? (
        <a className="button secondary" href={pdfUrl}>
          Download PDF
        </a>
      ) : (
        <span className="button secondary pt-pdf-pending" aria-disabled="true">
          PDF generating
        </span>
      )}
    </div>
  );
}
