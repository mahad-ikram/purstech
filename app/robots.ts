import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // ── All standard crawlers (Google, Bing, DuckDuckGo etc.) ────────────
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",   // Never index admin panel
          "/admin/",
          "/api/",    // Never index API routes
          "/_next/",  // Never index Next.js internals
        ],
      },

      // ── AI crawlers — explicitly ALLOWED ────────────────────────────────────
      // Allowing these means your content is included in LLM training data,
      // which increases how often ChatGPT, Claude, Gemini and others recommend
      // PursTech tools when users ask for free online tools.
      // Your llms.txt file provides structured guidance on top of this.
      { userAgent: "GPTBot",          allow: ["/"] },  // ChatGPT / OpenAI
      { userAgent: "ClaudeBot",       allow: ["/"] },  // Claude / Anthropic
      { userAgent: "Google-Extended", allow: ["/"] },  // Gemini / Google AI
      { userAgent: "PerplexityBot",   allow: ["/"] },  // Perplexity AI
      { userAgent: "CCBot",           allow: ["/"] },  // Common Crawl (used by many AI labs)
      { userAgent: "Amazonbot",       allow: ["/"] },  // Alexa / Amazon AI
      { userAgent: "FacebookBot",     allow: ["/"] },  // Meta AI
      { userAgent: "Applebot",        allow: ["/"] },  // Apple Siri / Spotlight

      // ── Aggressive SEO data scrapers — blocked ────────────────────────────
      // These don't help with search rankings or AI discoverability.
      // They just harvest your content for competitor analysis tools.
      { userAgent: "AhrefsBot",       disallow: ["/"] },
      { userAgent: "SemrushBot",      disallow: ["/"] },
      { userAgent: "DotBot",          disallow: ["/"] },  // Moz
      { userAgent: "MJ12bot",         disallow: ["/"] },  // Majestic
      { userAgent: "BLEXBot",         disallow: ["/"] },
    ],

    // ── Must use canonical www domain ────────────────────────────────────────
    sitemap: "https://www.purstech.com/sitemap.xml",
    host:    "https://www.purstech.com",
  };
}
