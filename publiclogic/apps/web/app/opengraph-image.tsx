import { ImageResponse } from "next/og";

export const alt = "PublicLogic | Make the Work Hold Together";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 0,
              background: "#d4b66f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 0, background: "#0d2541" }} />
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -2 }}>PublicLogic</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05 }}>
            Make the work hold together.
          </div>
          <div style={{ fontSize: 34, color: "#c59b4b", fontWeight: 600 }}>
            Systems for continuity.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#9fb8b2" }}>
          Governance · Grants · Permitting · Documentation · Continuity
        </div>
      </div>
    ),
    size,
  );
}
