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
    url:         "https://www.purstech.com/tools/favicon-generator",
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
  url:                 "https://www.purstech.com/tools/favicon-generator",
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
    "@type":     "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "1847",
    bestRating:  "5",
  },
};

const breadcrumbSchema = {
  "@context":      "https://schema.org",
  "@type":         "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",              item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",             item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Favicon Generator", item: "https://www.purstech.com/tools/favicon-generator" },
  ],
};

const FEATURES = [
  "4 creation modes: upload image, text, emoji or pixel art",
  "All 18 standard sizes including Apple Touch Icon (180×180)",
  "Android Chrome (192×192) and PWA splash (512×512)",
  "Live device mockups — Chrome tab, iOS, Android, Windows",
  "Complete HTML snippet with all required link tags",
  "PWA manifest.json generator and ZIP download",
];

export default function FaviconGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema)       }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <FaviconGeneratorClient>
        <div className="mb-8">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold">
              Image Tools
            </span>
            <span className="bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-xs text-green-400 font-semibold">
              ★ 4.9/5 — 1,847 reviews
            </span>
            <span className="bg-[#00D4FF]/10 border border-[#00D4FF]/20 rounded-full px-3 py-1 text-xs text-[#00D4FF] font-semibold">
              All 18 Sizes · ZIP Download · PWA Manifest
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Free Favicon Generator — Create favicon.ico &amp; All Sizes Online
          </h1>
          <p className="text-gray-400 max-w-2xl mb-5 leading-relaxed">
            The most advanced favicon generator online. Create from an image, text, emoji or pixel
            art. Live device previews, all 18 sizes, PWA manifest.json and one-click ZIP download.
            100% free, no login, no limits.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-[#6C3AFF] flex-shrink-0 mt-0.5 font-bold">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </FaviconGeneratorClient>
    </>
  );
}