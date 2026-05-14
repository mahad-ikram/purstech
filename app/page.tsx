"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── All 50 live tools ────────────────────────────────────────────────────────

const ALL_TOOLS = [
  // ── Text (5) ────────────────────────────────────────────────────────────────
  { icon:"📝", name:"Word Counter",              slug:"word-counter",              category:"text",     badge:"⭐ Top"  },
  { icon:"🔤", name:"Case Converter",             slug:"case-converter",            category:"text",     badge:""        },
  { icon:"📄", name:"Lorem Ipsum Generator",      slug:"lorem-ipsum",               category:"text",     badge:""        },
  { icon:"🔍", name:"Diff Checker",               slug:"diff-checker",              category:"text",     badge:""        },
  { icon:"🔊", name:"Text to Speech",             slug:"text-to-speech",            category:"text",     badge:""        },
  // ── Dev (14) ────────────────────────────────────────────────────────────────
  { icon:"💻", name:"JSON Formatter",             slug:"json-formatter",            category:"dev",      badge:"⭐ Top"  },
  { icon:"🔐", name:"Base64 Encoder",             slug:"base64-encoder",            category:"dev",      badge:""        },
  { icon:"🔗", name:"URL Encoder",                slug:"url-encoder",               category:"dev",      badge:""        },
  { icon:"🎲", name:"UUID Generator",             slug:"uuid-generator",            category:"dev",      badge:""        },
  { icon:"🔲", name:"QR Code Generator",          slug:"qr-code-generator",         category:"dev",      badge:""        },
  { icon:"🔑", name:"Hash Generator",             slug:"hash-generator",            category:"dev",      badge:""        },
  { icon:"🎨", name:"CSS Minifier",               slug:"css-minifier",              category:"dev",      badge:""        },
  { icon:"🗜️", name:"HTML Minifier",              slug:"html-minifier",             category:"dev",      badge:""        },
  { icon:"🧪", name:"Regex Tester",               slug:"regex-tester",              category:"dev",      badge:""        },
  { icon:"⚡", name:"JS Minifier",                slug:"js-minifier",               category:"dev",      badge:""        },
  { icon:"📝", name:"HTML to Markdown",           slug:"html-to-markdown",          category:"dev",      badge:""        },
  { icon:"✍️", name:"Markdown Editor",            slug:"markdown-editor",           category:"dev",      badge:""        },
  { icon:"🎨", name:"Color Code Converter",       slug:"color-code-converter",      category:"dev",      badge:""        },
  { icon:"✦",  name:"SVG Editor",                 slug:"svg-editor",                category:"dev",      badge:"🆕 New"  },
  // ── Image (6) ───────────────────────────────────────────────────────────────
  { icon:"🎨", name:"Color Picker",               slug:"color-picker",              category:"image",    badge:""        },
  { icon:"🗜️", name:"Image Compressor",           slug:"image-compressor",          category:"image",    badge:""        },
  { icon:"📐", name:"Image Resizer",              slug:"image-resizer",             category:"image",    badge:""        },
  { icon:"✂️", name:"Background Remover",         slug:"background-remover",        category:"image",    badge:""        },
  { icon:"🏷",  name:"Favicon Generator",          slug:"favicon-generator",         category:"image",    badge:""        },
  { icon:"📷", name:"Image to Text (OCR)",        slug:"image-to-text",             category:"image",    badge:"🔥 Hot"  },
  // ── SEO (5) ─────────────────────────────────────────────────────────────────
  { icon:"🏷",  name:"Meta Tag Generator",         slug:"meta-tag-generator",        category:"seo",      badge:"🔥 Hot"  },
  { icon:"🤖", name:"Robots.txt Generator",        slug:"robots-txt-generator",      category:"seo",      badge:""        },
  { icon:"🔍", name:"Keyword Density Checker",    slug:"keyword-density-checker",   category:"seo",      badge:""        },
  { icon:"📊", name:"Open Graph Generator",       slug:"open-graph-generator",      category:"seo",      badge:""        },
  { icon:"🗺",  name:"Sitemap Generator",           slug:"sitemap-generator",         category:"seo",      badge:""        },
  // ── Finance (10) ────────────────────────────────────────────────────────────
  { icon:"🎂", name:"Age Calculator",             slug:"age-calculator",            category:"finance",  badge:""        },
  { icon:"⚖️", name:"BMI Calculator",              slug:"bmi-calculator",            category:"finance",  badge:""        },
  { icon:"🔢", name:"Percentage Calculator",       slug:"percentage-calculator",     category:"finance",  badge:""        },
  { icon:"📏", name:"Unit Converter",              slug:"unit-converter",            category:"finance",  badge:""        },
  { icon:"💱", name:"Currency Converter",          slug:"currency-converter",        category:"finance",  badge:""        },
  { icon:"🏦", name:"Loan Calculator",             slug:"loan-calculator",           category:"finance",  badge:""        },
  { icon:"📈", name:"Compound Interest Calc",     slug:"compound-interest-calculator",category:"finance", badge:""       },
  { icon:"🍽",  name:"Tip Calculator",              slug:"tip-calculator",            category:"finance",  badge:""        },
  { icon:"🕐", name:"Time Zone Converter",        slug:"time-zone-converter",       category:"finance",  badge:""        },
  { icon:"🏠", name:"Mortgage Calculator",        slug:"mortgage-calculator",       category:"finance",  badge:""        },
  // ── Security (3) ────────────────────────────────────────────────────────────
  { icon:"🔐", name:"Password Generator",         slug:"password-generator",        category:"security", badge:""        },
  { icon:"🔒", name:"SSL Certificate Checker",    slug:"ssl-checker",               category:"security", badge:"🆕 New"  },
  { icon:"🌐", name:"IP Address Lookup",          slug:"ip-lookup",                 category:"security", badge:"🆕 New"  },
  // ── PDF (5) ─────────────────────────────────────────────────────────────────
  { icon:"🗜️", name:"PDF Compressor",             slug:"pdf-compressor",            category:"pdf",      badge:"🆕 New"  },
  { icon:"📑", name:"PDF Merger",                 slug:"pdf-merger",                category:"pdf",      badge:"🆕 New"  },
  { icon:"✂️", name:"PDF Splitter",               slug:"pdf-splitter",              category:"pdf",      badge:"🆕 New"  },
  { icon:"📝", name:"PDF to Word",                slug:"pdf-to-word",               category:"pdf",      badge:"🆕 New"  },
  { icon:"📄", name:"Word to PDF",                slug:"word-to-pdf",               category:"pdf",      badge:"🆕 New"  },
  // ── AI (2) ──────────────────────────────────────────────────────────────────
  { icon:"✓",  name:"Grammar Checker",            slug:"grammar-checker",           category:"ai",       badge:"🆕 New"  },
  { icon:"📊", name:"Readability Checker",        slug:"readability-checker",       category:"ai",       badge:"🆕 New"  },
];

