"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ Rule 3

// ─── All 50 live tools ────────────────────────────────────────────────────────
// batch field drives "Newest" sort: higher = more recent
const ALL_TOOLS = [
  // Text Tools (5)
  { name:"Word Counter",              slug:"word-counter",               category:"text",     icon:"📝", desc:"Count words, characters, sentences and paragraphs instantly. Shows reading time, speaking time and keyword frequency.",    badge:"⭐ Top",  batch:1 },
  { name:"Case Converter",            slug:"case-converter",             category:"text",     icon:"🔤", desc:"Convert text to UPPER, lower, Title, Sentence or camelCase in one click.",                                               badge:"",        batch:1 },
  { name:"Lorem Ipsum Generator",     slug:"lorem-ipsum",                category:"text",     icon:"📄", desc:"Generate placeholder lorem ipsum text — words, sentences or paragraphs — for mockups and designs.",                       badge:"",        batch:1 },
  { name:"Diff Checker",              slug:"diff-checker",               category:"text",     icon:"🔍", desc:"Compare two texts side by side and highlight every addition, deletion and change.",                                       badge:"",        batch:1 },
  { name:"Text to Speech",            slug:"text-to-speech",             category:"text",     icon:"🔊", desc:"Convert any text to natural-sounding audio in multiple voices and languages.",                                            badge:"",        batch:1 },
  // Developer Tools (14)
  { name:"JSON Formatter",            slug:"json-formatter",             category:"dev",      icon:"💻", desc:"Format, validate, minify and explore JSON data with syntax highlighting and error detection.",                             badge:"⭐ Top",  batch:1 },
  { name:"Base64 Encoder",            slug:"base64-encoder",             category:"dev",      icon:"🔐", desc:"Encode and decode Base64 strings and files instantly in the browser.",                                                    badge:"",        batch:1 },
  { name:"URL Encoder",               slug:"url-encoder",                category:"dev",      icon:"🔗", desc:"Encode and decode URLs and query strings for use in web applications.",                                                   badge:"",        batch:1 },
  { name:"UUID Generator",            slug:"uuid-generator",             category:"dev",      icon:"🎲", desc:"Generate cryptographically random UUIDs (v4) — single or in bulk.",                                                      badge:"",        batch:1 },
  { name:"QR Code Generator",         slug:"qr-code-generator",          category:"dev",      icon:"🔲", desc:"Generate QR codes for URLs, WiFi, email, phone, vCard and plain text. PNG + SVG download.",                              badge:"",        batch:1 },
  { name:"Hash Generator",            slug:"hash-generator",             category:"dev",      icon:"🔑", desc:"Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from any text input.",                                                   badge:"",        batch:1 },
  { name:"CSS Minifier",              slug:"css-minifier",               category:"dev",      icon:"🎨", desc:"Minify CSS files to reduce load time — removes whitespace, comments and redundant rules.",                               badge:"",        batch:1 },
  { name:"HTML Minifier",             slug:"html-minifier",              category:"dev",      icon:"🗜", desc:"Minify HTML to reduce file size and improve page load speed.",                                                            badge:"",        batch:1 },
  { name:"Regex Tester",              slug:"regex-tester",               category:"dev",      icon:"🧪", desc:"Test and debug regular expressions with real-time match highlighting, named groups and 20 pattern examples.",             badge:"🔥 Hot",  batch:7 },
  { name:"JS Minifier",               slug:"js-minifier",                category:"dev",      icon:"⚡", desc:"Minify JavaScript with multi-pass compression, a beautifier and gzip size estimation.",                                  badge:"",        batch:7 },
  { name:"HTML to Markdown",          slug:"html-to-markdown",           category:"dev",      icon:"📝", desc:"Convert HTML code to clean Markdown format with GFM table support.",                                                     badge:"",        batch:7 },
  { name:"Markdown Editor",           slug:"markdown-editor",            category:"dev",      icon:"✍️", desc:"Write Markdown with a live split-pane preview, 15-button toolbar, fullscreen and HTML export.",                          badge:"",        batch:7 },
  { name:"Color Code Converter",      slug:"color-code-converter",       category:"dev",      icon:"🖌", desc:"Convert between HEX, RGB, RGBA, HSL, HSLA, HSV and CMYK with WCAG contrast checker.",                                   badge:"",        batch:7 },
  { name:"SVG Editor",                slug:"svg-editor",                 category:"dev",      icon:"✦",  desc:"Edit SVG code with live preview, shape toolbar, React JSX export, optimizer, animation snippets and PNG export.",        badge:"🆕 New",  batch:9 },
  // Image Tools (6)
  { name:"Color Picker",              slug:"color-picker",               category:"image",    icon:"🎨", desc:"Pick colors from images and get HEX, RGB, HSL, CMYK and CSS variable codes instantly.",                                  badge:"",        batch:1 },
  { name:"Image Compressor",          slug:"image-compressor",           category:"image",    icon:"🗜", desc:"Compress JPEG, PNG and WebP images by up to 90%. Batch process, before/after preview, browser-based.",                   badge:"🔥 Hot",  batch:5 },
  { name:"Image Resizer",             slug:"image-resizer",              category:"image",    icon:"📐", desc:"Resize images to any dimension with 20+ social media presets. Aspect ratio lock. JPEG, PNG or WebP output.",              badge:"",        batch:5 },
  { name:"Background Remover",        slug:"background-remover",         category:"image",    icon:"✂️", desc:"Remove image backgrounds automatically in the browser. No upload to server — 100% private.",                             badge:"🤖 AI",   batch:5 },
  { name:"Favicon Generator",         slug:"favicon-generator",          category:"image",    icon:"🏷", desc:"Create favicons from image, text, emoji or pixel art. All 18 sizes, device previews, PWA manifest.",                    badge:"",        batch:5 },
  { name:"Image to Text (OCR)",       slug:"image-to-text",              category:"image",    icon:"📷", desc:"Extract text from any image using Tesseract OCR. 30+ languages, word confidence heatmap, camera capture.",               badge:"🔥 Hot",  batch:5 },
  // SEO Tools (5)
  { name:"Meta Tag Generator",        slug:"meta-tag-generator",         category:"seo",      icon:"🏷", desc:"Generate SEO meta tags with live SERP preview, SEO grade A–F, Open Graph and Twitter Card support.",                    badge:"🔥 Hot",  batch:4 },
  { name:"Robots.txt Generator",      slug:"robots-txt-generator",       category:"seo",      icon:"🤖", desc:"Generate a robots.txt file with directives for all major crawlers and Google's AI bots.",                               badge:"",        batch:4 },
  { name:"Keyword Density Checker",   slug:"keyword-density-checker",    category:"seo",      icon:"🔢", desc:"Analyse keyword density and frequency in any text or webpage for SEO optimisation.",                                     badge:"",        batch:4 },
  { name:"Open Graph Generator",      slug:"open-graph-generator",       category:"seo",      icon:"📊", desc:"Generate Open Graph and Twitter Card tags with live previews for Facebook, LinkedIn, Discord and Slack.",               badge:"",        batch:4 },
  { name:"Sitemap Generator",         slug:"sitemap-generator",          category:"seo",      icon:"🗺", desc:"Generate a valid XML sitemap with smart auto-priority, bulk import and one-click Google Ping.",                          badge:"",        batch:4 },
  // Finance Tools (10)
  { name:"Age Calculator",            slug:"age-calculator",             category:"finance",  icon:"🎂", desc:"Calculate exact age in years, months and days from any date.",                                                           badge:"",        batch:1 },
  { name:"BMI Calculator",            slug:"bmi-calculator",             category:"finance",  icon:"⚖️", desc:"Calculate Body Mass Index and healthy weight range with metric and imperial support.",                                   badge:"",        batch:1 },
  { name:"Percentage Calculator",     slug:"percentage-calculator",      category:"finance",  icon:"🔢", desc:"Calculate percentages, increases, decreases and differences between values.",                                            badge:"",        batch:1 },
  { name:"Unit Converter",            slug:"unit-converter",             category:"finance",  icon:"📏", desc:"Convert between length, weight, temperature, volume, speed and area units.",                                             badge:"",        batch:1 },
  { name:"Currency Converter",        slug:"currency-converter",         category:"finance",  icon:"💱", desc:"Convert currencies with live exchange rates across 170+ currencies.",                                                    badge:"",        batch:1 },
  { name:"Loan Calculator",           slug:"loan-calculator",            category:"finance",  icon:"🏦", desc:"Calculate monthly payments, total interest and amortization schedule with extra payment simulator.",                     badge:"🔥 Hot",  batch:6 },
  { name:"Compound Interest Calc",    slug:"compound-interest-calculator",category:"finance", icon:"📈", desc:"Calculate compound interest, investment growth and CAGR with 6 compounding frequencies and inflation adjustment.",       badge:"",        batch:6 },
  { name:"Tip Calculator",            slug:"tip-calculator",             category:"finance",  icon:"🍽", desc:"Calculate tips and split bills with 8 service presets, itemized splitting and round-up mode.",                          badge:"",        batch:6 },
  { name:"Time Zone Converter",       slug:"time-zone-converter",        category:"finance",  icon:"🕐", desc:"Convert times between 65+ cities worldwide with live clocks, DST awareness and meeting overlap finder.",                badge:"",        batch:6 },
  { name:"Mortgage Calculator",       slug:"mortgage-calculator",        category:"finance",  icon:"🏠", desc:"Calculate full PITI with PMI, 28/36 affordability rule checker, amortization and rent vs buy comparison.",               badge:"⭐ Top",  batch:6 },
  // Security Tools (3)
  { name:"Password Generator",        slug:"password-generator",         category:"security", icon:"🔐", desc:"Generate cryptographically secure passwords with strength analysis, rules and bulk generation.",                         badge:"",        batch:1 },
  { name:"SSL Certificate Checker",   slug:"ssl-checker",                category:"security", icon:"🔒", desc:"Check any website's SSL certificate — security grade A–F, expiry countdown, TLS version, SANs and cipher suite.",     badge:"🆕 New",  batch:9 },
  { name:"IP Address Lookup",         slug:"ip-lookup",                  category:"security", icon:"🌐", desc:"Look up any IP — country, ISP, ASN, risk score, reverse DNS, live timezone clock and comparison mode.",                badge:"🆕 New",  batch:9 },
  // PDF Tools (5)
  { name:"PDF Compressor",            slug:"pdf-compressor",             category:"pdf",      icon:"🗜", desc:"Compress PDFs by up to 80% with 3 compression levels, metadata strip and batch ZIP download.",                          badge:"🆕 New",  batch:8 },
  { name:"PDF Merger",                slug:"pdf-merger",                 category:"pdf",      icon:"📑", desc:"Merge PDFs with drag-to-reorder, per-file page ranges and custom metadata on merged output.",                           badge:"🆕 New",  batch:8 },
  { name:"PDF Splitter",              slug:"pdf-splitter",               category:"pdf",      icon:"✂️", desc:"Split PDFs by page, range or extract/remove specific pages. Visual page grid, ZIP download.",                          badge:"🆕 New",  batch:8 },
  { name:"PDF to Word",               slug:"pdf-to-word",                category:"pdf",      icon:"📝", desc:"Extract text from PDFs with page-by-page preview, text cleanup and download as .doc, .txt or .html.",                  badge:"🆕 New",  batch:8 },
  { name:"Word to PDF",               slug:"word-to-pdf",                category:"pdf",      icon:"📄", desc:"Convert text or .txt files to PDF with A4/Letter/Legal page sizes, margins and auto page numbers.",                     badge:"🆕 New",  batch:8 },
  // AI Tools (2)
  { name:"Grammar Checker",           slug:"grammar-checker",            category:"ai",       icon:"✓",  desc:"Check grammar, spelling and style with LanguageTool's 6,000+ rules, error breakdown chart and passive voice detector.", badge:"🆕 New",  batch:9 },
  { name:"Readability Checker",       slug:"readability-checker",        category:"ai",       icon:"📊", desc:"Analyse readability with 7 formulas, target audience mode, sentence difficulty map and famous text benchmarks.",        badge:"🆕 New",  batch:9 },
];

