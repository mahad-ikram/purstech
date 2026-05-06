import type { MetadataRoute } from "next";

const BASE_URL = "https://www.purstech.com";

// ── Batch 3a — Original 20 tools (exact slugs as deployed) ───────────────────
const BATCH3_SLUGS = [
  "word-counter",
  "case-converter",
  "lorem-ipsum",           // ← your actual deployed slug
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

// ── Category slugs (exact as deployed) ───────────────────────────────────────
const CATEGORY_SLUGS = [
  "text",
  "image",
  "dev",
  "seo",
  "ai",
  "finance",
  "security",
  "pdf",
];

// ── Blog post slugs ───────────────────────────────────────────────────────────
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

  // ── Core pages ──────────────────────────────────────────────────────────────
  const corePages: MetadataRoute.Sitemap = [
    {
      url:             BASE_URL,
      lastModified:    now,
      changeFrequency: "daily",
      priority:        1.0,
    },
    {
      url:             `${BASE_URL}/tools`,
      lastModified:    now,
      changeFrequency: "daily",
      priority:        0.9,
    },
    {
      url:             `${BASE_URL}/blog`,
      lastModified:    now,
      changeFrequency: "daily",
      priority:        0.7,
    },
    {
      url:             `${BASE_URL}/about`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.6,
    },
    {
      url:             `${BASE_URL}/contact`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.5,
    },
    {
      url:             `${BASE_URL}/pro`,
      lastModified:    now,
      changeFrequency: "weekly",
      priority:        0.6,
    },
    {
      url:             `${BASE_URL}/privacy`,
      lastModified:    now,
      changeFrequency: "yearly",
      priority:        0.3,
    },
    {
      url:             `${BASE_URL}/terms`,
      lastModified:    now,
      changeFrequency: "yearly",
      priority:        0.3,
    },
  ];

  // ── Tool pages (all 30 tools) ───────────────────────────────────────────────
  const toolPages: MetadataRoute.Sitemap = [
    ...BATCH3_SLUGS,
    ...BATCH4_SLUGS,
    ...BATCH5_SLUGS,
  ].map(slug => ({
    url:             `${BASE_URL}/tools/${slug}`,
    lastModified:    now,
    changeFrequency: "weekly" as const,
    priority:        0.8,
  }));

  // ── Category pages ──────────────────────────────────────────────────────────
  const categoryPages: MetadataRoute.Sitemap = CATEGORY_SLUGS.map(slug => ({
    url:             `${BASE_URL}/categories/${slug}`,
    lastModified:    now,
    changeFrequency: "weekly" as const,
    priority:        0.7,
  }));

  // ── Blog pages ──────────────────────────────────────────────────────────────
  const blogPages: MetadataRoute.Sitemap = BLOG_SLUGS.map(slug => ({
    url:             `${BASE_URL}/blog/${slug}`,
    lastModified:    now,
    changeFrequency: "monthly" as const,
    priority:        0.6,
  }));

  return [...corePages, ...toolPages, ...categoryPages, ...blogPages];
}
