// app/apple-icon.tsx
// Generates the Apple Touch Icon shown when users add PursTech to their iOS home screen.
// Rendered at 180x180px with rounded corners (iOS applies them automatically).

import { ImageResponse } from "next/og";

export const size        = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width:           180,
          height:          180,
          background:      "#0A0A14",
          display:         "flex",
          flexDirection:   "column",
          alignItems:      "center",
          justifyContent:  "center",
          fontFamily:      "sans-serif",
        }}
      >
        {/* Large PT monogram */}
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            fontWeight:     900,
            fontSize:       80,
            letterSpacing:  "-4px",
            lineHeight:     1,
          }}
        >
          <span style={{ color: "#6C3AFF" }}>P</span>
          <span style={{ color: "#00D4FF" }}>T</span>
        </div>

        {/* Brand name below monogram */}
        <div
          style={{
            color:          "#ffffff",
            fontSize:       22,
            fontWeight:     700,
            letterSpacing:  "2px",
            marginTop:      8,
          }}
        >
          PursTech
        </div>
      </div>
    ),
    { ...size }
  );
}