// ✅ Categories now include desc for SEO and rich content per section
const CATEGORIES = [
  { id:"all",      label:"All Tools",   icon:"⚡", desc:"" },
  { id:"pdf",      label:"PDF",         icon:"📄", desc:"Compress, merge, split and convert PDF documents directly in your browser — no upload required."           },
  { id:"image",    label:"Image",       icon:"🖼️", desc:"Compress, resize, remove backgrounds and extract text from images — all without leaving your device."        },
  { id:"dev",      label:"Developer",   icon:"💻", desc:"JSON, regex, hashing, encoding, minification and code editors for every web developer's daily workflow."     },
  { id:"seo",      label:"SEO",         icon:"📊", desc:"Meta tags, sitemaps, Open Graph, robots.txt and keyword analysis tools for technical SEO and on-page work." },
  { id:"ai",       label:"AI",          icon:"🤖", desc:"AI-powered grammar checking and readability analysis backed by LanguageTool and proven readability formulas." },
  { id:"finance",  label:"Finance",     icon:"💰", desc:"Loan, mortgage, compound interest, currency, tip, BMI, unit, age and time-zone calculators."                 },
  { id:"security", label:"Security",    icon:"🔒", desc:"Password generation, SSL certificate checking and IP address lookup for security-conscious professionals."   },
  { id:"text",     label:"Text",        icon:"📝", desc:"Word counting, case conversion, diff checking, Lorem Ipsum generation and text-to-speech for writers."       },
].map(c => ({
  ...c,
  count: c.id === "all" ? ALL_TOOLS.length : ALL_TOOLS.filter(t => t.category === c.id).length,
}));

