"use client";

import { useState, useCallback } from "react";
import type { Metadata } from "next";
import Link from "next/link";

// ─── Word Counter Tool ────────────────────────────────────────────────────────

const RELATED_TOOLS = [
  { icon: "✍️", name: "Grammar Checker",  slug: "grammar-checker"  },
  { icon: "🔤", name: "Case Converter",   slug: "case-converter"   },
  { icon: "📄", name: "Summarizer (AI)",  slug: "text-summarizer"  },
  { icon: "📝", name: "Lorem Ipsum Gen",  slug: "lorem-ipsum"      },
  { icon: "🔍", name: "Plagiarism Check", slug: "plagiarism-checker"},
];

const FAQ = [
  {
    q: "How does the word counter work?",
    a: "Simply type or paste your text into the box above. PursTech instantly counts your words, characters, sentences, and paragraphs in real time — no button needed.",
  },
  {
    q: "Is there a limit on how much text I can enter?",
    a: "No limit at all. You can paste an entire book, essay, or article and get accurate counts instantly.",
  },
  {
    q: "Does it count characters with or without spaces?",
    a: "Both! We show you characters with spaces and characters without spaces so you can use whichever count your platform requires.",
  },
  {
    q: "How are reading time and speaking time calculated?",
    a: "Reading time is based on the average adult reading speed of 238 words per minute. Speaking time is based on the average speaking pace of 130 words per minute.",
  },
  {
    q: "Is my text saved or stored anywhere?",
    a: "No. All processing happens instantly in your browser. Your text is never sent to any server or stored anywhere. Complete privacy.",
  },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, color,
}: {
  label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 flex flex-col gap-1 hover:border-[#6C3AFF]/30 transition-colors">
      <div className={`text-3xl font-extrabold ${color}`}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      <div className="text-white text-sm font-semibold">{label}</div>
      {sub && <div className="text-gray-600 text-xs">{sub}</div>}
    </div>
  );
}