// ─── Featured — best 12 across all categories ────────────────────────────────

const FEATURED = [
  "word-counter", "json-formatter", "image-compressor", "meta-tag-generator",
  "pdf-compressor", "grammar-checker", "image-to-text", "qr-code-generator",
  "ssl-checker", "password-generator", "regex-tester", "readability-checker",
].map(slug => ALL_TOOLS.find(t => t.slug === slug)!).filter(Boolean);

// ─── New this month — Batches 8 + 9 ─────────────────────────────────────────

const NEW_TOOLS = ALL_TOOLS.filter(t => t.badge === "🆕 New").slice(0, 8);

// ─── Categories ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  { icon:"📝", name:"Text Tools",     slug:"text",     color:"from-violet-600 to-violet-400",  desc:"Write, format and analyse text" },
  { icon:"🖼️", name:"Image Tools",    slug:"image",    color:"from-cyan-600 to-cyan-400",      desc:"Compress, resize and convert images" },
  { icon:"💻", name:"Dev Tools",      slug:"dev",      color:"from-blue-600 to-blue-400",      desc:"JSON, regex, SVG, markdown and more" },
  { icon:"📊", name:"SEO Tools",      slug:"seo",      color:"from-green-600 to-green-400",    desc:"Meta tags, sitemaps and robots" },
  { icon:"🤖", name:"AI Tools",       slug:"ai",       color:"from-pink-600 to-pink-400",      desc:"Grammar check and readability" },
  { icon:"💰", name:"Finance Tools",  slug:"finance",  color:"from-yellow-600 to-yellow-400",  desc:"Calculators and converters" },
  { icon:"🔒", name:"Security",       slug:"security", color:"from-red-600 to-red-400",        desc:"Passwords, SSL and IP lookup" },
  { icon:"📄", name:"PDF Tools",      slug:"pdf",      color:"from-orange-600 to-orange-400",  desc:"Compress, merge, split and convert PDFs" },
].map(c => ({ ...c, count: ALL_TOOLS.filter(t => t.category === c.slug).length }));