const SORT_OPTIONS = [
  { value:"newest",  label:"🆕 Newest First" },
  { value:"popular", label:"🔥 Most Popular"  },
  { value:"name",    label:"A → Z"            },
];

const BADGE_STYLES: Record<string, string> = {
  "⭐ Top":  "bg-violet-500/20 text-violet-300 border-violet-500/20",
  "🔥 Hot":  "bg-orange-500/20 text-orange-300 border-orange-500/20",
  "🆕 New":  "bg-cyan-500/20   text-cyan-300   border-cyan-500/20",
  "🤖 AI":   "bg-pink-500/20   text-pink-300   border-pink-500/20",
};

// ✅ Site-level FAQ (Rule 8 — <details>/<summary>)
const FAQ = [
  { q:"Are all PursTech tools really free?",
    a:"Yes. Every tool is completely free with no daily usage limits, no watermarks and no premium tiers blocking core features. PursTech Pro adds optional extras like batch processing and API access, but the standard tools remain free forever." },
  { q:"Do I need to create an account?",
    a:"No account is required to use any tool. There is no sign-up wall, no email collection and no usage tracking tied to identity. Open any tool and start using it immediately." },
  { q:"Are my files uploaded to your servers?",
    a:"All image, PDF, OCR and file-processing tools run entirely in your browser using WebAssembly and native JavaScript APIs. Your files are never uploaded to any server. The only tools that make network requests are those that need them by design — SSL Checker, IP Lookup and Currency Converter." },
  { q:"Can I use these tools commercially?",
    a:"Yes. You may use the output of any PursTech tool in commercial, client and internal projects. The tools themselves are owned by PursTech, but the content you produce with them is yours." },
  { q:"How are the tools funded if they are free?",
    a:"PursTech is funded through non-intrusive advertising and an optional Pro subscription for power users who want batch processing, API access and zero ads. The free tools remain fully functional and free forever." },
];

