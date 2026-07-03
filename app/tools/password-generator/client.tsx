"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ Rule 3

// ─── Constants ────────────────────────────────────────────────────────────────

const CHARS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers:   "0123456789",
  symbols:   "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

// ✅ Rule 10: RELATED_TOOLS declared at module scope — .map() below uses same name
const RELATED_TOOLS = [
  { icon: "🔐", name: "Hash Generator", slug: "hash-generator"  },
  { icon: "🔒", name: "Base64 Encoder", slug: "base64-encoder"  },
  { icon: "🛡️", name: "SSL Checker",    slug: "ssl-checker"     },
  { icon: "🔑", name: "UUID Generator", slug: "uuid-generator"  },
  { icon: "📝", name: "Word Counter",   slug: "word-counter"    },
];

// ✅ Rule 10: FAQ declared at module scope — .map() below uses same name
// ✅ Rule 8: Rendered with <details>/<summary> — no useState toggle
const FAQ = [
  { q: "How does the password generator work?",
    a: "It uses your browser's built-in cryptographically secure random number generator (crypto.getRandomValues) to pick characters from the character sets you select. This is far more secure than Math.random() and is the same API used by professional security tools." },
  { q: "Is my generated password stored anywhere?",
    a: "No. Everything happens entirely in your browser. No password is ever sent to any server. Your generated passwords are 100% private and leave no trace." },
  { q: "What makes a password strong?",
    a: "Length is the single biggest factor. A 20-character password with mixed characters is exponentially harder to crack than a 10-character one. We recommend at least 16 characters with uppercase, lowercase, numbers and symbols, giving 80+ bits of entropy." },
  { q: "What is password entropy?",
    a: "Entropy measures how unpredictable a password is in bits, calculated as length × log₂(pool size). A 16-character password with all character types has about 100 bits of entropy — effectively uncrackable with current hardware." },
  { q: "Should I use a password manager?",
    a: "Yes — always. Use this tool to generate strong passwords, then store them in a password manager like Bitwarden (free, open-source) or 1Password so you never need to remember them. Never reuse passwords across accounts." },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generatePassword(
  length: number, useUpper: boolean, useLower: boolean,
  useNumbers: boolean, useSymbols: boolean, excludeAmbiguous: boolean
): string {
  let pool = "";
  if (useUpper)   pool += CHARS.uppercase;
  if (useLower)   pool += CHARS.lowercase;
  if (useNumbers) pool += CHARS.numbers;
  if (useSymbols) pool += CHARS.symbols;
  if (!pool)      pool  = CHARS.lowercase;
  if (excludeAmbiguous) pool = pool.replace(/[Il1O0]/g, "");
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array).map((n) => pool[n % pool.length]).join("");
}

function calcEntropy(length: number, poolSize: number): number {
  return poolSize ? Math.round(length * Math.log2(poolSize)) : 0;
}

function calcPoolSize(
  useUpper: boolean, useLower: boolean, useNumbers: boolean,
  useSymbols: boolean, excludeAmbiguous: boolean
): number {
  let n = 0;
  if (useUpper)   n += excludeAmbiguous ? CHARS.uppercase.replace(/[IO]/g,"").length   : 26;
  if (useLower)   n += excludeAmbiguous ? CHARS.lowercase.replace(/[l]/g,"").length    : 26;
  if (useNumbers) n += excludeAmbiguous ? CHARS.numbers.replace(/[10]/g,"").length     : 10;
  if (useSymbols) n += CHARS.symbols.length;
  return n;
}

