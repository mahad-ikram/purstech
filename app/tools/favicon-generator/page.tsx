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

export const FAVICON_FAQ = [
  {
    q: "What is a favicon and why does my website need one?",
    a: "A favicon (short for 'favorites icon') is the small icon that appears in browser tabs, bookmarks, home screen shortcuts and search results. Without a favicon, browsers display a generic page icon — making your site look unfinished and less trustworthy. A well-designed favicon improves brand recognition, makes your site easier to find in crowded tab bars and is required for Progressive Web App (PWA) compliance. Google also displays favicons next to results in mobile search, making them a subtle but impactful SEO element.",
  },
  {
    q: "What favicon sizes do I actually need in 2025?",
    a: "The essential sizes are: 16×16 and 32×32 for browser tabs, 180×180 for Apple Touch Icon (iPhone and iPad home screen), 192×192 for Android Chrome and PWA, and 512×512 for PWA splash screens. For complete coverage including Windows tiles and legacy support, generate all sizes — our tool creates all 20 standard sizes simultaneously. Always include the SVG version for the sharpest display on high-DPI screens.",
  },
  {
    q: "How do I add a favicon to my website?",
    a: "After downloading your favicon files, upload them to your website's root directory (the same folder as your index.html or homepage). Then paste the HTML code snippet from our generator into the <head> section of every page — or into your layout.tsx if using Next.js, or header.php if using WordPress. The snippet includes tags for all sizes including Apple Touch Icon and PWA icons. Verify it works by visiting yoursite.com/favicon.ico in a browser.",
  },
  {
    q: "What is a PWA web manifest and do I need one?",
    a: "A Progressive Web App (PWA) manifest is a JSON file that tells browsers how to display your site when installed as a home screen app. It defines the app name, theme color, background color and which icon sizes to use. Without a manifest, your site cannot be installed as a PWA on Android devices. Our generator creates a complete manifest.json automatically — just download it alongside your favicon files and link it in your HTML head.",
  },
  {
    q: "What image makes the best favicon?",
    a: "The best favicons are bold, simple and instantly recognisable at 16×16 pixels. Use just the icon or logomark portion of your logo — not the full horizontal logo with text. Single-letter monograms, geometric shapes and simple symbols all work excellently. Avoid fine lines, gradients with subtle transitions and text smaller than the favicon size. Test your result in our Chrome tab and iOS mockup previews before downloading — what looks great at 512px may be illegible at 16px.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type":    "FAQPage",
  mainEntity: FAVICON_FAQ.map(f => ({
    "@type": "Question",
    name:    f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaviconGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema)       }} />
      <FaviconGeneratorClient />
    </>
  );
}
