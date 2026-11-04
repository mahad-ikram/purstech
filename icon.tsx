// app/icon.tsx
// Next.js App Router generates /favicon.ico AND /icon.png from this file automatically.
// No binary favicon.ico needed — Next.js handles it.
// Docs: nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons

import { ImageResponse } from "next/og";

export const size        = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width:           32,
          height:          32,
          background:      "#0A0A14",
          borderRadius:    7,
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          fontFamily:      "sans-serif",
          fontWeight:      900,
          fontSize:        17,
          letterSpacing:   "-1px",
        }}
      >
        {/* "P" in violet, "T" in cyan — PursTech brand mark */}
        <span style={{ color: "#6C3AFF" }}>P</span>
        <span style={{ color: "#00D4FF", marginLeft: -1 }}>T</span>
      </div>
    ),
    { ...size }
  );
}
