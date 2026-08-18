/**
 * PursTech — IndexNow Submission Script
 * ─────────────────────────────────────────────────────────────────────────────
 * Instantly notifies Bing, Yandex and all IndexNow partners that your pages
 * changed — no waiting for their crawlers to find them.
 *
 * HOW TO RUN (no terminal needed):
 *   GitHub → Actions tab → "IndexNow Submit" → "Run workflow"
 *   It also runs automatically after every push to main.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * This script reads your LIVE sitemap.xml and submits every URL in it.
 * That means it can never fall out of date: add a tool or a blog post, and as
 * long as it's in the sitemap, it gets submitted. Nothing to maintain here.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const INDEXNOW_KEY = "644e0d5b7ad94b89abe24375c51f9d22";
const BASE_URL     = "https://www.purstech.com";
const HOST         = "www.purstech.com";
const SITEMAP_URL  = `${BASE_URL}/sitemap.xml`;

/** Pull every <loc> out of the live sitemap. */
async function getSitemapUrls() {
  const res = await fetch(SITEMAP_URL, {
    headers: { "User-Agent": "PursTech-IndexNow/2.0" },
  });
  if (!res.ok) throw new Error(`Could not fetch sitemap (HTTP ${res.status})`);

  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1]);

  // Only submit URLs on our own host — IndexNow rejects the whole batch otherwise.
  const ours = urls.filter(u => u.startsWith(BASE_URL));
  return [...new Set(ours)];
}

async function submitIndexNow() {
  console.log("─────────────────────────────────────────────");
  console.log("  PursTech — IndexNow Submission");
  console.log("─────────────────────────────────────────────");

  let urls;
  try {
    urls = await getSitemapUrls();
  } catch (err) {
    console.error(`❌  ${err.message}`);
    process.exit(1);
  }

  if (urls.length === 0) {
    console.error("❌  No URLs found in sitemap — aborting.");
    process.exit(1);
  }

  // Friendly breakdown so the Actions log is readable at a glance.
  const count = (t) => urls.filter(t).length;
  console.log(`  Tools:      ${count(u => u.includes("/tools/"))}`);
  console.log(`  Blog posts: ${count(u => u.includes("/blog/"))}`);
  console.log(`  Categories: ${count(u => u.includes("/categories/"))}`);
  console.log(`  Other:      ${count(u => !/\/(tools|blog|categories)\//.test(u))}`);
  console.log(`  ── Total:   ${urls.length}`);
  console.log("─────────────────────────────────────────────\n");

  // IndexNow accepts up to 10,000 URLs per request — we're well under.
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host:        HOST,
      key:         INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      urlList:     urls,
    }),
  });

  if (res.status === 200 || res.status === 202) {
    console.log(`✅  Success (HTTP ${res.status})`);
    console.log(`    ${urls.length} URLs sent to Bing, Yandex and IndexNow partners.\n`);
    return;
  }

  const body = await res.text().catch(() => "");
  console.error(`❌  Failed (HTTP ${res.status}) ${body}`);

  // The two failures worth explaining in plain language:
  if (res.status === 403) {
    console.error(`    Key file missing. This URL must return the key and nothing else:`);
    console.error(`    ${BASE_URL}/${INDEXNOW_KEY}.txt`);
  }
  if (res.status === 429) {
    console.error(`    Rate limited — you've submitted too often. Wait a while and retry.`);
  }
  process.exit(1);
}

submitIndexNow().catch(err => {
  console.error("❌  Unexpected error:", err.message);
  process.exit(1);
});
