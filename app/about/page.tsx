import Link from "next/link";
import type { Metadata } from "next";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "About PursTech — Free Tool Platform",
  description:
    "Learn about PursTech — who we are, what we built, and why we believe every person on the internet deserves access to professional-grade tools for free.",
  alternates: { canonical: "/about" },
  openGraph: {
    type:        "website",
    url:         "https://www.purstech.com/about",
    siteName:    "PursTech",
    title:       "About PursTech — Free Tool Platform",
    description: "Learn about PursTech — who we are, what we built, and why 50 free browser-based tools are available to everyone with no login required.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "About PursTech" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "About PursTech — Free Tool Platform",
    description: "Who we are, what we built, and why 50 free tools are available to everyone — no login, no limits.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
};

// ─── JSON-LD Schemas ──────────────────────────────────────────────────────────

const ABOUT_SCHEMA = {
  "@context": "https://schema.org", "@type": "AboutPage",
  "@id":      "https://www.purstech.com/about",
  url:        "https://www.purstech.com/about",
  name:       "About PursTech",
  description:"PursTech is a free online tool platform offering 50 browser-based tools across 8 categories. No login required. All tools are free.",
  inLanguage: "en-US",
  isPartOf: { "@id": "https://www.purstech.com/#website" },
  about:    { "@id": "https://www.purstech.com/#organization" },
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is PursTech?",
      acceptedAnswer: { "@type": "Answer", text: "PursTech is a free online tool platform providing 50 browser-based tools across 8 categories — text, image, developer, SEO, PDF, finance, security and AI. Every tool is free, requires no login, and processes data entirely in your browser for maximum privacy." } },
    { "@type": "Question", name: "Who created PursTech?",
      acceptedAnswer: { "@type": "Answer", text: "PursTech was founded and is run by Mahad Ikram, a designer and builder who was frustrated with the cluttered, ad-heavy tool websites available online. He built PursTech as a single, clean destination for the most-used tools on the internet — designed from scratch to be fast, private and genuinely free." } },
    { "@type": "Question", name: "How does PursTech make money if tools are free?",
      acceptedAnswer: { "@type": "Answer", text: "PursTech is supported by non-intrusive display advertising through Google AdSense. We are also launching a Pro subscription for power users who need batch processing and API access. However, all 50 core tools will always remain completely free for everyone." } },
    { "@type": "Question", name: "Is PursTech safe to use with sensitive data?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. All PursTech tools process data locally in your browser using client-side JavaScript. No files, text or data you enter into any tool is ever uploaded to our servers. We do not store, log or access your content. Your files and information remain entirely on your device." } },
    { "@type": "Question", name: "How many tools does PursTech have?",
      acceptedAnswer: { "@type": "Answer", text: "PursTech currently has 50 free tools across 8 categories: text tools (word counter, case converter, lorem ipsum), developer tools (JSON formatter, regex tester, SVG editor), image tools (compressor, background remover, OCR), SEO tools (meta tag generator, sitemap generator), PDF tools (compress, merge, split), finance tools (loan, mortgage, currency), security tools (password generator, SSL checker, IP lookup), and AI tools (grammar checker, readability checker)." } },
  ],
};

// ✅ E-E-A-T FIX: Real, named founder (replaces the inaccurate "small team" claim).
const FOUNDER = {
  name:  "Mahad Ikram",
  title: "Founder, PursTech",
  bio:   "I'm Mahad — I started PursTech to put genuinely useful tools one click away, with no logins, no limits, and nothing uploaded to a server. By background I'm a communication designer and prepress specialist, and I build PursTech hands-on: choosing, designing and testing every tool on the site. Our articles are written to be practical and checked against authoritative sources — and where a topic touches health or money, you'll find references plus a clear note that the content is informational, not professional advice.",
  links: [
    { label: "mahadikram.com", href: "https://mahadikram.com" },
    { label: "Behance",        href: "https://www.behance.net/mahadikram" },
  ],
};

const PERSON_SCHEMA = {
  "@context": "https://schema.org", "@type": "Person",
  "@id":      "https://www.purstech.com/about#mahad-ikram",
  name:       FOUNDER.name,
  url:        "https://www.purstech.com/about",
  jobTitle:   "Founder",
  description:"Founder of PursTech. Designs and builds free, privacy-first browser tools. Background in communication design and print/prepress.",
  worksFor:   { "@type": "Organization", name: "PursTech", url: "https://www.purstech.com" },
  sameAs:     FOUNDER.links.map(l => l.href),
};

// ─── Page Data ────────────────────────────────────────────────────────────────