// ─── Activity feed ───────────────────────────────────────────────────────────

const ACTIVITIES = [
  { flag:"🇺🇸", location:"New York, USA",         tool:"Grammar Checker",        time:"2s ago"  },
  { flag:"🇮🇳", location:"Mumbai, India",          tool:"JSON Formatter",         time:"4s ago"  },
  { flag:"🇬🇧", location:"London, UK",             tool:"PDF Compressor",         time:"7s ago"  },
  { flag:"🇩🇪", location:"Berlin, Germany",        tool:"Meta Tag Generator",     time:"11s ago" },
  { flag:"🇧🇷", location:"São Paulo, Brazil",      tool:"Image Compressor",       time:"14s ago" },
  { flag:"🇵🇰", location:"Karachi, Pakistan",      tool:"Readability Checker",    time:"18s ago" },
  { flag:"🇫🇷", location:"Paris, France",          tool:"SSL Checker",            time:"22s ago" },
  { flag:"🇦🇺", location:"Sydney, Australia",      tool:"IP Address Lookup",      time:"26s ago" },
  { flag:"🇨🇦", location:"Toronto, Canada",        tool:"Password Generator",     time:"30s ago" },
  { flag:"🇯🇵", location:"Tokyo, Japan",           tool:"QR Code Generator",      time:"35s ago" },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href:"/tools?cat=text",     label:"Text"      },
  { href:"/tools?cat=image",    label:"Image"     },
  { href:"/tools?cat=dev",      label:"Dev"       },
  { href:"/tools?cat=seo",      label:"SEO"       },
  { href:"/tools?cat=pdf",      label:"PDF"       },
  { href:"/tools?cat=finance",  label:"Finance"   },
  { href:"/tools?cat=security", label:"Security"  },
  { href:"/tools?cat=ai",       label:"AI"        },
  { href:"/tools",              label:"All 50 Tools", highlight: true },
  { href:"/blog",               label:"Blog"      },
  { href:"/about",              label:"About"     },
];

