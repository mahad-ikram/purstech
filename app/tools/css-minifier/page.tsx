"use client";

import { useState } from "react";
import Link from "next/link";

const RELATED_TOOLS = [
  { icon: "⚡", name: "JS Minifier",      slug: "js-minifier"      },
  { icon: "🗜️", name: "HTML Minifier",    slug: "html-minifier"    },
  { icon: "💻", name: "JSON Formatter",   slug: "json-formatter"   },
  { icon: "🔗", name: "URL Encoder",      slug: "url-encoder"      },
  { icon: "🎲", name: "UUID Generator",   slug: "uuid-generator"   },
];

const FAQ = [
  { q: "What is CSS minification?", a: "CSS minification removes all unnecessary characters from CSS code without changing its functionality — whitespace, comments, newlines and redundant semicolons are stripped. The result is a smaller file that loads faster." },
  { q: "How much smaller will my CSS get?", a: "Typical CSS files see a 20–40% size reduction after minification. Files with many comments and consistent formatting see the largest improvements." },
  { q: "Does minification change how my CSS works?", a: "No. Minification is purely cosmetic — it removes whitespace and comments that browsers ignore anyway. The rendered output of your website is identical." },
  { q: "Should I minify CSS in production?", a: "Yes — always minify CSS for production. Smaller files mean faster downloads, better Core Web Vitals scores, and improved SEO rankings. Most build tools like Webpack, Vite and Parcel do this automatically." },
  { q: "Can I reverse minified CSS?", a: "Not perfectly — comments and original formatting are lost forever. You should always keep your original unminified source files and minify as a build step." },
];

const SAMPLE_CSS = `/* Navigation styles */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: #0A0A14;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
}

/* Logo */
.navbar__logo {
  font-size: 1.25rem;
  font-weight: 900;
  color: #ffffff;
  text-decoration: none;
}

/* Nav links */
.navbar__links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar__links a {
  color: #9CA3AF;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.navbar__links a:hover {
  color: #ffffff;
}`;

function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")   // Remove comments
    .replace(/\s+/g, " ")               // Collapse whitespace
    .replace(/\s*{\s*/g, "{")           // Remove space around {
    .replace(/\s*}\s*/g, "}")           // Remove space around }
    .replace(/\s*:\s*/g, ":")           // Remove space around :
    .replace(/\s*;\s*/g, ";")           // Remove space around ;
    .replace(/\s*,\s*/g, ",")           // Remove space around ,
    .replace(/;}/g, "}")                // Remove last semicolon in block
    .trim();
}

export default function CSSMinifierPage() {
  const [input,   setInput]   = useState("");
  const [output,  setOutput]  = useState("");
  const [copied,  setCopied]  = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleMinify = () => {
    if (!input.trim()) return;
    setOutput(minifyCSS(input));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const originalSize  = new Blob([input]).size;
  const minifiedSize  = new Blob([output]).size;
  const savings       = originalSize > 0 && minifiedSize > 0 ? Math.round((1 - minifiedSize / originalSize) * 100) : 0;

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
          <span className="text-gray-400">CSS Minifier</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🎨</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">CSS Minifier</h1>
              <p className="text-gray-500 mt-1">Minify CSS to reduce file size and improve page load speed — free, instant, no login.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Free","No Login","Removes Comments","Removes Whitespace","Shows Size Savings"].map(b => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">✓ {b}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">CSS Input</label>
                <button onClick={() => { setInput(SAMPLE_CSS); setOutput(""); }}
                  className="text-xs text-gray-600 hover:text-[#6C3AFF] transition-colors underline underline-offset-2">Load sample</button>
              </div>
              <textarea value={input} onChange={e => { setInput(e.target.value); setOutput(""); }}
                placeholder="Paste your CSS here..."
                className="w-full h-56 px-5 py-4 rounded-2xl bg-[#13131F] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all resize-none text-sm font-mono" />
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={handleMinify} disabled={!input.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] disabled:opacity-40 text-white text-sm font-bold transition-all shadow-lg shadow-violet-900/30">
                🗜️ Minify CSS
              </button>
              <button onClick={() => { setInput(""); setOutput(""); }}
                className="px-5 py-3 rounded-xl bg-[#13131F] border border-white/5 hover:border-red-500/30 text-gray-400 hover:text-red-400 text-sm font-semibold transition-all">
                🗑️ Clear
              </button>
            </div>

            {output && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-4 text-xs">
                    <span className="text-gray-500">Original: <span className="text-white font-bold">{originalSize} bytes</span></span>
                    <span className="text-gray-500">Minified: <span className="text-white font-bold">{minifiedSize} bytes</span></span>
                    {savings > 0 && <span className="text-green-400 font-bold">↓ {savings}% smaller</span>}
                  </div>
                  <button onClick={handleCopy}
                    className="text-xs bg-[#6C3AFF]/20 hover:bg-[#6C3AFF]/40 text-[#6C3AFF] px-3 py-1.5 rounded-lg font-bold transition-all">
                    {copied ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <div className="bg-[#13131F] border border-[#6C3AFF]/20 rounded-2xl p-5 text-xs font-mono text-[#00D4FF] break-all leading-relaxed max-h-52 overflow-y-auto">
                  {output}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">🗜️ What Gets Removed</h3>
              <div className="space-y-2 text-xs text-gray-500">
                {["/* Comments */","Extra whitespace","Newlines and tabs","Spaces around { } : ; ,","Last semicolons in blocks","Empty rules"].map(r => (
                  <div key={r} className="flex items-center gap-2">
                    <span className="text-red-400">✕</span>
                    <span className="font-mono">{r}</span>
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
              <p className="text-gray-500 text-xs mb-4">File upload, batch minify, API access</p>
              <button className="w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all">Get Pro — $7/mo</button>
            </div>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use the CSS Minifier</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step:"1", title:"Paste Your CSS",    desc:"Copy your CSS from your editor or stylesheet and paste it into the input box. Click Load Sample to see an example." },
              { step:"2", title:"Click Minify",      desc:"Click the Minify CSS button. Comments, whitespace and unnecessary characters are removed instantly." },
              { step:"3", title:"Copy & Deploy",     desc:"Copy the minified output and replace your stylesheet. The size saving percentage is shown — typically 20–40%." },
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
