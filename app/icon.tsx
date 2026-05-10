import { ImageResponse } from "next/og";

// Next.js App Router file convention. Generates <link rel="icon"> automatically
// and is rendered to PNG at build time. Phantom and other Solana wallets read
// this icon when displaying the connect / signature prompt.
export const runtime = "edge";
export const size = { width: 256, height: 256 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 56,
          border: "6px solid #FF1A1A",
          boxShadow: "0 0 0 1px rgba(255,26,26,0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 188,
            fontWeight: 900,
            color: "#FFFFFF",
            textShadow:
              "0 0 32px rgba(255,26,26,0.95), 0 0 16px rgba(255,26,26,0.7)",
            letterSpacing: -10,
            lineHeight: 1,
            transform: "translateY(-4px)",
          }}
        >
          P
        </div>
      </div>
    ),
    { ...size },
  );
}
