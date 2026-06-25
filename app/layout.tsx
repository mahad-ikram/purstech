import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// ─── Global SEO Metadata ─────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default:  "PursTech — 50 Free Online Tools | No Login, No Limits",
    template: "%s | PursTech",
  },

  description:
    "50 completely free online tools — no login, no limits, no ads. PDF compressor, image compressor, grammar checker, JSON formatter, meta tag generator, SSL checker, readability checker and more. 100% browser-based.",

  keywords: [
    "purstech", "purstech tools",
    "free online tools", "free tools no login", "online utilities",
    "pdf compressor online free", "image compressor online free",
    "grammar checker free", "json formatter online", "meta tag generator",
    "readability checker", "ssl certificate checker", "ip address lookup",
    "word counter online", "qr code generator free", "svg editor online",
    "regex tester online", "markdown editor", "base64 encoder",
    "free pdf tools", "free seo tools", "free developer tools",
    "free image tools", "free ai writing tools", "free security tools",
  ],

  authors:   [{ name: "PursTech", url: "https://www.purstech.com" }],
  creator:   "PursTech",
  publisher: "PursTech",

  metadataBase: new URL("https://www.purstech.com"),

  // ─── alternates.canonical intentionally NOT set in root layout ──────────
  // Setting it here causes every page to emit canonical → homepage, which
  // breaks per-page indexing. Each page.tsx declares its own canonical.

  verification: { google: "google5dee1d926c4757f1" },

  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },

  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         "https://www.purstech.com",
    siteName:    "PursTech",
    title:       "PursTech — 50 Free Online Tools. No Login. No Limits.",
    description: "PDF tools, image tools, grammar checker, JSON formatter, meta tag generator, SSL checker and 44 more — all free, all browser-based, all with no account required.",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "PursTech — 50 Free Online Tools" },
    ],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "PursTech — 50 Free Online Tools. No Login. No Limits.",
    description: "PDF compressor, grammar checker, image tools, SEO tools, dev tools and more — all free, all browser-based.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },

  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-icon.png",
  },

  other: {
    "application-name": "PursTech",
    "description:extended":
      "PursTech is a free online tool platform offering 50 tools in 8 categories: " +
      "text tools (word counter, case converter, lorem ipsum, diff checker, text to speech), " +
      "developer tools (JSON formatter, regex tester, base64 encoder, markdown editor, SVG editor, QR code generator), " +
      "image tools (image compressor, image resizer, background remover, favicon generator, OCR), " +
      "SEO tools (meta tag generator, robots.txt generator, sitemap generator, open graph generator), " +
      "PDF tools (compressor, merger, splitter, PDF to Word, Word to PDF), " +
      "finance tools (loan calculator, mortgage calculator, compound interest, currency converter), " +
      "security tools (password generator, SSL checker, IP lookup), " +
      "AI tools (grammar checker, readability checker). " +
      "All tools are free, require no login, have no usage limits and run entirely in the browser.",
  },
};

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────

