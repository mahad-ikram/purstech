"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Related Tools & FAQ ──────────────────────────────────────────────────────

const RELATED_TOOLS = [
  { icon: "🔐", name: "Base64 Encoder",   slug: "base64-encoder"   },
  { icon: "🔗", name: "URL Encoder",       slug: "url-encoder"      },
  { icon: "💻", name: "HTML Minifier",     slug: "html-minifier"    },
  { icon: "🎨", name: "CSS Minifier",      slug: "css-minifier"     },
  { icon: "🔑", name: "UUID Generator",    slug: "uuid-generator"   },
];

const FAQ = [
  {
    q: "What is JSON and why do I need to format it?",
    a: "JSON (JavaScript Object Notation) is a format for storing and exchanging data. Raw JSON is often minified (compressed) and very hard to read. Formatting adds indentation and line breaks so humans can read and debug it easily.",
  },
  {
    q: "Does this tool validate my JSON?",
    a: "Yes! If your JSON has any errors — missing commas, unclosed brackets, wrong quotes — the tool will detect it and show you exactly what went wrong so you can fix it instantly.",
  },
  {
    q: "What is JSON minifying?",
    a: "Minifying removes all whitespace and line breaks from JSON, making it as small as possible. This is useful when sending JSON over a network or storing it, as smaller files load faster.",
  },
  {
    q: "Is my JSON data safe?",
    a: "Completely. All processing happens in your browser — your JSON is never sent to any server. It stays 100% private on your device.",
  },
  {
    q: "Can I format very large JSON files?",
    a: "Yes. The tool handles large JSON files with thousands of lines. Simply paste the entire content and it formats instantly.",
  },
];

// ─── Syntax Highlighter ───────────────────────────────────────────────────────
// Simple colour-coding for JSON output

