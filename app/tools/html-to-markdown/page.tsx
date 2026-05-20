import type { Metadata } from "next";
import HtmlToMarkdownClient from "./client";

export const metadata: Metadata = {
  // Renders: "Free HTML to Markdown Converter | PursTech" (42 chars ✅)
  title: "Free HTML to Markdown Converter",

  description:
    "Convert HTML to Markdown instantly in your browser. Preserves headings, bold, italic, links, images, tables, code blocks and lists. GFM output, copy or download. Free, no login.",

  alternates: { canonical: "/tools/html-to-markdown" },

  keywords: [
    "html to markdown","html to markdown converter","convert html to markdown online",
    "html markdown","turndown online","gfm converter","github flavored markdown",
  ],

  openGraph: {
    type:     "website",
    url:      "https://www.purstech.com/tools/html-to-markdown", // ✅ www
    siteName: "PursTech",
    // ✅ Removed "| PursTech" — was double-branding
    title:       "Free HTML to Markdown Converter — Clean GFM Output",
    description: "Convert HTML to clean Markdown instantly. Tables, code blocks, GFM output. Free.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "HTML to Markdown Converter — PursTech" }],
  },

  twitter: {
    card: "summary_large_image",
    // ✅ Removed "| PursTech"
    title:       "Free HTML to Markdown Converter",
    description: "Convert HTML to clean Markdown. GFM tables, fenced code, live preview. Free.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },

  // ✅ Added — was missing entirely
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

// ✅ WebApplication — was SoftwareApplication in client.tsx (wrong type, wrong location)
const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "HTML to Markdown Converter",
  url:  "https://www.purstech.com/tools/html-to-markdown",
  description: "Free online HTML to Markdown converter. Preserves headings, bold, italic, links, images, tables, code blocks and lists. Outputs GitHub Flavored Markdown with configurable options.",
  applicationCategory: "DeveloperApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript and DOMParser", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@id": "https://www.purstech.com/#organization" },
  featureList: [
    "Converts all standard HTML elements to Markdown",
    "GitHub Flavored Markdown (GFM) table support",
    "Fenced code blocks with language identifiers",
    "Live Markdown preview",
    "6 configurable options (GFM tables, code blocks, images, scripts, setext headers, bullet char)",
    "Paste from clipboard in one click",
    "Copy to clipboard or download as .md file",
    "100% browser-based — DOMParser only, no server",
  ],
};

// ✅ Added — 4-step workflow matching the tool
const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Convert HTML to Markdown",
  description: "Use PursTech's free HTML to Markdown Converter to get clean GFM output instantly.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Paste your HTML",
      text: "Paste HTML source code into the left panel. Use the Paste HTML button to grab from your clipboard, or type directly.",
      url: "https://www.purstech.com/tools/html-to-markdown" },
    { "@type": "HowToStep", position: 2, name: "Configure options",
      text: "Toggle GFM Tables, fenced code blocks, image handling and header style. Choose your preferred bullet character.",
      url: "https://www.purstech.com/tools/html-to-markdown" },
    { "@type": "HowToStep", position: 3, name: "Review the output",
      text: "The Markdown output appears instantly on the right. Toggle to Preview mode to see how the Markdown will render.",
      url: "https://www.purstech.com/tools/html-to-markdown" },
    { "@type": "HowToStep", position: 4, name: "Copy or download",
      text: "Copy the Markdown to clipboard or download as a .md file ready for GitHub, Notion, Obsidian or any Markdown platform.",
      url: "https://www.purstech.com/tools/html-to-markdown" },
  ],
};

// ✅ FAQPage moved from client.tsx — crawlers need server-rendered FAQ
const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is Markdown and why convert from HTML?",
      acceptedAnswer: { "@type": "Answer", text: "Markdown is a lightweight markup language that uses plain text formatting syntax to produce HTML. It is widely used in README files, documentation, CMS platforms (Ghost, Gatsby, Jekyll), note-taking apps (Obsidian, Notion) and developer platforms (GitHub, GitLab). Converting from HTML to Markdown lets you take content from websites or HTML editors and move it into any Markdown-based platform while preserving the formatting." } },
    { "@type": "Question", name: "What HTML elements does this converter support?",
      acceptedAnswer: { "@type": "Answer", text: "The converter handles all standard HTML elements: headings (h1–h6), paragraphs, bold (strong, b), italic (em, i), strikethrough (del, s), inline code, code blocks (pre), blockquotes, unordered and ordered lists, links, images, horizontal rules, and tables using GitHub Flavored Markdown (GFM) table syntax." } },
    { "@type": "Question", name: "What is GitHub Flavored Markdown (GFM)?",
      acceptedAnswer: { "@type": "Answer", text: "GitHub Flavored Markdown (GFM) is a widely-adopted extension of standard Markdown that adds: tables using pipe separators, task lists, strikethrough, fenced code blocks with language identifiers, and @mentions. GFM is the default on GitHub, GitLab, VS Code, many CMS platforms and developer tools." } },
    { "@type": "Question", name: "How do I handle iframes, scripts and embedded content?",
      acceptedAnswer: { "@type": "Answer", text: "Iframes, scripts, style tags and other non-content HTML elements have no Markdown equivalent and are stripped out during conversion. If you need to embed external content in Markdown, raw HTML blocks are supported in most Markdown processors — you can insert raw iframe HTML directly in a Markdown file." } },
    { "@type": "Question", name: "Can I convert an entire web page by pasting its HTML?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — paste the full HTML source including head, body, scripts, nav and footer and the converter will extract the meaningful text content while stripping structural HTML, scripts, styles and invisible elements. For best results when extracting a specific article, copy just the article's HTML rather than the entire page source." } },
  ],
};

// ✅ Added — was missing entirely
const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",                    item: "https://www.purstech.com"                             },
    { "@type": "ListItem", position: 2, name: "Tools",                   item: "https://www.purstech.com/tools"                       },
    { "@type": "ListItem", position: 3, name: "Dev Tools",               item: "https://www.purstech.com/categories/dev"              },
    { "@type": "ListItem", position: 4, name: "HTML to Markdown",        item: "https://www.purstech.com/tools/html-to-markdown"      },
  ],
};

export default function HtmlToMarkdownPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <HtmlToMarkdownClient />
    </>
  );
}
