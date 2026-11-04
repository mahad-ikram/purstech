import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// ─── All 51 live tools ────────────────────────────────────────────────────────
// QA fix: was only 20 tools → SEO/AI/PDF/image categories showed "Coming Soon"
// Fake "uses" field removed — replaced with "Free" badge on cards

const ALL_TOOLS = [
  // ── Text (5) ──────────────────────────────────────────────────────────────
  { icon:"📝", name:"Word Counter",              slug:"word-counter",               category:"text",     badge:"⭐ Top",  desc:"Count words, characters, sentences and paragraphs instantly."                    },
  { icon:"🔤", name:"Case Converter",             slug:"case-converter",             category:"text",     badge:"",        desc:"Convert text to UPPER, lower, Title, camelCase and snake_case."                 },
  { icon:"📄", name:"Lorem Ipsum Generator",      slug:"lorem-ipsum",                category:"text",     badge:"",        desc:"Generate placeholder lorem ipsum text by paragraphs, sentences or words."       },
  { icon:"🔍", name:"Diff Checker",               slug:"diff-checker",               category:"text",     badge:"",        desc:"Compare two texts and instantly highlight every addition and deletion."          },
  { icon:"🔊", name:"Text to Speech",             slug:"text-to-speech",             category:"text",     badge:"",        desc:"Convert any text to natural-sounding speech in multiple voices."                 },
  // ── Dev (14) ──────────────────────────────────────────────────────────────
  { icon:"💻", name:"JSON Formatter",             slug:"json-formatter",             category:"dev",      badge:"⭐ Top",  desc:"Format, validate and minify JSON data with syntax highlighting."                 },
  { icon:"🔐", name:"Base64 Encoder",             slug:"base64-encoder",             category:"dev",      badge:"",        desc:"Encode and decode Base64 strings and files instantly."                          },
  { icon:"🔗", name:"URL Encoder",                slug:"url-encoder",                category:"dev",      badge:"",        desc:"Encode and decode URLs and query parameters."                                    },
  { icon:"🎲", name:"UUID Generator",             slug:"uuid-generator",             category:"dev",      badge:"",        desc:"Generate cryptographically secure UUID v4 identifiers."                         },
  { icon:"🔲", name:"QR Code Generator",          slug:"qr-code-generator",          category:"dev",      badge:"",        desc:"Generate QR codes for URLs, WiFi, contacts and more."                           },
  { icon:"🔑", name:"Hash Generator",             slug:"hash-generator",             category:"dev",      badge:"",        desc:"Generate MD5, SHA-1, SHA-256 and SHA-512 hashes."                               },
  { icon:"🖌", name:"CSS Minifier",               slug:"css-minifier",               category:"dev",      badge:"",        desc:"Minify CSS to reduce file size and improve page load speed."                    },
  { icon:"🗜", name:"HTML Minifier",              slug:"html-minifier",              category:"dev",      badge:"",        desc:"Minify HTML to reduce page size and improve load speed."                        },
  { icon:"🧪", name:"Regex Tester",               slug:"regex-tester",               category:"dev",      badge:"🔥 Hot",  desc:"Test and debug regular expressions with live match highlighting."               },
  { icon:"⚡", name:"JS Minifier",                slug:"js-minifier",                category:"dev",      badge:"",        desc:"Minify JavaScript with multi-pass compression."                                  },
  { icon:"📝", name:"HTML to Markdown",           slug:"html-to-markdown",           category:"dev",      badge:"",        desc:"Convert HTML code to clean Markdown format instantly."                          },
  { icon:"✍️",  name:"Markdown Editor",            slug:"markdown-editor",            category:"dev",      badge:"",        desc:"Write Markdown with a live split-pane preview and toolbar."                     },
  { icon:"🎨", name:"Color Code Converter",       slug:"color-code-converter",       category:"dev",      badge:"",        desc:"Convert between HEX, RGB, HSL, HSV and CMYK color codes."                       },
  { icon:"✦",  name:"SVG Editor",                 slug:"svg-editor",                 category:"dev",      badge:"🆕 New",  desc:"Edit SVG with live preview, React JSX export and optimizer."                   },
  // ── Image (6) ─────────────────────────────────────────────────────────────
  { icon:"🎨", name:"Color Picker",               slug:"color-picker",               category:"image",    badge:"",        desc:"Pick any color and get HEX, RGB, HSL, HSV and CMYK codes."                     },
  { icon:"🗜", name:"Image Compressor",           slug:"image-compressor",           category:"image",    badge:"🔥 Hot",  desc:"Compress JPEG, PNG and WebP images without quality loss."                       },
  { icon:"📐", name:"Image Resizer",              slug:"image-resizer",              category:"image",    badge:"",        desc:"Resize images to exact dimensions with 20+ social media presets."               },
  { icon:"✂️",  name:"Background Remover",         slug:"background-remover",         category:"image",    badge:"🤖 AI",   desc:"Remove image backgrounds automatically using AI in the browser."                },
  { icon:"🏷",  name:"Favicon Generator",          slug:"favicon-generator",          category:"image",    badge:"",        desc:"Create favicons from image, text or emoji. All 18 sizes."                      },
  { icon:"📷", name:"Image to Text (OCR)",        slug:"image-to-text",              category:"image",    badge:"🔥 Hot",  desc:"Extract text from any image using OCR. 30+ languages supported."                },
  // ── SEO (6) ───────────────────────────────────────────────────────────────
  { icon:"🏷",  name:"Meta Tag Generator",         slug:"meta-tag-generator",         category:"seo",      badge:"🔥 Hot",  desc:"Generate SEO meta tags with live SERP preview and grade A–F."                  },
  { icon:"🤖", name:"Robots.txt Generator",        slug:"robots-txt-generator",       category:"seo",      badge:"",        desc:"Generate robots.txt to control search engine crawler access."                   },
  { icon:"🔢", name:"Keyword Density Checker",    slug:"keyword-density-checker",    category:"seo",      badge:"",        desc:"Analyse keyword frequency and density in any text or webpage."                  },
  { icon:"📊", name:"Open Graph Generator",       slug:"open-graph-generator",       category:"seo",      badge:"",        desc:"Generate Open Graph tags with live Facebook and LinkedIn previews."              },
  { icon:"🗺",  name:"Sitemap Generator",           slug:"sitemap-generator",          category:"seo",      badge:"",        desc:"Generate XML sitemaps with smart priority and Google Ping."                    },
  { icon:"🧠", name:"llms.txt Generator",          slug:"llms-txt-generator",         category:"seo",      badge:"🆕 New",  desc:"Generate a spec-compliant llms.txt so AI assistants can read and cite your site."           },
  // ── Finance (10) ──────────────────────────────────────────────────────────
  { icon:"🎂", name:"Age Calculator",             slug:"age-calculator",             category:"finance",  badge:"",        desc:"Calculate exact age in years, months and days from any date."                   },
  { icon:"⚖️",  name:"BMI Calculator",             slug:"bmi-calculator",             category:"finance",  badge:"",        desc:"Calculate BMI and healthy weight range in metric or imperial."                  },
  { icon:"🔢", name:"Percentage Calculator",       slug:"percentage-calculator",      category:"finance",  badge:"",        desc:"Calculate percentages, increases, decreases and differences."                   },
  { icon:"📏", name:"Unit Converter",             slug:"unit-converter",             category:"finance",  badge:"",        desc:"Convert length, weight, temperature, volume and speed units."                   },
  { icon:"💱", name:"Currency Converter",         slug:"currency-converter",         category:"finance",  badge:"",        desc:"Convert between 30+ world currencies with reference exchange rates."             },
  { icon:"🏦", name:"Loan Calculator",            slug:"loan-calculator",            category:"finance",  badge:"",        desc:"Calculate monthly payments, total interest and amortization schedule."           },
  { icon:"📈", name:"Compound Interest Calc",    slug:"compound-interest-calculator",category:"finance",  badge:"",        desc:"Calculate compound interest and investment growth over time."                   },
  { icon:"🍽",  name:"Tip Calculator",             slug:"tip-calculator",             category:"finance",  badge:"",        desc:"Calculate tips and split bills between any number of people."                   },
  { icon:"🕐", name:"Time Zone Converter",        slug:"time-zone-converter",        category:"finance",  badge:"",        desc:"Convert times between 65+ world cities with DST awareness."                     },
  { icon:"🏠", name:"Mortgage Calculator",        slug:"mortgage-calculator",        category:"finance",  badge:"",        desc:"Full PITI with PMI, amortization schedule and rent vs buy comparison."          },
  // ── Security (3) ──────────────────────────────────────────────────────────
  { icon:"🔐", name:"Password Generator",         slug:"password-generator",         category:"security", badge:"",        desc:"Generate cryptographically secure passwords with strength meter."               },
  { icon:"🔒", name:"SSL Certificate Checker",    slug:"ssl-checker",                category:"security", badge:"🆕 New",  desc:"Check SSL grade A+ to F, expiry countdown and TLS cipher details."              },
  { icon:"🌐", name:"IP Address Lookup",          slug:"ip-lookup",                  category:"security", badge:"🆕 New",  desc:"Look up any IP — location, ISP, risk score and reverse DNS."                   },
  // ── PDF (5) ───────────────────────────────────────────────────────────────
  { icon:"🗜", name:"PDF Compressor",             slug:"pdf-compressor",             category:"pdf",      badge:"🆕 New",  desc:"Compress PDFs by up to 80% with three compression levels."                      },
  { icon:"📑", name:"PDF Merger",                 slug:"pdf-merger",                 category:"pdf",      badge:"🆕 New",  desc:"Merge multiple PDFs with drag-to-reorder and custom page ranges."               },
  { icon:"✂️",  name:"PDF Splitter",               slug:"pdf-splitter",               category:"pdf",      badge:"🆕 New",  desc:"Split PDFs every page, by range or extract specific pages."                    },
  { icon:"📝", name:"PDF to Word",                slug:"pdf-to-word",                category:"pdf",      badge:"🆕 New",  desc:"Extract and convert PDF content to Word document format."                        },
  { icon:"📄", name:"Word to PDF",                slug:"word-to-pdf",                category:"pdf",      badge:"🆕 New",  desc:"Convert text documents to PDF with custom margins and page settings."            },
  // ── AI (2) ────────────────────────────────────────────────────────────────
  { icon:"✓",  name:"Grammar Checker",            slug:"grammar-checker",            category:"ai",       badge:"🆕 New",  desc:"Check grammar, spelling, style and passive voice using LanguageTool."            },
  { icon:"📊", name:"Readability Checker",        slug:"readability-checker",        category:"ai",       badge:"🆕 New",  desc:"Analyze text readability with 7 formulas and audience targeting."                },
];

