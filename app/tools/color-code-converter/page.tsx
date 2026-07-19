import type { Metadata } from "next";
import ColorCodeConverterClient from "./client";

// ─── Metadata ─────────────────────────────────────────────────────────────────
// QA fixes:
//  ✅ openGraph.url changed to www
//  ✅ robots added
//  ✅ OG title cleaned (removed "| PursTech" — template adds it)
//  ✅ WebApplication schema added (moved + fixed from client.tsx)
//  ✅ HowTo schema added (4 steps matching client How to Use section)
//  ✅ FAQPage schema added (5 questions matching client FAQ)
//  ✅ BreadcrumbList schema added

export const metadata: Metadata = {
  // Renders: "Free Color Code Converter — HEX, RGB, HSL | PursTech" (53 chars ✅)
  title: "Free Color Code Converter — HEX to RGB, HSL & CMYK",

  description:
    "Convert color codes between HEX, RGB, RGBA, HSL, HSLA, HSV and CMYK instantly. Generate tints, shades, color schemes and check WCAG contrast ratios. Free, no login.",

  keywords: ["hex to rgb", "rgb to hex", "color code converter", "hex to hsl", "rgb to cmyk", "color converter", "css color variables", "hsl to hex"],

  alternates: { canonical: "/tools/color-code-converter" },

  openGraph: {
    title:       "Free Color Code Converter — HEX, RGB, HSL, CMYK & Color Schemes",
    description: "Convert between all color formats. Generate tints, shades, color schemes and check WCAG accessibility contrast. Free.",
    url:         "https://www.purstech.com/tools/color-code-converter", // ✅ www
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Color Code Converter — PursTech" }],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "Free Color Code Converter — HEX, RGB, HSL, CMYK",
    description: "Convert colors between all formats. Tints, shades, color schemes and WCAG checker. Free.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },

  robots: { // ✅ Added
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

// ─── WebApplication schema ─────────────────────────────────────────────────────
// ✅ Moved from client.tsx (where crawlers couldn't see it)
// ✅ SoftwareApplication → WebApplication
// ✅ URL changed to www

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Color Code Converter",
  url:  "https://www.purstech.com/tools/color-code-converter",
  description: "Free color code converter supporting HEX, RGB, RGBA, HSL, HSLA, HSV, CMYK. Generates tints, shades, color schemes and WCAG contrast ratios.",
  applicationCategory: "DeveloperApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "HEX, RGB, RGBA, HSL, HSLA, HSV, CMYK conversion",
    "Interactive HSL sliders and native color picker",
    "CSS custom property (variable) output",
    "Tints and shades palette generator",
    "Complementary, analogous, triadic and split-complementary color schemes",
    "WCAG 2.1 AA and AAA contrast checker",
    "Named CSS colors browser (140+ colors)",
  ],
};

// ─── HowTo schema ─────────────────────────────────────────────────────────────
// 4 steps — matches the 4-step How to Use section in client.tsx

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Convert Color Codes Online",
  description: "Use PursTech's free Color Code Converter to convert between HEX, RGB, HSL, CMYK and more.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Pick or enter a color",
      text: "Click the color picker or type any HEX code directly. All format conversions (RGB, HSL, CMYK etc.) update instantly.",
      url: "https://www.purstech.com/tools/color-code-converter" },
    { "@type": "HowToStep", position: 2, name: "Copy in any format",
      text: "Hover over any format row and click Copy to grab the value. Use the CSS variable format for design system tokens.",
      url: "https://www.purstech.com/tools/color-code-converter" },
    { "@type": "HowToStep", position: 3, name: "Generate tints and shades",
      text: "Click any swatch in the tints or shades row to update the main color and build a complete scale for your design system.",
      url: "https://www.purstech.com/tools/color-code-converter" },
    { "@type": "HowToStep", position: 4, name: "Check WCAG accessibility",
      text: "The WCAG contrast checker shows whether your color meets AA or AAA accessibility standards for text on white or black backgrounds.",
      url: "https://www.purstech.com/tools/color-code-converter" },
  ],
};

// ─── FAQPage schema ───────────────────────────────────────────────────────────
// ✅ Must be server-rendered — moved from client.tsx
// 5 questions matching the FAQ array in client.tsx

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I convert HEX to RGB?",
      acceptedAnswer: { "@type": "Answer", text: "Split the hex code into pairs and convert each to decimal: #FF6600 gives FF=255, 66=102, 00=0, so rgb(255, 102, 0). Or paste any value here — all seven formats (HEX, RGB, RGBA, HSL, HSLA, HSV, CMYK) update live with copy-ready CSS." } },
    { "@type": "Question", name: "What is the difference between HEX, RGB and HSL color formats?",
      acceptedAnswer: { "@type": "Answer", text: "HEX (#RRGGBB) represents colors as hexadecimal values for red, green and blue channels. RGB uses decimal values from 0–255 for each channel and is more readable. HSL (Hue, Saturation, Lightness) represents color as its hue angle (0–360°), saturation (0–100%) and lightness (0–100%). HSL is the most intuitive for humans because adjusting saturation or lightness doesn't require understanding RGB arithmetic." } },
    { "@type": "Question", name: "What is the difference between HSL and HSV?",
      acceptedAnswer: { "@type": "Answer", text: "Both use Hue and Saturation, but differ in the third component. HSL uses Lightness — 50% is a pure color, 0% is black and 100% is white. HSV uses Value (Brightness) — 100% is a pure color and 0% is black. HSL is preferred for CSS. HSV is more common in image editing tools like Photoshop." } },
    { "@type": "Question", name: "What is CMYK and when should I use it?",
      acceptedAnswer: { "@type": "Answer", text: "CMYK (Cyan, Magenta, Yellow, Key/Black) is a subtractive color model used in color printing. Use CMYK for anything physically printed — business cards, brochures, packaging. Web and screen designs use RGB. Note that CMYK has a smaller gamut, so some bright screen colors cannot be perfectly reproduced in print." } },
    { "@type": "Question", name: "What is WCAG contrast ratio and why does it matter for accessibility?",
      acceptedAnswer: { "@type": "Answer", text: "WCAG contrast ratio measures how distinct a text color is from its background, on a scale of 1:1 to 21:1. WCAG 2.1 requires: Level AA — at least 4.5:1 for normal text and 3:1 for large text. Level AAA — at least 7:1 for normal text. Poor contrast makes text illegible for people with low vision or color blindness." } },
    { "@type": "Question", name: "What are tints and shades, and how are they generated?",
      acceptedAnswer: { "@type": "Answer", text: "A tint is a color mixed with white — increasing HSL lightness toward 100%. A shade is a color mixed with black — decreasing lightness toward 0%. The tool generates 10 tints and 10 shades by incrementally adjusting HSL lightness, giving you a complete palette suitable for design systems and CSS variable sets." } },
  ],
};

// ─── BreadcrumbList schema ────────────────────────────────────────────────────

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",                  item: "https://www.purstech.com"                                  },
    { "@type": "ListItem", position: 2, name: "Tools",                 item: "https://www.purstech.com/tools"                            },
    { "@type": "ListItem", position: 3, name: "Dev Tools",             item: "https://www.purstech.com/categories/dev"                   },
    { "@type": "ListItem", position: 4, name: "Color Code Converter",  item: "https://www.purstech.com/tools/color-code-converter"       },
  ],
};

export default function ColorCodeConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <ColorCodeConverterClient />
    </>
  );
}
