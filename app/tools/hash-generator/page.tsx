"use client";

import { useState } from "react";
import Link from "next/link";

const RELATED_TOOLS = [
  { icon: "🔐", name: "Base64 Encoder",    slug: "base64-encoder"    },
  { icon: "🔗", name: "URL Encoder",       slug: "url-encoder"       },
  { icon: "🎲", name: "UUID Generator",    slug: "uuid-generator"    },
  { icon: "🔐", name: "Password Generator",slug: "password-generator"},
  { icon: "💻", name: "JSON Formatter",    slug: "json-formatter"    },
];

const FAQ = [
  { q: "What is a hash?", a: "A hash (or digest) is a fixed-length string produced by a hash function from any input. The same input always produces the same hash, but it is computationally infeasible to reverse a hash back to its original input. Even a tiny change in input produces a completely different hash." },
  { q: "What is MD5 used for?", a: "MD5 produces a 32-character hash. It is no longer considered secure for cryptographic purposes (collisions have been found), but it is still widely used for checksums, file integrity verification and non-security data fingerprinting." },
  { q: "What is SHA-256?", a: "SHA-256 is part of the SHA-2 family and produces a 64-character hash. It is currently the industry standard for security applications including SSL certificates, Bitcoin, and digital signatures. It is considered cryptographically secure." },
  { q: "What is SHA-512?", a: "SHA-512 produces a 128-character hash and is part of the SHA-2 family. It provides even stronger security than SHA-256 and is preferred in high-security contexts." },
  { q: "Can I reverse a hash?", a: "No — hash functions are one-way by design. You cannot derive the original input from a hash. This is fundamental to their security. What attackers can do is compare hashes against precomputed dictionaries (rainbow tables), which is why salting passwords before hashing is essential." },
];

