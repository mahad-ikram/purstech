"use client";

import { useState, useEffect } from "react";

// ─── Static Data ────────────────────────────────────────────────────────────

const CATEGORIES = [
  { icon: "📝", name: "Text Tools",    slug: "text",     count: 48,  color: "from-violet-600 to-violet-400" },
  { icon: "🖼️", name: "Image Tools",   slug: "image",    count: 36,  color: "from-cyan-600 to-cyan-400"   },
  { icon: "💻", name: "Dev Tools",     slug: "dev",      count: 54,  color: "from-blue-600 to-blue-400"   },
  { icon: "📊", name: "SEO Tools",     slug: "seo",      count: 29,  color: "from-green-600 to-green-400" },
  { icon: "🤖", name: "AI Tools",      slug: "ai",       count: 22,  color: "from-pink-600 to-pink-400"   },
  { icon: "💰", name: "Finance Tools", slug: "finance",  count: 31,  color: "from-yellow-600 to-yellow-400"},
  { icon: "🔒", name: "Security",      slug: "security", count: 18,  color: "from-red-600 to-red-400"     },
  { icon: "📄", name: "PDF Tools",     slug: "pdf",      count: 24,  color: "from-orange-600 to-orange-400"},
];

const FEATURED_TOOLS = [
  { icon: "🖼️", name: "Image Compressor",   slug: "image-compressor",   category: "Image",  uses: "2.1M", badge: "🔥 Hot" },
  { icon: "📝", name: "Word Counter",        slug: "word-counter",       category: "Text",   uses: "1.8M", badge: "⭐ Top" },
  { icon: "💻", name: "JSON Formatter",      slug: "json-formatter",     category: "Dev",    uses: "1.5M", badge: "⭐ Top" },
  { icon: "🔐", name: "Password Generator",  slug: "password-generator", category: "Security",uses: "980K", badge: "🆕 New" },
  { icon: "📄", name: "PDF Compressor",      slug: "pdf-compressor",     category: "PDF",    uses: "870K", badge: "🔥 Hot" },
  { icon: "🎨", name: "Color Picker",        slug: "color-picker",       category: "Image",  uses: "760K", badge: "" },
  { icon: "🔗", name: "QR Code Generator",   slug: "qr-code-generator",  category: "Dev",    uses: "650K", badge: "🆕 New" },
  { icon: "✍️", name: "Grammar Checker",     slug: "grammar-checker",    category: "Text",   uses: "540K", badge: "🤖 AI" },
  { icon: "📊", name: "Meta Tag Generator",  slug: "meta-tag-generator", category: "SEO",    uses: "430K", badge: "" },
  { icon: "💱", name: "Currency Converter",  slug: "currency-converter", category: "Finance",uses: "390K", badge: "" },
  { icon: "🔤", name: "Case Converter",      slug: "case-converter",     category: "Text",   uses: "310K", badge: "" },
  { icon: "🧮", name: "Age Calculator",      slug: "age-calculator",     category: "Finance",uses: "280K", badge: "" },
];

const TRENDING_TOOLS = [
  "Image Compressor", "JSON Formatter", "Word Counter", "PDF to Word",
  "Background Remover", "QR Code Generator", "Password Generator", "Meta Tag Generator",
  "Base64 Encoder", "CSS Minifier", "Grammar Checker", "Color Picker",
];

