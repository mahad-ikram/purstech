import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// ─── All live tools (keep in sync with homepage) ──────────────────────────────

const ALL_TOOLS = [
  { icon:"📝", name:"Word Counter",         slug:"word-counter",         category:"text",     uses:"1.8M", badge:"⭐ Top",  desc:"Count words, characters, sentences and paragraphs instantly."              },
  { icon:"🔤", name:"Case Converter",        slug:"case-converter",       category:"text",     uses:"310K", badge:"",        desc:"Convert text to UPPER, lower, Title, camelCase, snake_case and more."      },
  { icon:"📄", name:"Lorem Ipsum Generator", slug:"lorem-ipsum",          category:"text",     uses:"250K", badge:"",        desc:"Generate placeholder lorem ipsum text by paragraphs, sentences or words."  },
  { icon:"🔍", name:"Diff Checker",          slug:"diff-checker",         category:"text",     uses:"290K", badge:"",        desc:"Compare two texts and instantly highlight every difference."                },
  { icon:"🔊", name:"Text to Speech",        slug:"text-to-speech",       category:"text",     uses:"380K", badge:"",        desc:"Convert any text to natural-sounding speech instantly."                     },
  { icon:"💻", name:"JSON Formatter",        slug:"json-formatter",       category:"dev",      uses:"1.5M", badge:"⭐ Top",  desc:"Format, validate and minify JSON data instantly."                           },
  { icon:"🔐", name:"Base64 Encoder",        slug:"base64-encoder",       category:"dev",      uses:"680K", badge:"",        desc:"Encode and decode Base64 strings instantly."                                },
  { icon:"🔗", name:"URL Encoder",           slug:"url-encoder",          category:"dev",      uses:"590K", badge:"",        desc:"Encode and decode URLs and query parameters instantly."                     },
  { icon:"🎲", name:"UUID Generator",        slug:"uuid-generator",       category:"dev",      uses:"510K", badge:"",        desc:"Generate cryptographically secure UUID v4 identifiers."                    },
  { icon:"🔲", name:"QR Code Generator",     slug:"qr-code-generator",    category:"dev",      uses:"650K", badge:"🆕 New",  desc:"Generate QR codes for URLs, WiFi, contacts and more."                      },
  { icon:"🔑", name:"Hash Generator",        slug:"hash-generator",       category:"dev",      uses:"310K", badge:"",        desc:"Generate MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hashes."                 },
  { icon:"🎨", name:"CSS Minifier",          slug:"css-minifier",         category:"dev",      uses:"260K", badge:"",        desc:"Minify CSS to reduce file size and improve page load speed."               },
  { icon:"🗜️", name:"HTML Minifier",         slug:"html-minifier",        category:"dev",      uses:"280K", badge:"",        desc:"Minify HTML to reduce page size and improve load speed."                   },
  { icon:"🎨", name:"Color Picker",          slug:"color-picker",         category:"image",    uses:"490K", badge:"",        desc:"Pick any colour and get HEX, RGB, HSL, HSV, CMYK codes instantly."         },
  { icon:"🔐", name:"Password Generator",    slug:"password-generator",   category:"security", uses:"980K", badge:"🆕 New",  desc:"Generate strong, cryptographically secure passwords instantly."             },
  { icon:"🎂", name:"Age Calculator",        slug:"age-calculator",       category:"finance",  uses:"410K", badge:"",        desc:"Calculate your exact age in years, months and days."                       },
  { icon:"⚖️", name:"BMI Calculator",         slug:"bmi-calculator",       category:"finance",  uses:"360K", badge:"",        desc:"Calculate your Body Mass Index and healthy weight range."                  },
  { icon:"🔢", name:"Percentage Calculator",  slug:"percentage-calculator",category:"finance",  uses:"480K", badge:"",        desc:"Calculate percentages, increases, decreases and differences — 6 modes."   },
  { icon:"📏", name:"Unit Converter",         slug:"unit-converter",       category:"finance",  uses:"320K", badge:"",        desc:"Convert between length, weight, temperature, volume, speed and more."      },
  { icon:"💱", name:"Currency Converter",     slug:"currency-converter",   category:"finance",  uses:"390K", badge:"",        desc:"Convert between 30+ world currencies with reference exchange rates."       },
];

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
    longDesc:"Professional image processing in your browser. Compress photos without quality loss, pick colours, generate QR codes and more — no software to install, completely free.",
  },
  dev: {
    name:"Developer Tools", icon:"💻", color:"from-blue-600 to-blue-400",
    description:"JSON formatter, Base64, UUID, regex and developer utilities.",
    longDesc:"The toolkit every developer needs. Format and validate JSON, encode Base64, generate UUIDs, hash strings, encode URLs, minify CSS and HTML — all in one place.",
  },
  seo: {
    name:"SEO Tools", icon:"📊", color:"from-green-600 to-green-400",
    description:"Meta tags, sitemaps, keyword tools and SEO analyzers.",
    longDesc:"Optimise your website for search engines. Generate meta tags, create sitemaps, check keyword density, analyse open graph tags and more — everything an SEO needs.",
  },
  ai: {
    name:"AI Tools", icon:"🤖", color:"from-pink-600 to-pink-400",
    description:"AI-powered writing, summarizing, image and text tools.",
    longDesc:"Harness the power of AI. Generate content, summarise documents, translate languages, generate code and more — AI tools that actually save you time.",
  },
  finance: {
    name:"Finance Tools", icon:"💰", color:"from-yellow-600 to-yellow-400",
    description:"Loan, currency, tax, compound interest calculators.",
    longDesc:"Make smarter financial decisions. Calculate your age, BMI, loan repayments, percentage changes, currency conversions and unit measurements — all for free.",
  },
  security: {
    name:"Security Tools", icon:"🔒", color:"from-red-600 to-red-400",
    description:"Password generators, hash tools, encryption utilities.",
    longDesc:"Stay secure online. Generate strong passwords, hash sensitive data, check SSL certificates and more — professional security tools that protect you.",
  },
  pdf: {
    name:"PDF Tools", icon:"📄", color:"from-orange-600 to-orange-400",
    description:"Compress, convert, merge and split PDF files.",
    longDesc:"Everything you need to work with PDFs. Compress file sizes, convert to Word, merge multiple documents, split pages and more — all free, no upload limits.",
  },
};

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const meta = CATEGORY_META[slug];
  if (!meta) return { title:"Category Not Found | PursTech" };
  return {
    title: `${meta.name} — Free Online ${meta.name} | PursTech`,
    description: `${meta.description} Free, no login required. ${meta.longDesc.slice(0,100)}`,
  };
}