function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close mobile menu when scrolling down significantly
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "bg-[#0A0A14]/98 backdrop-blur-md shadow-lg shadow-violet-900/20"
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <span className="text-2xl font-black text-white tracking-tight">
              Purs<span className="text-[#6C3AFF]">Tech</span>
            </span>
            <span className="text-[10px] bg-[#6C3AFF]/20 text-[#6C3AFF] px-2 py-0.5 rounded-full font-bold border border-[#6C3AFF]/30">
              50 Tools
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-5 text-sm text-gray-400 font-medium">
            {NAV_LINKS.filter(l => !l.highlight).map(l => (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
            ))}
            <Link href="/tools" className="text-[#6C3AFF] hover:text-white transition-colors font-bold">
              All 50 Tools
            </Link>
          </div>

          {/* Right side: Go Pro + Hamburger */}
          <div className="flex items-center gap-3">
            <button className="hidden md:block px-4 py-2 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all duration-300 shadow-lg shadow-violet-900/30">
              Go Pro ⚡
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(p => !p)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl bg-[#13131F] border border-white/10 gap-1.5 transition-all hover:border-[#6C3AFF]/40"
            >
              <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* ── Mobile menu ─────────────────────────────────────────────── */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}>
          <div className="bg-[#0A0A14]/98 border-t border-white/5 px-4 pt-4 pb-6">

            {/* Categories grid */}
            <div className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Browse by category</div>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {CATEGORIES.map(c => (
                <Link key={c.slug} href={`/tools?cat=${c.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 transition-all group">
                  <span className="text-lg">{c.icon}</span>
                  <div>
                    <div className="text-white text-xs font-bold group-hover:text-[#00D4FF] transition-colors">{c.name}</div>
                    <div className="text-gray-600 text-xs">{c.count} tools</div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Main links */}
            <div className="space-y-1 mb-5">
              {[
                { href:"/tools",   label:"🔧  Browse All 50 Tools",  special: true  },
                { href:"/blog",    label:"📖  Blog"                                  },
                { href:"/about",   label:"ℹ️   About PursTech"                       },
                { href:"/contact", label:"✉️   Contact"                              },
              ].map(l => (
                <Link key={l.href} href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    l.special
                      ? "bg-[#6C3AFF]/10 border border-[#6C3AFF]/30 text-[#6C3AFF] hover:bg-[#6C3AFF]/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Go Pro CTA */}
            <button className="w-full py-3.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-extrabold text-sm transition-all duration-300 shadow-lg shadow-violet-900/30">
              ⚡ Go Pro — $7/month · Cancel anytime
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop to close menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  const [query,       setQuery]       = useState("");
  const [count,       setCount]       = useState(2847391);
  const [results,     setResults]     = useState<typeof ALL_TOOLS>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setCount(c => c + Math.floor(Math.random() * 4) + 1), 2000);
    return () => clearInterval(id);
  }, []);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim().length > 1) {
      setResults(ALL_TOOLS.filter(t =>
        t.name.toLowerCase().includes(q.toLowerCase()) ||
        t.category.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 6));
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10   rounded-full blur-3xl pointer-events-none" />

      {/* Live counter */}
      <div className="mb-6 flex items-center gap-2 bg-[#13131F] border border-[#6C3AFF]/30 rounded-full px-5 py-2 text-sm">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-gray-400">
          <span className="text-white font-bold">{count.toLocaleString()}</span> tools used today
        </span>
      </div>

      <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white text-center max-w-5xl leading-tight">
        Stop Searching.{" "}
        <br className="hidden md:block" />
        <span className="bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] bg-clip-text text-transparent">
          Start Doing.
        </span>
      </h1>

      <p className="mt-6 text-lg md:text-xl text-gray-400 text-center max-w-2xl leading-relaxed">
        <span className="text-white font-semibold">50 free tools</span> across 8 categories —
        text, image, dev, SEO, PDF, finance, security and AI.{" "}
        No login. No limits.
      </p>

      {/* Search */}
      <div className="mt-10 w-full max-w-xl relative">
        <div className="flex items-center gap-3 bg-[#13131F] border border-[#6C3AFF]/30 rounded-2xl px-5 py-4 focus-within:border-[#00D4FF]/60 transition-all">
          <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={query} onChange={e => handleSearch(e.target.value)}
            onBlur={() => setTimeout(() => setShowResults(false), 150)}
            placeholder="Search 50 tools — grammar checker, pdf compressor, svg editor…"
            className="flex-1 bg-transparent text-white placeholder-gray-600 focus:outline-none text-sm"
          />
          {query && (
            <button onClick={() => { setQuery(""); setShowResults(false); }} className="text-gray-600 hover:text-white">✕</button>
          )}
        </div>
        {showResults && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#13131F] border border-white/10 rounded-2xl overflow-hidden z-30 shadow-2xl">
            {results.map(t => (
              <Link key={t.slug} href={`/tools/${t.slug}`}
                className="flex items-center gap-3 px-5 py-3 hover:bg-[#6C3AFF]/10 transition-colors border-b border-white/5 last:border-0">
                <span className="text-xl">{t.icon}</span>
                <div>
                  <div className="text-white text-sm font-semibold">{t.name}</div>
                  <div className="text-gray-500 text-xs capitalize">{t.category} tools</div>
                </div>
                {t.badge && <span className="ml-auto text-xs text-[#6C3AFF] font-bold">{t.badge}</span>}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick category links */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map(c => (
          <Link key={c.slug} href={`/tools?cat=${c.slug}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 text-gray-400 hover:text-white text-xs font-semibold transition-all">
            <span>{c.icon}</span>
            <span>{c.name.split(" ")[0]}</span>
            <span className="text-gray-700">{c.count}</span>
          </Link>
        ))}
      </div>

      {/* Stats row */}
      <div className="mt-12 grid grid-cols-3 gap-8 text-center">
        {[
          { value:"50",    label:"Free Tools",      sub:"across 8 categories" },
          { value:"100%",  label:"Free Forever",    sub:"no sign-up required" },
          { value:"∞",     label:"No Limits",       sub:"unlimited daily use"  },
        ].map(s => (
          <div key={s.label}>
            <div className="text-3xl md:text-4xl font-black text-white">{s.value}</div>
            <div className="text-sm font-bold text-[#6C3AFF] mt-1">{s.label}</div>
            <div className="text-xs text-gray-600 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Trending bar ─────────────────────────────────────────────────────────────

function TrendingBar() {
  const items = ALL_TOOLS.map(t => `${t.icon} ${t.name}`);
  return (
    <div className="border-y border-white/5 bg-[#0D0D1A] py-3 overflow-hidden">
      <div className="flex items-center gap-3">
        <span className="flex-shrink-0 text-xs font-bold text-[#FF3A6C] px-4 uppercase tracking-widest">
          🔥 Trending
        </span>
        <div className="overflow-hidden flex-1">
          <div className="flex gap-8 animate-[scroll_40s_linear_infinite] whitespace-nowrap">
            {[...items, ...items].map((item, i) => (
              <span key={i} className="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-default flex-shrink-0">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Live activity ────────────────────────────────────────────────────────────

function LiveActivity() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % ACTIVITIES.length), 2800);
    return () => clearInterval(id);
  }, []);
  const a = ACTIVITIES[idx];
  return (
    <div className="max-w-7xl mx-auto px-4 py-3 flex justify-center">
      <div className="flex items-center gap-3 bg-[#13131F] border border-white/5 rounded-full px-5 py-2 text-xs text-gray-500 transition-all">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
        <span className="text-xl">{a.flag}</span>
        <span>Someone in <strong className="text-white">{a.location}</strong> just used <strong className="text-[#00D4FF]">{a.tool}</strong></span>
        <span className="text-gray-700">{a.time}</span>
      </div>
    </div>
  );
}

// ─── Category grid ────────────────────────────────────────────────────────────

function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
          8 Categories. 50 Tools. All Free.
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          Every tool is completely free — no account, no daily limits, no watermarks.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map(c => (
          <Link key={c.slug} href={`/tools?cat=${c.slug}`}
            className="group relative bg-[#13131F] border border-white/5 rounded-2xl p-5 hover:border-[#6C3AFF]/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity bg-gradient-to-br ${c.color}`} />
            <div className="text-3xl mb-3">{c.icon}</div>
            <div className="font-extrabold text-white text-sm mb-1">{c.name}</div>
            <div className="text-xs text-gray-500 mb-3 leading-relaxed">{c.desc}</div>
            <div className={`inline-flex items-center gap-1 text-xs font-bold bg-gradient-to-r ${c.color} bg-clip-text text-transparent`}>
              {c.count} tools →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Featured tools ───────────────────────────────────────────────────────────

function FeaturedTools() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? FEATURED : FEATURED.filter(t => t.category === filter);
  const cats = ["all", ...new Set(FEATURED.map(t => t.category))];

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Most Used Tools</h2>
          <p className="text-gray-500 text-sm mt-1">Handpicked from 50 tools across all categories</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all border ${filter === c ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#13131F] border-white/5 text-gray-400 hover:text-white"}`}>
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map(t => (
          <Link key={t.slug} href={`/tools/${t.slug}`}
            className="group bg-[#13131F] border border-white/5 rounded-2xl p-4 hover:border-[#6C3AFF]/40 transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{t.icon}</span>
              {t.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  t.badge === "⭐ Top"  ? "bg-violet-500/20 text-violet-400" :
                  t.badge === "🔥 Hot"  ? "bg-orange-500/20 text-orange-400" :
                  t.badge === "🆕 New"  ? "bg-cyan-500/20 text-cyan-400"    :
                  "bg-gray-500/20 text-gray-400"
                }`}>{t.badge}</span>
              )}
            </div>
            <div className="font-bold text-white text-sm mb-1 group-hover:text-[#00D4FF] transition-colors leading-snug">
              {t.name}
            </div>
            <div className="text-xs text-gray-600 capitalize">{t.category} tools</div>
          </Link>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link href="/tools"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#13131F] border border-[#6C3AFF]/30 hover:border-[#6C3AFF]/60 text-white font-bold transition-all hover:-translate-y-0.5">
          Browse all 50 tools →
        </Link>
      </div>
    </section>
  );
}

// ─── New This Month ───────────────────────────────────────────────────────────

function NewToolsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="bg-gradient-to-br from-[#13131F] to-[#0d0d1a] border border-[#6C3AFF]/20 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6C3AFF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00D4FF]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/20 border border-[#6C3AFF]/30 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-bold mb-2">
              🆕 Just Launched
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">New Tools This Month</h2>
            <p className="text-gray-500 text-sm mt-1">PDF suite, SSL checker, IP lookup, grammar checker, SVG editor and more</p>
          </div>
          <Link href="/tools" className="text-sm text-[#00D4FF] hover:text-white transition-colors font-semibold flex-shrink-0">
            See all new tools →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {NEW_TOOLS.map(t => (
            <Link key={t.slug} href={`/tools/${t.slug}`}
              className="group flex items-center gap-3 bg-[#0A0A14]/60 border border-white/5 hover:border-[#6C3AFF]/40 rounded-xl px-3 py-2.5 transition-all">
              <span className="text-xl flex-shrink-0">{t.icon}</span>
              <div>
                <div className="text-white text-xs font-bold group-hover:text-[#00D4FF] transition-colors leading-snug">{t.name}</div>
                <div className="text-gray-600 text-xs capitalize">{t.category}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Category badges for new batches */}
        <div className="flex flex-wrap gap-2 mt-5">
          {[
            { label:"5 PDF Tools — compress, merge, split, convert",  color:"text-orange-400 bg-orange-400/10 border-orange-400/20" },
            { label:"2 AI Tools — grammar & readability",             color:"text-pink-400 bg-pink-400/10 border-pink-400/20"       },
            { label:"2 Security Tools — SSL checker & IP lookup",     color:"text-red-400 bg-red-400/10 border-red-400/20"          },
            { label:"SVG Editor with React export",                    color:"text-blue-400 bg-blue-400/10 border-blue-400/20"       },
          ].map(b => (
            <span key={b.label} className={`text-xs font-semibold px-3 py-1 rounded-full border ${b.color}`}>
              ✓ {b.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why PursTech ─────────────────────────────────────────────────────────────

function WhySection() {
  const points = [
    { icon:"⚡", title:"Instant results",       desc:"Every tool runs in your browser. No upload wait, no processing queue — results appear as you type." },
    { icon:"🔒", title:"Private by design",     desc:"Your files never touch our servers. PDF compression, OCR, image editing — all 100% client-side." },
    { icon:"🌍", title:"Works everywhere",       desc:"Any browser, any device. No app install, no account, no extension required." },
    { icon:"♾️", title:"Unlimited & free",       desc:"Every tool is free with no daily limits, no watermarks and no login wall — ever." },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Why 3 million people use PursTech</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {points.map(p => (
          <div key={p.title} className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
            <div className="text-3xl mb-4">{p.icon}</div>
            <div className="font-extrabold text-white text-base mb-2">{p.title}</div>
            <div className="text-gray-500 text-sm leading-relaxed">{p.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Pro banner ───────────────────────────────────────────────────────────────

function ProBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      <div className="relative bg-gradient-to-br from-[#1a0a2e] via-[#13131F] to-[#0a1a2e] border border-[#6C3AFF]/30 rounded-3xl p-10 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[#6C3AFF]/5 rounded-3xl" />
        <div className="relative">
          <span className="inline-block bg-[#6C3AFF]/20 text-[#6C3AFF] text-xs font-bold px-4 py-1.5 rounded-full border border-[#6C3AFF]/30 mb-4">
            ⚡ PursTech Pro
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Unlock the Full Power
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
            Remove all limits, remove all ads, and get priority AI processing — for less than a coffee a week.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm">
            {["✓ Unlimited usage","✓ Zero ads","✓ Priority AI","✓ API access","✓ Batch processing","✓ Early access"].map(f => (
              <span key={f} className="text-gray-300">{f}</span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-10 py-4 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-extrabold text-lg transition-all duration-300 shadow-lg shadow-violet-900/50">
              Get Pro — $7/month
            </button>
            <span className="text-gray-500 text-sm">Cancel anytime. No hidden fees.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

function NewsletterSection() {
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="max-w-3xl mx-auto px-4 py-14 text-center">
      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">New Tools Every Month</h2>
      <p className="text-gray-500 text-lg mb-8">
        Free. No spam. Unsubscribe anytime.{" "}
        <span className="text-[#6C3AFF] font-semibold">18,400+ subscribers</span> already in.
      </p>
      {submitted ? (
        <div className="text-green-400 font-bold text-xl">🎉 You&apos;re in! Check your inbox.</div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 px-5 py-4 rounded-xl bg-[#13131F] border border-[#6C3AFF]/30 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4FF] transition-all" />
          <button onClick={() => email.includes("@") && setSubmitted(true)}
            className="px-7 py-4 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-bold transition-all duration-300 whitespace-nowrap">
            Subscribe →
          </button>
        </div>
      )}
    </section>
  );
}

// ─── SEO / LLM content section ───────────────────────────────────────────────
// This section is visible on page — honest, well-structured content.
// Google's NLP, LLMs and voice assistants all parse this for tool recommendations.

function SEOSection() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-14">
      <div className="bg-[#13131F] border border-white/5 rounded-3xl p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
          What is PursTech?
        </h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          PursTech is a free online tool platform offering <strong className="text-white">50 browser-based tools</strong> across
          8 categories — no account required, no daily limits, no ads. Every tool runs
          entirely in your browser, meaning your files and data never leave your device.
        </p>

        {/* Tool list — structured for LLM parsing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              cat:"📄 PDF Tools",
              tools:["PDF Compressor","PDF Merger","PDF Splitter","PDF to Word","Word to PDF"],
            },
            {
              cat:"🖼️ Image Tools",
              tools:["Image Compressor","Image Resizer","Background Remover","Favicon Generator","Image to Text (OCR)"],
            },
            {
              cat:"💻 Developer Tools",
              tools:["JSON Formatter","Regex Tester","SVG Editor","Markdown Editor","Base64 Encoder","QR Code Generator"],
            },
            {
              cat:"📊 SEO Tools",
              tools:["Meta Tag Generator","Sitemap Generator","Open Graph Generator","Robots.txt Generator","Keyword Density Checker"],
            },
            {
              cat:"🤖 AI Writing Tools",
              tools:["Grammar Checker","Readability Checker"],
            },
            {
              cat:"🔒 Security Tools",
              tools:["Password Generator","SSL Certificate Checker","IP Address Lookup"],
            },
            {
              cat:"💰 Finance Tools",
              tools:["Loan Calculator","Mortgage Calculator","Compound Interest Calculator","Currency Converter","Tip Calculator"],
            },
            {
              cat:"📝 Text Tools",
              tools:["Word Counter","Case Converter","Diff Checker","Lorem Ipsum Generator","Text to Speech"],
            },
          ].map(({ cat, tools }) => (
            <div key={cat}>
              <div className="text-xs font-bold text-[#6C3AFF] uppercase tracking-wider mb-2">{cat}</div>
              <ul className="space-y-1">
                {tools.map(t => (
                  <li key={t} className="text-xs text-gray-500 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-gray-700 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-500">
          <div>
            <span className="text-white font-bold">Free forever</span> — every tool on PursTech
            is and will remain free. No freemium bait-and-switch.
          </div>
          <div>
            <span className="text-white font-bold">Private by design</span> — PDF compression,
            image editing and OCR all run in your browser. Zero server uploads.
          </div>
          <div>
            <span className="text-white font-bold">No account required</span> — open any tool
            and start working immediately. No sign-up, no email verification, no paywall.
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols: Record<string, { name: string; href: string }[]> = {
    "Text & Dev": [
      { name:"Word Counter",      href:"/tools/word-counter"      },
      { name:"JSON Formatter",    href:"/tools/json-formatter"    },
      { name:"Regex Tester",      href:"/tools/regex-tester"      },
      { name:"Markdown Editor",   href:"/tools/markdown-editor"   },
      { name:"SVG Editor",        href:"/tools/svg-editor"        },
      { name:"QR Code Generator", href:"/tools/qr-code-generator" },
    ],
    "Image & SEO": [
      { name:"Image Compressor",       href:"/tools/image-compressor"       },
      { name:"Image Resizer",          href:"/tools/image-resizer"          },
      { name:"Image to Text (OCR)",    href:"/tools/image-to-text"          },
      { name:"Favicon Generator",      href:"/tools/favicon-generator"      },
      { name:"Meta Tag Generator",     href:"/tools/meta-tag-generator"     },
      { name:"Sitemap Generator",      href:"/tools/sitemap-generator"      },
    ],
    "PDF & Finance": [
      { name:"PDF Compressor",         href:"/tools/pdf-compressor"         },
      { name:"PDF Merger",             href:"/tools/pdf-merger"             },
      { name:"PDF Splitter",           href:"/tools/pdf-splitter"           },
      { name:"Loan Calculator",        href:"/tools/loan-calculator"        },
      { name:"Mortgage Calculator",    href:"/tools/mortgage-calculator"    },
      { name:"Currency Converter",     href:"/tools/currency-converter"     },
    ],
    "AI & Security": [
      { name:"Grammar Checker",        href:"/tools/grammar-checker"        },
      { name:"Readability Checker",    href:"/tools/readability-checker"    },
      { name:"SSL Certificate Checker",href:"/tools/ssl-checker"            },
      { name:"IP Address Lookup",      href:"/tools/ip-lookup"              },
      { name:"Password Generator",     href:"/tools/password-generator"     },
    ],
    "PursTech": [
      { name:"About Us",    href:"/about"    },
      { name:"All 50 Tools",href:"/tools"    },
      { name:"Blog",        href:"/blog"     },
      { name:"Go Pro ⚡",   href:"/pro"      },
      { name:"Contact",     href:"/contact"  },
      { name:"Privacy",     href:"/privacy"  },
      { name:"Terms",       href:"/terms"    },
    ],
  };

  return (
    <footer className="border-t border-white/5 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {Object.entries(cols).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-white font-bold text-sm mb-4">{section}</h3>
              <ul className="space-y-2">
                {links.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-white">Purs<span className="text-[#6C3AFF]">Tech</span></span>
            <span className="text-gray-600 text-xs">— Stop Searching. Start Doing.</span>
          </div>
          <div className="text-xs text-gray-600">
            50 free tools · 8 categories · 0 sign-ups required
          </div>
          <div className="flex gap-5 text-xs text-gray-600">
            <Link href="/privacy"     className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link href="/terms"       className="hover:text-gray-400 transition-colors">Terms</Link>
            <Link href="/sitemap.xml" className="hover:text-gray-400 transition-colors">Sitemap</Link>
          </div>
          <p className="text-gray-700 text-xs">© 2025 PursTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A14] font-sans">
      <Navbar />
      <HeroSection />
      <TrendingBar />
      <LiveActivity />
      <CategoryGrid />
      <FeaturedTools />
      <NewToolsSection />
      <WhySection />
      <SEOSection />
      <ProBanner />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
