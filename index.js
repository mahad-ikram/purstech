const { google } = require('googleapis');

// Initialize authentication using your JSON key
const auth = new google.auth.GoogleAuth({
  keyFile: './service_account.json',
  scopes: ['https://www.googleapis.com/auth/indexing'],
});

// 84 URLs extracted directly from your sitemap
const urlsToSubmit = [
  // Core pages
  "https://www.purstech.com/",
  "https://www.purstech.com/tools",
  "https://www.purstech.com/blog",
  "https://www.purstech.com/about",
  "https://www.purstech.com/contact",
  "https://www.purstech.com/pro",
  "https://www.purstech.com/privacy",
  "https://www.purstech.com/terms",

  // Category Pages
  "https://www.purstech.com/categories/text",
  "https://www.purstech.com/categories/image",
  "https://www.purstech.com/categories/dev",
  "https://www.purstech.com/categories/seo",
  "https://www.purstech.com/categories/ai",
  "https://www.purstech.com/categories/finance",
  "https://www.purstech.com/categories/security",
  "https://www.purstech.com/categories/pdf",

  // New Tools (Batches 8 & 9)
  "https://www.purstech.com/tools/pdf-compressor",
  "https://www.purstech.com/tools/pdf-merger",
  "https://www.purstech.com/tools/pdf-splitter",
  "https://www.purstech.com/tools/pdf-to-word",
  "https://www.purstech.com/tools/word-to-pdf",
  "https://www.purstech.com/tools/ssl-checker",
  "https://www.purstech.com/tools/ip-lookup",
  "https://www.purstech.com/tools/grammar-checker",
  "https://www.purstech.com/tools/readability-checker",
  "https://www.purstech.com/tools/svg-editor",

  // Established Tools (Batches 3-7)
  "https://www.purstech.com/tools/word-counter",
  "https://www.purstech.com/tools/case-converter",
  "https://www.purstech.com/tools/lorem-ipsum",
  "https://www.purstech.com/tools/diff-checker",
  "https://www.purstech.com/tools/text-to-speech",
  "https://www.purstech.com/tools/json-formatter",
  "https://www.purstech.com/tools/base64-encoder",
  "https://www.purstech.com/tools/url-encoder",
  "https://www.purstech.com/tools/uuid-generator",
  "https://www.purstech.com/tools/qr-code-generator",
  "https://www.purstech.com/tools/hash-generator",
  "https://www.purstech.com/tools/css-minifier",
  "https://www.purstech.com/tools/html-minifier",
  "https://www.purstech.com/tools/color-picker",
  "https://www.purstech.com/tools/password-generator",
  "https://www.purstech.com/tools/age-calculator",
  "https://www.purstech.com/tools/bmi-calculator",
  "https://www.purstech.com/tools/percentage-calculator",
  "https://www.purstech.com/tools/unit-converter",
  "https://www.purstech.com/tools/currency-converter",
  "https://www.purstech.com/tools/meta-tag-generator",
  "https://www.purstech.com/tools/robots-txt-generator",
  "https://www.purstech.com/tools/keyword-density-checker",
  "https://www.purstech.com/tools/open-graph-generator",
  "https://www.purstech.com/tools/sitemap-generator",
  "https://www.purstech.com/tools/image-compressor",
  "https://www.purstech.com/tools/image-resizer",
  "https://www.purstech.com/tools/background-remover",
  "https://www.purstech.com/tools/favicon-generator",
  "https://www.purstech.com/tools/image-to-text",
  "https://www.purstech.com/tools/loan-calculator",
  "https://www.purstech.com/tools/compound-interest-calculator",
  "https://www.purstech.com/tools/tip-calculator",
  "https://www.purstech.com/tools/time-zone-converter",
  "https://www.purstech.com/tools/mortgage-calculator",
  "https://www.purstech.com/tools/regex-tester",
  "https://www.purstech.com/tools/js-minifier",
  "https://www.purstech.com/tools/html-to-markdown",
  "https://www.purstech.com/tools/markdown-editor",
  "https://www.purstech.com/tools/color-code-converter",

  // Blogs
  "https://www.purstech.com/blog/best-free-json-formatter-tools",
  "https://www.purstech.com/blog/how-to-compress-images-without-losing-quality",
  "https://www.purstech.com/blog/strong-password-guide",
  "https://www.purstech.com/blog/hex-vs-rgb-vs-hsl-color-formats",
  "https://www.purstech.com/blog/qr-codes-for-business-complete-guide",
  "https://www.purstech.com/blog/base64-encoding-explained",
  "https://www.purstech.com/blog/bmi-calculator-guide-what-your-score-means",
  "https://www.purstech.com/blog/url-encoding-developer-guide",
  "https://www.purstech.com/blog/free-seo-tools-that-work",
  "https://www.purstech.com/blog/word-count-guide-every-platform",
  "https://www.purstech.com/blog/compress-pdf-without-losing-quality",
  "https://www.purstech.com/blog/merge-pdf-files-without-uploading",
  "https://www.purstech.com/blog/loan-calculator-with-extra-payments",
  "https://www.purstech.com/blog/webp-vs-jpeg-vs-png-2026",
  "https://www.purstech.com/blog/how-to-check-word-count",
  "https://www.purstech.com/blog/how-to-remove-background-gimp-canva",
  "https://www.purstech.com/blog/tinypng-alternatives",
  "https://www.purstech.com/blog/best-free-word-counter-tools"
];

async function submitToGoogle() {
  try {
    const client = await auth.getClient();
    const indexing = google.indexing({ version: 'v3', auth: client });

    console.log('Authentication successful. Pushing to Google...');

    for (const url of urlsToSubmit) {
      try {
        const response = await indexing.urlNotifications.publish({
          requestBody: { url: url, type: 'URL_UPDATED' },
        });
        console.log(`✅ Successfully submitted: ${url}`);
      } catch (err) {
        console.error(`❌ Error submitting ${url}:`, err.message);
      }
    }
    console.log('\nBatch complete!');
  } catch (error) {
    console.error('Fatal Authentication Error:', error.message);
  }
}

submitToGoogle();