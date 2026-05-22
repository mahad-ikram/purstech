"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ ADDED

// ── Stop words ────────────────────────────────────────────────────────────────
const STOP = new Set(["the","a","an","and","or","but","in","on","at","to","for","of","with","by","from","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","could","should","may","might","shall","that","this","these","those","it","its","i","you","he","she","we","they","me","him","her","us","them","my","your","his","our","their","not","no","so","if","as","than","then","when","where","what","which","who","how","all","each","every","both","few","more","most","other","some","such","only","own","same","just","any","can","about","into","through","during","before","after","above","below","between","out","off","over","under","again","further","once","very","also","still","even","much","well","back","there","here","up","down","than","now","its","itself"]);

interface Stat { text: string; count: number; density: number; }

function analyze(text: string, target: string, ngram: 1|2|3, includeStops: boolean) {
  if (!text.trim()) return { words:0, chars:0, sentences:0, paragraphs:0, unigrams:[], bigrams:[], trigrams:[], targetResult:null, readability:null };

  const clean    = text.toLowerCase();
  const allWords = (clean.match(/\b[a-z']+\b/g) || []);
  const words    = allWords.length;
  const chars    = text.length;
  const sentences   = Math.max(1, (text.match(/[.!?]+/g) || []).length);
  const paragraphs  = Math.max(1, text.split(/\n\s*\n/).length);

  const syllables   = allWords.reduce((acc, w) => acc + Math.max(1, w.replace(/[^aeiou]/gi,"").length), 0);
  const fleschScore = Math.round(206.835 - 1.015*(words/sentences) - 84.6*(syllables/words));
  const fleschLabel = fleschScore >= 90 ? "Very Easy" : fleschScore >= 70 ? "Easy" : fleschScore >= 60 ? "Standard" : fleschScore >= 50 ? "Fairly Difficult" : fleschScore >= 30 ? "Difficult" : "Very Difficult";
  const fleschColor = fleschScore >= 60 ? "text-green-400" : fleschScore >= 40 ? "text-yellow-400" : "text-[#FF3A6C]";

  const shouldInclude = (w: string) => includeStops || (!STOP.has(w) && w.length > 2);

  const uFreq: Record<string,number> = {};
  allWords.forEach(w => { if (shouldInclude(w)) uFreq[w] = (uFreq[w]||0)+1; });
  const unigrams: Stat[] = Object.entries(uFreq).sort((a,b)=>b[1]-a[1]).slice(0,20)
    .map(([text,count]) => ({ text, count, density: parseFloat(((count/words)*100).toFixed(2)) }));

  const bFreq: Record<string,number> = {};
  for (let i=0; i<allWords.length-1; i++) {
    const pair = `${allWords[i]} ${allWords[i+1]}`;
    if (!STOP.has(allWords[i]) || !STOP.has(allWords[i+1])) bFreq[pair] = (bFreq[pair]||0)+1;
  }
  const bigrams: Stat[] = Object.entries(bFreq).sort((a,b)=>b[1]-a[1]).slice(0,15)
    .map(([text,count]) => ({ text, count, density: parseFloat(((count/(words-1))*100).toFixed(2)) }));

  const tFreq: Record<string,number> = {};
  for (let i=0; i<allWords.length-2; i++) {
    const tri = `${allWords[i]} ${allWords[i+1]} ${allWords[i+2]}`;
    tFreq[tri] = (tFreq[tri]||0)+1;
  }
  const trigrams: Stat[] = Object.entries(tFreq).filter(([,c])=>c>1).sort((a,b)=>b[1]-a[1]).slice(0,10)
    .map(([text,count]) => ({ text, count, density: parseFloat(((count/(words-2))*100).toFixed(2)) }));

  let targetResult = null;
  if (target.trim()) {
    const kw = target.trim().toLowerCase();
    const kwArr = kw.split(/\s+/);
    let count = 0;
    if (kwArr.length === 1) { allWords.forEach(w => { if (w === kw) count++; }); }
    else { let pos = 0; while ((pos = clean.indexOf(kw, pos)) !== -1) { count++; pos += kw.length; } }
    const density = words > 0 ? parseFloat(((count/words)*100).toFixed(2)) : 0;
    const status  = density === 0 ? "missing" : density < 0.5 ? "low" : density <= 2.5 ? "good" : "high";
    targetResult = { keyword: kw, count, density, status };
  }

  return { words, chars, sentences, paragraphs, unigrams, bigrams, trigrams, targetResult,
    readability: { score: fleschScore, label: fleschLabel, color: fleschColor } };
}

function buildHighlightedText(text: string, target: string): { type: "text"|"mark"; content: string }[] {
  if (!target.trim() || !text) return [{ type: "text", content: text }];
  const kw  = target.trim().toLowerCase();
  const parts: { type: "text"|"mark"; content: string }[] = [];
  let   pos = 0;
  const lower = text.toLowerCase();
  while (true) {
    const idx = lower.indexOf(kw, pos);
    if (idx === -1) { parts.push({ type:"text", content: text.slice(pos) }); break; }
    if (idx > pos)  parts.push({ type:"text", content: text.slice(pos, idx) });
    parts.push({ type:"mark", content: text.slice(idx, idx + kw.length) });
    pos = idx + kw.length;
  }
  return parts;
}

const STATUS_CFG: Record<string,{color:string;bg:string;label:string}> = {
  missing: { color:"text-gray-400",    bg:"bg-gray-400/10",    label:"Not found in text"              },
  low:     { color:"text-yellow-400",  bg:"bg-yellow-400/10",  label:"Too low — use more naturally"   },
  good:    { color:"text-green-400",   bg:"bg-green-400/10",   label:"Optimal density range"          },
  high:    { color:"text-[#FF3A6C]",   bg:"bg-[#FF3A6C]/10",   label:"Too high — risk of stuffing"    },
};

// ✅ UI Enhancement: sample article for Load Sample button
const SAMPLE_TEXT = `Keyword density is one of the foundational concepts in search engine optimisation. Understanding keyword density helps content creators write pages that rank well in search results while remaining readable and natural for human visitors.

When you analyse keyword density, you measure how often a target keyword appears relative to the total word count of a page. For example, if the keyword appears five times in a 500-word article, its keyword density is one percent.

Most SEO professionals recommend maintaining a keyword density between one and two percent for primary keywords. A density below half a percent suggests the keyword is underused. A density above three percent risks keyword stuffing, which search engines like Google actively penalise.

Modern search engine algorithms have moved beyond simple keyword counting. Google now understands topical relevance, synonyms and related terms. This means using semantic variations and related phrases is often more effective than repeating an exact keyword.

Bigram and trigram analysis helps identify over-repeated two and three word phrases that single-word analysis would miss. Toggle the n-gram selector above to switch between single keywords, two-word phrases and three-word phrases for deeper content analysis.`;

export default function KeywordDensityClient() {
  useTrackTool("keyword-density-checker", "seo"); // ✅ ADDED

  const [text,          setText]          = useState("");
  const [target,        setTarget]        = useState("");
  const [ngram,         setNgram]         = useState<1|2|3>(1);
  const [includeStops,  setIncludeStops]  = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);

  const result      = useMemo(() => analyze(text, target, ngram, includeStops), [text, target, ngram, includeStops]);
  const highlighted = useMemo(() => buildHighlightedText(text, target), [text, target]);
  const activeList  = ngram === 1 ? result.unigrams : ngram === 2 ? result.bigrams : result.trigrams;

  function exportCSV() {
    const rows = [["Keyword","Count","Density %"], ...activeList.map(s => [s.text, s.count, s.density])];
    const csv  = rows.map(r => r.join(",")).join("\n");
    Object.assign(document.createElement("a"), {
      href:     URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
      download: "keyword-density.csv",
    }).click();
  }

  const statusCfg = result.targetResult ? STATUS_CFG[result.targetResult.status] : null;

  return (
    // ✅ CRITICAL QA FIX: Added flex-col and overflow-x-hidden for mobile protection
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden">

      {/* Navbar — ✅ Go Pro added */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">Tools</Link>
            <Link href="/blog" className="text-sm text-gray-500 hover:text-white transition-colors">Blog</Link>
            <Link href="/pro" className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
          <Link href="/" className="sm:hidden text-sm text-gray-500 hover:text-white transition-colors">← Home</Link>
        </div>
      </nav>

      {/* ✅ CRITICAL QA FIX: Added flex-grow and w-full */}
      <main className="max-w-6xl mx-auto px-4 py-10 flex-grow w-full">

        {/* Breadcrumb — ✅ aria-label + flex-wrap + aria-hidden */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/seo" className="hover:text-gray-400 transition-colors">SEO Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">Keyword Density Checker</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">SEO Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Free Keyword Density Checker Online</h1>
          <p className="text-gray-400 max-w-2xl">Analyse keyword frequency, density and n-grams in your content. Get readability scores, highlight keywords in context, and export results to CSV.</p>
        </div>

        {/* Target + Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 min-w-0">
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 min-w-0">
            <label className="block text-sm font-semibold text-white mb-2">Target Keyword / Phrase</label>
            <input value={target} onChange={e => setTarget(e.target.value)}
              placeholder="e.g. keyword density checker"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all min-w-0" />
          </div>
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm font-semibold text-white flex-1">N-gram Analysis</label>
              <div className="flex flex-wrap gap-1 bg-[#0A0A14] p-1 rounded-lg">
                {([1,2,3] as const).map(n => (
                  <button key={n} onClick={() => setNgram(n)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${ngram===n?"bg-[#6C3AFF] text-white":"text-gray-400 hover:text-white"}`}>
                    {n === 1 ? "1-word" : n === 2 ? "2-word" : "3-word"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-white flex-1">Include stop words</span>
              <button onClick={() => setIncludeStops(p => !p)}
                className={`w-10 h-5 rounded-full transition-all relative ${includeStops?"bg-[#6C3AFF]":"bg-gray-700"}`}
                role="switch" aria-checked={includeStops}>
                <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${includeStops?"left-[22px]":"left-0.5"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Text input */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-6 min-w-0">
          <div className="xl:col-span-3 bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0">
            <div className="flex flex-wrap items-center justify-between mb-2 gap-3">
              <label className="text-sm font-semibold text-white">Your Content</label>
              <div className="flex flex-wrap items-center gap-3">
                {target && (
                  <button onClick={() => setShowHighlight(p => !p)}
                    className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                      showHighlight ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"
                    }`}>
                    {showHighlight ? "✓ Highlighting" : "Highlight keyword"}
                  </button>
                )}
                <span className="text-xs text-gray-500">{result.words} words</span>
              </div>
            </div>

            {showHighlight && target && text ? (
              <div className="w-full min-h-[280px] px-4 py-3 rounded-xl bg-[#0A0A14] border border-[#6C3AFF]/30 text-sm text-gray-300 leading-relaxed overflow-auto whitespace-pre-wrap break-words">
                {highlighted.map((part, i) =>
                  part.type === "mark"
                    ? <mark key={i} className="bg-yellow-400/40 text-yellow-200 rounded px-0.5">{part.content}</mark>
                    : <span key={i}>{part.content}</span>
                )}
              </div>
            ) : (
              <textarea value={text} onChange={e => setText(e.target.value)} rows={12}
                placeholder="Paste your article, blog post or page content here for instant keyword density analysis..."
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all resize-none min-w-0" />
            )}

            {/* ✅ UI Enhancement: Load Sample + Clear buttons */}
            <div className="flex items-center justify-between mt-3">
              <button onClick={() => { setText(SAMPLE_TEXT); setTarget("keyword density"); setShowHighlight(false); }}
                className="text-xs text-gray-600 hover:text-[#6C3AFF] transition-colors underline underline-offset-2">
                Load sample article
              </button>
              {text && (
                <button onClick={() => { setText(""); setShowHighlight(false); setTarget(""); }}
                  className="text-xs text-gray-600 hover:text-[#FF3A6C] transition-colors">
                  × Clear
                </button>
              )}
            </div>
          </div>

          {/* Stats column */}
          <div className="xl:col-span-2 space-y-4 min-w-0">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 min-w-0">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Content Stats</h3>
              <div className="grid grid-cols-2 gap-3 min-w-0">
                {[
                  { label:"Words",      value: result.words },
                  { label:"Characters", value: result.chars },
                  { label:"Sentences",  value: result.sentences },
                  { label:"Paragraphs", value: result.paragraphs },
                ].map(s => (
                  <div key={s.label} className="bg-[#0A0A14] rounded-xl p-3 text-center min-w-0">
                    <div className="text-xl font-extrabold text-[#6C3AFF] truncate">{s.value.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 truncate">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {result.readability && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 min-w-0">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Flesch Readability Score</h3>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <div className={`text-3xl font-extrabold ${result.readability.color}`}>{result.readability.score}</div>
                  <div className="min-w-0">
                    <div className={`text-sm font-bold ${result.readability.color} truncate`}>{result.readability.label}</div>
                    <div className="text-xs text-gray-500 truncate">out of 100</div>
                  </div>
                </div>
                <div className="h-1.5 bg-[#0A0A14] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${result.readability.score >= 60 ? "bg-green-500" : result.readability.score >= 40 ? "bg-yellow-500" : "bg-[#FF3A6C]"}`}
                    style={{ width:`${Math.min(100, Math.max(0, result.readability.score))}%` }} />
                </div>
              </div>
            )}

            {result.targetResult && statusCfg && (
              <div className={`rounded-2xl p-4 border ${statusCfg.bg} border-white/5 min-w-0`}>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Target Keyword</h3>
                <div className="text-sm font-bold text-white mb-2 truncate" title={result.targetResult.keyword}>"{result.targetResult.keyword}"</div>
                <div className="grid grid-cols-2 gap-2 min-w-0">
                  <div className="bg-[#0A0A14]/50 rounded-xl p-2 text-center min-w-0">
                    <div className={`text-xl font-extrabold ${statusCfg.color} truncate`}>{result.targetResult.count}</div>
                    <div className="text-xs text-gray-500 truncate">occurrences</div>
                  </div>
                  <div className="bg-[#0A0A14]/50 rounded-xl p-2 text-center min-w-0">
                    <div className={`text-xl font-extrabold ${statusCfg.color} truncate`}>{result.targetResult.density}%</div>
                    <div className="text-xs text-gray-500 truncate">density</div>
                  </div>
                </div>
                <div className={`text-xs mt-2 ${statusCfg.color} break-words`}>{statusCfg.label}</div>
              </div>
            )}
          </div>
        </div>

        {/* Keyword table */}
        {activeList.length > 0 && (
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 overflow-hidden w-full">
            <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
              <h2 className="text-lg font-extrabold text-white">
                📊 Top {ngram === 1 ? "Keywords" : ngram === 2 ? "2-Word Phrases" : "3-Word Phrases"}
              </h2>
              <button onClick={exportCSV}
                className="px-4 py-1.5 rounded-lg bg-[#13131F] border border-white/10 text-gray-400 hover:text-white text-xs font-bold transition-all">
                ⬇ Export CSV
              </button>
            </div>
            {/* ✅ CRITICAL QA FIX: Mobile-safe wrapper for the table */}
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-white/5">
                    <th className="text-left py-2 pl-2 w-8">#</th>
                    <th className="text-left py-2">Keyword</th>
                    <th className="text-right py-2">Count</th>
                    <th className="text-right py-2 pr-2">Density</th>
                    <th className="py-2 pr-2 w-32">Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  {activeList.map((stat, i) => {
                    const isTarget = target && stat.text.includes(target.toLowerCase().trim());
                    return (
                      <tr key={stat.text}
                        className={`border-b border-white/5 transition-colors ${isTarget?"bg-[#6C3AFF]/10":"hover:bg-white/[0.02]"}`}>
                        <td className="py-2.5 pl-2 text-gray-600 text-xs">{i+1}</td>
                        <td className={`py-2.5 font-medium ${isTarget?"text-[#6C3AFF]":"text-white"}`}>
                          {stat.text} {isTarget && <span className="text-xs ml-1">🎯</span>}
                        </td>
                        <td className="py-2.5 text-right text-gray-400">{stat.count}</td>
                        <td className="py-2.5 text-right text-gray-400 pr-2">{stat.density}%</td>
                        <td className="py-2.5 pr-2">
                          <div className="h-1.5 bg-[#0A0A14] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${isTarget?"bg-[#6C3AFF]":"bg-[#6C3AFF]/50"}`}
                              style={{ width:`${Math.min((stat.count / (activeList[0]?.count || 1)) * 100, 100)}%` }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the Keyword Density Checker</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step:"1", title:"Paste your content",    desc:"Paste your full article or page content in the text area. Stats update instantly. Click Load sample article to demo with example text." },
              { step:"2", title:"Enter target keyword",  desc:"Type your target keyword or phrase to see exactly how many times it appears and its density percentage with a status indicator." },
              { step:"3", title:"Switch n-gram tabs",    desc:"Toggle between 1-word, 2-word and 3-word analysis to find over-repeated phrases you might have missed." },
              { step:"4", title:"Highlight & export",    desc:"Toggle keyword highlight to see context. Export your results as CSV for content audit spreadsheets." },
            ].map(s => (
              <div key={s.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#6C3AFF] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">{s.step}</div>
                <div>
                  <div className="font-semibold text-white text-sm mb-1">{s.title}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ — always last */}
        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q:"What is keyword density and why does it matter for SEO?",
                a:"Keyword density is the percentage of times a target keyword appears in content relative to total word count. It signals to search engines what topic a page covers. Modern SEO focuses on natural usage rather than hitting specific percentages — Google understands topical relevance without exact keyword repetitions." },
              { q:"What is the ideal keyword density percentage?",
                a:"Most SEO professionals suggest keeping primary keyword density between 1% and 2% for natural-sounding content. Below 0.5% the keyword may not appear prominently enough. Above 3% risks appearing as keyword stuffing, which Google penalises with ranking demotions. Use our density bar to stay in the green zone." },
              { q:"What is an n-gram in keyword analysis?",
                a:"An n-gram is a contiguous sequence of n words. A 1-gram (unigram) is a single word. A 2-gram (bigram) is a two-word phrase like 'keyword density'. A 3-gram (trigram) is three words like 'free seo tools'. Analysing bigrams and trigrams reveals repeated phrases that individual word analysis would miss." },
              { q:"What is the Flesch Reading Ease score?",
                a:"The Flesch Reading Ease score (0–100) measures how easy a piece of text is to read. Scores above 60 are considered standard or easy. Scores below 30 are very difficult. For general web content, aim for 60–70. Blog posts and marketing copy perform best between 65–80." },
              { q:"What is keyword stuffing and how do I avoid it?",
                a:"Keyword stuffing is unnaturally repeating a target keyword to manipulate rankings. Signs include a density above 3%, forced keyword insertion that disrupts reading flow, and keywords in every sentence. Google penalises this. Write naturally and use semantic variations and related terms instead." },
            ].map((faq, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{faq.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </main>

      {/* Footer — ✅ About→Terms, © 2026 */}
      <footer className="border-t border-white/5 mt-auto py-8 text-center bg-[#0A0A14]">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center flex-wrap gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
