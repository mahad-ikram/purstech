import type { Metadata } from "next";
import MetaTagGeneratorClient from "./client";

export const metadata: Metadata = {
  title:       "Free Online Meta Tag Generator — SEO Meta Tags in Seconds | PursTech",
  description: "Generate perfectly optimized HTML meta tags for SEO. Get a live SEO grade, mobile & desktop SERP preview, Open Graph and Twitter Card tags in seconds. Free, no login.",
  keywords:    ["meta tag generator","seo meta tags generator","meta description generator","open graph tag generator","free meta tags tool"],
  openGraph: {
    title:       "Free Online Meta Tag Generator | PursTech",
    description: "Generate SEO meta tags with live SERP preview and SEO grading. Free, no login.",
    url:         "https://www.purstech.com/tools/meta-tag-generator",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card:    "summary_large_image",
    title:   "Free Meta Tag Generator | PursTech",
    images:  ["/og-image.png"],
  },
  alternates: { canonical: "/tools/meta-tag-generator" },
};

const SCHEMA = {
  "@context": "https://schema.org",
  "@type":    "SoftwareApplication",
  name:       "Meta Tag Generator",
  description:"Free online tool to generate SEO meta tags, Open Graph and Twitter Card tags with live SERP preview.",
  url:        "https://www.purstech.com/tools/meta-tag-generator",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      {/* ── Server-rendered hero — always in initial HTML ─────────────────────
          Google reads this before executing any JavaScript.
          This is what fixes "Crawled — currently not indexed".           ── */}
      <div className="bg-[#0A0A14]">
        <div className="max-w-5xl mx-auto px-4 pt-10 pb-2">

          <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-5 flex items-center gap-2">
            <a href="/"      className="hover:text-gray-400 transition-colors">Home</a><span>›</span>
            <a href="/tools" className="hover:text-gray-400 transition-colors">Tools</a><span>›</span>
            <span className="text-gray-400">Meta Tag Generator</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-4">
            SEO Tools
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            Free Online Meta Tag Generator — Create SEO Meta Tags Instantly
          </h1>

          <p className="text-gray-400 max-w-2xl mb-6 leading-relaxed text-base">
            Generate perfectly optimized HTML meta tags for any website in seconds. Enter your page
            title and description to get a live Google SERP preview, an A–F SEO grade with
            improvement tips, and complete Open Graph and Twitter Card code — all ready to paste
            into your site's <code className="text-cyan-400 bg-[#13131F] px-1 rounded">&lt;head&gt;</code>.
            No login, no limits, 100% free.
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-4">
            {FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-[#6C3AFF] flex-shrink-0 mt-0.5 font-bold">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interactive tool — rendered client-side */}
      <MetaTagGeneratorClient />
    </>
  );
}
