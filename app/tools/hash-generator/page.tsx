import type { Metadata } from "next";
import HashGeneratorClient from "./client";

export const metadata: Metadata = {
  // Renders: "Free Hash Generator — MD5, SHA-256, SHA-512 | PursTech" (54 chars ✅)
  title: "Free Hash Generator — MD5, SHA256 & SHA-512 Hashes",

  description:
    "Generate MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hashes instantly. Free online hash generator.",

  alternates: { canonical: "/tools/hash-generator" },

  keywords: ["hash generator", "sha256", "md5 hash", "sha256 hash", "md5 generator", "dehash", "md5 decrypt", "hash identifier", "password hash", "sha512"],

  openGraph: {
    type:        "website",
    url:         "https://www.purstech.com/tools/hash-generator",
    siteName:    "PursTech",
    title:       "Free Hash Generator — MD5, SHA-1, SHA-256, SHA-384, SHA-512",
    description: "Generate all 5 major hash algorithms simultaneously. Hash verify mode, UPPERCASE toggle, Ctrl+Enter. 100% browser-based — text never leaves your device. Free.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Hash Generator — PursTech" }],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "Free Hash Generator — MD5 + SHA Family",
    description: "All 5 hash algorithms at once. Hash verification, UPPERCASE toggle, browser-only. Free.",
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
  "@context": "https://schema.org", "@type": "WebPage",
  name: "Hash Generator", url: "https://www.purstech.com/tools/hash-generator",
  description: "Free online hash generator. Computes MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hashes simultaneously. Includes hash verification mode, UPPERCASE toggle and Ctrl+Enter shortcut. 100% browser-based.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "MD5 (pure JavaScript — Web Crypto does not support MD5)",
    "SHA-1, SHA-256, SHA-384, SHA-512 via Web Crypto API",
    "All 5 algorithms computed simultaneously",
    "Hash verification — check if input matches a known hash",
    "UPPERCASE / lowercase toggle",
    "Copy individual hash or all hashes at once",
    "Ctrl+Enter keyboard shortcut",
    "100% browser-based — text never sent to any server",
    "Algorithm security comparison bar chart",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Generate a Hash Online",
  description: "Use PursTech's free Hash Generator to compute MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hashes instantly.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Enter your text",
      text: "Paste or type any text, password or data into the input box. All hashing happens entirely in your browser — nothing is sent to any server.",
      url: "https://www.purstech.com/tools/hash-generator" },
    { "@type": "HowToStep", position: 2, name: "Generate all hashes",
      text: "Click Generate All Hashes or press Ctrl+Enter to compute MD5, SHA-1, SHA-256, SHA-384 and SHA-512 simultaneously.",
      url: "https://www.purstech.com/tools/hash-generator" },
    { "@type": "HowToStep", position: 3, name: "Copy or verify your hash",
      text: "Click Copy next to any algorithm to grab that hash, or Copy All to get all 5 formatted. Use the Verify Hash input to check if your text matches a known hash for file integrity verification.",
      url: "https://www.purstech.com/tools/hash-generator" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Can you decrypt or dehash an MD5 hash?",
      acceptedAnswer: { "@type": "Answer", text: "No — MD5, like every hash function, is one-way by design. Sites offering 'MD5 decrypt' or 'dehash' simply look the value up in giant precomputed tables of common inputs; a unique or salted input cannot be recovered. That is also why passwords should be stored with slow, salted algorithms like bcrypt or Argon2, never plain MD5. To check whether a value matches a hash, use this tool's verification mode instead." } },
    { "@type": "Question", name: "How do I identify a hash type?",
      acceptedAnswer: { "@type": "Answer", text: "Usually by length: 32 hex characters = MD5, 40 = SHA-1, 64 = SHA-256, 96 = SHA-384, 128 = SHA-512. Paste your text here and all five hashes are computed side by side, so you can compare against the one you have." } },
    { "@type": "Question", name: "What is a hash?",
      acceptedAnswer: { "@type": "Answer", text: "A hash (or digest) is a fixed-length string produced by a hash function from any input. The same input always produces the same hash, but it is computationally infeasible to reverse a hash back to its original input. Even a tiny change in input produces a completely different hash — this is called the avalanche effect." } },
    { "@type": "Question", name: "What is MD5 used for?",
      acceptedAnswer: { "@type": "Answer", text: "MD5 produces a 32-character hash. It is no longer considered secure for cryptographic purposes because collisions have been found — two different inputs can produce the same MD5 hash. However, MD5 is still widely used for checksums, file integrity verification and non-security data fingerprinting where speed matters more than collision resistance." } },
    { "@type": "Question", name: "What is SHA-256?",
      acceptedAnswer: { "@type": "Answer", text: "SHA-256 is part of the SHA-2 family and produces a 64-character (256-bit) hash. It is the current industry standard for security applications including SSL/TLS certificates, Bitcoin proof-of-work, code signing and digital signatures. No practical collision attacks have been found against SHA-256. It is the recommended choice for password hashing (with a proper KDF like bcrypt) and data integrity." } },
    { "@type": "Question", name: "What is SHA-512?",
      acceptedAnswer: { "@type": "Answer", text: "SHA-512 produces a 128-character (512-bit) hash and is part of the SHA-2 family. It provides stronger security than SHA-256 and is preferred in high-security contexts. On 64-bit processors, SHA-512 is actually faster than SHA-256 because it operates on 64-bit words. Use SHA-512 when maximum collision resistance is required." } },
    { "@type": "Question", name: "Can I reverse a hash?",
      acceptedAnswer: { "@type": "Answer", text: "No — hash functions are one-way by design. You cannot mathematically derive the original input from a hash. However, attackers can compare hashes against precomputed dictionaries called rainbow tables. This is why salting passwords before hashing is essential — a random salt makes each hash unique even for identical passwords, rendering rainbow tables useless." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",            item: "https://www.purstech.com"                      },
    { "@type": "ListItem", position: 2, name: "Tools",           item: "https://www.purstech.com/tools"                },
    { "@type": "ListItem", position: 3, name: "Dev Tools",       item: "https://www.purstech.com/categories/dev"       },
    { "@type": "ListItem", position: 4, name: "Hash Generator",  item: "https://www.purstech.com/tools/hash-generator" },
  ],
};

export default function HashGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <HashGeneratorClient />
    </>
  );
}
