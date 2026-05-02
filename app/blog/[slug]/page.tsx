"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
interface BlogPost {
  title: string; slug: string; excerpt: string;
  category: string; categorySlug: string;
  readTime: string; wordCount: number;
  publishedAt: string; updatedAt: string;
  isoPublished: string; isoUpdated: string;
  author: string; authorRole: string;
  content: string;
  toc: { id: string; heading: string }[];
  faqs: { q: string; a: string }[];
  relatedTools: { name: string; slug: string; icon: string }[];
}

// ─── All 10 Blog Posts ────────────────────────────────────────────────────────
export const BLOG_POSTS: Record<string, BlogPost> = {

  "best-free-json-formatter-tools-2025": {
    title: "Best Free JSON Formatter Tools Online in 2025",
    slug: "best-free-json-formatter-tools-2025",
    excerpt: "Discover the top free JSON formatter and validator tools online. We compare speed, features and ease of use so you pick the right one instantly.",
    category: "Developer Tools", categorySlug: "dev",
    readTime: "6 min read", wordCount: 1050,
    publishedAt: "January 8, 2025", updatedAt: "January 8, 2025",
    isoPublished: "2025-01-08T09:00:00Z", isoUpdated: "2025-01-08T09:00:00Z",
    author: "PursTech Team", authorRole: "Developer Tools Expert",
    toc: [
      { id: "what-makes",        heading: "What Makes a Good JSON Formatter?" },
      { id: "purstech-formatter", heading: "PursTech JSON Formatter" },
      { id: "common-errors",     heading: "Common JSON Errors and How to Fix Them" },
      { id: "workflow",          heading: "When to Use JSON Formatting" },
      { id: "json-vs-other",     heading: "JSON vs Other Data Formats" },
    ],
    faqs: [
      { q: "What is a JSON formatter?", a: "A JSON formatter takes raw, minified or poorly-structured JSON and reformats it with proper indentation, making it human-readable. It also validates the JSON and highlights any syntax errors." },
      { q: "Is it safe to paste my JSON into an online formatter?", a: "Yes — the PursTech JSON Formatter processes everything in your browser. Your data is never sent to any server. It is completely private." },
      { q: "What is the difference between formatting and minifying JSON?", a: "Formatting adds whitespace and indentation to make JSON readable. Minifying removes all whitespace to produce the smallest possible file size, ideal for production APIs." },
      { q: "Can I validate JSON without formatting it?", a: "Yes. The PursTech JSON Formatter includes a validate-only mode that checks for syntax errors without changing your JSON structure." },
      { q: "Does JSON support comments?", a: "Standard JSON (RFC 8259) does not support comments. If you need comments, consider JSON5 or JSONC, which are supersets used in some configuration contexts." },
    ],
    relatedTools: [
      { name: "JSON Formatter", slug: "json-formatter", icon: "💻" },
      { name: "Base64 Encoder", slug: "base64-encoder", icon: "🔐" },
      { name: "URL Encoder",    slug: "url-encoder",    icon: "🔗" },
    ],
    content: `<p>JSON has become the universal language of the web. Whether building an API, debugging a webhook, or reading configuration files, you deal with JSON every day. Raw JSON is almost unreadable — especially when it arrives as one long minified string.</p>
<h2 id="what-makes">What Makes a Good JSON Formatter?</h2>
<p><strong>Speed:</strong> The tool should format instantly — no loading bars, no server round-trips. The best formatters run entirely in your browser, meaning your data never leaves your device.</p>
<p><strong>Error detection:</strong> A formatter that crashes on invalid JSON is useless for debugging. The best tools highlight exactly where JSON is broken — a missing comma, an unclosed bracket, or a single-quoted key — and explain what went wrong.</p>
<p><strong>Syntax highlighting:</strong> Color-coded output makes JSON far easier to read. Good color coding reduces scan time by up to 60 percent.</p>
<p><strong>Minification:</strong> Sometimes you need the opposite — strip all whitespace for the smallest possible JSON string. A quality formatter includes a one-click minify button.</p>
<h2 id="purstech-formatter">PursTech JSON Formatter</h2>
<p>Paste any JSON — no matter how large or messy — and it formats instantly with color-coded syntax highlighting. Keys in purple, string values in green, numbers in cyan, booleans in yellow, null in red. The tool offers 2-space and 4-space indentation, a minify button showing percentage size reduction, and validate-only mode. All processing happens in your browser.</p>
<h2 id="common-errors">Common JSON Errors and How to Fix Them</h2>
<p><strong>Trailing comma:</strong> JSON does not allow a comma after the last item. Remove the final comma before the closing bracket.</p>
<p><strong>Single quotes:</strong> JSON requires double quotes for all strings and keys. Replace any single quotes with double quotes throughout.</p>
<p><strong>Unquoted keys:</strong> Every key must be wrapped in double quotes. <code>{name: "John"}</code> is invalid — correct JSON is <code>{"name": "John"}</code>.</p>
<p><strong>Missing comma:</strong> Every item except the last must be followed by a comma. A missing comma between two properties is a very common source of parse errors.</p>
<h2 id="workflow">When to Use JSON Formatting</h2>
<p><strong>API development:</strong> Paste raw JSON responses into a formatter to produce clean, readable examples for documentation.</p>
<p><strong>Code review:</strong> Formatted JSON makes it far easier to spot what changed in configuration files during pull request reviews.</p>
<p><strong>Logging and monitoring:</strong> Application logs often include JSON payloads. A formatter lets you quickly read error objects and trace issues.</p>
<h2 id="json-vs-other">JSON vs Other Data Formats</h2>
<p>JSON won out over XML and YAML for most API use cases because it is lighter than XML, more widely supported than YAML, and directly compatible with JavaScript objects. Most modern programming languages parse JSON natively without additional libraries.</p>`,
  },

  "how-to-compress-images-without-losing-quality": {
    title: "How to Compress Images Without Losing Quality",
    slug: "how-to-compress-images-without-losing-quality",
    excerpt: "A practical guide to reducing image file sizes for the web — which formats to use, how much compression is safe, and the best free tools.",
    category: "Image Tools", categorySlug: "image",
    readTime: "7 min read", wordCount: 980,
    publishedAt: "January 8, 2025", updatedAt: "January 8, 2025",
    isoPublished: "2025-01-08T10:00:00Z", isoUpdated: "2025-01-08T10:00:00Z",
    author: "PursTech Team", authorRole: "Image Optimization Specialist",
    toc: [
      { id: "lossy-lossless",  heading: "Lossy vs Lossless Compression" },
      { id: "which-format",    heading: "Which Format Should You Use?" },
      { id: "how-much",        heading: "How Much Compression Is Safe?" },
      { id: "dimensions",      heading: "Dimensions Matter As Much As Compression" },
      { id: "seo-impact",      heading: "Impact on Performance and SEO" },
    ],
    faqs: [
      { q: "What is the best image format for the web in 2025?", a: "WebP is the best format for most web images — it provides 25–35% smaller files than JPEG at the same quality. Use WebP as your primary format with JPEG as a fallback for older browsers." },
      { q: "How much can you compress a JPEG without losing quality?", a: "JPEG compression at 75–85% quality produces files 60–75% smaller than the original with no perceptible quality loss. Below 60% compression artifacts begin to appear." },
      { q: "Does image compression affect SEO?", a: "Yes — significantly. Google uses Core Web Vitals (including LCP) as a ranking factor. Unoptimized images are the leading cause of poor LCP scores, which directly affects your search rankings." },
      { q: "Should I resize images before compressing them?", a: "Always resize to your actual display dimensions first. A 4000×3000 photo displayed at 800×600 wastes 93% of its pixels and bandwidth." },
      { q: "What is the difference between lossy and lossless compression?", a: "Lossy compression permanently removes some image data for smaller files (JPEG). Lossless compression reduces file size without losing any data — the image can be perfectly reconstructed (PNG, WebP-lossless)." },
    ],
    relatedTools: [
      { name: "Color Picker", slug: "color-picker",      icon: "🎨" },
      { name: "QR Code Gen",  slug: "qr-code-generator", icon: "🔲" },
    ],
    content: `<p>Images are the single biggest contributor to slow websites. A page with unoptimized images can be 5 to 10 times larger than it needs to be, causing longer load times, higher bounce rates, and lower search rankings. Modern compression algorithms can reduce a JPEG by 60–80 percent with no visible quality loss.</p>
<h2 id="lossy-lossless">Lossy vs Lossless Compression</h2>
<p><strong>Lossy compression</strong> permanently removes some image data — subtle color variations most people cannot perceive. JPEG uses lossy compression, ideal for photographs where some reduction is acceptable for much smaller files.</p>
<p><strong>Lossless compression</strong> reduces file size without discarding any data. Every pixel is perfectly preserved. PNG uses lossless compression, making it right for logos, screenshots, and graphics where any quality loss would be visible.</p>
<h2 id="which-format">Which Format Should You Use?</h2>
<p><strong>JPEG</strong> for photographs and images with many colors. A well-compressed JPEG can be 10–20× smaller than the equivalent PNG.</p>
<p><strong>PNG</strong> for logos, icons, screenshots, and images requiring transparency.</p>
<p><strong>WebP</strong> for everything — 25–35% smaller than JPEG at the same quality. All major modern browsers support it.</p>
<p><strong>SVG</strong> for icons and illustrations. Scales perfectly to any size, typically just a few kilobytes.</p>
<h2 id="how-much">How Much Compression Is Safe?</h2>
<p>For JPEG compression, quality settings between 70 and 85 percent produce files 60–75% smaller with no perceptible quality loss. Below 60 percent, blocky patches and color banding appear. For hero images, stay above 75 percent. For small thumbnails, 50–60 percent is often acceptable.</p>
<h2 id="dimensions">Dimensions Matter As Much As Compression</h2>
<p>Compressing a 4000×3000 photograph displayed at 800×600 wastes bandwidth — the browser downloads all four megapixels and discards three quarters of them. Always resize to actual display dimensions first. Good rules: hero images at 1200–1600px wide, blog images at 800–1200px, thumbnails at 400–600px.</p>
<h2 id="seo-impact">Impact on Performance and SEO</h2>
<p>Google uses page speed as a ranking factor. The Core Web Vitals metric LCP measures how quickly the largest image loads. Unoptimized images are the leading cause of poor LCP scores. Research shows a one-second load delay reduces conversions by 7 percent. Always compress before uploading, use WebP as your primary format, and test on both desktop and mobile.</p>`,
  },

  "strong-password-guide-2025": {
    title: "What Makes a Password Strong? The Complete 2025 Guide",
    slug: "strong-password-guide-2025",
    excerpt: "Everything about creating and managing strong passwords — length, complexity, common mistakes, and how to stay secure in 2025.",
    category: "Security", categorySlug: "security",
    readTime: "8 min read", wordCount: 1020,
    publishedAt: "January 8, 2025", updatedAt: "January 8, 2025",
    isoPublished: "2025-01-08T11:00:00Z", isoUpdated: "2025-01-08T11:00:00Z",
    author: "PursTech Team", authorRole: "Cybersecurity Writer",
    toc: [
      { id: "science",   heading: "The Science Behind Password Strength" },
      { id: "length",    heading: "Length Is the Single Most Important Factor" },
      { id: "mistakes",  heading: "Common Password Mistakes" },
      { id: "generate",  heading: "How to Generate a Strong Password" },
      { id: "managers",  heading: "Password Managers" },
      { id: "2fa",       heading: "Two-Factor Authentication" },
    ],
    faqs: [
      { q: "How long should a strong password be in 2025?", a: "A minimum of 16 characters is recommended. For sensitive accounts, aim for 20+. Length matters more than complexity — a 20-character lowercase password is stronger than an 8-character password with symbols." },
      { q: "Is it safe to use a password manager?", a: "Yes — reputable password managers like Bitwarden (free), 1Password, and Dashlane are significantly more secure than reusing passwords. They use AES-256 encryption and store only an encrypted vault." },
      { q: "What are the most common passwords hackers try first?", a: "The most commonly breached passwords are: 123456, password, 123456789, 12345678, 12345, 1234567, qwerty, abc123, 1234567890, and 111111. Any of these are cracked instantly." },
      { q: "Does replacing letters with numbers make passwords stronger?", a: "No — substitutions like replacing 'a' with '@' are well-known to attackers and built into cracking dictionaries. They provide almost no additional security. Length matters far more." },
      { q: "Should I change my passwords regularly?", a: "Current security guidance has shifted away from mandatory regular changes unless you suspect compromise. Instead, focus on using unique, long, random passwords stored in a password manager." },
    ],
    relatedTools: [
      { name: "Password Generator", slug: "password-generator", icon: "🔐" },
      { name: "Hash Generator",     slug: "hash-generator",     icon: "🔑" },
    ],
    content: `<p>Despite years of security advice, the most common passwords in data breaches are still "123456", "password", and "qwerty". Understanding what makes a password strong is the foundation of protecting your online accounts.</p>
<h2 id="science">The Science Behind Password Strength</h2>
<p>Password strength is measured in bits of entropy — a mathematical measure of unpredictability. A password with 60 bits of entropy requires, on average, 2 to the power of 59 guesses — roughly 576 quadrillion attempts. Two factors determine entropy: length and character pool size. A 16-character password from 94 printable ASCII characters has about 104 bits of entropy — considered very strong.</p>
<h2 id="length">Length Is the Single Most Important Factor</h2>
<p>Every additional character multiplies possible combinations by the character pool size. A 12-character lowercase password has ~95 trillion combinations. A 16-character lowercase password has ~43 quadrillion — 450,000 times more secure with just 4 extra characters.</p>
<h2 id="mistakes">Common Password Mistakes</h2>
<p><strong>Dictionary words:</strong> Cracking tools run through entire dictionaries in seconds. Any real word is vulnerable regardless of length.</p>
<p><strong>Predictable substitutions:</strong> Replacing 'a' with '@' or 'e' with '3' are built into cracking dictionaries and provide almost no security.</p>
<p><strong>Keyboard patterns:</strong> Sequences like "qwerty" and "123456" are among the first patterns any cracking tool tries.</p>
<p><strong>Password reuse:</strong> When one service is breached, attackers immediately try those credentials elsewhere — this is credential stuffing, and it succeeds alarmingly often.</p>
<h2 id="generate">How to Generate a Strong Password</h2>
<p>The most secure passwords are long, random, and unique to each account. "Random" means generated by a cryptographically secure random number generator, not chosen by a human. The PursTech Password Generator uses <code>crypto.getRandomValues()</code> — the same technology used in SSL certificates and banking security systems.</p>
<h2 id="managers">Password Managers</h2>
<p>The only realistic way to use strong, unique passwords for every account is a password manager. It generates, stores, and fills passwords automatically. You only need one strong master password. Bitwarden is free, open-source, and independently audited. 1Password and Dashlane are excellent paid options.</p>
<h2 id="2fa">Two-Factor Authentication</h2>
<p>Even the strongest password can be stolen through phishing or data breaches. Two-factor authentication (2FA) requires something you physically possess — typically your phone. Enable 2FA on every account that supports it, especially email, banking, and social media.</p>`,
  },

  "hex-vs-rgb-vs-hsl-color-formats": {
    title: "HEX vs RGB vs HSL: Which Color Format Should You Use?",
    slug: "hex-vs-rgb-vs-hsl-color-formats",
    excerpt: "A complete guide to web color formats for developers and designers — when to use HEX, RGB, HSL, and how to convert between them.",
    category: "Design", categorySlug: "image",
    readTime: "6 min read", wordCount: 920,
    publishedAt: "January 8, 2025", updatedAt: "January 8, 2025",
    isoPublished: "2025-01-08T12:00:00Z", isoUpdated: "2025-01-08T12:00:00Z",
    author: "PursTech Team", authorRole: "UI/UX Design Writer",
    toc: [
      { id: "hex",     heading: "HEX Color Codes" },
      { id: "rgb",     heading: "RGB Color Values" },
      { id: "hsl",     heading: "HSL — The Designer's Format" },
      { id: "when",    heading: "When to Use Each Format" },
      { id: "convert", heading: "Converting Between Formats" },
    ],
    faqs: [
      { q: "What is the most used color format in CSS?", a: "HEX is still the most widely used in CSS because it is compact and the default output of most design tools like Figma and Photoshop. However, HSL is increasingly preferred for programmatic color manipulation." },
      { q: "Can I use HSL colors in all browsers?", a: "Yes — HSL has been supported in all major browsers since 2008 and is safe to use in production CSS. HSLA (with alpha transparency) is equally well supported." },
      { q: "What is the difference between HSL and HSV?", a: "In HSL, a lightness of 50% gives the pure color. In HSV, a value of 100% gives the pure color. HSL is more common in CSS; HSV is used in many design tools like Photoshop." },
      { q: "How do I convert HEX to RGB?", a: "Take each pair of hex digits and convert from base 16 to base 10. For #FF8800: FF=255 (red), 88=136 (green), 00=0 (blue). Result: rgb(255, 136, 0). The PursTech Color Picker does this conversion instantly." },
      { q: "What is CMYK and when is it used?", a: "CMYK is a color model for print design, not screens. Print uses subtractive color mixing (inks), screens use additive mixing (light). Use CMYK values when designing for print; use HEX, RGB, or HSL for screens." },
    ],
    relatedTools: [
      { name: "Color Picker", slug: "color-picker", icon: "🎨" },
      { name: "CSS Minifier", slug: "css-minifier", icon: "🎨" },
    ],
    content: `<p>Color is fundamental to web design, yet the number of formats — HEX, RGB, HSL, RGBA, HSLA — can be confusing even for experienced developers. Each has specific strengths. This guide explains each format clearly and tells you when to use which one.</p>
<h2 id="hex">HEX Color Codes</h2>
<p>HEX (hexadecimal) is the most widely used color format in web development. A HEX code is a hash symbol followed by six characters: <code>#RRGGBB</code>. Each pair represents a color channel in base 16. Pure red is <code>#FF0000</code>, white is <code>#FFFFFF</code>, black is <code>#000000</code>. HEX codes are compact and the default in design tools like Figma and Photoshop.</p>
<h2 id="rgb">RGB Color Values</h2>
<p>RGB defines colors using three numbers between 0 and 255: <code>rgb(255, 0, 0)</code> for pure red. RGB is mathematically identical to HEX — just in decimal rather than hexadecimal. RGBA adds a fourth alpha channel for opacity: <code>rgba(255, 0, 0, 0.5)</code> produces semi-transparent red.</p>
<h2 id="hsl">HSL — The Designer's Format</h2>
<p>HSL (Hue, Saturation, Lightness) describes color how humans naturally think about it. Hue is the pure color as a degree on the color wheel (0–360). Saturation is how vivid the color is (0–100%). Lightness is how light or dark (0–100%).</p>
<p>HSL makes color variations trivially easy. To create a lighter version, increase lightness. To desaturate, reduce saturation. To find the complementary color, add 180 degrees to the hue. None of these are intuitive in HEX or RGB.</p>
<h2 id="when">When to Use Each Format</h2>
<p>Use <strong>HEX</strong> for design handoffs and brand colors. Use <strong>RGB/RGBA</strong> when you need alpha transparency or are performing mathematical operations on color values in JavaScript. Use <strong>HSL/HSLA</strong> for design systems and theme generation — building light and dark variants is far simpler than calculating new RGB values.</p>
<h2 id="convert">Converting Between Formats</h2>
<p>All three formats represent the same color space — they are just different notations. The PursTech Color Picker converts between HEX, RGB, HSL, HSV, and CMYK instantly. Enter any color in any format and immediately see all equivalents ready to copy.</p>`,
  },

  "qr-codes-for-business-complete-guide": {
    title: "QR Codes for Business: The Complete 2025 Guide",
    slug: "qr-codes-for-business-complete-guide",
    excerpt: "Everything businesses need to know about QR codes — how they work, the best use cases, design tips, and how to generate them free.",
    category: "Developer Tools", categorySlug: "dev",
    readTime: "7 min read", wordCount: 970,
    publishedAt: "January 8, 2025", updatedAt: "January 8, 2025",
    isoPublished: "2025-01-08T13:00:00Z", isoUpdated: "2025-01-08T13:00:00Z",
    author: "PursTech Team", authorRole: "Digital Marketing Writer",
    toc: [
      { id: "how-work",       heading: "How QR Codes Work" },
      { id: "use-cases",      heading: "The Best Business Use Cases" },
      { id: "design",         heading: "QR Code Design Best Practices" },
      { id: "static-dynamic", heading: "Static vs Dynamic QR Codes" },
    ],
    faqs: [
      { q: "Are QR codes free to generate and use?", a: "Yes — static QR codes are completely free to generate and use with no ongoing fees. The PursTech QR Code Generator creates high-resolution PNG and SVG codes at no cost." },
      { q: "Do QR codes expire?", a: "Static QR codes never expire — they will work as long as the destination URL remains valid. Dynamic QR codes may expire depending on the service provider." },
      { q: "What is the minimum size for a printable QR code?", a: "For reliable scanning, QR codes should be at least 2cm × 2cm for close-range use. For large format print like posters, aim for at least 10cm × 10cm." },
      { q: "Can I put a logo in the center of a QR code?", a: "Yes — QR codes include error correction that allows up to 30% of the code to be obscured. Use the highest error correction level (H) when adding a logo to ensure the code scans reliably." },
      { q: "What types of content can a QR code contain?", a: "QR codes can encode URLs, plain text, email addresses, phone numbers, SMS messages, WiFi credentials, vCard contact information, and geographic coordinates. URLs are by far the most common use case." },
    ],
    relatedTools: [
      { name: "QR Code Generator", slug: "qr-code-generator", icon: "🔲" },
      { name: "URL Encoder",       slug: "url-encoder",       icon: "🔗" },
    ],
    content: `<p>QR codes went from a niche logistics technology to mainstream consumer tool overnight. The pandemic made contactless interactions a necessity, accelerating adoption so dramatically that QR code usage has permanently changed consumer behavior.</p>
<h2 id="how-work">How QR Codes Work</h2>
<p>A QR (Quick Response) code is a two-dimensional barcode encoding data as a matrix of black and white squares. Unlike traditional barcodes storing about 20 characters, QR codes encode up to 4,296 alphanumeric characters. QR codes include built-in error correction allowing them to remain readable even when up to 30 percent is damaged — this is why you can place a logo in the center and it still scans.</p>
<h2 id="use-cases">The Best Business Use Cases</h2>
<p><strong>Restaurant menus:</strong> Digital menus via QR reduce printing costs and allow instant updates when items change. Customers scan the table code and view the current menu on their phone.</p>
<p><strong>Product packaging:</strong> QR codes on packaging can link to assembly instructions, warranty registration, or video demonstrations — turning static packaging into an interactive touchpoint.</p>
<p><strong>Business cards:</strong> A QR code that adds your contact details directly to someone's phone is far more likely to be saved than a card requiring manual entry.</p>
<p><strong>WiFi sharing:</strong> A QR code that automatically connects guests to your WiFi is one of the most practical applications. Guests scan and connect instantly without reading out a long password.</p>
<h2 id="design">QR Code Design Best Practices</h2>
<p><strong>Size:</strong> Minimum 2cm × 2cm for print. For posters, at least 10cm × 10cm. <strong>Contrast:</strong> Black on white is optimal — avoid low contrast combinations. <strong>Test before printing:</strong> Scan with at least two different devices before committing to a print run.</p>
<h2 id="static-dynamic">Static vs Dynamic QR Codes</h2>
<p>A static QR code encodes the destination URL directly — once printed, you cannot change where it points. A dynamic QR code points to a redirect service, allowing you to update the destination without reprinting. For single-use applications, static codes are simpler and completely free. The PursTech QR Code Generator creates static codes downloadable as PNG or SVG.</p>`,
  },

  "base64-encoding-explained": {
    title: "Base64 Encoding Explained: A Developer's Guide",
    slug: "base64-encoding-explained",
    excerpt: "What is Base64 encoding, how does it work, and when should you use it? A practical guide for developers with real-world examples.",
    category: "Developer Tools", categorySlug: "dev",
    readTime: "6 min read", wordCount: 890,
    publishedAt: "January 9, 2025", updatedAt: "January 9, 2025",
    isoPublished: "2025-01-09T09:00:00Z", isoUpdated: "2025-01-09T09:00:00Z",
    author: "PursTech Team", authorRole: "Developer Tools Expert",
    toc: [
      { id: "what-is",   heading: "What Is Base64?" },
      { id: "why",       heading: "Why Does Base64 Exist?" },
      { id: "how-works", heading: "How the Encoding Works" },
      { id: "use-cases", heading: "Common Use Cases" },
      { id: "not-is",    heading: "What Base64 Is Not" },
      { id: "url-safe",  heading: "URL-Safe Base64" },
    ],
    faqs: [
      { q: "Is Base64 the same as encryption?", a: "No — Base64 is encoding, not encryption. It is completely reversible and provides zero security. Anyone can decode a Base64 string instantly. Never use Base64 to protect sensitive data." },
      { q: "How much does Base64 increase file size?", a: "Base64-encoded data is approximately 33% larger than the original binary. Every 3 bytes of input produces 4 characters of output." },
      { q: "What is URL-safe Base64?", a: "Standard Base64 uses + and / which have special meanings in URLs. URL-safe Base64 replaces + with - and / with _, making it safe for URLs without percent-encoding." },
      { q: "Where is Base64 used in everyday technology?", a: "Base64 appears in email attachments (MIME), JWT tokens, HTTP Basic Auth headers, CSS data URIs for embedded images, and many API authentication systems." },
      { q: "Can I encode images to Base64?", a: "Yes — images can be Base64-encoded for use as data URIs in CSS: url('data:image/png;base64,...'). This eliminates one HTTP request but is only practical for very small images due to the 33% size increase." },
    ],
    relatedTools: [
      { name: "Base64 Encoder", slug: "base64-encoder", icon: "🔐" },
      { name: "URL Encoder",    slug: "url-encoder",    icon: "🔗" },
      { name: "Hash Generator", slug: "hash-generator", icon: "🔑" },
    ],
    content: `<p>Base64 is one of those encoding schemes developers encounter constantly but rarely fully understand. You have seen it in JWT tokens, email attachments, CSS data URIs, and API authentication headers. This guide explains what Base64 is, how it works, and when to use it.</p>
<h2 id="what-is">What Is Base64?</h2>
<p>Base64 is a binary-to-text encoding scheme representing binary data using only 64 printable ASCII characters: uppercase A–Z, lowercase a–z, digits 0–9, plus sign, and forward slash. An equals sign is used for padding. The name comes from this 64-character alphabet.</p>
<h2 id="why">Why Does Base64 Exist?</h2>
<p>Many systems designed to handle text — email protocols, HTTP headers, URLs — were not built to safely transmit arbitrary binary data. Binary data can contain control characters that these text-based systems interpret as commands rather than data. Base64 converts binary into a format containing only safe, printable characters.</p>
<h2 id="how-works">How the Encoding Works</h2>
<p>Base64 groups input bytes into sets of three (24 bits), splits each group into four 6-bit values, then maps each to one character from the alphabet. Because every 3 bytes of input produces 4 characters of output, Base64-encoded data is approximately one third larger than the original.</p>
<h2 id="use-cases">Common Use Cases</h2>
<p><strong>Email attachments:</strong> MIME uses Base64 to encode binary files for transmission through email systems originally designed for plain text only.</p>
<p><strong>Data URIs in CSS:</strong> Small images can be embedded as Base64-encoded data URIs, eliminating a separate HTTP request: <code>url("data:image/png;base64,...")</code>.</p>
<p><strong>API authentication:</strong> HTTP Basic Auth encodes credentials as Base64 in the Authorization header. Note: this is not encryption — always use HTTPS with Basic Auth.</p>
<p><strong>JWT tokens:</strong> JSON Web Tokens consist of three Base64URL-encoded sections separated by periods.</p>
<h2 id="not-is">What Base64 Is Not</h2>
<p>Base64 is encoding, not encryption. It provides zero security. Anyone with a Base64 string can decode it in milliseconds. Never use Base64 to protect passwords, API keys, or personal information.</p>
<h2 id="url-safe">URL-Safe Base64</h2>
<p>Standard Base64 uses + and / which have special meanings in URLs. URL-safe Base64 replaces + with - and / with _, making encoded strings safe for URLs. Most JWT implementations use URL-safe Base64 without trailing padding equals signs.</p>`,
  },

  "bmi-calculator-guide-what-your-score-means": {
    title: "BMI Calculator: What Your Score Actually Means",
    slug: "bmi-calculator-guide-what-your-score-means",
    excerpt: "A complete guide to BMI — how it is calculated, what the categories mean, its limitations, and how to use it alongside other health metrics.",
    category: "Health & Fitness", categorySlug: "finance",
    readTime: "7 min read", wordCount: 980,
    publishedAt: "January 9, 2025", updatedAt: "January 9, 2025",
    isoPublished: "2025-01-09T10:00:00Z", isoUpdated: "2025-01-09T10:00:00Z",
    author: "PursTech Team", authorRole: "Health & Wellness Writer",
    toc: [
      { id: "calculated",   heading: "How BMI Is Calculated" },
      { id: "history",      heading: "The History of BMI" },
      { id: "measures",     heading: "What BMI Measures and What It Does Not" },
      { id: "still-useful", heading: "Why BMI Is Still Useful" },
      { id: "alongside",    heading: "Using BMI Alongside Other Metrics" },
    ],
    faqs: [
      { q: "What is a healthy BMI range for adults?", a: "For most adults, a BMI between 18.5 and 24.9 is healthy. Below 18.5 is underweight, 25–29.9 is overweight, and 30 or above is obese according to WHO classifications." },
      { q: "Is BMI accurate for athletes and muscular people?", a: "No — BMI does not distinguish between muscle and fat. A muscular athlete may have a high BMI without excess body fat and lower actual health risks than a sedentary person with a normal BMI." },
      { q: "How is BMI calculated in metric vs imperial units?", a: "Metric: BMI = weight (kg) ÷ height (m)². Imperial: BMI = (weight in lbs × 703) ÷ height in inches². The PursTech BMI Calculator handles both unit systems automatically." },
      { q: "Is BMI different for children and teenagers?", a: "Yes — for children and teenagers, BMI is interpreted using age and sex-specific percentile charts rather than fixed categories, because body composition changes significantly during development." },
      { q: "What is BMI Prime?", a: "BMI Prime is your BMI divided by 25. A value below 1.0 indicates healthy weight, above 1.0 indicates overweight. It makes it easy to see at a glance how far from the healthy range you are." },
    ],
    relatedTools: [
      { name: "BMI Calculator", slug: "bmi-calculator", icon: "⚖️" },
      { name: "Age Calculator", slug: "age-calculator", icon: "🎂" },
      { name: "Unit Converter",  slug: "unit-converter", icon: "📏" },
    ],
    content: `<p>Body Mass Index (BMI) is one of the most widely used health screening tools in the world, yet also one of the most misunderstood. Millions check their BMI without understanding what it measures, its limitations, and how much weight to give it alongside other health indicators.</p>
<h2 id="calculated">How BMI Is Calculated</h2>
<p>BMI is weight divided by height squared. Metric: weight in kg ÷ height in meters squared. Imperial: (weight in lbs × 703) ÷ height in inches squared. The WHO categories are: below 18.5 underweight, 18.5–24.9 normal, 25–29.9 overweight, 30+ obese (further subdivided into Class I, II, III).</p>
<h2 id="history">The History of BMI</h2>
<p>BMI was developed in the 1830s by Belgian mathematician Adolphe Quetelet for studying population statistics — not individuals. He explicitly stated it was not designed for individual assessment. The term "Body Mass Index" was coined in 1972 by physiologist Ancel Keys, who found it to be a reasonable population-level correlate of body fat.</p>
<h2 id="measures">What BMI Measures and What It Does Not</h2>
<p>BMI measures the relationship between weight and height. It does not measure body fat, muscle mass, bone density, waist circumference, or fat distribution. A professional bodybuilder with 10% body fat might have a BMI of 30, classified as obese. A sedentary person with high body fat might have a BMI of 24, classified as normal. Both are misleading.</p>
<h2 id="still-useful">Why BMI Is Still Useful</h2>
<p>Despite limitations, BMI remains valuable as a quick, free, population-level screening tool. At the extremes it correlates well with actual health risks — a BMI above 35 is strongly associated with type 2 diabetes and cardiovascular disease. For clinical decisions, doctors combine BMI with waist circumference, blood pressure, blood glucose, and fitness assessments.</p>
<h2 id="alongside">Using BMI Alongside Other Metrics</h2>
<p>Waist circumference is a particularly important complement to BMI — it measures abdominal fat, which is more closely linked to metabolic disease. A waist above 102cm for men or 88cm for women indicates elevated health risk regardless of BMI. Combining a normal BMI with high waist circumference — "normal-weight obesity" — is associated with worse metabolic health than a higher BMI with lower waist circumference.</p>`,
  },

  "url-encoding-developer-guide": {
    title: "URL Encoding Explained: A Developer's Complete Guide",
    slug: "url-encoding-developer-guide",
    excerpt: "What is URL encoding, why it matters, and how to use it correctly in web applications. Everything developers need to know about percent-encoding.",
    category: "Developer Tools", categorySlug: "dev",
    readTime: "6 min read", wordCount: 870,
    publishedAt: "January 9, 2025", updatedAt: "January 9, 2025",
    isoPublished: "2025-01-09T11:00:00Z", isoUpdated: "2025-01-09T11:00:00Z",
    author: "PursTech Team", authorRole: "Developer Tools Expert",
    toc: [
      { id: "why-restricted", heading: "Why URLs Have Character Restrictions" },
      { id: "how-percent",    heading: "How Percent-Encoding Works" },
      { id: "encode-vs-comp", heading: "encodeURI vs encodeURIComponent" },
      { id: "query-strings",  heading: "URL Encoding in Query Strings" },
      { id: "practical",      heading: "Practical Tips" },
    ],
    faqs: [
      { q: "What does %20 mean in a URL?", a: "%20 is the percent-encoded representation of a space. The space has ASCII value 32, which is 20 in hexadecimal, so it becomes %20. Spaces are not allowed in URLs and must always be encoded." },
      { q: "What is the difference between %20 and + in URLs?", a: "Both represent a space but in different contexts. %20 is the standard percent-encoding for spaces in any URL component. The + sign represents a space specifically in HTML form data. In modern practice, %20 is preferred." },
      { q: "What characters are always safe in URLs?", a: "The unreserved characters are always safe: A–Z, a–z, 0–9, hyphen (-), underscore (_), period (.), and tilde (~). All other characters should be percent-encoded for guaranteed compatibility." },
      { q: "When should I use encodeURIComponent vs encodeURI?", a: "Use encodeURIComponent for individual query parameter values — it encodes everything including /, ?, and =. Use encodeURI for complete URLs — it preserves URL structure characters like /, :, and ?." },
      { q: "Do I need to encode URLs in HTML attributes?", a: "Yes — if a URL contains special characters like &, <, >, or quotes, they should be both URL-encoded and HTML-entity encoded when placed in HTML attributes to avoid breaking the markup." },
    ],
    relatedTools: [
      { name: "URL Encoder",    slug: "url-encoder",    icon: "🔗" },
      { name: "Base64 Encoder", slug: "base64-encoder", icon: "🔐" },
      { name: "JSON Formatter", slug: "json-formatter", icon: "💻" },
    ],
    content: `<p>URLs are the addressing system of the web. But URLs were designed with a limited character set, and the modern web constantly needs to pass data containing characters outside that set. URL encoding — percent-encoding — makes this possible.</p>
<h2 id="why-restricted">Why URLs Have Character Restrictions</h2>
<p>The URL specification (RFC 3986) defines "unreserved characters" that are always safe: letters, digits, hyphens, underscores, periods, and tildes. All other characters — spaces, ampersands, equals signs, slashes — have special meanings in URL structure or aren't guaranteed to be handled correctly by all systems.</p>
<h2 id="how-percent">How Percent-Encoding Works</h2>
<p>Percent-encoding replaces a character with a percent sign followed by the two-digit hexadecimal value of that character's UTF-8 representation. A space (ASCII 32, hex 20) becomes %20. An ampersand (ASCII 38, hex 26) becomes %26. For non-ASCII characters like é, the character is first encoded as UTF-8 bytes and each byte is percent-encoded.</p>
<h2 id="encode-vs-comp">encodeURI vs encodeURIComponent</h2>
<p><code>encodeURI()</code> encodes a complete URL. It leaves URL-structure characters unencoded including colon, forward slash, and question mark. Use it when you have a complete URL to make safe for embedding.</p>
<p><code>encodeURIComponent()</code> encodes a single URL component. It encodes everything except unreserved characters, including slash and equals sign. Use it for any individual value placed into a query string. The most common mistake is using <code>encodeURI</code> for a parameter value containing an ampersand — it won't encode it and the query string breaks.</p>
<h2 id="query-strings">URL Encoding in Query Strings</h2>
<p>Query strings use the format <code>key=value&key2=value2</code>. Both keys and values must be encoded. If a search query contains "JSON & XML", the unencoded string <code>search=JSON & XML</code> gets parsed as two separate parameters. The correct encoding is <code>search=JSON%20%26%20XML</code>.</p>
<h2 id="practical">Practical Tips</h2>
<p>Always encode query parameter values when constructing URLs programmatically. Never concatenate user input directly into a URL without encoding. When debugging URL issues, decode the full URL first to see actual values. The PursTech URL Encoder handles both encoding and decoding with a single click.</p>`,
  },

  "free-seo-tools-that-work-2025": {
    title: "Free SEO Tools That Actually Work in 2025",
    slug: "free-seo-tools-that-work-2025",
    excerpt: "The definitive list of the best free SEO tools for keyword research, technical audits, rank tracking, and content optimization.",
    category: "SEO", categorySlug: "seo",
    readTime: "8 min read", wordCount: 1010,
    publishedAt: "January 9, 2025", updatedAt: "January 9, 2025",
    isoPublished: "2025-01-09T12:00:00Z", isoUpdated: "2025-01-09T12:00:00Z",
    author: "PursTech Team", authorRole: "SEO Specialist",
    toc: [
      { id: "search-console",  heading: "Google Search Console" },
      { id: "analytics",       heading: "Google Analytics 4" },
      { id: "pagespeed",       heading: "PageSpeed Insights" },
      { id: "bing",            heading: "Bing Webmaster Tools" },
      { id: "screaming-frog",  heading: "Screaming Frog SEO Spider" },
      { id: "using-free",      heading: "Using Free Tools Effectively" },
    ],
    faqs: [
      { q: "What is the single best free SEO tool?", a: "Google Search Console is the most valuable free SEO tool. It provides data directly from Google about your search performance, indexing status, Core Web Vitals, and more. No other tool provides more accurate search data." },
      { q: "Do free SEO tools provide accurate data?", a: "Tools that source data directly from Google (Search Console, Analytics, PageSpeed Insights) are highly accurate. Third-party keyword research tools that estimate volumes are less accurate but still useful for relative comparisons." },
      { q: "What are Core Web Vitals and why do they matter?", a: "Core Web Vitals are three metrics Google uses as ranking factors: LCP (how fast main content loads), FID (page responsiveness), and CLS (visual stability during loading). Improving these directly improves search rankings." },
      { q: "Is Google Search Console free?", a: "Yes — completely free with no premium tier. It is provided directly by Google and provides official search performance data, index coverage reports, and Core Web Vitals scores." },
      { q: "How long does it take for SEO improvements to show results?", a: "SEO improvements typically take 3–6 months to show significant results. Technical fixes like improving page speed can show results faster, while content improvements and link building take longer to impact rankings." },
    ],
    relatedTools: [
      { name: "Word Counter",   slug: "word-counter",   icon: "📝" },
      { name: "JSON Formatter", slug: "json-formatter", icon: "💻" },
    ],
    content: `<p>SEO has a reputation for requiring expensive tools costing hundreds per month. The reality: some of the most effective SEO analysis uses free tools, many provided directly by Google. This guide covers the best free SEO tools available in 2025.</p>
<h2 id="search-console">Google Search Console</h2>
<p>Google Search Console (GSC) is the single most valuable SEO tool — completely free. GSC provides data directly from Google: which queries your pages appear for, clicks, impressions, average position, and Core Web Vitals scores. The Coverage report shows which pages are indexed and highlights errors. The Sitemaps section lets you submit sitemap.xml directly for faster crawling. GSC is the ground truth for your SEO performance.</p>
<h2 id="analytics">Google Analytics 4</h2>
<p>GA4 tracks how visitors interact with your website. The most useful SEO reports show which organic search terms drive traffic (when connected to GSC), which pages have the highest engagement, and which content performs best. GA4's engagement metrics — session duration, pages per session, bounce rate — matter because Google's algorithms incorporate user experience signals.</p>
<h2 id="pagespeed">PageSpeed Insights</h2>
<p>PageSpeed Insights (pagespeed.web.dev) analyzes Core Web Vitals for both mobile and desktop, providing specific actionable recommendations — identifying unoptimized images, render-blocking resources, and unused JavaScript. Core Web Vitals (LCP, FID, CLS) are official Google ranking factors.</p>
<h2 id="bing">Bing Webmaster Tools</h2>
<p>Bing Webmaster Tools provides similar functionality to GSC for Bing search, which has meaningful market share among Windows users. Bing also provides a free SEO analyzer that often catches issues GSC does not flag.</p>
<h2 id="screaming-frog">Screaming Frog SEO Spider</h2>
<p>Screaming Frog crawls your website like a search engine bot, identifying broken links, missing meta tags, pages blocked by robots.txt, redirect chains, and missing alt text. The free version crawls up to 500 URLs — sufficient for most small to medium websites.</p>
<h2 id="using-free">Using Free Tools Effectively</h2>
<p>The most effective SEO strategy uses Google Search Console and Analytics as the foundation, supplements with PageSpeed Insights for technical optimization, and adds keyword research tools for content planning. This stack costs nothing and covers the majority of SEO tasks small and medium websites need.</p>`,
  },

  "word-count-guide-every-platform": {
    title: "Word Count Guide: The Right Length for Every Platform",
    slug: "word-count-guide-every-platform",
    excerpt: "How many words should your content be? The definitive word count guide for blog posts, social media, emails, and SEO in 2025.",
    category: "Writing", categorySlug: "text",
    readTime: "7 min read", wordCount: 960,
    publishedAt: "January 9, 2025", updatedAt: "January 9, 2025",
    isoPublished: "2025-01-09T13:00:00Z", isoUpdated: "2025-01-09T13:00:00Z",
    author: "PursTech Team", authorRole: "Content Strategy Writer",
    toc: [
      { id: "blog-posts",  heading: "Blog Posts and Articles" },
      { id: "social",      heading: "Social Media Platforms" },
      { id: "email",       heading: "Email Marketing" },
      { id: "meta",        heading: "Meta Descriptions and Titles" },
      { id: "reader-rule", heading: "The Reader Experience Rule" },
    ],
    faqs: [
      { q: "What is the ideal blog post length for SEO?", a: "For competitive keywords, blog posts of 1,500–2,500 words consistently outperform shorter content in organic rankings. However, quality matters more than length — a focused 1,200-word post often outperforms a padded 3,000-word article." },
      { q: "How many characters should a tweet be?", a: "Twitter/X allows 280 characters, but tweets of 100–200 characters receive higher engagement. Shorter tweets leave room for retweet comments, which increases reach." },
      { q: "What is the optimal length for a marketing email?", a: "Promotional emails perform best at 50–125 words. Newsletter emails work well at 200–500 words. Open rates and click rates consistently decrease as email length exceeds 500 words." },
      { q: "How long should a meta description be?", a: "Meta descriptions should be 150–160 characters (approximately 25–30 words). Google truncates longer descriptions. Think of it as a 25-word advertisement for your content." },
      { q: "Does word count directly affect Google rankings?", a: "Not directly — Google does not use a specific word count as a ranking signal. However, longer content tends to cover topics more comprehensively, which correlates with higher rankings. Quality and relevance matter more than raw word count." },
    ],
    relatedTools: [
      { name: "Word Counter",   slug: "word-counter",   icon: "📝" },
      { name: "Diff Checker",   slug: "diff-checker",   icon: "🔍" },
      { name: "Case Converter", slug: "case-converter", icon: "🔤" },
    ],
    content: `<p>Word count is one of the most debated topics in content creation. The right length depends entirely on the context, the platform, and the reader's intent. This guide gives you specific, data-backed word count recommendations for every major platform.</p>
<h2 id="blog-posts">Blog Posts and Articles</h2>
<p>For competitive search keywords, long-form content (1,500–2,500 words) consistently outperforms shorter pieces in organic rankings. Google's algorithms correlate length with comprehensiveness — a 2,000-word guide is more likely to answer every question a searcher might have than a 400-word summary. However, Google's Helpful Content system penalizes content that appears comprehensive but provides little value. A focused 1,200-word article will outperform a 3,000-word padded article.</p>
<p>For informational guides: 1,500–2,500 words. For news articles: 500–800 words. For product reviews: 1,000–1,500 words.</p>
<h2 id="social">Social Media Platforms</h2>
<p><strong>Twitter / X:</strong> 280 characters maximum. Tweets of 100–200 characters receive higher engagement — shorter tweets leave room for retweet comments, increasing reach.</p>
<p><strong>LinkedIn:</strong> Feed posts up to 3,000 characters but truncated at ~210 characters with "see more". Your opening lines must hook the reader. LinkedIn articles perform best at 1,500–2,000 words.</p>
<p><strong>Instagram:</strong> Captions up to 2,200 characters but truncated at 125 in the feed. Posts with longer captions (138–150 words) drive higher engagement when opening lines are compelling.</p>
<p><strong>Facebook:</strong> For page posts, 40–80 words drives higher engagement than both very short and very long posts.</p>
<h2 id="email">Email Marketing</h2>
<p>Promotional emails perform best at 50–125 words — get to the point, present the offer clearly, and provide one strong call to action. Newsletter emails work well at 200–500 words. Open rates and click rates consistently decrease as length exceeds 500 words.</p>
<h2 id="meta">Meta Descriptions and Titles</h2>
<p>Meta descriptions should be 150–160 characters (25–30 words). Google truncates longer descriptions. Meta titles should be 50–60 characters (8–12 words). Titles over 60 characters are truncated with an ellipsis in search results, cutting off potentially important keywords.</p>
<h2 id="reader-rule">The Reader Experience Rule</h2>
<p>Your content should be as long as it needs to be to fully serve the reader's intent, and no longer. A reader asking "what is a QR code?" needs 200 words. A developer asking "how do I implement OAuth 2.0?" needs 2,000 words. Match your depth to your reader's need and you will rarely get word count wrong.</p>`,
  },
};

