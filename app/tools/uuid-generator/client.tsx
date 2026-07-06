"use client";

import { useState } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; 

const RELATED_TOOLS = [
  { icon:"🔐", name:"Base64 Encoder",     slug:"base64-encoder"     },
  { icon:"🔗", name:"URL Encoder",        slug:"url-encoder"        },
  { icon:"🔑", name:"Hash Generator",     slug:"hash-generator"     },
  { icon:"🔐", name:"Password Generator", slug:"password-generator" },
  { icon:"💻", name:"JSON Formatter",     slug:"json-formatter"     },
];

const FAQ = [
  { q:"What is the difference between a UUID and a GUID?",
    a:"None in practice — GUID (Globally Unique Identifier) is Microsoft's name for the same 128-bit standard; UUID (Universally Unique Identifier) is the RFC 4122 term. Every UUID this tool generates is a valid GUID — use the braces output format for Microsoft-style {xxxxxxxx-...} values." },
  { q:"How many bytes is a UUID (and how long is it)?",
    a:"A UUID is 128 bits = 16 bytes of data, written as a 36-character string: 32 hexadecimal characters plus 4 hyphens. Version 4 contains 122 random bits, which allows about 5.3 x 10^36 possible values — enough that collisions are effectively impossible." },
  { q:"What is a UUID?",
    a:"A UUID (Universally Unique Identifier) is a 128-bit identifier formatted as 32 hexadecimal characters separated by hyphens: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. It is designed to be unique across all space and time without a central authority." },
  { q:"What is the difference between UUID v1 and v4?",
    a:"UUID v1 is based on the current timestamp and the MAC address of the machine generating it. UUID v4 is randomly generated. v4 is recommended for most applications as it does not leak system information like MAC address or creation time." },
  { q:"Are UUIDs truly unique?",
    a:"UUID v4 uses 122 bits of randomness, giving 2^122 possible values (~5.3 × 10^36). The probability of generating two identical UUIDs is astronomically small — effectively zero for any practical use case." },
  { q:"What are UUIDs used for?",
    a:"UUIDs are used as primary keys in databases, session tokens, transaction IDs, file names, API request IDs, and anywhere a unique identifier is needed without coordination between systems." },
  { q:"Is it safe to use UUIDs as public-facing IDs?",
    a:"UUID v4 is safe to expose publicly as it reveals no information about your system. However, they are guessable in theory (given enough attempts), so for security-sensitive tokens consider using a cryptographic random string instead." },
];

const FORMATS = [
  { id:"standard",   label:"Standard",    example:"550e8400-e29b-41d4-a716-446655440000" },
  { id:"uppercase",  label:"UPPERCASE",   example:"550E8400-E29B-41D4-A716-446655440000" },
  { id:"no_hyphens", label:"No hyphens",  example:"550e8400e29b41d4a716446655440000"     },
  { id:"braces",     label:"With braces", example:"{550e8400-e29b-41d4-a716-446655440000}" },
];

const UUID_VERSIONS = [
  { version:"v1", method:"Timestamp + MAC address",      randomBits:"0",   safe:false, recommended:false, use:"Time-series data, log ordering"    },
  { version:"v4", method:"Cryptographic random (CSPRNG)","randomBits":"122",safe:true, recommended:true,  use:"Most use cases — DB keys, tokens"  },
  { version:"v5", method:"SHA-1 hash of namespace+name", randomBits:"N/A", safe:true, recommended:false, use:"Reproducible IDs from same input"  },
];

function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function formatUUID(uuid: string, fmt: string): string {
  switch (fmt) {
    case "uppercase":  return uuid.toUpperCase();
    case "no_hyphens": return uuid.replace(/-/g, "");
    case "braces":     return `{${uuid}}`;
    default:           return uuid;
  }
}

