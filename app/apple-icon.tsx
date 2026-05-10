import { ImageResponse } from "next/og";

// Next.js App Router file convention. Generates <link rel="apple-touch-icon">
// automatically. iOS-style 180x180 raster used by some wallet UIs as the
// preferred site icon when an apple-touch-icon is present.
export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0A0A0A 0%, #1A0606 60%, #0A0A0A 100%)",
          borderRadius: 38,
          border: "5px solid #FF1A1A",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 132,
            fontWeight: 900,
            color: "#FFFFFF",
            textShadow:
              "0 0 24px rgba(255,26,26,0.95), 0 0 12px rgba(255,26,26,0.7)",
            letterSpacing: -7,
            lineHeight: 1,
            transform: "translateY(-3px)",
          }}
        >
          P
        </div>
      </div>
    ),
    { ...size },
  );
}
