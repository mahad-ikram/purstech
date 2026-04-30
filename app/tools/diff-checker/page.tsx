"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const RELATED_TOOLS = [
  { icon: "📝", name: "Word Counter",    slug: "word-counter"    },
  { icon: "🔤", name: "Case Converter",  slug: "case-converter"  },
  { icon: "💻", name: "JSON Formatter",  slug: "json-formatter"  },
  { icon: "📄", name: "Lorem Ipsum Gen", slug: "lorem-ipsum"     },
  { icon: "📋", name: "Text Summarizer", slug: "text-summarizer" },
];

const FAQ = [
  { q: "What does a diff checker do?", a: "A diff checker compares two pieces of text and highlights the differences between them. Added text is shown in green, removed text in red, and unchanged text in white. This makes it easy to spot changes at a glance." },
  { q: "What can I use a diff checker for?", a: "Diff checkers are useful for comparing code versions, reviewing document edits, checking if two files are identical, proofreading text changes, and verifying that a copy/paste was done correctly." },
  { q: "Does it compare line by line or word by word?", a: "Our diff checker compares line by line by default. Lines that changed are highlighted, and within changed lines the specific added or removed words are marked." },
  { q: "Is the text I compare stored anywhere?", a: "No. All comparison happens instantly in your browser. Your text never leaves your device and is never stored on any server." },
  { q: "Can I compare code with the diff checker?", a: "Yes — paste any code into both panels. It works with any plain text including JavaScript, Python, HTML, CSS, JSON and more." },
];

// ── Diff algorithm ────────────────────────────────────────────────────────────

type DiffLine = { type: "added" | "removed" | "equal"; text: string; lineNum?: number };

function computeDiff(original: string, modified: string): DiffLine[] {
  const origLines = original.split("\n");
  const modLines  = modified.split("\n");
  const result: DiffLine[] = [];

  let i = 0, j = 0;
  while (i < origLines.length || j < modLines.length) {
    if (i >= origLines.length) {
      result.push({ type: "added",   text: modLines[j],  lineNum: j + 1 }); j++;
    } else if (j >= modLines.length) {
      result.push({ type: "removed", text: origLines[i], lineNum: i + 1 }); i++;
    } else if (origLines[i] === modLines[j]) {
      result.push({ type: "equal",   text: origLines[i], lineNum: i + 1 }); i++; j++;
    } else {
      // Simple: look ahead 2 lines for a match
      const origNext  = origLines[i + 1] === modLines[j];
      const modNext   = origLines[i]     === modLines[j + 1];
      if (origNext) {
        result.push({ type: "removed", text: origLines[i], lineNum: i + 1 }); i++;
      } else if (modNext) {
        result.push({ type: "added",   text: modLines[j],  lineNum: j + 1 }); j++;
      } else {
        result.push({ type: "removed", text: origLines[i], lineNum: i + 1 }); i++;
        result.push({ type: "added",   text: modLines[j],  lineNum: j + 1 }); j++;
      }
    }
  }
  return result;
}

const SAMPLE_ORIGINAL = `The quick brown fox jumps over the lazy dog.
This is the original version of the text.
It has three lines total.`;

const SAMPLE_MODIFIED = `The quick brown fox leaps over the lazy dog.
This is the modified version of the text.
It has three lines total.
A new line was added here.`;