// ─── Category metadata ────────────────────────────────────────────────────────

const CATEGORY_META: Record<string, {
  name: string; icon: string; color: string;
  description: string; longDesc: string;
}> = {
  text: {
    name:"Text Tools", icon:"📝", color:"from-violet-600 to-violet-400",
    description:"Word counters, case converters, grammar checkers and more.",
    longDesc:"Everything you need to write, format and analyse text. From counting words to converting case, generating placeholder text to comparing document differences — our text tools handle it all instantly.",
  },
  image: {
    name:"Image Tools", icon:"🖼️", color:"from-cyan-600 to-cyan-400",
    description:"Compress, resize, convert and edit images online free.",
    longDesc:"Professional image processing entirely in your browser. Compress photos without quality loss, resize to any dimension, remove backgrounds with AI, pick colors and generate favicons — no software to install.",
  },
  dev: {
    name:"Developer Tools", icon:"💻", color:"from-blue-600 to-blue-400",
    description:"JSON formatter, Base64, UUID, regex and developer utilities.",
    longDesc:"The toolkit every developer needs. Format and validate JSON, encode Base64, generate UUIDs, hash strings, encode URLs, test regex, edit SVG and minify CSS, JS and HTML — all in one place.",
  },
  seo: {
    name:"SEO Tools", icon:"📊", color:"from-green-600 to-green-400",
    description:"Meta tags, sitemaps, keyword tools and Open Graph generators.",
    longDesc:"Optimise your website for search engines. Generate SEO meta tags with live SERP preview, create XML sitemaps, check keyword density, analyse open graph tags and generate robots.txt — everything an SEO needs.",
  },
  ai: {
    name:"AI Tools", icon:"🤖", color:"from-pink-600 to-pink-400",
    description:"Grammar checker, readability analyzer and AI writing tools.",
    longDesc:"Harness the power of AI for better writing. Check grammar and spelling with 6,000+ rules, measure readability with 7 formulas, detect passive voice and improve your content quality automatically.",
  },
  finance: {
    name:"Finance Tools", icon:"💰", color:"from-yellow-600 to-yellow-400",
    description:"Loan, currency, mortgage, compound interest calculators.",
    longDesc:"Make smarter financial decisions. Calculate loan repayments and amortization schedules, compare mortgage options, convert currencies, calculate compound interest and analyse percentage changes — all free.",
  },
  security: {
    name:"Security Tools", icon:"🔒", color:"from-red-600 to-red-400",
    description:"Password generators, SSL checker and IP lookup tools.",
    longDesc:"Stay secure online. Generate cryptographically secure passwords, check SSL certificate health and grades, look up IP address details and risk scores — professional security tools, completely free.",
  },
  pdf: {
    name:"PDF Tools", icon:"📄", color:"from-orange-600 to-orange-400",
    description:"Compress, convert, merge and split PDF files online free.",
    longDesc:"Everything you need to work with PDFs. Compress file sizes by up to 80%, convert to Word, merge multiple documents, split pages and convert text to PDF — all free, no upload limits.",
  },
};


