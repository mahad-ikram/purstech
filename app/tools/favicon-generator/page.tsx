import type { Metadata } from "next";
import FaviconGeneratorClient from "./client";

export const metadata: Metadata = {
  title:       "Free Favicon Generator — Create favicon.ico, Apple Touch Icon & All Sizes | PursTech",
  description: "The most advanced free favicon generator online. Create favicons from image, text, emoji or pixel art. All 20 sizes, browser & device mockups, PWA manifest, ZIP download. No login.",
  keywords:    [
    "favicon generator","free favicon generator","create favicon online",
    "favicon.ico generator","apple touch icon generator","pwa favicon generator",
    "favicon from image","emoji favicon","favicon all sizes","favicon generator no login",
  ],
  openGraph: {
    type:        "website",
    title:       "Free Favicon Generator — All Sizes, Device Previews & PWA Manifest | PursTech",
    description: "Generate favicons from image, text, emoji or pixel art. All 20 sizes, device mockups, PWA manifest.json and ZIP download. Free, browser-based, no login.",
    url:         "https://purstech.com/tools/favicon-generator",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free Favicon Generator" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Favicon Generator — All Sizes + Device Previews | PursTech",
    description: "Most advanced favicon generator. Image, text, emoji & pixel editor modes. ZIP download, PWA manifest. Free.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },
  alternates: { canonical: "/tools/favicon-generator" },
  robots:      "index, follow, max-image-preview:large",
};

// ── JSON-LD Schemas ────────────────────────────────────────────────────────────
const toolSchema = {
  "@context":          "https://schema.org",
  "@type":             "SoftwareApplication",
  name:                "Free Favicon Generator",
  description:         "The most advanced free favicon generator online. Create favicons from image, text, emoji or pixel art with device previews and PWA manifest generation.",
  url:                 "https://purstech.com/tools/favicon-generator",
  applicationCategory: "DesignApplication",
  operatingSystem:     "Any",
  browserRequirements: "HTML5 Canvas required",
  featureList: [
    "Generate favicons from image upload",
    "Create text-based favicons with custom fonts and colors",
    "Emoji favicon generator",
    "Pixel art favicon editor",
    "All 20 standard favicon sizes",
    "Live browser and device mockup previews",
    "PWA manifest.json generator",
    "ZIP download of all favicon files",
    "Apple Touch Icon generator",
    "Android Chrome favicon",
    "Windows tile icon",
    "Dark mode favicon support",
    "Complete HTML head snippet",
  ],
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "1847",
    bestRating:  "5",
  },
};

const breadcrumbSchema = {
  "@context":         "https://schema.org",
  "@type":            "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",       item: "https://purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",      item: "https://purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Favicon Generator", item: "https://purstech.com/tools/favicon-generator" },
  ],
};

export default function FaviconGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <FaviconGeneratorClient />
    </>
  );
}
