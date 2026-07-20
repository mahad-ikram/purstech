import type { Metadata } from "next";
import { Suspense } from "react";
import AllToolsClient from "./client";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "All 50 Free Online Tools — Browse by Category",
  description: "Browse all 50 free online tools on PursTech — no login, no limits. PDF compressor, image compressor, grammar checker, JSON formatter, meta tag generator, SSL checker, regex tester, readability checker and more across 8 categories.",
  alternates: { canonical: "/tools" },
  keywords: [
    "free online tools","all free tools","pdf tools free","image tools online",
    "developer tools free","seo tools free","grammar checker free online",
    "readability checker free","json formatter","image compressor free",
    "pdf compressor online","ssl checker free","ip address lookup free",
  ],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools",
    siteName: "PursTech",
    title: "All 50 Free Online Tools — Browse by Category",
    description: "50 free browser-based tools — PDF, image, SEO, developer, AI, finance and security. No login, no limits, no ads.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "All 50 Free Online Tools — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "All 50 Free Online Tools — PursTech",
    description: "PDF, image, SEO, dev, AI tools — all free, no login.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  // ✅ robots must be OBJECT (was a string in original — Next.js doesn't parse string form)
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

// ─── JSON-LD schemas ──────────────────────────────────────────────────────────

const COLLECTION_SCHEMA = {
  "@context": "https://schema.org", "@type": "CollectionPage",
  "@id": "https://www.purstech.com/tools/#collectionpage",
  name: "All Free Online Tools — PursTech",
  description: "50 free online tools across 8 categories — PDF, image, developer, SEO, AI, finance, security and text. No login required.",
  url: "https://www.purstech.com/tools",
  numberOfItems: 50,
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: { "@id": "https://www.purstech.com/#organization" },
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",       item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "All Tools",  item: "https://www.purstech.com/tools" },
  ],
};

// ✅ WebSite + SearchAction → enables Google sitelinks search box on brand SERPs
const WEBSITE_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebSite",
  "@id": "https://www.purstech.com/#website",
  url: "https://www.purstech.com", name: "PursTech",
  description: "50 free browser-based tools — PDF, image, SEO, developer, AI, finance and security.",
  publisher: { "@id": "https://www.purstech.com/#organization" },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: "https://www.purstech.com/tools?search={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

// ✅ 8 ItemList schemas — one per category (was only 2: PDF + SEO)
const CATEGORY_TOOLS: Record<string, { name: string; slug: string }[]> = {
  pdf: [
    { name:"PDF Compressor",  slug:"pdf-compressor" },
    { name:"PDF Merger",      slug:"pdf-merger"     },
    { name:"PDF Splitter",    slug:"pdf-splitter"   },
    { name:"PDF to Word",     slug:"pdf-to-word"    },
    { name:"Word to PDF",     slug:"word-to-pdf"    },
  ],
  image: [
    { name:"Color Picker",          slug:"color-picker"        },
    { name:"Image Compressor",      slug:"image-compressor"    },
    { name:"Image Resizer",         slug:"image-resizer"       },
    { name:"Background Remover",    slug:"background-remover"  },
    { name:"Favicon Generator",     slug:"favicon-generator"   },
    { name:"Image to Text (OCR)",   slug:"image-to-text"       },
  ],
  dev: [
    { name:"JSON Formatter",       slug:"json-formatter"        },
    { name:"Base64 Encoder",       slug:"base64-encoder"        },
    { name:"URL Encoder",          slug:"url-encoder"           },
    { name:"UUID Generator",       slug:"uuid-generator"        },
    { name:"QR Code Generator",    slug:"qr-code-generator"     },
    { name:"Hash Generator",       slug:"hash-generator"        },
    { name:"CSS Minifier",         slug:"css-minifier"          },
    { name:"HTML Minifier",        slug:"html-minifier"         },
    { name:"Regex Tester",         slug:"regex-tester"          },
    { name:"JS Minifier",          slug:"js-minifier"           },
    { name:"HTML to Markdown",     slug:"html-to-markdown"      },
    { name:"Markdown Editor",      slug:"markdown-editor"       },
    { name:"Color Code Converter", slug:"color-code-converter"  },
    { name:"SVG Editor",           slug:"svg-editor"            },
  ],
  seo: [
    { name:"Meta Tag Generator",      slug:"meta-tag-generator"      },
    { name:"Robots.txt Generator",    slug:"robots-txt-generator"    },
    { name:"Keyword Density Checker", slug:"keyword-density-checker" },
    { name:"Open Graph Generator",    slug:"open-graph-generator"    },
    { name:"Sitemap Generator",       slug:"sitemap-generator"       },
  ],
  ai: [
    { name:"Grammar Checker",     slug:"grammar-checker"     },
    { name:"Readability Checker", slug:"readability-checker" },
  ],
  finance: [
    { name:"Age Calculator",                slug:"age-calculator"                 },
    { name:"BMI Calculator",                slug:"bmi-calculator"                 },
    { name:"Percentage Calculator",         slug:"percentage-calculator"          },
    { name:"Unit Converter",                slug:"unit-converter"                 },
    { name:"Currency Converter",            slug:"currency-converter"             },
    { name:"Loan Calculator",               slug:"loan-calculator"                },
    { name:"Compound Interest Calculator",  slug:"compound-interest-calculator"   },
    { name:"Tip Calculator",                slug:"tip-calculator"                 },
    { name:"Time Zone Converter",           slug:"time-zone-converter"            },
    { name:"Mortgage Calculator",           slug:"mortgage-calculator"            },
  ],
  security: [
    { name:"Password Generator",      slug:"password-generator" },
    { name:"SSL Certificate Checker", slug:"ssl-checker"        },
    { name:"IP Address Lookup",       slug:"ip-lookup"          },
  ],
  text: [
    { name:"Word Counter",          slug:"word-counter"     },
    { name:"Case Converter",        slug:"case-converter"   },
    { name:"Lorem Ipsum Generator", slug:"lorem-ipsum"      },
    { name:"Diff Checker",          slug:"diff-checker"     },
    { name:"Text to Speech",        slug:"text-to-speech"   },
  ],
};

