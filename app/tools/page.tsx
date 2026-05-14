import type { Metadata } from "next";
import AllToolsClient from "./client";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title:       "All 50 Free Online Tools — PDF, Image, Dev, SEO, AI & More | PursTech",
  description: "Browse all 50 free online tools on PursTech — no login, no limits. PDF compressor, image compressor, grammar checker, JSON formatter, meta tag generator, SSL checker, regex tester, readability checker and more across 8 categories.",
  keywords: [
    "free online tools", "all free tools", "pdf tools free", "image tools online",
    "developer tools free", "seo tools free", "grammar checker free online",
    "readability checker free", "json formatter", "image compressor free",
    "pdf compressor online", "ssl checker free", "ip address lookup free",
  ],
  alternates: { canonical: "/tools" },
  openGraph: {
    title:       "All 50 Free Online Tools | PursTech",
    description: "50 free browser-based tools — PDF, image, SEO, developer, AI, finance and security. No login, no limits, no ads.",
    url:         "https://www.purstech.com/tools",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "All 50 Free Online Tools | PursTech",
    description: "PDF, image, SEO, dev, AI tools — all free, no login.",
    images:      ["/og-image.png"],
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1",
};

// ─── JSON-LD schemas ──────────────────────────────────────────────────────────

const COLLECTION_SCHEMA = {
  "@context":     "https://schema.org",
  "@type":        "CollectionPage",
  "@id":          "https://www.purstech.com/tools/#collectionpage",
  name:           "All Free Online Tools — PursTech",
  description:    "50 free online tools across 8 categories — PDF, image, developer, SEO, AI, finance, security and text. No login required.",
  url:            "https://www.purstech.com/tools",
  numberOfItems:  50,
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",       item: "https://www.purstech.com" },
      { "@type": "ListItem", position: 2, name: "All Tools",  item: "https://www.purstech.com/tools" },
    ],
  },
};

// Structured category listing — LLM and Google use this
// to answer "what tools does PursTech offer in X category?"
const CATEGORY_SCHEMAS = [
  {
    "@context": "https://schema.org",
    "@type":    "ItemList",
    name:       "Free PDF Tools — PursTech",
    url:        "https://www.purstech.com/tools?cat=pdf",
    numberOfItems: 5,
    itemListElement: [
      { "@type":"ListItem", position:1, name:"PDF Compressor",   url:"https://www.purstech.com/tools/pdf-compressor"  },
      { "@type":"ListItem", position:2, name:"PDF Merger",       url:"https://www.purstech.com/tools/pdf-merger"      },
      { "@type":"ListItem", position:3, name:"PDF Splitter",     url:"https://www.purstech.com/tools/pdf-splitter"    },
      { "@type":"ListItem", position:4, name:"PDF to Word",      url:"https://www.purstech.com/tools/pdf-to-word"     },
      { "@type":"ListItem", position:5, name:"Word to PDF",      url:"https://www.purstech.com/tools/word-to-pdf"     },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type":    "ItemList",
    name:       "Free SEO Tools — PursTech",
    url:        "https://www.purstech.com/tools?cat=seo",
    numberOfItems: 5,
    itemListElement: [
      { "@type":"ListItem", position:1, name:"Meta Tag Generator",      url:"https://www.purstech.com/tools/meta-tag-generator"      },
      { "@type":"ListItem", position:2, name:"Sitemap Generator",       url:"https://www.purstech.com/tools/sitemap-generator"       },
      { "@type":"ListItem", position:3, name:"Open Graph Generator",    url:"https://www.purstech.com/tools/open-graph-generator"    },
      { "@type":"ListItem", position:4, name:"Robots.txt Generator",    url:"https://www.purstech.com/tools/robots-txt-generator"    },
      { "@type":"ListItem", position:5, name:"Keyword Density Checker", url:"https://www.purstech.com/tools/keyword-density-checker" },
    ],
  },
];

// Server-rendered content for children
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

export default function AllToolsPage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(COLLECTION_SCHEMA) }} />
      {CATEGORY_SCHEMAS.map((s, i) => (
        <script key={i} type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      {/* Server-rendered content — passes as children to client component.
          Google reads this HTML before JS executes. */}
      <AllToolsClient>
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

          {/* Category quick-summary — server rendered for LLM + Google */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-4xl mx-auto mt-6 text-left">
            {CATEGORY_HIGHLIGHTS.map(c => (
              <div key={c.cat} className="bg-[#13131F] border border-white/5 rounded-xl px-3 py-2.5">
                <div className="text-xs font-bold text-white mb-0.5">
                  {c.emoji} {c.cat}
                </div>
                <div className="text-xs text-gray-600 leading-relaxed">{c.tools}</div>
              </div>
            ))}
          </div>
        </div>
      </AllToolsClient>
    </>
  );
}
