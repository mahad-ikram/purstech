"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface WordStat {
  word:    string;
  count:   number;
  density: number;
}

function analyzeText(text: string, targetKeyword: string) {
  if (!text.trim()) return { wordCount: 0, charCount: 0, sentenceCount: 0, wordStats: [], targetStats: null };

  const words    = text.toLowerCase().match(/\b[a-z']+\b/g) || [];
  const wordCount = words.length;
  const charCount = text.length;
  const sentenceCount = (text.match(/[.!?]+/g) || []).length || 1;

  // Stop words to exclude from top words
  const STOP = new Set(["the","a","an","and","or","but","in","on","at","to","for","of","with","by","from","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","could","should","may","might","shall","that","this","these","those","it","its","i","you","he","she","we","they","me","him","her","us","them","my","your","his","our","their","not","no","so","if","as","than","then","when","where","what","which","who","how","all","each","every","both","few","more","most","other","some","such","only","own","same","just","any","can","about","into","through","during","before","after","above","below","between","out","off","over","under","again","further","once"]);

  const freq: Record<string, number> = {};
  words.forEach(w => {
    if (!STOP.has(w) && w.length > 2) freq[w] = (freq[w] || 0) + 1;
  });

  const wordStats: WordStat[] = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count]) => ({
      word,
      count,
      density: parseFloat(((count / wordCount) * 100).toFixed(2)),
    }));

  // Target keyword analysis
  let targetStats = null;
  if (targetKeyword.trim()) {
    const kw = targetKeyword.toLowerCase().trim();
    const kwWords = kw.split(/\s+/);
    let count = 0;
    const positions: number[] = [];

    if (kwWords.length === 1) {
      // Single word
      words.forEach((w, i) => {
        if (w === kw) { count++; positions.push(i + 1); }
      });
    } else {
      // Phrase match
      const textLower = text.toLowerCase();
      let pos = 0;
      while ((pos = textLower.indexOf(kw, pos)) !== -1) {
        count++;
        // Approximate word position
        const before = textLower.slice(0, pos).match(/\b\w+\b/g);
        positions.push((before?.length || 0) + 1);
        pos += kw.length;
      }
    }

    const density = wordCount > 0 ? parseFloat(((count / wordCount) * 100).toFixed(2)) : 0;
    const status  = density < 0.5 ? "low" : density > 3 ? "high" : "good";

    targetStats = { keyword: kw, count, density, positions: positions.slice(0, 10), status };
  }

  return { wordCount, charCount, sentenceCount, wordStats, targetStats };
}

