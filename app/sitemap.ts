import type { MetadataRoute } from "next";

const BASE_URL = "https://www.purstech.com";

// ── Batch 3a — Original 20 tools ─────────────────────────────────────────────
const BATCH3_SLUGS = [
  "word-counter", "case-converter", "lorem-ipsum", "diff-checker",
  "text-to-speech", "json-formatter", "base64-encoder", "url-encoder",
  "uuid-generator", "qr-code-generator", "hash-generator", "css-minifier",
  "html-minifier", "color-picker", "password-generator", "age-calculator",
  "bmi-calculator", "percentage-calculator", "unit-converter", "currency-converter",
];

// ── Batch 4 — SEO Tools ───────────────────────────────────────────────────────
const BATCH4_SLUGS = [
  "meta-tag-generator", "robots-txt-generator", "keyword-density-checker",
  "open-graph-generator", "sitemap-generator",
];

// ── Batch 5 — Image Tools ─────────────────────────────────────────────────────
const BATCH5_SLUGS = [
  "image-compressor", "image-resizer", "background-remover",
  "favicon-generator", "image-to-text",
];

// ── Batch 6 — Finance Tools ───────────────────────────────────────────────────
const BATCH6_SLUGS = [
  "loan-calculator", "compound-interest-calculator", "tip-calculator",
  "time-zone-converter", "mortgage-calculator",
];

// ── Batch 7 — Developer Tools ─────────────────────────────────────────────────
const BATCH7_SLUGS = [
  "regex-tester", "js-minifier", "html-to-markdown",
  "markdown-editor", "color-code-converter",
];

// ── Batch 8 — PDF Tools ───────────────────────────────────────────────────────
const BATCH8_SLUGS = [
  "pdf-compressor", "pdf-merger", "pdf-splitter", "pdf-to-word", "word-to-pdf",
];

// ── Batch 9 — Security / AI / Dev ────────────────────────────────────────────
const BATCH9_SLUGS = [
  "ssl-checker", "ip-lookup", "grammar-checker", "readability-checker", "svg-editor",
];

const BATCH10_SLUGS = [
  "llms-txt-generator",
];

// ── Category pages (exist at /categories/[slug]) ──────────────────────────────
const CATEGORY_SLUGS = [
  "text", "image", "dev", "seo", "ai", "finance", "security", "pdf",
];

// ── Blog posts (18 — 10 original + 8 added June–July 2026) ───────────────────
// ✅ Updated: removed -2025 from 3 slugs (matches data.ts rename + 301 redirects)
// ✅ Updated: added 4 new June 2026 articles
const BLOG_SLUGS = [
  // Existing 10 (3 renamed without -2025 suffix)
  "best-free-json-formatter-tools",            // ✅ renamed from -2025
  "how-to-compress-images-without-losing-quality",
  "strong-password-guide",                     // ✅ renamed from -2025
  "hex-vs-rgb-vs-hsl-color-formats",
  "qr-codes-for-business-complete-guide",
  "base64-encoding-explained",
  "bmi-calculator-guide-what-your-score-means",
  "url-encoding-developer-guide",
  "free-seo-tools-that-work",                  // ✅ renamed from -2025
  "word-count-guide-every-platform",
  // New 4 — June 2026
  "compress-pdf-without-losing-quality",
  "merge-pdf-files-without-uploading",
  "loan-calculator-with-extra-payments",
  "webp-vs-jpeg-vs-png-2026",
  "how-to-check-word-count",
  "how-to-remove-background-gimp-canva",       // ✅ New — July 2026
  "tinypng-alternatives",                      // ✅ New — July 2026
  "best-free-word-counter-tools",              // ✅ New — July 2026
  "best-free-pdf-mergers",                     // ✅ New — July 2026
  "best-free-background-removers",             // ✅ New — July 2026
];