// ✅ Why PursTech feature grid (rich content for AdSense)
const WHY_PURSTECH = [
  { icon:"🆓", title:"100% Free Forever",     desc:"Every tool free, with no daily limits, no watermarks and no paywalled features. Pro is optional for power users." },
  { icon:"🔒", title:"Your Files Stay Private", desc:"PDF, image and OCR tools process entirely in your browser. Your files never leave your device — nothing uploaded." },
  { icon:"🚪", title:"No Login Required",     desc:"No accounts, no email collection, no sign-up walls. Open any tool and start using it within one second." },
  { icon:"⚡", title:"Fast & Browser-based",  desc:"Built on WebAssembly and modern web APIs. Tools work offline once loaded and use zero bandwidth after the first visit." },
];

// ─── Tool Card ────────────────────────────────────────────────────────────────
function ToolCard({ tool }: { tool: typeof ALL_TOOLS[0] }) {
  return (
    <Link href={`/tools/${tool.slug}`}
      className="group bg-[#13131F] border border-white/5 rounded-2xl p-5 flex flex-col gap-3 min-w-0 w-full
        hover:border-[#6C3AFF]/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/20
        transition-all duration-300 relative overflow-hidden">
      <div className="flex items-start justify-between gap-2 min-w-0 w-full">
        <span className="text-3xl flex-shrink-0">{tool.icon}</span>
        {tool.badge && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${BADGE_STYLES[tool.badge] ?? "bg-gray-500/20 text-gray-400"}`}>
            {tool.badge}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0 w-full">
        <h3 className="font-bold text-white text-sm group-hover:text-[#00D4FF] transition-colors leading-snug mb-1 truncate pr-1">{tool.name}</h3>
        <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 w-full">{tool.desc}</p>
      </div>
      <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-white/5 min-w-0 w-full">
        <span className="text-xs text-gray-700 capitalize truncate">{tool.category}</span>
        <span className="text-gray-700 group-hover:text-[#6C3AFF] transition-colors text-sm flex-shrink-0">→</span>
      </div>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AllToolsClient({ children }: { children?: React.ReactNode }) {
  useTrackTool("all-tools", "listing"); // ✅ Rule 3

  const searchParams = useSearchParams();

  const [category, setCategory] = useState(() => searchParams.get("cat") ?? "all");
  const [search,   setSearch]   = useState(() => searchParams.get("search") ?? "");
  const [sort,     setSort]     = useState("newest");

  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) setCategory(cat);
  }, [searchParams]);

  // ✅ Section refs for smooth-scroll-to-category UX
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Filter + sort logic
  const filtered = useMemo(() => {
    let tools = [...ALL_TOOLS];
    if (category !== "all") tools = tools.filter(t => t.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      tools = tools.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "newest": tools.sort((a, b) => b.batch - a.batch || a.name.localeCompare(b.name)); break;
      case "name":   tools.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return tools;
  }, [search, category, sort]);

  // Group filtered+sorted tools by category for sectioned rendering
  const groupedByCategory = useMemo(() => {
    const grouped: Record<string, typeof ALL_TOOLS> = {};
    CATEGORIES.filter(c => c.id !== "all").forEach(c => { grouped[c.id] = []; });
    filtered.forEach(t => { if (grouped[t.category]) grouped[t.category].push(t); });
    return grouped;
  }, [filtered]);

  // Decide which sections to render
  const sectionsToShow = useMemo(() => {
    const candidate = category === "all"
      ? CATEGORIES.filter(c => c.id !== "all")
      : CATEGORIES.filter(c => c.id === category);
    return candidate.filter(c => (groupedByCategory[c.id]?.length ?? 0) > 0);
  }, [category, groupedByCategory]);

  // ✅ Click handler: filter + smooth scroll to that section
  const handleCategoryClick = (catId: string) => {
    setCategory(catId);
    if (catId === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Small delay so the section ref exists if it was hidden by previous filter
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        sectionRefs.current[catId]?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  };

  const totalLive = ALL_TOOLS.length;

  return (
    // ✅ Rule 6: flex flex-col overflow-x-hidden
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden">

      {/* ── Navbar — ✅ Rule 4: sticky + backdrop-blur + Go Pro Link ── */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">← Home</Link>
            <Link href="/pro" className="px-4 py-2 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all">Go Pro ⚡</Link>
          </div>
        </div>
      </nav>

      {/* ✅ Rule 7: flex-grow w-full */}
      <main className="max-w-7xl mx-auto px-4 py-10 flex-grow w-full">

        {/* ✅ Rule 11: aria-label + aria-hidden separator */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span aria-hidden="true">›</span>
          <span className="text-gray-400">All Tools</span>
        </nav>

        {/* ✅ Rule 12: Hero from page.tsx */}
        {children}

        {/* Live status indicator */}
        <div className="flex items-center justify-center gap-2 mb-8 -mt-4 min-w-0 w-full">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
          <span className="text-sm text-gray-500 truncate">
            <span className="text-green-400 font-bold">{totalLive} tools</span> live · free forever · no login
          </span>
        </div>

        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-7 min-w-0 w-full">
          <div className="relative min-w-0 w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${totalLive} tools — grammar checker, pdf compressor, regex tester…`}
              className="w-full pl-12 pr-10 py-4 rounded-2xl bg-[#13131F] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm truncate" />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">✕</button>
            )}
          </div>
        </div>

        {/* ✅ Category chips — sticky just under navbar, scroll target navigation */}
        <div className="sticky top-[73px] z-30 -mx-4 px-4 py-2 bg-[#0A0A14]/95 backdrop-blur-md mb-5 min-w-0 w-full">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide min-w-0 w-full">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  category === cat.id
                    ? "bg-[#6C3AFF] text-white shadow-lg shadow-violet-900/30"
                    : "bg-[#13131F] text-gray-400 hover:text-white border border-white/5 hover:border-[#6C3AFF]/30"
                }`}>
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  category === cat.id ? "bg-white/20 text-white" : "bg-white/5 text-gray-600"
                }`}>{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort + result count */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 min-w-0 w-full">
          <span className="text-sm text-gray-500 min-w-0">
            Showing <span className="text-white font-bold">{filtered.length}</span> tool{filtered.length !== 1 ? "s" : ""}
            {search && <span className="text-[#6C3AFF]"> for &quot;{search}&quot;</span>}
            {category !== "all" && !search && (
              <span className="text-gray-600 ml-1">in {CATEGORIES.find(c => c.id === category)?.label}</span>
            )}
          </span>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="bg-[#13131F] border border-white/5 text-gray-400 text-sm px-4 py-2 rounded-xl focus:outline-none focus:border-[#6C3AFF]/50 transition-all cursor-pointer flex-shrink-0">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* ✅ Sectioned tools by category — each is a scroll target */}
        {sectionsToShow.length > 0 ? (
          <div className="space-y-12 min-w-0 w-full">
            {sectionsToShow.map(cat => {
              const tools = groupedByCategory[cat.id] || [];
              return (
                <section key={cat.id}
                  id={`category-${cat.id}`}
                  ref={el => { sectionRefs.current[cat.id] = el; }}
                  className="scroll-mt-32 min-w-0 w-full">
                  <div className="flex items-end justify-between mb-2 gap-2 min-w-0 w-full">
                    <h2 className="text-2xl font-extrabold text-white flex items-center gap-2 min-w-0">
                      <span className="flex-shrink-0">{cat.icon}</span>
                      <span className="truncate">{cat.label} Tools</span>
                    </h2>
                    <span className="text-sm text-gray-500 flex-shrink-0">{tools.length} tool{tools.length !== 1 ? "s" : ""}</span>
                  </div>
                  {cat.desc && <p className="text-sm text-gray-500 mb-5 max-w-3xl leading-relaxed min-w-0 w-full truncate whitespace-normal break-words">{cat.desc}</p>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-w-0 w-full">
                    {tools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          // Empty state
          <div className="text-center py-24 min-w-0 w-full">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No tools found</h3>
            <p className="text-gray-500 mb-6 truncate whitespace-normal break-words min-w-0 w-full">
              No results for &ldquo;{search}&rdquo; — try a different search term.
            </p>
            <button onClick={() => { setSearch(""); setCategory("all"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="px-6 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-bold transition-all">
              Clear filters
            </button>
          </div>
        )}

        {/* ── Rich content: Why PursTech ──────────────────────────────────── */}
        <section className="mt-20 min-w-0 w-full">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Why PursTech</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-2xl leading-relaxed">Built differently from typical "free tool" sites — no upsell tricks, no daily limits, no email walls.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0 w-full">
            {WHY_PURSTECH.map(f => (
              <div key={f.title} className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
                <div className="text-2xl mb-2 flex-shrink-0">{f.icon}</div>
                <div className="font-bold text-white text-sm mb-2 truncate pr-1">{f.title}</div>
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── About PursTech Tools (rich content, expanded from original) ── */}
        <section className="mt-12 bg-[#13131F] border border-white/5 rounded-3xl p-8 min-w-0 w-full">
          <h2 className="text-xl font-extrabold text-white mb-2">About PursTech Tools</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Every tool on PursTech is <strong className="text-white">completely free</strong> with no account required,
            no daily usage limits and no watermarks. All image, PDF, OCR and file-processing tools run
            entirely in your browser — your files are never uploaded to any server.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 min-w-0 w-full">
            {[
              { title:"PDF Tools",        color:"text-orange-400", items:["PDF Compressor — reduce file size by up to 80%","PDF Merger — drag-to-reorder, page ranges","PDF Splitter — 4 modes including extract and remove","PDF to Word — browser-based text extraction","Word to PDF — paste text or upload .txt/.doc"] },
              { title:"Developer Tools",  color:"text-blue-400",   items:["JSON Formatter — validate, format and minify","Regex Tester — live highlighting, 20 patterns","SVG Editor — React JSX export, optimizer, animations","Markdown Editor — live split-pane preview","Color Code Converter — HEX, RGB, HSL, CMYK"] },
              { title:"Image Tools",      color:"text-cyan-400",   items:["Image Compressor — batch, 90% reduction","Image Resizer — 20+ social media presets","Background Remover — AI-powered, browser-based","Image to Text (OCR) — 30+ languages","Favicon Generator — all 18 sizes, PWA manifest"] },
              { title:"SEO & AI Tools",   color:"text-green-400",  items:["Meta Tag Generator — live SERP preview, SEO grade","Grammar Checker — LanguageTool 6,000+ rules","Readability Checker — 7 formulas, sentence map","Sitemap Generator — XML, bulk import, Google Ping","SSL Checker — grade A+ to F, expiry countdown"] },
            ].map(section => (
              <div key={section.title} className="min-w-0 w-full">
                <div className={`text-xs font-bold uppercase tracking-wider mb-3 truncate ${section.color}`}>{section.title}</div>
                <ul className="space-y-1.5 min-w-0 w-full">
                  {section.items.map(item => (
                    <li key={item} className="text-xs text-gray-500 flex gap-1.5 leading-snug min-w-0 w-full">
                      <span className="text-gray-700 flex-shrink-0 mt-0.5">›</span>
                      <span className="truncate whitespace-normal break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ — ✅ Rule 8: <details>/<summary> ── */}
        <section className="mt-12 max-w-3xl min-w-0 w-full">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3 min-w-0 w-full">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all min-w-0 w-full">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none min-w-0 w-full">
                  <span className="min-w-0 pr-4">{f.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-r from-[#6C3AFF]/10 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-3xl p-10 text-center min-w-0 w-full">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Can&apos;t find the tool you need?</h2>
          <p className="text-gray-500 mb-6 max-w-lg mx-auto leading-relaxed">We&apos;re building new tools continuously. Tell us what you need and we&apos;ll build it.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center min-w-0 w-full">
            <Link href="/contact" className="px-8 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-bold transition-all text-center">Request a Tool →</Link>
            <Link href="/" className="px-8 py-3 rounded-xl bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/30 text-white font-bold transition-all text-center">Back to Home</Link>
          </div>
        </div>
      </main>

      {/* ✅ Rule 5: Privacy/Terms/Contact + © 2026 (replaces /about + /blog) */}
      <footer className="border-t border-white/5 mt-16 py-8 min-w-0 w-full">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 min-w-0 w-full">
          <Link href="/" className="text-xl font-black flex-shrink-0">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="text-xs text-gray-600 text-center truncate pr-2">50 free tools · 8 categories · 0 sign-ups required</div>
          <div className="flex gap-4 text-xs text-gray-600 min-w-0">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
          </div>
          <p className="text-gray-700 text-xs flex-shrink-0">© 2026 PursTech. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
