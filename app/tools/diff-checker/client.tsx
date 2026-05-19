"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ ADDED

const RELATED_TOOLS = [
  { icon:"📝", name:"Word Counter",   slug:"word-counter"   },
  { icon:"🔤", name:"Case Converter", slug:"case-converter" },
  { icon:"💻", name:"JSON Formatter", slug:"json-formatter" },
  { icon:"📄", name:"Lorem Ipsum",    slug:"lorem-ipsum"    },
  { icon:"🔊", name:"Text to Speech", slug:"text-to-speech" },
];

const FAQ = [
  { q:"What does a diff checker do?",              a:"A diff checker compares two pieces of text and highlights the differences between them. Added text is shown in green, removed text in red, and unchanged text in white. This makes it easy to spot changes at a glance." },
  { q:"What can I use a diff checker for?",        a:"Diff checkers are useful for comparing code versions, reviewing document edits, checking if two files are identical, proofreading text changes, and verifying that a copy/paste was done correctly." },
  { q:"Does it compare line by line or word by word?",a:"Our diff checker compares line by line by default. Lines that changed are highlighted, and within changed lines the specific added or removed words are marked." },
  { q:"Is the text I compare stored anywhere?",    a:"No. All comparison happens instantly in your browser. Your text never leaves your device and is never stored on any server." },
  { q:"Can I compare code with the diff checker?", a:"Yes — paste any code into both panels. It works with any plain text including JavaScript, Python, HTML, CSS, JSON and more." },
];

// ── Diff algorithm ─────────────────────────────────────────────────────────────
// ✅ UI Enhancement 2: ignoreWs param — skip whitespace-only differences

type DiffLine = { type:"added"|"removed"|"equal"; text:string; lineNum?: number };