export default function KeywordDensityClient() {
  const [text,    setText]    = useState("");
  const [keyword, setKeyword] = useState("");

  const result = useMemo(() => analyzeText(text, keyword), [text, keyword]);

  const statusColors: Record<string, string> = {
    low:  "text-yellow-400",
    good: "text-green-400",
    high: "text-[#FF3A6C]",
  };

  const statusLabels: Record<string, string> = {
    low:  "Too Low — consider using the keyword more naturally",
    good: "Good — keyword density is in the optimal range",
    high: "Too High — may be flagged as keyword stuffing",
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10">

        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link>
          <span>›</span>
          <span className="text-gray-400">Keyword Density Checker</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            SEO Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Keyword Density Checker Online
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Paste your content and instantly see keyword frequency, density percentage and top words. Spot keyword stuffing or under-optimization before you publish.
          </p>
        </div>

        {/* Target keyword input */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 mb-5">
          <label className="block text-sm font-semibold text-white mb-2">
            Target Keyword (optional)
          </label>
          <input value={keyword} onChange={e => setKeyword(e.target.value)}
            placeholder="e.g. keyword density checker"
            className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
          <p className="text-xs text-gray-500 mt-1.5">Enter a word or phrase to get its specific density and positions in your text.</p>
        </div>

        {/* Text input */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-white">Your Content</label>
            <span className="text-xs text-gray-500">{result.wordCount} words · {result.charCount} chars</span>
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={10}
            placeholder="Paste your article, blog post or page content here and get instant keyword density analysis..."
            className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all resize-none" />
          {text && (
            <button onClick={() => setText("")}
              className="mt-2 text-xs text-gray-500 hover:text-[#FF3A6C] transition-colors">
              × Clear text
            </button>
          )}
        </div>

        {/* Stats row */}
        {result.wordCount > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Words",     value: result.wordCount.toLocaleString()     },
              { label: "Characters",value: result.charCount.toLocaleString()     },
              { label: "Sentences", value: result.sentenceCount.toLocaleString() },
            ].map(stat => (
              <div key={stat.label} className="bg-[#13131F] border border-white/5 rounded-2xl p-4 text-center">
                <div className="text-2xl font-extrabold text-[#6C3AFF] mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Target keyword result */}
        {result.targetStats && (
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 mb-6">
            <h3 className="font-bold text-white mb-4">
              🎯 Target Keyword: <span className="text-[#6C3AFF]">"{result.targetStats.keyword}"</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-[#0A0A14] rounded-xl p-3 text-center">
                <div className="text-xl font-extrabold text-white">{result.targetStats.count}</div>
                <div className="text-xs text-gray-500">Occurrences</div>
              </div>
              <div className="bg-[#0A0A14] rounded-xl p-3 text-center">
                <div className={`text-xl font-extrabold ${statusColors[result.targetStats.status]}`}>
                  {result.targetStats.density}%
                </div>
                <div className="text-xs text-gray-500">Density</div>
              </div>
              <div className="bg-[#0A0A14] rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                <div className="text-xs text-gray-400 leading-relaxed mt-1">
                  {statusLabels[result.targetStats.status]}
                </div>
              </div>
            </div>

            {/* Density bar */}
            <div className="mb-1">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>0%</span><span>1%</span><span>2%</span><span>3%+</span>
              </div>
              <div className="h-2 bg-[#0A0A14] rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${
                  result.targetStats.status === "good" ? "bg-green-500" :
                  result.targetStats.status === "low"  ? "bg-yellow-500" : "bg-[#FF3A6C]"
                }`} style={{ width: `${Math.min(result.targetStats.density * 33.3, 100)}%` }} />
              </div>
            </div>

            {result.targetStats.positions.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">First occurrences at word positions:</p>
                <div className="flex flex-wrap gap-2">
                  {result.targetStats.positions.map((pos, i) => (
                    <span key={i} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] px-2 py-1 rounded-full border border-[#6C3AFF]/20">
                      #{pos}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Top words table */}
        {result.wordStats.length > 0 && (
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
            <h3 className="font-bold text-white mb-4">📊 Top Keywords in Your Content</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-white/5">
                    <th className="text-left py-2 pl-2">#</th>
                    <th className="text-left py-2">Keyword</th>
                    <th className="text-right py-2">Count</th>
                    <th className="text-right py-2 pr-2">Density</th>
                    <th className="py-2 pr-2">Bar</th>
                  </tr>
                </thead>
                <tbody>
                  {result.wordStats.map((stat, i) => (
                    <tr key={stat.word} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 pl-2 text-gray-600 text-xs">{i + 1}</td>
                      <td className="py-2.5 font-medium text-white">{stat.word}</td>
                      <td className="py-2.5 text-right text-gray-400">{stat.count}</td>
                      <td className="py-2.5 text-right text-gray-400 pr-2">{stat.density}%</td>
                      <td className="py-2.5 pr-2 w-24">
                        <div className="h-1.5 bg-[#0A0A14] rounded-full overflow-hidden">
                          <div className="h-full bg-[#6C3AFF] rounded-full"
                            style={{ width: `${Math.min((stat.count / result.wordStats[0].count) * 100, 100)}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      <footer className="border-t border-white/5 mt-16 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/about"   className="hover:text-gray-400 transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2025 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
