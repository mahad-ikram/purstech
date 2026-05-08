import type { Metadata } from "next";
import MetaTagGeneratorClient from "./client";

export const metadata: Metadata = {
  title:       "Free Online Meta Tag Generator — SEO Meta Tags in Seconds | PursTech",
  description: "Generate perfectly optimized HTML meta tags for SEO. Get an SEO grade, live mobile & desktop SERP preview, Open Graph, Twitter Card tags and more — free, no login.",
  keywords:    ["meta tag generator", "seo meta tags generator", "meta description generator", "open graph tag generator", "free meta tags tool"],
  openGraph: {
    title:       "Free Online Meta Tag Generator | PursTech",
    description: "Generate SEO meta tags with live SERP preview and SEO grading. Free, no login.",
    url:         "https://www.purstech.com/tools/meta-tag-generator",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Online Meta Tag Generator | PursTech",
    description: "Generate SEO meta tags, Open Graph and Twitter Card tags with live preview.",
    images:      ["/og-image.png"],
  },
  alternates: { canonical: "/tools/meta-tag-generator" },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type":    "SoftwareApplication",
  name:       "Meta Tag Generator",
  description:"Free online tool to generate SEO meta tags, Open Graph and Twitter Card tags with live SERP preview.",
  url:        "https://www.purstech.com/tools/meta-tag-generator",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

// ── Server-rendered features list — in initial HTML for Google ────────────────
const FEATURES = [
  "Live mobile & desktop Google SERP preview",
  "SEO grade A–F with actionable improvement tips",
  "6 page-type templates (blog, product, homepage…)",
  "Open Graph tags for Facebook, LinkedIn & WhatsApp",
  "Twitter Card tags with card-type selector",
  "Canonical URL field to prevent duplicate content",
];

export default function MetaTagGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />

      {/*
        Pass the hero block as children.
        The client component renders {children} exactly where its old
        hardcoded badge + H1 + description used to be — no duplication.
        This content is server-rendered HTML so Google always reads it.
      */}
      <MetaTagGeneratorClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            SEO Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Free Online Meta Tag Generator — Create SEO Meta Tags Instantly
          </h1>
          <p className="text-gray-400 max-w-2xl mb-5 leading-relaxed">
            Generate perfectly optimised meta tags for SEO, Open Graph and Twitter Cards.
            Get a live SEO grade, mobile &amp; desktop SERP preview, and copy individual
            tags or all at once. No login, no limits — 100% free.
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
      </MetaTagGeneratorClient>
    </>
  );
}
