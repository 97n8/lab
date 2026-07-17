import Image from "next/image";

export function BrandMark() {
  return (
    <Image
      className="brand-mark"
      src="/brand/publiclogic-logo.png"
      alt=""
      width={1000}
      height={387}
      priority
    />
  );
}
