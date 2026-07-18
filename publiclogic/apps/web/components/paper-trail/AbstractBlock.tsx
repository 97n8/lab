import { CopyButton } from "./CopyButton";

export function AbstractBlock({ text }: { text: string }) {
  return (
    <div className="pt-abstract">
      <p>{text}</p>
      <CopyButton text={text} label="Copy abstract" />
    </div>
  );
}
