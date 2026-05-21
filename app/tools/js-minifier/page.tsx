import type { Metadata } from "next";
import JSMinifierClient from "./client";

export const metadata: Metadata = {
  // Renders: "Free JavaScript Minifier Online | PursTech" (43 chars ✅)
  title: "Free JavaScript Minifier Online",

  description:
    "Minify JavaScript code online for free. Remove comments, whitespace and dead code. See real compression stats, gzip size estimate and diff view. Also beautifies/formats JS. No login.",

  alternates: { canonical: "/tools/js-minifier" },

  keywords: [
    "javascript minifier","js minifier online","minify javascript free",
    "compress javascript","js uglify online","javascript beautifier",
    "javascript compressor","minify js","online js minifier",
  ],

  openGraph: {
    type:     "website",
    url:      "https://www.purstech.com/tools/js-minifier", // ✅ www
    siteName: "PursTech",
    // ✅ Removed "| PursTech"
    title:       "Free JavaScript Minifier Online — Compress & Beautify JS",
    description: "Minify and compress JavaScript instantly. See compression stats, gzip estimate and pass analysis. Free, no upload.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "JavaScript Minifier — PursTech" }],
  },

  twitter: {
    card: "summary_large_image",
    // ✅ Removed "| PursTech"
    title:       "Free JavaScript Minifier Online",
    description: "Minify JS instantly — multi-pass compression, gzip estimate, beautifier. Free, no upload.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },

  // ✅ Added — was missing
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

// ✅ WebApplication — was SoftwareApplication in client (wrong type, wrong location)
const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "JavaScript Minifier", url: "https://www.purstech.com/tools/js-minifier",
  description: "Free online JavaScript minifier with multi-pass compression (8 passes, 3 levels), JavaScript beautifier with indent selector, gzip size estimate and pass-by-pass analysis. 100% browser-based.",
  applicationCategory: "DeveloperApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@id": "https://www.purstech.com/#organization" },
  featureList: [
    "Multi-pass JS minifier with 3 levels: Basic, Standard, Aggressive",
    "8 distinct compression passes with per-pass savings analysis",
    "JavaScript beautifier/formatter with 2-space, 4-space or tab indent",
    "Real-time output — updates instantly as you type",
    "Gzip size estimate (32% of minified size)",
    "Char count and byte count statistics",
    "Download as .min.js or .formatted.js",
    "100% browser-based — no server upload required",
  ],
};

// ✅ HowTo — 4 steps from client How to Use section
const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Minify JavaScript Online",
  description: "Use PursTech's free JavaScript Minifier to compress JS code instantly in your browser.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Paste your JavaScript",
      text: "Paste your JS code into the input area on the left. The output and statistics update automatically as you type.",
      url: "https://www.purstech.com/tools/js-minifier" },
    { "@type": "HowToStep", position: 2, name: "Choose minification level",
      text: "Basic removes only comments and excess whitespace. Standard collapses all whitespace into a single line. Aggressive also removes redundant semicolons and optimises keyword spacing.",
      url: "https://www.purstech.com/tools/js-minifier" },
    { "@type": "HowToStep", position: 3, name: "Review the statistics",
      text: "See original size vs output size, the percentage saved, and the estimated Gzip size. Open Pass Analysis to see exactly what was removed in each step.",
      url: "https://www.purstech.com/tools/js-minifier" },
    { "@type": "HowToStep", position: 4, name: "Copy or download",
      text: "Click Copy to use the minified output in your project, or Download to save it as a .min.js file. Switch to Beautify mode to format any minified code for readability.",
      url: "https://www.purstech.com/tools/js-minifier" },
  ],
};

// ✅ FAQPage — moved from client, now server-rendered for crawlers
const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What does minifying JavaScript actually do?",
      acceptedAnswer: { "@type": "Answer", text: "JavaScript minification removes everything that isn't needed for the code to execute: single-line comments, multi-line comments, unnecessary whitespace, indentation, newlines, and redundant semicolons. Advanced minifiers also shorten variable names and optimise certain code patterns. The result is functionally identical code that is smaller in file size, downloads faster and parses faster in the browser." } },
    { "@type": "Question", name: "How much file size can I save by minifying JavaScript?",
      acceptedAnswer: { "@type": "Answer", text: "Typical minification reduces file size by 30–60% for most JavaScript files. Combined with Gzip compression, you can achieve 70–85% size reduction. For example, jQuery uncompressed is ~290KB, minified is ~90KB, and with Gzip is ~30KB. The bigger the file and the more comments and whitespace it contains, the larger the percentage savings." } },
    { "@type": "Question", name: "What is the difference between minification and obfuscation?",
      acceptedAnswer: { "@type": "Answer", text: "Minification removes whitespace and comments to reduce file size while keeping variable names readable. Obfuscation additionally scrambles variable names, reorganises code flow, and adds anti-analysis techniques — primarily to protect intellectual property. Minification is done purely for performance; obfuscation is done for code protection." } },
    { "@type": "Question", name: "Can I reverse minification (unminify/beautify JavaScript)?",
      acceptedAnswer: { "@type": "Answer", text: "You can beautify/format minified JavaScript to make it readable again — our beautifier mode does exactly that. However, you cannot fully reverse minification if variable names were shortened, because the original names are lost. Comments are also permanently removed. Beautifying just adds back whitespace and indentation so the code structure becomes readable." } },
    { "@type": "Question", name: "Does minifying JavaScript change how the code works?",
      acceptedAnswer: { "@type": "Answer", text: "No — minification is designed to produce code that is functionally identical to the original. It only removes non-functional characters (whitespace, comments) and optionally renames identifiers. However, poorly written code can occasionally break — for example, code that relies on function.name, or code with automatic semicolon insertion issues. Always test your minified code." } },
  ],
};

// ✅ BreadcrumbList — added /categories/dev step
const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",        item: "https://www.purstech.com"                    },
    { "@type": "ListItem", position: 2, name: "Tools",       item: "https://www.purstech.com/tools"              },
    { "@type": "ListItem", position: 3, name: "Dev Tools",   item: "https://www.purstech.com/categories/dev"     },
    { "@type": "ListItem", position: 4, name: "JS Minifier", item: "https://www.purstech.com/tools/js-minifier"  },
  ],
};

export default function JSMinifierPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <JSMinifierClient />
    </>
  );
}