async function hashText(text: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Simple MD5 implementation (no Web Crypto support for MD5)
function md5(input: string): string {
  function safeAdd(x: number, y: number) { const lsw = (x & 0xffff) + (y & 0xffff); const msw = (x >> 16) + (y >> 16) + (lsw >> 16); return (msw << 16) | (lsw & 0xffff); }
  function bitRotateLeft(num: number, cnt: number) { return (num << cnt) | (num >>> (32 - cnt)); }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) { return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn((b & c) | (~b & d), a, b, x, s, t); }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t); }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn(b ^ c ^ d, a, b, x, s, t); }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn(c ^ (b | ~d), a, b, x, s, t); }

  const str = unescape(encodeURIComponent(input));
  const x: number[] = [];
  for (let i = 0; i < str.length * 8; i += 8) x[i >> 5] = (x[i >> 5] || 0) | (str.charCodeAt(i / 8) << (i % 32));
  x[str.length * 8 >> 5] = (x[str.length * 8 >> 5] || 0) | 0x80 << (str.length * 8 % 32);
  x[(((str.length * 8 + 64) >>> 9) << 4) + 14] = str.length * 8;

  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
  for (let i = 0; i < x.length; i += 16) {
    const olda = a, oldb = b, oldc = c, oldd = d;
    a = md5ff(a,b,c,d,x[i],7,-680876936);a=md5ff(d,a,b,c,x[i+1],12,-389564586);a=md5ff(c,d,a,b,x[i+2],17,606105819);a=md5ff(b,c,d,a,x[i+3],22,-1044525330);
    a=md5ff(a,b,c,d,x[i+4],7,-176418897);a=md5ff(d,a,b,c,x[i+5],12,1200080426);a=md5ff(c,d,a,b,x[i+6],17,-1473231341);a=md5ff(b,c,d,a,x[i+7],22,-45705983);
    a=md5ff(a,b,c,d,x[i+8],7,1770035416);a=md5ff(d,a,b,c,x[i+9],12,-1958414417);a=md5ff(c,d,a,b,x[i+10],17,-42063);a=md5ff(b,c,d,a,x[i+11],22,-1990404162);
    a=md5ff(a,b,c,d,x[i+12],7,1804603682);a=md5ff(d,a,b,c,x[i+13],12,-40341101);a=md5ff(c,d,a,b,x[i+14],17,-1502002290);a=md5ff(b,c,d,a,x[i+15],22,1236535329);
    a=md5gg(a,b,c,d,x[i+1],5,-165796510);a=md5gg(d,a,b,c,x[i+6],9,-1069501632);a=md5gg(c,d,a,b,x[i+11],14,643717713);a=md5gg(b,c,d,a,x[i],20,-373897302);
    a=md5gg(a,b,c,d,x[i+5],5,-701558691);a=md5gg(d,a,b,c,x[i+10],9,38016083);a=md5gg(c,d,a,b,x[i+15],14,-660478335);a=md5gg(b,c,d,a,x[i+4],20,-405537848);
    a=md5gg(a,b,c,d,x[i+9],5,568446438);a=md5gg(d,a,b,c,x[i+14],9,-1019803690);a=md5gg(c,d,a,b,x[i+3],14,-187363961);a=md5gg(b,c,d,a,x[i+8],20,1163531501);
    a=md5gg(a,b,c,d,x[i+13],5,-1444681467);a=md5gg(d,a,b,c,x[i+2],9,-51403784);a=md5gg(c,d,a,b,x[i+7],14,1735328473);a=md5gg(b,c,d,a,x[i+12],20,-1926607734);
    a=md5hh(a,b,c,d,x[i+5],4,-378558);a=md5hh(d,a,b,c,x[i+8],11,-2022574463);a=md5hh(c,d,a,b,x[i+11],16,1839030562);a=md5hh(b,c,d,a,x[i+14],23,-35309556);
    a=md5hh(a,b,c,d,x[i+1],4,-1530992060);a=md5hh(d,a,b,c,x[i+4],11,1272893353);a=md5hh(c,d,a,b,x[i+7],16,-155497632);a=md5hh(b,c,d,a,x[i+10],23,-1094730640);
    a=md5hh(a,b,c,d,x[i+13],4,681279174);a=md5hh(d,a,b,c,x[i],11,-358537222);a=md5hh(c,d,a,b,x[i+3],16,-722521979);a=md5hh(b,c,d,a,x[i+6],23,76029189);
    a=md5hh(a,b,c,d,x[i+9],4,-640364487);a=md5hh(d,a,b,c,x[i+12],11,-421815835);a=md5hh(c,d,a,b,x[i+15],16,530742520);a=md5hh(b,c,d,a,x[i+2],23,-995338651);
    a=md5ii(a,b,c,d,x[i],6,-198630844);a=md5ii(d,a,b,c,x[i+7],10,1126891415);a=md5ii(c,d,a,b,x[i+14],15,-1416354905);a=md5ii(b,c,d,a,x[i+5],21,-57434055);
    a=md5ii(a,b,c,d,x[i+12],6,1700485571);a=md5ii(d,a,b,c,x[i+3],10,-1894986606);a=md5ii(c,d,a,b,x[i+10],15,-1051523);a=md5ii(b,c,d,a,x[i+1],21,-2054922799);
    a=md5ii(a,b,c,d,x[i+8],6,1873313359);a=md5ii(d,a,b,c,x[i+15],10,-30611744);a=md5ii(c,d,a,b,x[i+6],15,-1560198380);a=md5ii(b,c,d,a,x[i+13],21,1309151649);
    a=md5ii(a,b,c,d,x[i+4],6,-145523070);a=md5ii(d,a,b,c,x[i+11],10,-1120210379);a=md5ii(c,d,a,b,x[i+2],15,718787259);a=md5ii(b,c,d,a,x[i+9],21,-343485551);
    a=safeAdd(a,olda);b=safeAdd(b,oldb);c=safeAdd(c,oldc);d=safeAdd(d,oldd);
  }
  return [a,b,c,d].map(n => {
    let s = "";
    for (let j = 0; j < 4; j++) s += ((n >> (j*8)) & 0xff).toString(16).padStart(2,"0");
    return s;
  }).join("");
}

const ALGORITHMS = [
  { id:"MD5",     label:"MD5",     bits:128, chars:32,  note:"Fast but not secure"      },
  { id:"SHA-1",   label:"SHA-1",   bits:160, chars:40,  note:"Deprecated for security"  },
  { id:"SHA-256", label:"SHA-256", bits:256, chars:64,  note:"Industry standard ✓"      },
  { id:"SHA-384", label:"SHA-384", bits:384, chars:96,  note:"High security"            },
  { id:"SHA-512", label:"SHA-512", bits:512, chars:128, note:"Maximum security"         },
];

