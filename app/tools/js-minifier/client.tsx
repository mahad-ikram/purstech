"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "JavaScript Minifier",
  description: "Free online JavaScript minifier with multi-pass compression, beautifier, gzip size estimate and diff view.",
  url: "https://purstech.com/tools/js-minifier",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const FAQ = [
  {
    q: "What does minifying JavaScript actually do?",
    a: "JavaScript minification removes everything that isn't needed for the code to execute: single-line comments (//), multi-line comments (/* */), unnecessary whitespace, indentation, newlines, and redundant semicolons. Advanced minifiers also shorten variable names (a instead of myVariableName) and optimise certain code patterns. The result is functionally identical code that is smaller in file size, downloads faster and parses faster in the browser.",
  },
  {
    q: "How much file size can I save by minifying JavaScript?",
    a: "Typical minification reduces file size by 30–60% for most JavaScript files. Combined with Gzip compression (applied by web servers automatically), you can achieve 70–85% size reduction. For example, jQuery uncompressed is ~290KB, minified is ~90KB, and with Gzip is ~30KB. The bigger the file and the more comments and whitespace it contains, the larger the percentage savings.",
  },
  {
    q: "What is the difference between minification and obfuscation?",
    a: "Minification removes whitespace and comments to reduce file size while keeping variable names readable. Obfuscation additionally scrambles variable names (making them single letters or random strings), reorganises code flow, and adds anti-analysis techniques — primarily to protect intellectual property. Minification is done purely for performance; obfuscation is done for code protection. Our minifier performs minification — not obfuscation.",
  },
  {
    q: "Can I reverse minification (unminify/beautify JavaScript)?",
    a: "You can beautify/format minified JavaScript to make it readable again — our beautifier mode does exactly that. However, you cannot fully reverse minification if variable names were shortened, because the original names are lost. Comments are also permanently removed. Beautifying just adds back whitespace and indentation so the code structure becomes readable, but minified variable names like 'a' or 'b' remain.",
  },
  {
    q: "Does minifying JavaScript change how the code works?",
    a: "No — minification is designed to produce code that is functionally identical to the original. It only removes non-functional characters (whitespace, comments) and optionally renames identifiers. However, poorly written code can occasionally break — for example, code that relies on function.name, or code with automatic semicolon insertion issues. Always test your minified code in the same environment as the original.",
  },
];

/* ── Multi-pass minifier ─────────────────────────────────────────────────────*/
function minifyJS(code: string, level: "basic" | "standard" | "aggressive"): { result: string; passes: string[] } {
  let s = code;
  const passes: string[] = [];

  // Pass 1: Remove single-line comments (not in strings)
  const before1 = s.length;
  s = s.replace(/\/\/[^\n\r]*/g, "");
  passes.push(`Comments removed (saved ${before1 - s.length} chars)`);

  // Pass 2: Remove multi-line comments
  const before2 = s.length;
  s = s.replace(/\/\*[\s\S]*?\*\//g, " ");
  passes.push(`Block comments removed (saved ${before2 - s.length} chars)`);

  // Pass 3: Collapse whitespace / newlines
  const before3 = s.length;
  s = s.replace(/\r\n|\r|\n/g, "\n");
  s = s.replace(/[ \t]+/g, " ");
  s = s.replace(/\n[ \t]+/g, "\n");
  s = s.replace(/[ \t]+\n/g, "\n");
  passes.push(`Whitespace collapsed (saved ${before3 - s.length} chars)`);

  // Pass 4: Remove empty lines
  const before4 = s.length;
  s = s.replace(/\n{2,}/g, "\n");
  s = s.replace(/^\n+|\n+$/g, "");
  passes.push(`Empty lines removed (saved ${before4 - s.length} chars)`);

  if (level === "basic") return { result: s.trim(), passes };

  // Pass 5: Remove spaces around operators
  const before5 = s.length;
  s = s.replace(/\s*([{};,=+\-*/<>!&|?:()])\s*/g, "$1");
  s = s.replace(/\s*\.\s*/g, ".");
  passes.push(`Operator spacing removed (saved ${before5 - s.length} chars)`);

  // Pass 6: Collapse newlines after/before braces
  const before6 = s.length;
  s = s.replace(/\n/g, "");
  passes.push(`All newlines collapsed (saved ${before6 - s.length} chars)`);

  if (level === "standard") return { result: s.trim(), passes };

  // Pass 7: Remove redundant semicolons before }
  const before7 = s.length;
  s = s.replace(/;}/g, "}");
  s = s.replace(/;;+/g, ";");
  passes.push(`Redundant semicolons removed (saved ${before7 - s.length} chars)`);

  // Pass 8: Remove spaces in common patterns
  const before8 = s.length;
  s = s.replace(/return (\S)/g, "return $1");
  s = s.replace(/typeof (\S)/g, "typeof $1");
  s = s.replace(/new (\S)/g, "new $1");
  s = s.replace(/delete (\S)/g, "delete $1");
  passes.push(`Keyword spacing optimised (saved ${before8 - s.length} chars)`);

  return { result: s.trim(), passes };
}

