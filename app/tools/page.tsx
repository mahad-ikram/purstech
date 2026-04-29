"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ─── All Tools Data ───────────────────────────────────────────────────────────
// Add every new tool here as you build it.
// This is the single source of truth for the /tools page.

const ALL_TOOLS = [
  // ── TEXT TOOLS ──────────────────────────────────────────────────────────────
  { name: "Word Counter",         slug: "word-counter",         category: "text",     icon: "📝", desc: "Count words, characters, sentences and paragraphs instantly.",        badge: "⭐ Top",  uses: "1.8M", live: true  },
  { name: "Case Converter",       slug: "case-converter",       category: "text",     icon: "🔤", desc: "Convert text to UPPER, lower, Title or Sentence case.",              badge: "",        uses: "310K", live: false },
  { name: "Lorem Ipsum Generator",slug: "lorem-ipsum",          category: "text",     icon: "📄", desc: "Generate placeholder lorem ipsum text for your designs.",            badge: "",        uses: "250K", live: false },
  { name: "Grammar Checker",      slug: "grammar-checker",      category: "text",     icon: "✍️", desc: "Check and fix grammar errors using AI.",                            badge: "🤖 AI",   uses: "540K", live: false },
  { name: "Text Summarizer",      slug: "text-summarizer",      category: "text",     icon: "📋", desc: "Summarize long text into concise points using AI.",                  badge: "🤖 AI",   uses: "420K", live: false },
  { name: "Text to Speech",       slug: "text-to-speech",       category: "text",     icon: "🔊", desc: "Convert any text to natural-sounding speech.",                      badge: "",        uses: "380K", live: false },
  { name: "Diff Checker",         slug: "diff-checker",         category: "text",     icon: "🔍", desc: "Compare two texts and highlight the differences.",                  badge: "",        uses: "290K", live: false },
  { name: "Markdown Editor",      slug: "markdown-editor",      category: "text",     icon: "📑", desc: "Write Markdown with a live preview side by side.",                  badge: "🆕 New",  uses: "210K", live: false },
  { name: "Readability Score",    slug: "readability-score",    category: "text",     icon: "📊", desc: "Check the reading level and readability of your content.",           badge: "",        uses: "180K", live: false },
  { name: "Plagiarism Checker",   slug: "plagiarism-checker",   category: "text",     icon: "🕵️", desc: "Check if your text is unique or matches existing content.",          badge: "🤖 AI",   uses: "160K", live: false },

  // ── IMAGE TOOLS ─────────────────────────────────────────────────────────────
  { name: "Image Compressor",     slug: "image-compressor",     category: "image",    icon: "🖼️", desc: "Compress JPG, PNG and WebP images without losing quality.",           badge: "🔥 Hot",  uses: "2.1M", live: false },
  { name: "Image Resizer",        slug: "image-resizer",        category: "image",    icon: "📐", desc: "Resize images to exact dimensions in seconds.",                      badge: "",        uses: "870K", live: false },
  { name: "Background Remover",   slug: "background-remover",   category: "image",    icon: "✂️", desc: "Remove image backgrounds automatically using AI.",                  badge: "🤖 AI",   uses: "760K", live: false },
  { name: "Color Picker",         slug: "color-picker",         category: "image",    icon: "🎨", desc: "Pick colors and get HEX, RGB, HSL, CMYK codes instantly.",           badge: "",        uses: "650K", live: true  },
  { name: "Favicon Generator",    slug: "favicon-generator",    category: "image",    icon: "🌐", desc: "Generate favicons in all sizes from any image.",                    badge: "",        uses: "290K", live: false },
  { name: "Image to Text",        slug: "image-to-text",        category: "image",    icon: "🔡", desc: "Extract text from any image using OCR technology.",                 badge: "🤖 AI",   uses: "430K", live: false },
  { name: "SVG Editor",           slug: "svg-editor",           category: "image",    icon: "✏️", desc: "Edit and optimize SVG files online.",                               badge: "🆕 New",  uses: "120K", live: false },

  // ── DEV TOOLS ───────────────────────────────────────────────────────────────
  { name: "JSON Formatter",       slug: "json-formatter",       category: "dev",      icon: "💻", desc: "Format, validate and minify JSON data instantly.",                  badge: "⭐ Top",  uses: "1.5M", live: true  },
  { name: "Base64 Encoder",       slug: "base64-encoder",       category: "dev",      icon: "🔐", desc: "Encode and decode Base64 strings instantly.",                       badge: "",        uses: "680K", live: false },
  { name: "URL Encoder",          slug: "url-encoder",          category: "dev",      icon: "🔗", desc: "Encode and decode URLs for use in web applications.",               badge: "",        uses: "590K", live: false },
  { name: "UUID Generator",       slug: "uuid-generator",       category: "dev",      icon: "🎲", desc: "Generate random UUIDs (v4) instantly.",                            badge: "",        uses: "510K", live: false },
  { name: "QR Code Generator",    slug: "qr-code-generator",    category: "dev",      icon: "🔲", desc: "Generate QR codes for URLs, WiFi, contacts and more.",              badge: "🆕 New",  uses: "650K", live: true  },
  { name: "Regex Tester",         slug: "regex-tester",         category: "dev",      icon: "🔎", desc: "Test and debug regular expressions with live match highlighting.",   badge: "",        uses: "340K", live: false },
  { name: "HTML Minifier",        slug: "html-minifier",        category: "dev",      icon: "🗜️", desc: "Minify HTML to reduce file size and improve load speed.",           badge: "",        uses: "280K", live: false },
  { name: "CSS Minifier",         slug: "css-minifier",         category: "dev",      icon: "🎨", desc: "Minify CSS files to reduce load time.",                             badge: "",        uses: "260K", live: false },
  { name: "JS Minifier",          slug: "js-minifier",          category: "dev",      icon: "⚡", desc: "Minify JavaScript to reduce file size.",                            badge: "",        uses: "240K", live: false },
  { name: "HTML to Markdown",     slug: "html-to-markdown",     category: "dev",      icon: "📝", desc: "Convert HTML code to clean Markdown format.",                      badge: "",        uses: "190K", live: false },
  { name: "Hash Generator",       slug: "hash-generator",       category: "dev",      icon: "🔑", desc: "Generate MD5, SHA-1, SHA-256 and SHA-512 hashes.",                 badge: "",        uses: "310K", live: false },
  { name: "Color Code Converter", slug: "color-code-converter", category: "dev",      icon: "🖌️", desc: "Convert between HEX, RGB, HSL and CSS colour formats.",            badge: "",        uses: "220K", live: false },

  // ── SEO TOOLS ───────────────────────────────────────────────────────────────
  { name: "Meta Tag Generator",   slug: "meta-tag-generator",   category: "seo",      icon: "📊", desc: "Generate perfect SEO meta tags for any webpage.",                   badge: "",        uses: "430K", live: false },
  { name: "Robots.txt Generator", slug: "robots-txt-generator", category: "seo",      icon: "🤖", desc: "Generate a robots.txt file for your website.",                      badge: "",        uses: "210K", live: false },
  { name: "Sitemap Generator",    slug: "sitemap-generator",    category: "seo",      icon: "🗺️", desc: "Generate an XML sitemap for your website.",                         badge: "",        uses: "190K", live: false },
  { name: "Keyword Density",      slug: "keyword-density",      category: "seo",      icon: "🔢", desc: "Analyse keyword density in any text or webpage.",                   badge: "",        uses: "280K", live: false },
  { name: "Open Graph Checker",   slug: "og-checker",           category: "seo",      icon: "📱", desc: "Check and preview how your page looks when shared on social media.", badge: "",        uses: "160K", live: false },
  { name: "Domain Age Checker",   slug: "domain-age-checker",   category: "seo",      icon: "📅", desc: "Check how old any domain name is.",                                 badge: "",        uses: "140K", live: false },
  { name: "Readability Checker",  slug: "readability-checker",  category: "seo",      icon: "📖", desc: "Analyse how readable and SEO-friendly your content is.",            badge: "",        uses: "120K", live: false },

  // ── AI TOOLS ────────────────────────────────────────────────────────────────
  { name: "AI Writer",            slug: "ai-writer",            category: "ai",       icon: "🤖", desc: "Generate blog posts, emails and content using AI.",                 badge: "🤖 AI",   uses: "890K", live: false },
  { name: "AI Image Generator",   slug: "ai-image-generator",   category: "ai",       icon: "🎨", desc: "Generate images from text descriptions using AI.",                  badge: "🤖 AI",   uses: "1.2M", live: false },
  { name: "AI Translator",        slug: "ai-translator",        category: "ai",       icon: "🌍", desc: "Translate text between 100+ languages instantly.",                  badge: "🤖 AI",   uses: "760K", live: false },
  { name: "AI Code Generator",    slug: "ai-code-generator",    category: "ai",       icon: "💻", desc: "Generate code in any programming language from a description.",     badge: "🤖 AI",   uses: "540K", live: false },
  { name: "AI Email Writer",      slug: "ai-email-writer",      category: "ai",       icon: "📧", desc: "Write professional emails in seconds using AI.",                    badge: "🤖 AI",   uses: "430K", live: false },

  // ── FINANCE TOOLS ───────────────────────────────────────────────────────────
  { name: "Currency Converter",   slug: "currency-converter",   category: "finance",  icon: "💱", desc: "Convert currencies with live exchange rates.",                      badge: "",        uses: "390K", live: false },
  { name: "Loan Calculator",      slug: "loan-calculator",      category: "finance",  icon: "🏦", desc: "Calculate monthly payments, total interest and loan costs.",        badge: "",        uses: "340K", live: false },
  { name: "Compound Interest",    slug: "compound-interest",    category: "finance",  icon: "📈", desc: "Calculate compound interest and investment growth over time.",       badge: "",        uses: "290K", live: false },
  { name: "Percentage Calculator",slug: "percentage-calculator",category: "finance",  icon: "🔢", desc: "Calculate percentages, increases, decreases and differences.",      badge: "",        uses: "480K", live: false },
  { name: "Age Calculator",       slug: "age-calculator",       category: "finance",  icon: "🎂", desc: "Calculate exact age in years, months and days.",                   badge: "",        uses: "410K", live: false },
  { name: "BMI Calculator",       slug: "bmi-calculator",       category: "finance",  icon: "⚖️", desc: "Calculate your Body Mass Index and healthy weight range.",          badge: "",        uses: "360K", live: false },
  { name: "Unit Converter",       slug: "unit-converter",       category: "finance",  icon: "📏", desc: "Convert between length, weight, temperature and volume units.",     badge: "",        uses: "320K", live: false },
  { name: "Time Zone Converter",  slug: "timezone-converter",   category: "finance",  icon: "🕐", desc: "Convert times between any two time zones instantly.",               badge: "",        uses: "270K", live: false },
  { name: "Tip Calculator",       slug: "tip-calculator",       category: "finance",  icon: "🍽️", desc: "Calculate tips and split bills between friends.",                   badge: "",        uses: "240K", live: false },

  // ── SECURITY TOOLS ──────────────────────────────────────────────────────────
  { name: "Password Generator",   slug: "password-generator",   category: "security", icon: "🔐", desc: "Generate strong, cryptographically secure passwords.",              badge: "🆕 New",  uses: "980K", live: true  },
  { name: "Hash Generator",       slug: "hash-generator",       category: "security", icon: "🔑", desc: "Generate MD5, SHA-1, SHA-256 and SHA-512 hashes.",                 badge: "",        uses: "310K", live: false },
  { name: "SSL Checker",          slug: "ssl-checker",          category: "security", icon: "🛡️", desc: "Check the SSL certificate status of any website.",                  badge: "",        uses: "180K", live: false },
  { name: "IP Address Lookup",    slug: "ip-lookup",            category: "security", icon: "🌐", desc: "Look up the location and details of any IP address.",               badge: "",        uses: "290K", live: false },

  // ── PDF TOOLS ───────────────────────────────────────────────────────────────
  { name: "PDF Compressor",       slug: "pdf-compressor",       category: "pdf",      icon: "📄", desc: "Reduce PDF file size without losing quality.",                      badge: "🔥 Hot",  uses: "870K", live: false },
  { name: "PDF to Word",          slug: "pdf-to-word",          category: "pdf",      icon: "📝", desc: "Convert PDF files to editable Word documents.",                    badge: "",        uses: "640K", live: false },
  { name: "PDF Merger",           slug: "pdf-merger",           category: "pdf",      icon: "🔗", desc: "Merge multiple PDF files into one.",                               badge: "",        uses: "420K", live: false },
  { name: "PDF Splitter",         slug: "pdf-splitter",         category: "pdf",      icon: "✂️", desc: "Split a PDF into multiple separate files.",                        badge: "",        uses: "310K", live: false },
  { name: "Word to PDF",          slug: "word-to-pdf",          category: "pdf",      icon: "📄", desc: "Convert Word documents to PDF format.",                            badge: "",        uses: "560K", live: false },
];