// ─── Deep Editorial Content, FAQs & Related Blog Guides per Category ─────────
const CATEGORY_EDITORIAL: Record<string, {
  heading: string;
  paragraphs: string[];
  faqs: { q: string; a: string }[];
  blogs: { title: string; slug: string; readTime: string }[];
}> = {
  text: {
    heading: "Why Browser-Based Text Processing Matters for Writers & Editors",
    paragraphs: [
      "Modern writing workflows span dozens of platforms, each enforcing strict structural and length constraints. Whether you are drafting an academic dissertation capped at 10,000 words, writing a meta description that truncates at 155–160 characters on Google SERPs, or comparing two contract revisions line by line, switching between heavy desktop word processors introduces unnecessary friction. PursTech's Text Tools suite runs entirely in your browser's local memory using native JavaScript string and regular-expression engines, delivering zero-latency analysis on every keystroke.",
      "Unlike server-side text utilities that transmit your drafts over the network to count words or compute diffs, every tool in this category operates 100% client-side. Confidential manuscripts, legal agreements, unpublished blog drafts, and proprietary documentation never leave your device. Our Word Counter calculates reading time (at the adult silent reading benchmark of 238 words per minute) and speaking time (130 words per minute) alongside stop-word-filtered keyword density, while our Diff Checker highlights character- and line-level insertions and deletions side by side.",
      "For formatting and accessibility workflows, the Case Converter normalizes headlines into Title Case, camelCase, snake_case, or kebab-case in one click, the Lorem Ipsum Generator produces structured placeholder copy by word, sentence, or paragraph count for UI mockups, and the Text to Speech utility leverages the Web Speech Synthesis API to read drafts aloud across multiple system voices so you can catch awkward phrasing by ear."
    ],
    faqs: [
      { q: "Are the texts I paste into PursTech Text Tools stored or uploaded?", a: "No. Every text tool on PursTech executes locally in your browser using client-side JavaScript. Your drafts, code snippets, and documents are never sent to a server, logged, or stored." },
      { q: "How does PursTech calculate reading time and speaking time?", a: "Reading time is computed using the researched adult silent-reading average of 238 words per minute (Brysbaert, 2019), while speaking time uses the standard presentation pace of 130 words per minute." },
      { q: "Can I use these text utilities on mobile devices or offline once loaded?", a: "Yes. All 5 text tools are responsive on smartphones and tablets, and because their logic runs in the browser, they continue working without server round-trips once the page is open." }
    ],
    blogs: [
      { title: "How to Check Word Count on Every Platform", slug: "how-to-check-word-count", readTime: "6 min read" },
      { title: "Word Count Guide for Every Platform & Format", slug: "word-count-guide-every-platform", readTime: "8 min read" },
      { title: "Best Free Word Counter Tools Tested Head-to-Head", slug: "best-free-word-counter-tools", readTime: "7 min read" }
    ]
  },
  image: {
    heading: "Client-Side Image Optimization, WebAssembly AI & Color Precision",
    paragraphs: [
      "Images account for the largest share of page weight on the modern web and directly impact Google Core Web Vitals metrics such as Largest Contentful Paint (LCP). Traditional online image compressors and background removers require uploading your photos to a remote cloud server, waiting in a processing queue, and accepting strict file-size caps (such as 5 MB limits) or watermarks. PursTech's Image Tools eliminate server uploads altogether by executing HTML5 Canvas rendering, WebAssembly codecs, and ONNX runtime neural networks directly on your device.",
      "When you compress a JPEG, PNG, or WebP file in our Image Compressor, or remove a background using our AI Background Remover (@imgly/background-removal running via WebAssembly), your original photographs stay inside your browser tab's memory. Our Image to Text (OCR) tool runs Tesseract.js locally to extract selectable text from scanned receipts, screenshots, and photographed documents across 30+ languages without exposing sensitive personal or financial records to third-party servers.",
      "For designers and front-end engineers, our Image Resizer includes 20+ social media and display aspect-ratio presets, our Color Picker extracts exact HEX, RGB, HSL, HSV, and CMYK values with live WCAG 2.1 AA/AAA contrast ratios, and our Favicon Generator packages all 18 standard browser, iOS Apple Touch, and Android PWA icon dimensions along with a ready-to-paste site.webmanifest file."
    ],
    faqs: [
      { q: "How can AI background removal and OCR run without uploading my image to a server?", a: "PursTech loads WebAssembly (WASM) models—specifically @imgly/background-removal for segmentation and Tesseract.js for optical character recognition—into your browser cache and runs inference directly on your CPU/GPU." },
      { q: "Which image format should I choose for web performance: WebP, JPEG, or PNG?", a: "WebP typically delivers 25–35% smaller file sizes than JPEG at equivalent visual quality and supports transparency like PNG, making it the preferred choice for modern web performance." },
      { q: "Are there any daily batch limits or watermarks on PursTech Image Tools?", a: "No. Every image tool is completely free with no watermarks, no file-count walls, and no account registration." }
    ],
    blogs: [
      { title: "How to Compress Images Without Losing Quality", slug: "how-to-compress-images-without-losing-quality", readTime: "7 min read" },
      { title: "WebP vs JPEG vs PNG: Real File Sizes Compared", slug: "webp-vs-jpeg-vs-png-2026", readTime: "8 min read" },
      { title: "Best Free TinyPNG Alternatives With No Upload Limits", slug: "tinypng-alternatives", readTime: "7 min read" },
      { title: "Best Free Background Removers Tested", slug: "best-free-background-removers", readTime: "8 min read" }
    ]
  },
  dev: {
    heading: "Zero-Telemetry Developer Utilities for Everyday Engineering Workflows",
    paragraphs: [
      "Software engineers routinely need to inspect API payloads, debug regular expressions, decode Base64 tokens, compute cryptographic digests, and minify production assets. Pasting proprietary JSON payloads, JWT claims, internal URLs, or database schemas into ad-cluttered web utilities that log requests server-side poses a serious security and compliance risk. All 14 PursTech Developer Tools are architected to execute 100% locally in your browser using native ECMAScript APIs and the W3C Web Crypto API.",
      "Our JSON Formatter validates syntax in real time, pinpoints exact line and column errors, and formats or minifies nested payloads cleanly. The Regex Tester evaluates patterns with live match highlighting, capture-group extraction, and a library of 20 production-ready patterns. For encoding and cryptography, our Base64 Encoder and URL Encoder handle UTF-8 byte sequences accurately (preventing Latin-1 btoa corruption), our UUID Generator uses crypto.randomUUID() for RFC 4122 v4 identifiers, and our Hash Generator computes MD5, SHA-1, SHA-256, and SHA-512 digests instantaneously.",
      "Front-end and documentation workflows are covered by our multi-pass CSS, HTML, and JS Minifiers (complete with estimated gzip savings), our HTML-to-Markdown converter and split-pane Markdown Editor, our Color Code Converter with WCAG contrast validation, and our interactive SVG Editor featuring live canvas manipulation and one-click React JSX component export."
    ],
    faqs: [
      { q: "Is it safe to paste production JSON payloads or tokens into PursTech Dev Tools?", a: "Yes. None of our developer utilities transmit input data over the network. JSON parsing, Base64 encoding, regex evaluation, and hashing all run inside your local browser JavaScript context." },
      { q: "How does PursTech generate UUIDs and cryptographic hashes?", a: "We use the browser's built-in W3C Web Crypto API (crypto.randomUUID() and crypto.subtle.digest()) for hardware-backed cryptographic randomness and SHA-1/SHA-256/SHA-512 digests." },
      { q: "Does the SVG Editor support exporting directly to React / JSX?", a: "Yes. The SVG Editor converts kebab-case SVG attributes (such as stroke-width and fill-rule) into camelCase JSX props and wraps the markup in a reusable React component." }
    ],
    blogs: [
      { title: "Best Free JSON Formatter & Validator Tools", slug: "best-free-json-formatter-tools", readTime: "7 min read" },
      { title: "Base64 Encoding Explained: How 3 Bytes Become 4 Characters", slug: "base64-encoding-explained", readTime: "6 min read" },
      { title: "URL Encoding Developer Guide: Percent-Encoding & UTF-8", slug: "url-encoding-developer-guide", readTime: "7 min read" },
      { title: "HEX vs RGB vs HSL: Which Color Format Should You Use?", slug: "hex-vs-rgb-vs-hsl-color-formats", readTime: "6 min read" }
    ]
  },
  seo: {
    heading: "Technical SEO & AI Search Readiness (AEO) Without Expensive Subscriptions",
    paragraphs: [
      "Search visibility today requires optimizing for both traditional search engine crawlers (Googlebot, Bingbot) and modern AI answer engines (ChatGPT Search, Claude, Perplexity, and Google AI Overviews). While enterprise SEO suites charge hundreds of dollars per month, the core technical artifacts every website needs—clean HTML meta tags, Open Graph social cards, valid robots.txt directives, XML sitemaps, balanced on-page keyword usage, and spec-compliant llms.txt files—follow open web standards that anyone can generate accurately for free.",
      "PursTech's 6 SEO Tools give webmasters, content marketers, and indie founders instant, standards-compliant generators with live visual previews. Our Meta Tag Generator grades your title and description length against Google's desktop and mobile pixel truncation thresholds while rendering a real-time SERP preview. The Open Graph Generator previews how your links appear on X/Twitter, LinkedIn, Facebook, and Discord before you publish.",
      "On the technical crawling side, our Robots.txt Generator includes pre-configured rules for both classic search bots and AI crawlers (such as GPTBot, OAI-SearchBot, ClaudeBot, and PerplexityBot), our Sitemap Generator builds valid XML sitemaps with automatic priority weighting, and our new llms.txt Generator creates Markdown-formatted root files following the llmstxt.org specification so AI assistants can discover and cite your most authoritative pages."
    ],
    faqs: [
      { q: "What is the difference between robots.txt, sitemap.xml, and llms.txt?", a: "robots.txt tells crawlers which paths they may or may not access; sitemap.xml lists all canonical URLs you want search engines to index; and llms.txt provides a concise Markdown directory of your key pages so AI assistants can read and cite your site accurately." },
      { q: "What are the ideal character lengths for SEO title tags and meta descriptions?", a: "Aim for 50–60 characters (roughly 580 pixels) for title tags and 140–160 characters for meta descriptions so Google displays them in full without ellipsis truncation." },
      { q: "Does keyword density still matter for Google rankings?", a: "Search engines no longer reward high repetition percentages; instead, checking keyword density helps you prevent accidental keyword stuffing (keeping primary terms around 1–2%) and ensure natural topical coverage." }
    ],
    blogs: [
      { title: "Free SEO Tools That Actually Work: The Essential Stack", slug: "free-seo-tools-that-work", readTime: "8 min read" },
      { title: "Word Count Guide for SEO Articles & Every Platform", slug: "word-count-guide-every-platform", readTime: "8 min read" }
    ]
  },
  ai: {
    heading: "Transparent, Rule-Backed Writing & Readability Analysis",
    paragraphs: [
      "Clear, error-free writing builds immediate credibility with readers and search engines alike. PursTech's AI Writing Tools combine rule-based linguistic inspection with classic computational readability formulas so writers, students, and editors can polish drafts without hitting paywalls or word-count caps.",
      "Our Grammar Checker evaluates up to 20,000 characters at a time against more than 6,000 grammar, spelling, punctuation, and style rules powered by LanguageTool, paired with client-side scanners for passive voice constructions, adverb overuse, sentence-length variance, and overall tone. Every flagged issue is color-coded by category with one-click replacements and a downloadable proofreading report.",
      "To ensure your writing matches your target audience's reading level, our Readability Checker computes seven industry-standard indices simultaneously—Flesch Reading Ease, Flesch-Kincaid Grade Level, Gunning Fog Index, SMOG Index, Coleman-Liau Index, Automated Readability Index (ARI), and Linsear Write—highlighting complex multi-syllable words and long sentences in real time."
    ],
    faqs: [
      { q: "What readability score should I aim for in blog posts and web content?", a: "For general web audiences, aim for a Flesch Reading Ease score between 60 and 70 (roughly a 7th to 8th grade reading level), which balances clarity with professional depth." },
      { q: "Does the Grammar Checker require an account or subscription?", a: "No. You can check grammar, spelling, passive voice, and style immediately in your browser with no sign-up and no credit card." }
    ],
    blogs: [
      { title: "Word Count Guide for Every Platform & Content Type", slug: "word-count-guide-every-platform", readTime: "8 min read" },
      { title: "Best Free Word Counter & Writing Analysis Tools", slug: "best-free-word-counter-tools", readTime: "7 min read" }
    ]
  },
  finance: {
    heading: "Transparent Financial, Health & Everyday Calculators Built on Standard Formulas",
    paragraphs: [
      "Financial and quantitative decisions—whether comparing a 15-year versus 30-year mortgage, modeling extra monthly principal payments on a loan, projecting compound investment growth, or splitting a restaurant bill—depend on transparent, verifiable math. Many finance portals bury simple calculators behind lead-generation forms that harvest your email address or phone number for lenders. PursTech's 10 Finance & Everyday Calculators give you instant, interactive schedules and breakdowns with zero contact forms or tracking walls.",
      "Our Loan Calculator and Mortgage Calculator compute exact monthly principal and interest using standard fixed-rate amortization equations, factoring in property taxes, homeowner's insurance, HOA dues, PMI thresholds, and extra payment scenarios with full year-by-year and month-by-month amortization tables. The Compound Interest Calculator models regular contributions across multiple compounding frequencies (daily, monthly, quarterly, annually) and adjusts for inflation to reveal real purchasing power.",
      "Alongside core finance utilities, this category includes everyday quantitative tools: a 30+ currency converter with an all-currencies comparison table, a multi-mode Percentage Calculator, a Restaurant Tip & Bill Split Calculator, a 65+ city DST-aware Time Zone Converter, a multi-category Unit Converter, an exact Chronological Age Calculator, and a WHO-standard BMI Calculator."
    ],
    faqs: [
      { q: "Are PursTech's loan, mortgage, and compound interest calculators financial advice?", a: "No. All calculators provide mathematical estimates based on standard financial formulas and the inputs you enter for educational and planning purposes only. Always consult a qualified financial professional or lender before making financial commitments." },
      { q: "How much interest can extra monthly payments save on a loan or mortgage?", a: "Because extra payments reduce your principal balance directly, every dollar paid early avoids compounding interest for the remainder of the loan term—often saving tens of thousands of dollars and shaving years off a 30-year mortgage." }
    ],
    blogs: [
      { title: "Loan Calculator Guide: How Small Extra Payments Save Thousands", slug: "loan-calculator-with-extra-payments", readTime: "8 min read" },
      { title: "BMI Calculator Guide: What Your Score Actually Means", slug: "bmi-calculator-guide-what-your-score-means", readTime: "7 min read" }
    ]
  },
  security: {
    heading: "Cryptographic Password Generation, TLS Inspection & Network Diagnostics",
    paragraphs: [
      "Online security starts with high-entropy credentials and properly configured transport encryption. PursTech's Security Tools give everyday users, system administrators, and web developers instant access to cryptographic password generation, live TLS/SSL certificate grading, and IP network intelligence without requiring command-line utilities like OpenSSL or dig.",
      "Our Password Generator never uses predictable Math.random() calls; instead, it draws entropy directly from your operating system's CSPRNG via window.crypto.getRandomValues(), calculating real-time bit entropy and estimated brute-force crack times across character sets or memorable multi-word passphrases. Everything happens locally in your browser memory—generated passwords never touch the network.",
      "For server and domain diagnostics, our SSL Certificate Checker performs a live TLS handshake against port 443 to inspect certificate validity windows, key bit-lengths, TLS 1.2/1.3 protocol negotiation, cipher suites, and Subject Alternative Names (grading configurations from A+ to F), while our IP Address Lookup surfaces geolocation, ASN/ISP ownership, timezone, and network metadata."
    ],
    faqs: [
      { q: "Why is password length more important than complex symbol substitutions?", a: "Each additional character multiplies the total keyspace exponentially. A 16-character random password or 5-word passphrase provides vastly higher bit entropy against modern GPU hash-cracking rigs than a short 8-character password with predictable substitutions like '@' for 'a'." },
      { q: "Are passwords generated on PursTech ever transmitted over the internet?", a: "Never. Password generation runs 100% locally in your browser using window.crypto.getRandomValues()." }
    ],
    blogs: [
      { title: "Strong Password Guide: Why Length Beats Complexity", slug: "strong-password-guide", readTime: "7 min read" }
    ]
  },
  pdf: {
    heading: "100% Client-Side PDF Processing: Compress, Merge, Split & Convert Without Uploads",
    paragraphs: [
      "PDF documents frequently contain your most sensitive personal and business information: signed contracts, tax returns, bank statements, medical records, academic transcripts, and invoices. Almost every popular 'free online PDF tool' uploads your files to a remote cloud server for processing—exposing confidential documents to third-party storage, bandwidth bottlenecks, daily task limits, and paywalls.",
      "PursTech's 5 PDF Tools are engineered around a strict zero-upload architecture using pdf-lib and Mozilla PDF.js directly inside your browser. When you compress a large PDF in our PDF Compressor, combine multiple files with custom page ranges in our PDF Merger, extract specific pages in our PDF Splitter, extract editable text in PDF to Word, or typeset documents in Word to PDF, the entire binary manipulation occurs in your device's local RAM.",
      "Because no file is ever uploaded or downloaded from a remote processing server, operations on multi-megabyte PDFs complete in seconds—even on slow connections—and you can batch-process, merge, or split as many documents as you need with zero watermarks and zero daily caps."
    ],
    faqs: [
      { q: "Do my PDF files ever get uploaded to PursTech's servers?", a: "No. All 5 PDF utilities process your files locally inside your browser using JavaScript (pdf-lib and PDF.js). Your documents never leave your computer or phone." },
      { q: "How do I compress a PDF without making text blurry?", a: "Use the Medium (150 DPI) compression preset for email and web sharing, which strips redundant metadata and optimizes embedded streams while keeping vector text razor-sharp." },
      { q: "Can I merge or split multiple PDFs for free without a watermark?", a: "Yes. PursTech never adds watermarks, page limits, or daily file caps to any PDF tool." }
    ],
    blogs: [
      { title: "How to Compress a PDF Without Losing Quality", slug: "compress-pdf-without-losing-quality", readTime: "7 min read" },
      { title: "How to Merge PDF Files Privately Without Uploading", slug: "merge-pdf-files-without-uploading", readTime: "6 min read" },
      { title: "Best Free PDF Mergers Tested for Privacy & Speed", slug: "best-free-pdf-mergers", readTime: "8 min read" }
    ]
  }
};

