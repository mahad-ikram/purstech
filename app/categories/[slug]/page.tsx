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
  // ── SEO (5) ───────────────────────────────────────────────────────────────
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
