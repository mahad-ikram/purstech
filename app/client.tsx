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
  { href:"/contact",            label:"Contact"   }, // ✅ PATCH 1 APPLIED
];

function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
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
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <span className="text-2xl font-black text-white tracking-tight">
              Purs<span className="text-[#6C3AFF]">Tech</span>
            </span>
            <span className="text-[10px] bg-[#6C3AFF]/20 text-[#6C3AFF] px-2 py-0.5 rounded-full font-bold border border-[#6C3AFF]/30">
              50 Tools
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-5 text-sm text-gray-400 font-medium">
            {NAV_LINKS.filter(l => !l.highlight).map(l => (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
            ))}
            <Link href="/tools" className="text-[#6C3AFF] hover:text-white transition-colors font-bold">
              All 50 Tools
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* ✅ PATCH 2 APPLIED: Changed to Link href="/pro" */}
            <Link href="/pro" className="hidden md:block px-4 py-2 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all duration-300 shadow-lg shadow-violet-900/30">
              Go Pro ⚡
            </Link>

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

        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}>
          <div className="bg-[#0A0A14]/98 border-t border-white/5 px-4 pt-4 pb-6">
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

            <Link href="/pro" className="flex items-center justify-center w-full py-3.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-extrabold text-sm transition-all duration-300 shadow-lg shadow-violet-900/30">
              ⚡ Go Pro — $7/month · Cancel anytime
            </Link>
          </div>
        </div>
      </nav>

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
            <button onClick={() => { setQuery(""); setShowResults(false); }} className="text-gray-600 hover:text-white transition-colors">
              ✕
            </button>
          )}
        </div>
        
        {/* Search Results Dropdown */}
        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#13131F] border border-[#6C3AFF]/30 rounded-2xl overflow-hidden shadow-2xl z-50">
            {results.length > 0 ? (
              results.map(t => (
                <Link key={t.slug} href={`/tools/${t.slug}`} className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                  <span className="text-xl">{t.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-bold text-white">{t.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{t.category}</div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-5 py-4 text-sm text-gray-500 text-center">No tools found matching "{query}"</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── FAQ Component ─────────────────────────────────────────────────────────────
// ✅ PATCH 3 APPLIED: Added the FAQItem component

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/[0.02] transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-white text-sm pr-4">{question}</span>
        <span className={
          `text-[#6C3AFF] text-xl font-bold flex-shrink-0 transition-transform duration-200 ${open ? "rotate-45" : ""}`
        }>+</span>
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-gray-400 text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────
// ✅ PATCH 4 APPLIED: Renamed export to HomeClient 

export default function HomeClient() {
  return (
    <div className="min-h-screen bg-[#0A0A14] text-white selection:bg-[#6C3AFF]/30">
      <Navbar />
      
      <main>
        <HeroSection />

        {/* ── FAQ Section — matches FAQPage schema in page.tsx ───────────────── */}
        <section className="py-20 px-4 bg-[#0A0A14]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-500 text-lg">
                Everything you need to know about PursTech
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Is PursTech really free?",
                  a: "Yes, all 50 tools on PursTech are 100% free with no hidden costs. You can use every tool as many times as you want — no subscription, no trial period, no credit card required. PursTech is supported by non-intrusive advertising, which lets us keep all tools permanently free.",
                },
                {
                  q: "Do I need to create an account or log in?",
                  a: "No. PursTech requires zero registration. Every tool works immediately without creating an account, providing an email address, or logging in. Just open the tool and start using it — no sign-up, no verification, no waiting.",
                },
                {
                  q: "Are my files and data kept private?",
                  a: "Yes. All PursTech tools run entirely in your browser. Files are processed locally on your device and never uploaded to any server. We have no access to your files, documents, or the content you use in the tools. Everything stays on your device.",
                },
                {
                  q: "What tools does PursTech offer?",
                  a: "PursTech offers 50 free tools across 8 categories: Text Tools (word counter, case converter, lorem ipsum, diff checker), Developer Tools (JSON formatter, regex tester, base64 encoder, SVG editor, QR code generator), Image Tools (image compressor, background remover, image resizer, OCR), SEO Tools (meta tag generator, robots.txt generator, sitemap generator), PDF Tools (compress, merge, split, convert), Finance Tools (loan, mortgage, currency converters), Security Tools (password generator, SSL checker, IP lookup), and AI Tools (grammar checker, readability checker).",
                },
                {
                  q: "Do the tools work on mobile phones?",
                  a: "Yes. All PursTech tools are fully mobile-responsive and work on smartphones and tablets. You can compress images, format JSON, check grammar, and use all 50 tools directly from your phone's browser without downloading any app.",
                },
                {
                  q: "Is there a usage limit?",
                  a: "No usage limits for free users. All 50 tools are unlimited. A Pro plan is coming soon for power users needing batch processing and API access, but all core tools will always remain completely free for everyone.",
                },
              ].map((item, i) => (
                <FAQItem key={i} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center bg-[#0A0A14]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
          <Link href="/" className="text-2xl font-black text-white tracking-tight">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </Link>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <p className="text-xs text-gray-600 mt-4">© 2026 PursTech. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