const ACTIVITIES = [
  { country: "🇺🇸", location: "New York, USA",      tool: "Image Compressor",   time: "2s ago"  },
  { country: "🇮🇳", location: "Mumbai, India",       tool: "JSON Formatter",     time: "5s ago"  },
  { country: "🇬🇧", location: "London, UK",          tool: "Word Counter",       time: "8s ago"  },
  { country: "🇩🇪", location: "Berlin, Germany",     tool: "PDF Compressor",     time: "12s ago" },
  { country: "🇧🇷", location: "São Paulo, Brazil",   tool: "QR Code Generator",  time: "15s ago" },
  { country: "🇨🇦", location: "Toronto, Canada",     tool: "Password Generator", time: "19s ago" },
  { country: "🇦🇺", location: "Sydney, Australia",   tool: "Color Picker",       time: "23s ago" },
  { country: "🇫🇷", location: "Paris, France",       tool: "Meta Tag Generator", time: "28s ago" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0A0A14]/95 backdrop-blur-md shadow-lg shadow-violet-900/20" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-white tracking-tight">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </span>
          <span className="text-[10px] bg-[#6C3AFF]/30 text-[#6C3AFF] px-2 py-0.5 rounded-full font-bold border border-[#6C3AFF]/30">
            BETA
          </span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400 font-medium">
          {["Text", "Image", "Dev", "SEO", "AI", "Finance"].map((cat) => (
            <a key={cat} href="#" className="hover:text-white transition-colors">
              {cat}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors">
            Sign In
          </button>
          <button className="px-4 py-2 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all duration-300 shadow-lg shadow-violet-900/30">
            Go Pro ⚡
          </button>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(1247839);

  // Simulate live counter
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 3) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Live counter badge */}
      <div className="mb-6 flex items-center gap-2 bg-[#13131F] border border-[#6C3AFF]/30 rounded-full px-5 py-2 text-sm">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-gray-400">
          <span className="text-white font-bold">{count.toLocaleString()}</span> tools used today
        </span>
      </div>

      {/* Main headline */}
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white text-center max-w-5xl leading-tight">
        Stop Searching.{" "}
        <br className="hidden md:block" />
        <span className="bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] bg-clip-text text-transparent">
          Start Doing.
        </span>
      </h1>

      <p className="mt-6 text-lg md:text-xl text-gray-400 text-center max-w-2xl leading-relaxed">
        The World&apos;s Largest Free Tool Ecosystem.{" "}
        <span className="text-white font-semibold">10,000+ tools</span>, powered by AI, built for everyone.
      </p>

      {/* Search bar */}
      <div className="w-full max-w-2xl mt-10 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 10,000+ tools... e.g. 'compress image'"
          className="flex-1 px-6 py-4 rounded-xl bg-[#13131F] border border-[#6C3AFF]/40 text-white placeholder-gray-500 focus:outline-none focus:border-[#00D4FF] focus:shadow-[0_0_20px_rgba(0,212,255,0.15)] transition-all text-base"
        />
        <button className="px-8 py-4 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] transition-all duration-300 font-bold text-white shadow-lg shadow-violet-900/40 whitespace-nowrap">
          🔍 Search
        </button>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-8 text-sm text-gray-500 font-semibold">
        <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Free Forever</span>
        <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> No Login Required</span>
        <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Instant Results</span>
        <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> AI-Powered</span>
        <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Zero Ads on Tools</span>
      </div>
    </section>
  );
}