const CATEGORIES = [
  { id: "all",      label: "All Tools",    icon: "⚡", count: ALL_TOOLS.length },
  { id: "text",     label: "Text",         icon: "📝", count: ALL_TOOLS.filter(t => t.category === "text").length     },
  { id: "image",    label: "Image",        icon: "🖼️", count: ALL_TOOLS.filter(t => t.category === "image").length    },
  { id: "dev",      label: "Developer",    icon: "💻", count: ALL_TOOLS.filter(t => t.category === "dev").length      },
  { id: "seo",      label: "SEO",          icon: "📊", count: ALL_TOOLS.filter(t => t.category === "seo").length      },
  { id: "ai",       label: "AI",           icon: "🤖", count: ALL_TOOLS.filter(t => t.category === "ai").length       },
  { id: "finance",  label: "Finance",      icon: "💰", count: ALL_TOOLS.filter(t => t.category === "finance").length  },
  { id: "security", label: "Security",     icon: "🔒", count: ALL_TOOLS.filter(t => t.category === "security").length },
  { id: "pdf",      label: "PDF",          icon: "📄", count: ALL_TOOLS.filter(t => t.category === "pdf").length      },
];

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular"  },
  { value: "newest",  label: "Newest First"  },
  { value: "name",    label: "A → Z"         },
  { value: "live",    label: "Live Tools"    },
];

