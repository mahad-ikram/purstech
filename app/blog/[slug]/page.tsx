import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const BLOG_POSTS: Record<string, {
  title:        string;
  slug:         string;
  excerpt:      string;
  category:     string;
  readTime:     string;
  publishedAt:  string;
  updatedAt:    string;
  publishedISO: string;
  updatedISO:   string;
  content:      string;
  faqs:         { q: string; a: string }[];
  keywords:     string[];
  relatedTools: { name: string; slug: string; icon: string }[];
}> = {

  // ── POST 1 ──────────────────────────────────────────────────────────────────
  "best-free-json-formatter-tools-2025": {
    title:        "Best Free JSON Formatter Tools Online in 2025",
    slug:         "best-free-json-formatter-tools-2025",
    excerpt:      "Discover the top free JSON formatter and validator tools available online. We compare speed, features and ease of use so you can pick the right one.",
    category:     "Developer Tools",
    readTime:     "6 min read",
    publishedAt:  "January 8, 2025",
    updatedAt:    "January 15, 2025",
    publishedISO: "2025-01-08T10:00:00Z",
    updatedISO:   "2025-01-15T10:00:00Z",
    keywords:     ["json formatter", "free json tools", "json validator", "json beautifier", "online developer tools"],
    relatedTools: [
      { name: "JSON Formatter", slug: "json-formatter", icon: "💻" },
      { name: "Base64 Encoder", slug: "base64-encoder", icon: "🔐" },
      { name: "URL Encoder",    slug: "url-encoder",    icon: "🔗" },
    ],
    faqs: [
      { q: "What is a JSON formatter?",
        a: "A JSON formatter takes minified or messy JSON data and reformats it with proper indentation and syntax highlighting, making the structure readable for humans while remaining valid for machines to parse." },
      { q: "Is it safe to paste sensitive data into an online JSON formatter?",
        a: "The PursTech JSON Formatter processes everything in your browser — your data never leaves your device. Always verify that any formatter you use runs client-side only before pasting sensitive information." },
      { q: "What is the difference between formatting and validating JSON?",
        a: "Formatting changes how JSON looks by adding whitespace and indentation. Validation checks whether the JSON is syntactically correct — looking for missing commas, unmatched brackets and unquoted keys." },
      { q: "Can a JSON formatter fix broken JSON automatically?",
        a: "Most formatters highlight errors clearly but require you to fix them manually. Common issues like missing commas, single-quoted strings and unquoted keys must be corrected by the user." },
      { q: "What is the difference between JSON and JSON5?",
        a: "JSON5 extends standard JSON to allow comments, trailing commas and unquoted keys. Standard JSON formatters only support strict JSON as defined by RFC 8259." },
    ],
    content: `
<p>JSON has become the universal language of the web. Whether you are building an API, debugging a webhook, or reading configuration files, you are dealing with JSON every single day. The problem? Raw JSON is almost unreadable when it arrives as one long, minified string.</p>
<p>A good JSON formatter takes that messy string and instantly transforms it into a clean, indented, human-readable structure. The best ones also validate your JSON, highlight errors, and let you minify it back when you need to save bandwidth.</p>

<h2 id="what-makes-good">What Makes a Good JSON Formatter?</h2>
<p><strong>Speed:</strong> The tool should format instantly with no server round-trips. The best formatters run entirely in your browser, meaning your data never leaves your device.</p>
<p><strong>Error detection:</strong> A formatter that crashes on invalid JSON is useless for debugging. The best tools highlight exactly where your JSON is broken and explain what went wrong.</p>
<p><strong>Syntax highlighting:</strong> Color-coded output makes JSON far easier to scan. Keys, strings, numbers, booleans and null values should each have a distinct color.</p>
<p><strong>Minification:</strong> Sometimes you need the opposite — stripping all whitespace for the smallest possible JSON string. A quality formatter includes a one-click minify button.</p>

<h2 id="purstech-formatter">PursTech JSON Formatter</h2>
<p>The PursTech JSON Formatter formats instantly with full syntax highlighting, 2-space and 4-space indentation options, a minify button with size reduction percentage, and a validate-only mode. All processing happens in your browser — nothing is ever sent to a server.</p>

<h2 id="common-errors">Common JSON Errors and How to Fix Them</h2>
<p><strong>Trailing comma:</strong> JSON does not allow a comma after the last item in an array or object. Remove the final comma before the closing bracket.</p>
<p><strong>Single quotes:</strong> JSON requires double quotes for all strings and keys. Replace any single quotes with double quotes.</p>
<p><strong>Unquoted keys:</strong> Every key must be wrapped in double quotes. <code>{name: "John"}</code> is invalid — correct JSON is <code>{"name": "John"}</code>.</p>
<p><strong>Missing comma:</strong> Every item except the last must be followed by a comma. A missing comma is one of the most common parse errors.</p>

<h2 id="workflow-uses">When to Use JSON Formatting</h2>
<p><strong>API development:</strong> Format raw responses to produce clean, readable documentation examples.</p>
<p><strong>Code review:</strong> A formatted view makes it far easier to spot changes in JSON configuration files.</p>
<p><strong>Logging:</strong> Application logs with JSON payloads become readable instantly when passed through a formatter.</p>
<p><strong>Config files:</strong> JSON configs for ESLint, Prettier and package.json are much easier to edit with a formatter that catches errors before you save.</p>

<h2 id="json-vs-others">JSON vs Other Data Formats</h2>
<p>JSON won out over XML and YAML for most API use cases because it is lighter than XML, more widely supported than YAML, and directly compatible with JavaScript objects. Most modern languages can parse JSON natively without additional libraries.</p>

<h2 id="try-it">Try It Now</h2>
<p>Paste any JSON into the PursTech JSON Formatter and click Format. Whether you are a developer debugging an API or a non-technical user reading a config file, a clean formatted view makes all the difference.</p>
    `,
  },

  // ── POST 2 ──────────────────────────────────────────────────────────────────
  "how-to-compress-images-without-losing-quality": {
    title:        "How to Compress Images Without Losing Quality",
    slug:         "how-to-compress-images-without-losing-quality",
    excerpt:      "A practical guide to reducing image file sizes for the web — which formats to use, how much compression is safe, and the free tools that do it best.",
    category:     "Image Tools",
    readTime:     "7 min read",
    publishedAt:  "January 8, 2025",
    updatedAt:    "January 15, 2025",
    publishedISO: "2025-01-08T11:00:00Z",
    updatedISO:   "2025-01-15T11:00:00Z",
    keywords:     ["image compression", "compress images online", "reduce image size", "lossless compression", "webp format"],
    relatedTools: [
      { name: "Color Picker",      slug: "color-picker",      icon: "🎨" },
      { name: "QR Code Generator", slug: "qr-code-generator", icon: "🔲" },
    ],
    faqs: [
      { q: "How much can I compress a JPEG without losing quality?",
        a: "Quality settings between 70 and 85 percent produce files 60 to 75 percent smaller than the original with no visible quality loss for most content." },
      { q: "What is the best image format for websites in 2025?",
        a: "WebP is the best modern format — 25 to 35 percent smaller than JPEG at equivalent quality. All modern browsers support WebP. Use JPEG as a fallback and PNG only for images requiring transparency." },
      { q: "Does compressing images hurt my SEO?",
        a: "The opposite — compressed images dramatically improve SEO. Page speed is a Google ranking factor and unoptimized images are the leading cause of poor Core Web Vitals scores." },
      { q: "What is the difference between lossy and lossless compression?",
        a: "Lossy compression permanently removes some image data to achieve smaller files. Lossless compression reduces file size without discarding any data. JPEG uses lossy; PNG uses lossless." },
      { q: "Should I resize images before compressing them?",
        a: "Yes — always resize to the actual display dimensions first. Compressing a 4000px image displayed at 800px wastes bandwidth. A correctly sized image compresses far more efficiently." },
    ],
    content: `
<p>Images are the single biggest contributor to slow websites. A webpage with unoptimized images can be 5 to 10 times larger than it needs to be, causing longer load times, higher bounce rates and lower search rankings. Modern compression algorithms can reduce a JPEG by 60 to 80 percent with no visible quality loss.</p>

<h2 id="lossy-vs-lossless">Lossy vs Lossless Compression</h2>
<p><strong>Lossy compression</strong> permanently removes subtle image data to achieve smaller files. JPEG uses lossy compression — ideal for photographs where minor quality loss is acceptable.</p>
<p><strong>Lossless compression</strong> reduces file size without discarding any data. PNG uses lossless compression, making it right for logos, screenshots and images where any quality loss would be visible.</p>

<h2 id="which-format">Which Image Format Should You Use?</h2>
<p><strong>JPEG</strong> is best for photographs and product images — can be 10 to 20 times smaller than the equivalent PNG with virtually no visible difference.</p>
<p><strong>PNG</strong> is best for logos, icons, screenshots and images requiring transparency.</p>
<p><strong>WebP</strong> provides 25 to 35 percent smaller files than JPEG at the same quality. All modern browsers support it — the best choice for new web content.</p>
<p><strong>SVG</strong> is a vector format for icons and illustrations that scales perfectly to any size.</p>

<h2 id="safe-compression">How Much Compression Is Safe?</h2>
<p>For JPEG, quality settings between 70 and 85 percent produce files 60 to 75 percent smaller with no perceptible quality loss. Below 60 percent, compression artifacts begin to appear. For hero images, stay above 75 percent. For thumbnails, 50 to 60 percent is often acceptable.</p>

<h2 id="dimensions">Dimensions Matter as Much as Compression</h2>
<p>Always resize to your actual display dimensions first. Good rules of thumb: hero images at 1200–1600px wide, blog images at 800–1200px, thumbnails at 400–600px.</p>

<h2 id="seo-performance">Impact on Performance and SEO</h2>
<p>Google's Core Web Vitals LCP metric measures how quickly the main image loads — unoptimized images are the leading cause of poor LCP scores. Research shows a one-second delay in load time reduces conversions by 7 percent.</p>

<h2 id="best-practices">Best Practices</h2>
<p>Always compress before uploading. Use WebP as your primary format. Keep originals separately so you can recompress at different settings later. Test results on both desktop and mobile.</p>
    `,
  },

  // ── POST 3 ──────────────────────────────────────────────────────────────────
  "strong-password-guide-2025": {
    title:        "What Makes a Password Strong? The Complete 2025 Guide",
    slug:         "strong-password-guide-2025",
    excerpt:      "Everything you need to know about creating and managing strong passwords — length, complexity, common mistakes and how to stay secure in 2025.",
    category:     "Security",
    readTime:     "8 min read",
    publishedAt:  "January 8, 2025",
    updatedAt:    "January 15, 2025",
    publishedISO: "2025-01-08T12:00:00Z",
    updatedISO:   "2025-01-15T12:00:00Z",
    keywords:     ["strong password", "password security", "password manager", "two factor authentication", "create secure password"],
    relatedTools: [
      { name: "Password Generator", slug: "password-generator", icon: "🔐" },
      { name: "Hash Generator",     slug: "hash-generator",     icon: "🔑" },
    ],
    faqs: [
      { q: "How long should my password be in 2025?",
        a: "Security experts recommend a minimum of 14 characters for important accounts, with 16 to 20 characters being ideal. Length matters more than complexity — each additional character exponentially increases crack time." },
      { q: "Are password managers actually safe to use?",
        a: "Yes. Reputable managers like Bitwarden, 1Password and Dashlane use end-to-end encryption — even the host company cannot read your passwords. The risk of one forgotten master password is far smaller than reusing weak passwords everywhere." },
      { q: "Should I change my passwords regularly?",
        a: "Modern guidance no longer recommends regular changes. Change a password only when you suspect it has been compromised. Forced changes encourage weak, predictable patterns rather than improving security." },
      { q: "What makes a password like P@ssw0rd123 weak despite using symbols?",
        a: "Substituting numbers for letters — @ for a, 3 for e — is a pattern attackers explicitly target. These substitutions are built into every major cracking dictionary and provide almost no additional security." },
      { q: "Is two-factor authentication worth setting up?",
        a: "Absolutely — 2FA blocks 99.9 percent of automated account compromise attempts. Even if your password is stolen, attackers cannot log in without your second factor." },
    ],
    content: `
<p>Despite years of expert advice, the most common passwords in data breaches are still "123456", "password" and "qwerty". Understanding what actually makes a password strong is the foundation of protecting your online accounts.</p>

<h2 id="entropy">The Science Behind Password Strength</h2>
<p>Password strength is measured in bits of entropy — a mathematical representation of unpredictability. A 16-character random password from a 94-character pool has about 104 bits of entropy, considered very strong by current standards.</p>

<h2 id="length">Length Is the Single Most Important Factor</h2>
<p>Every additional character multiplies the number of possible combinations by the character pool size. A 16-character lowercase password has 450,000 times more combinations than a 12-character one. No substitution trick comes close to this improvement.</p>

<h2 id="mistakes">Common Password Mistakes</h2>
<p><strong>Dictionary words:</strong> Cracking tools run through entire dictionaries in seconds — any real word is vulnerable.</p>
<p><strong>Predictable substitutions:</strong> Replacing "a" with "@" or "e" with "3" is built into every cracking dictionary.</p>
<p><strong>Keyboard patterns:</strong> Sequences like "qwerty" and "asdfgh" are among the very first guesses any tool tries.</p>
<p><strong>Password reuse:</strong> When one service is breached, attackers immediately try the same credentials on hundreds of other services — called credential stuffing.</p>

<h2 id="generating">How to Generate a Truly Strong Password</h2>
<p>The PursTech Password Generator uses your browser's <code>crypto.getRandomValues()</code> API — the same technology used in SSL certificates and banking systems — producing passwords that are statistically indistinguishable from true randomness.</p>

<h2 id="managers">Password Managers</h2>
<p>The only realistic way to use strong, unique passwords for every account is a password manager. Bitwarden is free and open-source. 1Password and Dashlane are excellent paid options. All sync securely across your devices.</p>

<h2 id="2fa">Two-Factor Authentication</h2>
<p>2FA adds a layer requiring physical possession of your phone. Enable it on every account that supports it — especially email, banking and social media.</p>
    `,
  },

  // ── POST 4 ──────────────────────────────────────────────────────────────────
  "hex-vs-rgb-vs-hsl-color-formats": {
    title:        "HEX vs RGB vs HSL: Which Color Format Should You Use?",
    slug:         "hex-vs-rgb-vs-hsl-color-formats",
    excerpt:      "A complete guide to web color formats for developers and designers — when to use HEX, RGB, HSL and how to convert between them instantly.",
    category:     "Design",
    readTime:     "6 min read",
    publishedAt:  "January 8, 2025",
    updatedAt:    "January 15, 2025",
    publishedISO: "2025-01-08T13:00:00Z",
    updatedISO:   "2025-01-15T13:00:00Z",
    keywords:     ["hex color code", "rgb color", "hsl color", "web color formats", "css colors", "color picker online"],
    relatedTools: [
      { name: "Color Picker", slug: "color-picker", icon: "🎨" },
      { name: "CSS Minifier", slug: "css-minifier", icon: "⚡" },
    ],
    faqs: [
      { q: "What is the difference between HEX and RGB?",
        a: "HEX and RGB represent the same color model — red, green and blue channels — in different number systems. HEX uses base-16 notation (00–FF) while RGB uses decimal (0–255). They are interchangeable and represent identical colors." },
      { q: "When should I use HSL instead of HEX or RGB?",
        a: "Use HSL when building design systems or creating color variations. HSL lets you adjust lightness and saturation directly, making it trivial to create lighter or darker shades without recalculating RGB values from scratch." },
      { q: "How do I add transparency to a color in CSS?",
        a: "Use RGBA or HSLA — both add a fourth alpha channel for opacity between 0 (fully transparent) and 1 (fully opaque). For example, rgba(108, 58, 255, 0.5) produces a 50% transparent violet." },
      { q: "Which color format does Figma use by default?",
        a: "Figma displays colors in HEX by default, but you can switch to RGB or HSL in the color panel. Most design handoff tools export in HEX, which is why it remains the most common format in CSS codebases." },
      { q: "Can I use HSL for all CSS colors?",
        a: "Yes — HSL is fully supported in all modern browsers and is preferred in design systems for its human-readable nature. CSS also supports newer color spaces like OKLCH in the latest browser versions." },
    ],
    content: `
<p>Color is one of the most fundamental aspects of web design, yet the number of color formats — HEX, RGB, HSL, RGBA, HSLA — confuses even experienced developers. Each format has specific strengths suited to different situations.</p>

<h2 id="hex">HEX Color Codes</h2>
<p>HEX is the most widely used web color format. A HEX code consists of a hash followed by six characters: <code>#RRGGBB</code>. Each pair represents red, green and blue channels in base 16, ranging from 00 to FF. Pure red is <code>#FF0000</code>, white is <code>#FFFFFF</code>, black is <code>#000000</code>. HEX is compact, universally supported, and the default output of most design tools including Figma and Adobe XD.</p>

<h2 id="rgb">RGB Color Values</h2>
<p>RGB defines colors using three numbers between 0 and 255: <code>rgb(255, 0, 0)</code> for pure red. Mathematically identical to HEX but in decimal notation. More intuitive for programmatic manipulation — animating or calculating colors dynamically is simpler in decimal. RGBA adds a fourth opacity channel: <code>rgba(255, 0, 0, 0.5)</code> for semi-transparent red.</p>

<h2 id="hsl">HSL — The Designer's Format</h2>
<p>HSL describes color in human terms: <strong>Hue</strong> (0–360 degrees on the color wheel), <strong>Saturation</strong> (vividness, 0–100%), and <strong>Lightness</strong> (brightness, 0–100%). Creating a lighter shade means increasing the lightness value. Finding a complementary color means adding 180 degrees to the hue. No RGB recalculation needed.</p>

<h2 id="when-to-use">When to Use Each Format</h2>
<p>Use <strong>HEX</strong> for static colors from design handoffs and brand guidelines. Use <strong>RGB/RGBA</strong> when you need transparency or are manipulating colors in JavaScript. Use <strong>HSL/HSLA</strong> for design systems, themes and programmatic color variations.</p>

<h2 id="converting">Converting Between Formats</h2>
<p>All three formats represent the same color space in different notations. The PursTech Color Picker converts between all formats instantly — enter any color in any format and immediately see HEX, RGB, HSL, HSV and CMYK equivalents, ready to copy.</p>
    `,
  },

  // ── POST 5 ──────────────────────────────────────────────────────────────────
  "qr-codes-for-business-complete-guide": {
    title:        "QR Codes for Business: The Complete 2025 Guide",
    slug:         "qr-codes-for-business-complete-guide",
    excerpt:      "Everything businesses need to know about QR codes in 2025 — how they work, the best use cases, design tips and how to generate them for free.",
    category:     "Developer Tools",
    readTime:     "7 min read",
    publishedAt:  "January 9, 2025",
    updatedAt:    "January 15, 2025",
    publishedISO: "2025-01-09T10:00:00Z",
    updatedISO:   "2025-01-15T10:00:00Z",
    keywords:     ["qr code generator", "free qr code", "qr code business", "create qr code online", "qr code marketing 2025"],
    relatedTools: [
      { name: "QR Code Generator", slug: "qr-code-generator", icon: "🔲" },
      { name: "URL Encoder",       slug: "url-encoder",       icon: "🔗" },
    ],
    faqs: [
      { q: "How do I create a QR code for free?",
        a: "The PursTech QR Code Generator creates static QR codes for free with no sign-up. Enter any URL, text, WiFi credentials or contact information, click Generate, and download as PNG or SVG instantly." },
      { q: "What is the minimum print size for a QR code?",
        a: "For reliable scanning at arm's length, a minimum of 2cm × 2cm is required for printed materials. For posters and banners, aim for at least 10cm × 10cm." },
      { q: "What is the difference between static and dynamic QR codes?",
        a: "Static QR codes encode the destination directly and cannot be changed after printing. Dynamic codes point to a redirect, allowing you to update the destination URL without reprinting, and also provide scan analytics." },
      { q: "Can I put a logo inside a QR code?",
        a: "Yes — QR codes include error correction allowing up to 30% of the code to be obscured. Using the highest error correction level (H), you can safely place a logo in the center while maintaining full scannability." },
      { q: "Will QR codes still work in 2025?",
        a: "Absolutely. QR scanning is natively built into the default camera app on all modern iOS and Android devices. Usage has continued growing since the pandemic accelerated mainstream adoption." },
    ],
    content: `
<p>QR codes went from a niche logistics technology to a mainstream consumer tool seemingly overnight. Today businesses of every size use them in ways that were considered niche just five years ago.</p>

<h2 id="how-they-work">How QR Codes Work</h2>
<p>A QR (Quick Response) code is a two-dimensional barcode encoding data as a matrix of black and white squares. Unlike traditional barcodes that store about 20 characters, QR codes can encode up to 4,296 alphanumeric characters. QR codes include built-in error correction allowing them to remain readable even when up to 30 percent is damaged — which is why a centered logo still scans correctly.</p>

<h2 id="use-cases">Best Business Use Cases</h2>
<p><strong>Restaurant menus:</strong> Digital menus reduce printing costs and allow instant updates when items change.</p>
<p><strong>Product packaging:</strong> Link to assembly instructions, warranty registration, ingredient details or video demonstrations.</p>
<p><strong>Business cards:</strong> A QR code that adds your contact directly to someone's phone is far more likely to be saved than a card requiring manual data entry.</p>
<p><strong>Marketing campaigns:</strong> QR codes on print materials bridge physical and digital marketing — no typing required.</p>
<p><strong>WiFi sharing:</strong> Auto-connect guests to WiFi by scanning a code — no password reading required.</p>

<h2 id="design-tips">Design Best Practices</h2>
<p><strong>Size:</strong> Minimum 2cm × 2cm for printed materials at arm's length. At least 10cm × 10cm for posters.</p>
<p><strong>Contrast:</strong> Black on white is optimal. Avoid low-contrast color combinations.</p>
<p><strong>Error correction:</strong> Use the highest level (H) for printed materials — tolerates up to 30% damage.</p>
<p><strong>Always test before printing:</strong> Scan with at least two different devices before committing to a print run.</p>

<h2 id="static-vs-dynamic">Static vs Dynamic QR Codes</h2>
<p>Static codes are simpler and completely free — ideal for single-use or low-volume applications. Dynamic codes allow destination updates and provide scan analytics. The PursTech QR Code Generator creates static codes ready for immediate use.</p>
    `,
  },

  // ── POST 6 ──────────────────────────────────────────────────────────────────
  "base64-encoding-explained": {
    title:        "Base64 Encoding Explained: A Developer's Guide",
    slug:         "base64-encoding-explained",
    excerpt:      "What is Base64 encoding, how does it work and when should you use it? A practical guide for developers with real-world examples.",
    category:     "Developer Tools",
    readTime:     "6 min read",
    publishedAt:  "January 9, 2025",
    updatedAt:    "January 15, 2025",
    publishedISO: "2025-01-09T11:00:00Z",
    updatedISO:   "2025-01-15T11:00:00Z",
    keywords:     ["base64 encoding", "base64 decoder online", "what is base64", "encode decode base64", "base64 javascript"],
    relatedTools: [
      { name: "Base64 Encoder", slug: "base64-encoder", icon: "🔐" },
      { name: "URL Encoder",    slug: "url-encoder",    icon: "🔗" },
      { name: "Hash Generator", slug: "hash-generator", icon: "🔑" },
    ],
    faqs: [
      { q: "Is Base64 encoding the same as encryption?",
        a: "No — Base64 is encoding, not encryption. It provides zero security. Anyone can decode a Base64 string instantly using any decoder. Never use Base64 to protect sensitive data like passwords or API keys." },
      { q: "Why does Base64 make data larger?",
        a: "Base64 converts every 3 bytes of input into 4 output characters, meaning Base64-encoded data is always approximately 33 percent larger than the original binary data." },
      { q: "What is the difference between Base64 and Base64URL?",
        a: "Standard Base64 uses + and / which have special meanings in URLs. Base64URL replaces + with - and / with _, making the encoded string safe to include in URLs without percent-encoding." },
      { q: "When should I use Base64 for images in CSS?",
        a: "Only for very small images like tiny icons. Base64 data URIs eliminate an HTTP request but increase CSS file size by 33%. For images larger than about 10KB, a separate file request is more efficient." },
      { q: "How do I decode a Base64 string in JavaScript?",
        a: "Use atob() for decoding and btoa() for encoding in the browser. For Node.js, use Buffer.from(str, 'base64').toString('utf8') for decoding. The PursTech Base64 Encoder also handles both instantly in the browser." },
    ],
    content: `
<p>Base64 is one of those encoding schemes that developers encounter constantly but rarely fully understand. You see it in JWT tokens, email attachments, CSS data URIs and API authentication headers. This guide explains what Base64 is, how it works and when to use it.</p>

<h2 id="what-is-base64">What Is Base64?</h2>
<p>Base64 is a binary-to-text encoding scheme that represents binary data using only 64 printable ASCII characters: uppercase A–Z, lowercase a–z, digits 0–9, plus sign and forward slash. The name comes from this 64-character alphabet — just as we call our number system Base10 and hexadecimal Base16.</p>

<h2 id="why-it-exists">Why Does Base64 Exist?</h2>
<p>Many systems designed to handle text — including email protocols, HTTP headers and URLs — were not built to safely transmit arbitrary binary data. Binary data can contain control characters that text-based systems interpret as commands. Base64 solves this by converting binary into a format containing only safe, printable characters.</p>

<h2 id="how-it-works">How the Encoding Works</h2>
<p>Base64 groups input bytes into sets of three (24 bits), splits each group into four 6-bit values, then maps each to a character in the Base64 alphabet. Because every 3 bytes produces 4 characters, encoded data is always approximately one third larger than the original.</p>

<h2 id="use-cases">Common Use Cases</h2>
<p><strong>Email attachments:</strong> MIME uses Base64 to encode binary files for transmission through email systems originally designed for plain text.</p>
<p><strong>CSS data URIs:</strong> Small images embedded in stylesheets as Base64 data URIs eliminate a separate HTTP request — useful for tiny icons but counterproductive for larger images.</p>
<p><strong>HTTP Basic Auth:</strong> Credentials are Base64-encoded in the Authorization header. Always use HTTPS — Base64 is not encryption.</p>
<p><strong>JWT tokens:</strong> JSON Web Tokens consist of three Base64URL-encoded sections containing JSON header, payload and signature data.</p>

<h2 id="not-encryption">What Base64 Is Not</h2>
<p>Base64 is encoding, not encryption. It provides zero security. Never use it to protect sensitive data — it only changes how data looks, not how accessible it is.</p>

<h2 id="url-safe">URL-Safe Base64</h2>
<p>Standard Base64 uses + and / which have special meanings in URLs. URL-safe Base64 replaces these with - and _, making strings safe for URLs. Most JWT implementations use URL-safe Base64 without padding.</p>
    `,
  },

  // ── POST 7 ──────────────────────────────────────────────────────────────────
  "bmi-calculator-guide-what-your-score-means": {
    title:        "BMI Calculator: What Your Score Actually Means",
    slug:         "bmi-calculator-guide-what-your-score-means",
    excerpt:      "A complete guide to BMI — how it is calculated, what the categories mean, its limitations and how to use it alongside other health metrics.",
    category:     "Health & Fitness",
    readTime:     "7 min read",
    publishedAt:  "January 9, 2025",
    updatedAt:    "January 15, 2025",
    publishedISO: "2025-01-09T12:00:00Z",
    updatedISO:   "2025-01-15T12:00:00Z",
    keywords:     ["bmi calculator", "body mass index", "healthy bmi range", "calculate bmi online", "bmi chart adults"],
    relatedTools: [
      { name: "BMI Calculator", slug: "bmi-calculator", icon: "⚖️" },
      { name: "Age Calculator", slug: "age-calculator", icon: "🎂" },
      { name: "Unit Converter", slug: "unit-converter", icon: "📏" },
    ],
    faqs: [
      { q: "What is a healthy BMI range?",
        a: "The World Health Organization defines healthy BMI as 18.5 to 24.9. Below 18.5 is underweight, 25–29.9 is overweight, and 30 or above is obese. These thresholds were established from large population studies." },
      { q: "Is BMI an accurate measure of individual health?",
        a: "BMI is a useful population-level screening tool but has significant individual limitations. It does not distinguish between muscle and fat — a muscular athlete can have an 'obese' BMI despite excellent health. Doctors combine BMI with other metrics for a complete picture." },
      { q: "How is BMI calculated?",
        a: "BMI equals weight in kilograms divided by height in meters squared. In imperial units: BMI = (weight in pounds × 703) ÷ height in inches squared. The PursTech BMI Calculator handles both metric and imperial inputs automatically." },
      { q: "Does BMI differ for men and women?",
        a: "The standard categories are the same for men and women. However, at the same BMI, women typically have higher body fat percentages than men due to physiological differences. Some researchers advocate for sex-specific adjustments." },
      { q: "Should I use BMI to track fitness progress?",
        a: "BMI has limited value for individual fitness tracking because muscle weighs more than fat. Someone gaining muscle while losing fat may see no BMI change despite significant body composition improvement. Waist circumference and body fat percentage are better progress metrics." },
    ],
    content: `
<p>Body Mass Index (BMI) is one of the most widely used health screening tools in the world, yet it is also one of the most misunderstood. Millions of people check their BMI without truly understanding what it measures, what it does not measure, and how much weight to give it.</p>

<h2 id="how-calculated">How BMI Is Calculated</h2>
<p>BMI is a simple ratio of weight to height squared. In metric: BMI = weight (kg) ÷ height (m)². In imperial: BMI = (weight in pounds × 703) ÷ height in inches². The result falls into four WHO categories: underweight (below 18.5), normal weight (18.5–24.9), overweight (25–29.9), and obese (30+).</p>

<h2 id="history">The History of BMI</h2>
<p>BMI was developed in the 1830s by Belgian mathematician Adolphe Quetelet to study population weight distributions — explicitly not for use on individuals. The term "Body Mass Index" was coined in 1972 by Ancel Keys. It was adopted worldwide because it requires only a scale and height measurement.</p>

<h2 id="limitations">What BMI Does Not Measure</h2>
<p>BMI measures the ratio of weight to height. It does not measure body fat, muscle mass, bone density, waist circumference or fat distribution. A professional bodybuilder with 10% body fat might have a BMI of 30 (classified obese). A sedentary person with high body fat might have a BMI of 24 (classified normal). Both classifications mislead.</p>

<h2 id="why-useful">Why BMI Is Still Useful</h2>
<p>At the extremes, BMI correlates well with actual health risks. A BMI above 35 is strongly associated with type 2 diabetes and cardiovascular disease. For clinical decisions, doctors combine BMI with waist circumference, blood pressure, blood glucose and cholesterol levels.</p>

<h2 id="populations">BMI Across Different Populations</h2>
<p>Standard categories were derived primarily from European population studies. People of Asian descent tend to have higher body fat percentages at the same BMI, leading some health organizations to recommend a lower overweight threshold of 23 for these populations.</p>

<h2 id="better-metrics">Using BMI Alongside Other Metrics</h2>
<p>Waist circumference is a particularly important complement — a waist above 102cm (men) or 88cm (women) indicates elevated metabolic risk regardless of BMI. Combined, these two measurements provide a much more complete health picture than either alone.</p>
    `,
  },

  // ── POST 8 ──────────────────────────────────────────────────────────────────
  "url-encoding-developer-guide": {
    title:        "URL Encoding Explained: A Developer's Complete Guide",
    slug:         "url-encoding-developer-guide",
    excerpt:      "What is URL encoding, why it matters and how to use it correctly in web applications. Everything developers need to know about percent-encoding.",
    category:     "Developer Tools",
    readTime:     "6 min read",
    publishedAt:  "January 9, 2025",
    updatedAt:    "January 15, 2025",
    publishedISO: "2025-01-09T13:00:00Z",
    updatedISO:   "2025-01-15T13:00:00Z",
    keywords:     ["url encoding", "percent encoding", "url encoder decoder online", "encodeURIComponent javascript", "url decode special characters"],
    relatedTools: [
      { name: "URL Encoder",    slug: "url-encoder",    icon: "🔗" },
      { name: "Base64 Encoder", slug: "base64-encoder", icon: "🔐" },
      { name: "JSON Formatter", slug: "json-formatter", icon: "💻" },
    ],
    faqs: [
      { q: "What is URL encoding and why is it necessary?",
        a: "URL encoding converts special characters into a format safe for transmission in a URL. Characters like spaces, ampersands and equals signs have special structural meanings in URLs and must be encoded when used as data values." },
      { q: "What is the difference between encodeURI and encodeURIComponent?",
        a: "encodeURI encodes a complete URL, leaving URL structure characters like : / ? = unencoded. encodeURIComponent encodes individual parameter values, encoding everything except unreserved characters. Always use encodeURIComponent for query parameter values." },
      { q: "What does %20 mean in a URL?",
        a: "%20 is the percent-encoded representation of a space character. ASCII value 32 in hexadecimal is 20. You may also see + used for spaces in query strings, which is an older encoding convention from HTML forms." },
      { q: "How do I decode a URL-encoded string?",
        a: "Use the PursTech URL Encoder — paste any encoded string and click Decode. In JavaScript, use decodeURIComponent() for individual values or decodeURI() for complete URLs." },
      { q: "Is URL encoding the same as HTML encoding?",
        a: "No — URL encoding uses % followed by hex digits. HTML encoding uses & followed by a name or number and semicolon. They are different systems designed for different contexts." },
    ],
    content: `
<p>URLs are the addressing system of the web — every resource has one. But URLs were designed with a limited character set, and the modern web constantly needs to pass data containing characters outside that set. URL encoding, also called percent-encoding, is the solution that makes this possible.</p>

<h2 id="why-restricted">Why URLs Have Character Restrictions</h2>
<p>The URL specification (RFC 3986) defines "unreserved characters" safe anywhere in a URL: letters, digits, hyphens, underscores, periods and tildes. All other characters — including spaces, ampersands and equals signs — have special structural meanings or are not guaranteed to be handled correctly by all systems.</p>

<h2 id="how-it-works">How Percent-Encoding Works</h2>
<p>Percent-encoding replaces a character with a percent sign followed by the two-digit hexadecimal value of that character in UTF-8. A space (ASCII 32, hex 20) becomes %20. An ampersand (hex 26) becomes %26. For non-ASCII characters, the character is first encoded as UTF-8 bytes and each byte is percent-encoded separately.</p>

<h2 id="encodeuricomponent">encodeURI vs encodeURIComponent</h2>
<p><code>encodeURI()</code> is for encoding a complete URL — it leaves structure characters like <code>: / ? = &amp;</code> unencoded.</p>
<p><code>encodeURIComponent()</code> is for encoding a single component like a query value — it encodes everything except unreserved characters. The most common mistake is using encodeURI for parameter values containing ampersands or equals signs.</p>

<h2 id="query-strings">URL Encoding in Query Strings</h2>
<p>Query strings use the format <code>key=value&key2=value2</code>. Both keys and values must be encoded. The unencoded query <code>search=JSON & XML</code> parses as two separate parameters. Correctly encoded: <code>search=JSON%20%26%20XML</code>.</p>

<h2 id="url-safe-base64">URL-Safe Base64</h2>
<p>Standard Base64 uses + and / which require encoding in URLs. URL-safe Base64 replaces these with - and _, producing strings safe for URLs without additional encoding — used in JWT tokens and OAuth parameters.</p>

<h2 id="practical-tips">Practical Tips</h2>
<p>Always encode query parameter values when constructing URLs programmatically. Never concatenate user input into a URL without encoding. When debugging URL issues, decode the full URL first — the PursTech URL Encoder handles both encoding and decoding with a single click.</p>
    `,
  },

  // ── POST 9 ──────────────────────────────────────────────────────────────────
  "free-seo-tools-that-work-2025": {
    title:        "Free SEO Tools That Actually Work in 2025",
    slug:         "free-seo-tools-that-work-2025",
    excerpt:      "The definitive list of the best free SEO tools for keyword research, technical audits, rank tracking and content optimization in 2025.",
    category:     "SEO",
    readTime:     "8 min read",
    publishedAt:  "January 9, 2025",
    updatedAt:    "January 15, 2025",
    publishedISO: "2025-01-09T14:00:00Z",
    updatedISO:   "2025-01-15T14:00:00Z",
    keywords:     ["free seo tools 2025", "google search console", "seo audit free", "keyword research free tools", "best seo tools for beginners"],
    relatedTools: [
      { name: "Word Counter",   slug: "word-counter",   icon: "📝" },
      { name: "JSON Formatter", slug: "json-formatter", icon: "💻" },
    ],
    faqs: [
      { q: "What is the single most important free SEO tool?",
        a: "Google Search Console. It provides data directly from Google about which queries your pages appear for, how many clicks they receive, which pages are indexed, and what technical issues exist. No third-party tool can match the accuracy of Google's own data." },
      { q: "Can I do SEO effectively with only free tools?",
        a: "Yes — Google Search Console, Google Analytics, PageSpeed Insights, Bing Webmaster Tools and Screaming Frog's free tier together form a comprehensive SEO toolkit at zero cost that covers most tasks for small to medium websites." },
      { q: "Is Google Analytics still free in 2025?",
        a: "Yes — Google Analytics 4 (GA4) remains free for standard use. The paid version (Google Analytics 360) targets large enterprises. For most websites the free GA4 tier provides all the traffic data and analysis you will ever need." },
      { q: "How do I check if my website is indexed by Google?",
        a: "Type site:yourwebsite.com in the Google search bar for a quick check. Google Search Console provides a more detailed view including which pages are indexed, which are excluded, and the specific reason for each exclusion." },
      { q: "What is the Screaming Frog free crawl limit?",
        a: "The free version of Screaming Frog crawls up to 500 URLs per audit, which covers most small to medium websites completely. Larger sites need the paid version at £149/year." },
    ],
    content: `
<p>SEO has a reputation for requiring expensive tools costing hundreds of dollars per month. The reality is that the most effective SEO analysis can be done with free tools, many provided directly by Google. This guide covers the best free SEO tools in 2025 and what each one is used for.</p>

<h2 id="search-console">Google Search Console — The Most Important Free SEO Tool</h2>
<p>Google Search Console is completely free and provides data directly from Google — which queries your pages appear for, click and impression counts, average search position, Core Web Vitals scores, and which pages are indexed. It is the ground truth for your SEO performance. Any third-party tool is either using GSC data or making estimates.</p>

<h2 id="analytics">Google Analytics 4</h2>
<p>GA4 tracks how visitors interact with your website. For SEO, the most useful reports show which organic search terms drive traffic, which pages have the highest engagement, and where users drop off. Engagement metrics are incorporated into Google's ranking algorithms as user experience signals.</p>

<h2 id="pagespeed">PageSpeed Insights — Technical Performance</h2>
<p>Available at pagespeed.web.dev, this tool analyzes your Core Web Vitals — LCP, FID and CLS — which are official Google ranking factors. It provides specific actionable recommendations identifying large images, render-blocking scripts and unused CSS.</p>

<h2 id="bing-tools">Bing Webmaster Tools</h2>
<p>Often overlooked but valuable — Bing has meaningful market share particularly among Windows users. Its free SEO analyzer audits your pages and often catches issues that Google Search Console does not flag.</p>

<h2 id="screaming-frog">Screaming Frog SEO Spider</h2>
<p>Crawls your website like a search engine bot, identifying broken links, missing meta tags, pages blocked by robots.txt, redirect chains and missing image alt text. The free version crawls up to 500 URLs — sufficient for most small to medium websites.</p>

<h2 id="keyword-tools">Free Keyword Research Tools</h2>
<p><strong>Ubersuggest</strong> provides keyword search volume and difficulty with a free daily limit. <strong>Answer The Public</strong> visualizes the questions people search for around any topic — invaluable for content planning that satisfies searcher intent.</p>

<h2 id="effective-use">Using Free Tools Effectively</h2>
<p>The most effective free SEO stack: Google Search Console and Analytics as the foundation, PageSpeed Insights for technical optimization, Screaming Frog for site crawling, and keyword tools for content research. This covers the majority of SEO tasks at zero cost.</p>
    `,
  },

  // ── POST 10 ─────────────────────────────────────────────────────────────────
  "word-count-guide-every-platform": {
    title:        "Word Count Guide: The Right Length for Every Platform",
    slug:         "word-count-guide-every-platform",
    excerpt:      "How many words should your content be? The definitive word count guide for blog posts, social media, emails, SEO meta tags and every other platform.",
    category:     "Writing",
    readTime:     "7 min read",
    publishedAt:  "January 9, 2025",
    updatedAt:    "January 15, 2025",
    publishedISO: "2025-01-09T15:00:00Z",
    updatedISO:   "2025-01-15T15:00:00Z",
    keywords:     ["ideal word count blog post", "how long should content be", "word counter online free", "content length seo 2025", "meta description length"],
    relatedTools: [
      { name: "Word Counter",   slug: "word-counter",   icon: "📝" },
      { name: "Diff Checker",   slug: "diff-checker",   icon: "🔍" },
      { name: "Case Converter", slug: "case-converter", icon: "🔤" },
    ],
    faqs: [
      { q: "How long should a blog post be for SEO?",
        a: "For competitive keywords, long-form content of 1,500 to 2,500 words consistently outranks shorter pieces. However, length without substance hurts rankings. A thorough 1,200-word article will outperform a padded 3,000-word piece." },
      { q: "What is the ideal Twitter/X post length?",
        a: "Despite the 280-character limit, research shows tweets between 100 and 200 characters receive the highest engagement. Shorter tweets leave room for retweet comments, which increases reach." },
      { q: "How long should a marketing email be?",
        a: "Promotional emails perform best between 50 and 125 words — get to the offer quickly with one strong call to action. Newsletter emails work well at 200 to 500 words. Engagement drops significantly beyond 500 words." },
      { q: "What is the maximum length for a meta description?",
        a: "Meta descriptions should be 150 to 160 characters — about 25 to 30 words. Google truncates longer descriptions in search results. Think of it as a 25-word advertisement for your content." },
      { q: "Does word count directly affect Google rankings?",
        a: "Word count itself is not a ranking factor — Google does not count words. What correlates with longer content is comprehensiveness, which Google values. Focus on answering the reader's question completely rather than hitting a specific word count." },
    ],
    content: `
<p>Word count is one of the most debated topics in content creation. The truth is that the right length depends entirely on the context, the platform and the reader's intent.</p>

<h2 id="blog-posts">Blog Posts and Articles</h2>
<p>For competitive keywords, long-form content of 1,500 to 2,500 words consistently outperforms shorter pieces in organic search. Google's algorithms correlate length with comprehensiveness. However, Google's Helpful Content system penalizes padded content — a well-researched 1,200-word article will outrank a 3,000-word one filled with filler. Guidelines by type: informational guides at 1,500–2,500 words, news at 500–800 words, product reviews at 1,000–1,500 words.</p>

<h2 id="social-media">Social Media Platforms</h2>
<p><strong>Twitter/X:</strong> Despite the 280-character limit, 100–200 characters gets the highest engagement. Shorter tweets leave room for retweet comments.</p>
<p><strong>LinkedIn:</strong> Feed posts truncate at ~210 characters. Your opening must hook the reader. Long-form LinkedIn articles perform best at 1,500–2,000 words.</p>
<p><strong>Instagram:</strong> Captions can be 2,200 characters but truncate at 125 in the feed. Posts with 138–150 words drive higher engagement when the opening is compelling.</p>
<p><strong>Facebook:</strong> 40 to 80 words drives the highest organic page post engagement.</p>

<h2 id="email-marketing">Email Marketing</h2>
<p>Promotional emails perform best at 50–125 words — one offer, one call to action. Newsletter emails work well at 200–500 words. Engagement drops significantly beyond 500 words regardless of content quality.</p>

<h2 id="meta-tags">Meta Tags for SEO</h2>
<p>Meta descriptions should be 150–160 characters (25–30 words) — Google truncates longer ones. Meta titles should be 50–60 characters (8–12 words). Titles longer than 60 characters are cut with an ellipsis, potentially hiding your brand name or key terms.</p>

<h2 id="reader-rule">The Reader Experience Rule</h2>
<p>Your content should be as long as it needs to fully serve the reader's intent — and no longer. A reader asking "what is a QR code?" needs 200 words. A developer asking "how do I implement OAuth 2.0?" needs 2,000 words. Match depth to need and you will rarely get word count wrong.</p>
    `,
  },
};