const CATEGORY_LABELS: Record<string, string> = {
  pdf:"PDF", image:"Image", dev:"Developer", seo:"SEO",
  ai:"AI", finance:"Finance", security:"Security", text:"Text",
};

const CATEGORY_SCHEMAS = Object.entries(CATEGORY_TOOLS).map(([cat, tools]) => ({
  "@context": "https://schema.org", "@type": "ItemList",
  name: `Free ${CATEGORY_LABELS[cat]} Tools — PursTech`,
  url: `https://www.purstech.com/categories/${cat}`,
  numberOfItems: tools.length,
  itemListElement: tools.map((t, i) => ({
    "@type": "ListItem", position: i + 1, name: t.name,
    url: `https://www.purstech.com/tools/${t.slug}`,
  })),
}));

// ✅ Site-level FAQPage schema (for AdSense + Google rich results)
const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Are all PursTech tools really free?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Every tool on PursTech is completely free with no daily usage limits, no watermarks and no premium tiers blocking core features. PursTech Pro adds optional extras like batch processing and API access, but the standard tools remain free forever." } },
    { "@type": "Question", name: "Do I need to create an account?",
      acceptedAnswer: { "@type": "Answer", text: "No account is required to use any tool. There is no sign-up wall, no email collection and no usage tracking tied to identity. Open any tool and start using it immediately." } },
    { "@type": "Question", name: "Are my files uploaded to your servers?",
      acceptedAnswer: { "@type": "Answer", text: "All image, PDF, OCR and file-processing tools run entirely in your browser using WebAssembly and native JavaScript APIs. Your files are never uploaded to any server. The only tools that make network requests are those that need them by design — SSL Checker, IP Lookup and Currency Converter." } },
    { "@type": "Question", name: "Can I use these tools commercially?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. You may use the output of any PursTech tool in commercial, client and internal projects. The tools themselves are owned by PursTech, but the content you produce with them is yours." } },
    { "@type": "Question", name: "How are the tools funded if they are free?",
      acceptedAnswer: { "@type": "Answer", text: "PursTech is funded through non-intrusive advertising and an optional Pro subscription for power users who want batch processing, API access and zero ads. The free tools remain fully functional and free forever." } },
  ],
};

// ─── Server-rendered hero content (Rule 12: hero via {children}) ─────────────

const CATEGORY_HIGHLIGHTS = [
  { emoji:"📄", cat:"PDF Tools",       tools:"Compress, merge, split, PDF to Word, Word to PDF"       },
  { emoji:"🖼️", cat:"Image Tools",     tools:"Compress, resize, background remover, OCR, favicon"     },
  { emoji:"💻", cat:"Developer Tools", tools:"JSON, regex, SVG editor, markdown, base64, QR codes"    },
  { emoji:"📊", cat:"SEO Tools",       tools:"Meta tags, sitemap, open graph, robots.txt, keyword density" },
  { emoji:"🤖", cat:"AI Tools",        tools:"Grammar checker, readability checker"                   },
  { emoji:"💰", cat:"Finance Tools",   tools:"Loan, mortgage, compound interest, currency, tip"       },
  { emoji:"🔒", cat:"Security Tools",  tools:"Password generator, SSL checker, IP lookup"             },
  { emoji:"📝", cat:"Text Tools",      tools:"Word counter, case converter, diff checker, lorem ipsum" },
];

const HERO = (
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
              All{" "}
              <span className="bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] bg-clip-text text-transparent">
                Free Tools
              </span>
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-5">
              <strong className="text-white">50 tools</strong> across 8 categories —
              PDF, image, developer, SEO, AI, finance, security and text.
              No login. No limits. All free.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-4xl mx-auto mt-6 text-left">
              {CATEGORY_HIGHLIGHTS.map(c => (
                <div key={c.cat} className="bg-[#13131F] border border-white/5 rounded-xl px-3 py-2.5 min-w-0">
                  <div className="text-xs font-bold text-white mb-0.5 truncate">{c.emoji} {c.cat}</div>
                  <div className="text-xs text-gray-600 leading-relaxed">{c.tools}</div>
                </div>
              ))}
            </div>
          </div>
);

export default function AllToolsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(COLLECTION_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA)    }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      {CATEGORY_SCHEMAS.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      {/* Suspense required — AllToolsClient uses useSearchParams() */}
      <Suspense fallback={
        <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden">
          <nav className="border-b border-white/5 px-4 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <span className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></span>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto px-4 py-10 flex-grow w-full">
            {HERO}
            <div className="text-center py-16 text-gray-600">Loading tools…</div>
          </main>
        </div>
      }>
        <AllToolsClient>
          {HERO}
        </AllToolsClient>
      </Suspense>
    </>
  );
}
