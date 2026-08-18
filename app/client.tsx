"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; 

const ALL_TOOLS = [
  // Text (5)
  { icon:"📝", name:"Word Counter",              slug:"word-counter",              category:"text",     badge:"⭐ Top"  },
  { icon:"🔤", name:"Case Converter",             slug:"case-converter",            category:"text",     badge:""        },
  { icon:"📄", name:"Lorem Ipsum Generator",      slug:"lorem-ipsum",               category:"text",     badge:""        },
  { icon:"🔍", name:"Diff Checker",               slug:"diff-checker",              category:"text",     badge:""        },
  { icon:"🔊", name:"Text to Speech",             slug:"text-to-speech",            category:"text",     badge:""        },
  // Dev (14)
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
  // Image (6)
  { icon:"🎨", name:"Color Picker",               slug:"color-picker",              category:"image",    badge:""        },
  { icon:"🗜️", name:"Image Compressor",           slug:"image-compressor",          category:"image",    badge:""        },
  { icon:"📐", name:"Image Resizer",              slug:"image-resizer",             category:"image",    badge:""        },
  { icon:"✂️", name:"Background Remover",         slug:"background-remover",        category:"image",    badge:""        },
  { icon:"🏷",  name:"Favicon Generator",          slug:"favicon-generator",         category:"image",    badge:""        },
  { icon:"📷", name:"Image to Text (OCR)",        slug:"image-to-text",             category:"image",    badge:"🔥 Hot"  },
  // SEO (5)
  { icon:"🏷",  name:"Meta Tag Generator",         slug:"meta-tag-generator",        category:"seo",      badge:"🔥 Hot"  },
  { icon:"🤖", name:"Robots.txt Generator",        slug:"robots-txt-generator",      category:"seo",      badge:""        },
  { icon:"🔍", name:"Keyword Density Checker",    slug:"keyword-density-checker",   category:"seo",      badge:""        },
  { icon:"📊", name:"Open Graph Generator",       slug:"open-graph-generator",      category:"seo",      badge:""        },
  { icon:"🗺",  name:"Sitemap Generator",           slug:"sitemap-generator",         category:"seo",      badge:""        },
  // Finance (10)
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
  // Security (3)
  { icon:"🔐", name:"Password Generator",         slug:"password-generator",        category:"security", badge:""        },
  { icon:"🔒", name:"SSL Certificate Checker",    slug:"ssl-checker",               category:"security", badge:"🆕 New"  },
  { icon:"🌐", name:"IP Address Lookup",          slug:"ip-lookup",                 category:"security", badge:"🆕 New"  },
  // PDF (5)
  { icon:"🗜️", name:"PDF Compressor",             slug:"pdf-compressor",            category:"pdf",      badge:"🆕 New"  },
  { icon:"📑", name:"PDF Merger",                 slug:"pdf-merger",                category:"pdf",      badge:"🆕 New"  },
  { icon:"✂️", name:"PDF Splitter",               slug:"pdf-splitter",              category:"pdf",      badge:"🆕 New"  },
  { icon:"📝", name:"PDF to Word",                slug:"pdf-to-word",               category:"pdf",      badge:"🆕 New"  },
  { icon:"📄", name:"Word to PDF",                slug:"word-to-pdf",               category:"pdf",      badge:"🆕 New"  },
  // AI (2)
  { icon:"✓",  name:"Grammar Checker",            slug:"grammar-checker",           category:"ai",       badge:"🆕 New"  },
  { icon:"📊", name:"Readability Checker",        slug:"readability-checker",       category:"ai",       badge:"🆕 New"  },
];

const FEATURED = [
  "word-counter", "json-formatter", "image-compressor", "meta-tag-generator",
  "pdf-compressor", "grammar-checker", "image-to-text", "qr-code-generator",
  "ssl-checker", "password-generator", "regex-tester", "readability-checker",
  // Added 6 Jul 2026 — highest-demand tools that had no homepage link at all.
  "tip-calculator", "compound-interest-calculator",
].map(slug => ALL_TOOLS.find(t => t.slug === slug)!).filter(Boolean);

// No .slice() cap — every newly launched tool gets a homepage link.
// The old slice(0,8) silently hid grammar-checker + readability-checker.
const NEW_TOOLS = ALL_TOOLS.filter(t => t.badge === "🆕 New");

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

