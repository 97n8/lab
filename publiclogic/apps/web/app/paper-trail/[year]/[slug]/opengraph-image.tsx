import { ImageResponse } from "next/og";
import { getItem, getPublishedItems } from "../../../../lib/paper-trail/collection";

export const alt = "The Paper Trail | PublicLogic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getPublishedItems().map((item) => ({ year: item.year, slug: item.slug }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ year: string; slug: string }>;
}) {
  const { year, slug } = await params;
  const item = getItem(year, slug);

  const shelfLabel = item?.shelf === "finding" ? "FINDINGS" : "RELEASE";
  const title = item?.title ?? "The Paper Trail";
  const meta = item ? `${item.id} · ${item.datePublished.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}` : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 84px",
          background: "linear-gradient(135deg, #0d2541 0%, #0d2541 72%, #1f3f49 100%)",
          color: "#f7f3ea",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              padding: "8px 18px",
              background: "#d4b66f",
              color: "#0d2541",
              fontWeight: 800,
              fontSize: 24,
              letterSpacing: 2,
            }}
          >
            {shelfLabel}
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#9fb8b2" }}>The Paper Trail</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 60, fontWeight: 800, letterSpacing: -2, lineHeight: 1.12, maxWidth: 1000 }}>
            {title}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ width: 120, height: 4, background: "#d4b66f" }} />
          <div style={{ fontSize: 26, color: "#cbe9df" }}>{meta}</div>
        </div>
      </div>
    ),
    size,
  );
}
