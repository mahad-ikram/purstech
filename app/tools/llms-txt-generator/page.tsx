import type { Metadata } from "next";
import LlmsTxtGeneratorClient from "./client";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Free llms.txt Generator — Make Your Site AI-Ready | PursTech",
  description: "Free llms.txt generator — create a spec-compliant llms.txt file in seconds so AI assistants like ChatGPT, Claude and Perplexity can read and cite your site. No login.",
  alternates: { canonical: "/tools/llms-txt-generator" },
  keywords: [
    "llms.txt generator", "llms txt generator", "llms.txt file generator", "generate llms.txt",
    "free llms.txt generator", "llms.txt", "llms.txt example", "llms.txt format", "ai readiness",
  ],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/llms-txt-generator",
    siteName: "PursTech",
    title: "Free llms.txt Generator — Make Your Site AI-Ready",
    description: "Create a spec-compliant llms.txt file in seconds so AI assistants can read and cite your site. Free, browser-based, no login.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free llms.txt Generator — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free llms.txt Generator — PursTech",
    description: "Generate a spec-compliant llms.txt so AI assistants can read your site. Free, no login.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

// ─── JSON-LD schemas ──────────────────────────────────────────────────────────

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  name: "llms.txt Generator", url: "https://www.purstech.com/tools/llms-txt-generator",
  description: "Free tool to generate a spec-compliant llms.txt file that makes your website readable by AI assistants and browsing agents.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "Spec-compliant llms.txt output (llmstxt.org markdown-link format)",
    "Add unlimited sections and links",
    "Live preview as you type",
    "One-click copy and file download",
    "Load a ready-made example template",
    "100% browser-based — your data never leaves your device",
    "No login or signup required",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Create an llms.txt File",
  description: "Generate a spec-compliant llms.txt file for your website so AI assistants can read and cite it.",
  totalTime: "PT2M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Enter your site details",
      text: "Add your site name and a one-line summary describing what your site does.",
      url: "https://www.purstech.com/tools/llms-txt-generator" },
    { "@type": "HowToStep", position: 2, name: "Add your key pages",
      text: "Create sections such as Docs, Guides or Products and add the important pages you want AI assistants to know about, each with a short note.",
      url: "https://www.purstech.com/tools/llms-txt-generator" },
    { "@type": "HowToStep", position: 3, name: "Copy or download",
      text: "Copy the generated llms.txt or download the file. Everything runs in your browser — nothing is uploaded.",
      url: "https://www.purstech.com/tools/llms-txt-generator" },
    { "@type": "HowToStep", position: 4, name: "Upload to your site root",
      text: "Place llms.txt at the root of your domain (yoursite.com/llms.txt), the same location as robots.txt.",
      url: "https://www.purstech.com/tools/llms-txt-generator" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is an llms.txt file?",
      acceptedAnswer: { "@type": "Answer", text: "llms.txt is a plain-text file placed at your site root (yoursite.com/llms.txt) that lists your key pages in a simple Markdown format so AI assistants and browsing agents can quickly understand and cite your site. It was proposed by Jeremy Howard in 2024 and is inspired by robots.txt and sitemap.xml." } },
    { "@type": "Question", name: "Where do I put the llms.txt file?",
      acceptedAnswer: { "@type": "Answer", text: "Upload it to the root of your domain so it is reachable at https://yoursite.com/llms.txt — the same location as robots.txt. On most frameworks you drop it in your public or static folder." } },
    { "@type": "Question", name: "Does llms.txt help SEO or Google rankings?",
      acceptedAnswer: { "@type": "Answer", text: "No. Google has confirmed llms.txt is not used for Search or AI Overviews rankings. Its purpose is agentic readiness — helping AI assistants and browsing agents read and cite your content accurately. Treat it as documentation for AI, not an SEO ranking signal." } },
    { "@type": "Question", name: "What format should an llms.txt file use?",
      acceptedAnswer: { "@type": "Answer", text: "An H1 title, an optional one-line summary in a blockquote, an optional description paragraph, then H2 sections that each contain a Markdown list of links in the form - [Page name](url): short note. This tool generates that exact format automatically." } },
    { "@type": "Question", name: "Do AI assistants actually read llms.txt?",
      acceptedAnswer: { "@type": "Answer", text: "Adoption is early but growing. Some AI tools and crawlers look for llms.txt today and others do not yet. Because it is a tiny static file with no downside, many sites add it now to be ready as adoption increases." } },
    { "@type": "Question", name: "Is this llms.txt generator free?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no login. Everything runs in your browser, so your site details are never uploaded to a server." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",               item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",              item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "SEO Tools",          item: "https://www.purstech.com/categories/seo" },
    { "@type": "ListItem", position: 4, name: "llms.txt Generator", item: "https://www.purstech.com/tools/llms-txt-generator" },
  ],
};

export default function LlmsTxtGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <LlmsTxtGeneratorClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">SEO Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Free llms.txt Generator — Make Your Site AI-Ready
          </h1>
          <p className="text-gray-400 max-w-2xl mb-5 leading-relaxed">
            Create a spec-compliant <code className="text-[#6C3AFF] font-mono">llms.txt</code> file in seconds so AI
            assistants like ChatGPT, Claude and Perplexity can read, understand and cite your site. Add your key
            pages, preview live, then copy or download. Free, browser-based, no login required.
          </p>
        </div>
      </LlmsTxtGeneratorClient>
    </>
  );
}
