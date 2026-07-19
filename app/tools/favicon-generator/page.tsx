import type { Metadata } from "next";
import FaviconGeneratorClient from "./client";

// ─── Metadata ─────────────────────────────────────────────────────────────────
// QA fixes:
//  ✅ robots changed from string → object
//  ✅ OG title cleaned — removed "| PursTech" (was double-branding)
//  ✅ Twitter title cleaned — same fix
//  ✅ Description made consistent — "18 sizes" throughout (was "20" in desc, "18" in title)

export const metadata: Metadata = {
  // Renders: "Free Favicon Generator — All 18 Sizes | PursTech" (49 chars ✅)
  title: "Free Favicon Generator & ICO Editor — All 18 Sizes",

  description:
    "The most advanced free favicon generator online. Create favicons from image, text, emoji or pixel art. All 18 sizes, browser & device mockups, PWA manifest, ZIP download. No login.",

  keywords: ["favicon generator","ico editor","favicon size","make favicon","icon generator","png to ico","emoji favicon","how to make a favicon","favicon checker","apple touch icon"],

  alternates: { canonical: "/tools/favicon-generator" },

  openGraph: {
    type:        "website",
    url:         "https://www.purstech.com/tools/favicon-generator",
    siteName:    "PursTech",
    // ✅ Cleaned: was "... | PursTech" → would double-brand with layout template
    title:       "Free Favicon Generator — All Sizes, Device Previews & PWA Manifest",
    description: "Generate favicons from image, text, emoji or pixel art. All 18 sizes, device mockups, PWA manifest.json and ZIP download. Free, browser-based, no login.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free Favicon Generator — PursTech" }],
  },

  twitter: {
    card:    "summary_large_image",
    // ✅ Cleaned: was "... | PursTech"
    title:       "Free Favicon Generator — All Sizes + Device Previews",
    description: "Most advanced favicon generator. Image, text, emoji & pixel editor modes. ZIP download, PWA manifest. Free.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },

  // ✅ Fixed: was a string "index, follow, max-image-preview:large"
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

// ─── WebApplication schema ─────────────────────────────────────────────────────
// ✅ Changed SoftwareApplication → WebApplication
// ✅ REMOVED AggregateRating — fake reviews (ratingValue:4.9, reviewCount:1847)
//    are a Google structured data policy VIOLATION → could trigger manual action.
//    Only add AggregateRating if you have real verified user reviews.

const APP_SCHEMA = {
  "@context":          "https://schema.org",
  "@type":             "WebApplication",        // ✅ was SoftwareApplication
  name:                "Free Favicon Generator",
  description:         "The most advanced free favicon generator online. Create favicons from image, text, emoji or pixel art with device previews and PWA manifest generation.",
  url:                 "https://www.purstech.com/tools/favicon-generator",
  applicationCategory: "DesignApplication",
  operatingSystem:     "Any",
  browserRequirements: "HTML5 Canvas required",
  inLanguage:          "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "Generate favicons from image upload",
    "Create text-based favicons with custom fonts and colors",
    "Emoji favicon generator",
    "Pixel art favicon editor (16×16 grid)",
    "All 18 standard favicon sizes including 16×16 to 512×512",
    "Live browser and device mockup previews",
    "PWA manifest.json generator",
    "ZIP download of all favicon files",
    "Apple Touch Icon (180×180), Android Chrome (192×192), PWA splash (512×512)",
    "Complete HTML head snippet",
  ],
};

// ─── HowTo schema ─────────────────────────────────────────────────────────────
// ✅ Added — 3 steps matching the actual tool workflow

const HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@type":    "HowTo",
  name:       "How to Create a Favicon Online",
  description:"Use PursTech's free Favicon Generator to create a favicon for your website in seconds.",
  totalTime:  "PT3M",
  step: [
    { "@type": "HowToStep", position: 1,
      name:    "Choose your favicon source",
      text:    "Select one of four creation modes: Upload an existing image or logo, create a text/letter monogram, pick an emoji, or draw custom pixel art on the 16×16 grid.",
      url:     "https://www.purstech.com/tools/favicon-generator" },
    { "@type": "HowToStep", position: 2,
      name:    "Customise shape and background",
      text:    "Choose a shape (square, rounded or circle), set a solid colour or gradient background, and adjust padding to your preference.",
      url:     "https://www.purstech.com/tools/favicon-generator" },
    { "@type": "HowToStep", position: 3,
      name:    "Generate, preview and download",
      text:    "Click Generate. All 18 sizes are created instantly. Preview in live browser and device mockups, then download as a ZIP including all PNG files, the HTML snippet and a PWA manifest.json.",
      url:     "https://www.purstech.com/tools/favicon-generator" },
  ],
};