// ─── Tool Card ────────────────────────────────────────────────────────────────

function ToolCard({ tool }: { tool: typeof ALL_TOOLS[0] }) {
  return (
    <Link
      href={tool.live ? `/tools/${tool.slug}` : "#"}
      className={`group bg-[#13131F] border border-white/5 rounded-2xl p-5 flex flex-col gap-3
        hover:border-[#6C3AFF]/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/20
        transition-all duration-300 relative overflow-hidden
        ${!tool.live ? "opacity-70" : ""}`}
    >
      {/* Coming soon overlay badge */}
      {!tool.live && (
        <span className="absolute top-3 right-3 text-[10px] bg-[#0A0A14] text-gray-600 px-2 py-0.5 rounded-full border border-white/5">
          Coming soon
        </span>
      )}

      {/* Top row */}
      <div className="flex items-start justify-between">
        <span className="text-3xl">{tool.icon}</span>
        {tool.badge && tool.live && (
          <span className="text-[10px] bg-[#6C3AFF]/20 text-[#6C3AFF] px-2 py-0.5 rounded-full font-bold border border-[#6C3AFF]/20">
            {tool.badge}
          </span>
        )}
      </div>

      {/* Name + desc */}
      <div>
        <h3 className="font-bold text-white text-sm group-hover:text-[#6C3AFF] transition-colors leading-snug">
          {tool.name}
        </h3>
        <p className="text-gray-600 text-xs mt-1 leading-relaxed line-clamp-2">{tool.desc}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
        <span className="text-xs text-gray-700 capitalize">{tool.category}</span>
        <span className="text-xs text-gray-600">
          <span className="text-green-400 font-semibold">{tool.uses}</span> uses
        </span>
      </div>
    </Link>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AllToolsPage() {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("all");
  const [sort,     setSort]     = useState("popular");
  const [showLiveOnly, setShowLiveOnly] = useState(false);

  // ── Filter + sort ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let tools = [...ALL_TOOLS];

    // Category filter
    if (category !== "all") tools = tools.filter((t) => t.category === category);

    // Live only
    if (showLiveOnly) tools = tools.filter((t) => t.live);

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      tools = tools.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.desc.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sort) {
      case "popular":
        tools.sort((a, b) => parseFloat(b.uses) - parseFloat(a.uses));
        break;
      case "name":
        tools.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "live":
        tools.sort((a, b) => (b.live ? 1 : 0) - (a.live ? 1 : 0));
        break;
      case "newest":
        // Live tools shown first as "newest"
        tools.sort((a, b) => (b.live ? 1 : 0) - (a.live ? 1 : 0));
        break;
    }

    return tools;
  }, [search, category, sort, showLiveOnly]);

  const liveCount = ALL_TOOLS.filter((t) => t.live).length;

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">

      {/* ── Navbar ── */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">← Home</Link>
            <button className="px-4 py-2 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all">
              Go Pro ⚡
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">

        {/* ── Breadcrumb ── */}
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-400">All Tools</span>
        </nav>

        {/* ── Header ── */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            All <span className="bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] bg-clip-text text-transparent">Free Tools</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {ALL_TOOLS.length}+ tools across {CATEGORIES.length - 1} categories.
            No login. No limits. All free.
          </p>
          {/* Live tools indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-500">
              <span className="text-green-400 font-bold">{liveCount} tools</span> live now —
              more added every week by AI
            </span>
          </div>
        </div>

        {/* ── Search bar ── */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${ALL_TOOLS.length}+ tools...`}
              className="w-full pl-12 pr-5 py-4 rounded-2xl bg-[#13131F] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 focus:shadow-[0_0_20px_rgba(108,58,255,0.1)] transition-all text-base"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ── Category tabs ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                category === cat.id
                  ? "bg-[#6C3AFF] text-white shadow-lg shadow-violet-900/30"
                  : "bg-[#13131F] text-gray-400 hover:text-white border border-white/5 hover:border-[#6C3AFF]/30"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                category === cat.id ? "bg-white/20" : "bg-white/5"
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── Sort + filters row ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            {/* Results count */}
            <span className="text-sm text-gray-500">
              Showing <span className="text-white font-bold">{filtered.length}</span> tools
              {search && <span className="text-[#6C3AFF]"> for &quot;{search}&quot;</span>}
            </span>
            {/* Live only toggle */}
            <button
              onClick={() => setShowLiveOnly(!showLiveOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                showLiveOnly
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-[#13131F] text-gray-500 border border-white/5 hover:text-white"
              }`}
            >
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              Live only
            </button>
          </div>

          {/* Sort selector */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-[#13131F] border border-white/5 text-gray-400 text-sm px-4 py-2 rounded-xl focus:outline-none focus:border-[#6C3AFF]/50 transition-all cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* ── Tools Grid ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No tools found</h3>
            <p className="text-gray-500 mb-6">
              No results for &quot;{search}&quot; — try a different search term.
            </p>
            <button
              onClick={() => { setSearch(""); setCategory("all"); }}
              className="px-6 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-bold transition-all"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* ── Bottom CTA ── */}
        <div className="mt-20 bg-gradient-to-r from-[#6C3AFF]/10 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-3xl p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Can&apos;t find the tool you need?
          </h2>
          <p className="text-gray-500 mb-6 max-w-lg mx-auto">
            Our AI agents add new tools every single day. Come back tomorrow — or tell us what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-8 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-bold transition-all">
              Request a Tool →
            </button>
            <Link
              href="/"
              className="px-8 py-3 rounded-xl bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/30 text-white font-bold transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 mt-20 py-8 text-center">
        <Link href="/" className="text-xl font-black">
          Purs<span className="text-[#6C3AFF]">Tech</span>
        </Link>
        <p className="text-gray-700 text-xs mt-2">© 2025 PursTech. Free online tools for everyone.</p>
      </footer>

    </div>
  );
}
