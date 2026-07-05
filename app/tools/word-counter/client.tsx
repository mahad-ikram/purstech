"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; 

const RELATED_TOOLS = [
  { icon:"✍️", name:"Grammar Checker",  slug:"grammar-checker"   },
  { icon:"🔤", name:"Case Converter",   slug:"case-converter"    },
  { icon:"📖", name:"Readability Checker", slug:"readability-checker" },
  { icon:"📝", name:"Lorem Ipsum Gen",  slug:"lorem-ipsum"       },
  { icon:"🔀", name:"Diff Checker",      slug:"diff-checker"        },
];

const FAQ = [
  { q:"How do I check the number of words in my text?",
    a:"Paste or type your text into the box above — the word checker instantly checks the number of words, characters, sentences and paragraphs. There is no button to press and no limit on text length." },
  { q:"How does the word counter work?",
    a:"Simply type or paste your text into the box above. PursTech instantly counts your words, characters, sentences and paragraphs in real time — no button needed." },
  { q:"Is there a limit on how much text I can enter?",
    a:"No limit at all. You can paste an entire book, essay or article and get accurate counts instantly." },
  { q:"Does it count characters with or without spaces?",
    a:"Both! We show you characters with spaces and characters without spaces so you can use whichever count your platform requires." },
  { q:"How are reading time and speaking time calculated?",
    a:"Reading time is based on the average adult reading speed of 238 words per minute. Speaking time is based on the average speaking pace of 130 words per minute." },
  { q:"Is my text saved or stored anywhere?",
    a:"No. All processing happens instantly in your browser. Your text is never sent to any server or stored anywhere. Complete privacy." },
];

const USE_CASES = [
  { icon:"🎓", title:"Academic Writing",     desc:"Universities set strict word counts for essays and dissertations. Staying within limits avoids grade penalties; hitting minimums demonstrates depth of research." },
  { icon:"🔍", title:"SEO Content",          desc:"Blog posts of 1,500–2,500 words tend to rank better in search. Longer-form content signals expertise to search engines — but only when the word count is purposeful, not padded." },
  { icon:"📱", title:"Social Media",         desc:"Every platform has character limits. Twitter/X caps at 280 characters, Instagram bio at 150, meta descriptions at 160. The Platform Limits panel tracks exactly where you stand." },
  { icon:"📄", title:"Professional Docs",    desc:"Job descriptions, legal contracts and grant applications often have precise length requirements. Real-time counting keeps you on target without stopping to check manually." },
];