// ─── Static params (tells Next.js which slugs exist) ─────────────────────────

export function generateStaticParams() {
  return Object.keys(CATEGORY_META).map(slug => ({ slug }));
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CategoryPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const meta = CATEGORY_META[slug];
  if (!meta) notFound();

  const tools = ALL_TOOLS.filter(t => t.category === slug);
  const comingSoon = tools.length === 0;

  const otherCategories = Object.entries(CATEGORY_META)
    .filter(([s]) => s !== slug)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">

      {/* Navbar */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
            <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">← Home</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="text-xs text-gray-600 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link>
          <span>›</span>
          <span className="text-gray-400">{meta.name}</span>
        </nav>

        {/* Header */}
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
                <span className="text-green-400 font-bold">{tools.length} tools</span> available now
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
              Our AI agents are building these tools right now. Check back soon — we add new tools every week.
            </p>
            <Link href="/tools"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-bold transition-all">
              Browse Available Tools →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
            {tools.map(tool => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`}
                className="group bg-[#13131F] border border-white/5 rounded-2xl p-5 hover:border-[#6C3AFF]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/20">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{tool.icon}</span>
                  {tool.badge && (
                    <span className="text-[10px] bg-[#6C3AFF]/20 text-[#6C3AFF] px-2 py-0.5 rounded-full font-bold border border-[#6C3AFF]/20">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-white text-sm mb-2 group-hover:text-[#6C3AFF] transition-colors leading-snug">
                  {tool.name}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{tool.desc}</p>
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-green-400 font-semibold">{tool.uses} uses</span>
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

      <footer className="border-t border-white/5 mt-20 py-8 text-center">
        <Link href="/" className="text-xl font-black">
          Purs<span className="text-[#6C3AFF]">Tech</span>
        </Link>
        <p className="text-gray-700 text-xs mt-2">© 2025 PursTech. Free online tools for everyone.</p>
      </footer>
    </div>
  );
}
