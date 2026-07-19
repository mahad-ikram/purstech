import type { Metadata } from "next";
import MetaTagGeneratorClient from "./client";

export const metadata: Metadata = {
  title: "Free Meta Tag Generator — Live SERP Preview",
  description: "Generate perfectly optimized HTML meta tags for SEO. Get an SEO grade, live mobile & desktop SERP preview, Open Graph, Twitter Card tags and more — free, no login.",
  alternates: { canonical: "/tools/meta-tag-generator" },
  keywords: ["meta tag generator", "meta tags", "meta description length", "seo tags", "serp preview", "open graph tags", "title tag generator"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/meta-tag-generator",
    siteName: "PursTech",
    title: "Free Online Meta Tag Generator — Live SERP Preview & SEO Grade",
    description: "Generate SEO meta tags with live SERP preview and SEO grading. Open Graph and Twitter Card tags. Free, no login.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Meta Tag Generator — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Meta Tag Generator — Live SERP Preview",
    description: "Generate SEO meta tags, Open Graph and Twitter Card tags with live preview and SEO grade.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Meta Tag Generator", url: "https://www.purstech.com/tools/meta-tag-generator",
  description: "Free online tool to generate SEO meta tags, Open Graph and Twitter Card tags with live SERP preview, SEO grade A-F, 6 page-type templates and one-click copy.",
  applicationCategory: "WebApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "Live mobile and desktop Google SERP preview",
    "SEO grade A-F with actionable improvement tips",
    "6 page-type templates: blog, homepage, product, landing page, local business",
    "Open Graph tags for Facebook, LinkedIn and WhatsApp",
    "Twitter Card tags with card-type selector",
    "Auto-sync basic fields to Open Graph and Twitter",
    "Canonical URL field to prevent duplicate content",
    "Copy individual sections or download as .html file",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Generate SEO Meta Tags",
  description: "Use PursTech\'s free Meta Tag Generator to create perfectly optimised SEO meta tags instantly.",
  totalTime: "PT3M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Choose a template or start fresh",
      text: "Select a page-type template (Blog Post, Homepage, Product Page etc.) for a pre-filled starting point, or leave fields blank and type your own.",
      url: "https://www.purstech.com/tools/meta-tag-generator" },
    { "@type": "HowToStep", position: 2, name: "Fill in Basic SEO, Open Graph and Twitter fields",
      text: "Enter your page title and description in the Basic SEO tab — they auto-populate the Open Graph and Twitter tabs. Switch tabs to add social-specific overrides, OG image URL and Twitter handle.",
      url: "https://www.purstech.com/tools/meta-tag-generator" },
    { "@type": "HowToStep", position: 3, name: "Review the SERP preview and SEO grade",
      text: "Watch the live mobile and desktop Google SERP preview update as you type. Check your SEO grade (A-F) and follow the actionable tips to improve click-through rates.",
      url: "https://www.purstech.com/tools/meta-tag-generator" },
    { "@type": "HowToStep", position: 4, name: "Copy or download",
      text: "Click Copy All to copy the complete meta tag block, copy individual sections, or click Download .html to save the snippet file.",
      url: "https://www.purstech.com/tools/meta-tag-generator" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is the ideal meta description length?",
      acceptedAnswer: { "@type": "Answer", text: "Keep meta descriptions around 150–160 characters for desktop and front-load the first ~120 for mobile; keep titles around 50–60. The live SERP preview and the A–F grade flag overruns as you type." } },
    { "@type": "Question", name: "What are meta tags and why are they important for SEO?",
      acceptedAnswer: { "@type": "Answer", text: "Meta tags are HTML elements in the head section that provide information about your page to search engines and social platforms. The title tag and meta description are most critical — they appear directly in Google search results and heavily influence click-through rates. A well-optimized title and description can increase organic traffic by 20-30% without any change in ranking." } },
    { "@type": "Question", name: "What is the ideal length for a meta title and meta description?",
      acceptedAnswer: { "@type": "Answer", text: "Meta titles should be 50-60 characters — Google truncates anything longer in desktop results. Meta descriptions should be 150-160 characters. Our generator shows a live character count with colour-coded warnings and displays exactly how your snippet will look on both mobile and desktop Google results." } },
    { "@type": "Question", name: "What are Open Graph tags and do I need them?",
      acceptedAnswer: { "@type": "Answer", text: "Open Graph tags control how your page appears when shared on Facebook, LinkedIn, WhatsApp and other platforms — defining the title, description and preview image. Without OG tags, platforms make their own guess, often with poor results. Adding them takes under 2 minutes and dramatically improves social sharing appearance and click-through rates." } },
    { "@type": "Question", name: "What is the difference between Open Graph and Twitter Card tags?",
      acceptedAnswer: { "@type": "Answer", text: "Both control link preview appearance but for different platforms. Open Graph tags are used by Facebook, LinkedIn, WhatsApp, Discord and most platforms. Twitter Card tags are specifically for Twitter/X and override OG tags when present. You should include both sets for complete social coverage." } },
    { "@type": "Question", name: "Should I use the keywords meta tag for SEO?",
      acceptedAnswer: { "@type": "Answer", text: "No — Google officially ignores the keywords meta tag and has done so since 2009. Including it provides zero SEO benefit and may signal spam to some filters. Focus on title, description, Open Graph and Twitter Card tags instead." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",                 item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",                item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "SEO Tools",            item: "https://www.purstech.com/categories/seo" },
    { "@type": "ListItem", position: 4, name: "Meta Tag Generator",   item: "https://www.purstech.com/tools/meta-tag-generator" },
  ],
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <MetaTagGeneratorClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">SEO Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Free Online Meta Tag Generator — Create SEO Meta Tags Instantly
          </h1>
          <p className="text-gray-400 max-w-2xl mb-5 leading-relaxed">
            Generate perfectly optimised meta tags for SEO, Open Graph and Twitter Cards.
            Get a live SEO grade, mobile &amp; desktop SERP preview, and copy individual
            tags or download all at once. No login, no limits — 100% free.
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
