/**
 * PursTech — IndexNow Submission Script
 * ─────────────────────────────────────────────────────────────────────────────
 * IndexNow instantly notifies Bing, Yandex and all participating search engines
 * when pages are created or updated — no waiting for their crawlers to find it.
 *
 * SETUP (one-time):
 *   1. Get your key from Bing Webmaster → IndexNow → "Get started"
 *   2. Replace INDEXNOW_KEY below with your actual key
 *   3. Create public/{your-key}.txt containing just the key (see note below)
 *   4. Run: node scripts/indexnow-submit.mjs
 *
 * After each deployment run this script or add it to your deploy pipeline.
 *
 * NOTE: The key file must be accessible at:
 *   https://www.purstech.com/{your-key}.txt
 *   File content must be ONLY the key, nothing else.
 */

const INDEXNOW_KEY = "644e0d5b7ad94b89abe24375c51f9d22";
const BASE_URL     = "https://www.purstech.com";
const HOST         = "www.purstech.com";

// ── All 76 URLs (matches sitemap.ts exactly) ──────────────────────────────────

const CORE_URLS = [
  `${BASE_URL}/`,
  `${BASE_URL}/tools`,
  `${BASE_URL}/blog`,
  `${BASE_URL}/about`,
  `${BASE_URL}/contact`,
  `${BASE_URL}/pro`,
  `${BASE_URL}/privacy`,
  `${BASE_URL}/terms`,
];

const BATCH8_9_URLS = [
  // Batch 8 — PDF Tools
  `${BASE_URL}/tools/pdf-compressor`,
  `${BASE_URL}/tools/pdf-merger`,
  `${BASE_URL}/tools/pdf-splitter`,
  `${BASE_URL}/tools/pdf-to-word`,
  `${BASE_URL}/tools/word-to-pdf`,
  // Batch 9 — Security / AI / Dev
  `${BASE_URL}/tools/ssl-checker`,
  `${BASE_URL}/tools/ip-lookup`,
  `${BASE_URL}/tools/grammar-checker`,
  `${BASE_URL}/tools/readability-checker`,
  `${BASE_URL}/tools/svg-editor`,
];

const ESTABLISHED_TOOL_URLS = [
  // Batch 3a — Original 20
  `${BASE_URL}/tools/word-counter`,
  `${BASE_URL}/tools/case-converter`,
  `${BASE_URL}/tools/lorem-ipsum`,
  `${BASE_URL}/tools/diff-checker`,
  `${BASE_URL}/tools/text-to-speech`,
  `${BASE_URL}/tools/json-formatter`,
  `${BASE_URL}/tools/base64-encoder`,
  `${BASE_URL}/tools/url-encoder`,
  `${BASE_URL}/tools/uuid-generator`,
  `${BASE_URL}/tools/qr-code-generator`,
  `${BASE_URL}/tools/hash-generator`,
  `${BASE_URL}/tools/css-minifier`,
  `${BASE_URL}/tools/html-minifier`,
  `${BASE_URL}/tools/color-picker`,
  `${BASE_URL}/tools/password-generator`,
  `${BASE_URL}/tools/age-calculator`,
  `${BASE_URL}/tools/bmi-calculator`,
  `${BASE_URL}/tools/percentage-calculator`,
  `${BASE_URL}/tools/unit-converter`,
  `${BASE_URL}/tools/currency-converter`,
  // Batch 4 — SEO
  `${BASE_URL}/tools/meta-tag-generator`,
  `${BASE_URL}/tools/robots-txt-generator`,
  `${BASE_URL}/tools/keyword-density-checker`,
  `${BASE_URL}/tools/open-graph-generator`,
  `${BASE_URL}/tools/sitemap-generator`,
  // Batch 5 — Image
  `${BASE_URL}/tools/image-compressor`,
  `${BASE_URL}/tools/image-resizer`,
  `${BASE_URL}/tools/background-remover`,
  `${BASE_URL}/tools/favicon-generator`,
  `${BASE_URL}/tools/image-to-text`,
  // Batch 6 — Finance
  `${BASE_URL}/tools/loan-calculator`,
  `${BASE_URL}/tools/compound-interest-calculator`,
  `${BASE_URL}/tools/tip-calculator`,
  `${BASE_URL}/tools/time-zone-converter`,
  `${BASE_URL}/tools/mortgage-calculator`,
  // Batch 7 — Dev
  `${BASE_URL}/tools/regex-tester`,
  `${BASE_URL}/tools/js-minifier`,
  `${BASE_URL}/tools/html-to-markdown`,
  `${BASE_URL}/tools/markdown-editor`,
  `${BASE_URL}/tools/color-code-converter`,
];