function computeDiff(original: string, modified: string, ignoreWs = false): DiffLine[] {
  const origLines = original.split("\n");
  const modLines  = modified.split("\n");
  
  // Compare optionally trimmed, but always display original text
  const eq = (a: string, b: string) => ignoreWs ? a.trim() === b.trim() : a === b;
  const result: DiffLine[] = [];
  
  let i = 0, j = 0;
  while (i < origLines.length || j < modLines.length) {
    if (i >= origLines.length) {
      result.push({ type:"added",   text:modLines[j],  lineNum:j+1 }); j++;
    } else if (j >= modLines.length) {
      result.push({ type:"removed", text:origLines[i], lineNum:i+1 }); i++;
    } else if (eq(origLines[i], modLines[j])) {
      result.push({ type:"equal",   text:origLines[i], lineNum:i+1 }); i++; j++;
    } else {
      const origNext = i+1 < origLines.length && eq(origLines[i+1], modLines[j]);
      const modNext  = j+1 < modLines.length  && eq(origLines[i],   modLines[j+1]);
      
      if (origNext) {
        result.push({ type:"removed", text:origLines[i], lineNum:i+1 }); i++;
      } else if (modNext) {
        result.push({ type:"added",   text:modLines[j],  lineNum:j+1 }); j++;
      } else {
        result.push({ type:"removed", text:origLines[i], lineNum:i+1 }); i++;
        result.push({ type:"added",   text:modLines[j],  lineNum:j+1 }); j++;
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

export default function DiffCheckerClient() {
  // ✅ Track usage in Supabase → admin dashboard
  useTrackTool("diff-checker", "text");

  const [original,      setOriginal]      = useState("");
  const [modified,      setModified]      = useState("");
  const [compared,      setCompared]      = useState(false);
  
  // ✅ UI Enhancement 2: ignore whitespace toggle
  const [ignoreWs,      setIgnoreWs]      = useState(false);

  const diff = useMemo(
    () => compared ? computeDiff(original, modified, ignoreWs) : [],
    [original, modified, compared, ignoreWs]
  );

  const added   = diff.filter(d => d.type === "added").length;
  const removed = diff.filter(d => d.type === "removed").length;
  const same    = diff.filter(d => d.type === "equal").length;

  const loadSample = () => { setOriginal(SAMPLE_ORIGINAL); setModified(SAMPLE_MODIFIED); setCompared(false); };
  const clear      = () => { setOriginal(""); setModified(""); setCompared(false); };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col">

      {/* ✅ QA FIX: Consistent Full Navbar */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </Link>
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/tools"   className="text-sm text-gray-500 hover:text-white transition-colors">Tools</Link>
            <Link href="/blog"    className="text-sm text-gray-500 hover:text-white transition-colors">Blog</Link>
            <Link href="/about"   className="text-sm text-gray-500 hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:text-white transition-colors">Contact</Link>
            <Link href="/pro"     className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
          {/* Mobile Fallback */}
          <Link href="/" className="sm:hidden text-sm text-gray-500 hover:text-white transition-colors">← Home</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10 flex-grow">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/text" className="hover:text-gray-400">Text Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">Diff Checker</span>
        </nav>

        {/* Header */}
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
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">
                ✓ {b}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Two panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label:"Original Text", value:original, set:setOriginal, color:"text-red-400",   border:"focus:border-red-500/50"   },
                { label:"Modified Text", value:modified, set:setModified, color:"text-green-400", border:"focus:border-green-500/50" },
              ].map(panel => (
                <div key={panel.label}>
                  <label className={`text-xs font-bold block mb-2 uppercase tracking-wider ${panel.color}`}>
                    {panel.label}
                  </label>
                  <textarea
                    value={panel.value}
                    onChange={e => { panel.set(e.target.value); setCompared(false); }}
                    placeholder={`Paste your ${panel.label.toLowerCase()} here...`}
                    className={`w-full h-52 px-4 py-3 rounded-2xl bg-[#13131F] border border-white/5 text-white placeholder-gray-600 focus:outline-none ${panel.border} transition-all resize-none text-sm font-mono leading-relaxed`}
                  />
                </div>
              ))}
            </div>

            {/* Action buttons + ignore whitespace toggle */}
            <div className="flex flex-wrap items-center gap-3">
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

              {/* ✅ UI Enhancement 2: Ignore whitespace toggle */}
              <label className="flex items-center gap-2 cursor-pointer ml-auto select-none">
                <span className="text-xs text-gray-500">Ignore whitespace</span>
                <button
                  onClick={() => { setIgnoreWs(p => !p); if (compared) setCompared(false); }}
                  className={`w-9 h-5 rounded-full transition-all relative flex-shrink-0 ${ignoreWs ? "bg-[#6C3AFF]" : "bg-gray-700"}`}
                  role="switch"
                  aria-checked={ignoreWs}
                >
                  <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${ignoreWs ? "left-4.5" : "left-0.5"}`} />
                </button>
              </label>
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
                  {ignoreWs && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#6C3AFF]/20 bg-[#6C3AFF]/5 text-xs text-[#6C3AFF]">
                      Whitespace ignored
                    </div>
                  )}
                </div>

                {/* Diff view — ✅ UI Enhancement 1: line numbers now shown */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
                  <div className="px-4 py-2 border-b border-white/5 flex items-center gap-3">
                    <span className="text-xs text-gray-500 font-medium">Diff Result</span>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 bg-green-500/30 rounded inline-block" />Added
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 bg-red-500/30 rounded inline-block" />Removed
                      </span>
                    </div>
                  </div>
                  <div className="overflow-auto max-h-96">
                    {diff.map((line, i) => (
                      <div key={i} className={`flex items-start font-mono text-xs px-4 py-1 ${
                        line.type === "added"   ? "bg-green-500/10" :
                        line.type === "removed" ? "bg-red-500/10"   : ""
                      }`}>
                        {/* ✅ Line number column */}
                        <span className="w-8 flex-shrink-0 mr-2 text-gray-700 text-right select-none tabular-nums">
                          {line.lineNum}
                        </span>
                        {/* +/− indicator */}
                        <span className={`w-4 flex-shrink-0 mr-3 font-bold text-center ${
                          line.type === "added"   ? "text-green-400" :
                          line.type === "removed" ? "text-red-400"   : "text-gray-700"
                        }`}>
                          {line.type === "added" ? "+" : line.type === "removed" ? "−" : " "}
                        </span>
                        <span className={`flex-1 break-all leading-relaxed ${
                          line.type === "added"   ? "text-green-300" :
                          line.type === "removed" ? "text-red-300"   : "text-gray-400"
                        }`}>
                          {line.text || " "}
                        </span>
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
                {[
                  "Compare code versions",
                  "Review document edits",
                  "Check copy/paste accuracy",
                  "Spot accidental changes",
                  "Compare API responses",
                  "Review config file changes",
                ].map(u => (
                  <div key={u} className="flex items-center gap-2">
                    <span className="text-[#6C3AFF]">→</span><span>{u}</span>
                  </div>
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

            {/* ✅ Fixed: was <button> not <Link> */}
            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-white text-sm mb-1">PursTech Pro</h3>
              <p className="text-gray-500 text-xs mb-4">Unlimited file size, word-level diff, export</p>
              <Link href="/pro"
                className="block w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all text-center">
                Get Pro — $7/mo
              </Link>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use the Diff Checker</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step:"1", title:"Paste Both Texts",   desc:"Paste your original text in the left panel and your modified or updated text in the right panel. Works with any plain text or code." },
              { step:"2", title:"Click Compare",      desc:"Hit the Compare Texts button. Toggle Ignore Whitespace to skip spacing-only differences. The tool analyses both texts line by line instantly." },
              { step:"3", title:"Review the Results", desc:"Green lines were added, red lines were removed. Line numbers are shown on the left. A summary at the top shows the total count of each type." },
            ].map(s => (
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

        {/* ✅ QA FIX: FAQ using HTML <details> for AdSense compliance */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{item.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </section>
      </main>

      {/* ✅ QA FIX: Consistent Full Footer */}
      <footer className="border-t border-white/5 mt-auto py-8 text-center bg-[#0A0A14]">
        <Link href="/" className="text-xl font-black">
          Purs<span className="text-[#6C3AFF]">Tech</span>
        </Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/about"   className="hover:text-gray-400 transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