export default function HashGeneratorPage() {
  const [input,    setInput]    = useState("");
  const [hashes,   setHashes]   = useState<Record<string, string>>({});
  const [loading,  setLoading]  = useState(false);
  const [copied,   setCopied]   = useState<string | null>(null);
  const [openFaq,  setOpenFaq]  = useState<number | null>(null);
  const [uppercase,setUppercase]= useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const results: Record<string, string> = {};

    results["MD5"] = md5(input);
    for (const algo of ["SHA-1","SHA-256","SHA-384","SHA-512"]) {
      const webAlgo = algo === "SHA-1" ? "SHA-1" : algo;
      results[algo] = await hashText(input, webAlgo);
    }

    setHashes(results);
    setLoading(false);
  };

  const handleCopy = async (algo: string, hash: string) => {
    await navigator.clipboard.writeText(uppercase ? hash.toUpperCase() : hash);
    setCopied(algo);
    setTimeout(() => setCopied(null), 2000);
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
          <span className="text-gray-400">Hash Generator</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🔑</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">Hash Generator</h1>
              <p className="text-gray-500 mt-1">Generate MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hashes from any text — free, instant, private.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Free","No Login","5 Algorithms","All at Once","Browser-side Only"].map(b => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">✓ {b}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Text to Hash</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">UPPERCASE</span>
                    <button onClick={() => setUppercase(!uppercase)}
                      className={`w-9 h-5 rounded-full transition-all relative ${uppercase ? "bg-[#6C3AFF]" : "bg-gray-700"}`}>
                      <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${uppercase ? "left-5" : "left-1"}`} />
                    </button>
                  </div>
                  <button onClick={() => setInput("Hello, PursTech! Generate a hash of this text.")}
                    className="text-xs text-gray-600 hover:text-[#6C3AFF] transition-colors underline underline-offset-2">
                    Load sample
                  </button>
                </div>
              </div>
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.ctrlKey && e.key === "Enter" && handleGenerate()}
                placeholder="Enter any text, password, or data to hash..."
                className="w-full h-36 px-5 py-4 rounded-2xl bg-[#13131F] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all resize-none text-sm font-mono" />
              <p className="text-xs text-gray-700 mt-1">{input.length} characters · Press Ctrl+Enter to generate</p>
            </div>

            <button onClick={handleGenerate} disabled={!input.trim() || loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] hover:opacity-90 disabled:opacity-40 text-white font-extrabold text-lg transition-all shadow-xl shadow-violet-900/30">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </span>
              ) : "🔑 Generate All Hashes"}
            </button>

            {/* Hash results */}
            {Object.keys(hashes).length > 0 && (
              <div className="flex flex-col gap-3">
                {ALGORITHMS.map(algo => {
                  const hash = uppercase ? (hashes[algo.id] || "").toUpperCase() : (hashes[algo.id] || "");
                  return (
                    <div key={algo.id} className="bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/20 rounded-2xl p-5 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-extrabold text-white">{algo.label}</span>
                          <span className="text-xs text-gray-600">{algo.bits}-bit · {algo.chars} chars</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            algo.id === "SHA-256" || algo.id === "SHA-512" || algo.id === "SHA-384"
                              ? "bg-green-400/10 text-green-400"
                              : algo.id === "MD5" ? "bg-gray-400/10 text-gray-500"
                              : "bg-yellow-400/10 text-yellow-400"
                          }`}>{algo.note}</span>
                        </div>
                        <button onClick={() => handleCopy(algo.id, hash)}
                          className="text-xs bg-[#0A0A14] hover:bg-[#6C3AFF]/20 text-gray-500 hover:text-[#6C3AFF] px-2.5 py-1 rounded-lg font-bold transition-all flex-shrink-0">
                          {copied === algo.id ? "✅" : "📋 Copy"}
                        </button>
                      </div>
                      <div className="font-mono text-xs text-[#00D4FF] break-all bg-[#0A0A14] rounded-xl px-3 py-2.5 leading-relaxed">
                        {hash}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">📊 Algorithm Comparison</h3>
              <div className="space-y-3">
                {ALGORITHMS.map(a => (
                  <div key={a.id} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white w-14">{a.label}</span>
                    <div className="flex-1 bg-[#0A0A14] rounded-full h-2">
                      <div className={`h-2 rounded-full ${
                        a.id === "SHA-512" ? "bg-cyan-400" :
                        a.id === "SHA-384" ? "bg-blue-400" :
                        a.id === "SHA-256" ? "bg-green-400" :
                        a.id === "SHA-1"   ? "bg-yellow-400" : "bg-gray-500"
                      }`} style={{ width:`${(a.bits/512)*100}%` }} />
                    </div>
                    <span className="text-xs text-gray-600 w-10 text-right">{a.bits}b</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">⚡ Common Uses</h3>
              <div className="space-y-2 text-xs text-gray-500">
                {["File integrity verification","Password hashing (with salt)","Digital signatures","API request signing","Data deduplication","Blockchain / proof of work"].map(u => (
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
              <p className="text-gray-500 text-xs mb-4">File hashing, HMAC, bcrypt, API access</p>
              <button className="w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all">Get Pro — $7/mo</button>
            </div>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use the Hash Generator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step:"1", title:"Enter Your Text",     desc:"Paste or type any text, password or data into the input box. All hashing is done entirely in your browser — nothing is sent to any server." },
              { step:"2", title:"Click Generate",      desc:"Press Generate All Hashes (or Ctrl+Enter) to compute MD5, SHA-1, SHA-256, SHA-384 and SHA-512 simultaneously." },
              { step:"3", title:"Copy Your Hash",      desc:"Click the Copy button next to any algorithm to grab that hash. Toggle UPPERCASE if your application requires uppercase hex." },
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