function TrendingBar() {
  return (
    <div className="bg-[#13131F] border-y border-[#6C3AFF]/20 py-3 overflow-hidden">
      <div className="flex items-center">
        <div className="flex-shrink-0 flex items-center gap-2 px-4 border-r border-[#6C3AFF]/30 mr-4">
          <span className="w-2 h-2 bg-[#FF3A6C] rounded-full animate-pulse" />
          <span className="text-[#FF3A6C] font-bold text-xs uppercase tracking-widest whitespace-nowrap">
            Trending
          </span>
        </div>
        {/* Scrolling ticker */}
        <div className="flex gap-8 animate-[scroll_20s_linear_infinite] whitespace-nowrap">
          {[...TRENDING_TOOLS, ...TRENDING_TOOLS].map((tool, i) => (
            <a
              key={i}
              href="#"
              className="text-gray-400 hover:text-[#00D4FF] transition-colors text-sm font-medium"
            >
              {tool}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
          Browse by Category
        </h2>
        <p className="text-gray-500 text-lg">
          Over <span className="text-[#6C3AFF] font-bold">262 tools</span> across 8 categories — and growing every day
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group relative bg-[#13131F] border border-white/5 rounded-2xl p-5 hover:border-[#6C3AFF]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/20 overflow-hidden"
          >
            {/* Hover gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

            <div className="text-3xl mb-3">{cat.icon}</div>
            <div className="font-bold text-white text-sm mb-1">{cat.name}</div>
            <div className="text-xs text-gray-500">{cat.count} tools</div>

            {/* Arrow on hover */}
            <div className="absolute top-4 right-4 text-gray-700 group-hover:text-[#6C3AFF] transition-colors text-lg">
              →
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function FeaturedTools() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
            🏆 Most Popular Tools
          </h2>
          <p className="text-gray-500">Used by millions worldwide, every single day</p>
        </div>
        <a href="/tools" className="hidden md:flex items-center gap-1 text-[#6C3AFF] hover:text-[#00D4FF] font-semibold transition-colors text-sm">
          View all tools <span>→</span>
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {FEATURED_TOOLS.map((tool) => (
          <a
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group bg-[#13131F] border border-white/5 rounded-2xl p-5 hover:border-[#6C3AFF]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-900/20"
          >
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
            <div className="text-xs text-gray-600">{tool.category}</div>
            <div className="mt-3 text-xs text-gray-500">
              <span className="text-green-400 font-semibold">{tool.uses}</span> uses
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function LiveActivityFeed() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % ACTIVITIES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const act = ACTIVITIES[current];

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: live feed */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-[#6C3AFF]/10 rounded-full flex items-center justify-center border border-[#6C3AFF]/20">
            <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">
              <span className="text-white font-semibold">{act.country} {act.location}</span>
              {" "}just used{" "}
              <span className="text-[#6C3AFF] font-semibold">{act.tool}</span>
            </p>
            <p className="text-gray-600 text-xs mt-0.5">{act.time}</p>
          </div>
        </div>

        {/* Right: stat pills */}
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { label: "Tools Live",      value: "262+",    color: "text-violet-400" },
            { label: "Uses Today",      value: "48,293",  color: "text-cyan-400"   },
            { label: "Countries",       value: "190+",    color: "text-green-400"  },
            { label: "Avg. Load Time",  value: "0.3s",    color: "text-yellow-400" },
          ].map((s) => (
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
            {[
              "✓ Unlimited tool usage",
              "✓ Zero ads",
              "✓ Priority AI processing",
              "✓ API access",
              "✓ Batch processing",
              "✓ Early access to new tools",
            ].map((f) => (
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

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email.includes("@")) {
      setSubmitted(true);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
        Get 5 New Tools Every Week
      </h2>
      <p className="text-gray-500 text-lg mb-8">
        Free. No spam. Unsubscribe anytime.{" "}
        <span className="text-[#6C3AFF] font-semibold">12,400 subscribers</span> already in.
      </p>

      {submitted ? (
        <div className="text-green-400 font-bold text-xl">
          🎉 You&apos;re in! Check your inbox.
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 px-5 py-4 rounded-xl bg-[#13131F] border border-[#6C3AFF]/30 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4FF] transition-all"
          />
          <button
            onClick={handleSubmit}
            className="px-7 py-4 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-bold transition-all duration-300 whitespace-nowrap"
          >
            Subscribe →
          </button>
        </div>
      )}
    </section>
  );
}

function Footer() {
  const footerLinks = {
    "Text Tools":    ["Word Counter", "Case Converter", "Lorem Ipsum", "Grammar Checker", "Summarizer"],
    "Image Tools":   ["Image Compressor", "Image Resizer", "Background Remover", "Color Picker", "QR Code"],
    "Dev Tools":     ["JSON Formatter", "Base64 Encoder", "UUID Generator", "Regex Tester", "CSS Minifier"],
    "SEO Tools":     ["Meta Tag Generator", "Sitemap Generator", "Keyword Density", "Robots.txt", "OG Checker"],
    "Company":       ["About PursTech", "Blog", "Changelog", "API Docs", "Contact"],
  };

  return (
    <footer className="border-t border-white/5 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-14">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-bold text-sm mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white">
              Purs<span className="text-[#6C3AFF]">Tech</span>
            </span>
            <span className="text-gray-600 text-xs">— Stop Searching. Start Doing.</span>
          </div>
          <div className="flex gap-6 text-xs text-gray-600">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Sitemap</a>
          </div>
          <p className="text-gray-700 text-xs">
            © 2025 PursTech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A14] font-sans">

      {/* 1. Navigation */}
      <Navbar />

      {/* 2. Hero Section */}
      <HeroSection />

      {/* 3. Trending Bar */}
      <TrendingBar />

      {/* 4. Live Activity Feed + Stats */}
      <LiveActivityFeed />

      {/* 5. Category Grid */}
      <CategoryGrid />

      {/* 6. Featured Tools */}
      <FeaturedTools />

      {/* 7. Pro Upsell Banner */}
      <ProBanner />

      {/* 8. Newsletter */}
      <NewsletterSection />

      {/* 9. Footer */}
      <Footer />

    </main>
  );
}