// ─── FAQPage schema ───────────────────────────────────────────────────────────
// ✅ Moved here from client.tsx — must be server-rendered for crawlers

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type":    "FAQPage",
  mainEntity: [
    { "@type": "Question",
      name: "What size should a favicon be?",
      acceptedAnswer: { "@type": "Answer", text: "The classic favicon.ico contains 16x16, 32x32 and 48x48 pixels; modern sites also need 180x180 (Apple Touch Icon), 192x192 (Android Chrome) and 512x512 (PWA). This generator exports all 18 standard sizes in one ZIP, with the exact HTML head snippet to paste in." } },
    { "@type": "Question",
      name: "How do I make a favicon?",
      acceptedAnswer: { "@type": "Answer", text: "Upload any image, type text or an emoji, or draw one pixel-by-pixel in the built-in ICO editor — then hit Generate and download a ZIP containing every standard size plus the ready-made HTML code. No design software needed." } },
    { "@type": "Question",
      name:    "What is a favicon and why does my website need one?",
      acceptedAnswer: { "@type": "Answer", text: "A favicon (short for 'favorites icon') is the small icon that appears in browser tabs, bookmarks, home screen shortcuts and search results. Without a favicon, browsers display a generic page icon — making your site look unfinished and less trustworthy. Google also displays favicons next to results in mobile search, making them a subtle but impactful SEO element." } },
    { "@type": "Question",
      name:    "What favicon sizes do I actually need in 2025?",
      acceptedAnswer: { "@type": "Answer", text: "The essential sizes are: 16×16 and 32×32 for browser tabs, 180×180 for Apple Touch Icon (iPhone and iPad home screen), 192×192 for Android Chrome and PWA, and 512×512 for PWA splash screens. Our tool creates all 18 standard sizes simultaneously." } },
    { "@type": "Question",
      name:    "How do I add a favicon to my website?",
      acceptedAnswer: { "@type": "Answer", text: "After downloading your favicon files, upload them to your website's root directory. Then paste the HTML code snippet from our generator into the head section of every page — or into your layout.tsx if using Next.js, or header.php if using WordPress." } },
    { "@type": "Question",
      name:    "What is a PWA web manifest and do I need one?",
      acceptedAnswer: { "@type": "Answer", text: "A Progressive Web App (PWA) manifest is a JSON file that tells browsers how to display your site when installed as a home screen app. Without a manifest, your site cannot be installed as a PWA on Android devices. Our generator creates a complete manifest.json automatically." } },
    { "@type": "Question",
      name:    "What image makes the best favicon?",
      acceptedAnswer: { "@type": "Answer", text: "The best favicons are bold, simple and instantly recognisable at 16×16 pixels. Use just the icon or logomark portion of your logo — not the full horizontal logo with text. Single-letter monograms, geometric shapes and simple symbols all work excellently." } },
  ],
};

// ─── BreadcrumbList schema ────────────────────────────────────────────────────
// ✅ Added missing /categories/image step

const BREADCRUMB_SCHEMA = {
  "@context":      "https://schema.org",
  "@type":         "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",              item: "https://www.purstech.com"                              },
    { "@type": "ListItem", position: 2, name: "Tools",             item: "https://www.purstech.com/tools"                        },
    { "@type": "ListItem", position: 3, name: "Image Tools",       item: "https://www.purstech.com/categories/image"             },
    { "@type": "ListItem", position: 4, name: "Favicon Generator", item: "https://www.purstech.com/tools/favicon-generator"      },
  ],
};

// ─── Features (for hero bullet list) ─────────────────────────────────────────
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />

      <FaviconGeneratorClient>
        {/* Hero — server-rendered for SEO, injected into client as children */}
        <div className="mb-8">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold">
              Image Tools
            </span>
            <span className="bg-[#00D4FF]/10 border border-[#00D4FF]/20 rounded-full px-3 py-1 text-xs text-[#00D4FF] font-semibold">
              All 18 Sizes · ZIP Download · PWA Manifest
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
Favicon Generator — ICO Editor, Emoji &amp; All 18 Sizes
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
