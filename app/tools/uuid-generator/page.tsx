import type { Metadata } from "next";
import UUIDGeneratorClient from "./client";

export const metadata: Metadata = {
  title: "Free UUID Generator — GUID & Random UUID v4 (Bulk)",
  description: "Free UUID generator — create cryptographically secure UUID v4 identifiers instantly. Bulk-generate up to 50 at once, uppercase toggle, one-tap copy.",
  alternates: { canonical: "/tools/uuid-generator" },
  keywords: ["uuid generator", "guid generator", "universal unique id", "random uuid", "generate guid", "globally unique id", "uuid v4 generator", "bulk uuid generator", "guid maker"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/uuid-generator",
    siteName: "PursTech",
    title: "UUID / GUID Generator — Bulk v4, 4 Formats",
    description: "Generate cryptographically secure UUID v4 identifiers. Bulk generate up to 50, 4 formats, copy all. Free.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "UUID Generator — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free UUID & GUID Generator — Bulk v4",
    description: "Bulk generate up to 50 UUID v4 identifiers. Standard, uppercase, no hyphens, braces. Free.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebPage",
  name: "UUID Generator", url: "https://www.purstech.com/tools/uuid-generator",
  description: "Free UUID v4 generator. Generate cryptographically secure universally unique identifiers in bulk (up to 50 at once) in four formats: standard, UPPERCASE, no hyphens, and with braces.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "UUID v4 using crypto.randomUUID() (cryptographically secure)",
    "Bulk generation — 1 to 50 UUIDs at once",
    "4 output formats: standard, UPPERCASE, no hyphens, with braces",
    "Copy individual UUID or copy all as newline-separated list",
    "Download as TXT file for database seeding scripts",
    "UUID structure diagram with colour-coded segments",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Generate UUIDs Online",
  description: "Use PursTech's free UUID Generator to create cryptographically secure unique identifiers in seconds.",
  totalTime: "PT10S",
  step: [
    { "@type": "HowToStep", position: 1, name: "Set the quantity",
      text: "Use the slider to choose how many UUIDs to generate at once — from 1 to 50.",
      url: "https://www.purstech.com/tools/uuid-generator" },
    { "@type": "HowToStep", position: 2, name: "Choose a format",
      text: "Pick Standard, UPPERCASE, No Hyphens or With Braces depending on what your code or database requires.",
      url: "https://www.purstech.com/tools/uuid-generator" },
    { "@type": "HowToStep", position: 3, name: "Generate and copy",
      text: "Click Generate. Copy individual UUIDs, click Copy All for a newline-separated list, or Download TXT for use in database seeding scripts.",
      url: "https://www.purstech.com/tools/uuid-generator" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is the difference between a UUID and a GUID?",
      acceptedAnswer: { "@type": "Answer", text: "None in practice — GUID (Globally Unique Identifier) is Microsoft's name for the same 128-bit standard; UUID (Universally Unique Identifier) is the RFC 4122 term. Every UUID this tool generates is a valid GUID — use the braces output format for Microsoft-style {xxxxxxxx-...} values." } },
    { "@type": "Question", name: "How many bytes is a UUID (and how long is it)?",
      acceptedAnswer: { "@type": "Answer", text: "A UUID is 128 bits = 16 bytes of data, written as a 36-character string: 32 hexadecimal characters plus 4 hyphens. Version 4 contains 122 random bits, which allows about 5.3 x 10^36 possible values — enough that collisions are effectively impossible." } },
    { "@type": "Question", name: "What is a UUID?",
      acceptedAnswer: { "@type": "Answer", text: "A UUID (Universally Unique Identifier) is a 128-bit identifier formatted as 32 hexadecimal characters separated by hyphens: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. It is designed to be unique across all space and time without a central authority." } },
    { "@type": "Question", name: "What is the difference between UUID v1 and v4?",
      acceptedAnswer: { "@type": "Answer", text: "UUID v1 is based on the current timestamp and the MAC address of the machine generating it. UUID v4 is randomly generated using cryptographic randomness. v4 is recommended for most applications as it does not leak system information like MAC address or creation time." } },
    { "@type": "Question", name: "Are UUIDs truly unique?",
      acceptedAnswer: { "@type": "Answer", text: "UUID v4 uses 122 bits of randomness, giving 2^122 possible values (about 5.3 × 10^36). The probability of generating two identical UUIDs is astronomically small — effectively zero for any practical use case." } },
    { "@type": "Question", name: "What are UUIDs used for?",
      acceptedAnswer: { "@type": "Answer", text: "UUIDs are used as primary keys in databases, session tokens, transaction IDs, file names, API request IDs, and anywhere a unique identifier is needed without coordination between systems." } },
    { "@type": "Question", name: "Is it safe to use UUIDs as public-facing IDs?",
      acceptedAnswer: { "@type": "Answer", text: "UUID v4 is safe to expose publicly as it reveals no information about your system. However, they are guessable in theory given enough attempts, so for security-sensitive tokens consider using a cryptographic random string instead." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",           item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",          item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Dev Tools",      item: "https://www.purstech.com/categories/dev" },
    { "@type": "ListItem", position: 4, name: "UUID Generator", item: "https://www.purstech.com/tools/uuid-generator" },
  ],
};

export default function UUIDGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <UUIDGeneratorClient>
        <div className="mb-8 min-w-0 w-full">
          <div className="flex items-center gap-3 mb-3 min-w-0 w-full">
            <span className="text-4xl flex-shrink-0">🎲</span>
            <div className="min-w-0 w-full">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white truncate pr-2">UUID / GUID Generator — Universal Unique ID</h1>
              <p className="text-gray-500 mt-1 max-w-2xl leading-relaxed text-base">Generate cryptographically secure UUIDs / GUIDs (v4) instantly — universally unique identifiers in bulk, 4 formats, free.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3 min-w-0 w-full">
            {["Free","No Login","UUID v4","Bulk Generate","4 Formats","Download TXT"].map(b => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium flex-shrink-0">✓ {b}</span>
            ))}
          </div>
        </div>
      </UUIDGeneratorClient>
    </>
  );
}