function strengthLabel(entropy: number): { label:string; color:string; bg:string; pct:number } {
  if (entropy < 28) return { label:"Very Weak",  color:"text-red-400",    bg:"bg-red-500",    pct:10  };
  if (entropy < 36) return { label:"Weak",       color:"text-orange-400", bg:"bg-orange-500", pct:28  };
  if (entropy < 60) return { label:"Fair",       color:"text-yellow-400", bg:"bg-yellow-400", pct:50  };
  if (entropy < 80) return { label:"Strong",     color:"text-green-400",  bg:"bg-green-500",  pct:75  };
  return               { label:"Very Strong", color:"text-cyan-400",   bg:"bg-cyan-400",   pct:100 };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PasswordGeneratorClient() {
  useTrackTool("password-generator", "security"); // ✅ Rule 3

  const [length,           setLength]           = useState(16);
  const [useUpper,         setUseUpper]         = useState(true);
  const [useLower,         setUseLower]         = useState(true);
  const [useNumbers,       setUseNumbers]       = useState(true);
  const [useSymbols,       setUseSymbols]       = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [passwords,        setPasswords]        = useState<string[]>([]);
  const [quantity,         setQuantity]         = useState(5);
  const [copied,           setCopied]           = useState<number | null>(null);
  // ✅ Rule 8: openFaq useState REMOVED — FAQ uses <details>/<summary> instead

  const handleGenerate = useCallback(() => {
    setPasswords(Array.from({ length: quantity }, () =>
      generatePassword(length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous)
    ));
    setCopied(null);
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous, quantity]);

  const handleCopy = async (pw: string, index: number) => {
    await navigator.clipboard.writeText(pw);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(passwords.join("\n"));
    setCopied(-1);
    setTimeout(() => setCopied(null), 2000);
  };

  // ✅ UI Enhancement: Download batch as .txt
  const handleDownload = () => {
    if (!passwords.length) return;
    Object.assign(document.createElement("a"), {
      href:     URL.createObjectURL(new Blob([passwords.join("\n")], { type: "text/plain" })),
      download: "passwords.txt",
    }).click();
  };

  const poolSize = calcPoolSize(useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous);
  const entropy  = calcEntropy(length, poolSize);
  const strength = strengthLabel(entropy);

  return (
    // ✅ Rule 6: flex flex-col overflow-x-hidden
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden">

      {/* ── Navbar — ✅ Rule 4: sticky + backdrop-blur + Go Pro ── */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">← All Tools</Link>
            <Link href="/pro" className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
        </div>
      </nav>

      {/* ✅ Rule 7: flex-grow w-full on main */}
      <main className="max-w-7xl mx-auto px-4 py-10 flex-grow w-full">

        {/* ✅ Rule 11: aria-label + aria-hidden on › */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/security" className="hover:text-gray-400 transition-colors">Security</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">Password Generator</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🔐</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">Random Password Generator</h1>
              <p className="text-gray-500 mt-1">Generate strong, secure, random passwords instantly — free, private, no login.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Free","No Login","Cryptographically Secure","Never Stored","Private"].map(b => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">✓ {b}</span>
            ))}
          </div>
        </div>

        {/* ✅ Rule 9: min-w-0 on BOTH grid children */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: Controls + Output ── */}
          <div className="lg:col-span-2 min-w-0 flex flex-col gap-5">

            {/* Settings card */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 flex flex-col gap-6">

              {/* Length slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-white">Password Length</span>
                  <span className="text-2xl font-extrabold text-[#6C3AFF]">{length}</span>
                </div>
                <input type="range" min={6} max={64} value={length}
                  onChange={e => setLength(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background:`linear-gradient(to right, #6C3AFF ${((length-6)/58)*100}%, #1a1a2e ${((length-6)/58)*100}%)` }} />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>6</span><span>16</span><span>32</span><span>48</span><span>64</span>
                </div>
              </div>

              {/* Character sets */}
              <div>
                <span className="text-sm font-bold text-white block mb-3">Character Types</span>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label:"Uppercase (A–Z)", value:useUpper,   set:setUseUpper,   example:"ABC" },
                    { label:"Lowercase (a–z)", value:useLower,   set:setUseLower,   example:"abc" },
                    { label:"Numbers (0–9)",   value:useNumbers, set:setUseNumbers, example:"123" },
                    { label:"Symbols (!@#)",   value:useSymbols, set:setUseSymbols, example:"!@#" },
                  ].map(opt => (
                    <button key={opt.label}
                      onClick={() => {
                        const others = [
                          opt.label==="Uppercase (A–Z)" ? false : useUpper,
                          opt.label==="Lowercase (a–z)" ? false : useLower,
                          opt.label==="Numbers (0–9)"   ? false : useNumbers,
                          opt.label==="Symbols (!@#)"   ? false : useSymbols,
                        ];
                        if (!opt.value || others.some(Boolean)) opt.set(!opt.value);
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        opt.value ? "bg-[#6C3AFF]/10 border-[#6C3AFF]/40 text-white" : "bg-[#0A0A14] border-white/5 text-gray-500"
                      }`}>
                      <div className="text-left">
                        <div className="text-xs font-semibold">{opt.label}</div>
                        <div className="text-xs font-mono text-gray-500 mt-0.5">{opt.example}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                        opt.value ? "bg-[#6C3AFF] border-[#6C3AFF]" : "border-gray-600"
                      }`}>
                        {opt.value && <span className="text-white text-xs font-black">✓</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Exclude ambiguous */}
              <div className="flex flex-wrap gap-4">
                <button onClick={() => setExcludeAmbiguous(!excludeAmbiguous)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all ${
                    excludeAmbiguous ? "bg-[#6C3AFF]/10 border-[#6C3AFF]/40 text-white" : "bg-[#0A0A14] border-white/5 text-gray-500"
                  }`}>
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    excludeAmbiguous ? "bg-[#6C3AFF] border-[#6C3AFF]" : "border-gray-600"
                  }`}>
                    {excludeAmbiguous && <span className="text-white text-[10px] font-black">✓</span>}
                  </div>
                  Exclude ambiguous (I, l, 1, O, 0)
                </button>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-white">Generate</span>
                <div className="flex items-center gap-2">
                  {[1, 5, 10].map(q => (
                    <button key={q} onClick={() => setQuantity(q)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        quantity===q ? "bg-[#6C3AFF] text-white" : "bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white"
                      }`}>{q}</button>
                  ))}
                </div>
                <span className="text-sm text-gray-500">password{quantity > 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* Strength meter */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-white">Password Strength</span>
                <span className={`text-sm font-extrabold ${strength.color}`}>{strength.label}</span>
              </div>
              <div className="bg-[#0A0A14] rounded-full h-3">
                <div className={`${strength.bg} h-3 rounded-full transition-all duration-500`} style={{ width:`${strength.pct}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-3">
                <span>Entropy: <span className="text-gray-400 font-semibold">{entropy} bits</span></span>
                <span>Pool: <span className="text-gray-400 font-semibold">{poolSize} chars</span></span>
                <span>Combos: <span className="text-gray-400 font-semibold">10<sup>{Math.floor(entropy/3.32)}</sup>+</span></span>
              </div>
            </div>

            {/* Generate button */}
            <button onClick={handleGenerate}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] hover:opacity-90 text-white font-extrabold text-lg transition-all shadow-xl shadow-violet-900/30">
              ⚡ Generate Password{quantity > 1 ? "s" : ""}
            </button>

            {/* Output */}
            {passwords.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Generated Password{passwords.length > 1 ? "s" : ""}</span>
                  {passwords.length > 1 && (
                    <div className="flex gap-2">
                      {/* ✅ UI Enhancement: Download .txt */}
                      <button onClick={handleDownload}
                        className="text-xs bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg font-semibold transition-all">
                        ⬇ .txt
                      </button>
                      <button onClick={handleCopyAll}
                        className="text-xs bg-[#6C3AFF]/20 hover:bg-[#6C3AFF]/40 text-[#6C3AFF] px-3 py-1.5 rounded-lg font-bold transition-all">
                        {copied===-1 ? "✅ Copied all!" : "📋 Copy All"}
                      </button>
                    </div>
                  )}
                </div>
                {passwords.map((pw, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/30 rounded-2xl px-5 py-4 transition-all group">
                    <span className="flex-1 min-w-0 font-mono text-sm text-white break-all tracking-wider">{pw}</span>
                    <button onClick={() => handleCopy(pw, i)}
                      className="flex-shrink-0 text-xs bg-[#0A0A14] group-hover:bg-[#6C3AFF]/20 text-gray-500 group-hover:text-[#6C3AFF] px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap">
                      {copied===i ? "✅" : "📋 Copy"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="min-w-0 flex flex-col gap-4">

            {/* Strength guide */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">🛡️ Strength Guide</h3>
              <div className="space-y-3">
                {[
                  { label:"Very Weak",  desc:"< 28 bits",  color:"bg-red-500",    tip:"Under 8 chars"  },
                  { label:"Weak",       desc:"28–36 bits", color:"bg-orange-500", tip:"8–10 chars"     },
                  { label:"Fair",       desc:"36–60 bits", color:"bg-yellow-400", tip:"10–12 chars"    },
                  { label:"Strong",     desc:"60–80 bits", color:"bg-green-500",  tip:"12–16 chars"    },
                  { label:"Very Strong",desc:"80+ bits",   color:"bg-cyan-400",   tip:"16+ chars ✓"   },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white">{s.label}</div>
                      <div className="text-xs text-gray-600">{s.tip}</div>
                    </div>
                    <div className="text-xs text-gray-600 flex-shrink-0">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security tips */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">💡 Security Tips</h3>
              <div className="space-y-3 text-xs text-gray-500">
                {[
                  "Use a unique password for every account",
                  "Never reuse passwords across sites",
                  "Store passwords in a password manager",
                  "Enable 2FA wherever possible",
                  "16+ characters is recommended",
                  "Never share passwords over email or chat",
                ].map(tip => (
                  <div key={tip} className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related tools */}
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
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Generate a Secure Password</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Set password length",    desc:"Drag the slider to choose a length. 16+ characters is recommended for most accounts. 20+ for banking and email." },
              { step:"2", title:"Choose character types", desc:"Enable uppercase, lowercase, numbers and symbols for maximum entropy. Check Exclude Ambiguous to avoid confusable characters." },
              { step:"3", title:"Click Generate",         desc:"Instantly creates cryptographically secure passwords using your browser's crypto.getRandomValues API — never Math.random()." },
              { step:"4", title:"Copy and store",         desc:"Click Copy next to any password. Use ⬇ .txt to save a batch file. Store all passwords in a password manager like Bitwarden." },
            ].map(s => (
              <div key={s.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#6C3AFF] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">{s.step}</div>
                <div>
                  <div className="font-semibold text-white text-sm mb-1">{s.title}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Rule 8: FAQ uses <details>/<summary> — no useState toggle */}
        {/* ✅ Rule 10: FAQ.map() matches `const FAQ` at module scope */}
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

      {/* ✅ Rule 5: © 2026 + Privacy/Terms/Contact */}
      <footer className="border-t border-white/5 mt-16 py-8 text-center">
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