// ─── Metadata ─────────────────────────────────────────────────────────────────
// QA fixes:
//  ✅ Title fixed — was double-branded and repeated category name twice
//  ✅ alternates.canonical added
//  ✅ openGraph added
//  ✅ twitter added
//  ✅ robots added

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug }  = await params;
  const meta      = CATEGORY_META[slug];
  if (!meta) return { title: "Category Not Found" };

  const toolCount = ALL_TOOLS.filter(t => t.category === slug).length;

  // "Free Text Tools Online — No Login Required | PursTech" (53 chars ✅)
  // "Free Developer Tools Online — No Login Required | PursTech" (59 chars ✅)
  const title       = `Free ${meta.name} Online — No Login Required`;
  const description = `${toolCount} free ${meta.name.toLowerCase()} available online with no login required. ${meta.description} ${meta.longDesc.slice(0, 60)}`.slice(0, 160);

  return {
    title,
    description,

    alternates: { canonical: `/categories/${slug}` },

    openGraph: {
      type:        "website",
      url:         `https://www.purstech.com/categories/${slug}`,
      siteName:    "PursTech",
      title,
      description: `${meta.description} ${toolCount} free tools — no login, no limits, 100% browser-based.`,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `PursTech ${meta.name}` }],
    },

    twitter: {
      card:        "summary_large_image",
      title,
      description: `${toolCount} free ${meta.name.toLowerCase()} — no login, instant results.`,
      images:      ["/og-image.png"],
      creator:     "@purstech",
    },

    robots: {
      index:  true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export function generateStaticParams() {
  return Object.keys(CATEGORY_META).map(slug => ({ slug }));
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CategoryPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const meta     = CATEGORY_META[slug];
  if (!meta) notFound();

  const tools           = ALL_TOOLS.filter(t => t.category === slug);
  const comingSoon      = tools.length === 0;
  const otherCategories = Object.entries(CATEGORY_META).filter(([s]) => s !== slug).slice(0, 6);

  // ── JSON-LD Schemas ──────────────────────────────────────────────────────
  const collectionSchema = {
    "@context":   "https://schema.org",
    "@type":      "CollectionPage",
    "@id":        `https://www.purstech.com/categories/${slug}`,
    name:         `Free ${meta.name} — PursTech`,
    description:  meta.longDesc,
    url:          `https://www.purstech.com/categories/${slug}`,
    isPartOf:     { "@id": "https://www.purstech.com/#website" },
  };

  const itemListSchema = {
    "@context":    "https://schema.org",
    "@type":       "ItemList",
    name:          `Free ${meta.name} — PursTech`,
    numberOfItems: tools.length,
    itemListElement: tools.map((t, i) => ({
      "@type":    "ListItem",
      position:   i + 1,
      name:       t.name,
      url:        `https://www.purstech.com/tools/${t.slug}`,
      description:t.desc,
    })),
  };

  const breadcrumbSchema = {
    "@context":        "https://schema.org",
    "@type":           "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",    item: "https://www.purstech.com"                             },
      { "@type": "ListItem", position: 2, name: "Tools",   item: "https://www.purstech.com/tools"                       },
      { "@type": "ListItem", position: 3, name: meta.name, item: `https://www.purstech.com/categories/${slug}`          },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">

      {/* JSON-LD Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema)   }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ── Navbar — fixed: added /contact and /pro ── */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/tools"   className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
            <Link href="/blog"    className="text-sm text-gray-500 hover:text-white transition-colors">Blog</Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:text-white transition-colors">Contact</Link>
            <Link href="/pro"
              className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">
              Go Pro ⚡
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">

        {/* Breadcrumb — aria-label added */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link>
          <span aria-hidden="true">›</span>
          <span className="text-gray-400">{meta.name}</span>
        </nav>

        {/* Category header */}
        <div className="mb-12">
          <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${meta.color} p-px rounded-2xl mb-6`}>
            <div className="bg-[#0A0A14] rounded-2xl px-5 py-3 flex items-center gap-3">
              <span className="text-3xl">{meta.icon}</span>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">{meta.name}</h1>
                <p className="text-gray-400 text-sm">{meta.description}</p>
              </div>
            </div>
          </div>

          <p className="text-gray-500 max-w-2xl leading-relaxed">{meta.longDesc}</p>

          {tools.length > 0 && (
            <div className="flex items-center gap-3 mt-4">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-500">
                <span className="text-green-400 font-bold">{tools.length} tool{tools.length !== 1 ? "s" : ""}</span>{" "}
                available — free, no login required
              </span>
            </div>
          )}
        </div>

        {/* Tools grid */}
        {comingSoon ? (
          <div className="bg-[#13131F] border border-white/5 rounded-3xl p-16 text-center mb-12">
            <div className="text-6xl mb-4">{meta.icon}</div>
            <h2 className="text-2xl font-extrabold text-white mb-3">{meta.name} Coming Soon</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              We are building these tools right now. Check back soon — we add new tools every week.
            </p>
            <Link href="/tools"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-bold transition-all">
              Browse Available Tools →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
            {tools.map(tool => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group bg-[#13131F] border border-white/5 rounded-2xl p-5 hover:border-[#6C3AFF]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{tool.icon}</span>
                  {tool.badge && (
                    <span className="text-[10px] bg-[#6C3AFF]/20 text-[#6C3AFF] px-2 py-0.5 rounded-full font-bold border border-[#6C3AFF]/20">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <h2 className="font-bold text-white text-sm mb-2 group-hover:text-[#6C3AFF] transition-colors leading-snug">
                  {tool.name}
                </h2>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-3">
                  {tool.desc}
                </p>
                {/* Replaced fake usage stats with honest "Free" badge */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-green-400 font-semibold">Free · No login</span>
                  <span className="text-xs text-gray-700 group-hover:text-[#6C3AFF] transition-colors">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Category Editorial Deep-Dive, Related Guides & FAQs */}
        {CATEGORY_EDITORIAL[slug] && (
          <div className="mb-16 space-y-12">
            <section className="bg-[#13131F] border border-white/5 rounded-3xl p-8 md:p-10 space-y-4">
              <h2 className="text-2xl font-extrabold text-white mb-2">
                {CATEGORY_EDITORIAL[slug].heading}
              </h2>
              {CATEGORY_EDITORIAL[slug].paragraphs.map((p, idx) => (
                <p key={idx} className="text-gray-400 text-sm md:text-base leading-relaxed">
                  {p}
                </p>
              ))}
            </section>

            {CATEGORY_EDITORIAL[slug].blogs.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-extrabold text-white">📖 In-Depth {meta.name} Guides &amp; Tutorials</h2>
                  <Link href="/blog" className="text-xs font-bold text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">
                    View all guides →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {CATEGORY_EDITORIAL[slug].blogs.map(b => (
                    <Link
                      key={b.slug}
                      href={`/blog/${b.slug}`}
                      className="bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 rounded-2xl p-5 transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#6C3AFF] bg-[#6C3AFF]/10 px-2.5 py-1 rounded-full mb-3">
                          {b.readTime}
                        </span>
                        <h3 className="font-bold text-white text-sm group-hover:text-[#00D4FF] transition-colors leading-snug">
                          {b.title}
                        </h3>
                      </div>
                      <span className="text-xs text-gray-500 group-hover:text-white mt-4 inline-flex items-center gap-1">
                        Read tutorial →
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section className="max-w-3xl">
              <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions About {meta.name}</h2>
              <div className="space-y-3">
                {CATEGORY_EDITORIAL[slug].faqs.map((faq, idx) => (
                  <details key={idx} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                    <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                      <span>{faq.q}</span>
                      <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</div>
                  </details>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Other categories */}
        <div>
          <h2 className="text-xl font-extrabold text-white mb-6">Browse Other Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {otherCategories.map(([s, m]) => {
              const count = ALL_TOOLS.filter(t => t.category === s).length;
              return (
                <Link key={s} href={`/categories/${s}`}
                  className="bg-[#13131F] border border-white/5 rounded-2xl p-4 hover:border-[#6C3AFF]/40 transition-all text-center group">
                  <div className="text-2xl mb-2">{m.icon}</div>
                  <div className="text-xs font-bold text-white group-hover:text-[#6C3AFF] transition-colors">{m.name}</div>
                  <div className="text-[10px] text-gray-600 mt-1">{count > 0 ? `${count} tools` : "Soon"}</div>
                </Link>
              );
            })}
          </div>
        </div>

      </main>

      {/* ── Footer — fixed: added Privacy Policy + Terms + Contact ── */}
      <footer className="border-t border-white/5 mt-20 py-8 text-center">
        <Link href="/" className="text-xl font-black">
          Purs<span className="text-[#6C3AFF]">Tech</span>
        </Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. Free online tools for everyone.</p>
      </footer>
    </div>
  );
}