export default function UUIDGeneratorClient({ children }: { children?: React.ReactNode }) {
  useTrackTool("uuid-generator", "dev");

  const [uuids,     setUuids]     = useState<string[]>([generateUUID()]);
  const [count,     setCount]     = useState(5);
  const [format,    setFormat]    = useState("standard");
  const [copied,    setCopied]    = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleGenerate = () => { setUuids(Array.from({ length:count }, generateUUID)); setCopied(null); };

  const handleCopy = async (uuid: string, i: number) => {
    await navigator.clipboard.writeText(formatUUID(uuid, format));
    setCopied(i); setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(uuids.map(u => formatUUID(u, format)).join("\n"));
    setCopiedAll(true); setTimeout(() => setCopiedAll(false), 2000);
  };

  const downloadTXT = () => {
    const b = new Blob([uuids.map(u => formatUUID(u, format)).join("\n")], { type:"text/plain" });
    Object.assign(document.createElement("a"), { href:URL.createObjectURL(b), download:"uuids.txt" }).click();
  };

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
          <span className="text-gray-400">UUID Generator</span>
        </nav>

        {children}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0 w-full">
          <div className="lg:col-span-2 min-w-0 flex flex-col gap-5 w-full">

            {/* Controls */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 flex flex-col gap-5 min-w-0 w-full">

              {/* Count slider */}
              <div className="min-w-0 w-full">
                <div className="flex justify-between items-center mb-3 min-w-0 w-full">
                  <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">How Many UUIDs</label>
                  <span className="text-2xl font-extrabold text-[#6C3AFF]">{count}</span>
                </div>
                <input type="range" min={1} max={50} value={count} onChange={e => setCount(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background:`linear-gradient(to right, #6C3AFF ${(count/50)*100}%, #1a1a2e ${(count/50)*100}%)` }} />
                <div className="flex justify-between text-xs text-gray-600 mt-1 min-w-0 w-full"><span>1</span><span>50</span></div>
              </div>

              {/* Format selector */}
              <div className="min-w-0 w-full">
                <label className="text-xs text-gray-500 font-medium block mb-3 uppercase tracking-wider">Format</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0 w-full">
                  {FORMATS.map(f => (
                    <button key={f.id} onClick={() => setFormat(f.id)}
                      className={`p-3 rounded-xl text-left transition-all border min-w-0 w-full ${
                        format===f.id
                          ? "bg-[#6C3AFF] border-[#6C3AFF] text-white"
                          : "bg-[#0A0A14] border-white/5 text-gray-400 hover:text-white hover:border-[#6C3AFF]/30"
                      }`}>
                      <div className="text-xs font-bold truncate">{f.label}</div>
                      <div className="text-[10px] font-mono mt-1 opacity-70 truncate">{f.example.slice(0,24)}…</div>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleGenerate}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] hover:opacity-90 text-white font-extrabold text-lg transition-all shadow-xl shadow-violet-900/30">
                🎲 Generate UUID{count > 1 ? "s" : ""}
              </button>
            </div>

            {/* Results */}
            {uuids.length > 0 && (
              <div className="min-w-0 w-full">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2 min-w-0 w-full">
                  <span className="text-sm font-bold text-white truncate">{uuids.length} UUID{uuids.length > 1 ? "s" : ""} Generated</span>
                  <div className="flex gap-2 min-w-0">
                    {uuids.length > 1 && (
                      <button onClick={downloadTXT}
                        className="text-xs bg-[#0A0A14] border border-white/10 hover:border-[#6C3AFF]/40 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg font-bold transition-all flex-shrink-0">
                        ⬇ Download TXT
                      </button>
                    )}
                    {uuids.length > 1 && (
                      <button onClick={handleCopyAll}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all flex-shrink-0 ${
                          copiedAll ? "bg-green-600 text-white" : "bg-[#6C3AFF]/20 hover:bg-[#6C3AFF]/40 text-[#6C3AFF]"
                        }`}>
                        {copiedAll ? "✅ Copied!" : "📋 Copy All"}
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-w-0 w-full">
                  {uuids.map((uuid, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/30 rounded-xl px-4 py-3 transition-all group min-w-0 w-full">
                      <span className="text-xs text-gray-600 w-5 text-right flex-shrink-0">{i+1}</span>
                      <span className="flex-1 min-w-0 font-mono text-sm text-[#00D4FF] truncate">{formatUUID(uuid, format)}</span>
                      <button onClick={() => handleCopy(uuid, i)}
                        className="text-xs bg-[#0A0A14] group-hover:bg-[#6C3AFF]/20 text-gray-600 group-hover:text-[#6C3AFF] px-2.5 py-1 rounded-lg font-bold transition-all flex-shrink-0">
                        {copied===i ? "✅" : "📋"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="min-w-0 flex flex-col gap-4 w-full">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
              <h3 className="text-sm font-bold text-white mb-4">📚 UUID Structure</h3>
              <div className="font-mono text-xs bg-[#0A0A14] rounded-xl p-3 mb-3 break-all min-w-0 w-full">
                <span className="text-red-400">550e8400</span>-
                <span className="text-yellow-400">e29b</span>-
                <span className="text-green-400">41d4</span>-
                <span className="text-cyan-400">a716</span>-
                <span className="text-violet-400">446655440000</span>
              </div>
              <div className="space-y-2 text-xs min-w-0 w-full">
                {[
                  { color:"text-red-400",    label:"Time low (8 hex)"     },
                  { color:"text-yellow-400", label:"Time mid (4 hex)"     },
                  { color:"text-green-400",  label:"Version + time (4 hex)" },
                  { color:"text-cyan-400",   label:"Variant + clock (4 hex)"},
                  { color:"text-violet-400", label:"Node / random (12 hex)" },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full bg-current flex-shrink-0 ${s.color}`} />
                    <span className="text-gray-500 truncate">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
              <h3 className="text-sm font-bold text-white mb-4">⚡ Common Uses</h3>
              <div className="space-y-2 text-xs text-gray-500 min-w-0 w-full">
                {["Database primary keys","Session & auth tokens","API request IDs","File & asset naming","Distributed system IDs","Transaction references"].map(u => (
                  <div key={u} className="flex items-center gap-2 min-w-0"><span className="text-[#6C3AFF] flex-shrink-0">→</span><span className="truncate">{u}</span></div>
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
              <p className="text-gray-500 text-xs mb-4">UUID v1/v5, bulk export CSV, API access</p>
              <Link href="/pro"
                className="block w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all text-center">
                Get Pro — $7/mo
              </Link>
            </div>
          </div>
        </div>

        {/* ── Rich content ─────────────────────────────────────────────────── */}

        {/* ✅ MOBILE-SAFE: UUID Versions Comparison (Overflow Auto Wrapper) */}
        <section className="mt-16 min-w-0 w-full">
          <h2 className="text-2xl font-extrabold text-white mb-2">UUID Versions Explained</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-2xl leading-relaxed">There are five UUID versions (v1–v5), each using a different algorithm. v4 is by far the most common for web and software applications.</p>
          <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden min-w-0 w-full">
            <div className="overflow-x-auto w-full scrollbar-hide">
              <div className="min-w-[650px]">
                <div className="grid grid-cols-5 text-xs text-gray-500 font-semibold uppercase tracking-wider px-5 py-3 border-b border-white/5 w-full">
                  <span>Version</span><span>Method</span><span>Random bits</span><span>System-safe</span><span>Best for</span>
                </div>
                {UUID_VERSIONS.map(v => (
                  <div key={v.version} className={`grid grid-cols-5 px-5 py-4 border-b border-white/5 last:border-0 gap-2 w-full ${v.recommended ? "bg-[#6C3AFF]/5" : "hover:bg-white/[0.02]"} transition-colors`}>
                    <span className={`font-bold text-sm font-mono ${v.recommended ? "text-[#6C3AFF]" : "text-white"}`}>
                      UUID {v.version} {v.recommended && <span className="text-[10px] bg-[#6C3AFF]/20 text-[#6C3AFF] px-1.5 py-0.5 rounded-full ml-1">Recommended</span>}
                    </span>
                    <span className="text-gray-400 text-xs self-center">{v.method}</span>
                    <span className="text-gray-300 text-xs font-mono self-center">{v.randomBits}</span>
                    <span className={`text-xs font-semibold self-center ${v.safe ? "text-green-400" : "text-yellow-400"}`}>{v.safe ? "✓ Yes" : "⚠ Leaks MAC"}</span>
                    <span className="text-gray-400 text-xs self-center">{v.use}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="mt-12 min-w-0 w-full">
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use the UUID Generator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0 w-full">
            {[
              { step:"1", title:"Set the Quantity",  desc:"Use the slider to choose how many UUIDs to generate at once — from 1 to 50." },
              { step:"2", title:"Choose a Format",   desc:"Pick Standard, UPPERCASE, No Hyphens or With Braces depending on what your code or database requires." },
              { step:"3", title:"Generate & Export", desc:"Click Generate. Copy individual UUIDs, Copy All as a newline-separated list, or Download TXT for database seeding scripts." },
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


