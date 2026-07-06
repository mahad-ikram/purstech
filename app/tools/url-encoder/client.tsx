"use client";

import { useState } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ Rule 3

// ── Module-scope constants ───────────────
const RELATED_TOOLS = [
  { icon:"🔐", name:"Base64 Encoder",    slug:"base64-encoder"    },
  { icon:"💻", name:"JSON Formatter",    slug:"json-formatter"    },
  { icon:"🔑", name:"Hash Generator",    slug:"hash-generator"    },
  { icon:"🎲", name:"UUID Generator",    slug:"uuid-generator"    },
  { icon:"🔲", name:"QR Code Generator", slug:"qr-code-generator" },
];

const FAQ = [
  { q:"What is the difference between encodeURI and encodeURIComponent?",
    a:"encodeURIComponent escapes everything including : / ? = & — use it for query-parameter values. encodeURI preserves those structural characters — use it for a complete URL. Encode a full address with Component mode and you will break it; the two buttons here map exactly to these two functions." },
  { q:"What is URL encoding?",
    a:"URL encoding (also called percent-encoding) converts characters that are not allowed in URLs into a format that can be safely transmitted. Special characters like spaces, &, =, and ? are replaced with a % followed by their hexadecimal code. For example, a space becomes %20 and & becomes %26." },
  { q:"When do I need to URL encode?",
    a:"You need URL encoding when passing data in query strings, building API requests, creating redirect URLs, encoding form data, or any time special characters appear in a URL. Without encoding, the URL may be misinterpreted by browsers and servers." },
  { q:"What is the difference between encodeURI and encodeURIComponent?",
    a:"encodeURI encodes a full URL and skips characters that are valid in URLs (like /, :, @). encodeURIComponent encodes a component (like a query parameter value) and encodes nearly everything including /, ?, =. Use encodeURIComponent for individual parameter values." },
  { q:"What characters are safe in URLs without encoding?",
    a:"The unreserved characters A-Z, a-z, 0-9, -, _, ., and ~ are always safe in URLs. All other characters should be percent-encoded for guaranteed compatibility across all systems." },
  { q:"Can I encode an entire URL at once?",
    a:"Yes — use Encode Full URL mode which preserves the URL structure (protocol, slashes, domain) while encoding only the parts that need it. Use Encode Component for individual query parameter values." },
];

const SPECIAL_CHARS = [
  { char:" ",  encoded:"%20" }, { char:"!",  encoded:"%21" },
  { char:"#",  encoded:"%23" }, { char:"$",  encoded:"%24" },
  { char:"&",  encoded:"%26" }, { char:"'",  encoded:"%27" },
  { char:"(",  encoded:"%28" }, { char:")",  encoded:"%29" },
  { char:"*",  encoded:"%2A" }, { char:"+",  encoded:"%2B" },
  { char:",",  encoded:"%2C" }, { char:"/",  encoded:"%2F" },
  { char:":",  encoded:"%3A" }, { char:";",  encoded:"%3B" },
  { char:"=",  encoded:"%3D" }, { char:"?",  encoded:"%3F" },
  { char:"@",  encoded:"%40" }, { char:"[",  encoded:"%5B" },
  { char:"]",  encoded:"%5D" },
];

const USE_CASES = [
  { icon:"🔍", title:"Search Queries",      desc:"Encode search terms before appending to a URL so spaces and symbols don't break the request. ?q=hello%20world is valid; ?q=hello world is not." },
  { icon:"🔀", title:"Redirect URLs",       desc:"When building redirect parameters like ?next=/dashboard?tab=settings, the inner URL must be component-encoded so the outer parser sees it as one value." },
  { icon:"🌐", title:"API Requests",        desc:"REST APIs require query parameters to be percent-encoded. Encoding email=user@example.com as email=user%40example.com ensures @ is not mistaken for a URL authority separator." },
  { icon:"📋", title:"Form Data",           desc:"HTML forms URL-encode data automatically on submission, but when constructing fetch() calls manually you must encode each value with encodeURIComponent." },
  { icon:"🔧", title:"Config & Debugging",  desc:"Decode logged or obfuscated URLs to read them clearly. Useful for debugging tracking URLs, affiliate links and redirect chains." },
];

const EXAMPLES = [
  { label:"Space in query",     raw:'?q=hello world',       encoded:'?q=hello%20world'       },
  { label:"Ampersand in value", raw:'tag=news&sport',       encoded:'tag=news%26sport'       },
  { label:"Email address",      raw:'email=me@example.com', encoded:'email=me%40example.com' },
  { label:"Slash in value",     raw:'path=/home/user',      encoded:'path=%2Fhome%2Fuser'    },
  { label:"Full URL",           raw:'https://example.com/search?q=hello world&lang=en', encoded:'https://example.com/search?q=hello%20world&lang=en' },
];

