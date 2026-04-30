"use client";

import { useState } from "react";
import Link from "next/link";

const RELATED_TOOLS = [
  { icon: "💻", name: "JSON Formatter",   slug: "json-formatter"   },
  { icon: "🔗", name: "URL Encoder",      slug: "url-encoder"      },
  { icon: "🔑", name: "Hash Generator",   slug: "hash-generator"   },
  { icon: "🔐", name: "Password Gen",     slug: "password-generator"},
  { icon: "🎲", name: "UUID Generator",   slug: "uuid-generator"   },
];

const FAQ = [
  { q: "What is Base64 encoding?", a: "Base64 is an encoding scheme that converts binary data into a text format using 64 printable ASCII characters. It is commonly used to transmit data over systems that only support text, such as email attachments and data URLs." },
  { q: "Is Base64 encryption?", a: "No. Base64 is encoding, not encryption. It is completely reversible and provides no security. Anyone who has the Base64 string can decode it instantly. Never use Base64 to protect sensitive data." },
  { q: "What is Base64 used for?", a: "Common uses include embedding images in HTML/CSS as data URIs, encoding email attachments (MIME), passing data in URLs, storing binary data in JSON, and API authentication tokens (like Basic Auth headers)." },
  { q: "What is URL-safe Base64?", a: "Standard Base64 uses + and / characters which have special meaning in URLs. URL-safe Base64 replaces + with - and / with _ making it safe to include in URLs and query strings without encoding." },
  { q: "What characters does Base64 use?", a: "Standard Base64 uses A-Z, a-z, 0-9, + and / (64 characters total) plus = as padding. The name Base64 comes from the 64 character alphabet." },
];