const WEBSITE_SCHEMA = {
  "@context":  "https://schema.org",
  "@type":     "WebSite",
  "@id":       "https://www.purstech.com/#website",
  name:        "PursTech",
  url:         "https://www.purstech.com",
  description: "50 free browser-based online tools — PDF, image, developer, SEO, grammar, readability, security and more. No login required.",
  inLanguage:  "en-US",
  publisher:   { "@id": "https://www.purstech.com/#organization" },
  potentialAction: {
    "@type": "SearchAction",
    target:  { "@type": "EntryPoint", urlTemplate: "https://www.purstech.com/tools?search={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

const ORGANIZATION_SCHEMA = {
  "@context":   "https://schema.org",
  "@type":      "Organization",
  "@id":        "https://www.purstech.com/#organization",
  name:         "PursTech",
  url:          "https://www.purstech.com",
  logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 },
  description:  "PursTech provides 50 free browser-based online tools for developers, writers, SEO professionals, students and everyday users. All tools are completely free with no account required.",
  foundingDate: "2025",
  slogan:       "Stop Searching. Start Doing.",
  knowsAbout: [
    "Online tools", "PDF compression", "Image compression", "Grammar checking",
    "Readability analysis", "SEO tools", "Developer utilities", "Free web tools",
  ],
  sameAs: [
    "https://www.linkedin.com/company/purstech",
    "https://www.instagram.com/purstech",
    "https://www.youtube.com/@PursTech",
    "https://www.facebook.com/share/1R3Q9JZ7ks/",
    "https://twitter.com/purstech",
  ],
};

const TOOLS_LIST_SCHEMA = {
  "@context":    "https://schema.org",
  "@type":       "ItemList",
  "@id":         "https://www.purstech.com/#toollist",
  name:          "All Free Tools — PursTech",
  description:   "Complete list of all 50 free online tools available on PursTech.",
  numberOfItems: 50,
  itemListElement: [
    { "@type":"ListItem", position:1,  name:"Word Counter",                  url:"https://www.purstech.com/tools/word-counter"                 },
    { "@type":"ListItem", position:2,  name:"Case Converter",                url:"https://www.purstech.com/tools/case-converter"               },
    { "@type":"ListItem", position:3,  name:"Lorem Ipsum Generator",         url:"https://www.purstech.com/tools/lorem-ipsum"                  },
    { "@type":"ListItem", position:4,  name:"Diff Checker",                  url:"https://www.purstech.com/tools/diff-checker"                 },
    { "@type":"ListItem", position:5,  name:"Text to Speech",                url:"https://www.purstech.com/tools/text-to-speech"               },
    { "@type":"ListItem", position:6,  name:"JSON Formatter",                url:"https://www.purstech.com/tools/json-formatter"               },
    { "@type":"ListItem", position:7,  name:"Base64 Encoder",                url:"https://www.purstech.com/tools/base64-encoder"               },
    { "@type":"ListItem", position:8,  name:"URL Encoder",                   url:"https://www.purstech.com/tools/url-encoder"                  },
    { "@type":"ListItem", position:9,  name:"UUID Generator",                url:"https://www.purstech.com/tools/uuid-generator"               },
    { "@type":"ListItem", position:10, name:"QR Code Generator",             url:"https://www.purstech.com/tools/qr-code-generator"            },
    { "@type":"ListItem", position:11, name:"Hash Generator",                url:"https://www.purstech.com/tools/hash-generator"               },
    { "@type":"ListItem", position:12, name:"CSS Minifier",                  url:"https://www.purstech.com/tools/css-minifier"                 },
    { "@type":"ListItem", position:13, name:"HTML Minifier",                 url:"https://www.purstech.com/tools/html-minifier"                },
    { "@type":"ListItem", position:14, name:"Regex Tester",                  url:"https://www.purstech.com/tools/regex-tester"                 },
    { "@type":"ListItem", position:15, name:"JS Minifier",                   url:"https://www.purstech.com/tools/js-minifier"                  },
    { "@type":"ListItem", position:16, name:"HTML to Markdown",              url:"https://www.purstech.com/tools/html-to-markdown"             },
    { "@type":"ListItem", position:17, name:"Markdown Editor",               url:"https://www.purstech.com/tools/markdown-editor"              },
    { "@type":"ListItem", position:18, name:"Color Code Converter",          url:"https://www.purstech.com/tools/color-code-converter"         },
    { "@type":"ListItem", position:19, name:"SVG Editor",                    url:"https://www.purstech.com/tools/svg-editor"                   },
    { "@type":"ListItem", position:20, name:"Color Picker",                  url:"https://www.purstech.com/tools/color-picker"                 },
    { "@type":"ListItem", position:21, name:"Image Compressor",              url:"https://www.purstech.com/tools/image-compressor"             },
    { "@type":"ListItem", position:22, name:"Image Resizer",                 url:"https://www.purstech.com/tools/image-resizer"                },
    { "@type":"ListItem", position:23, name:"Background Remover",            url:"https://www.purstech.com/tools/background-remover"           },
    { "@type":"ListItem", position:24, name:"Favicon Generator",             url:"https://www.purstech.com/tools/favicon-generator"            },
    { "@type":"ListItem", position:25, name:"Image to Text (OCR)",           url:"https://www.purstech.com/tools/image-to-text"                },
    { "@type":"ListItem", position:26, name:"Meta Tag Generator",            url:"https://www.purstech.com/tools/meta-tag-generator"           },
    { "@type":"ListItem", position:27, name:"Robots.txt Generator",          url:"https://www.purstech.com/tools/robots-txt-generator"         },
    { "@type":"ListItem", position:28, name:"Keyword Density Checker",       url:"https://www.purstech.com/tools/keyword-density-checker"      },
    { "@type":"ListItem", position:29, name:"Open Graph Generator",          url:"https://www.purstech.com/tools/open-graph-generator"         },
    { "@type":"ListItem", position:30, name:"Sitemap Generator",             url:"https://www.purstech.com/tools/sitemap-generator"            },
    { "@type":"ListItem", position:31, name:"Age Calculator",                url:"https://www.purstech.com/tools/age-calculator"               },
    { "@type":"ListItem", position:32, name:"BMI Calculator",                url:"https://www.purstech.com/tools/bmi-calculator"               },
    { "@type":"ListItem", position:33, name:"Percentage Calculator",         url:"https://www.purstech.com/tools/percentage-calculator"        },
    { "@type":"ListItem", position:34, name:"Unit Converter",                url:"https://www.purstech.com/tools/unit-converter"               },
    { "@type":"ListItem", position:35, name:"Currency Converter",            url:"https://www.purstech.com/tools/currency-converter"           },
    { "@type":"ListItem", position:36, name:"Loan Calculator",               url:"https://www.purstech.com/tools/loan-calculator"              },
    { "@type":"ListItem", position:37, name:"Compound Interest Calculator",  url:"https://www.purstech.com/tools/compound-interest-calculator" },
    { "@type":"ListItem", position:38, name:"Tip Calculator",                url:"https://www.purstech.com/tools/tip-calculator"               },
    { "@type":"ListItem", position:39, name:"Time Zone Converter",           url:"https://www.purstech.com/tools/time-zone-converter"          },
    { "@type":"ListItem", position:40, name:"Mortgage Calculator",           url:"https://www.purstech.com/tools/mortgage-calculator"          },
    { "@type":"ListItem", position:41, name:"Password Generator",            url:"https://www.purstech.com/tools/password-generator"           },
    { "@type":"ListItem", position:42, name:"SSL Certificate Checker",       url:"https://www.purstech.com/tools/ssl-checker"                  },
    { "@type":"ListItem", position:43, name:"IP Address Lookup",             url:"https://www.purstech.com/tools/ip-lookup"                    },
    { "@type":"ListItem", position:44, name:"PDF Compressor",                url:"https://www.purstech.com/tools/pdf-compressor"               },
    { "@type":"ListItem", position:45, name:"PDF Merger",                    url:"https://www.purstech.com/tools/pdf-merger"                   },
    { "@type":"ListItem", position:46, name:"PDF Splitter",                  url:"https://www.purstech.com/tools/pdf-splitter"                 },
    { "@type":"ListItem", position:47, name:"PDF to Word",                   url:"https://www.purstech.com/tools/pdf-to-word"                  },
    { "@type":"ListItem", position:48, name:"Word to PDF",                   url:"https://www.purstech.com/tools/word-to-pdf"                  },
    { "@type":"ListItem", position:49, name:"Grammar Checker",               url:"https://www.purstech.com/tools/grammar-checker"              },
    { "@type":"ListItem", position:50, name:"Readability Checker",           url:"https://www.purstech.com/tools/readability-checker"          },
  ],
};

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6963502356186067" crossOrigin="anonymous" />

        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-NP2Q5W1K5L" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-NP2Q5W1K5L', { send_page_view: true });
        ` }} />

        {/* Microsoft Clarity */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "xcn63iiqpm");
        ` }} />

        {/* Structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA)      }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(TOOLS_LIST_SCHEMA)   }} />

        {/* Performance hints */}
        <link rel="preconnect"   href="https://fonts.googleapis.com" />
        <link rel="preconnect"   href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* LLM discovery */}
        <meta name="category"       content="Online Tools, Utilities, Developer Tools, SEO Tools, PDF Tools, AI Writing Tools" />
        <meta name="classification" content="Free Online Tool Platform" />
        <meta name="coverage"       content="Worldwide" />
        <meta name="target"         content="all" />

        {/* Theme */}
        <meta name="theme-color"      content="#0A0A14" />
        <meta name="color-scheme"     content="dark" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.className} bg-[#0A0A14] text-white antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