function highlightJSON(json: string): string {
  return json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = "text-[#00D4FF]"; // number
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? "text-[#6C3AFF]" : "text-green-400"; // key : string
        } else if (/true|false/.test(match)) {
          cls = "text-yellow-400";
        } else if (/null/.test(match)) {
          cls = "text-red-400";
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function JSONFormatterPage() {
  const [input, setInput]       = useState("");
  const [output, setOutput]     = useState("");
  const [error, setError]       = useState("");
  const [indent, setIndent]     = useState(2);
  const [copied, setCopied]     = useState(false);
  const [openFaq, setOpenFaq]   = useState<number | null>(null);
  const [mode, setMode] = useState<"format" | "minify" | "validate">("format");

  // ── Format ────────────────────────────────────────────────────────────────
  const handleFormat = () => {
    if (!input.trim()) { setError("Please paste some JSON first."); return; }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted);
      setError("");
      setMode("format");
    } catch (e: any) {
      setError(`❌ Invalid JSON: ${e.message}`);
      setOutput("");
    }
  };

  // ── Minify ────────────────────────────────────────────────────────────────
  const handleMinify = () => {
    if (!input.trim()) { setError("Please paste some JSON first."); return; }
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError("");
      setMode("minify");
    } catch (e: any) {
      setError(`❌ Invalid JSON: ${e.message}`);
      setOutput("");
    }
  };

  // ── Validate only ─────────────────────────────────────────────────────────
  const handleValidate = () => {
    if (!input.trim()) { setError("Please paste some JSON first."); return; }
    try {
      JSON.parse(input);
      setError("");
      setMode("validate");
      setOutput("✅ Valid JSON! No errors found.");
    } catch (e: any) {
      setError(`❌ Invalid JSON: ${e.message}`);
      setOutput("");
    }
  };

  // ── Copy output ───────────────────────────────────────────────────────────
  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Clear ─────────────────────────────────────────────────────────────────
  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  // ── Sample JSON ───────────────────────────────────────────────────────────
  const loadSample = () => {
    setInput(`{"name":"PursTech","version":"1.0.0","description":"World's largest free tool ecosystem","tools":{"text":48,"image":36,"dev":54,"seo":29},"features":["free","no-login","ai-powered","instant"],"active":true,"users":null}`);
    setError("");
    setOutput("");
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const inputSize  = new Blob([input]).size;
  const outputSize = new Blob([output]).size;
  const savings    = inputSize > 0 && outputSize > 0
    ? Math.round(((inputSize - outputSize) / inputSize) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">

      {/* ── Navbar ── */}
      <nav className="border-b border-white/5 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">
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
          <Link href="/categories/dev" className="hover:text-gray-400 transition-colors">Dev Tools</Link>
          <span>›</span>
          <span className="text-gray-400">JSON Formatter</span>
        </nav>

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">💻</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                JSON Formatter & Validator
              </h1>
              <p className="text-gray-500 mt-1">
                Format, validate, minify and beautify JSON data — instantly, free, no login.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Free", "No Login", "Syntax Highlighting", "Validates Errors", "Private"].map((b) => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">
                ✓ {b}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: Editor ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Controls row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Indent selector */}
              <div className="flex items-center gap-2 bg-[#13131F] border border-white/5 rounded-xl px-4 py-2">
                <span className="text-xs text-gray-500">Indent:</span>
                {[2, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => setIndent(n)}
                    className={`w-8 h-7 rounded-lg text-xs font-bold transition-all ${
                      indent === n
                        ? "bg-[#6C3AFF] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              {/* Sample button */}
              <button
                onClick={loadSample}
                className="text-xs text-gray-500 hover:text-[#6C3AFF] transition-colors underline underline-offset-2"
              >
                Load sample JSON
              </button>
            </div>

            {/* Input */}
            <div>
              <label className="text-xs text-gray-600 mb-2 block font-medium uppercase tracking-wider">
                Input — Paste your JSON here
              </label>
              <textarea
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(""); }}
                placeholder='{"paste": "your JSON here", "example": true}'
                className="w-full h-56 px-5 py-4 rounded-2xl bg-[#13131F] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all resize-none text-sm font-mono leading-relaxed"
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleFormat}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-sm font-bold transition-all shadow-lg shadow-violet-900/30"
              >
                ✨ Format / Beautify
              </button>
              <button
                onClick={handleMinify}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#13131F] hover:bg-[#1a1a2e] border border-white/5 hover:border-[#6C3AFF]/30 text-white text-sm font-semibold transition-all"
              >
                📦 Minify
              </button>
              <button
                onClick={handleValidate}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#13131F] hover:bg-[#1a1a2e] border border-white/5 hover:border-green-500/30 text-white text-sm font-semibold transition-all"
              >
                ✅ Validate
              </button>
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#13131F] hover:bg-[#1a1a2e] border border-white/5 hover:border-red-500/30 text-gray-400 hover:text-red-400 text-sm font-semibold transition-all"
              >
                🗑️ Clear
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-3 text-red-400 text-sm font-mono">
                {error}
              </div>
            )}

            {/* Output */}
            {output && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-600 font-medium uppercase tracking-wider">
                    Output — {mode === "format" ? "Formatted JSON" : mode === "minify" ? "Minified JSON" : "Result"}
                  </label>
                  <div className="flex items-center gap-3">
                    {/* Size stats */}
                    {inputSize > 0 && outputSize > 0 && mode === "minify" && savings > 0 && (
                      <span className="text-xs text-green-400 font-semibold">
                        {savings}% smaller
                      </span>
                    )}
                    <button
                      onClick={handleCopy}
                      className="text-xs bg-[#6C3AFF]/20 hover:bg-[#6C3AFF]/40 text-[#6C3AFF] px-3 py-1.5 rounded-lg font-bold transition-all"
                    >
                      {copied ? "✅ Copied!" : "📋 Copy"}
                    </button>
                  </div>
                </div>
                <div className="relative bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
                  {/* Coloured output */}
                  <pre
                    className="p-5 text-sm font-mono leading-relaxed overflow-auto max-h-96 text-gray-300 whitespace-pre-wrap break-all"
                    dangerouslySetInnerHTML={{ __html: highlightJSON(output) }}
                  />
                </div>
              </div>
            )}

            {/* Size info */}
            {(input || output) && (
              <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                {input && (
                  <span>
                    Input size:{" "}
                    <span className="text-gray-400 font-semibold">
                      {inputSize > 1024
                        ? `${(inputSize / 1024).toFixed(1)} KB`
                        : `${inputSize} bytes`}
                    </span>
                  </span>
                )}
                {output && mode !== "validate" && (
                  <span>
                    Output size:{" "}
                    <span className="text-gray-400 font-semibold">
                      {outputSize > 1024
                        ? `${(outputSize / 1024).toFixed(1)} KB`
                        : `${outputSize} bytes`}
                    </span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="flex flex-col gap-4">

            {/* Quick reference */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">📚 JSON Quick Reference</h3>
              <div className="space-y-3 text-xs font-mono">
                {[
                  { type: "String",  example: '"hello world"',         color: "text-green-400"  },
                  { type: "Number",  example: '42 / 3.14',              color: "text-[#00D4FF]"  },
                  { type: "Boolean", example: 'true / false',           color: "text-yellow-400" },
                  { type: "Null",    example: 'null',                   color: "text-red-400"    },
                  { type: "Array",   example: '[1, 2, 3]',              color: "text-pink-400"   },
                  { type: "Object",  example: '{"key": "value"}',       color: "text-[#6C3AFF]"  },
                ].map((item) => (
                  <div key={item.type} className="flex justify-between items-center">
                    <span className="text-gray-500">{item.type}</span>
                    <span className={item.color}>{item.example}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Common errors */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">⚠️ Common JSON Errors</h3>
              <div className="space-y-3 text-xs text-gray-500">
                {[
                  "Trailing comma after last item",
                  "Single quotes instead of double quotes",
                  "Missing comma between items",
                  "Unquoted key names",
                  "Unclosed bracket or brace",
                ].map((err) => (
                  <div key={err} className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">✕</span>
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related tools */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">🔧 Related Tools</h3>
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
                    <span className="ml-auto text-gray-700 group-hover:text-[#6C3AFF] transition-colors">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Pro upsell */}
            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-white text-sm mb-1">PursTech Pro</h3>
              <p className="text-gray-500 text-xs mb-4">Unlimited usage, zero ads, API access</p>
              <button className="w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all">
                Get Pro — $7/mo
              </button>
            </div>
          </div>
        </div>

        {/* ── How to Use ── */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use the JSON Formatter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: "1", title: "Paste Your JSON",   desc: "Copy your raw or minified JSON and paste it into the input box. You can also click 'Load sample JSON' to try it out." },
              { step: "2", title: "Choose an Action",  desc: "Click Format to beautify with proper indentation, Minify to compress it, or Validate to check for errors without changing anything." },
              { step: "3", title: "Copy the Result",   desc: "Your formatted JSON appears below with colour syntax highlighting. Click Copy to grab it and use it anywhere." },
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
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-white text-sm">{item.q}</span>
                  <span className="text-[#6C3AFF] text-lg ml-4 flex-shrink-0">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
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
        <p className="text-gray-700 text-xs mt-2">© 2025 PursTech. Free online tools for everyone.</p>
      </footer>

    </div>
  );
}
