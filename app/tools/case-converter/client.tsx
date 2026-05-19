"use client";

import { useState } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; 

const RELATED_TOOLS = [
  { icon:"📝", name:"Word Counter",   slug:"word-counter"   },
  { icon:"✓",  name:"Grammar Checker",slug:"grammar-checker"},
  { icon:"🔍", name:"Diff Checker",   slug:"diff-checker"   },
  { icon:"📄", name:"Lorem Ipsum",    slug:"lorem-ipsum"    },
  { icon:"🔊", name:"Text to Speech", slug:"text-to-speech" },
];

const FAQ = [
  { q:"What is Title Case?",    a:"Title Case capitalises the first letter of every major word. It's used for headings, titles and proper nouns — for example: 'The Quick Brown Fox'." },
  { q:"What is Sentence case?", a:"Sentence case capitalises only the first letter of the first word in a sentence, just like normal writing. Example: 'The quick brown fox jumps.'" },
  { q:"What is camelCase?",     a:"camelCase starts with a lowercase letter and capitalises the first letter of each subsequent word with no spaces. Used widely in programming: 'myVariableName'." },
  { q:"What is snake_case?",    a:"snake_case replaces spaces with underscores and uses all lowercase letters. Common in Python and database column names: 'my_variable_name'." },
  { q:"What is kebab-case?",    a:"kebab-case replaces spaces with hyphens and uses all lowercase. Used in URLs and CSS class names: 'my-variable-name'." },
];

const CONVERSIONS = [
  { id:"upper",      label:"UPPER CASE",     desc:"ALL CAPITALS",       example:"HELLO WORLD"  },
  { id:"lower",      label:"lower case",     desc:"all lowercase",      example:"hello world"  },
  { id:"title",      label:"Title Case",     desc:"Every Word Capital", example:"Hello World"  },
  { id:"sentence",   label:"Sentence case",  desc:"First word capital", example:"Hello world"  },
  { id:"camel",      label:"camelCase",      desc:"For programming",    example:"helloWorld"   },
  { id:"pascal",     label:"PascalCase",     desc:"For class names",    example:"HelloWorld"   },
  { id:"snake",      label:"snake_case",     desc:"Python / databases", example:"hello_world"  },
  { id:"kebab",      label:"kebab-case",     desc:"URLs / CSS",         example:"hello-world"  },
  { id:"constant",   label:"CONSTANT_CASE",  desc:"Constants",          example:"HELLO_WORLD"  },
  { id:"dot",        label:"dot.case",       desc:"File paths",         example:"hello.world"  },
  { id:"alternating",label:"aLtErNaTiNg",    desc:"Mocking sponge",     example:"hElLo WoRlD"  },
  { id:"inverse",    label:"iNVERSE cASE",   desc:"Inverted caps",      example:"hELLO wORLD"  },
];

function convert(text: string, type: string): string {
  const words = text.trim().split(/\s+/);
  switch (type) {
    case "upper":       return text.toUpperCase();
    case "lower":       return text.toLowerCase();
    case "title":       return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    case "sentence":    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case "camel":       return words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
    case "pascal":      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
    case "snake":       return text.toLowerCase().replace(/\s+/g, "_");
    case "kebab":       return text.toLowerCase().replace(/\s+/g, "-");
    case "constant":    return text.toUpperCase().replace(/\s+/g, "_");
    case "dot":         return text.toLowerCase().replace(/\s+/g, ".");
    case "alternating": return text.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join("");
    case "inverse":     return text.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
    default:            return text;
  }
}