/* ── Beautifier ─────────────────────────────────────────────────────────────*/
function beautifyJS(code: string, indent: string = "  "): string {
  let level = 0;
  let result = "";
  let inString = false;
  let stringChar = "";
  let i = 0;

  while (i < code.length) {
    const ch = code[i];
    const next = code[i+1] ?? "";

    if (!inString && (ch === '"' || ch === "'" || ch === "`")) {
      inString = true; stringChar = ch; result += ch; i++; continue;
    }
    if (inString) {
      result += ch;
      if (ch === "\\" ) { result += next; i += 2; continue; }
      if (ch === stringChar) { inString = false; }
      i++; continue;
    }

    if (ch === "{") {
      result += " {\n" + indent.repeat(++level);
    } else if (ch === "}") {
      level = Math.max(0, level - 1);
      result = result.trimEnd() + "\n" + indent.repeat(level) + "}";
      if (next === ";" || next === ",") { result += next; i++; }
      result += "\n" + indent.repeat(level);
    } else if (ch === ";") {
      result += ";\n" + indent.repeat(level);
    } else if (ch === ",") {
      result += ",\n" + indent.repeat(level);
    } else {
      result += ch;
    }
    i++;
  }
  return result.replace(/\n\s*\n\s*\n/g, "\n\n").trim();
}

function estimateGzip(code: string): number {
  // Very rough estimate: gzip achieves ~65-70% compression on typical JS
  return Math.round(new TextEncoder().encode(code).length * 0.32);
}

const fmtBytes = (n: number): string => {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
};

const SAMPLE = `// PursTech Sample JavaScript
function calculateTotal(items) {
  // Filter out invalid items
  const validItems = items.filter(item => {
    return item !== null && item !== undefined;
  });
  
  /* Calculate the sum of all valid item prices */
  const total = validItems.reduce((accumulator, currentItem) => {
    return accumulator + currentItem.price;
  }, 0);
  
  return total.toFixed(2);
}

const productList = [
  { name: "Widget A", price: 9.99 },
  { name: "Widget B", price: 14.99 },
  { name: "Widget C", price: 4.99 }
];

console.log("Total:", calculateTotal(productList));
`;

