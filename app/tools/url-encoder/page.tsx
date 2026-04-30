"use client";

import { useState } from "react";
import Link from "next/link";

const RELATED_TOOLS = [
  { icon: "🔐", name: "Base64 Encoder",    slug: "base64-encoder"    },
  { icon: "💻", name: "JSON Formatter",    slug: "json-formatter"    },
  { icon: "🔑", name: "Hash Generator",    slug: "hash-generator"    },
  { icon: "🎲", name: "UUID Generator",    slug: "uuid-generator"    },
  { icon: "🔲", name: "QR Code Generator", slug: "qr-code-generator" },
];

const FAQ = [
  { q: "What is URL encoding?", a: "URL encoding (also called percent-encoding) converts characters that are not allowed in URLs into a format that can be safely transmitted. Special characters like spaces, &, =, and ? are replaced with a % followed by their hexadecimal code. For example, a space becomes %20." },
  { q: "When do I need to URL encode?", a: "You need URL encoding when passing data in query strings, building API requests, creating redirect URLs, encoding form data, or any time special characters appear in a URL. Without encoding, the URL may be misinterpreted by browsers and servers." },
  { q: "What is the difference between encodeURI and encodeURIComponent?", a: "encodeURI encodes a full URL and skips characters that are valid in URLs (like /, :, @). encodeURIComponent encodes a component (like a query parameter value) and encodes nearly everything including /, ?, =. Use encodeURIComponent for individual parameter values." },
  { q: "What characters are safe in URLs without encoding?", a: "The unreserved characters A-Z, a-z, 0-9, -, _, ., and ~ are always safe in URLs. All other characters should be percent-encoded for guaranteed compatibility across all systems." },
  { q: "Can I encode an entire URL at once?", a: "Yes — use the 'Encode Full URL' mode which preserves the URL structure (protocol, slashes, domain) while encoding only the parts that need it. Use 'Encode Component' for individual query parameter values." },
];

const SPECIAL_CHARS = [
  { char: " ",  encoded: "%20" }, { char: "!",  encoded: "%21" },
  { char: "#",  encoded: "%23" }, { char: "$",  encoded: "%24" },
  { char: "&",  encoded: "%26" }, { char: "'",  encoded: "%27" },
  { char: "(",  encoded: "%28" }, { char: ")",  encoded: "%29" },
  { char: "*",  encoded: "%2A" }, { char: "+",  encoded: "%2B" },
  { char: ",",  encoded: "%2C" }, { char: "/",  encoded: "%2F" },
  { char: ":",  encoded: "%3A" }, { char: ";",  encoded: "%3B" },
  { char: "=",  encoded: "%3D" }, { char: "?",  encoded: "%3F" },
  { char: "@",  encoded: "%40" }, { char: "[",  encoded: "%5B" },
  { char: "]",  encoded: "%5D" },
];

