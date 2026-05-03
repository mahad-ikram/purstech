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

export const META_TAG_FAQ = [
  {
    q: "What are meta tags and why are they important for SEO?",
    a: "Meta tags are HTML elements in the <head> section that provide information about your page to search engines and social platforms. The title tag and meta description are most critical — they appear directly in Google search results and heavily influence click-through rates. A well-optimized title and description can increase organic traffic by 20–30% without any change in ranking.",
  },
  {
    q: "What is the ideal length for a meta title and meta description?",
    a: "Meta titles should be 50–60 characters — Google truncates anything longer in desktop results. Meta descriptions should be 150–160 characters. Our generator shows a live character count with colour-coded warnings and displays exactly how your snippet will look on both mobile and desktop Google results.",
  },
  {
    q: "What are Open Graph tags and do I need them?",
    a: "Open Graph tags control how your page appears when shared on Facebook, LinkedIn, WhatsApp and other platforms — defining the title, description and preview image. Without OG tags, platforms make their own guess, often with poor results. Adding them takes under 2 minutes and dramatically improves social sharing appearance and click-through rates.",
  },
  {
    q: "What is the difference between Open Graph and Twitter Card tags?",
    a: "Both control link preview appearance but for different platforms. Open Graph tags are used by Facebook, LinkedIn, WhatsApp, Discord and most platforms. Twitter Card tags are specifically for Twitter/X and override OG tags when present. You should include both sets for complete social coverage — our generator creates both simultaneously.",
  },
  {
    q: "Should I use the keywords meta tag for SEO?",
    a: "No — Google officially ignores the keywords meta tag and has done so since 2009. Including it provides zero SEO benefit and may signal spam to some filters. Focus on title, description, Open Graph and Twitter Card tags instead. The tags that actually matter are exactly what our generator produces.",
  },
];

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

const faqSchema = {
  "@context": "https://schema.org",
  "@type":    "FAQPage",
  mainEntity: META_TAG_FAQ.map(f => ({
    "@type": "Question",
    name:    f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function MetaTagGeneratorPage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <MetaTagGeneratorClient />
    </>
  );
}