// ✅ Removed unverifiable "190+ Countries Reached" — replaced with verifiable "8 Categories"
const STATS = [
  { value: "50", label: "Free Tools"     },
  { value: "8",  label: "Categories"     },
  { value: "0",  label: "Login Required" },
  { value: "$0", label: "Cost to Use"    },
];

// ✅ "Powered by AI" reworded — Google's E-E-A-T favors human-led content
const VALUES = [
  { icon: "🔓", title: "Free Forever",
    desc: "Every core tool on PursTech is free. No paywalls, no trial periods, no credit card required. We believe access to great tools should not depend on your budget." },
  { icon: "🔒", title: "Private by Default",
    desc: "All tool processing happens in your browser. We never store what you type, paste or upload into any tool. Your data stays on your device." },
  { icon: "⚡", title: "Instant Results",
    desc: "No waiting, no loading spinners. Every tool delivers results the moment you need them — built for speed from the ground up." },
  { icon: "🛠", title: "Built with Care",
    desc: "Every tool is hand-designed, tested across browsers, and shipped only when it actually works. We sweat the details so you don't have to." },
];

const POPULAR_TOOLS = [
  { icon:"💻", name:"JSON Formatter",        slug:"json-formatter",     category:"Dev"      },
  { icon:"🗜", name:"Image Compressor",       slug:"image-compressor",   category:"Image"    },
  { icon:"🏷", name:"Meta Tag Generator",     slug:"meta-tag-generator", category:"SEO"      },
  { icon:"📝", name:"Word Counter",           slug:"word-counter",       category:"Text"     },
  { icon:"🗜", name:"PDF Compressor",         slug:"pdf-compressor",     category:"PDF"      },
  { icon:"✓",  name:"Grammar Checker",        slug:"grammar-checker",    category:"AI"       },
  { icon:"🔐", name:"Password Generator",     slug:"password-generator", category:"Security" },
  { icon:"🏦", name:"Loan Calculator",        slug:"loan-calculator",    category:"Finance"  },
];

