import type { MetadataRoute } from "next";

const BASE_URL = "https://www.purstech.com";

// ── Batch 3a — Original 20 tools ─────────────────────────────────────────────
const BATCH3_SLUGS = [
  "word-counter",
  "case-converter",
  "lorem-ipsum",
  "diff-checker",
  "text-to-speech",
  "json-formatter",
  "base64-encoder",
  "url-encoder",
  "uuid-generator",
  "qr-code-generator",
  "hash-generator",
  "css-minifier",
  "html-minifier",
  "color-picker",
  "password-generator",
  "age-calculator",
  "bmi-calculator",
  "percentage-calculator",
  "unit-converter",
  "currency-converter",
];

// ── Batch 4 — SEO Tools ───────────────────────────────────────────────────────
const BATCH4_SLUGS = [
  "meta-tag-generator",
  "robots-txt-generator",
  "keyword-density-checker",
  "open-graph-generator",
  "sitemap-generator",
];

// ── Batch 5 — Image Tools ─────────────────────────────────────────────────────
const BATCH5_SLUGS = [
  "image-compressor",
  "image-resizer",
  "background-remover",
  "favicon-generator",
  "image-to-text",
];

// ── Batch 6 — Finance Tools ───────────────────────────────────────────────────
const BATCH6_SLUGS = [
  "loan-calculator",
  "compound-interest-calculator",
  "tip-calculator",
  "time-zone-converter",
  "mortgage-calculator",
];

// ── Batch 7 — Developer Tools ─────────────────────────────────────────────────
const BATCH7_SLUGS = [
  "regex-tester",
  "js-minifier",
  "html-to-markdown",
  "markdown-editor",
  "color-code-converter",
];

// ── Batch 8 — PDF Tools ───────────────────────────────────────────────────────
const BATCH8_SLUGS = [
  "pdf-compressor",
  "pdf-merger",
  "pdf-splitter",
  "pdf-to-word",
  "word-to-pdf",
];

// ── Batch 9 — Security / AI / Dev ────────────────────────────────────────────
const BATCH9_SLUGS = [
  "ssl-checker",
  "ip-lookup",
  "grammar-checker",
  "readability-checker",
  "svg-editor",
];

// ── Category pages ────────────────────────────────────────────────────────────
const CATEGORY_SLUGS = ["text", "image", "dev", "seo", "ai", "finance", "security", "pdf"];

// ── Blog posts ────────────────────────────────────────────────────────────────
const BLOG_SLUGS = [
  "best-free-json-formatter-tools-2025",
  "how-to-compress-images-without-losing-quality",
  "strong-password-guide-2025",
  "hex-vs-rgb-vs-hsl-color-formats",
  "qr-codes-for-business-complete-guide",
  "base64-encoding-explained",
  "bmi-calculator-guide-what-your-score-means",
  "url-encoding-developer-guide",
  "free-seo-tools-that-work-2025",
  "word-count-guide-every-platform",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ── Core pages (8) ──────────────────────────────────────────────────────────
  const corePages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                  lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE_URL}/tools`,       lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE_URL}/blog`,        lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${BASE_URL}/about`,       lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`,     lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/pro`,         lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${BASE_URL}/privacy`,     lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/terms`,       lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  // ── Newest tools — Batches 8 & 9 (10 tools, priority 0.9) ──────────────────
  // Higher priority signals freshness and helps new tools get indexed faster.
  const newToolPages: MetadataRoute.Sitemap = [
    ...BATCH8_SLUGS,
    ...BATCH9_SLUGS,
  ].map(slug => ({
    url:             `${BASE_URL}/tools/${slug}`,
    lastModified:    now,
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
    lastModified:    now,
    changeFrequency: "weekly" as const,
    priority:        0.8,
  }));

  // ── Category pages (8) ──────────────────────────────────────────────────────
  const categoryPages: MetadataRoute.Sitemap = CATEGORY_SLUGS.map(slug => ({
    url:             `${BASE_URL}/categories/${slug}`,
    lastModified:    now,
    changeFrequency: "weekly" as const,
    priority:        0.7,
  }));

  // ── Blog pages (10) ─────────────────────────────────────────────────────────
  const blogPages: MetadataRoute.Sitemap = BLOG_SLUGS.map(slug => ({
    url:             `${BASE_URL}/blog/${slug}`,
    lastModified:    now,
    changeFrequency: "monthly" as const,
    priority:        0.6,
  }));

  // Grand total: 8 core + 10 new tools + 40 established tools + 8 categories + 10 blog = 76 URLs
  return [
    ...corePages,
    ...newToolPages,          // newest tools first — freshness signal for Google
    ...establishedToolPages,
    ...categoryPages,
    ...blogPages,
  ];
}
