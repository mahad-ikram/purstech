import type { Metadata } from "next";
import URLEncoderClient from "./client";

export const metadata: Metadata = {
  title: "Free URL Encoder & Decoder — Encode Component & Full URL",
  description: "Encode or decode URLs and query parameters instantly. Three modes: encode full URL, encode component (query param values).",
  alternates: { canonical: "/tools/url-encoder" },
  keywords: ["url encoder", "url decoder", "url encode", "url decode", "percent encoding", "encodeuricomponent", "encodeuri", "url escape"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/url-encoder",
    siteName: "PursTech",
    title: "Free URL Encoder & Decoder — Encode Component & Full URL",
    description: "Encode or decode URLs instantly. Three modes: full URL, component, decode. Free.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "URL Encoder & Decoder — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free URL Encoder & Decoder",
    description: "Encode full URLs, encode components, or decode any percent-encoded string. Instant, free.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebPage",
  name: "URL Encoder / Decoder", url: "https://www.purstech.com/tools/url-encoder",
  description: "Free URL encoder and decoder with three modes: encode a full URL while preserving its structure, encode individual URL components (query parameter values), and decode any percent-encoded string.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "Encode Component — uses encodeURIComponent for query param values",
    "Encode Full URL — uses encodeURI, preserves ://?=& structure",
    "Decode — decodes any percent-encoded URL or string",
    "19-character percent-encoding reference table",
    "Load sample button for instant demonstration",
    "Input/output character count comparison",
    "Use output as input for chained operations",
    "Copy to clipboard",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Encode or Decode a URL",
  description: "Use PursTech's free URL Encoder to encode or decode URLs and query parameters in seconds.",
  totalTime: "PT15S",
  step: [
    { "@type": "HowToStep", position: 1, name: "Choose a mode",
      text: "Select Encode Component for query parameter values, Encode Full URL to encode a complete URL while preserving its structure, or Decode to reverse any percent-encoding.",
      url: "https://www.purstech.com/tools/url-encoder" },
    { "@type": "HowToStep", position: 2, name: "Paste your content",
      text: "Type or paste your URL or text. Click Load Sample to see a practical example.",
      url: "https://www.purstech.com/tools/url-encoder" },
    { "@type": "HowToStep", position: 3, name: "Convert and copy",
      text: "Click Encode or Decode. The result appears with syntax highlighting. Click Copy to use it in your code or browser, or Use as Input for further operations.",
      url: "https://www.purstech.com/tools/url-encoder" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is the difference between encodeURI and encodeURIComponent?",
      acceptedAnswer: { "@type": "Answer", text: "encodeURIComponent escapes everything including : / ? = & — use it for query-parameter values. encodeURI preserves those structural characters — use it for a complete URL. Encode a full address with Component mode and you will break it; the two buttons here map exactly to these two functions." } },
    { "@type": "Question", name: "What is URL encoding?",
      acceptedAnswer: { "@type": "Answer", text: "URL encoding (percent-encoding) converts characters not allowed in URLs into a safe format. Special characters like spaces, &, = and ? are replaced with % followed by their hexadecimal code. For example, a space becomes %20 and & becomes %26." } },
    { "@type": "Question", name: "When do I need to URL encode?",
      acceptedAnswer: { "@type": "Answer", text: "You need URL encoding when passing data in query strings, building API requests, creating redirect URLs, encoding form data, or any time special characters appear in a URL. Without encoding, the URL may be misinterpreted by browsers and servers." } },
    { "@type": "Question", name: "What is the difference between encodeURI and encodeURIComponent?",
      acceptedAnswer: { "@type": "Answer", text: "encodeURI encodes a full URL and skips characters valid in URLs (like /, :, @). encodeURIComponent encodes a URL component and encodes nearly everything including /, ?, =. Use encodeURIComponent for individual parameter values and encodeURI for complete URLs." } },
    { "@type": "Question", name: "What characters are safe in URLs without encoding?",
      acceptedAnswer: { "@type": "Answer", text: "The unreserved characters A-Z, a-z, 0-9, -, _, ., and ~ are always safe in URLs without encoding. All other characters should be percent-encoded for guaranteed compatibility across all systems and browsers." } },
    { "@type": "Question", name: "Can I encode an entire URL at once?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — use Encode Full URL mode, which preserves the URL structure (protocol, slashes, domain, query string delimiters) while encoding only the unsafe characters. Use Encode Component for individual query parameter values like search terms." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",                    item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",                   item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Dev Tools",               item: "https://www.purstech.com/categories/dev" },
    { "@type": "ListItem", position: 4, name: "URL Encoder / Decoder",   item: "https://www.purstech.com/tools/url-encoder" },
  ],
};

export default function URLEncoderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <URLEncoderClient>
        <div className="mb-8 min-w-0 w-full">
          <div className="flex items-center gap-3 mb-3 min-w-0 w-full">
            <span className="text-4xl flex-shrink-0">🔗</span>
            <div className="min-w-0 w-full">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white truncate pr-2">URL Encoder / Decoder</h1>
              <p className="text-gray-500 mt-1 max-w-2xl leading-relaxed text-base">Encode or decode URLs and query parameters instantly — free, no login, works with full URLs and components.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3 min-w-0 w-full">
            {["Free","No Login","Encode Full URL","Encode Component","Decode"].map(b => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium flex-shrink-0">✓ {b}</span>
            ))}
          </div>
        </div>
      </URLEncoderClient>
    </>
  );
}