// ─── Reading Progress Bar ────────────────────────────────────────────────────
function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handler = () => {
      const el = document.documentElement;
      const st = el.scrollTop || document.body.scrollTop;
      const sh = el.scrollHeight - el.clientHeight;
      setProgress(sh > 0 ? (st / sh) * 100 : 0);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-white/5">
      <div className="h-full bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] transition-all duration-75"
        style={{ width: `${progress}%` }} />
    </div>
  );
}

// ─── TOC Component ────────────────────────────────────────────────────────────
function TableOfContents({ items }: { items: { id: string; heading: string }[] }) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY + 120;
      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].id);
        if (el && el.offsetTop <= scrollY) { setActive(items[i].id); break; }
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [items]);
  return (
    <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 sticky top-20">
      <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
        <span className="w-1 h-4 bg-[#6C3AFF] rounded-full" /> Contents
      </h3>
      <nav className="space-y-1">
        {items.map(item => (
          <a key={item.id} href={`#${item.id}`}
            className={`block text-xs py-1.5 px-2 rounded-lg transition-all leading-snug ${
              active === item.id
                ? "text-[#6C3AFF] bg-[#6C3AFF]/10 font-semibold"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}>
            {item.heading}
          </a>
        ))}
      </nav>
    </div>
  );
}

// ─── Share Buttons ────────────────────────────────────────────────────────────
function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://purstech.com/blog/${slug}`;
  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-gray-500 font-medium">Share:</span>
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank" rel="noopener noreferrer"
        className="text-xs bg-[#13131F] hover:bg-[#6C3AFF]/10 border border-white/5 hover:border-[#6C3AFF]/30 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition-all">
        𝕏 Twitter
      </a>
      <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`}
        target="_blank" rel="noopener noreferrer"
        className="text-xs bg-[#13131F] hover:bg-[#6C3AFF]/10 border border-white/5 hover:border-[#6C3AFF]/30 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition-all">
        in LinkedIn
      </a>
      <button onClick={copy}
        className="text-xs bg-[#13131F] hover:bg-[#6C3AFF]/10 border border-white/5 hover:border-[#6C3AFF]/30 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition-all">
        {copied ? "✅ Copied!" : "🔗 Copy Link"}
      </button>
    </div>
  );
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────
function FAQSection({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="mt-14">
      <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left px-5 py-4 flex items-center justify-between">
              <span className="font-semibold text-white text-sm pr-4 leading-snug">{faq.q}</span>
              <span className={`text-[#6C3AFF] text-xl flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-45" : ""}`}>+</span>
            </button>
            {open === i && (
              <div className="px-5 pb-4">
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS[params.slug];
  if (!post) notFound();

  const otherPosts = Object.values(BLOG_POSTS).filter(p => p.slug !== params.slug).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org", "@type": "Article",
    headline: post.title, description: post.excerpt,
    datePublished: post.isoPublished, dateModified: post.isoUpdated,
    author: { "@type": "Person", name: post.author, jobTitle: post.authorRole },
    publisher: { "@type": "Organization", name: "PursTech", url: "https://purstech.com" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://purstech.com/blog/${post.slug}` },
    wordCount: post.wordCount,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",  item: "https://purstech.com" },
      { "@type": "ListItem", position: 2, name: "Blog",  item: "https://purstech.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://purstech.com/blog/${post.slug}` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: post.faqs.map(faq => ({
      "@type": "Question", name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <ReadingProgress />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0.5 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">Tools</Link>
            <Link href="/blog"  className="text-sm text-gray-500 hover:text-white transition-colors">Blog</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <nav className="text-xs text-gray-600 mb-8 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link><span>›</span>
          <Link href="/blog" className="hover:text-gray-400 transition-colors">Blog</Link><span>›</span>
          <Link href={`/categories/${post.categorySlug}`} className="hover:text-gray-400 transition-colors">{post.category}</Link><span>›</span>
          <span className="text-gray-400 truncate max-w-xs">{post.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Article */}
          <article className="lg:col-span-3">

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <Link href={`/categories/${post.categorySlug}`}
                  className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-semibold hover:bg-[#6C3AFF]/20 transition-colors">
                  {post.category}
                </Link>
                <span className="text-xs text-gray-500">{post.readTime}</span>
                <span className="text-xs text-gray-600">·</span>
                <span className="text-xs text-gray-500">{post.wordCount.toLocaleString()} words</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-5">{post.title}</h1>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">{post.excerpt}</p>

              {/* Author + Dates */}
              <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-t border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#6C3AFF]/20 border border-[#6C3AFF]/30 flex items-center justify-center text-sm font-black text-[#6C3AFF]">P</div>
                  <div>
                    <div className="text-sm font-semibold text-white">{post.author}</div>
                    <div className="text-xs text-gray-500">{post.authorRole}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Published <time dateTime={post.isoPublished} className="text-gray-400 font-medium">{post.publishedAt}</time></span>
                  <span className="text-gray-700">·</span>
                  <span>Updated <time dateTime={post.isoUpdated} className="text-gray-400 font-medium">{post.updatedAt}</time></span>
                </div>
              </div>

              <div className="mt-4"><ShareButtons title={post.title} slug={post.slug} /></div>
            </div>

            {/* TOC mobile */}
            <div className="lg:hidden mb-8">
              <details className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
                <summary className="text-sm font-bold text-white cursor-pointer">📋 Table of Contents</summary>
                <nav className="mt-3 space-y-1.5">
                  {post.toc.map(item => (
                    <a key={item.id} href={`#${item.id}`}
                      className="block text-xs text-gray-500 hover:text-white py-1 pl-2 border-l-2 border-[#6C3AFF]/30 hover:border-[#6C3AFF] transition-all">
                      {item.heading}
                    </a>
                  ))}
                </nav>
              </details>
            </div>

            {/* Content */}
            <div className="
              prose prose-invert max-w-none
              prose-p:text-gray-400 prose-p:leading-relaxed prose-p:mb-4
              prose-h2:text-white prose-h2:font-extrabold prose-h2:text-xl
              prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-white/5
              prose-strong:text-white
              prose-code:text-cyan-400 prose-code:bg-[#13131F] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            " dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* Related tools */}
            {post.relatedTools.length > 0 && (
              <div className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">🔧 Try These Free Tools</h3>
                <div className="flex flex-wrap gap-3">
                  {post.relatedTools.map(tool => (
                    <Link key={tool.slug} href={`/tools/${tool.slug}`}
                      className="flex items-center gap-2 bg-[#0A0A14] hover:bg-[#6C3AFF]/10 border border-white/5 hover:border-[#6C3AFF]/30 rounded-xl px-4 py-2.5 transition-all group">
                      <span className="text-lg">{tool.icon}</span>
                      <span className="text-sm text-gray-400 group-hover:text-white transition-colors font-medium">{tool.name}</span>
                      <span className="text-gray-700 group-hover:text-[#6C3AFF] transition-colors text-sm">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <FAQSection faqs={post.faqs} />

            <div className="mt-10 pt-6 border-t border-white/5">
              <p className="text-sm text-gray-500 mb-3">Found this useful? Share it:</p>
              <ShareButtons title={post.title} slug={post.slug} />
            </div>

            {/* Read next */}
            {otherPosts.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-extrabold text-white mb-5">📖 Read Next</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {otherPosts.map(p => (
                    <Link key={p.slug} href={`/blog/${p.slug}`}
                      className="group bg-[#13131F] border border-white/5 rounded-2xl p-4 hover:border-[#6C3AFF]/30 transition-all">
                      <div className="text-xs text-[#6C3AFF] font-medium mb-2">{p.category}</div>
                      <h3 className="text-sm font-bold text-white group-hover:text-[#6C3AFF] transition-colors leading-snug line-clamp-2">{p.title}</h3>
                      <div className="text-xs text-gray-600 mt-2">{p.readTime}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-5">
            <TableOfContents items={post.toc} />
            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-white text-sm mb-1">20+ Free Tools</h3>
              <p className="text-gray-500 text-xs mb-4">No login. Instant results.</p>
              <Link href="/tools" className="block w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all text-center">Browse Tools →</Link>
            </div>
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">More Articles</h3>
              <div className="space-y-4">
                {otherPosts.map(p => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="block group">
                    <div className="text-xs text-[#6C3AFF] font-medium mb-1">{p.category}</div>
                    <div className="text-xs text-gray-400 group-hover:text-white transition-colors leading-snug line-clamp-2">{p.title}</div>
                  </Link>
                ))}
              </div>
              <Link href="/blog" className="block mt-4 text-xs text-[#6C3AFF] hover:text-[#00D4FF] transition-colors font-semibold">All posts →</Link>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-white/5 mt-20 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2025 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
