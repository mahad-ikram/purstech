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
          // "/_next/" removed 6 Jul 2026 — Google must fetch CSS/JS in
          // /_next/static/ to render pages properly; blocking it risks
          // rendering issues and caused a "Blocked by robots.txt" GSC entry.
        ],
      },

      // ── AI crawlers — explicitly ALLOWED ────────────────────────────────────
      { userAgent: "GPTBot",          allow: ["/"] },  // ChatGPT / OpenAI
      { userAgent: "ChatGPT-User",    allow: ["/"] },  // ChatGPT browsing mode  ← NEW
      { userAgent: "OAI-SearchBot",   allow: ["/"] },  // OpenAI search          ← NEW
      { userAgent: "ClaudeBot",       allow: ["/"] },  // Claude / Anthropic
      { userAgent: "Claude-Web",      allow: ["/"] },  // Claude browsing mode   ← NEW
      { userAgent: "Google-Extended", allow: ["/"] },  // Gemini / AI Overviews
      { userAgent: "PerplexityBot",   allow: ["/"] },  // Perplexity AI
      { userAgent: "CCBot",           allow: ["/"] },  // Common Crawl
      { userAgent: "Amazonbot",       allow: ["/"] },  // Amazon AI
      { userAgent: "FacebookBot",     allow: ["/"] },  // Meta AI
      { userAgent: "Applebot",        allow: ["/"] },  // Apple Siri

      // ── Bing crawlers — explicitly allowed ───────────────────────────────────
      // Already covered by "*" but explicit entries signal Bing is welcome
      // after your Bing Webmaster setup. Important for IndexNow cooperation.
      { userAgent: "Bingbot",         allow: ["/"] },  // ← NEW
      { userAgent: "BingPreview",     allow: ["/"] },  // ← NEW (Bing link previews)
      { userAgent: "AdIdxBot",        allow: ["/"] },  // ← NEW (Bing Ads quality)

      // ── YandexBot — IndexNow partner ─────────────────────────────────────────
      // Receives your IndexNow pings — explicit allow avoids any crawl delay.
      { userAgent: "YandexBot",       allow: ["/"] },  // ← NEW

      // ── Aggressive SEO scrapers — blocked ────────────────────────────────────
      { userAgent: "AhrefsBot",       disallow: ["/"] },
      { userAgent: "SemrushBot",      disallow: ["/"] },
      { userAgent: "DotBot",          disallow: ["/"] },  // Moz
      { userAgent: "MJ12bot",         disallow: ["/"] },  // Majestic
      { userAgent: "BLEXBot",         disallow: ["/"] },
      { userAgent: "Bytespider",      disallow: ["/"] },  // ← NEW — TikTok/ByteDance
    ],

    sitemap: "https://www.purstech.com/sitemap.xml",
    host:    "https://www.purstech.com",
  };
}
