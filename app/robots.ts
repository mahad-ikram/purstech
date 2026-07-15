import type { MetadataRoute } from "next";

/* ═══════════════════════════════════════════════════════════════════════════
   robots.txt — rebuilt 15 Jul 2026

   ⚠️ THE BUG THIS FIXES
   robots.txt has NO inheritance. Per Google's spec and RFC 9309, a crawler
   obeys the single most-specific group matching its name and ignores every
   other group — "user agent specific groups and global groups (*) are not
   combined." The "*" group applies only "if no matching group exists."

   Previously every named bot here (GPTBot, ClaudeBot, PerplexityBot, and even
   Bingbot) had `allow: ["/"]` with no disallow list. Because each had its own
   group, they all escaped the "*" restrictions entirely and were free to crawl
   /admin and /api. Naming a bot to be friendly accidentally un-protected it.

   The fix: every named group repeats the same DISALLOW list. There is no
   inheritance mechanism in the standard, so repetition is the correct pattern —
   hence the single source of truth below.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Paths no crawler should touch. Repeated into EVERY group on purpose. */
const DISALLOW = [
  "/admin",       // Never index admin panel
  "/admin/",
  "/api/",        // Never index API routes

  // NOTE: "/_next/" intentionally NOT blocked — Google must fetch CSS/JS in
  // /_next/static/ to render pages. Blocking it caused a "Blocked by
  // robots.txt" entry in GSC (fixed 6 Jul 2026).

  // Tracking params only. A blanket "/*?*" would also block the sitelinks
  // searchbox target /tools?search=... (a SearchAction rich result).
  "/*?ref=",      // Product Hunt etc. referral tags (seen in GSC)
  "/*?utm_",      // UTM campaign tags -> duplicate content
  "/*?fbclid=",   // Facebook click IDs
];

/* -- AI crawlers: all explicitly welcome (see /llms.txt) --------------------
   Three distinct jobs, three distinct consequences if blocked:
     * TRAINING -- feeds model weights. Blocking costs zero citations.
     * SEARCH   -- builds the index AI answers cite FROM. Blocking = invisible.
     * USER     -- fetches live when a user asks. Blocking = "can't access it".
   PursTech wants maximum citation visibility, so all three are allowed.
   Next.js emits one `User-agent:` line per array entry, which robots.txt
   parses as ONE group sharing the rules below.                              */
const AI_CRAWLERS = [
  // -- OpenAI (three separate tokens; blocking GPTBot does NOT stop search)
  "GPTBot",             // training
  "OAI-SearchBot",      // ChatGPT search index      <- citation-critical
  "ChatGPT-User",       // user-triggered fetch      <- citation-critical

  // -- Anthropic (ClaudeBot does NOT cover the other tokens)
  "ClaudeBot",          // training
  "Claude-SearchBot",   // Claude search index       <- NEW, citation-critical
  "Claude-User",        // user-triggered fetch      <- NEW, citation-critical
  "anthropic-ai",       // legacy token, harmless    <- NEW
  "Claude-Web",         // deprecated, harmless

  // -- Google
  "Google-Extended",    // Gemini grounding / AI Overviews opt-in
  "Google-NotebookLM",  // <- NEW

  // -- Perplexity
  "PerplexityBot",      // index
  "Perplexity-User",    // user-triggered            <- NEW

  // -- Others
  "DuckAssistBot",      // DuckDuckGo AI             <- NEW
  "MistralAI-User",     // <- NEW
  "cohere-ai",          // <- NEW
  "YouBot",             // You.com                   <- NEW
  "CCBot",              // Common Crawl
  "Amazonbot",          // Amazon / Alexa
  "meta-externalagent", // Meta AI (replaces FacebookBot) <- NEW
  "FacebookBot",        // legacy Meta
  "Applebot",           // Siri / Spotlight
  "Applebot-Extended",  // Apple Intelligence        <- NEW
];

/** Classic search engines. Also need DISALLOW repeated (see bug note above). */
const SEARCH_ENGINES = [
  "Bingbot",      // powers Copilot + part of ChatGPT search
  "BingPreview",  // Bing link previews
  "AdIdxBot",     // Bing Ads quality
  "YandexBot",    // IndexNow partner
];

/** Aggressive SEO scrapers - no crawl budget spent on them. */
const BLOCKED_SCRAPERS = [
  "AhrefsBot",
  "SemrushBot",
  "DotBot",       // Moz
  "MJ12bot",      // Majestic
  "BLEXBot",
  "Bytespider",   // TikTok / ByteDance - ignores robots.txt in practice
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Fallback group - applies only to bots with no group of their own.
      { userAgent: "*", allow: "/", disallow: DISALLOW },

      // Named groups MUST repeat DISALLOW - they do not inherit from "*".
      { userAgent: AI_CRAWLERS,    allow: "/", disallow: DISALLOW },
      { userAgent: SEARCH_ENGINES, allow: "/", disallow: DISALLOW },

      // Full block.
      { userAgent: BLOCKED_SCRAPERS, disallow: "/" },
    ],

    sitemap: "https://www.purstech.com/sitemap.xml",
    host:    "https://www.purstech.com",
  };
}