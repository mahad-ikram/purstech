import type { Metadata } from "next";
import ColorCodeConverterClient from "./client";

export const metadata: Metadata = {
  title:       "Free Color Code Converter — HEX, RGB, HSL, CMYK, HSV & WCAG | PursTech",
  description: "Convert color codes between HEX, RGB, RGBA, HSL, HSLA, HSV and CMYK instantly. Generate tints, shades, color schemes and check WCAG contrast ratios. Free, no login.",
  keywords:    ["color code converter","hex to rgb","rgb to hex","hex to hsl","color converter online","hsl rgb hex converter","cmyk to rgb"],
  openGraph: {
    title:       "Free Color Code Converter — HEX, RGB, HSL, CMYK & Schemes | PursTech",
    description: "Convert between all color formats. Generate tints, shades, color schemes and WCAG contrast checker. Free.",
    url:         "https://purstech.com/tools/color-code-converter",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Free Color Code Converter | PursTech", images: ["/og-image.png"] },
  alternates: { canonical: "/tools/color-code-converter" },
};

export default function ColorCodeConverterPage() {
  return <ColorCodeConverterClient />;
}