export default function CaseConverterClient() {
  // ✅ Track usage in Supabase → admin dashboard
  useTrackTool("case-converter", "text");

  const [input,   setInput]   = useState("");
  const [active,  setActive]  = useState("upper");
  const [copied,  setCopied]  = useState(false);

  const output = input ? convert(input, active) : "";

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const a    = Object.assign(document.createElement("a"), {
      href:     URL.createObjectURL(blob),
      download: `case-converted-${active}.txt`,
    });
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const wordCount  = input.trim() ? input.trim().split(/\s+/).filter(Boolean).length : 0;
  const inputChars  = input.length;
  const outputChars = output.length;

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col">

      {/* ✅ QA FIX: Consistent Full Navbar */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
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
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/text" className="hover:text-gray-400 transition-colors">Text Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">Case Converter</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🔤</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">Case Converter</h1>
              <p className="text-gray-500 mt-1">Convert text to any case instantly — UPPER, lower, Title, camelCase, snake_case and more.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Free","No Login","12 Case Types","Instant","Private"].map(b => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">
                ✓ {b}
              </span>
            ))}
          </div>
        </div>

        {/* 3-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Input Text</label>
                {input && (
                  <span className="text-xs text-gray-600">
                    {wordCount} word{wordCount !== 1 ? "s" : ""} · {inputChars} chars
                  </span>
                )}
              </div>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type or paste your text here..."
                className="w-full h-40 px-5 py-4 rounded-2xl bg-[#13131F] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all resize-none text-sm leading-relaxed"
              />
            </div>

            {/* Case buttons with live preview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CONVERSIONS.map(c => {
                const preview = input
                  ? convert(input.slice(0, 18), c.id).slice(0, 18) + (input.length > 18 ? "…" : "")
                  : c.example;

                return (
                  <button key={c.id} onClick={() => setActive(c.id)}
                    className={`p-3 rounded-xl text-left transition-all border ${
                      active === c.id
                        ? "bg-[#6C3AFF] border-[#6C3AFF] text-white shadow-lg shadow-violet-900/30"
                        : "bg-[#13131F] border-white/5 text-gray-400 hover:border-[#6C3AFF]/30 hover:text-white"
                    }`}>
                    <div className="text-xs font-extrabold font-mono">{c.label}</div>
                    <div className="text-[10px] mt-0.5 opacity-60">{c.desc}</div>
                    <div className={`text-[10px] mt-1.5 font-mono truncate ${active === c.id ? "opacity-70" : "opacity-40"}`}>
                      {preview}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Output */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Output</label>
                <div className="flex items-center gap-2">
                  {output && (
                    <button onClick={handleDownload}
                      className="text-xs bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg font-semibold transition-all">
                      ⬇ .txt
                    </button>
                  )}
                  <button onClick={handleCopy} disabled={!output}
                    className="text-xs bg-[#6C3AFF]/20 hover:bg-[#6C3AFF]/40 text-[#6C3AFF] px-3 py-1.5 rounded-lg font-bold transition-all disabled:opacity-30">
                    {copied ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
              </div>

              <div className={`w-full min-h-28 px-5 py-4 rounded-2xl bg-[#13131F] border text-sm leading-relaxed font-mono break-all transition-colors ${
                output ? "border-[#6C3AFF]/20 text-white" : "border-white/5"
              }`}>
                {output || <span className="text-gray-600">Your converted text appears here...</span>}
              </div>

              {output && (
                <div className="flex gap-4 text-xs text-gray-600 mt-2">
                  <span>Input: <span className="text-gray-400 font-medium">{inputChars} chars</span></span>
                  <span>Output: <span className="text-gray-400 font-medium">{outputChars} chars</span></span>
                  <span>Words: <span className="text-gray-400 font-medium">{wordCount}</span></span>
                  <span className="text-[#6C3AFF]/60 font-mono">{CONVERSIONS.find(c => c.id === active)?.label}</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="flex flex-col gap-4">

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">📖 Case Examples</h3>
              <div className="space-y-2">
                {CONVERSIONS.slice(0, 6).map(c => (
                  <div key={c.id} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-xs text-gray-500">{c.label}</span>
                    <span className="text-xs text-[#6C3AFF] font-mono">{c.example}</span>
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

            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-white text-sm mb-1">PursTech Pro</h3>
              <p className="text-gray-500 text-xs mb-4">Unlimited usage, zero ads, API access</p>
              <Link href="/pro"
                className="block w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all text-center">
                Get Pro — $7/mo
              </Link>
            </div>
          </div>
        </div>

        {/* ── How to Use ── */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use the Case Converter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step:"1", title:"Paste Your Text",    desc:"Type or paste any text into the input box. Works with any length — a single word, a sentence or an entire document."                             },
              { step:"2", title:"Choose a Case Type", desc:"Click any of the 12 case buttons. Text converts instantly as you click. Each button shows a live preview of your text in that case."             },
              { step:"3", title:"Copy or Download",   desc:"Click Copy to grab the converted text, or Download to save as a .txt file — useful for long documents."                                          },
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

        {/* ✅ QA FIX: HTML <details> FAQ for AdSense compliance */}
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
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
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