export default function Base64Page() {
  const [input,    setInput]    = useState("");
  const [output,   setOutput]   = useState("");
  const [mode,     setMode]     = useState<"encode"|"decode">("encode");
  const [urlSafe,  setUrlSafe]  = useState(false);
  const [error,    setError]    = useState("");
  const [copied,   setCopied]   = useState(false);
  const [openFaq,  setOpenFaq]  = useState<number | null>(null);

  const handleConvert = () => {
    if (!input.trim()) { setError("Please enter some text first."); return; }
    setError("");
    try {
      if (mode === "encode") {
        let result = btoa(unescape(encodeURIComponent(input)));
        if (urlSafe) result = result.replace(/\+/g, "-").replace(/\//g, "_");
        setOutput(result);
      } else {
        let safe = input.replace(/-/g, "+").replace(/_/g, "/");
        const padding = safe.length % 4 === 0 ? "" : "=".repeat(4 - (safe.length % 4));
        setOutput(decodeURIComponent(escape(atob(safe + padding))));
      }
    } catch {
      setError("❌ Invalid input. Make sure you are pasting valid Base64 text to decode.");
      setOutput("");
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    setInput(output);
    setOutput("");
    setMode(m => m === "encode" ? "decode" : "encode");
    setError("");
  };

  const loadSample = () => {
    if (mode === "encode") setInput("Hello, PursTech! This is a Base64 encoding example.");
    else setInput("SGVsbG8sIFB1cnNUZWNoISBUaGlzIGlzIGEgQmFzZTY0IGVuY29kaW5nIGV4YW1wbGUu");
    setOutput(""); setError("");
  };

  const sizeIncrease = input && output && mode === "encode"
    ? Math.round(((output.length - input.length) / input.length) * 100)
    : 0;

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
          <Link href="/categories/dev" className="hover:text-gray-400">Dev Tools</Link><span>›</span>
          <span className="text-gray-400">Base64 Encoder</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🔐</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">Base64 Encoder / Decoder</h1>
              <p className="text-gray-500 mt-1">Encode text to Base64 or decode Base64 back to text — instantly, free, no login.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Free","No Login","Encode & Decode","URL-safe Mode","Private"].map(b => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">✓ {b}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Mode toggle */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-1.5 flex gap-1">
              {(["encode","decode"] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setOutput(""); setError(""); }}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold capitalize transition-all ${
                    mode === m ? "bg-[#6C3AFF] text-white shadow-lg" : "text-gray-400 hover:text-white"
                  }`}>{m === "encode" ? "🔒 Encode → Base64" : "🔓 Decode ← Base64"}</button>
              ))}
            </div>

            {/* Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  {mode === "encode" ? "Text to Encode" : "Base64 to Decode"}
                </label>
                <button onClick={loadSample} className="text-xs text-gray-600 hover:text-[#6C3AFF] transition-colors underline underline-offset-2">
                  Load sample
                </button>
              </div>
              <textarea value={input} onChange={e => { setInput(e.target.value); setError(""); }}
                placeholder={mode === "encode" ? "Enter text to encode to Base64..." : "Paste Base64 string to decode..."}
                className="w-full h-36 px-5 py-4 rounded-2xl bg-[#13131F] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all resize-none text-sm font-mono" />
            </div>

            {/* URL-safe toggle */}
            <div className="flex items-center justify-between bg-[#13131F] border border-white/5 rounded-xl px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-white">URL-safe Base64</div>
                <div className="text-xs text-gray-500">Replaces + with - and / with _ (safe for URLs)</div>
              </div>
              <button onClick={() => setUrlSafe(!urlSafe)}
                className={`w-11 h-6 rounded-full transition-all relative ${urlSafe ? "bg-[#6C3AFF]" : "bg-gray-700"}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${urlSafe ? "left-6" : "left-1"}`} />
              </button>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <button onClick={handleConvert} disabled={!input.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] disabled:opacity-40 text-white text-sm font-bold transition-all shadow-lg shadow-violet-900/30">
                {mode === "encode" ? "🔒 Encode" : "🔓 Decode"}
              </button>
              {output && (
                <button onClick={handleSwap}
                  className="px-5 py-3 rounded-xl bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/30 text-gray-400 hover:text-white text-sm font-semibold transition-all">
                  ⇄ Swap & Reverse
                </button>
              )}
              <button onClick={() => { setInput(""); setOutput(""); setError(""); }}
                className="px-5 py-3 rounded-xl bg-[#13131F] border border-white/5 hover:border-red-500/30 text-gray-400 hover:text-red-400 text-sm font-semibold transition-all">
                🗑️ Clear
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Output */}
            {output && !error && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>Input: <span className="text-white font-bold">{input.length} chars</span></span>
                    <span>Output: <span className="text-white font-bold">{output.length} chars</span></span>
                    {mode === "encode" && sizeIncrease > 0 && (
                      <span>Size: <span className="text-yellow-400 font-bold">+{sizeIncrease}%</span></span>
                    )}
                  </div>
                  <button onClick={handleCopy}
                    className="text-xs bg-[#6C3AFF]/20 hover:bg-[#6C3AFF]/40 text-[#6C3AFF] px-3 py-1.5 rounded-lg font-bold transition-all">
                    {copied ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <div className="bg-[#13131F] border border-[#6C3AFF]/20 rounded-2xl p-5 text-sm font-mono text-[#00D4FF] break-all leading-relaxed max-h-52 overflow-y-auto">
                  {output}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">📚 Base64 Quick Facts</h3>
              <div className="space-y-3 text-xs">
                {[
                  { label:"Characters used",  value:"A-Z, a-z, 0-9, +, /"  },
                  { label:"Padding char",     value:"= (equals sign)"       },
                  { label:"Size increase",    value:"~33% larger than input" },
                  { label:"Used in",          value:"Email, APIs, Data URIs" },
                  { label:"Security",         value:"None — not encryption"  },
                ].map(f => (
                  <div key={f.label} className="flex justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="text-gray-500">{f.label}</span>
                    <span className="text-[#6C3AFF] font-mono text-right ml-2">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">⚡ Common Use Cases</h3>
              <div className="space-y-2 text-xs text-gray-500">
                {["Embedding images as data URIs","Email attachments (MIME)","Basic Auth headers","Passing data in query strings","Storing binary in JSON","JWT token payloads"].map(u => (
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
              <p className="text-gray-500 text-xs mb-4">File encoding, bulk processing, API access</p>
              <button className="w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all">Get Pro — $7/mo</button>
            </div>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use the Base64 Encoder</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step:"1", title:"Choose Encode or Decode", desc:"Select Encode to convert text to Base64, or Decode to convert a Base64 string back to readable text." },
              { step:"2", title:"Paste Your Content",      desc:"Type or paste your text into the input box. Toggle URL-safe mode if you need the result to be safe for use in URLs." },
              { step:"3", title:"Convert & Copy",          desc:"Click the button to convert instantly. Copy the result and use it wherever you need. Use Swap & Reverse to flip input and output." },
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