const NAV_LINKS = [
  { href:"/categories/text",     label:"Text"      },
  { href:"/categories/image",    label:"Image"     },
  { href:"/categories/dev",      label:"Dev"       },
  { href:"/categories/seo",      label:"SEO"       },
  { href:"/categories/pdf",      label:"PDF"       },
  { href:"/categories/finance",  label:"Finance"   },
  { href:"/categories/security", label:"Security"  },
  { href:"/categories/ai",       label:"AI"        },
  { href:"/tools",              label:"All 51 Tools", highlight: true },
  { href:"/blog",               label:"Blog"      },
  { href:"/about",              label:"About"     },
  { href:"/contact",            label:"Contact"   },
];

// ─── Social Icons ─────────────────────────────────────────────────────────────

function LinkedInIcon()  { return <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M4.98 3.5C4.98 4.881 3.87 6 2.5 6S0 4.881 0 3.5C0 2.12 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM5 8H0v16h5V8zm7.982 0H8.014v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0V24H24V13.869c0-7.88-8.922-7.593-11.018-3.714V8z"/></svg>; }
function InstagramIcon() { return <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>; }
function YouTubeIcon()   { return <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>; }
function FacebookIcon()  { return <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>; }

const SOCIAL_LINKS = [
  { name:"LinkedIn",  href:"https://www.linkedin.com/company/purstech",   Icon: LinkedInIcon,  brand:"hover:text-[#0A66C2]" },
  { name:"Instagram", href:"https://www.instagram.com/purstech",          Icon: InstagramIcon, brand:"hover:text-[#E4405F]" },
  { name:"YouTube",   href:"https://www.youtube.com/@PursTech",           Icon: YouTubeIcon,   brand:"hover:text-[#FF0000]" },
  { name:"Facebook",  href:"https://www.facebook.com/share/1R3Q9JZ7ks/",  Icon: FacebookIcon,  brand:"hover:text-[#1877F2]" },
];

const AUDIENCES = [
  { icon:"💻", title:"Developers",   desc:"JSON formatting, regex testing, hashing, code minification, SVG editing, QR codes, base64 and markdown editing." },
  { icon:"✍️", title:"Writers",      desc:"Grammar checking, readability scoring, word counting, lorem ipsum and side-by-side diff comparison." },
  { icon:"📈", title:"SEO Pros",     desc:"Meta tag generation, XML sitemaps, robots.txt, Open Graph previews and keyword density analysis." },
  { icon:"🎓", title:"Students",     desc:"PDF compress/merge/split, age and percentage calculators, OCR text extraction and text-to-speech." },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen ? "bg-[#0A0A14]/98 backdrop-blur-md shadow-lg shadow-violet-900/20" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <span className="text-2xl font-black text-white tracking-tight">Purs<span className="text-[#6C3AFF]">Tech</span></span>
            <span className="text-[10px] bg-[#6C3AFF]/20 text-[#6C3AFF] px-2 py-0.5 rounded-full font-bold border border-[#6C3AFF]/30 flex-shrink-0">51 Tools</span>
          </Link>

          <div className="hidden md:flex items-center gap-5 text-sm text-gray-400 font-medium">
            {NAV_LINKS.filter(l => !l.highlight).map(l => (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
            ))}
            <Link href="/tools" className="text-[#6C3AFF] hover:text-white transition-colors font-bold flex-shrink-0">All 51 Tools</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/pro" className="hidden md:block px-4 py-2 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all duration-300 shadow-lg shadow-violet-900/30 flex-shrink-0">Go Pro ⚡</Link>

            <button onClick={() => setMobileOpen(p => !p)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl bg-[#13131F] border border-white/10 gap-1.5 transition-all hover:border-[#6C3AFF]/40 flex-shrink-0">
              <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="bg-[#0A0A14]/98 border-t border-white/5 px-4 pt-4 pb-6 min-w-0 w-full">
            <div className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Browse by category</div>
            <div className="grid grid-cols-2 gap-2 mb-5 min-w-0 w-full">
              {CATEGORIES.map(c => (
                <Link key={c.slug} href={`/categories/${c.slug}`} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 transition-all group min-w-0 w-full">
                  <span className="text-lg flex-shrink-0">{c.icon}</span>
                  <div className="min-w-0 w-full">
                    <div className="text-white text-xs font-bold group-hover:text-[#00D4FF] transition-colors truncate">{c.name}</div>
                    <div className="text-gray-600 text-xs truncate">{c.count} tools</div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="space-y-1 mb-5 min-w-0 w-full">
              {[
                { href:"/tools",   label:"🔧  Browse All 51 Tools",  special: true  },
                { href:"/blog",    label:"📖  Blog"                                  },
                { href:"/about",   label:"ℹ️   About PursTech"                       },
                { href:"/contact", label:"✉️   Contact"                              },
              ].map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all min-w-0 ${
                    l.special ? "bg-[#6C3AFF]/10 border border-[#6C3AFF]/30 text-[#6C3AFF] hover:bg-[#6C3AFF]/20" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}><span className="truncate">{l.label}</span></Link>
              ))}
            </div>

            <Link href="/pro" className="flex items-center justify-center w-full py-3.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-extrabold text-sm transition-all duration-300 shadow-lg shadow-violet-900/30 truncate px-2">
              ⚡ Go Pro — $7/month · Cancel anytime
            </Link>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  const [query,       setQuery]       = useState("");
  const [results,     setResults]     = useState<typeof ALL_TOOLS>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim().length > 1) {
      setResults(ALL_TOOLS.filter(t =>
        t.name.toLowerCase().includes(q.toLowerCase()) ||
        t.category.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 6));
      setShowResults(true);
    } else { setShowResults(false); }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden w-full">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10   rounded-full blur-3xl pointer-events-none" />

      {/* Mobile fix (15 Jul 2026): the pill used to size to its content with no
          max-width, so on narrow screens its rounded ends ran off both edges and
          `truncate` chopped the text mid-word. Now it is capped to the viewport,
          scales its type down, and wraps to two lines gracefully on tiny screens
          (rounded-2xl reads as intentional there; rounded-full returns at sm+). */}
      <div className="mb-6 mx-auto max-w-[calc(100vw-2rem)] flex flex-wrap items-center justify-center gap-x-2 gap-y-1 bg-[#13131F] border border-[#6C3AFF]/30 rounded-2xl sm:rounded-full px-4 sm:px-5 py-2 text-[11px] sm:text-sm">
        <span className="flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
          <span className="text-white font-bold">51 free tools</span>
        </span>
        <span className="text-gray-600" aria-hidden="true">·</span>
        <span className="text-gray-400">8 categories</span>
        <span className="text-gray-600" aria-hidden="true">·</span>
        <span className="text-gray-400">100% browser-based</span>
      </div>

      <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white text-center max-w-5xl leading-tight w-full px-2">
        Stop Searching.{" "}<br className="hidden md:block" />
        <span className="bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] bg-clip-text text-transparent">Start Doing.</span>
      </h1>

      <p className="mt-6 text-lg md:text-xl text-gray-400 text-center max-w-2xl leading-relaxed px-4 w-full">
        <span className="text-white font-semibold">51 free tools</span> across 8 categories —
        text, image, dev, SEO, PDF, finance, security and AI. No login. No limits.
      </p>

      <div className="mt-10 w-full max-w-xl relative px-4 sm:px-0 min-w-0">
        <div className="flex items-center gap-3 bg-[#13131F] border border-[#6C3AFF]/30 rounded-2xl px-5 py-4 focus-within:border-[#00D4FF]/60 transition-all min-w-0 w-full">
          <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={query} onChange={e => handleSearch(e.target.value)}
            onBlur={() => setTimeout(() => setShowResults(false), 150)}
            placeholder="Search 51 tools — grammar checker, pdf compressor…"
            className="flex-1 min-w-0 bg-transparent text-white placeholder-gray-600 focus:outline-none text-sm truncate" />
          {query && (
            <button onClick={() => { setQuery(""); setShowResults(false); }} className="text-gray-600 hover:text-white flex-shrink-0">✕</button>
          )}
        </div>
        {showResults && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#13131F] border border-white/10 rounded-2xl overflow-hidden z-30 shadow-2xl min-w-0 w-full">
            {results.map(t => (
              <Link key={t.slug} href={`/tools/${t.slug}`}
                className="flex items-center gap-3 px-5 py-3 hover:bg-[#6C3AFF]/10 transition-colors border-b border-white/5 last:border-0 min-w-0 w-full">
                <span className="text-xl flex-shrink-0">{t.icon}</span>
                <div className="min-w-0 w-full">
                  <div className="text-white text-sm font-semibold truncate pr-2">{t.name}</div>
                  <div className="text-gray-500 text-xs capitalize truncate">{t.category} tools</div>
                </div>
                {t.badge && <span className="ml-auto text-xs text-[#6C3AFF] font-bold flex-shrink-0">{t.badge}</span>}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ✅ MOBILE-SAFE CATEGORY CHIPS */}
      <div className="mt-6 flex gap-2 w-full max-w-2xl px-4 overflow-x-auto scrollbar-hide snap-x sm:flex-wrap sm:justify-center">
        {CATEGORIES.map(c => (
          <Link key={c.slug} href={`/categories/${c.slug}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 text-gray-400 hover:text-white text-xs font-semibold transition-all flex-shrink-0 snap-center">
            <span className="flex-shrink-0">{c.icon}</span><span className="truncate">{c.name.split(" ")[0]}</span><span className="text-gray-700 flex-shrink-0">{c.count}</span>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center min-w-0 w-full px-4">
        {[
          { value:"50",   label:"Free Tools",   sub:"across 8 categories" },
          { value:"100%", label:"Free Forever", sub:"no sign-up required" },
          { value:"∞",    label:"No Limits",    sub:"unlimited daily use"  },
        ].map(s => (
          <div key={s.label} className="min-w-0">
            <div className="text-3xl md:text-4xl font-black text-white truncate">{s.value}</div>
            <div className="text-sm font-bold text-[#6C3AFF] mt-1 truncate">{s.label}</div>
            <div className="text-xs text-gray-600 mt-0.5 truncate">{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Trending bar ─────────────────────────────────────────────────────────────

function TrendingBar() {
  return (
    <div className="border-y border-white/5 bg-[#0D0D1A] py-3 overflow-hidden min-w-0 w-full">
      <div className="flex items-center w-full">
        {/* Label sits above the marquee on its own solid background so names
            slide underneath it cleanly instead of colliding. */}
        <span className="relative z-10 flex-shrink-0 bg-[#0D0D1A] text-[10px] sm:text-xs font-bold text-[#FF3A6C] pl-4 pr-2 sm:px-4 uppercase tracking-widest">🔥 Browse</span>
        {/* Mobile fix (15 Jul 2026): the strip ran edge-to-edge and names were
            sliced mid-word at both ends — it read as broken rather than moving.
            A mask fades items in/out at the edges at every screen size. */}
        <div
          className="overflow-hidden flex-1 min-w-0"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0, #000 24px, #000 calc(100% - 48px), transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, #000 24px, #000 calc(100% - 48px), transparent 100%)",
          }}
        >
          {/* Each tool name is a real <Link> (was an unclickable span) — this
              gives all 51 tools a homepage internal link, the documented fix for
              "Discovered – currently not indexed". (6 Jul 2026)

              Two equal-width groups. Each carries its own internal gap AND a
              trailing pad, so each group is exactly half the track — which makes
              translateX(-50%) land perfectly and the loop seamless. (Putting a
              gap between the groups instead would leave a half-gap jump.)
              Animation comes from .purs-marquee in globals.css, not from a
              Tailwind arbitrary class, so it cannot silently break again. */}
          <div className="purs-marquee flex whitespace-nowrap">
            <div className="flex gap-6 sm:gap-8 pr-6 sm:pr-8 flex-shrink-0">
              {ALL_TOOLS.map(t => (
                <Link key={t.slug} href={`/tools/${t.slug}`}
                  className="text-[11px] sm:text-xs text-gray-500 hover:text-[#00D4FF] transition-colors flex-shrink-0">
                  {t.icon} {t.name}
                </Link>
              ))}
            </div>
            {/* Visual loop copy — aria-hidden and not links, so we don't emit
                50 duplicate hrefs for Google. */}
            <div className="flex gap-6 sm:gap-8 pr-6 sm:pr-8 flex-shrink-0" aria-hidden="true">
              {ALL_TOOLS.map(t => (
                <span key={`loop-${t.slug}`}
                  className="text-[11px] sm:text-xs text-gray-500 cursor-default flex-shrink-0">
                  {t.icon} {t.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Category grid ────────────────────────────────────────────────────────────

function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 min-w-0 w-full">
      <div className="text-center mb-10 min-w-0 w-full">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">8 Categories. 51 Tools. All Free.</h2>
        <p className="text-gray-500 max-w-xl mx-auto leading-relaxed px-4">Every tool is completely free — no account, no daily limits, no watermarks.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 min-w-0 w-full">
        {CATEGORIES.map(c => (
          <Link key={c.slug} href={`/categories/${c.slug}`}
            className="group relative bg-[#13131F] border border-white/5 rounded-2xl p-5 hover:border-[#6C3AFF]/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden min-w-0 w-full">
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity bg-gradient-to-br ${c.color}`} />
            <div className="text-3xl mb-3 flex-shrink-0">{c.icon}</div>
            <div className="font-extrabold text-white text-sm mb-1 truncate pr-1">{c.name}</div>
            <div className="text-xs text-gray-500 mb-3 leading-relaxed w-full whitespace-normal">{c.desc}</div>
            <div className={`inline-flex items-center gap-1 text-xs font-bold bg-gradient-to-r ${c.color} bg-clip-text text-transparent flex-shrink-0`}>{c.count} tools →</div>
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
    <section className="max-w-7xl mx-auto px-4 py-10 min-w-0 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 min-w-0 w-full">
        <div className="min-w-0">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white truncate">Most Used Tools</h2>
          <p className="text-gray-500 text-sm mt-1 truncate">Handpicked from 51 tools across all categories</p>
        </div>
        <div className="flex overflow-x-auto sm:flex-wrap gap-2 pb-2 sm:pb-0 scrollbar-hide min-w-0 w-full sm:w-auto">
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all border flex-shrink-0 ${filter === c ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#13131F] border-white/5 text-gray-400 hover:text-white"}`}>
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 min-w-0 w-full">
        {filtered.map(t => (
          <Link key={t.slug} href={`/tools/${t.slug}`}
            className="group bg-[#13131F] border border-white/5 rounded-2xl p-4 hover:border-[#6C3AFF]/40 transition-all duration-300 hover:-translate-y-0.5 min-w-0 w-full">
            <div className="flex items-start justify-between mb-3 gap-2 min-w-0 w-full">
              <span className="text-2xl flex-shrink-0">{t.icon}</span>
              {t.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  t.badge === "⭐ Top" ? "bg-violet-500/20 text-violet-400" :
                  t.badge === "🔥 Hot" ? "bg-orange-500/20 text-orange-400" :
                  t.badge === "🆕 New" ? "bg-cyan-500/20 text-cyan-400" : "bg-gray-500/20 text-gray-400"
                }`}>{t.badge}</span>
              )}
            </div>
            <div className="font-bold text-white text-sm mb-1 group-hover:text-[#00D4FF] transition-colors leading-snug truncate w-full pr-1">{t.name}</div>
            <div className="text-xs text-gray-600 capitalize truncate w-full">{t.category} tools</div>
          </Link>
        ))}
      </div>
      <div className="text-center mt-8 min-w-0 w-full">
        <Link href="/tools" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#13131F] border border-[#6C3AFF]/30 hover:border-[#6C3AFF]/60 text-white font-bold transition-all hover:-translate-y-0.5 max-w-full truncate">
          Browse all 51 tools →
        </Link>
      </div>
    </section>
  );
}

// ─── New This Month ───────────────────────────────────────────────────────────

function NewToolsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10 min-w-0 w-full">
      <div className="bg-gradient-to-br from-[#13131F] to-[#0d0d1a] border border-[#6C3AFF]/20 rounded-3xl p-8 relative overflow-hidden min-w-0 w-full">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6C3AFF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00D4FF]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 min-w-0 w-full">
          <div className="min-w-0 w-full">
            <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/20 border border-[#6C3AFF]/30 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-bold mb-2 flex-shrink-0">🆕 Just Launched</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white truncate pr-2 w-full">New Tools This Month</h2>
            <p className="text-gray-500 text-sm mt-1 truncate w-full">PDF suite, SSL checker, IP lookup, grammar checker, SVG editor and more</p>
          </div>
          <Link href="/tools" className="text-sm text-[#00D4FF] hover:text-white transition-colors font-semibold flex-shrink-0 whitespace-nowrap">See all new tools →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 min-w-0 w-full">
          {NEW_TOOLS.map(t => (
            <Link key={t.slug} href={`/tools/${t.slug}`}
              className="group flex items-center gap-3 bg-[#0A0A14]/60 border border-white/5 hover:border-[#6C3AFF]/40 rounded-xl px-3 py-2.5 transition-all min-w-0 w-full">
              <span className="text-xl flex-shrink-0">{t.icon}</span>
              <div className="min-w-0 w-full">
                <div className="text-white text-xs font-bold group-hover:text-[#00D4FF] transition-colors leading-snug truncate w-full pr-1">{t.name}</div>
                <div className="text-gray-600 text-xs capitalize truncate w-full">{t.category}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-5 min-w-0 w-full">
          {[
            { label:"5 PDF Tools — compress, merge, split, convert", color:"text-orange-400 bg-orange-400/10 border-orange-400/20" },
            { label:"2 AI Tools — grammar & readability",            color:"text-pink-400 bg-pink-400/10 border-pink-400/20" },
            { label:"2 Security Tools — SSL checker & IP lookup",    color:"text-red-400 bg-red-400/10 border-red-400/20" },
            { label:"SVG Editor with React export",                  color:"text-blue-400 bg-blue-400/10 border-blue-400/20" },
          ].map(b => (
            <span key={b.label} className={`text-xs font-semibold px-3 py-1 rounded-full border truncate max-w-full ${b.color}`}>✓ {b.label}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why PursTech ─────────────────────────────────────────────────────────────

function WhySection() {
  const points = [
    { icon:"⚡", title:"Instant results",   desc:"Every tool runs in your browser. No upload wait, no processing queue — results appear as you type." },
    { icon:"🔒", title:"Private by design", desc:"Your files never touch our servers. PDF compression, OCR, image editing — all 100% client-side." },
    { icon:"🌍", title:"Works everywhere",  desc:"Any browser, any device. No app install, no account, no extension required." },
    { icon:"♾️", title:"Unlimited & free",  desc:"Every tool is free with no daily limits, no watermarks and no login wall — ever." },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 py-14 min-w-0 w-full">
      <div className="text-center mb-10 min-w-0 w-full px-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 leading-snug">Why developers, writers and SEO pros choose PursTech</h2>
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">Built differently from typical "free tool" sites — no upsell tricks, no email walls, no daily caps.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 min-w-0 w-full">
        {points.map(p => (
          <div key={p.title} className="bg-[#13131F] border border-white/5 rounded-2xl p-6 min-w-0 w-full">
            <div className="text-3xl mb-4 flex-shrink-0">{p.icon}</div>
            <div className="font-extrabold text-white text-base mb-2 truncate pr-1">{p.title}</div>
            <div className="text-gray-500 text-sm leading-relaxed whitespace-normal break-words">{p.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Built For (rich content for AdSense) ─────────────────────────────────────
// ✅ MOBILE ARMOR APPLIED

function BuiltForSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-14 min-w-0 w-full">
      <div className="text-center mb-10 min-w-0 w-full px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Built for Real Work</h2>
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">PursTech tools are designed for the day-to-day workflows of four specific audiences. Pick your role to see what we built for you.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0 w-full">
        {AUDIENCES.map(a => (
          <div key={a.title} className="bg-[#13131F] border border-white/5 rounded-2xl p-6 hover:border-[#6C3AFF]/40 transition-all min-w-0 w-full">
            <div className="text-3xl mb-3 flex-shrink-0">{a.icon}</div>
            <div className="font-extrabold text-white text-base mb-2 truncate pr-1">{a.title}</div>
            <div className="text-gray-500 text-sm leading-relaxed whitespace-normal break-words">{a.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── SEO / LLM content section ───────────────────────────────────────────────

function SEOSection() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-14 min-w-0 w-full">
      <div className="bg-[#13131F] border border-white/5 rounded-3xl p-8 md:p-10 min-w-0 w-full">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">What is PursTech?</h2>
        <p className="text-gray-400 leading-relaxed mb-6 w-full">
          PursTech is a free online tool platform offering <strong className="text-white">51 browser-based tools</strong> across
          8 categories — no account required, no daily limits, no pop-ups, and no intrusive ads. Every tool runs entirely in your browser, meaning your
          files and data never leave your device.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-w-0 w-full">
          {[
            { cat:"📄 PDF Tools",        tools:["PDF Compressor","PDF Merger","PDF Splitter","PDF to Word","Word to PDF"] },
            { cat:"🖼️ Image Tools",      tools:["Image Compressor","Image Resizer","Background Remover","Favicon Generator","Image to Text (OCR)"] },
            { cat:"💻 Developer Tools",  tools:["JSON Formatter","Regex Tester","SVG Editor","Markdown Editor","Base64 Encoder","QR Code Generator"] },
            { cat:"📊 SEO Tools",        tools:["Meta Tag Generator","Sitemap Generator","Open Graph Generator","Robots.txt Generator","Keyword Density Checker"] },
            { cat:"🤖 AI Writing Tools", tools:["Grammar Checker","Readability Checker"] },
            { cat:"🔒 Security Tools",   tools:["Password Generator","SSL Certificate Checker","IP Address Lookup"] },
            { cat:"💰 Finance Tools",    tools:["Loan Calculator","Mortgage Calculator","Compound Interest Calculator","Currency Converter","Tip Calculator"] },
            { cat:"📝 Text Tools",       tools:["Word Counter","Case Converter","Diff Checker","Lorem Ipsum Generator","Text to Speech"] },
          ].map(({ cat, tools }) => (
            <div key={cat} className="min-w-0 w-full">
              <div className="text-xs font-bold text-[#6C3AFF] uppercase tracking-wider mb-2 truncate pr-2">{cat}</div>
              <ul className="space-y-1 min-w-0 w-full">
                {tools.map(t => (
                  <li key={t} className="text-xs text-gray-500 flex items-center gap-1.5 min-w-0 w-full">
                    <span className="w-1 h-1 rounded-full bg-gray-700 flex-shrink-0" />
                    <span className="truncate">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-500 min-w-0 w-full">
          <div className="leading-relaxed"><span className="text-white font-bold">Free forever</span> — every tool on PursTech is and will remain free. No freemium bait-and-switch.</div>
          <div className="leading-relaxed"><span className="text-white font-bold">Private by design</span> — PDF compression, image editing and OCR all run in your browser. Zero server uploads.</div>
          <div className="leading-relaxed"><span className="text-white font-bold">No account required</span> — open any tool and start working immediately. No sign-up, no email verification, no paywall.</div>
        </div>
      </div>
    </section>
  );
}

// ─── Pro banner ───────────────────────────────────────────────────────────────

function ProBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-14 min-w-0 w-full">
      <div className="relative bg-gradient-to-br from-[#1a0a2e] via-[#13131F] to-[#0a1a2e] border border-[#6C3AFF]/30 rounded-3xl p-10 text-center overflow-hidden min-w-0 w-full">
        <div className="absolute inset-0 bg-[#6C3AFF]/5 rounded-3xl" />
        <div className="relative min-w-0 w-full px-2">
          <span className="inline-block bg-[#6C3AFF]/20 text-[#6C3AFF] text-xs font-bold px-4 py-1.5 rounded-full border border-[#6C3AFF]/30 mb-4 flex-shrink-0">⚡ PursTech Pro</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">Unlock the Full Power</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8 leading-relaxed">Remove all limits, remove all ads, and get priority AI processing — for less than a coffee a week.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm min-w-0 w-full">
            {["✓ Unlimited usage","✓ Zero ads","✓ Priority AI","✓ API access","✓ Batch processing","✓ Early access"].map(f => (
              <span key={f} className="text-gray-300 flex-shrink-0">{f}</span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 min-w-0 w-full">
            <Link href="/pro" className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-extrabold text-lg transition-all duration-300 shadow-lg shadow-violet-900/50 truncate">
              Get Pro — $7/month
            </Link>
            <span className="text-gray-500 text-sm flex-shrink-0">Cancel anytime. No hidden fees.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Follow Us ────────────────────────────────────────────────────────────────

function FollowUsSection() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-14 text-center min-w-0 w-full">
      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Stay Connected</h2>
      <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto leading-relaxed px-2">
        Follow PursTech for new tool launches, behind-the-scenes builds and free dev tips. Pick your favourite platform.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 min-w-0 w-full">
        {SOCIAL_LINKS.map(s => (
          <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 text-gray-400 hover:text-white text-sm font-semibold transition-all min-w-0 w-full ${s.brand}`}>
            <span className="flex-shrink-0"><s.Icon /></span>
            <span className="truncate">{s.name}</span>
          </a>
        ))}
      </div>
      <p className="text-gray-700 text-xs mt-8 px-4">
        Or read our <Link href="/blog" className="text-[#6C3AFF] hover:text-white transition-colors">blog</Link> for deep-dives and how-to guides.
      </p>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

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
      { name:"All 51 Tools",href:"/tools"    },
      { name:"Blog",        href:"/blog"     },
      { name:"Go Pro ⚡",   href:"/pro"      },
      { name:"Contact",     href:"/contact"  },
      { name:"Privacy",     href:"/privacy"  },
      { name:"Terms",       href:"/terms"    },
      { name:"Disclaimer",  href:"/disclaimer" },
    ],
  };

  return (
    <footer className="border-t border-white/5 mt-8 min-w-0 w-full">
      <div className="max-w-7xl mx-auto px-4 py-14 min-w-0 w-full">

        <div className="flex flex-wrap justify-center gap-3 mb-12 min-w-0 w-full">
          {SOCIAL_LINKS.map(s => (
            <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name}
              className={`w-10 h-10 flex items-center justify-center rounded-xl bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 text-gray-500 transition-all flex-shrink-0 ${s.brand}`}>
              <s.Icon />
            </a>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12 min-w-0 w-full">
          {Object.entries(cols).map(([section, links]) => (
            <div key={section} className="min-w-0 w-full">
              <h3 className="text-white font-bold text-sm mb-4 truncate pr-2">{section}</h3>
              <ul className="space-y-2 min-w-0 w-full">
                {links.map(l => (
                  <li key={l.href} className="min-w-0 w-full">
                    <Link href={l.href} className="text-gray-600 hover:text-gray-400 text-xs transition-colors truncate block pr-2 w-full">{l.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 min-w-0 w-full">
          <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto justify-center sm:justify-start">
            <span className="text-xl font-black text-white flex-shrink-0">Purs<span className="text-[#6C3AFF]">Tech</span></span>
            <span className="text-gray-600 text-xs truncate">— Stop Searching. Start Doing.</span>
          </div>
          <div className="text-xs text-gray-600 text-center truncate pr-2">51 free tools · 8 categories · 0 sign-ups required</div>
          <div className="flex gap-5 text-xs text-gray-600 min-w-0 flex-shrink-0 justify-center">
            <Link href="/privacy"     className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link href="/terms"       className="hover:text-gray-400 transition-colors">Terms</Link>
            <Link href="/disclaimer"  className="hover:text-gray-400 transition-colors">Disclaimer</Link>
            <Link href="/sitemap.xml" className="hover:text-gray-400 transition-colors">Sitemap</Link>
          </div>
          <p className="text-gray-700 text-xs flex-shrink-0 text-center">© 2026 PursTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  { q:"Is PursTech really free?",
    a:"Yes, all 51 tools on PursTech are 100% free with no hidden costs. You can use every tool as many times as you want — no subscription, no trial period, no credit card required. PursTech is supported by non-intrusive advertising, which lets us keep all tools permanently free." },
  { q:"Do I need to create an account or log in?",
    a:"No. PursTech requires zero registration. Every tool works immediately without creating an account, providing an email address, or logging in. Just open the tool and start using it — no sign-up, no verification, no waiting." },
  { q:"Are my files and data kept private?",
    a:"Yes. All PursTech tools run entirely in your browser. Files are processed locally on your device and never uploaded to any server. We have no access to your files, documents, or the content you use in the tools. Everything stays on your device." },
  { q:"What tools does PursTech offer?",
    a:"PursTech offers 51 free tools across 8 categories: Text Tools (word counter, case converter, lorem ipsum, diff checker), Developer Tools (JSON formatter, regex tester, base64 encoder, SVG editor, QR code generator), Image Tools (image compressor, background remover, image resizer, OCR), SEO Tools (meta tag generator, robots.txt generator, sitemap generator), PDF Tools (compress, merge, split, convert), Finance Tools (loan, mortgage, currency converters), Security Tools (password generator, SSL checker, IP lookup), and AI Tools (grammar checker, readability checker)." },
  { q:"Do the tools work on mobile phones?",
    a:"Yes. All PursTech tools are fully mobile-responsive and work on smartphones and tablets. You can compress images, format JSON, check grammar, and use all 51 tools directly from your phone's browser without downloading any app." },
  { q:"Is there a usage limit?",
    a:"No usage limits for free users. All 51 tools are unlimited. A Pro plan is coming soon for power users needing batch processing and API access, but all core tools will always remain completely free for everyone." },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomeClient() {
  useTrackTool("home", "landing"); 

  return (
    <main className="min-h-screen bg-[#0A0A14] font-sans selection:bg-[#6C3AFF]/30 flex flex-col overflow-x-hidden w-full">
      <Navbar />
      <HeroSection />
      <TrendingBar />
      <CategoryGrid />
      <FeaturedTools />
      <NewToolsSection />
      <WhySection />
      <BuiltForSection />
      <SEOSection />
      <ProBanner />
      <FollowUsSection />

      {/* ── FAQ — ✅ Rule 8: <details>/<summary> ── */}
      <section className="max-w-3xl mx-auto px-4 py-14 min-w-0 w-full">
        <div className="text-center mb-12 min-w-0 w-full px-2">
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">Frequently Asked Questions</h2>
          <p className="text-gray-500 text-lg">Everything you need to know about PursTech</p>
        </div>
        <div className="space-y-4 min-w-0 w-full">
          {FAQ_ITEMS.map((item, i) => (
            <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/30 transition-all min-w-0 w-full">
              <summary className="px-6 py-5 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none min-w-0 w-full">
                <span className="min-w-0 pr-4">{item.q}</span>
                <span className="text-[#6C3AFF] text-xl font-bold flex-shrink-0 transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{item.a}</div>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
