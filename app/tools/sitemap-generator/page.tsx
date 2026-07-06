import type { Metadata } from "next";
import SitemapGeneratorClient from "./client";

export const metadata: Metadata = {
  title: "Free XML Sitemap Generator — Smart Priority & Auto-Ping",
  description: "Generate a valid XML sitemap with smart auto-priority, bulk import, sitemap index mode and one-click Google ping. Download and submit in under 2 minutes.",
  alternates: { canonical: "/tools/sitemap-generator" },
  keywords: ["xml sitemap generator", "sitemap.xml", "sitemap generator", "submit sitemap to google", "sitemap index", "xml sitemap example"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/sitemap-generator",
    siteName: "PursTech",
    title: "Free XML Sitemap Generator Online — Smart Priority & Google Ping",
    description: "Generate XML sitemaps with smart priority, bulk import and Google ping. Free, no login.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "XML Sitemap Generator — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free XML Sitemap Generator — Smart Priority",
    description: "Smart priority, bulk import, sitemap index and Google ping in one tool. Free.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "XML Sitemap Generator",
  description: "Free online sitemap generator with smart priority, bulk import, sitemap index support and Google ping.",
  url: "https://www.purstech.com/tools/sitemap-generator",
  applicationCategory: "UtilitiesApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@id": "https://www.purstech.com/#organization" },
  featureList: [
    "Smart priority auto-configuration based on URL depth",
    "Bulk URL import mode",
    "Sitemap index generator for large websites",
    "One-click ping to Google Search Console",
    "Visual sitemap structure statistics",
    "Live XML preview and single-click download",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Generate an XML Sitemap",
  description: "Use PursTech's free XML Sitemap Generator to create, download, and submit your website's sitemap.",
  totalTime: "PT2M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Enter your domain",
      text: "Add your website domain at the top. This converts relative paths like /about into full URLs. A warning appears if you forget.",
      url: "https://www.purstech.com/tools/sitemap-generator" },
    { "@type": "HowToStep", position: 2, name: "Add your URLs",
      text: "Use the URL Builder to add pages one by one, or switch to Bulk Import to paste a list of paths all at once. Smart Priority auto-sets importance by URL depth.",
      url: "https://www.purstech.com/tools/sitemap-generator" },
    { "@type": "HowToStep", position: 3, name: "Download and upload",
      text: "Click Download to save sitemap.xml. Upload it to your website root so it is accessible at yoursite.com/sitemap.xml.",
      url: "https://www.purstech.com/tools/sitemap-generator" },
    { "@type": "HowToStep", position: 4, name: "Submit to Google",
      text: "Open Search Console, go to Sitemaps, enter your URL and submit. Then use our Ping Google button to request immediate crawling.",
      url: "https://www.purstech.com/tools/sitemap-generator" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I submit my sitemap to Google?",
      acceptedAnswer: { "@type": "Answer", text: "Open Google Search Console, go to Sitemaps, enter your sitemap URL (e.g. /sitemap.xml) and press Submit — or reference it from robots.txt with a Sitemap: line. Google retired its old ping endpoint, so Search Console is the reliable route." } },
    { "@type": "Question", name: "What is an XML sitemap and does my website need one?",
      acceptedAnswer: { "@type": "Answer", text: "An XML sitemap is a file that lists all important URLs on your website, helping search engines discover and crawl your content efficiently. Every website benefits from having one, especially new sites, large sites and content-heavy blogs." } },
    { "@type": "Question", name: "How do I submit a sitemap to Google?",
      acceptedAnswer: { "@type": "Answer", text: "Go to Google Search Console, select your property, click Sitemaps, enter your sitemap URL and click Submit. Use our Ping Google button to request immediate crawling after uploading your sitemap." } },
    { "@type": "Question", name: "What is Smart Priority and how does it work?",
      acceptedAnswer: { "@type": "Answer", text: "Smart Priority is our auto-configuration feature that sets a URL's priority value based on its depth in your site structure. Your homepage gets priority 1.0 (most important). Top-level pages like /about get 0.8. Sub-pages get 0.6." } },
    { "@type": "Question", name: "What is a sitemap index file?",
      acceptedAnswer: { "@type": "Answer", text: "A sitemap index file references multiple individual sitemap files in a single master document. Google requires this when you have more than 50,000 URLs or when your individual sitemaps exceed 50MB." } },
    { "@type": "Question", name: "How many URLs can a sitemap contain?",
      acceptedAnswer: { "@type": "Answer", text: "A single XML sitemap can contain a maximum of 50,000 URLs and must not exceed 50MB uncompressed. For larger sites, use a sitemap index file referencing multiple individual sitemaps." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",               item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",              item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "SEO Tools",          item: "https://www.purstech.com/categories/seo" },
    { "@type": "ListItem", position: 4, name: "Sitemap Generator",  item: "https://www.purstech.com/tools/sitemap-generator" },
  ],
};

export default function SitemapGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
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
        </div>
      </SitemapGeneratorClient>
    </>
  );
}
