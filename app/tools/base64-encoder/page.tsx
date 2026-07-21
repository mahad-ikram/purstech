import type { Metadata } from "next";
import Base64Client from "./client";

export const metadata: Metadata = {
  title: "Base64 Decode & Encode — Free Base64 Decoder",
  // Renders: "Free Base64 Encoder & Decoder Online | PursTech" (48 chars ✅)

  description:
    "Encode text to Base64 or decode Base64 strings instantly. Free Base64 encoder and decoder — URL-safe mode, swap & reverse, copy to clipboard. No login required.",

  alternates: { canonical: "/tools/base64-encoder" },

  keywords: ["base64 decode","base64 encode","base64 decoder","decode base64","b64 decode","base64 encoder","base64 converter","url safe base64","what is base64"],

  openGraph: {
    type:        "website",
    url:         "https://www.purstech.com/tools/base64-encoder",
    siteName:    "PursTech",
    title:       "Base64 Decode & Encode — URL-safe, Instant, No Login",
    description: "Encode text to Base64 or decode Base64 strings in one click. URL-safe mode, swap & reverse, copy to clipboard. Free, browser-based.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Base64 Encoder Decoder — PursTech" }],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "Base64 Decode & Encode Online — Free & Instant",
    description: "Encode and decode Base64 instantly. URL-safe mode, swap & reverse. Free, no login.",
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
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  name: "Base64 Encoder / Decoder",
  url:  "https://www.purstech.com/tools/base64-encoder",
  description: "Free online Base64 encoder and decoder. URL-safe mode, swap & reverse, one-click copy. Runs entirely in the browser — no upload.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "Encode text to Base64", "Decode Base64 to text",
    "URL-safe Base64 mode (replaces + with - and / with _)",
    "Swap & Reverse — flip input/output and toggle mode",
    "Character count with size increase percentage",
    "One-click copy to clipboard", "Load sample data",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Encode or Decode Base64 Online",
  description: "Use PursTech's free Base64 Encoder to convert text to Base64 or decode Base64 strings back to readable text.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Choose Encode or Decode",
      text: "Select Encode to convert plain text to a Base64 string, or Decode to convert a Base64 string back to readable text.",
      url: "https://www.purstech.com/tools/base64-encoder" },
    { "@type": "HowToStep", position: 2, name: "Paste Your Content",
      text: "Type or paste your text into the input box. Toggle URL-safe mode if you need the result safe for URLs and query strings.",
      url: "https://www.purstech.com/tools/base64-encoder" },
    { "@type": "HowToStep", position: 3, name: "Convert and Copy",
      text: "Click Encode or Decode to convert instantly. Copy the result with one click. Use Swap & Reverse to flip input and output and switch mode automatically.",
      url: "https://www.purstech.com/tools/base64-encoder" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Can I concatenate two Base64 strings?",
      acceptedAnswer: { "@type": "Answer", text: "Not directly — Base64 output is padded with = characters, so joining two encoded strings usually produces an invalid result. Decode each string first, join the raw text, then re-encode the combined value. The Swap button makes that round-trip quick." } },
    { "@type": "Question", name: "What is Base64 encoding?",
      acceptedAnswer: { "@type": "Answer", text: "Base64 is an encoding scheme that converts binary data into a text format using 64 printable ASCII characters. It is commonly used to transmit data over systems that only support text, such as email attachments and data URLs." } },
    { "@type": "Question", name: "Is Base64 encryption?",
      acceptedAnswer: { "@type": "Answer", text: "No. Base64 is encoding, not encryption. It is completely reversible and provides no security. Anyone who has the Base64 string can decode it instantly. Never use Base64 to protect sensitive data." } },
    { "@type": "Question", name: "What is Base64 used for?",
      acceptedAnswer: { "@type": "Answer", text: "Common uses include embedding images in HTML/CSS as data URIs, encoding email attachments (MIME), passing data in URLs, storing binary data in JSON, and API authentication tokens such as Basic Auth headers." } },
    { "@type": "Question", name: "What is URL-safe Base64?",
      acceptedAnswer: { "@type": "Answer", text: "Standard Base64 uses + and / which have special meaning in URLs. URL-safe Base64 replaces + with - and / with _ making it safe to include in URLs and query strings without percent-encoding." } },
    { "@type": "Question", name: "What characters does Base64 use?",
      acceptedAnswer: { "@type": "Answer", text: "Standard Base64 uses A-Z, a-z, 0-9, + and / (64 characters total) plus = as padding. The name Base64 comes from the 64-character alphabet." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",           item: "https://www.purstech.com"                      },
    { "@type": "ListItem", position: 2, name: "Tools",          item: "https://www.purstech.com/tools"                },
    { "@type": "ListItem", position: 3, name: "Dev Tools",      item: "https://www.purstech.com/categories/dev"       },
    { "@type": "ListItem", position: 4, name: "Base64 Encoder", item: "https://www.purstech.com/tools/base64-encoder" },
  ],
};

export default function Base64EncoderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <Base64Client />
    </>
  );
}
