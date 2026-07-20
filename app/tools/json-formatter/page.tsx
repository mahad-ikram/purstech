import type { Metadata } from "next";
import JSONFormatterClient from "./client";

export const metadata: Metadata = {
  title: "Free JSON Formatter — Beautifier, Validator & Viewer",
  description: "Format, validate, minify and beautify JSON online for free. Instant syntax highlighting, error detection, and size stats. No login required.",
  alternates: { canonical: "/tools/json-formatter" },
  keywords: ["json formatter","json validator","json beautifier","json beautify","json viewer","json pretty","json minifier","how to open json file","json parse error","format json online"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/json-formatter",
    siteName: "PursTech",
    title: "Free JSON Formatter & Beautifier — Validate & View JSON",
    description: "Format, validate and minify JSON instantly. Syntax highlighting, error detection, size stats. Free, no login.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "JSON Formatter & Validator — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free JSON Formatter — Beautify, Validate & Minify JSON",
    description: "Format, validate and minify JSON instantly. Syntax highlighting, error detection. Free.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebPage",
  name: "JSON Formatter & Validator", url: "https://www.purstech.com/tools/json-formatter",
  description: "Free online JSON formatter, validator and minifier. Syntax highlighting, error detection with helpful messages, indent selector, download as .json file. 100% browser-based.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "Format / beautify JSON with configurable indent (2 or 4 spaces)",
    "Minify JSON to smallest possible size",
    "Validate JSON with precise error messages",
    "Syntax highlighting: keys, strings, numbers, booleans, null",
    "Download formatted JSON as .json file",
    "Input and output size stats with savings percentage",
    "JSON Quick Reference sidebar",
    "100% browser-based — JSON never sent to server",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Format and Validate JSON Online",
  description: "Use PursTech's free JSON Formatter to beautify, minify or validate JSON instantly.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Paste your JSON",
      text: "Copy your raw or minified JSON and paste it into the input box. Click Load sample JSON to try it out with example data.",
      url: "https://www.purstech.com/tools/json-formatter" },
    { "@type": "HowToStep", position: 2, name: "Choose an action",
      text: "Click Format to beautify with proper indentation, Minify to compress it for production, or Validate to check for errors without changing anything.",
      url: "https://www.purstech.com/tools/json-formatter" },
    { "@type": "HowToStep", position: 3, name: "Copy or download",
      text: "Your formatted JSON appears with colour syntax highlighting. Click Copy to use it anywhere, or Download to save as a .json file.",
      url: "https://www.purstech.com/tools/json-formatter" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I open a JSON file?",
      acceptedAnswer: { "@type": "Answer", text: "A .json file is plain text — any text editor or browser can open it, but it usually appears as one unreadable line. Paste or drop it here instead: you get it formatted with syntax highlighting, validated, and readable in one click." } },
    { "@type": "Question", name: "Why is my JSON invalid (JSON.parse error)?",
      acceptedAnswer: { "@type": "Answer", text: "The usual culprits: a trailing comma after the last item, single quotes instead of double quotes, unquoted property names, or a missing bracket. The validator here pinpoints the exact line and character of the first error, so the fix takes seconds." } },
    { "@type": "Question", name: "What is JSON and why do I need to format it?",
      acceptedAnswer: { "@type": "Answer", text: "JSON (JavaScript Object Notation) is a format for storing and exchanging data. Raw JSON is often minified (compressed) and very hard to read. Formatting adds indentation and line breaks so humans can read and debug it easily." } },
    { "@type": "Question", name: "Does this tool validate my JSON?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. If your JSON has any errors — missing commas, unclosed brackets, wrong quotes — the tool detects it and shows you exactly what went wrong so you can fix it instantly." } },
    { "@type": "Question", name: "What is JSON minifying?",
      acceptedAnswer: { "@type": "Answer", text: "Minifying removes all whitespace and line breaks from JSON, making it as small as possible. This is useful when sending JSON over a network or storing it, as smaller files load faster and consume less bandwidth." } },
    { "@type": "Question", name: "Is my JSON data safe?",
      acceptedAnswer: { "@type": "Answer", text: "Completely. All processing happens in your browser using JavaScript's built-in JSON.parse and JSON.stringify functions. Your JSON is never sent to any server, never stored, and never transmitted over the internet." } },
    { "@type": "Question", name: "Can I format very large JSON files?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. The tool handles large JSON files with thousands of lines. Simply paste the entire content and it formats instantly. For extremely large files above 5MB, processing may take a moment depending on your device." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",            item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",           item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Dev Tools",       item: "https://www.purstech.com/categories/dev" },
    { "@type": "ListItem", position: 4, name: "JSON Formatter",  item: "https://www.purstech.com/tools/json-formatter" },
  ],
};

export default function JSONFormatterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <JSONFormatterClient />
    </>
  );
}