// ─── Extract H2s for Table of Contents ────────────────────────────────────────
function extractTOC(html: string): { id: string; text: string }[] {
  return [...html.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)]
    .map(m => ({ id: m[1], text: m[2] }));
}

// ─── Per-post Metadata ────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];
  if (!post) return { title: "Post Not Found | PursTech" };
  return {
    title:       `${post.title} | PursTech Blog`,
    description: post.excerpt,
    keywords:    post.keywords,
    authors:     [{ name: "PursTech Team" }],
    alternates:  { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article", title: post.title, description: post.excerpt,
      url: `https://purstech.com/blog/${post.slug}`, siteName: "PursTech",
      publishedTime: post.publishedISO, modifiedTime: post.updatedISO,
      authors: ["PursTech Team"], tags: post.keywords,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image", title: post.title,
      description: post.excerpt, images: ["/og-image.png"], creator: "@purstech",
    },
  };
}

export function generateStaticParams() {
  return Object.keys(BLOG_POSTS).map(slug => ({ slug }));
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];
  if (!post) notFound();

  const toc       = extractTOC(post.content);
  const nextPosts = Object.values(BLOG_POSTS).filter(p => p.slug !== slug).slice(0, 3);
  const shareUrl  = `https://purstech.com/blog/${post.slug}`;
  const shareEnc  = encodeURIComponent(shareUrl);
  const titleEnc  = encodeURIComponent(post.title);

  const articleSchema = {
    "@context": "https://schema.org", "@type": "BlogPosting",
    headline: post.title, description: post.excerpt,
    image: "https://purstech.com/og-image.png",
    datePublished: post.publishedISO, dateModified: post.updatedISO,
    author: { "@type": "Organization", name: "PursTech Team", url: "https://purstech.com/about" },
    publisher: { "@type": "Organization", name: "PursTech",
      logo: { "@type": "ImageObject", url: "https://purstech.com/favicon.ico" } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://purstech.com/blog/${post.slug}` },
    keywords: post.keywords.join(", "),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://purstech.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://purstech.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://purstech.com/blog/${post.slug}` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: post.faqs.map(f => ({
      "@type": "Question", name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const shareButtons = [
    { label: "𝕏 Twitter",  href: `https://twitter.com/intent/tweet?text=${titleEnc}&url=${shareEnc}`,          color: "hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/10" },
    { label: "in LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareEnc}`,            color: "hover:text-[#0A66C2] hover:border-[#0A66C2]/30 hover:bg-[#0A66C2]/10" },
    { label: "f Facebook",  href: `https://www.facebook.com/sharer/sharer.php?u=${shareEnc}`,                   color: "hover:text-[#1877F2] hover:border-[#1877F2]/30 hover:bg-[#1877F2]/10" },
    { label: "🔥 Reddit",   href: `https://www.reddit.com/submit?url=${shareEnc}&title=${titleEnc}`,            color: "hover:text-[#FF4500] hover:border-[#FF4500]/30 hover:bg-[#FF4500]/10" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">

      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema)    }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema)        }} />

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-[#13131F]">
        <div id="rp" className="h-full bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF]" style={{ width: "0%" }} />
      </div>

      {/* Navbar */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-1 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">Tools</Link>
            <Link href="/blog"  className="text-sm text-gray-500 hover:text-white transition-colors">Blog</Link>
            <Link href="/about" className="text-sm text-gray-500 hover:text-white transition-colors">About</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/blog" className="hover:text-gray-400 transition-colors">Blog</Link>
          <span>›</span>
          <span className="text-gray-400 truncate max-w-xs">{post.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Article */}
          <article className="lg:col-span-3" itemScope itemType="https://schema.org/BlogPosting">

            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-semibold">
                  {post.category}
                </span>
                <span className="text-xs text-gray-500">{post.readTime}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4" itemProp="headline">
                {post.title}
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed mb-6" itemProp="description">
                {post.excerpt}
              </p>
              {/* Author + Dates */}
              <div className="flex items-center gap-4 pb-6 border-b border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C3AFF] to-[#00D4FF] flex items-center justify-center text-white font-extrabold flex-shrink-0">P</div>
                <div>
                  <div className="text-sm font-semibold text-white" itemProp="author">PursTech Team</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                    <span>Published&nbsp;<time dateTime={post.publishedISO} itemProp="datePublished">{post.publishedAt}</time></span>
                    <span>·</span>
                    <span>Updated&nbsp;<time dateTime={post.updatedISO} itemProp="dateModified">{post.updatedAt}</time></span>
                  </div>
                </div>
              </div>
            </header>

            {/* Table of Contents */}
            {toc.length > 2 && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 mb-8">
                <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">📋 Table of Contents</h2>
                <ol className="space-y-2">
                  {toc.map((item, i) => (
                    <li key={item.id} className="flex items-start gap-2">
                      <span className="text-gray-600 font-mono text-xs mt-0.5 w-5 flex-shrink-0">{String(i+1).padStart(2,"0")}</span>
                      <a href={`#${item.id}`} className="text-sm text-gray-400 hover:text-[#6C3AFF] transition-colors">{item.text}</a>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Body */}
            <div
              itemProp="articleBody"
              className="prose prose-invert max-w-none prose-p:text-gray-400 prose-p:leading-relaxed prose-p:mb-4 prose-h2:text-white prose-h2:font-extrabold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:scroll-mt-24 prose-strong:text-white prose-code:text-cyan-400 prose-code:bg-[#13131F] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Related Tools */}
            {post.relatedTools.length > 0 && (
              <div className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-6">
                <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">🔧 Try These Free Tools</h2>
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

            {/* FAQ Section */}
            <section className="mt-12">
              <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
              <div className="space-y-3">
                {post.faqs.map((faq, i) => (
                  <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                    <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                      <span>{faq.q}</span>
                      <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</div>
                  </details>
                ))}
              </div>
            </section>

            {/* Social Share */}
            <section className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">💬 Share This Article</h2>
              <div className="flex flex-wrap gap-3">
                {shareButtons.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-2 bg-[#0A0A14] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-gray-400 transition-all ${s.color}`}>
                    {s.label}
                  </a>
                ))}
              </div>
            </section>

            {/* Read Next */}
            <section className="mt-12">
              <h2 className="text-2xl font-extrabold text-white mb-6">📚 Read Next</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {nextPosts.map(p => (
                  <Link key={p.slug} href={`/blog/${p.slug}`}
                    className="group bg-[#13131F] border border-white/5 rounded-2xl p-5 hover:border-[#6C3AFF]/40 transition-all hover:-translate-y-0.5">
                    <span className="text-xs text-[#6C3AFF] font-semibold">{p.category}</span>
                    <h3 className="text-sm font-bold text-white mt-2 mb-1 group-hover:text-[#6C3AFF] transition-colors leading-snug line-clamp-2">{p.title}</h3>
                    <span className="text-xs text-gray-600">{p.readTime}</span>
                  </Link>
                ))}
              </div>
            </section>

          </article>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 flex flex-col gap-5">
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Article Info</h3>
                <div className="space-y-2 text-xs">
                  {[["Category", post.category],["Read time", post.readTime],["Published", post.publishedAt],["Updated", post.updatedAt]].map(([l,v]) => (
                    <div key={l} className="flex justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                      <span className="text-gray-500">{l}</span>
                      <span className="text-white font-medium text-right max-w-[60%]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 text-center">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-bold text-white text-sm mb-1">Free Tools</h3>
                <p className="text-gray-500 text-xs mb-4">No login. No limits. Instant results.</p>
                <Link href="/tools" className="block w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all text-center">
                  Browse Tools →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-white/5 mt-20 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/about"   className="hover:text-gray-400 transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2025 PursTech. All rights reserved.</p>
      </footer>

      {/* Reading progress script */}
      <script dangerouslySetInnerHTML={{ __html: `(function(){var b=document.getElementById("rp");if(!b)return;window.addEventListener("scroll",function(){var s=document.documentElement.scrollTop||document.body.scrollTop,h=document.documentElement.scrollHeight-document.documentElement.clientHeight;if(h>0)b.style.width=(s/h*100)+"%";},{passive:true});})();` }} />
    </div>
  );
}
