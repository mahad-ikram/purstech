"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ─── All live tools (must match actual folder names in src/app/tools/) ────────

const ALL_TOOLS = [
  // Text
  { icon:"📝", name:"Word Counter",         slug:"word-counter",         category:"text",     uses:"1.8M", badge:"⭐ Top"  },
  { icon:"🔤", name:"Case Converter",        slug:"case-converter",       category:"text",     uses:"310K", badge:""        },
  { icon:"📄", name:"Lorem Ipsum Generator", slug:"lorem-ipsum",          category:"text",     uses:"250K", badge:""        },
  { icon:"🔍", name:"Diff Checker",          slug:"diff-checker",         category:"text",     uses:"290K", badge:""        },
  { icon:"🔊", name:"Text to Speech",        slug:"text-to-speech",       category:"text",     uses:"380K", badge:""        },
  // Dev
  { icon:"💻", name:"JSON Formatter",        slug:"json-formatter",       category:"dev",      uses:"1.5M", badge:"⭐ Top"  },
  { icon:"🔐", name:"Base64 Encoder",        slug:"base64-encoder",       category:"dev",      uses:"680K", badge:""        },
  { icon:"🔗", name:"URL Encoder",           slug:"url-encoder",          category:"dev",      uses:"590K", badge:""        },
  { icon:"🎲", name:"UUID Generator",        slug:"uuid-generator",       category:"dev",      uses:"510K", badge:""        },
  { icon:"🔲", name:"QR Code Generator",     slug:"qr-code-generator",    category:"dev",      uses:"650K", badge:"🆕 New"  },
  { icon:"🔑", name:"Hash Generator",        slug:"hash-generator",       category:"dev",      uses:"310K", badge:""        },
  { icon:"🎨", name:"CSS Minifier",          slug:"css-minifier",         category:"dev",      uses:"260K", badge:""        },
  { icon:"🗜️", name:"HTML Minifier",         slug:"html-minifier",        category:"dev",      uses:"280K", badge:""        },
  // Image
  { icon:"🎨", name:"Color Picker",          slug:"color-picker",         category:"image",    uses:"490K", badge:""        },
  // Security
  { icon:"🔐", name:"Password Generator",    slug:"password-generator",   category:"security", uses:"980K", badge:"🆕 New"  },
  // Finance
  { icon:"🎂", name:"Age Calculator",        slug:"age-calculator",       category:"finance",  uses:"410K", badge:""        },
  { icon:"⚖️", name:"BMI Calculator",         slug:"bmi-calculator",       category:"finance",  uses:"360K", badge:""        },
  { icon:"🔢", name:"Percentage Calculator",  slug:"percentage-calculator",category:"finance",  uses:"480K", badge:""        },
  { icon:"📏", name:"Unit Converter",         slug:"unit-converter",       category:"finance",  uses:"320K", badge:""        },
  { icon:"💱", name:"Currency Converter",     slug:"currency-converter",   category:"finance",  uses:"390K", badge:""        },
];

const FEATURED = ALL_TOOLS.slice(0, 12);

const CATEGORIES = [
  { icon:"📝", name:"Text Tools",    slug:"text",     count: ALL_TOOLS.filter(t=>t.category==="text").length,     color:"from-violet-600 to-violet-400" },
  { icon:"🖼️", name:"Image Tools",   slug:"image",    count: ALL_TOOLS.filter(t=>t.category==="image").length,    color:"from-cyan-600 to-cyan-400"     },
  { icon:"💻", name:"Dev Tools",     slug:"dev",      count: ALL_TOOLS.filter(t=>t.category==="dev").length,      color:"from-blue-600 to-blue-400"     },
  { icon:"📊", name:"SEO Tools",     slug:"seo",      count: 0,                                                    color:"from-green-600 to-green-400"   },
  { icon:"🤖", name:"AI Tools",      slug:"ai",       count: 0,                                                    color:"from-pink-600 to-pink-400"     },
  { icon:"💰", name:"Finance Tools", slug:"finance",  count: ALL_TOOLS.filter(t=>t.category==="finance").length,  color:"from-yellow-600 to-yellow-400" },
  { icon:"🔒", name:"Security",      slug:"security", count: ALL_TOOLS.filter(t=>t.category==="security").length, color:"from-red-600 to-red-400"       },
  { icon:"📄", name:"PDF Tools",     slug:"pdf",      count: 0,                                                    color:"from-orange-600 to-orange-400" },
];

