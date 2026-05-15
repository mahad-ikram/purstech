import type { Metadata } from "next";
import SitemapGeneratorClient from "./client";

export const metadata: Metadata = {
  title:       "Free XML Sitemap Generator — Smart Priority",
  description: "Generate a valid XML sitemap with smart auto-priority, bulk import, sitemap index mode and one-click Google ping. Download and submit in under 2 minutes.",
  keywords:    ["xml sitemap generator","sitemap.xml generator","create sitemap online","google sitemap tool","sitemap index generator"],
  openGraph: {
    title:       "Free XML Sitemap Generator Online | PursTech",
    description: "Generate XML sitemaps with smart priority, bulk import and Google ping. Free, no login.",
    url:         "https://www.purstech.com/tools/sitemap-generator",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free XML Sitemap Generator | PursTech",
    description: "Smart priority, bulk import, sitemap index and Google ping in one tool.",
    images:      ["/og-image.png"],
  },
  alternates: { canonical: "/tools/sitemap-generator" },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type":    "SoftwareApplication",
  name:       "XML Sitemap Generator",
  description:"Free online sitemap generator with smart priority, bulk import, sitemap index support and Google ping.",
  url:        "https://www.purstech.com/tools/sitemap-generator",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const FEATURES = [
  "Smart auto-priority based on URL depth & structure",
  "Bulk import — paste hundreds of URLs at once",
  "Sitemap index mode for large sites (50K+ URLs)",
  "One-click Google Ping to trigger crawling immediately",
  "Download as sitemap.xml ready to upload",
  "5-step deployment checklist included",
];

export default function SitemapGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />

      <SitemapGeneratorClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            SEO Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Free XML Sitemap Generator Online — Smart Priority &amp; Google Ping
          </h1>
          <p className="text-gray-400 max-w-2xl mb-5 leading-relaxed">
            A sitemap tells Google about every page on your site and how important each one is.
            Without one, new pages can take weeks to be discovered. Generate a valid XML sitemap
            with smart auto-priority, bulk URL import and a one-click Google Ping so crawling
            starts the moment you upload. No account needed, completely free.
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
      </SitemapGeneratorClient>
    </>
  );
}