// ── Recently published blog slugs — get higher priority + weekly frequency ────
// These are the 5 newest (June–July 2026) articles. Search engines weight fresh
// content + weekly changeFrequency higher for new pages still gaining authority.
const NEW_BLOG_SLUGS = new Set([
  "best-free-pdf-mergers",
  "best-free-background-removers",
  "best-free-word-counter-tools",
  "tinypng-alternatives",
  "how-to-remove-background-gimp-canva",
  "how-to-check-word-count",
  "compress-pdf-without-losing-quality",
  "merge-pdf-files-without-uploading",
  "loan-calculator-with-extra-payments",
  "webp-vs-jpeg-vs-png-2026",
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Stable per-content dates so lastModified stops changing every request
  // (dynamic dates train Googlebot to ignore lastModified & waste crawl budget).
  // Bump these ONLY when the underlying pages actually change.
  const TOOLS_REV      = new Date("2026-07-21");  // last tool-content revision (SEO batches)
  const CATEGORIES_REV = new Date("2026-06-15");  // category pages last touched
  const STATIC_REV     = new Date("2026-06-15");  // about/privacy/terms rarely change
  const BLOG_REV       = new Date("2026-07-06");  // newest blog batch (GIMP/Canva, TinyPNG)

  // ── Core pages (8) ──────────────────────────────────────────────────────────
  const corePages: MetadataRoute.Sitemap = [
    { url: BASE_URL,               lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE_URL}/tools`,    lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE_URL}/blog`,     lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${BASE_URL}/about`,    lastModified: STATIC_REV, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`,  lastModified: STATIC_REV, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/pro`,      lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${BASE_URL}/privacy`,  lastModified: STATIC_REV, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/terms`,    lastModified: STATIC_REV, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`, lastModified: STATIC_REV, changeFrequency: "yearly",  priority: 0.3 },
  ];

  // ── Newest tools — Batches 8-10 (11 tools, priority 0.9) ──────────────────
  const newToolPages: MetadataRoute.Sitemap = [
    ...BATCH8_SLUGS,
    ...BATCH9_SLUGS,
    ...BATCH10_SLUGS,
  ].map(slug => ({
    url:             `${BASE_URL}/tools/${slug}`,
    lastModified:    TOOLS_REV,
    changeFrequency: "weekly" as const,
    priority:        0.9,
  }));

  // ── Established tools — Batches 3–7 (40 tools, priority 0.8) ────────────────
  const establishedToolPages: MetadataRoute.Sitemap = [
    ...BATCH3_SLUGS,
    ...BATCH4_SLUGS,
    ...BATCH5_SLUGS,
    ...BATCH6_SLUGS,
    ...BATCH7_SLUGS,
  ].map(slug => ({
    url:             `${BASE_URL}/tools/${slug}`,
    lastModified:    TOOLS_REV,
    changeFrequency: "weekly" as const,
    priority:        0.8,
  }));

  // ── Category pages (8) ───────────────────────────────────────────────────────
  const categoryPages: MetadataRoute.Sitemap = CATEGORY_SLUGS.map(slug => ({
    url:             `${BASE_URL}/categories/${slug}`,
    lastModified:    CATEGORIES_REV,
    changeFrequency: "weekly" as const,
    priority:        0.7,
  }));

  // ── Blog pages (15) ─────────────────────────────────────────────────────────
  // New articles get priority 0.7 + weekly (fresher, needs more crawl frequency).
  // Older articles stay at priority 0.6 + monthly (established, slower-changing).
  const blogPages: MetadataRoute.Sitemap = BLOG_SLUGS.map(slug => {
    const isNew = NEW_BLOG_SLUGS.has(slug);
    return {
      url:             `${BASE_URL}/blog/${slug}`,
      lastModified:    isNew ? BLOG_REV : STATIC_REV,
      changeFrequency: isNew ? ("weekly" as const) : ("monthly" as const),
      priority:        isNew ? 0.7 : 0.6,
    };
  });

  // Grand total: 8 core + 10 new tools + 40 established tools + 8 categories + 18 blog = 84 URLs
  return [
    ...corePages,
    ...newToolPages,
    ...establishedToolPages,
    ...categoryPages,
    ...blogPages,
  ];
}