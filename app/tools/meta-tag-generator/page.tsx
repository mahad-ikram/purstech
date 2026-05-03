import type { Metadata } from "next";
import MetaTagGeneratorClient from "./client";

export const metadata: Metadata = {
  title:       "Free Online Meta Tag Generator — SEO Meta Tags in Seconds | PursTech",
  description: "Generate perfectly optimized HTML meta tags for SEO. Get an SEO grade, live mobile & desktop SERP preview, Open Graph, Twitter Card tags and more — free, no login.",
  keywords:    ["meta tag generator", "seo meta tags generator", "meta description generator", "open graph tag generator", "free meta tags tool"],
  openGraph: {
    title:       "Free Online Meta Tag Generator | PursTech",
    description: "Generate SEO meta tags with live SERP preview and SEO grading. Free, no login required.",
    url:         "https://purstech.com/tools/meta-tag-generator",
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
  url:        "https://purstech.com/tools/meta-tag-generator",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function MetaTagGeneratorPage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <MetaTagGeneratorClient />
    </>
  );
}
