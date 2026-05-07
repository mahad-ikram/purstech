import type { Metadata } from "next";
import RegexTesterClient from "./client";

export const metadata: Metadata = {
  title:       "Free Advanced Regex Tester — Live Matches & Capture Groups | PursTech",
  description: "The most advanced free regular expression tester online. Live match highlighting, capture group extraction, execution time telemetry, and a built-in regex cheat sheet.",
  keywords:    [
    "regex tester", "regular expression tester", "regex match highlighter", 
    "regex capture groups", "regex cheat sheet", "javascript regex tester", 
    "regex performance test"
  ],
  openGraph: {
    type:        "website",
    title:       "Advanced Regex Tester & Debugger | PursTech",
    description: "Test your regular expressions in real-time. Live highlighting, group extraction, and execution telemetry.",
    url:         "https://purstech.com/tools/regex-tester",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free Regex Tester" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Advanced Regex Tester | PursTech",
    description: "Live Regex matching, capture groups, and cheat sheet. 100% free.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },
  alternates: { canonical: "/tools/regex-tester" },
  robots:      "index, follow",
};

// ── JSON-LD Schemas ────────────────────────────────────────────────────────────
const toolSchema = {
  "@context":          "https://schema.org",
  "@type":             "SoftwareApplication",
  name:                "Advanced Regex Tester",
  description:         "A professional developer tool for writing, testing, and debugging Regular Expressions with real-time match highlighting.",
  url:                 "https://purstech.com/tools/regex-tester",
  applicationCategory: "DeveloperApplication",
  operatingSystem:     "Any",
  featureList: [
    "Real-time regex match highlighting",
    "Capture group extraction table",
    "Execution time performance telemetry",
    "Interactive regex cheat sheet",
    "Built-in presets for emails, IPs, URLs, etc."
  ],
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumbSchema = {
  "@context":         "https://schema.org",
  "@type":            "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",         item: "https://purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Regex Tester",  item: "https://purstech.com/tools/regex-tester" },
  ],
};

export default function RegexTesterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <RegexTesterClient />
    </>
  );
}