// ─── StatCard (Mobile Safe) ──────────────────────────────────────────────────
function StatCard({ label, value, sub, color }: {
  label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 flex flex-col gap-1 hover:border-[#6C3AFF]/30 transition-colors min-w-0 w-full">
      <div className={`text-3xl font-extrabold truncate pr-1 ${color}`}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      <div className="text-white text-sm font-semibold truncate pr-1">{label}</div>
      {sub && <div className="text-gray-600 text-xs truncate pr-1">{sub}</div>}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function WordCounterClient({ children }: { children?: React.ReactNode }) {
  useTrackTool("word-counter", "text"); 

  const [text,   setText]   = useState("");
  const [copied, setCopied] = useState(false);

  const analyze = useCallback((t: string) => {
    const trimmed        = t.trim();
    const words          = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
    const chars          = t.length;
    const charsNoSpaces  = t.replace(/\s/g, "").length;
    const sentences      = trimmed === "" ? 0 : (t.match(/[.!?]+/g) || []).length;
    const paragraphs     = trimmed === "" ? 0
      : t.split(/\n\s*\n/).filter(p => p.trim() !== "").length || (trimmed !== "" ? 1 : 0);
    const readingTime    = Math.ceil(words / 238);
    const speakingTime   = Math.ceil(words / 130);

    const wordList = trimmed === "" ? [] :
      trimmed.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(w => w.length > 0);
    const uniqueWords    = new Set(wordList).size;
    const vocabRichness  = words > 0 ? Math.round((uniqueWords / words) * 100) : 0;

    const stopWords = new Set([
      "the","a","an","and","or","but","in","on","at","to","for","of","with",
      "is","are","was","were","be","been","being","have","has","had","do",
      "does","did","will","would","could","should","may","might","shall",
      "this","that","these","those","i","you","he","she","it","we","they",
      "my","your","his","her","its","our","their","me","him","us","them",
    ]);
    const wordFreq: Record<string, number> = {};
    wordList.filter(w => w.length > 2 && !stopWords.has(w))
            .forEach(w => { wordFreq[w] = (wordFreq[w] || 0) + 1; });
    const topWords = Object.entries(wordFreq).sort((a,b) => b[1]-a[1]).slice(0,5);

    return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime, speakingTime, uniqueWords, vocabRichness, topWords };
  }, []);

  const stats = analyze(text);

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyStats = async () => {
    const summary = `Word Count Analysis\nWords: ${stats.words}\nCharacters (with spaces): ${stats.chars}\nCharacters (no spaces): ${stats.charsNoSpaces}\nSentences: ${stats.sentences}\nParagraphs: ${stats.paragraphs}\nUnique Words: ${stats.uniqueWords} (${stats.vocabRichness}% vocabulary richness)\nReading Time: ${stats.readingTime} min\nSpeaking Time: ${stats.speakingTime} min`;
    await navigator.clipboard.writeText(summary);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden">

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">← All Tools</Link>
            <Link href="/pro" className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10 flex-grow w-full">

        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/text" className="hover:text-gray-400 transition-colors">Text Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">Word Counter</span>
        </nav>

        {children}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0 w-full">

          {/* Left — Editor + Stats */}
          <div className="lg:col-span-2 min-w-0 flex flex-col gap-4 w-full">

            {/* Textarea */}
            <div className="relative min-w-0 w-full">
              <textarea value={text} onChange={e => setText(e.target.value)}
                placeholder={"Type or paste your text here...\n\nYour word count updates instantly as you type."}
                className="w-full min-w-0 h-72 px-5 py-4 rounded-2xl bg-[#13131F] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 focus:shadow-[0_0_20px_rgba(108,58,255,0.1)] transition-all resize-none text-sm leading-relaxed" />
              {text && (
                <div className="absolute bottom-4 right-4 text-xs text-gray-600 bg-[#0A0A14]/80 px-2 py-1 rounded-lg">
                  {stats.words.toLocaleString()} words
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 min-w-0 w-full">
              <button onClick={handleCopy} disabled={!text}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] disabled:opacity-40 text-white text-sm font-bold transition-all flex-shrink-0">
                {copied ? "✅ Copied!" : "📋 Copy Text"}
              </button>
              <button onClick={handleCopyStats} disabled={!text}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#13131F] hover:bg-[#1a1a2e] disabled:opacity-40 border border-white/5 hover:border-[#6C3AFF]/30 text-white text-sm font-semibold transition-all flex-shrink-0">
                📊 Copy Stats
              </button>
              <button onClick={() => setText("")} disabled={!text}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#13131F] hover:bg-[#1a1a2e] disabled:opacity-40 border border-white/5 hover:border-red-500/30 text-gray-400 hover:text-red-400 text-sm font-semibold transition-all flex-shrink-0">
                🗑️ Clear
              </button>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2 min-w-0 w-full">
              <StatCard label="Words"         value={stats.words}          color="text-[#6C3AFF]" />
              <StatCard label="Characters"    value={stats.chars}          sub="with spaces"    color="text-[#00D4FF]" />
              <StatCard label="Characters"    value={stats.charsNoSpaces}  sub="no spaces"      color="text-cyan-400"  />
              <StatCard label="Sentences"     value={stats.sentences}      color="text-green-400" />
              <StatCard label="Paragraphs"    value={stats.paragraphs}     color="text-yellow-400" />
              <StatCard label="Reading Time"  value={stats.readingTime < 1 ? "< 1" : stats.readingTime}   sub="min (238 wpm)"  color="text-pink-400"   />
              <StatCard label="Speaking Time" value={stats.speakingTime < 1 ? "< 1" : stats.speakingTime} sub="min (130 wpm)"  color="text-orange-400" />
              <StatCard label="Unique Words"  value={stats.uniqueWords}    sub={stats.words > 0 ? `${stats.vocabRichness}% richness` : undefined} color="text-violet-400" />
            </div>

            {/* Keyword density */}
            {stats.topWords.length > 0 && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 mt-2 min-w-0 w-full">
                <h3 className="text-sm font-bold text-white mb-4">🔑 Top Keywords</h3>
                <div className="space-y-2 min-w-0 w-full">
                  {stats.topWords.map(([word, count]) => (
                    <div key={word} className="flex items-center gap-3 min-w-0 w-full">
                      <div className="w-20 text-xs text-gray-400 capitalize truncate pr-2 min-w-0">{word}</div>
                      <div className="flex-1 bg-[#0A0A14] rounded-full h-2 min-w-0">
                        <div className="bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] h-2 rounded-full transition-all duration-500"
                          style={{ width:`${Math.min(100, (count / (stats.topWords[0]?.[1] || 1)) * 100)}%` }} />
                      </div>
                      <div className="text-xs text-gray-500 w-8 text-right flex-shrink-0">{count}x</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="min-w-0 flex flex-col gap-4 w-full">

            {/* Platform limits */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
              <h3 className="text-sm font-bold text-white mb-4">📏 Platform Limits</h3>
              <div className="space-y-3 min-w-0 w-full">
                {[
                  { name:"Twitter / X",   limit:280,   icon:"🐦" },
                  { name:"Instagram Bio", limit:150,   icon:"📸" },
                  { name:"Google Ad",     limit:90,    icon:"📢" },
                  { name:"Meta Title",    limit:60,    icon:"🔍" },
                  { name:"Meta Desc",     limit:160,   icon:"📄" },
                  { name:"LinkedIn Post", limit:3000,  icon:"💼" },
                ].map(platform => {
                  const pct   = Math.min(100, Math.round((stats.chars / platform.limit) * 100));
                  const color = pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-yellow-400" : "bg-green-400";
                  return (
                    <div key={platform.name} className="min-w-0 w-full">
                      <div className="flex justify-between text-xs mb-1 min-w-0 w-full">
                        <span className="text-gray-400 truncate pr-2">{platform.icon} {platform.name}</span>
                        <span className={`flex-shrink-0 ${pct >= 100 ? "text-red-400" : "text-gray-600"}`}>{stats.chars}/{platform.limit}</span>
                      </div>
                      <div className="bg-[#0A0A14] rounded-full h-1.5 w-full">
                        <div className={`${color} h-1.5 rounded-full transition-all duration-300`} style={{ width:`${Math.min(100,pct)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Related tools */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
              <h3 className="text-sm font-bold text-white mb-4">🔧 Related Tools</h3>
              <div className="space-y-2 min-w-0 w-full">
                {RELATED_TOOLS.map(tool => (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#0A0A14] transition-colors group min-w-0">
                    <span className="text-xl flex-shrink-0">{tool.icon}</span>
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors min-w-0 truncate">{tool.name}</span>
                    <span className="ml-auto text-gray-700 group-hover:text-[#6C3AFF] flex-shrink-0">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Pro CTA */}
            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 text-center min-w-0 w-full">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-white text-sm mb-1">PursTech Pro</h3>
              <p className="text-gray-500 text-xs mb-4">Unlimited usage, zero ads, priority AI tools</p>
              <Link href="/pro"
                className="block w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all text-center">
                Get Pro — $7/mo
              </Link>
            </div>
          </div>
        </div>

        {/* ── Rich content: Why Word Count Matters ─────────────────────── */}
        <section className="mt-16 min-w-0 w-full">
          <h2 className="text-2xl font-extrabold text-white mb-2">Why Word Count Matters</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-2xl leading-relaxed">Whether you are writing an essay, optimising a web page or posting on social media, word and character counts have real consequences for your work.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0 w-full">
            {USE_CASES.map(u => (
              <div key={u.title} className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
                <div className="text-2xl mb-2 flex-shrink-0">{u.icon}</div>
                <div className="font-bold text-white text-sm mb-2 truncate pr-2">{u.title}</div>
                <p className="text-gray-500 text-xs leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Use */}
        <section className="mt-12 min-w-0 w-full">
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use the Word Counter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0 w-full">
            {[
              { step:"1", title:"Paste or Type",      desc:"Click the text box above and paste your content or start typing directly. Works with any language." },
              { step:"2", title:"See Instant Results", desc:"Word count, characters, reading time, unique words and keyword density update in real time as you type — no button needed." },
              { step:"3", title:"Copy or Export",     desc:"Use Copy Stats to save a full analysis report to your clipboard. Check Platform Limits to see if your text fits Twitter, Instagram or Google Ads." },
            ].map(s => (
              <div key={s.step} className="bg-[#13131F] border border-white/5 rounded-2xl p-6 min-w-0 w-full">
                <div className="w-10 h-10 rounded-full bg-[#6C3AFF]/20 border border-[#6C3AFF]/30 flex items-center justify-center text-[#6C3AFF] font-black text-lg mb-4 flex-shrink-0">{s.step}</div>
                <h3 className="font-bold text-white mb-2 truncate pr-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ — ✅ Rule 8: <details>/<summary> */}
        <section className="mt-12 min-w-0 w-full">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3 max-w-3xl min-w-0 w-full">
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
      </main>

      {/* ✅ Rule 5: Privacy/Terms/Contact + © 2026 */}
      <footer className="border-t border-white/5 mt-20 py-8 text-center min-w-0 w-full">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
