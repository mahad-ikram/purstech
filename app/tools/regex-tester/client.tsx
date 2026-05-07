"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const REGEX_FAQ = [
  {
    q: "What is a Regular Expression (Regex)?",
    a: "A regular expression (regex) is a sequence of characters that forms a search pattern. It is used in programming and text processing to search, match, and manipulate strings. For example, regex can be used to validate if an input is a properly formatted email address, or to extract all phone numbers from a massive document.",
  },
  {
    q: "What do the different Regex flags do (g, i, m)?",
    a: "Flags change how the search is performed. 'g' (Global) tells the engine to find all matches rather than stopping at the first one. 'i' (Case-insensitive) makes the search ignore uppercase and lowercase differences. 'm' (Multiline) changes the behavior of start (^) and end ($) anchors to match the beginning and end of each line, rather than just the whole string.",
  },
  {
    q: "What are Capture Groups?",
    a: "Capture groups are created by wrapping part of your regex in parentheses '()'. They allow you to extract specific parts of a match. For example, in a regex matching a date like '(\\d{4})-(\\d{2})-(\\d{2})', group 1 extracts the year, group 2 extracts the month, and group 3 extracts the day.",
  },
  {
    q: "Why does execution time matter in Regex?",
    a: "Poorly written regular expressions can cause 'Catastrophic Backtracking', where the engine takes an exponential amount of time to fail a match. This can freeze browsers or crash servers (a ReDoS attack). Our execution time telemetry helps you ensure your regex runs efficiently in milliseconds.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type":    "FAQPage",
  mainEntity: REGEX_FAQ.map(f => ({
    "@type": "Question",
    name:    f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const PRESETS = [
  { label: "Email Address", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", flags: "g" },
  { label: "URL / Website", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)", flags: "g" },
  { label: "IPv4 Address", pattern: "\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b", flags: "g" },
  { label: "Hex Color", pattern: "#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})", flags: "g" },
  { label: "HTML Tags", pattern: "<\\/?([a-z][a-z0-9]*)\\b[^>]*>", flags: "g" },
  { label: "Phone Number (US)", pattern: "\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b", flags: "g" }
];

export default function RegexTesterClient() {
  const [pattern, setPattern] = useState("([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\\.([a-zA-Z]{2,})");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("Contact us at support@purstech.com or billing@purstech.com for assistance.");
  
  const [activeTab, setActiveTab] = useState<"cheatsheet" | "presets">("presets");

  const result = useMemo(() => {
    if (!pattern) return { nodes: [{ text: testString, isMatch: false }], matches: [], error: null, time: 0 };
    
    try {
      const start = performance.now();
      const re = new RegExp(pattern, flags);
      const matches = [];
      const nodes = [];
      let lastIndex = 0;

      if (flags.includes('g')) {
        let match;
        let count = 0;
        // Cap at 2000 matches to prevent browser freeze on zero-length matches
        while ((match = re.exec(testString)) !== null && count < 2000) {
          if (match.index === re.lastIndex) re.lastIndex++; // Prevent infinite loops
          
          if (match[0].length > 0) {
            if (match.index > lastIndex) {
              nodes.push({ text: testString.slice(lastIndex, match.index), isMatch: false });
            }
            nodes.push({ text: match[0], isMatch: true, matchIndex: count + 1 });
            lastIndex = match.index + match[0].length;
            matches.push(match);
          }
          count++;
        }
      } else {
        const match = re.exec(testString);
        if (match && match[0].length > 0) {
          if (match.index > 0) {
            nodes.push({ text: testString.slice(0, match.index), isMatch: false });
          }
          nodes.push({ text: match[0], isMatch: true, matchIndex: 1 });
          lastIndex = match.index + match[0].length;
          matches.push(match);
        }
      }

      if (lastIndex < testString.length) {
        nodes.push({ text: testString.slice(lastIndex), isMatch: false });
      }

      const time = performance.now() - start;
      return { nodes, matches, error: null, time };
    } catch (err: any) {
      return { nodes: [{ text: testString, isMatch: false }], matches: [], error: err.message, time: 0 };
    }
  }, [pattern, flags, testString]);

  const toggleFlag = (flag: string) => {
    setFlags(prev => prev.includes(flag) ? prev.replace(flag, '') : prev + flag);
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span>›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span>›</span>
          <span className="text-gray-400">Regex Tester</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">Developer Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Advanced Regex Tester & Debugger</h1>
          <p className="text-gray-400 max-w-2xl">Write, test, and debug regular expressions in real-time. Features live match highlighting, execution telemetry, and automatic capture group extraction.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Workspace */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Regex Input */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 shadow-2xl">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Regular Expression</label>
              
              <div className="flex items-stretch rounded-xl overflow-hidden border border-white/10 focus-within:border-[#6C3AFF]/60 transition-all bg-[#0A0A14]">
                <div className="px-4 py-4 bg-[#13131F] border-r border-white/5 text-gray-500 font-mono text-xl flex items-center justify-center">/</div>
                <input 
                  type="text" 
                  value={pattern} 
                  onChange={e => setPattern(e.target.value)}
                  className="flex-1 px-4 py-4 bg-transparent text-[#00D4FF] font-mono text-lg focus:outline-none placeholder-gray-700 w-full"
                  placeholder="Enter regex pattern here..."
                  spellCheck={false}
                />
                <div className="px-4 py-4 bg-[#13131F] border-l border-white/5 text-gray-500 font-mono text-xl flex items-center justify-center">/</div>
                <input 
                  type="text" 
                  value={flags} 
                  onChange={e => setFlags(e.target.value.replace(/[^gimsuy]/g, ''))}
                  className="w-20 px-3 py-4 bg-transparent text-[#FF3A6C] font-mono text-lg focus:outline-none placeholder-gray-700 border-l border-white/5"
                  placeholder="flags"
                  maxLength={6}
                  spellCheck={false}
                />
              </div>
              
              <div className="flex gap-2 mt-4 flex-wrap">
                {[
                  { key: "g", label: "Global", desc: "All matches" },
                  { key: "i", label: "Insensitive", desc: "Ignore case" },
                  { key: "m", label: "Multiline", desc: "^ and $ match lines" }
                ].map(f => (
                  <button 
                    key={f.key} 
                    onClick={() => toggleFlag(f.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                      flags.includes(f.key) 
                      ? "bg-[#6C3AFF] text-white border-[#6C3AFF]" 
                      : "bg-[#0A0A14] text-gray-500 border-white/5 hover:border-white/20"
                    }`}
                  >
                    /{f.key} <span className="font-sans font-normal opacity-70 ml-1">{f.label}</span>
                  </button>
                ))}
              </div>

              {result.error && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono break-all">
                  ⚠ Error: {result.error}
                </div>
              )}
            </div>

            {/* Test String Input */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 shadow-2xl">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Test String</label>
                <div className="text-xs text-gray-500">Characters: {testString.length}</div>
              </div>
              <textarea 
                value={testString}
                onChange={e => setTestString(e.target.value)}
                rows={5}
                placeholder="Paste the text you want to search through here..."
                className="w-full p-4 rounded-xl bg-[#0A0A14] border border-white/10 text-gray-300 font-mono text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Live Matches View */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Match Results</h3>
                  <span className="bg-[#6C3AFF]/20 text-[#6C3AFF] px-2 py-0.5 rounded font-bold text-xs">
                    {result.matches.length} matches
                  </span>
                </div>
                <div className="text-xs font-mono text-gray-500 flex items-center gap-2">
                  <span>⏱ {result.time.toFixed(2)}ms</span>
                  {result.time > 50 && <span className="text-yellow-400">⚠ Slow</span>}
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-[#0A0A14] border border-white/5 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words min-h-[120px] text-gray-400">
                {result.nodes.map((node, i) => (
                  node.isMatch ? (
                    <mark key={i} className={`px-0.5 rounded-sm text-white font-bold bg-[#6C3AFF] shadow-[0_0_8px_rgba(108,58,255,0.4)]`}>
                      {node.text}
                    </mark>
                  ) : (
                    <span key={i}>{node.text}</span>
                  )
                ))}
                {result.nodes.length === 1 && !result.nodes[0].isMatch && testString.length > 0 && (
                  <div className="text-gray-600 italic mt-2 opacity-50">No matches found...</div>
                )}
              </div>
            </div>

            {/* Match Groups Extraction Table */}
            {result.matches.length > 0 && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 shadow-2xl">
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Captured Groups Extraction</h3>
                 <div className="overflow-x-auto max-h-96">
                   <table className="w-full text-sm text-left font-mono">
                     <thead className="sticky top-0 bg-[#13131F]">
                       <tr className="text-gray-500 border-b border-white/10">
                         <th className="py-3 px-4 w-20">Match</th>
                         <th className="py-3 px-4">Full Match [0]</th>
                         {result.matches[0].length > 1 && (
                           Array.from({length: result.matches[0].length - 1}).map((_, i) => (
                             <th key={i} className="py-3 px-4 text-[#00D4FF]">Group [{i+1}]</th>
                           ))
                         )}
                       </tr>
                     </thead>
                     <tbody>
                       {result.matches.map((m, i) => (
                         <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                           <td className="py-3 px-4 text-gray-500">#{i + 1}</td>
                           <td className="py-3 px-4 text-green-400 break-all">{m[0]}</td>
                           {m.slice(1).map((group, gIdx) => (
                             <td key={gIdx} className="py-3 px-4 text-white break-all">{group !== undefined ? group : <span className="text-gray-600">null</span>}</td>
                           ))}
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
              </div>
            )}
          </div>

          {/* Side Panel: Cheat Sheet & Presets */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl flex flex-col overflow-hidden h-fit shadow-2xl">
            <div className="flex border-b border-white/5">
              <button 
                onClick={() => setActiveTab("presets")}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "presets" ? "bg-[#6C3AFF] text-white" : "text-gray-500 hover:text-white"}`}
              >
                Presets
              </button>
              <button 
                onClick={() => setActiveTab("cheatsheet")}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "cheatsheet" ? "bg-[#6C3AFF] text-white" : "text-gray-500 hover:text-white"}`}
              >
                Cheat Sheet
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[600px]">
              {activeTab === "presets" && (
                <div className="space-y-2">
                  {PRESETS.map((p, i) => (
                    <div key={i} onClick={() => { setPattern(p.pattern); setFlags(p.flags); }} className="bg-[#0A0A14] border border-white/5 rounded-xl p-3 cursor-pointer hover:border-[#6C3AFF]/50 transition-all group">
                      <div className="text-sm font-bold text-white mb-1 group-hover:text-[#6C3AFF] transition-colors">{p.label}</div>
                      <div className="text-xs font-mono text-gray-500 break-all">/{p.pattern}/{p.flags}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "cheatsheet" && (
                <div className="space-y-6 text-sm">
                  <div>
                    <h4 className="font-bold text-[#6C3AFF] mb-2 border-b border-white/10 pb-1">Character Classes</h4>
                    <div className="grid grid-cols-[30px_1fr] gap-y-2 font-mono text-xs">
                      <span className="text-[#00D4FF]">.</span><span className="text-gray-400">Any character except newline</span>
                      <span className="text-[#00D4FF]">\w</span><span className="text-gray-400">Word character [a-zA-Z0-9_]</span>
                      <span className="text-[#00D4FF]">\d</span><span className="text-gray-400">Digit [0-9]</span>
                      <span className="text-[#00D4FF]">\s</span><span className="text-gray-400">Whitespace</span>
                      <span className="text-[#00D4FF]">\W</span><span className="text-gray-400">Not a word character</span>
                      <span className="text-[#00D4FF]">\D</span><span className="text-gray-400">Not a digit</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#6C3AFF] mb-2 border-b border-white/10 pb-1">Anchors & Boundaries</h4>
                    <div className="grid grid-cols-[30px_1fr] gap-y-2 font-mono text-xs">
                      <span className="text-[#00D4FF]">^</span><span className="text-gray-400">Start of string/line</span>
                      <span className="text-[#00D4FF]">$</span><span className="text-gray-400">End of string/line</span>
                      <span className="text-[#00D4FF]">\b</span><span className="text-gray-400">Word boundary</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#6C3AFF] mb-2 border-b border-white/10 pb-1">Quantifiers</h4>
                    <div className="grid grid-cols-[30px_1fr] gap-y-2 font-mono text-xs">
                      <span className="text-[#00D4FF]">*</span><span className="text-gray-400">0 or more times</span>
                      <span className="text-[#00D4FF]">+</span><span className="text-gray-400">1 or more times</span>
                      <span className="text-[#00D4FF]">?</span><span className="text-gray-400">0 or 1 time (optional)</span>
                      <span className="text-[#00D4FF]">&#123;3&#125;</span><span className="text-gray-400">Exactly 3 times</span>
                      <span className="text-[#00D4FF]">&#123;3,&#125;</span><span className="text-gray-400">3 or more times</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-8">
          <h2 className="text-xl font-extrabold text-white mb-6">How to Use the Regex Tester</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-gray-400">
            {[
              {step:"1",title:"Write your pattern",desc:"Enter your regular expression in the top bar. Use the cheat sheet on the right if you need a syntax reminder."},
              {step:"2",title:"Set search flags",desc:"Toggle 'g' for global search, 'i' for case-insensitive, or 'm' for multiline processing."},
              {step:"3",title:"Input test text",desc:"Paste the block of text you want to search through into the Test String box. Matches highlight instantly."},
              {step:"4",title:"Review extractions",desc:"Scroll down to the extraction table to see exactly what data was isolated into Capture Groups."},
            ].map(s => (
              <div key={s.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#6C3AFF]/20 text-[#6C3AFF] border border-[#6C3AFF]/30 flex items-center justify-center font-bold flex-shrink-0">{s.step}</div>
                <div>
                  <div className="font-bold text-white mb-1.5 text-base">{s.title}</div>
                  <div className="leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {REGEX_FAQ.map((faq, i) => (
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

      <footer className="border-t border-white/5 mt-16 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/about" className="hover:text-gray-400 transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