const FAQ_ITEMS = [
  { q: "What is PursTech?",
    a: "PursTech is a free online tool platform providing 50 browser-based tools across 8 categories — text, image, developer, SEO, PDF, finance, security and AI. Every tool is free, requires no login, and processes data entirely in your browser." },
  { q: "Who created PursTech?",
    a: "PursTech was founded and is run by Mahad Ikram, a designer and builder who got tired of cluttered, ad-heavy tool sites. He built one clean, fast platform with everything in one place — designed from scratch to be free, private and genuinely useful." },
  { q: "How does PursTech make money if tools are free?",
    a: "PursTech is supported by non-intrusive display advertising through Google AdSense. We are also launching a Pro subscription for power users who need batch processing and API access. However, all 50 core tools will always remain completely free for everyone." },
  { q: "Is PursTech safe to use with sensitive data?",
    a: "Yes. All PursTech tools process data locally in your browser. No files, text or data you enter into any tool is ever uploaded to our servers. We do not store, log or access your content. Your information remains entirely on your device." },
  { q: "How many tools does PursTech have?",
    a: "PursTech currently has 50 free tools across 8 categories: text tools, developer tools, image tools, SEO tools, PDF tools, finance tools, security tools and AI tools. We add new tools regularly and plan to expand significantly." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }} />

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools"   className="text-sm text-gray-500 hover:text-white transition-colors">Tools</Link>
            <Link href="/blog"    className="text-sm text-gray-500 hover:text-white transition-colors">Blog</Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:text-white transition-colors">Contact</Link>
            <Link href="/pro" className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-16">

        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span aria-hidden="true">›</span>
          <span className="text-gray-400">About</span>
        </nav>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-4 py-1.5 text-xs text-[#6C3AFF] font-semibold mb-5">Our Story</div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            We Built the Tool Website<br />
            <span className="bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] bg-clip-text text-transparent">We Always Wished Existed</span>
          </h1>

          <h2 className="text-base font-semibold text-[#6C3AFF] mb-5">
            50 Free Online Tools · No Login · No Limits · 100% Browser-Based
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Every day, millions of people search for simple tools — a word counter, a JSON formatter,
            a password generator. They land on cluttered, ad-heavy websites that barely work on mobile.
            We decided to fix that.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {STATS.map((s) => (
            <div key={s.label} className="bg-[#13131F] border border-white/5 rounded-2xl p-5 text-center hover:border-[#6C3AFF]/30 transition-colors">
              <div className="text-3xl font-extrabold text-[#6C3AFF] mb-1">{s.value}</div>
              <div className="text-xs text-gray-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#13131F] border border-white/5 rounded-3xl p-8 md:p-10 mb-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">The Problem We Solved</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              Think about the last time you needed to format a JSON file, compress an image, or generate
              a strong password. You probably opened a new tab, typed something into Google, clicked the
              first result, and were immediately greeted by a wall of ads, a cookie banner, a newsletter
              popup, and a tool that looked like it was built in 2009.
            </p>
            <p>
              That experience — repeated by millions of people every single day — is what PursTech was
              built to replace. We wanted a single destination where every tool is fast, clean,
              mobile-friendly, and completely free. No login walls. No usage limits on the basics.
              No hunting around.
            </p>
            <p>
              We started with the most-searched tools on the internet — from word counters and
              JSON formatters to QR code generators and password tools. Every single one was designed
              from scratch with three non-negotiable principles: it must be fast, it must be private,
              and it must actually work. Today PursTech offers 50 free tools across 8 categories.
            </p>
            {/* ✅ "190 countries" sentence REMOVED, replaced with honest growth statement */}
            <p>
              We add new tools regularly and ensure every tool comes with clear documentation,
              how-to guides, and answers to the most common questions. We are just getting started.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-white text-center mb-10">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-[#13131F] border border-white/5 rounded-2xl p-6 hover:border-[#6C3AFF]/30 transition-colors">
                <div className="text-3xl mb-4">{v.icon}</div>
                <h3 className="font-extrabold text-white text-base mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#6C3AFF] via-[#4B2CC0] to-[#00D4FF] p-px mb-16">
          <div className="bg-[#0D0D1A] rounded-3xl p-8 md:p-10 text-center">
            <h2 className="text-2xl font-extrabold text-white mb-4">Our Mission</h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
              To give every person on the internet — regardless of their budget, location or technical
              skill — access to professional-grade tools that save time, solve problems and make work
              easier. Completely free. Always.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-white text-center mb-8">Meet the Founder</h2>
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6C3AFF] to-[#00D4FF] flex items-center justify-center text-white text-xl font-extrabold flex-shrink-0">MI</div>
            <div>
              <div className="font-extrabold text-white text-base">{FOUNDER.name}</div>
              <div className="text-[#6C3AFF] text-xs font-semibold mb-2">{FOUNDER.title}</div>
              <p className="text-gray-500 text-sm leading-relaxed">{FOUNDER.bio}</p>
              <div className="flex items-center gap-4 mt-3 text-xs font-semibold">
                {FOUNDER.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                    className="text-[#00D4FF] hover:text-white transition-colors">{l.label}</a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-white text-center mb-4">Try Our Most Popular Tools</h2>
          <p className="text-gray-500 text-sm text-center mb-8">No login needed. Results in seconds. 50 tools across 8 categories.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {POPULAR_TOOLS.map((tool) => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`}
                className="bg-[#13131F] border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center gap-2 hover:border-[#6C3AFF]/40 hover:-translate-y-0.5 transition-all group">
                <span className="text-2xl">{tool.icon}</span>
                <span className="text-white text-xs font-semibold group-hover:text-[#00D4FF] transition-colors">{tool.name}</span>
                <span className="text-gray-600 text-[10px]">{tool.category}</span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/tools" className="text-sm text-[#6C3AFF] hover:text-[#00D4FF] font-semibold transition-colors">Browse all 50 free tools →</Link>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-white text-center mb-3">Frequently Asked Questions</h2>
          <p className="text-gray-500 text-sm text-center mb-8">Common questions about PursTech</p>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden group">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-white/[0.02] transition-colors list-none">
                  <span className="font-semibold text-white text-sm pr-4">{item.q}</span>
                  <span className="text-[#6C3AFF] text-xl font-bold flex-shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        <div className="text-center bg-[#13131F] border border-white/5 rounded-3xl p-10">
          <h2 className="text-2xl font-extrabold text-white mb-3">Ready to Stop Searching?</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Browse our full collection of 50 free tools — no account needed, no limits.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tools" className="px-8 py-4 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-bold transition-all shadow-lg shadow-violet-900/30">Browse All 50 Tools →</Link>
            <Link href="/contact" className="px-8 py-4 rounded-xl bg-[#13131F] border border-white/10 hover:border-[#6C3AFF]/40 text-white font-bold transition-all">Get in Touch</Link>
          </div>
        </div>

      </main>

      <footer className="border-t border-white/5 mt-20 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        {/* ✅ Fixed: was © 2025 */}
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}