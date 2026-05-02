import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// ─── All blog posts live here ─────────────────────────────────────────────────
// Each post is a plain object with full HTML-safe content.
// When we connect Supabase later, this array gets replaced with a DB query.

export const BLOG_POSTS: Record<string, {
  title:       string;
  slug:        string;
  excerpt:     string;
  category:    string;
  readTime:    string;
  publishedAt: string;
  content:     string;
  relatedTools:{ name: string; slug: string; icon: string }[];
}> = {

  "best-free-json-formatter-tools-2025": {
    title:       "Best Free JSON Formatter Tools Online in 2025",
    slug:        "best-free-json-formatter-tools-2025",
    excerpt:     "Discover the top free JSON formatter and validator tools available online. We compare speed, features and ease of use so you pick the right one.",
    category:    "Developer Tools",
    readTime:    "6 min read",
    publishedAt: "January 8, 2025",
    relatedTools:[
      { name:"JSON Formatter",  slug:"json-formatter",  icon:"💻" },
      { name:"Base64 Encoder",  slug:"base64-encoder",  icon:"🔐" },
      { name:"URL Encoder",     slug:"url-encoder",     icon:"🔗" },
    ],
    content: `
<p>JSON (JavaScript Object Notation) has become the universal language of the web. Whether you are building an API, debugging a webhook, or reading configuration files, you are dealing with JSON every single day. The problem? Raw JSON is almost unreadable — especially when it arrives as one long, minified string with no whitespace or indentation.</p>

<p>That is where a JSON formatter comes in. A good formatter takes your messy JSON and instantly transforms it into a clean, indented, human-readable structure. The best ones also validate your JSON, highlight errors, and let you minify it back when you need to save bandwidth.</p>

<h2>What Makes a Good JSON Formatter?</h2>

<p>Not all JSON formatters are equal. Here is what separates a great tool from a mediocre one:</p>

<p><strong>Speed:</strong> The tool should format your JSON instantly — no loading bars, no server round-trips. The best formatters run entirely in your browser using JavaScript, which means your data never leaves your device.</p>

<p><strong>Error detection:</strong> A formatter that simply crashes on invalid JSON is useless for debugging. The best tools highlight exactly where your JSON is broken — whether it is a missing comma, an unclosed bracket, or a single-quoted key name — and explain what went wrong.</p>

<p><strong>Syntax highlighting:</strong> Color-coded output makes JSON far easier to read. Keys should stand out from values, strings from numbers, and booleans from null. Good color coding reduces the time it takes to scan a large JSON object by up to 60 percent.</p>

<p><strong>Minification:</strong> Sometimes you need the opposite of formatting — you need to strip all whitespace to produce the smallest possible JSON string for API requests or storage. A quality formatter includes a one-click minify button.</p>

<h2>PursTech JSON Formatter — What It Does</h2>

<p>The PursTech JSON Formatter was built with all of these principles in mind. Paste any JSON — no matter how large or messy — and it formats instantly with color-coded syntax highlighting. Keys appear in purple, string values in green, numbers in cyan, booleans in yellow, and null in red. This makes it instantly clear what type each value is.</p>

<p>The tool offers both 2-space and 4-space indentation options, a one-click minify button that also shows you the percentage size reduction, and a validate-only mode that checks for errors without changing your JSON. All processing happens in your browser — nothing is ever sent to a server.</p>

<h2>Common JSON Errors and How to Fix Them</h2>

<p><strong>Trailing comma:</strong> JSON does not allow a comma after the last item in an array or object. This is the most common mistake when writing JSON by hand. Remove the final comma before the closing bracket.</p>

<p><strong>Single quotes:</strong> Unlike JavaScript, JSON requires double quotes for all strings and all keys. Replace any single quotes with double quotes throughout your JSON.</p>

<p><strong>Unquoted keys:</strong> Every key in a JSON object must be wrapped in double quotes. <code>{name: "John"}</code> is invalid JavaScript object syntax — correct JSON is <code>{"name": "John"}</code>.</p>

<p><strong>Missing comma:</strong> When listing multiple properties or array items, every item except the last must be followed by a comma. A missing comma between two properties is a common source of parse errors.</p>

<h2>When to Use JSON Formatting in Your Workflow</h2>

<p>JSON formatters are not just for debugging. Here are the most common professional use cases:</p>

<p><strong>API development:</strong> Before documenting an API response, paste the raw JSON into a formatter to produce clean, readable examples for your documentation.</p>

<p><strong>Code review:</strong> When reviewing pull requests that include JSON configuration changes, a formatted view makes it far easier to spot what changed and why.</p>

<p><strong>Logging and monitoring:</strong> Application logs often include JSON payloads. A formatter lets you quickly read error objects and trace issues without needing to parse the structure manually.</p>

<p><strong>Configuration files:</strong> JSON config files for tools like ESLint, Prettier, and package.json are much easier to edit when viewed in a formatter that highlights structure and catches syntax errors before you save.</p>

<h2>JSON vs Other Data Formats</h2>

<p>JSON is not the only data exchange format in use today. XML was the dominant format before JSON, and YAML has gained popularity for configuration files. JSON won out for most API use cases because it is lighter than XML, more widely supported than YAML, and directly compatible with JavaScript objects. Most modern programming languages can parse JSON natively without any additional libraries.</p>

<p>The PursTech JSON Formatter supports standard JSON as defined by RFC 8259. It does not support JSON5 or JSONC (JSON with comments), which are extensions of the JSON standard used in some configuration contexts.</p>

<h2>Try It Now</h2>

<p>The fastest way to understand what a JSON formatter does is to use one. Paste any JSON into the PursTech JSON Formatter, click Format, and see the difference immediately. Whether you are a developer debugging an API or a non-technical user trying to read a configuration file, a clean formatted view makes all the difference.</p>
    `,
  },

  "how-to-compress-images-without-losing-quality": {
    title:       "How to Compress Images Without Losing Quality",
    slug:        "how-to-compress-images-without-losing-quality",
    excerpt:     "A practical guide to reducing image file sizes for the web — which formats to use, how much compression is safe, and the free tools that do it best.",
    category:    "Image Tools",
    readTime:    "7 min read",
    publishedAt: "January 8, 2025",
    relatedTools:[
      { name:"Color Picker",   slug:"color-picker",   icon:"🎨" },
      { name:"QR Code Gen",    slug:"qr-code-generator",icon:"🔲"},
    ],
    content: `
<p>Images are the single biggest contributor to slow websites. A webpage with unoptimized images can be 5 to 10 times larger than it needs to be, resulting in longer load times, higher bounce rates, and lower search engine rankings. Yet many website owners upload photos straight from their camera or phone without ever compressing them.</p>

<p>The good news is that image compression has improved dramatically. Modern compression algorithms can reduce a JPEG file by 60 to 80 percent with no visible quality loss to the human eye. This guide explains exactly how to compress images effectively, which formats to use for different situations, and what tools make the process instant and free.</p>

<h2>Understanding Lossy vs Lossless Compression</h2>

<p><strong>Lossy compression</strong> permanently removes some image data to achieve smaller file sizes. The removed data represents subtle color variations and fine details that most people cannot perceive at normal viewing distances. JPEG uses lossy compression, which is why it is ideal for photographs where some quality loss is acceptable in exchange for much smaller files.</p>

<p><strong>Lossless compression</strong> reduces file size without discarding any image data. Every pixel in the original image is perfectly preserved after decompression. PNG uses lossless compression, making it the right choice for logos, screenshots, and graphics with sharp edges or text where any quality loss would be visible.</p>

<h2>Which Format Should You Use?</h2>

<p><strong>JPEG</strong> is best for photographs, product images, and any image with many colors and gradual transitions. A well-compressed JPEG can be 10 to 20 times smaller than the equivalent PNG with virtually no visible difference for photographic content.</p>

<p><strong>PNG</strong> is best for logos, icons, screenshots, and any image that requires a transparent background. Because PNG uses lossless compression, file sizes are larger than JPEG, but quality is perfectly preserved.</p>

<p><strong>WebP</strong> is a modern format developed by Google that provides both lossy and lossless compression. WebP files are typically 25 to 35 percent smaller than equivalent JPEG files at the same quality level. All major modern browsers support WebP, making it an excellent choice for web use.</p>

<p><strong>SVG</strong> is a vector format used for icons, logos, and illustrations. Because SVG describes shapes mathematically rather than storing pixel data, SVG files scale perfectly to any size and are often just a few kilobytes regardless of display dimensions.</p>

<h2>How Much Compression Is Safe?</h2>

<p>For JPEG compression, quality settings between 70 and 85 percent produce files that are 60 to 75 percent smaller than the original with no perceptible quality loss for most content. Below 60 percent, compression artifacts — blocky patches and color banding — begin to appear in smooth gradients and around sharp edges.</p>

<p>For web thumbnails and preview images viewed at small sizes, quality settings as low as 50 to 60 percent are often acceptable. For hero images and full-width banners that are displayed prominently, stay above 75 percent to maintain sharpness.</p>

<h2>Image Dimensions Matter as Much as Compression</h2>

<p>Compressing a 4000 × 3000 pixel photograph and displaying it at 800 × 600 pixels wastes bandwidth. The browser downloads all four megapixels and then throws away three quarters of them during rendering. Always resize your images to the actual display dimensions before compressing them.</p>

<p>A good rule of thumb for web images: hero images at 1200 to 1600 pixels wide, blog post images at 800 to 1200 pixels wide, and thumbnails at 400 to 600 pixels wide. At these dimensions, even high-quality JPEGs are typically under 200 kilobytes.</p>

<h2>Impact on Website Performance and SEO</h2>

<p>Google uses page speed as a ranking factor for both desktop and mobile search. The Core Web Vitals metric LCP (Largest Contentful Paint) measures how quickly the largest image or text block on a page loads. Unoptimized images are the leading cause of poor LCP scores, which directly affects your search rankings.</p>

<p>Beyond SEO, faster pages keep visitors engaged. Research consistently shows that a one-second delay in page load time reduces conversions by 7 percent. For an e-commerce site doing $100,000 per month, that is $7,000 in lost revenue for every extra second of load time.</p>

<h2>Best Practices for Image Optimization</h2>

<p>Always compress images before uploading them to your website rather than relying on server-side processing. Compress at the highest quality setting that produces an acceptable result, then test on both desktop and mobile screens. Use WebP as your primary format for new content and provide JPEG as a fallback for older browsers. Store your original uncompressed images separately so you can recompress at different settings if needed.</p>
    `,
  },

  "strong-password-guide-2025": {
    title:       "What Makes a Password Strong? The Complete 2025 Guide",
    slug:        "strong-password-guide-2025",
    excerpt:     "Everything you need to know about creating and managing strong passwords — password length, complexity, common mistakes, and how to stay secure in 2025.",
    category:    "Security",
    readTime:    "8 min read",
    publishedAt: "January 8, 2025",
    relatedTools:[
      { name:"Password Generator", slug:"password-generator", icon:"🔐" },
      { name:"Hash Generator",     slug:"hash-generator",     icon:"🔑" },
    ],
    content: `
<p>Password security is one of the most important yet most overlooked aspects of personal and professional digital safety. Despite years of advice from security experts, the most common passwords in data breaches are still "123456", "password", and "qwerty". Understanding what actually makes a password strong — and why — is the foundation of protecting your online accounts.</p>

<h2>The Science Behind Password Strength</h2>

<p>Password strength is measured in bits of entropy — a mathematical representation of how unpredictable a password is. The higher the entropy, the more computational work an attacker needs to guess it. A password with 60 bits of entropy would require, on average, 2 to the power of 59 guesses to crack — roughly 576 quadrillion attempts.</p>

<p>Two factors determine entropy: length and character pool size. A password drawn from 94 printable ASCII characters (uppercase, lowercase, numbers, and symbols) gives you log base 2 of 94 bits per character — approximately 6.5 bits. A 16-character password from this pool has about 104 bits of entropy, which is considered very strong by today's standards.</p>

<h2>Length Is the Single Most Important Factor</h2>

<p>Every additional character in a password multiplies the number of possible combinations by the size of the character pool. Adding one character to a 15-character password using a 94-character pool multiplies the search space by 94. This exponential growth is why length matters far more than complexity tricks like replacing letters with numbers.</p>

<p>A 12-character password using only lowercase letters has 26 to the power of 12 possible combinations — roughly 95 trillion. A 16-character lowercase password has 26 to the power of 16 — about 43 quadrillion. The 4 extra characters increased the search space by 450,000 times. No amount of substituting "3" for "e" or "@" for "a" comes close to this improvement.</p>

<h2>Common Password Mistakes</h2>

<p><strong>Dictionary words:</strong> Password cracking tools run through entire dictionaries in seconds. Any real word, name, or phrase in any language is vulnerable regardless of its length.</p>

<p><strong>Predictable substitutions:</strong> Attackers know that people replace "a" with "@", "e" with "3", and "o" with "0". These substitutions are built into cracking dictionaries and provide almost no additional security.</p>

<p><strong>Keyboard patterns:</strong> Sequences like "qwerty", "asdfgh", "123456", and "zxcvbn" are among the first patterns any cracking tool tries. Spatial patterns on the keyboard are no more secure than dictionary words.</p>

<p><strong>Personal information:</strong> Birthdays, names of family members, favorite sports teams, and home cities are easy to find through social media and are the first guesses in targeted attacks.</p>

<p><strong>Password reuse:</strong> Using the same password across multiple accounts is the most dangerous mistake of all. When one service is breached and its password database is leaked, attackers immediately try those same credentials on hundreds of other services. This is called credential stuffing and it succeeds remarkably often.</p>

<h2>How to Generate a Truly Strong Password</h2>

<p>The most secure passwords are long, random, and unique to each account. The word "random" here is critical — it means generated by a cryptographically secure random number generator, not chosen by a human. Humans are terrible at generating random sequences. We unconsciously favor certain characters, avoid repetition, and create patterns that cracking tools are specifically designed to exploit.</p>

<p>A cryptographic random password generator — like the one built into PursTech — uses your browser's <code>crypto.getRandomValues()</code> API, which generates numbers that are statistically indistinguishable from true randomness. This is the same technology used in SSL certificates and banking security systems.</p>

<h2>Password Managers — The Only Practical Solution</h2>

<p>The only realistic way to use strong, unique passwords for every account is to use a password manager. A password manager generates, stores, and fills in strong random passwords for every site you visit. You only need to remember one strong master password.</p>

<p>Bitwarden is free, open-source, and has been independently audited for security. 1Password and Dashlane are excellent paid options with additional features. All of these sync your passwords securely across all your devices.</p>

<h2>Two-Factor Authentication</h2>

<p>Even the strongest password can be stolen through phishing, malware, or data breaches. Two-factor authentication (2FA) adds a second layer of security that requires something you physically possess — typically your phone — in addition to your password. Enable 2FA on every account that supports it, especially email, banking, and social media accounts.</p>
    `,
  },

  "hex-vs-rgb-vs-hsl-color-formats": {
    title:       "HEX vs RGB vs HSL: Which Color Format Should You Use?",
    slug:        "hex-vs-rgb-vs-hsl-color-formats",
    excerpt:     "A complete guide to understanding web color formats for developers and designers — when to use HEX, RGB, HSL, and how to convert between them.",
    category:    "Design",
    readTime:    "6 min read",
    publishedAt: "January 8, 2025",
    relatedTools:[
      { name:"Color Picker", slug:"color-picker", icon:"🎨" },
      { name:"CSS Minifier", slug:"css-minifier", icon:"🎨" },
    ],
    content: `
<p>Color is one of the most fundamental aspects of web design, yet the number of different color formats — HEX, RGB, HSL, RGBA, HSLA — can be confusing even for experienced developers. Each format has specific strengths and is better suited to certain situations. This guide explains each format clearly and tells you exactly when to use which one.</p>

<h2>HEX Color Codes</h2>

<p>HEX (hexadecimal) is the most widely used color format in web development. A HEX code consists of a hash symbol followed by six characters: <code>#RRGGBB</code>. Each pair of characters represents the red, green, and blue channel values in base 16, ranging from 00 (zero) to FF (255).</p>

<p>For example, pure red is <code>#FF0000</code> — maximum red (FF), no green (00), no blue (00). White is <code>#FFFFFF</code> (maximum of all three channels) and black is <code>#000000</code> (zero of all three).</p>

<p>HEX codes are compact, widely supported, and the default format in most design tools including Figma, Adobe XD, and Photoshop. They are the best choice when copying colors from a design file into CSS, when sharing specific brand colors, and when readability of the format itself is less important than brevity.</p>

<h2>RGB Color Values</h2>

<p>RGB (Red, Green, Blue) defines colors using three numbers between 0 and 255. The CSS syntax is <code>rgb(255, 0, 0)</code> for pure red. RGB is mathematically identical to HEX — both represent the same three channels at the same precision — but in decimal rather than hexadecimal notation.</p>

<p>RGB is more intuitive for developers who think in decimal numbers and is easier to manipulate programmatically. If you are using JavaScript to animate a color or calculate color values dynamically, working in RGB is often simpler than parsing HEX strings.</p>

<p>RGBA adds a fourth channel for opacity: <code>rgba(255, 0, 0, 0.5)</code> produces a semi-transparent red. This is useful for overlay colors, shadows, and any situation where you need a color that partially shows what is behind it.</p>

<h2>HSL — The Designer's Format</h2>

<p>HSL (Hue, Saturation, Lightness) is the most human-friendly color format. Instead of mixing red, green, and blue primaries, HSL describes color the way humans naturally think about it:</p>

<p><strong>Hue</strong> is the pure color, expressed as a degree on the color wheel from 0 to 360. Red is 0, green is 120, blue is 240.</p>

<p><strong>Saturation</strong> is how vivid or muted the color is, expressed as a percentage. 100 percent is a fully vivid color, 0 percent is a shade of grey.</p>

<p><strong>Lightness</strong> is how light or dark the color is, expressed as a percentage. 0 percent is black, 100 percent is white, 50 percent is the pure color.</p>

<p>HSL makes it trivially easy to create color variations. To create a lighter version of a color, simply increase the lightness value. To desaturate it, reduce the saturation. To find the complementary color, add 180 degrees to the hue. None of these operations are intuitive in HEX or RGB.</p>

<h2>When to Use Each Format</h2>

<p>Use <strong>HEX</strong> when working with design handoffs, brand colors, and anywhere brevity matters. Most color pickers and design tools output HEX by default, making it the path of least resistance for static color values.</p>

<p>Use <strong>RGB/RGBA</strong> when you need alpha transparency or are performing mathematical operations on color values in JavaScript. RGBA is the most widely supported format for transparency in older browsers.</p>

<p>Use <strong>HSL/HSLA</strong> for design systems, theme generation, and any situation where you need to create programmatic color variations. Building a UI with light and dark variants of a primary color is far simpler in HSL — you adjust the lightness value instead of calculating new RGB values from scratch.</p>

<h2>Converting Between Formats</h2>

<p>All three formats represent exactly the same color space — they are just different notations for the same values. The PursTech Color Picker converts between all formats instantly. Enter any color in any format and immediately see the equivalent HEX, RGB, HSL, HSV, and CMYK values, all ready to copy.</p>
    `,
  },

  "qr-codes-for-business-complete-guide": {
    title:       "QR Codes for Business: The Complete 2025 Guide",
    slug:        "qr-codes-for-business-complete-guide",
    excerpt:     "Everything businesses need to know about QR codes in 2025 — how they work, the best use cases, design tips, and how to generate them for free.",
    category:    "Developer Tools",
    readTime:    "7 min read",
    publishedAt: "January 8, 2025",
    relatedTools:[
      { name:"QR Code Generator", slug:"qr-code-generator", icon:"🔲" },
      { name:"URL Encoder",       slug:"url-encoder",       icon:"🔗" },
    ],
    content: `
<p>QR codes went from a niche logistics technology to a mainstream consumer tool seemingly overnight. The pandemic, which made contactless interactions a necessity, accelerated adoption so dramatically that QR code usage has permanently changed consumer behavior. Today, businesses of every size use QR codes in ways that were considered niche just five years ago.</p>

<h2>How QR Codes Work</h2>

<p>A QR (Quick Response) code is a two-dimensional barcode that encodes data as a matrix of black and white squares. Unlike traditional one-dimensional barcodes that can only store about 20 characters, QR codes can encode up to 4,296 alphanumeric characters. When a smartphone camera reads a QR code, it decodes this matrix and typically opens a URL, but it can also trigger a phone call, connect to a WiFi network, add a contact, or display plain text.</p>

<p>QR codes include built-in error correction that allows them to remain readable even when up to 30 percent of the code is damaged or obscured. This is why you can place a logo in the center of a QR code and it still scans correctly — the redundant error correction data compensates for the covered portion.</p>

<h2>The Best Business Use Cases</h2>

<p><strong>Restaurant menus:</strong> Digital menus accessible via QR code reduce printing costs and allow instant updates when items change or run out. Customers scan the code on their table and view the current menu on their phone. This is now expected behavior in many markets.</p>

<p><strong>Product packaging:</strong> QR codes on packaging can link to assembly instructions, warranty registration, ingredient details, video demonstrations, or customer reviews. This turns static packaging into an interactive touchpoint without adding any printing cost beyond the code itself.</p>

<p><strong>Business cards:</strong> A QR code on a business card that adds your contact details directly to someone's phone is far more likely to be saved than a card that requires manual data entry. Use a vCard QR code that includes your name, phone number, email, and website.</p>

<p><strong>Marketing campaigns:</strong> QR codes on posters, flyers, and print advertisements bridge the gap between physical and digital marketing. A billboard that includes a QR code lets passersby instantly access your website, promotional offer, or app download — with no typing required.</p>

<p><strong>WiFi sharing:</strong> A QR code in your office, shop, or home that automatically connects guests to your WiFi network is one of the most practical applications. Guests scan the code and connect instantly without needing to read out a long password.</p>

<h2>QR Code Design Best Practices</h2>

<p><strong>Size matters:</strong> For print, a minimum size of 2 cm × 2 cm is required for reliable scanning. For large-format print like posters and banners, aim for at least 10 cm × 10 cm. QR codes that are too small simply will not scan reliably at normal distances.</p>

<p><strong>Contrast is critical:</strong> The dark squares of a QR code must have high contrast against the background. Black on white is optimal. Avoid low-contrast color combinations — a light grey code on a white background will fail to scan even when the code itself is technically valid.</p>

<p><strong>Use high error correction:</strong> When printing QR codes on physical materials, use the highest error correction level (H) which tolerates up to 30 percent damage. This gives you room to add a logo in the center and ensures the code still scans if the corner of a flyer gets torn.</p>

<p><strong>Always test before printing:</strong> Generate your QR code, print a test copy, and scan it with at least two different devices before committing to a large print run. What looks correct on screen may not always scan reliably in print.</p>

<h2>Static vs Dynamic QR Codes</h2>

<p>A static QR code encodes the destination URL directly in the code itself. Once printed, you cannot change where it points. A dynamic QR code points to a redirect service, which then forwards to your actual destination. This allows you to update the destination URL without reprinting the code, and provides analytics on how many times the code was scanned.</p>

<p>For single-use or low-volume applications, static QR codes are simpler and completely free. The PursTech QR Code Generator creates static QR codes that you can download as PNG or SVG for immediate use in any application.</p>
    `,
  },

  "base64-encoding-explained": {
    title:       "Base64 Encoding Explained: A Developer's Guide",
    slug:        "base64-encoding-explained",
    excerpt:     "What is Base64 encoding, how does it work, and when should you use it? A practical guide for developers with real-world examples.",
    category:    "Developer Tools",
    readTime:    "6 min read",
    publishedAt: "January 9, 2025",
    relatedTools:[
      { name:"Base64 Encoder", slug:"base64-encoder", icon:"🔐" },
      { name:"URL Encoder",    slug:"url-encoder",    icon:"🔗" },
      { name:"Hash Generator", slug:"hash-generator", icon:"🔑" },
    ],
    content: `
<p>Base64 is one of those encoding schemes that developers encounter constantly but rarely take the time to fully understand. You have seen it in JWT tokens, email attachments, CSS data URIs, and API authentication headers. This guide explains exactly what Base64 is, how the encoding algorithm works, and when you should and should not use it.</p>

<h2>What Is Base64?</h2>

<p>Base64 is a binary-to-text encoding scheme that represents binary data using only 64 printable ASCII characters: the uppercase letters A through Z, the lowercase letters a through z, the digits 0 through 9, the plus sign, and the forward slash. An equals sign is used for padding when needed.</p>

<p>The name "Base64" comes from this 64-character alphabet — the same reason we call our everyday number system "Base10" (it uses 10 digits) and hexadecimal "Base16" (it uses 16 characters).</p>

<h2>Why Does Base64 Exist?</h2>

<p>Many systems that were designed to handle text — including email protocols, HTTP headers, and URLs — were not built to safely transmit arbitrary binary data. Binary data can contain control characters, null bytes, and other values that these text-based systems interpret as commands rather than data.</p>

<p>Base64 solves this by converting binary data into a format that contains only safe, printable characters. The result can be safely passed through any text-based system without corruption.</p>

<h2>How the Encoding Works</h2>

<p>Base64 encoding works by grouping the input bytes into sets of three (24 bits), then splitting each group into four 6-bit values. Each 6-bit value (ranging from 0 to 63) is then mapped to one character from the Base64 alphabet.</p>

<p>Because every 3 bytes of input produces 4 characters of output, Base64-encoded data is always approximately one third larger than the original. A 100-byte binary file becomes roughly 136 characters when Base64-encoded.</p>

<h2>Common Use Cases</h2>

<p><strong>Email attachments:</strong> The MIME standard uses Base64 to encode binary files (images, PDFs, documents) for transmission through email systems that were originally designed only for plain text.</p>

<p><strong>Data URIs in CSS and HTML:</strong> Small images can be embedded directly in stylesheets or HTML files as Base64-encoded data URIs, eliminating the need for a separate HTTP request. The syntax is <code>url("data:image/png;base64,...")</code>. This is useful for small icons but counterproductive for larger images.</p>

<p><strong>API authentication:</strong> HTTP Basic Authentication encodes credentials as Base64 in the Authorization header: <code>Authorization: Basic dXNlcjpwYXNzd29yZA==</code>. Note that Base64 is not encryption — the credentials can be decoded instantly. Always use HTTPS when transmitting Base64-encoded credentials.</p>

<p><strong>JWT tokens:</strong> JSON Web Tokens consist of three Base64URL-encoded sections separated by periods. The header and payload sections contain JSON data encoded in Base64URL (a URL-safe variant that replaces + with - and / with _).</p>

<h2>What Base64 Is Not</h2>

<p>A critical misconception: Base64 is encoding, not encryption. It provides zero security. Anyone who has a Base64-encoded string can decode it in milliseconds using any Base64 decoder — including the one on PursTech. Never use Base64 to protect sensitive data. Never treat Base64-encoded passwords, API keys, or personal information as secure simply because they look scrambled.</p>

<h2>URL-Safe Base64</h2>

<p>Standard Base64 uses the plus sign (+) and forward slash (/), both of which have special meanings in URLs. URL-safe Base64 replaces + with - (hyphen) and / with _ (underscore), making the encoded string safe to include in URLs and query parameters without percent-encoding. Most JWT implementations use URL-safe Base64 without padding.</p>
    `,
  },

  "bmi-calculator-guide-what-your-score-means": {
    title:       "BMI Calculator: What Your Score Actually Means",
    slug:        "bmi-calculator-guide-what-your-score-means",
    excerpt:     "A complete guide to BMI — how it is calculated, what the categories mean, its limitations, and how to use it alongside other health metrics.",
    category:    "Health & Fitness",
    readTime:    "7 min read",
    publishedAt: "January 9, 2025",
    relatedTools:[
      { name:"BMI Calculator",   slug:"bmi-calculator",   icon:"⚖️" },
      { name:"Age Calculator",   slug:"age-calculator",   icon:"🎂" },
      { name:"Unit Converter",   slug:"unit-converter",   icon:"📏" },
    ],
    content: `
<p>Body Mass Index (BMI) is one of the most widely used health screening tools in the world, yet it is also one of the most misunderstood. Millions of people check their BMI and receive a number without truly understanding what it measures, what it does not measure, and how much weight they should give it alongside other health indicators. This guide gives you a complete picture.</p>

<h2>How BMI Is Calculated</h2>

<p>BMI is a simple ratio of weight to height squared. In metric units: BMI = weight in kilograms divided by height in meters squared. In imperial units: BMI = (weight in pounds × 703) divided by height in inches squared.</p>

<p>The result is a dimensionless number that falls into one of four standard categories established by the World Health Organization. A BMI below 18.5 is classified as underweight. Between 18.5 and 24.9 is normal weight. Between 25 and 29.9 is overweight. A BMI of 30 or above is classified as obese, with further subdivisions into Class I (30–34.9), Class II (35–39.9), and Class III (40 and above).</p>

<h2>The History of BMI</h2>

<p>BMI was developed in the 1830s by Belgian mathematician Adolphe Quetelet, who was studying the statistical characteristics of populations — not individuals. He created what he called the Quetelet Index as a tool for studying the distribution of weight across large populations, explicitly stating it was not designed for use on individuals.</p>

<p>The term "Body Mass Index" was coined in 1972 by physiologist Ancel Keys, who studied thousands of individuals and found BMI to be a reasonably good correlate of body fat percentage at the population level. It was adopted by health organizations worldwide because it requires no special equipment — just a scale and a height measurement.</p>

<h2>What BMI Measures and What It Does Not</h2>

<p>BMI measures the relationship between your weight and your height. It does not directly measure body fat, muscle mass, bone density, waist circumference, or fat distribution. These are critical limitations because body composition — the ratio of fat to lean mass — is what actually matters for health outcomes.</p>

<p>A professional bodybuilder with 10 percent body fat and exceptional cardiovascular health might have a BMI of 30, classifying them as obese. Meanwhile, a sedentary person with high body fat and low muscle mass might have a BMI of 24, classifying them as normal weight. Both classifications are misleading.</p>

<h2>Why BMI Is Still Useful</h2>

<p>Despite its limitations, BMI remains valuable as a quick, free, population-level screening tool. At the extremes — very high or very low BMI — the metric correlates well with actual health risks. A BMI above 35 is strongly associated with increased risk of type 2 diabetes, cardiovascular disease, and certain cancers regardless of other factors. A BMI below 17 is associated with nutritional deficiency and its associated health risks.</p>

<p>For clinical decisions about individual patients, doctors combine BMI with waist circumference, waist-to-hip ratio, blood pressure, fasting blood glucose, cholesterol levels, and physical fitness assessments. BMI is one data point in a broader picture, not a complete health assessment.</p>

<h2>BMI Across Different Populations</h2>

<p>The standard BMI categories were derived primarily from studies of European populations. Research has found that people of Asian descent tend to have higher body fat percentages at the same BMI compared to Europeans, leading some health organizations to recommend lower BMI thresholds for overweight classification in these populations — typically 23 instead of 25.</p>

<p>For children and teenagers, BMI is assessed differently using age and sex-specific percentile charts rather than fixed categories, because both height and body composition change significantly during development.</p>

<h2>Using BMI Alongside Other Metrics</h2>

<p>Waist circumference is a particularly important complement to BMI because it measures abdominal fat, which is more closely linked to metabolic disease than overall body fat. A waist circumference above 102 cm for men or 88 cm for women indicates substantially elevated health risk regardless of BMI. Combining a normal BMI with high waist circumference — sometimes called "normal-weight obesity" — is associated with worse metabolic health than a higher BMI with lower waist circumference.</p>
    `,
  },

  "url-encoding-developer-guide": {
    title:       "URL Encoding Explained: A Developer's Complete Guide",
    slug:        "url-encoding-developer-guide",
    excerpt:     "What is URL encoding, why it matters, and how to use it correctly in web applications. Everything developers need to know about percent-encoding.",
    category:    "Developer Tools",
    readTime:    "6 min read",
    publishedAt: "January 9, 2025",
    relatedTools:[
      { name:"URL Encoder",    slug:"url-encoder",    icon:"🔗" },
      { name:"Base64 Encoder", slug:"base64-encoder", icon:"🔐" },
      { name:"JSON Formatter", slug:"json-formatter", icon:"💻" },
    ],
    content: `
<p>URLs are the addressing system of the web — every resource on the internet has one. But URLs were designed with a limited character set in mind, and the modern web constantly needs to pass data that contains characters outside that set. URL encoding, also called percent-encoding, is the solution that makes this possible.</p>

<h2>Why URLs Have Character Restrictions</h2>

<p>The URL specification (RFC 3986) defines a set of "unreserved characters" that are always safe in any part of a URL: uppercase and lowercase letters, digits, hyphens, underscores, periods, and tildes. All other characters — including spaces, ampersands, equals signs, slashes, and most punctuation — have special meanings in URL structure or are simply not guaranteed to be handled correctly by all systems.</p>

<p>A space in a URL, for example, creates ambiguity — is the space part of the URL or is it where the URL ends? A forward slash might be interpreted as a path separator when it was meant to be part of a query parameter value. Without encoding, these characters cause URLs to break, data to be misinterpreted, and security vulnerabilities to emerge.</p>

<h2>How Percent-Encoding Works</h2>

<p>Percent-encoding replaces a character with a percent sign followed by the two-digit hexadecimal representation of that character's value in UTF-8. A space (ASCII value 32, hexadecimal 20) becomes %20. An ampersand (ASCII 38, hexadecimal 26) becomes %26. An equals sign (ASCII 61, hexadecimal 3D) becomes %3D.</p>

<p>For non-ASCII characters such as accented letters, Chinese characters, or emoji, the character is first encoded as UTF-8 bytes and then each byte is percent-encoded. The letter é (U+00E9) encodes to the UTF-8 bytes 0xC3 0xA9, which becomes %C3%A9 in a URL.</p>

<h2>encodeURI vs encodeURIComponent</h2>

<p>JavaScript provides two built-in functions for URL encoding, and choosing the wrong one is a common source of bugs.</p>

<p><code>encodeURI()</code> is designed for encoding a complete URL. It deliberately leaves the characters that are valid in a URL structure unencoded — including the colon, forward slash, at sign, and question mark. Use this function when you have a complete URL that you want to make safe for embedding or display.</p>

<p><code>encodeURIComponent()</code> is designed for encoding a single component of a URL, such as a query parameter value. It encodes everything except unreserved characters, including the slash and equals sign that encodeURI leaves alone. Use this function for any individual value being placed into a query string, path segment, or fragment.</p>

<p>The most common mistake is using encodeURI to encode a query parameter value that contains an ampersand or equals sign. Because encodeURI does not encode these characters, they break the query string structure. Always use encodeURIComponent for parameter values.</p>

<h2>URL Encoding in Query Strings</h2>

<p>Query strings use the format <code>key=value&key2=value2</code>. Both the keys and values must be encoded to prevent any special characters from being misinterpreted. If a search query contains "JSON & XML formatting", the unencoded query string <code>search=JSON & XML formatting</code> would be parsed as two parameters: <code>search=JSON </code> and <code>XML formatting</code> (which is not a valid key-value pair).</p>

<p>The correctly encoded query string is <code>search=JSON%20%26%20XML%20formatting</code>, which unambiguously represents a single search parameter with the value "JSON &amp; XML formatting".</p>

<h2>URL-Safe Base64</h2>

<p>Standard Base64 uses the plus sign and forward slash, which require encoding in URLs. URL-safe Base64 replaces these with the hyphen and underscore respectively, producing strings that can be placed in URLs without any additional encoding. This is used in JWT tokens, OAuth state parameters, and many API authentication schemes.</p>

<h2>Practical Tips</h2>

<p>Always encode query parameter values when constructing URLs programmatically. Never concatenate user input directly into a URL without encoding. When debugging URL-related issues, decode the full URL first to see the actual values being passed — the PursTech URL Encoder handles both encoding and decoding with a single click.</p>
    `,
  },

  "free-seo-tools-that-work-2025": {
    title:       "Free SEO Tools That Actually Work in 2025",
    slug:        "free-seo-tools-that-work-2025",
    excerpt:     "The definitive list of the best free SEO tools for keyword research, technical audits, rank tracking, and content optimization in 2025.",
    category:    "SEO",
    readTime:    "8 min read",
    publishedAt: "January 9, 2025",
    relatedTools:[
      { name:"Word Counter",    slug:"word-counter",    icon:"📝" },
      { name:"JSON Formatter",  slug:"json-formatter",  icon:"💻" },
    ],
    content: `
<p>Search engine optimization has a reputation for requiring expensive tools — enterprise platforms that cost hundreds or thousands of dollars per month. The reality is that some of the most effective SEO analysis can be done with free tools, many of which are provided directly by Google. This guide covers the best free SEO tools available in 2025 and explains exactly what each one is used for.</p>

<h2>Google Search Console — The Most Important Free SEO Tool</h2>

<p>Google Search Console (GSC) is the single most valuable SEO tool available, and it is completely free. GSC provides data directly from Google about how your website performs in search — which queries your pages appear for, how many clicks and impressions they receive, your average position, and the Core Web Vitals scores Google uses to evaluate your page experience.</p>

<p>The Coverage report shows which of your pages Google has successfully indexed and highlights any errors preventing proper indexing. The Links report shows which external websites link to your site and which of your pages receive the most internal links. The Sitemaps section lets you submit your sitemap.xml directly to Google for faster crawling.</p>

<p>GSC is the ground truth for your site's SEO performance. Any tool that claims to show you Google ranking data is either using GSC data or making estimates — nothing provides more accurate search performance data than GSC itself.</p>

<h2>Google Analytics 4 — Understanding Your Traffic</h2>

<p>Google Analytics 4 (GA4) tracks how visitors interact with your website. For SEO, the most useful reports show which organic search terms drive traffic (when connected to GSC), which pages have the highest engagement rates, where users drop off in their journey through your site, and which content types perform best.</p>

<p>GA4's engagement metrics — session duration, pages per session, and bounce rate — are particularly relevant because Google's algorithms incorporate user experience signals. Pages where users leave immediately signal to Google that the content is not satisfying searcher intent, which can negatively affect rankings.</p>

<h2>PageSpeed Insights — Technical Performance Analysis</h2>

<p>PageSpeed Insights, available at pagespeed.web.dev, analyzes your page's load performance and Core Web Vitals scores for both mobile and desktop. It provides specific, actionable recommendations for improving performance — identifying large unoptimized images, render-blocking resources, and unused JavaScript and CSS.</p>

<p>Core Web Vitals — LCP (Largest Contentful Paint), FID (First Input Delay), and CLS (Cumulative Layout Shift) — are official Google ranking factors. LCP measures how quickly your main content loads, FID measures how quickly the page responds to user interaction, and CLS measures how much the page layout shifts during loading. Improving these scores directly improves your search rankings.</p>

<h2>Bing Webmaster Tools — Often Overlooked</h2>

<p>Bing Webmaster Tools provides similar functionality to Google Search Console but for Bing search, which has a meaningful market share particularly among Windows users and in certain demographics. Bing also provides a free SEO analyzer that audits your pages and provides recommendations — often catching issues that GSC does not flag.</p>

<h2>Screaming Frog SEO Spider — Free Technical Crawler</h2>

<p>Screaming Frog offers a desktop application that crawls your website like a search engine bot, identifying technical SEO issues including broken links (404 errors), missing or duplicate meta tags, pages blocked by robots.txt, redirect chains, and missing alt text on images. The free version crawls up to 500 URLs, which covers most small to medium-sized websites.</p>

<h2>Ubersuggest — Free Keyword Research</h2>

<p>Ubersuggest provides free keyword research data including search volume, keyword difficulty, and content ideas. The free tier has daily limits but provides enough data for basic keyword research. It also shows which websites rank for any keyword and provides a backlink analysis tool.</p>

<h2>Answer The Public — Understanding Search Intent</h2>

<p>Answer The Public visualizes the questions and phrases people search for around any topic, organized by search intent. This is invaluable for content planning — understanding exactly what questions your target audience is asking helps you create content that satisfies their search intent, which is what modern SEO fundamentally requires.</p>

<h2>Using Free Tools Effectively</h2>

<p>The most effective SEO strategy uses Google Search Console and Analytics as the foundation, supplements with PageSpeed Insights for technical optimization, and adds keyword research tools like Ubersuggest and Answer The Public for content planning. This stack costs nothing and covers the majority of SEO tasks that small and medium-sized websites need.</p>
    `,
  },

  "word-count-guide-every-platform": {
    title:       "Word Count Guide: The Right Length for Every Platform",
    slug:        "word-count-guide-every-platform",
    excerpt:     "How many words should your content be? The definitive word count guide for blog posts, social media, emails, SEO, and every other platform.",
    category:    "Writing",
    readTime:    "7 min read",
    publishedAt: "January 9, 2025",
    relatedTools:[
      { name:"Word Counter",   slug:"word-counter",    icon:"📝" },
      { name:"Diff Checker",   slug:"diff-checker",    icon:"🔍" },
      { name:"Case Converter", slug:"case-converter",  icon:"🔤" },
    ],
    content: `
<p>Word count is one of the most debated topics in content creation. Some writers swear that longer content always ranks better in search engines. Others argue that concise writing outperforms long-form content for engagement. The truth, as with most things in writing, is that the right length depends entirely on the context, the platform, and the reader's intent.</p>

<h2>Blog Posts and Articles</h2>

<p>For blog posts targeting competitive search keywords, the data consistently shows that long-form content (1,500 to 2,500 words) outperforms shorter pieces in organic search rankings. Google's algorithms correlate content length with comprehensiveness — a 2,000-word guide is more likely to answer every question a searcher might have than a 400-word summary.</p>

<p>However, length without substance actively hurts your rankings. Google's Helpful Content system specifically penalizes content that appears comprehensive on the surface but provides little actual value. A well-researched 1,200-word article that thoroughly addresses a specific topic will outperform a 3,000-word article padded with filler.</p>

<p>For informational guides and tutorials, aim for 1,500 to 2,500 words. For news articles and commentary, 500 to 800 words is standard. For product reviews and comparisons, 1,000 to 1,500 words provides enough depth to be useful without losing readers.</p>

<h2>Social Media Platforms</h2>

<p><strong>Twitter / X:</strong> The character limit is 280 characters (approximately 40 to 60 words). Research shows tweets between 100 and 200 characters receive higher engagement than tweets that use the full limit. Shorter tweets leave room for retweet comments, which increases reach.</p>

<p><strong>LinkedIn:</strong> LinkedIn posts can be up to 3,000 characters (approximately 500 words) in the feed. However, the platform truncates posts after approximately 210 characters with a "see more" link. Your first 210 characters must hook the reader. LinkedIn articles (long-form blog-style posts) perform best between 1,500 and 2,000 words.</p>

<p><strong>Instagram:</strong> Instagram captions can be up to 2,200 characters but are truncated at 125 characters in the feed. Research suggests posts with longer captions (between 138 and 150 words) drive higher engagement, but only when the opening lines are compelling enough to get users to tap "more".</p>

<p><strong>Facebook:</strong> For organic page posts, 40 to 80 words drives higher engagement than both very short and very long posts. Facebook's algorithm de-prioritizes posts it classifies as "link bait" or low-quality content, so quality of writing matters more than length.</p>

<h2>Email Marketing</h2>

<p>The optimal word count for marketing emails depends on the type of email. Promotional emails announcing a sale or new product perform best between 50 and 125 words — get to the point quickly, present the offer clearly, and provide a single strong call to action.</p>

<p>Newsletter emails with multiple content items typically run between 200 and 500 words. Educational email sequences that build a relationship with subscribers can run longer, but data consistently shows that open rates and click rates decrease as email length increases beyond 500 words.</p>

<h2>Meta Descriptions for SEO</h2>

<p>Meta descriptions should be between 150 and 160 characters (approximately 25 to 30 words). Google truncates descriptions longer than this in search results. A good meta description concisely communicates what the page is about and includes a compelling reason to click — think of it as a 25-word advertisement for your content.</p>

<p>Meta titles should be between 50 and 60 characters (approximately 8 to 12 words). Titles longer than 60 characters are typically truncated with an ellipsis in search results, cutting off potentially important keywords or your brand name.</p>

<h2>The Reader Experience Rule</h2>

<p>The most practical rule for word count is this: your content should be as long as it needs to be to fully serve the reader's intent, and no longer. A reader asking "what is a QR code?" needs a 200-word explanation. A developer asking "how do I implement OAuth 2.0?" needs a 2,000-word technical guide. Match your depth to your reader's need and you will rarely get word count wrong.</p>
    `,
  },
};

