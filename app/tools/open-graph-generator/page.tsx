import type { Metadata } from "next";
import OpenGraphClient from "./client";

export const metadata: Metadata = {
  title:       "Free Open Graph Tag Generator — Preview on 5 Platforms | PursTech",
  description: "Generate Open Graph and Twitter Card tags with live previews for Facebook, Twitter, LinkedIn, Discord and Slack. See exactly how your links look before sharing.",
  keywords:    ["open graph generator","og tag generator","facebook meta tags","social media preview tool","twitter card generator"],
  openGraph: {
    title:       "Free Open Graph Tag Generator | PursTech",
    description: "Generate OG tags with live previews for 5 social platforms. Free, no login.",
    url:         "https://www.purstech.com/tools/open-graph-generator",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Open Graph Generator | PursTech",
    description: "5-platform social preview: Facebook, Twitter, LinkedIn, Discord, Slack.",
    images:      ["/og-image.png"],
  },
  alternates: { canonical: "/tools/open-graph-generator" },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type":    "SoftwareApplication",
  name:       "Open Graph Tag Generator",
  description:"Free online tool to generate Open Graph and Twitter Card tags with 5-platform live preview.",
  url:        "https://www.purstech.com/tools/open-graph-generator",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const FEATURES = [
  "Live preview for Facebook & LinkedIn share cards",
  "Twitter/X summary and large-image card preview",
  "Discord and Slack link preview simulation",
  "Image dimension validator with size warnings",
  "One-click copy of all generated tags",
  "Cache-clearing debug links for all 5 platforms",
];

export default function OpenGraphPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />

      {/*
        Server-rendered hero passed as children.
        OpenGraphClient slots {children} where its old hardcoded
        badge + H1 + description was — zero visual duplication.
        This block is in the initial HTML so Google always reads it.
      */}
      <OpenGraphClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            SEO Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Free Open Graph Tag Generator — Preview on 5 Social Platforms
          </h1>
          <p className="text-gray-400 max-w-2xl mb-5 leading-relaxed">
            Open Graph tags control how your page looks when shared on social media. Without them,
            Facebook, LinkedIn, Discord and Slack make their own guess — often wrong. Generate
            perfect OG and Twitter Card tags and see a live preview on all five major platforms
            before writing a single line of code. Free, no login.
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
      </OpenGraphClient>
    </>
  );
}