export default function URLEncoderPage() {
  const [input,   setInput]   = useState("");
  const [output,  setOutput]  = useState("");
  const [mode,    setMode]    = useState<"encode_full"|"encode_component"|"decode">("encode_component");
  const [error,   setError]   = useState("");
  const [copied,  setCopied]  = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleConvert = () => {
    if (!input.trim()) { setError("Please enter some text first."); return; }
    setError("");
    try {
      if (mode === "encode_full")      setOutput(encodeURI(input));
      else if (mode === "encode_component") setOutput(encodeURIComponent(input));
      else {
        // Try both decode methods
        try { setOutput(decodeURIComponent(input)); }
        catch { setOutput(decodeURI(input)); }
      }
    } catch (e: any) {
      setError(`❌ Invalid input: ${e.message}`);
      setOutput("");
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    if (mode === "decode") setInput("https%3A%2F%2Fpurstech.com%2Ftools%3Fsearch%3Dhello%20world%26page%3D1");
    else setInput("https://purstech.com/tools?search=hello world&page=1&filter=free tools");
    setOutput(""); setError("");
  };

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
          <span className="text-gray-400">URL Encoder / Decoder</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🔗</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">URL Encoder / Decoder</h1>
              <p className="text-gray-500 mt-1">Encode or decode URLs and query parameters instantly — free, no login, works with full URLs and components.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Free","No Login","Encode Full URL","Encode Component","Decode"].map(b => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">✓ {b}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Mode selector */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-1.5 flex flex-col sm:flex-row gap-1">
              {[
                { id:"encode_component", label:"🔒 Encode Component", desc:"For query param values" },
                { id:"encode_full",      label:"🔒 Encode Full URL",  desc:"Preserves URL structure" },
                { id:"decode",           label:"🔓 Decode",           desc:"Any encoded URL/string" },
              ].map(m => (
                <button key={m.id} onClick={() => { setMode(m.id as typeof mode); setOutput(""); setError(""); }}
                  className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                    mode === m.id ? "bg-[#6C3AFF] text-white shadow-lg" : "text-gray-400 hover:text-white"
                  }`}>
                  <div>{m.label}</div>
                  <div className={`text-[10px] mt-0.5 ${mode === m.id ? "text-white/70" : "text-gray-600"}`}>{m.desc}</div>
                </button>
              ))}
            </div>

            {/* Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Input</label>
                <button onClick={loadSample} className="text-xs text-gray-600 hover:text-[#6C3AFF] transition-colors underline underline-offset-2">Load sample</button>
              </div>
              <textarea value={input} onChange={e => { setInput(e.target.value); setError(""); }}
                placeholder={mode === "decode" ? "Paste encoded URL or string here..." : "Paste URL or text to encode..."}
                className="w-full h-36 px-5 py-4 rounded-2xl bg-[#13131F] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all resize-none text-sm font-mono" />
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <button onClick={handleConvert} disabled={!input.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] disabled:opacity-40 text-white text-sm font-bold transition-all shadow-lg shadow-violet-900/30">
                {mode === "decode" ? "🔓 Decode" : "🔒 Encode"}
              </button>
              <button onClick={() => { setInput(""); setOutput(""); setError(""); }}
                className="px-5 py-3 rounded-xl bg-[#13131F] border border-white/5 hover:border-red-500/30 text-gray-400 hover:text-red-400 text-sm font-semibold transition-all">
                🗑️ Clear
              </button>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3 text-red-400 text-sm">{error}</div>}

            {/* Output */}
            {output && !error && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Output</label>
                  <button onClick={handleCopy}
                    className="text-xs bg-[#6C3AFF]/20 hover:bg-[#6C3AFF]/40 text-[#6C3AFF] px-3 py-1.5 rounded-lg font-bold transition-all">
                    {copied ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <div className="bg-[#13131F] border border-[#6C3AFF]/20 rounded-2xl p-5 text-sm font-mono text-[#00D4FF] break-all leading-relaxed">
                  {output}
                </div>
                <div className="flex gap-4 mt-2 text-xs text-gray-600">
                  <span>Input: <span className="text-gray-400">{input.length} chars</span></span>
                  <span>Output: <span className="text-gray-400">{output.length} chars</span></span>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">📚 Common Encodings</h3>
              <div className="grid grid-cols-2 gap-1.5">
                {SPECIAL_CHARS.slice(0, 12).map(c => (
                  <div key={c.char} className="flex justify-between items-center bg-[#0A0A14] rounded-lg px-2.5 py-1.5">
                    <span className="text-white font-mono text-sm">{c.char === " " ? "space" : c.char}</span>
                    <span className="text-[#6C3AFF] font-mono text-xs">{c.encoded}</span>
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
              <p className="text-gray-500 text-xs mb-4">Bulk encode, API access, no ads</p>
              <button className="w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all">Get Pro — $7/mo</button>
            </div>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use the URL Encoder</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step:"1", title:"Choose a Mode",       desc:"Select Encode Component for query parameter values, Encode Full URL to encode a complete URL while preserving its structure, or Decode to reverse any encoding." },
              { step:"2", title:"Paste Your Content",  desc:"Type or paste your URL or text. Click Load Sample to see an example of what encoded/decoded content looks like." },
              { step:"3", title:"Convert & Copy",      desc:"Click Encode or Decode. The result appears with syntax highlighting. Click Copy to grab it and use it in your code or browser." },
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
