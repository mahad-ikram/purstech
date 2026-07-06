import type { Metadata } from "next";
import HTMLMinifierClient from "./client";

export const metadata: Metadata = {
  // Renders: "Free HTML Minifier Online | PursTech" (36 chars ✅)
  title: "Free HTML Minifier — Compress HTML Online",

  description:
    "Minify HTML online to reduce page size and improve load speed. Remove comments, collapse whitespace and optional tags. Free HTML minifier with configurable options. No login.",

  alternates: { canonical: "/tools/html-minifier" },

  keywords: ["html minifier", "minify html", "compress html", "html compressor", "reduce html size", "remove html comments"],

  openGraph: {
    type:        "website",
    url:         "https://www.purstech.com/tools/html-minifier",
    siteName:    "PursTech",
    title:       "Free HTML Minifier Online — Reduce Page Size Instantly",
    description: "Remove HTML comments, collapse whitespace and optional tags. Configurable options, shows size savings. Free, no login.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "HTML Minifier — PursTech" }],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "Free HTML Minifier Online",
    description: "Minify HTML instantly — remove comments, collapse whitespace, configurable options. Free, no login.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },

  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "HTML Minifier", url: "https://www.purstech.com/tools/html-minifier",
  description: "Free online HTML minifier. Remove comments, collapse whitespace and optional closing tags. Shows original size, minified size and savings percentage.",
  applicationCategory: "DeveloperApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@id": "https://www.purstech.com/#organization" },
  featureList: [
    "Remove HTML comments (<!-- -->)",
    "Collapse whitespace and newlines",
    "Remove optional closing tags (li, p, td etc.)",
    "Configurable — enable/disable each option independently",
    "Shows original size, minified size and savings percentage",
    "Download minified HTML as .html file",
    "Load sample HTML for demonstration",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Minify HTML Online",
  description: "Use PursTech's free HTML Minifier to reduce HTML file size instantly.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Set Your Options",
      text: "Choose which minification steps to apply. Remove Comments and Collapse Whitespace are safe for all HTML. Remove Optional Tags is more aggressive and should be tested.",
      url: "https://www.purstech.com/tools/html-minifier" },
    { "@type": "HowToStep", position: 2, name: "Paste Your HTML",
      text: "Copy your HTML from your editor and paste it into the input box. Click Load Sample to see a typical before/after comparison.",
      url: "https://www.purstech.com/tools/html-minifier" },
    { "@type": "HowToStep", position: 3, name: "Minify and Download",
      text: "Click Minify HTML. The size saving is shown immediately. Copy the output to clipboard or download as a .html file for your deployment.",
      url: "https://www.purstech.com/tools/html-minifier" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Is it safe to remove optional closing tags?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — the HTML5 spec officially allows omitting optional closing tags like </li>, </p> and </td>, and browsers parse the result identically. If a downstream tool requires strict XHTML-style markup, just toggle that option off." } },
    { "@type": "Question", name: "What is HTML minification?",
      acceptedAnswer: { "@type": "Answer", text: "HTML minification removes unnecessary whitespace, comments, and optional closing tags from HTML code. It reduces file size without changing what the browser renders, resulting in faster page loads and improved Core Web Vitals scores." } },
    { "@type": "Question", name: "Is it safe to remove HTML comments?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — HTML comments (<!-- -->) are ignored by browsers completely. They are only for developer reference. Removing them has zero effect on the rendered page. The only exception is conditional comments used for legacy Internet Explorer support — those should be preserved if needed." } },
    { "@type": "Question", name: "How much can HTML be compressed?",
      acceptedAnswer: { "@type": "Answer", text: "Typical HTML files see 10–30% size reduction from minification alone. Pages with many comments and developer-added whitespace see more improvement. Combined with gzip or Brotli compression on the server, total savings can exceed 70%. The combination of minification and server compression is recommended for all production deployments." } },
    { "@type": "Question", name: "Should I minify HTML manually?",
      acceptedAnswer: { "@type": "Answer", text: "For small projects, this tool works great. For larger projects, use a build tool like Webpack, Vite or a server-side minification library — they can be automated as part of your deployment pipeline and ensure every deploy is minified consistently." } },
    { "@type": "Question", name: "Does minification affect accessibility or SEO?",
      acceptedAnswer: { "@type": "Answer", text: "No — minification only removes invisible characters. Screen readers, search engines and browsers all read the same content. Minification can actually slightly improve SEO by improving page speed scores, which is a ranking factor for Google." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://www.purstech.com"                      },
    { "@type": "ListItem", position: 2, name: "Tools",         item: "https://www.purstech.com/tools"                },
    { "@type": "ListItem", position: 3, name: "Dev Tools",     item: "https://www.purstech.com/categories/dev"       },
    { "@type": "ListItem", position: 4, name: "HTML Minifier", item: "https://www.purstech.com/tools/html-minifier"  },
  ],
};

export default function HTMLMinifierPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <HTMLMinifierClient />
    </>
  );
}