// ─── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];
  if (!post) return { title: "Post Not Found | PursTech" };
  return {
    title:       `${post.title} | PursTech Blog`,
    description: post.excerpt,
  };
}

export function generateStaticParams() {
  return Object.keys(BLOG_POSTS).map((slug) => ({ slug }));
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];
  if (!post) notFound();

  const otherPosts = Object.values(BLOG_POSTS)
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">

      {/* Navbar */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">Tools</Link>
            <Link href="/blog"  className="text-sm text-gray-500 hover:text-white transition-colors">Blog</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Breadcrumb */}
        <nav className="text-xs text-gray-600 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/blog" className="hover:text-gray-400 transition-colors">Blog</Link>
          <span>›</span>
          <span className="text-gray-400 truncate max-w-xs">{post.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Article */}
          <article className="lg:col-span-3">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-semibold">
                  {post.category}
                </span>
                <span className="text-xs text-gray-500">{post.readTime}</span>
                <span className="text-xs text-gray-600">·</span>
                <span className="text-xs text-gray-500">{post.publishedAt}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
                {post.title}
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">{post.excerpt}</p>
            </div>

            <hr className="border-white/5 mb-8" />

            {/* Content */}
            <div
              className="
                prose prose-invert max-w-none
                prose-p:text-gray-400 prose-p:leading-relaxed prose-p:mb-4
                prose-h2:text-white prose-h2:font-extrabold prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
                prose-strong:text-white
                prose-code:text-cyan-400 prose-code:bg-[#13131F] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              "
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Related tools */}
            {post.relatedTools.length > 0 && (
              <div className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
                  🔧 Try These Free Tools
                </h3>
                <div className="flex flex-wrap gap-3">
                  {post.relatedTools.map((tool) => (
                    <Link key={tool.slug} href={`/tools/${tool.slug}`}
                      className="flex items-center gap-2 bg-[#0A0A14] hover:bg-[#6C3AFF]/10 border border-white/5 hover:border-[#6C3AFF]/30 rounded-xl px-4 py-2.5 transition-all group">
                      <span className="text-lg">{tool.icon}</span>
                      <span className="text-sm text-gray-400 group-hover:text-white transition-colors font-medium">
                        {tool.name}
                      </span>
                      <span className="text-gray-700 group-hover:text-[#6C3AFF] transition-colors text-sm">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 flex flex-col gap-5">

            {/* More posts */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">More Articles</h3>
              <div className="space-y-3">
                {otherPosts.map((p) => (
                  <Link key={p.slug} href={`/blog/${p.slug}`}
                    className="block group">
                    <div className="text-xs text-[#6C3AFF] font-medium mb-1">{p.category}</div>
                    <div className="text-xs text-gray-400 group-hover:text-white transition-colors leading-snug line-clamp-2">
                      {p.title}
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/blog"
                className="block mt-4 text-xs text-[#6C3AFF] hover:text-[#00D4FF] transition-colors font-semibold">
                View all posts →
              </Link>
            </div>

            {/* Browse tools CTA */}
            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-white text-sm mb-1">Free Tools</h3>
              <p className="text-gray-500 text-xs mb-4">No login. No limits. Instant results.</p>
              <Link href="/tools"
                className="block w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all text-center">
                Browse Tools →
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-white/5 mt-20 py-8 text-center">
        <Link href="/" className="text-xl font-black">
          Purs<span className="text-[#6C3AFF]">Tech</span>
        </Link>
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
