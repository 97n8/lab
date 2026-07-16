import { ImageResponse } from "next/og";

export const alt = "PublicLogic | Systems That Stick";
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
          background: "linear-gradient(135deg, #062f2b 0%, #00453e 60%, #00534a 100%)",
          color: "#f7f3ea",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "#f7f3ea",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "#00453e" }} />
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -2 }}>PublicLogic</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05 }}>
            Systems That Stick
          </div>
          <div style={{ fontSize: 34, color: "#c59b4b", fontWeight: 600 }}>
            Traceable in. Immutable out.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#9fb8b2" }}>
          Continuity • Data • Stewardship — publiclogic.org
        </div>
      </div>
    ),
    size,
  );
}