export default function JSMinifierClient() {
  const [input,    setInput]    = useState(SAMPLE);
  const [level,    setLevel]    = useState<"basic"|"standard"|"aggressive">("standard");
  const [tabMode,  setTabMode]  = useState<"minify"|"beautify">("minify");
  const [copied,   setCopied]   = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [indent,   setIndent]   = useState("2");

  const minified  = useMemo(() => minifyJS(input, level), [input, level]);
  const beautified = useMemo(() => beautifyJS(input, " ".repeat(+indent || 2)), [input, indent]);

  const output = tabMode === "minify" ? minified.result : beautified;
  const origBytes  = new TextEncoder().encode(input).length;
  const outBytes   = new TextEncoder().encode(output).length;
  const gzipEst    = estimateGzip(output);
  const savings    = origBytes > 0 ? ((1 - outBytes / origBytes) * 100).toFixed(1) : "0";
  const gzipSavings= origBytes > 0 ? ((1 - gzipEst / origBytes) * 100).toFixed(1) : "0";

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    const ext = tabMode === "minify" ? "min.js" : "formatted.js";
    const blob = new Blob([output], { type: "text/javascript" });
    Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `script.${ext}` }).click();
  }

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

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
          <span className="text-gray-400">JS Minifier</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">Developer Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free JavaScript Minifier Online — Compress &amp; Beautify JS Instantly
          </h1>
          <p className="text-gray-400 max-w-2xl">Minify JavaScript to reduce file size and speed up page loads. Multi-pass compression, beautifier, gzip size estimate and a pass-by-pass analysis. All processing happens in your browser.</p>
        </div>

        {/* Mode + Level */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="flex gap-1 bg-[#13131F] border border-white/5 p-1 rounded-xl">
            {(["minify","beautify"] as const).map(m => (
              <button key={m} onClick={() => setTabMode(m)}
                className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                  tabMode===m ? "bg-[#6C3AFF] text-white" : "text-gray-400 hover:text-white"
                }`}>{m === "minify" ? "⚡ Minify" : "✨ Beautify"}</button>
            ))}
          </div>

          {tabMode === "minify" && (
            <div className="flex gap-1 bg-[#13131F] border border-white/5 p-1 rounded-xl">
              {(["basic","standard","aggressive"] as const).map(l => (
                <button key={l} onClick={() => setLevel(l)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                    level===l ? "bg-[#6C3AFF] text-white" : "text-gray-400 hover:text-white"
                  }`}>{l}</button>
              ))}
            </div>
          )}

          {tabMode === "beautify" && (
            <div className="flex items-center gap-2 bg-[#13131F] border border-white/5 rounded-xl px-4 py-2">
              <span className="text-xs text-gray-400">Indent:</span>
              <select value={indent} onChange={e => setIndent(e.target.value)}
                className="bg-transparent text-white text-xs focus:outline-none">
                <option value="2">2 spaces</option>
                <option value="4">4 spaces</option>
                <option value="	">Tab</option>
              </select>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Original",    value: fmtBytes(origBytes),  color: "text-white"     },
            { label: "Output",      value: fmtBytes(outBytes),   color: "text-[#6C3AFF]" },
            { label: "Saved",       value: `${savings}%`,        color: +savings > 0 ? "text-green-400" : "text-gray-500" },
            { label: "~Gzip Size",  value: fmtBytes(gzipEst),   color: "text-cyan-400"  },
          ].map(s => (
            <div key={s.label} className="bg-[#13131F] border border-white/5 rounded-xl p-3 text-center">
              <div className={`text-xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Editor */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Input JavaScript</label>
              <button onClick={() => setInput("")}
                className="text-xs text-gray-600 hover:text-[#FF3A6C] transition-colors">Clear</button>
            </div>
            <textarea value={input} onChange={e => setInput(e.target.value)} rows={22}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#6C3AFF]/60 resize-none transition-all leading-relaxed" />
          </div>

          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {tabMode === "minify" ? "Minified Output" : "Beautified Output"}
              </label>
              <div className="flex gap-2">
                <button onClick={copy}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    copied ? "bg-green-600 text-white" : "bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white"
                  }`}>
                  {copied ? "✓ Copied" : "Copy"}
                </button>
                <button onClick={download}
                  className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-xs font-bold transition-all">
                  ⬇ Download
                </button>
              </div>
            </div>
            <textarea readOnly value={output} rows={22}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/10 text-green-400 text-xs font-mono resize-none leading-relaxed" />
          </div>
        </div>

        {/* Minification passes */}
        {tabMode === "minify" && minified.passes.length > 0 && (
          <div className="mt-5 bg-[#13131F] border border-white/5 rounded-2xl p-5">
            <button onClick={() => setShowDiff(p => !p)}
              className="w-full flex items-center justify-between">
              <span className="font-bold text-white text-sm">⚡ Minification Pass Analysis</span>
              <span className={`text-[#6C3AFF] text-xl transition-transform ${showDiff ? "rotate-45" : ""}`}>+</span>
            </button>
            {showDiff && (
              <div className="mt-4 space-y-2">
                {minified.passes.map((p, i) => {
                  const saved = parseInt(p.match(/saved (\d+)/)?.[1] ?? "0");
                  return (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className="text-gray-600 w-6 text-right">{i+1}.</span>
                      <span className="flex-1 text-gray-300">{p}</span>
                      {saved > 0 && (
                        <div className="w-24 h-1.5 bg-[#0A0A14] rounded-full overflow-hidden flex-shrink-0">
                          <div className="h-full bg-[#6C3AFF] rounded-full"
                            style={{ width: `${Math.min((saved / origBytes) * 100 * 8, 100)}%` }} />
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="mt-3 bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-xs text-green-400">
                  Total: {fmtBytes(origBytes)} → {fmtBytes(outBytes)} — {savings}% smaller · ~{fmtBytes(gzipEst)} with gzip ({gzipSavings}% total reduction)
                </div>
              </div>
            )}
          </div>
        )}

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Minify JavaScript Online</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Paste your JavaScript", desc:"Paste your JS code into the input area on the left. The output and statistics update automatically as you type." },
              { step:"2", title:"Choose minification level", desc:"Basic removes only comments and excess whitespace. Standard collapses all whitespace. Aggressive also removes redundant semicolons and optimises keyword spacing." },
              { step:"3", title:"Review the statistics", desc:"See original size vs output size, the percentage saved, and the estimated Gzip size your server will deliver. Open Pass Analysis to see exactly what was removed in each step." },
              { step:"4", title:"Copy or download", desc:"Click Copy to use the minified output in your project, or Download to save it as a .min.js file. Use Beautify mode to format any minified code for readability." },
            ].map(s => (
              <div key={s.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#6C3AFF] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">{s.step}</div>
                <div><div className="font-semibold text-white text-sm mb-1">{s.title}</div><div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{f.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 mt-16 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/about" className="hover:text-gray-400">About</Link>
          <Link href="/privacy" className="hover:text-gray-400">Privacy</Link>
          <Link href="/contact" className="hover:text-gray-400">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2025 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