// ─── Main Tool Component ──────────────────────────────────────────────────────
export default function WordCounterPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ── Analysis ──────────────────────────────────────────────────────────────
  const analyze = useCallback((t: string) => {
    const trimmed = t.trim();
    const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
    const chars = t.length;
    const charsNoSpaces = t.replace(/\s/g, "").length;
    const sentences = trimmed === "" ? 0 : (t.match(/[.!?]+/g) || []).length;
    const paragraphs = trimmed === "" ? 0 : t.split(/\n\s*\n/).filter((p) => p.trim() !== "").length || (trimmed !== "" ? 1 : 0);
    const readingTime = Math.ceil(words / 238);
    const speakingTime = Math.ceil(words / 130);

    // Top 5 most frequent keywords (ignore common stop words)
    const stopWords = new Set([
      "the","a","an","and","or","but","in","on","at","to","for","of","with",
      "is","are","was","were","be","been","being","have","has","had","do",
      "does","did","will","would","could","should","may","might","shall",
      "this","that","these","those","i","you","he","she","it","we","they",
      "my","your","his","her","its","our","their","me","him","us","them",
    ]);
    const wordFreq: Record<string, number> = {};
    trimmed
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w))
      .forEach((w) => { wordFreq[w] = (wordFreq[w] || 0) + 1; });
    const topWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime, speakingTime, topWords };
  }, []);

  const stats = analyze(text);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => setText("");

  const handleCopyStats = async () => {
    const summary = `Word Count Analysis
Words: ${stats.words}
Characters (with spaces): ${stats.chars}
Characters (no spaces): ${stats.charsNoSpaces}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Reading Time: ${stats.readingTime} min
Speaking Time: ${stats.speakingTime} min`;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">

      {/* ── Navbar ── */}
      <nav className="border-b border-white/5 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </Link>
          <Link
            href="/tools"
            className="text-sm text-gray-500 hover:text-white transition-colors"
          >
            ← All Tools
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">

        {/* ── Breadcrumb ── */}
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link>
          <span>›</span>
          <Link href="/categories/text" className="hover:text-gray-400 transition-colors">Text Tools</Link>
          <span>›</span>
          <span className="text-gray-400">Word Counter</span>
        </nav>

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">📝</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                Word Counter
              </h1>
              <p className="text-gray-500 mt-1">
                Count words, characters, sentences & paragraphs — instantly, free, no login.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Free", "No Login", "Real-time", "Private"].map((badge) => (
              <span
                key={badge}
                className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium"
              >
                ✓ {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: Editor + Actions ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Text area */}
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here...&#10;&#10;Your word count updates instantly as you type."
                className="w-full h-72 px-5 py-4 rounded-2xl bg-[#13131F] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 focus:shadow-[0_0_20px_rgba(108,58,255,0.1)] transition-all resize-none text-sm leading-relaxed"
              />
              {/* Live word count overlay */}
              {text && (
                <div className="absolute bottom-4 right-4 text-xs text-gray-600 bg-[#0A0A14]/80 px-2 py-1 rounded-lg">
                  {stats.words} words
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-sm font-bold transition-all"
              >
                {copied ? "✅ Copied!" : "📋 Copy Text"}
              </button>
              <button
                onClick={handleCopyStats}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#13131F] hover:bg-[#1a1a2e] border border-white/5 hover:border-[#6C3AFF]/30 text-white text-sm font-semibold transition-all"
              >
                📊 Copy Stats
              </button>
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#13131F] hover:bg-[#1a1a2e] border border-white/5 hover:border-red-500/30 text-gray-400 hover:text-red-400 text-sm font-semibold transition-all"
              >
                🗑️ Clear
              </button>
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              <StatCard label="Words"       value={stats.words}           color="text-[#6C3AFF]" />
              <StatCard label="Characters"  value={stats.chars}           sub="with spaces"   color="text-[#00D4FF]" />
              <StatCard label="Characters"  value={stats.charsNoSpaces}   sub="no spaces"     color="text-cyan-400"  />
              <StatCard label="Sentences"   value={stats.sentences}       color="text-green-400" />
              <StatCard label="Paragraphs"  value={stats.paragraphs}      color="text-yellow-400" />
              <StatCard
                label="Reading Time"
                value={stats.readingTime < 1 ? "< 1" : stats.readingTime}
                sub="minutes (238 wpm)"
                color="text-pink-400"
              />
              <StatCard
                label="Speaking Time"
                value={stats.speakingTime < 1 ? "< 1" : stats.speakingTime}
                sub="minutes (130 wpm)"
                color="text-orange-400"
              />
              <StatCard
                label="Avg Word Length"
                value={
                  stats.words > 0
                    ? (stats.charsNoSpaces / stats.words).toFixed(1)
                    : "0"
                }
                sub="characters"
                color="text-violet-300"
              />
            </div>

            {/* ── Keyword density ── */}
            {stats.topWords.length > 0 && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 mt-2">
                <h3 className="text-sm font-bold text-white mb-4">
                  🔑 Top Keywords
                </h3>
                <div className="space-y-2">
                  {stats.topWords.map(([word, count]) => (
                    <div key={word} className="flex items-center gap-3">
                      <div className="w-20 text-xs text-gray-400 capitalize truncate">
                        {word}
                      </div>
                      <div className="flex-1 bg-[#0A0A14] rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              100,
                              (count / (stats.topWords[0]?.[1] || 1)) * 100
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 w-8 text-right">
                        {count}x
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="flex flex-col gap-4">

            {/* Character limits guide */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">
                📏 Platform Limits
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Twitter / X",    limit: 280,    icon: "🐦" },
                  { name: "Instagram Bio",  limit: 150,    icon: "📸" },
                  { name: "Google Ad",      limit: 90,     icon: "📢" },
                  { name: "Meta Title",     limit: 60,     icon: "🔍" },
                  { name: "Meta Desc",      limit: 160,    icon: "📄" },
                  { name: "LinkedIn Post",  limit: 3000,   icon: "💼" },
                ].map((platform) => {
                  const pct = Math.min(
                    100,
                    Math.round((stats.chars / platform.limit) * 100)
                  );
                  const color =
                    pct >= 100
                      ? "bg-red-500"
                      : pct >= 80
                      ? "bg-yellow-400"
                      : "bg-green-400";
                  return (
                    <div key={platform.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">
                          {platform.icon} {platform.name}
                        </span>
                        <span
                          className={
                            pct >= 100 ? "text-red-400" : "text-gray-600"
                          }
                        >
                          {stats.chars}/{platform.limit}
                        </span>
                      </div>
                      <div className="bg-[#0A0A14] rounded-full h-1.5">
                        <div
                          className={`${color} h-1.5 rounded-full transition-all duration-300`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Related tools */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">
                🔧 Related Tools
              </h3>
              <div className="space-y-2">
                {RELATED_TOOLS.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#0A0A14] transition-colors group"
                  >
                    <span className="text-xl">{tool.icon}</span>
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                      {tool.name}
                    </span>
                    <span className="ml-auto text-gray-700 group-hover:text-[#6C3AFF] transition-colors text-sm">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Pro upsell */}
            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-white text-sm mb-1">PursTech Pro</h3>
              <p className="text-gray-500 text-xs mb-4">
                Unlimited usage, zero ads, priority AI tools
              </p>
              <button className="w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all">
                Get Pro — $7/mo
              </button>
            </div>
          </div>
        </div>

        {/* ── How to Use ── */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">
            📖 How to Use the Word Counter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: "1", title: "Paste or Type", desc: "Click the text box above and paste your content or start typing directly. Works with any language." },
              { step: "2", title: "See Instant Results", desc: "Your word count, character count, reading time and more update in real time as you type — no button needed." },
              { step: "3", title: "Copy or Export", desc: "Use the Copy Stats button to save a full analysis report. Share it or paste it anywhere you need." },
            ].map((s) => (
              <div key={s.step} className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-[#6C3AFF]/20 border border-[#6C3AFF]/30 flex items-center justify-center text-[#6C3AFF] font-black text-lg mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">
            ❓ Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-white text-sm">
                    {item.q}
                  </span>
                  <span className="text-[#6C3AFF] text-lg ml-4 flex-shrink-0">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 mt-20 py-8 text-center">
        <Link href="/" className="text-xl font-black">
          Purs<span className="text-[#6C3AFF]">Tech</span>
        </Link>
        <p className="text-gray-700 text-xs mt-2">
          © 2025 PursTech. Free online tools for everyone.
        </p>
      </footer>

    </div>
  );
}