const CATEGORY_URLS = [
  `${BASE_URL}/categories/text`,
  `${BASE_URL}/categories/image`,
  `${BASE_URL}/categories/dev`,
  `${BASE_URL}/categories/seo`,
  `${BASE_URL}/categories/ai`,
  `${BASE_URL}/categories/finance`,
  `${BASE_URL}/categories/security`,
  `${BASE_URL}/categories/pdf`,
];

const BLOG_URLS = [
  `${BASE_URL}/blog/best-free-json-formatter-tools-2025`,
  `${BASE_URL}/blog/how-to-compress-images-without-losing-quality`,
  `${BASE_URL}/blog/strong-password-guide-2025`,
  `${BASE_URL}/blog/hex-vs-rgb-vs-hsl-color-formats`,
  `${BASE_URL}/blog/qr-codes-for-business-complete-guide`,
  `${BASE_URL}/blog/base64-encoding-explained`,
  `${BASE_URL}/blog/bmi-calculator-guide-what-your-score-means`,
  `${BASE_URL}/blog/url-encoding-developer-guide`,
  `${BASE_URL}/blog/free-seo-tools-that-work-2025`,
  `${BASE_URL}/blog/word-count-guide-every-platform`,
];

// IndexNow accepts max 10,000 URLs per call. Ours is 76 — well within limit.
const ALL_URLS = [
  ...CORE_URLS,
  ...BATCH8_9_URLS,
  ...ESTABLISHED_TOOL_URLS,
  ...CATEGORY_URLS,
  ...BLOG_URLS,
];

// ── Submit to IndexNow ────────────────────────────────────────────────────────

async function submitIndexNow() {
  if (INDEXNOW_KEY === "REPLACE_WITH_YOUR_BING_INDEXNOW_KEY") {
    console.error("❌  Set your IndexNow key before running this script.");
    console.error("    Get it from: Bing Webmaster Tools → IndexNow → Get started");
    process.exit(1);
  }

  console.log(`\n🚀  Submitting ${ALL_URLS.length} URLs to IndexNow...`);
  console.log(`    Host: ${HOST}`);
  console.log(`    Key:  ${INDEXNOW_KEY}`);
  console.log(`    Key file must exist at: ${BASE_URL}/${INDEXNOW_KEY}.txt\n`);

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host:        HOST,
        key:         INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList:     ALL_URLS,
      }),
    });

    // IndexNow response codes:
    // 200 — OK, URLs accepted
    // 202 — Accepted, crawled later
    // 400 — Bad request (check JSON format)
    // 403 — Key not found at keyLocation URL
    // 422 — URLs not matching host
    // 429 — Too many requests (rate limited)

    if (res.status === 200 || res.status === 202) {
      console.log(`✅  Success! (HTTP ${res.status})`);
      console.log(`    ${ALL_URLS.length} URLs submitted to Bing, Yandex and all IndexNow partners.`);
      console.log(`    New Batch 8+9 tools will be crawled within minutes, not days.\n`);
    } else {
      const body = await res.text();
      console.error(`❌  Error (HTTP ${res.status}): ${body}`);

      if (res.status === 403) {
        console.error(`    Key file not found. Ensure this URL returns your key:`);
        console.error(`    ${BASE_URL}/${INDEXNOW_KEY}.txt`);
      }
    }
  } catch (err) {
    console.error("❌  Network error:", err.message);
  }
}

// Print URL list summary before submitting
console.log("─────────────────────────────────────────────");
console.log("  PursTech — IndexNow Submission");
console.log("─────────────────────────────────────────────");
console.log(`  Core pages:        ${CORE_URLS.length}`);
console.log(`  New tools (B8+9):  ${BATCH8_9_URLS.length}`);
console.log(`  Established tools: ${ESTABLISHED_TOOL_URLS.length}`);
console.log(`  Category pages:    ${CATEGORY_URLS.length}`);
console.log(`  Blog posts:        ${BLOG_URLS.length}`);
console.log(`  Total:             ${ALL_URLS.length}`);
console.log("─────────────────────────────────────────────");

submitIndexNow();