export default function URLEncoderClient({ children }: { children?: React.ReactNode }) {
  useTrackTool("url-encoder", "dev");

  const [input,  setInput]  = useState("");
  const [output, setOutput] = useState("");
  const [mode,   setMode]   = useState<"encode_full"|"encode_component"|"decode">("encode_component");
  const [error,  setError]  = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    if (!input.trim()) { setError("Please enter some text first."); return; }
    setError("");
    try {
      if (mode === "encode_full")           setOutput(encodeURI(input));
      else if (mode === "encode_component") setOutput(encodeURIComponent(input));
      else {
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

  const useAsInput = () => { setInput(output); setOutput(""); setError(""); };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden">

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
            <Link href="/pro" className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10 flex-grow w-full">

        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/dev" className="hover:text-gray-400">Dev Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">URL Encoder / Decoder</span>
        </nav>

        {children}

        {/* ✅ Rule 9: min-w-0 on both lg:grid-cols-3 children */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0 w-full">
          <div className="lg:col-span-2 min-w-0 flex flex-col gap-5 w-full">

            {/* Mode selector */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-1.5 flex flex-col sm:flex-row gap-1 min-w-0 w-full">
              {[
                { id:"encode_component", label:"🔒 Encode Component", desc:"For query param values"  },
                { id:"encode_full",      label:"🔒 Encode Full URL",  desc:"Preserves URL structure" },
                { id:"decode",           label:"🔓 Decode",           desc:"Any encoded URL/string"  },
              ].map(m => (
                <button key={m.id} onClick={() => { setMode(m.id as typeof mode); setOutput(""); setError(""); }}
                  className={`flex-1 min-w-0 py-3 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                    mode===m.id ? "bg-[#6C3AFF] text-white shadow-lg" : "text-gray-400 hover:text-white"
                  }`}>
                  <div className="truncate pr-1">{m.label}</div>
                  <div className={`text-[10px] mt-0.5 truncate ${mode===m.id ? "text-white/70" : "text-gray-600"}`}>{m.desc}</div>
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="min-w-0 w-full">
              <div className="flex items-center justify-between mb-2 min-w-0 w-full">
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Input</label>
                <button onClick={loadSample} className="text-xs text-gray-600 hover:text-[#6C3AFF] transition-colors underline underline-offset-2 flex-shrink-0">Load sample</button>
              </div>
              <textarea value={input} onChange={e => { setInput(e.target.value); setError(""); }}
                placeholder={mode==="decode" ? "Paste encoded URL or string here..." : "Paste URL or text to encode..."}
                className="w-full min-w-0 h-36 px-5 py-4 rounded-2xl bg-[#13131F] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all resize-none text-sm font-mono" />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 min-w-0 w-full">
              <button onClick={handleConvert} disabled={!input.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] disabled:opacity-40 text-white text-sm font-bold transition-all shadow-lg shadow-violet-900/30">
                {mode==="decode" ? "🔓 Decode" : "🔒 Encode"}
              </button>
              <button onClick={() => { setInput(""); setOutput(""); setError(""); }}
                className="px-5 py-3 rounded-xl bg-[#13131F] border border-white/5 hover:border-red-500/30 text-gray-400 hover:text-red-400 text-sm font-semibold transition-all">
                🗑️ Clear
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3 text-red-400 text-sm min-w-0 w-full break-all">{error}</div>
            )}

            {/* Output */}
            {output && !error && (
              <div className="min-w-0 w-full">
                <div className="flex items-center justify-between mb-2 min-w-0 w-full">
                  <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Output</label>
                  <div className="flex gap-2 min-w-0">
                    <button onClick={useAsInput}
                      className="text-xs bg-[#0A0A14] border border-white/10 hover:border-[#6C3AFF]/40 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg font-semibold transition-all truncate pr-1">
                      ↩ Use as input
                    </button>
                    <button onClick={handleCopy}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all flex-shrink-0 ${
                        copied ? "bg-green-600 text-white" : "bg-[#6C3AFF]/20 hover:bg-[#6C3AFF]/40 text-[#6C3AFF]"
                      }`}>
                      {copied ? "✅ Copied!" : "📋 Copy"}
                    </button>
                  </div>
                </div>
                <div className="bg-[#13131F] border border-[#6C3AFF]/20 rounded-2xl p-5 text-sm font-mono text-[#00D4FF] break-all leading-relaxed min-w-0 w-full">
                  {output}
                </div>
                <div className="flex gap-4 mt-2 text-xs text-gray-600 min-w-0 w-full flex-wrap">
                  <span className="truncate pr-1">Input: <span className="text-gray-400">{input.length} chars</span></span>
                  <span className="truncate pr-1">Output: <span className="text-gray-400">{output.length} chars</span></span>
                  <span className={`flex-shrink-0 ${output.length > input.length ? "text-yellow-400" : "text-green-400"}`}>
                    {output.length > input.length ? `+${output.length - input.length}` : `${output.length - input.length}`} chars
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="min-w-0 flex flex-col gap-4 w-full">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
              <h3 className="text-sm font-bold text-white mb-4">📚 Common Encodings</h3>
              <div className="grid grid-cols-2 gap-1.5 min-w-0 w-full">
                {SPECIAL_CHARS.slice(0, 12).map(c => (
                  <div key={c.char} className="flex justify-between items-center bg-[#0A0A14] rounded-lg px-2.5 py-1.5 min-w-0 w-full">
                    <span className="text-white font-mono text-sm truncate pr-1">{c.char===" " ? "space" : c.char}</span>
                    <span className="text-[#6C3AFF] font-mono text-xs flex-shrink-0">{c.encoded}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
              <h3 className="text-sm font-bold text-white mb-4">🔧 Related Tools</h3>
              <div className="space-y-2 min-w-0 w-full">
                {RELATED_TOOLS.map(tool => (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#0A0A14] transition-colors group min-w-0">
                    <span className="text-xl flex-shrink-0">{tool.icon}</span>
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors min-w-0 truncate">{tool.name}</span>
                    <span className="ml-auto text-gray-700 group-hover:text-[#6C3AFF] flex-shrink-0">→</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 text-center min-w-0 w-full">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-white text-sm mb-1">PursTech Pro</h3>
              <p className="text-gray-500 text-xs mb-4">Bulk encode, API access, no ads</p>
              <Link href="/pro"
                className="block w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all text-center">
                Get Pro — $7/mo
              </Link>
            </div>
          </div>
        </div>

        {/* ── Rich content ─────────────────────────────────────────────────── */}

        {/* Use Cases */}
        <section className="mt-16 min-w-0 w-full">
          <h2 className="text-2xl font-extrabold text-white mb-2">When Do You Need URL Encoding?</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-2xl leading-relaxed">Percent-encoding is not optional — it is a strict requirement of the HTTP and URI specifications. Here are the five most common situations where it applies.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0 w-full">
            {USE_CASES.map(u => (
              <div key={u.title} className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
                <div className="flex items-center gap-2 mb-2 min-w-0 w-full">
                  <span className="text-2xl flex-shrink-0">{u.icon}</span>
                  <span className="font-bold text-white text-sm truncate pr-2">{u.title}</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Common Examples */}
        <section className="mt-12 min-w-0 w-full">
          <h2 className="text-2xl font-extrabold text-white mb-2">Common Encoding Examples</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-2xl leading-relaxed">Real before-and-after examples you can load directly into the tool above.</p>
          <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden min-w-0 w-full">
            <div className="grid grid-cols-3 text-xs text-gray-500 font-semibold uppercase tracking-wider px-5 py-3 border-b border-white/5 min-w-0 w-full">
              <span className="truncate pr-1">Situation</span>
              <span className="truncate pr-1">Raw (unencoded)</span>
              <span className="truncate pr-1">Encoded</span>
            </div>
            {EXAMPLES.map(ex => (
              <div key={ex.label} className="grid grid-cols-3 px-5 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors gap-2 min-w-0 w-full">
                <span className="text-gray-400 text-xs self-center truncate pr-1">{ex.label}</span>
                <span className="text-red-300 text-xs font-mono break-all self-center min-w-0">{ex.raw}</span>
                <span className="text-green-400 text-xs font-mono break-all self-center min-w-0">{ex.encoded}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How to Use */}
        <section className="mt-12 min-w-0 w-full">
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use the URL Encoder</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0 w-full">
            {[
              { step:"1", title:"Choose a Mode",       desc:"Select Encode Component for query parameter values, Encode Full URL to encode a complete URL while preserving its structure, or Decode to reverse any encoding." },
              { step:"2", title:"Paste Your Content",  desc:"Type or paste your URL or text. Click Load Sample to see an example of what encoded/decoded content looks like." },
              { step:"3", title:"Convert & Copy",      desc:"Click Encode or Decode. The result appears with syntax highlighting. Use 'Use as input' for chained operations, or Copy to grab the result." },
            ].map(s => (
              <div key={s.step} className="bg-[#13131F] border border-white/5 rounded-2xl p-6 min-w-0 w-full">
                <div className="w-10 h-10 rounded-full bg-[#6C3AFF]/20 border border-[#6C3AFF]/30 flex items-center justify-center text-[#6C3AFF] font-black text-lg mb-4 flex-shrink-0">{s.step}</div>
                <h3 className="font-bold text-white mb-2 truncate pr-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ — ✅ Rule 8: <details>/<summary> */}
        <section className="mt-12 min-w-0 w-full">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3 max-w-3xl min-w-0 w-full">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all min-w-0 w-full">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none min-w-0 w-full">
                  <span className="min-w-0 pr-4">{f.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </section>
      </main>

      {/* ✅ Rule 5: Privacy/Terms/Contact + © 2026 */}
      <footer className="border-t border-white/5 mt-20 py-8 text-center min-w-0 w-full">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