const TRENDING = ALL_TOOLS.map(t => t.name);

const ACTIVITIES = [
  { flag:"🇺🇸", location:"New York, USA",     tool:"Image Compressor",   time:"2s ago"  },
  { flag:"🇮🇳", location:"Mumbai, India",      tool:"JSON Formatter",     time:"5s ago"  },
  { flag:"🇬🇧", location:"London, UK",         tool:"Word Counter",       time:"8s ago"  },
  { flag:"🇩🇪", location:"Berlin, Germany",    tool:"PDF Compressor",     time:"12s ago" },
  { flag:"🇧🇷", location:"São Paulo, Brazil",  tool:"QR Code Generator",  time:"15s ago" },
  { flag:"🇵🇰", location:"Karachi, Pakistan",  tool:"Password Generator", time:"19s ago" },
  { flag:"🇦🇺", location:"Sydney, Australia",  tool:"Color Picker",       time:"23s ago" },
  { flag:"🇫🇷", location:"Paris, France",      tool:"Meta Tag Generator", time:"28s ago" },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0A0A14]/95 backdrop-blur-md shadow-lg shadow-violet-900/20" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-white tracking-tight">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </span>
          <span className="text-[10px] bg-[#6C3AFF]/30 text-[#6C3AFF] px-2 py-0.5 rounded-full font-bold border border-[#6C3AFF]/30">BETA</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400 font-medium">
          {CATEGORIES.slice(0, 4).map(cat => (
            <Link key={cat.slug} href={`/categories/${cat.slug}`} className="hover:text-white transition-colors">
              {cat.name.split(" ")[0]}
            </Link>
          ))}
          <Link href="/tools" className="hover:text-white transition-colors">All Tools</Link>
          <Link href="/blog"  className="hover:text-white transition-colors">Blog</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/tools" className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors">Browse</Link>
          <button className="px-4 py-2 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all duration-300 shadow-lg shadow-violet-900/30">
            Go Pro ⚡
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(1247839);
  const [results, setResults] = useState<typeof ALL_TOOLS>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setCount(c => c + Math.floor(Math.random() * 3) + 1), 2000);
    return () => clearInterval(id);
  }, []);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim().length > 1) {
      const filtered = ALL_TOOLS.filter(t =>
        t.name.toLowerCase().includes(q.toLowerCase()) ||
        t.category.toLowerCase().includes(q.toLowerCase())
      );
      setResults(filtered.slice(0, 6));
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

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
        The World&apos;s Largest Free Tool Ecosystem.{" "}
        <span className="text-white font-semibold">{ALL_TOOLS.length}+ tools</span>, powered by AI, built for everyone.
      </p>

      <div className="w-full max-w-2xl mt-10 relative">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text" value={query}
            onChange={e => handleSearch(e.target.value)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            placeholder={`Search ${ALL_TOOLS.length}+ tools… e.g. "compress image"`}
            className="flex-1 px-6 py-4 rounded-xl bg-[#13131F] border border-[#6C3AFF]/40 text-white placeholder-gray-500 focus:outline-none focus:border-[#00D4FF] focus:shadow-[0_0_20px_rgba(0,212,255,0.15)] transition-all text-base"
          />
          <Link href={`/tools${query ? `?search=${encodeURIComponent(query)}` : ""}`}
            className="px-8 py-4 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] transition-all duration-300 font-bold text-white shadow-lg shadow-violet-900/40 whitespace-nowrap text-center">
            🔍 Search
          </Link>
        </div>

        {/* Inline search results dropdown */}
        {showResults && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#13131F] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50">
            {results.map(tool => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#6C3AFF]/10 transition-colors">
                <span className="text-xl">{tool.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-white">{tool.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{tool.category}</div>
                </div>
                <span className="ml-auto text-xs text-gray-600">→</span>
              </Link>
            ))}
            <Link href={`/tools?search=${encodeURIComponent(query)}`}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#6C3AFF]/10 hover:bg-[#6C3AFF]/20 transition-colors text-[#6C3AFF] text-xs font-bold">
              See all results →
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-8 text-sm text-gray-500 font-semibold">
        {["✓ Free Forever","✓ No Login Required","✓ Instant Results","✓ AI-Powered","✓ Zero Ads on Tools"].map(b => (
          <span key={b}>{b}</span>
        ))}
      </div>
    </section>
  );
}

// ─── Trending bar ─────────────────────────────────────────────────────────────

function TrendingBar() {
  return (
    <div className="bg-[#13131F] border-y border-[#6C3AFF]/20 py-3 overflow-hidden">
      <div className="flex items-center">
        <div className="flex-shrink-0 flex items-center gap-2 px-4 border-r border-[#6C3AFF]/30 mr-4">
          <span className="w-2 h-2 bg-[#FF3A6C] rounded-full animate-pulse" />
          <span className="text-[#FF3A6C] font-bold text-xs uppercase tracking-widest whitespace-nowrap">Trending</span>
        </div>
        <div className="flex gap-8 animate-[scroll_30s_linear_infinite] whitespace-nowrap">
          {[...TRENDING, ...TRENDING].map((name, i) => {
            const tool = ALL_TOOLS.find(t => t.name === name);
            return tool ? (
              <Link key={i} href={`/tools/${tool.slug}`}
                className="text-gray-400 hover:text-[#00D4FF] transition-colors text-sm font-medium">
                {name}
              </Link>
            ) : (
              <span key={i} className="text-gray-400 text-sm font-medium">{name}</span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Live activity + stat pills ───────────────────────────────────────────────

function LiveActivity() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCurrent(c => (c + 1) % ACTIVITIES.length), 2500);
    return () => clearInterval(id);
  }, []);
  const act = ACTIVITIES[current];

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#6C3AFF]/10 rounded-full flex items-center justify-center border border-[#6C3AFF]/20">
            <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">
              <span className="text-white font-semibold">{act.flag} {act.location}</span>
              {" "}just used{" "}
              <span className="text-[#6C3AFF] font-semibold">{act.tool}</span>
            </p>
            <p className="text-gray-600 text-xs mt-0.5">{act.time}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { label:"Tools Live",     value:`${ALL_TOOLS.length}+`, color:"text-violet-400" },
            { label:"Uses Today",     value:"48,293",               color:"text-cyan-400"   },
            { label:"Countries",      value:"190+",                 color:"text-green-400"  },
            { label:"Avg Load Time",  value:"0.3s",                 color:"text-yellow-400" },
          ].map(s => (
            <div key={s.label} className="bg-[#0A0A14] rounded-xl px-4 py-2 text-center border border-white/5">
              <div className={`font-black text-lg ${s.color}`}>{s.value}</div>
              <div className="text-gray-600 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Category grid ────────────────────────────────────────────────────────────

function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Browse by Category</h2>
        <p className="text-gray-500 text-lg">
          Over <span className="text-[#6C3AFF] font-bold">{ALL_TOOLS.length} tools</span> across 8 categories — and growing every day
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {CATEGORIES.map(cat => (
          <Link key={cat.slug} href={`/categories/${cat.slug}`}
            className="group relative bg-[#13131F] border border-white/5 rounded-2xl p-5 hover:border-[#6C3AFF]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/20 overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            <div className="text-3xl mb-3">{cat.icon}</div>
            <div className="font-bold text-white text-sm mb-1">{cat.name}</div>
            <div className="text-xs text-gray-500">{cat.count > 0 ? `${cat.count} tools` : "Coming soon"}</div>
            <div className="absolute top-4 right-4 text-gray-700 group-hover:text-[#6C3AFF] transition-colors text-lg">→</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Featured tools ───────────────────────────────────────────────────────────

function FeaturedTools() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">🏆 Most Popular Tools</h2>
          <p className="text-gray-500">Used by millions worldwide, every single day</p>
        </div>
        <Link href="/tools" className="hidden md:flex items-center gap-1 text-[#6C3AFF] hover:text-[#00D4FF] font-semibold transition-colors text-sm">
          View all tools <span>→</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {FEATURED.map(tool => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`}
            className="group bg-[#13131F] border border-white/5 rounded-2xl p-5 hover:border-[#6C3AFF]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-900/20">
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{tool.icon}</span>
              {tool.badge && (
                <span className="text-[10px] bg-[#6C3AFF]/20 text-[#6C3AFF] px-2 py-0.5 rounded-full font-bold border border-[#6C3AFF]/20">
                  {tool.badge}
                </span>
              )}
            </div>
            <div className="font-bold text-white text-sm mb-1 group-hover:text-[#6C3AFF] transition-colors">
              {tool.name}
            </div>
            <div className="text-xs text-gray-600 capitalize">{tool.category}</div>
            <div className="mt-3 text-xs text-gray-500">
              <span className="text-green-400 font-semibold">{tool.uses}</span> uses
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link href="/tools"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#13131F] border border-[#6C3AFF]/30 hover:border-[#6C3AFF] text-white font-bold transition-all hover:shadow-lg hover:shadow-violet-900/20">
          View All {ALL_TOOLS.length}+ Tools →
        </Link>
      </div>
    </section>
  );
}

// ─── Pro banner ───────────────────────────────────────────────────────────────

function ProBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#6C3AFF] via-[#4B2CC0] to-[#00D4FF] p-px">
        <div className="bg-[#0D0D1A] rounded-3xl p-10 md:p-14 text-center">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/20 border border-[#6C3AFF]/30 rounded-full px-4 py-1.5 text-sm text-[#6C3AFF] font-bold mb-6">
            ⚡ PursTech Pro
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Unlock Everything.
            <br />
            <span className="bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] bg-clip-text text-transparent">
              Zero Limits.
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
            Remove all limits, remove all ads, and get priority AI processing — for less than a coffee a week.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm">
            {["✓ Unlimited tool usage","✓ Zero ads","✓ Priority AI processing","✓ API access","✓ Batch processing","✓ Early access to new tools"].map(f => (
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
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Get 5 New Tools Every Week</h2>
      <p className="text-gray-500 text-lg mb-8">
        Free. No spam. Unsubscribe anytime.{" "}
        <span className="text-[#6C3AFF] font-semibold">12,400 subscribers</span> already in.
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

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const footerLinks: Record<string, { name: string; slug: string }[]> = {
    "Text Tools":  [
      { name:"Word Counter",   slug:"word-counter"   },
      { name:"Case Converter", slug:"case-converter" },
      { name:"Lorem Ipsum",    slug:"lorem-ipsum"    },
      { name:"Diff Checker",   slug:"diff-checker"   },
      { name:"Text to Speech", slug:"text-to-speech" },
    ],
    "Dev Tools": [
      { name:"JSON Formatter",  slug:"json-formatter"  },
      { name:"Base64 Encoder",  slug:"base64-encoder"  },
      { name:"URL Encoder",     slug:"url-encoder"     },
      { name:"UUID Generator",  slug:"uuid-generator"  },
      { name:"Hash Generator",  slug:"hash-generator"  },
    ],
    "Finance Tools": [
      { name:"Age Calculator",         slug:"age-calculator"         },
      { name:"BMI Calculator",         slug:"bmi-calculator"         },
      { name:"Percentage Calculator",  slug:"percentage-calculator"  },
      { name:"Unit Converter",         slug:"unit-converter"         },
      { name:"Currency Converter",     slug:"currency-converter"     },
    ],
    "Other Tools": [
      { name:"Password Generator", slug:"password-generator" },
      { name:"QR Code Generator",  slug:"qr-code-generator"  },
      { name:"Color Picker",       slug:"color-picker"       },
      { name:"CSS Minifier",       slug:"css-minifier"       },
      { name:"HTML Minifier",      slug:"html-minifier"      },
    ],
    "Company": [
      { name:"About Us",     slug:"/about"          },
      { name:"All Tools",    slug:"/tools"          },
      { name:"Blog",         slug:"/blog"           },
      { name:"Go Pro",       slug:"/pro"            },
      { name:"Contact",      slug:"/contact"        },
      { name:"Privacy",      slug:"/privacy"        },
      { name:"Terms",        slug:"/terms"          },
    ],
  };

  return (
    <footer className="border-t border-white/5 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-bold text-sm mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.slug}>
                    {link.slug.startsWith("/") ? (
                      <Link href={link.slug} className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
                        {link.name}
                      </Link>
                    ) : (
                      <Link href={`/tools/${link.slug}`} className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white">Purs<span className="text-[#6C3AFF]">Tech</span></span>
            <span className="text-gray-600 text-xs">— Stop Searching. Start Doing.</span>
          </div>
          <div className="flex gap-6 text-xs text-gray-600">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
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
      <ProBanner />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