export default function DiffCheckerPage() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [compared, setCompared] = useState(false);
  const [openFaq,  setOpenFaq]  = useState<number | null>(null);

  const diff = useMemo(() => compared ? computeDiff(original, modified) : [], [original, modified, compared]);

  const added   = diff.filter(d => d.type === "added").length;
  const removed = diff.filter(d => d.type === "removed").length;
  const same    = diff.filter(d => d.type === "equal").length;

  const loadSample = () => { setOriginal(SAMPLE_ORIGINAL); setModified(SAMPLE_MODIFIED); setCompared(false); };
  const clear      = () => { setOriginal(""); setModified(""); setCompared(false); };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <nav className="border-b border-white/5 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">← All Tools</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span>›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span>›</span>
          <Link href="/categories/text" className="hover:text-gray-400">Text Tools</Link><span>›</span>
          <span className="text-gray-400">Diff Checker</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🔍</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">Diff Checker</h1>
              <p className="text-gray-500 mt-1">Compare two texts and instantly highlight every difference — added, removed and changed lines.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Free","No Login","Line-by-line","Instant","Private"].map(b => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">✓ {b}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Two panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label:"Original Text", value:original, set:setOriginal, color:"text-red-400",   border:"focus:border-red-500/50" },
                { label:"Modified Text", value:modified, set:setModified, color:"text-green-400", border:"focus:border-green-500/50" },
              ].map(panel => (
                <div key={panel.label}>
                  <label className={`text-xs font-bold block mb-2 uppercase tracking-wider ${panel.color}`}>{panel.label}</label>
                  <textarea value={panel.value} onChange={e => { panel.set(e.target.value); setCompared(false); }}
                    placeholder={`Paste your ${panel.label.toLowerCase()} here...`}
                    className={`w-full h-52 px-4 py-3 rounded-2xl bg-[#13131F] border border-white/5 text-white placeholder-gray-600 focus:outline-none ${panel.border} transition-all resize-none text-sm font-mono leading-relaxed`} />
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setCompared(true)} disabled={!original.trim() || !modified.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] disabled:opacity-40 text-white text-sm font-bold transition-all shadow-lg shadow-violet-900/30">
                🔍 Compare Texts
              </button>
              <button onClick={loadSample}
                className="px-5 py-3 rounded-xl bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/30 text-gray-400 hover:text-white text-sm font-semibold transition-all">
                📋 Load Sample
              </button>
              <button onClick={clear}
                className="px-5 py-3 rounded-xl bg-[#13131F] border border-white/5 hover:border-red-500/30 text-gray-400 hover:text-red-400 text-sm font-semibold transition-all">
                🗑️ Clear
              </button>
            </div>

            {/* Results */}
            {compared && diff.length > 0 && (
              <div>
                {/* Summary */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {[
                    { label:"Lines added",    value:added,   color:"text-green-400 bg-green-400/10 border-green-400/20" },
                    { label:"Lines removed",  value:removed, color:"text-red-400 bg-red-400/10 border-red-400/20"       },
                    { label:"Lines unchanged",value:same,    color:"text-gray-400 bg-gray-400/10 border-gray-400/20"    },
                  ].map(s => (
                    <div key={s.label} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold ${s.color}`}>
                      <span className="text-lg font-extrabold">{s.value}</span>
                      <span className="text-xs">{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Diff view */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
                  <div className="px-4 py-2 border-b border-white/5 flex items-center gap-3">
                    <span className="text-xs text-gray-500 font-medium">Diff Result</span>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-green-500/30 rounded inline-block" />Added</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-500/30 rounded inline-block" />Removed</span>
                    </div>
                  </div>
                  <div className="overflow-auto max-h-96">
                    {diff.map((line, i) => (
                      <div key={i} className={`flex items-start font-mono text-xs px-4 py-1 ${
                        line.type === "added"   ? "bg-green-500/10" :
                        line.type === "removed" ? "bg-red-500/10" : ""
                      }`}>
                        <span className={`w-5 flex-shrink-0 mr-3 font-bold text-center ${
                          line.type === "added" ? "text-green-400" : line.type === "removed" ? "text-red-400" : "text-gray-700"
                        }`}>
                          {line.type === "added" ? "+" : line.type === "removed" ? "−" : " "}
                        </span>
                        <span className={`flex-1 break-all leading-relaxed ${
                          line.type === "added"   ? "text-green-300" :
                          line.type === "removed" ? "text-red-300" : "text-gray-400"
                        }`}>{line.text || " "}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {compared && original.trim() === modified.trim() && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-2">✅</div>
                <div className="text-green-400 font-bold">The two texts are identical</div>
                <div className="text-gray-500 text-sm mt-1">No differences found.</div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">🎯 Common Use Cases</h3>
              <div className="space-y-2 text-xs text-gray-500">
                {["Compare code versions","Review document edits","Check copy/paste accuracy","Spot accidental changes","Compare API responses","Review config file changes"].map(u => (
                  <div key={u} className="flex items-center gap-2"><span className="text-[#6C3AFF]">→</span><span>{u}</span></div>
                ))}
              </div>
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">🔧 Related Tools</h3>
              <div className="space-y-2">
                {RELATED_TOOLS.map(tool => (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#0A0A14] transition-colors group">
                    <span className="text-xl">{tool.icon}</span>
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{tool.name}</span>
                    <span className="ml-auto text-gray-700 group-hover:text-[#6C3AFF] transition-colors">→</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-white text-sm mb-1">PursTech Pro</h3>
              <p className="text-gray-500 text-xs mb-4">Unlimited file size, word-level diff, export</p>
              <button className="w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all">Get Pro — $7/mo</button>
            </div>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use the Diff Checker</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step:"1", title:"Paste Both Texts",   desc:"Paste your original text in the left panel and your modified or updated text in the right panel. Works with any plain text or code." },
              { step:"2", title:"Click Compare",      desc:"Hit the Compare Texts button. The tool instantly analyses both texts line by line and highlights every difference." },
              { step:"3", title:"Review the Results", desc:"Green lines were added, red lines were removed. Unchanged lines appear normally. A summary at the top shows the total count of each." },
            ].map(s => (
              <div key={s.step} className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-[#6C3AFF]/20 border border-[#6C3AFF]/30 flex items-center justify-center text-[#6C3AFF] font-black text-lg mb-4">{s.step}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <span className="font-semibold text-white text-sm">{item.q}</span>
                  <span className="text-[#6C3AFF] text-lg ml-4 flex-shrink-0">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && <div className="px-6 pb-4"><p className="text-gray-400 text-sm leading-relaxed">{item.a}</p></div>}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 mt-20 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <p className="text-gray-700 text-xs mt-2">© 2025 PursTech. Free online tools for everyone.</p>
      </footer>
    </div>
  );
}
