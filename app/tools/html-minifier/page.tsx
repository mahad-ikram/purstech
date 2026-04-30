"use client";

import { useState } from "react";
import Link from "next/link";

const RELATED_TOOLS = [
  { icon: "🎨", name: "CSS Minifier",     slug: "css-minifier"     },
  { icon: "⚡", name: "JS Minifier",      slug: "js-minifier"      },
  { icon: "💻", name: "JSON Formatter",   slug: "json-formatter"   },
  { icon: "📝", name: "HTML to Markdown", slug: "html-to-markdown" },
  { icon: "🔗", name: "URL Encoder",      slug: "url-encoder"      },
];

const FAQ = [
  { q: "What is HTML minification?", a: "HTML minification removes unnecessary whitespace, comments, and optional closing tags from HTML code. It reduces file size without changing what the browser renders, resulting in faster page loads." },
  { q: "Is it safe to remove HTML comments?", a: "Yes — HTML comments (<!-- -->) are ignored by browsers completely. They are only for developer reference. Removing them has zero effect on the rendered page." },
  { q: "How much can HTML be compressed?", a: "Typical HTML files see 10–30% size reduction. Pages with many comments and developer-added whitespace see more improvement. Combined with gzip/Brotli compression on the server, savings can exceed 70%." },
  { q: "Should I minify HTML manually?", a: "For small projects, this tool works great. For larger projects, use a build tool like Webpack, Vite, or a server-side minification library — they can be automated as part of your deployment pipeline." },
  { q: "Does minification affect accessibility or SEO?", a: "No — minification only removes invisible characters. Screen readers, search engines and browsers all read the same content. It can actually slightly improve SEO by improving page speed scores." },
];

const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Meta tags -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PursTech — Free Online Tools</title>
    <meta name="description" content="The world's largest free tool ecosystem." />
  </head>
  <body>
    <!-- Main content -->
    <header class="navbar">
      <a href="/" class="logo">PursTech</a>
      <nav>
        <ul>
          <li><a href="/tools">Tools</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/pro">Pro</a></li>
        </ul>
      </nav>
    </header>

    <main class="container">
      <h1>Stop Searching. Start Doing.</h1>
      <p>
        The world's largest free tool ecosystem.
        Powered by AI. Built for everyone.
      </p>
    </main>

    <!-- Footer -->
    <footer>
      <p>&copy; 2025 PursTech</p>
    </footer>
  </body>
</html>`;

function minifyHTML(html: string, opts: { removeComments: boolean; collapseWhitespace: boolean; removeOptionalTags: boolean }): string {
  let result = html;
  if (opts.removeComments)      result = result.replace(/<!--[\s\S]*?-->/g, "");
  if (opts.collapseWhitespace)  result = result.replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
  if (opts.removeOptionalTags)  result = result.replace(/<\/?(html|head|body|li|dt|dd|p|rt|rp|optgroup|option|colgroup|thead|tbody|tfoot|tr|td|th)\b[^>]*>/gi, m => m.replace(/\s+/g, " ").trim());
  return result.trim();
}

export default function HTMLMinifierPage() {
  const [input,    setInput]    = useState("");
  const [output,   setOutput]   = useState("");
  const [copied,   setCopied]   = useState(false);
  const [openFaq,  setOpenFaq]  = useState<number | null>(null);
  const [opts, setOpts] = useState({
    removeComments:     true,
    collapseWhitespace: true,
    removeOptionalTags: false,
  });

  const handleMinify = () => {
    if (!input.trim()) return;
    setOutput(minifyHTML(input, opts));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const originalSize = new Blob([input]).size;
  const minifiedSize = new Blob([output]).size;
  const savings      = originalSize > 0 && minifiedSize > 0 ? Math.round((1 - minifiedSize / originalSize) * 100) : 0;

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
          <span className="text-gray-400">HTML Minifier</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🗜️</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">HTML Minifier</h1>
              <p className="text-gray-500 mt-1">Minify HTML to reduce page size and improve load speed — free, instant, configurable options.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Free","No Login","Remove Comments","Collapse Whitespace","Shows Size Savings"].map(b => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">✓ {b}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Options */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">⚙️ Minification Options</h3>
              <div className="flex flex-col gap-3">
                {[
                  { key:"removeComments",     label:"Remove HTML Comments",       sub:"Removes <!-- --> blocks"          },
                  { key:"collapseWhitespace", label:"Collapse Whitespace",         sub:"Reduces multiple spaces to one"   },
                  { key:"removeOptionalTags", label:"Remove Optional End Tags",    sub:"e.g. </li>, </p>, </td>"          },
                ].map(opt => (
                  <div key={opt.key} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">{opt.label}</div>
                      <div className="text-xs text-gray-500">{opt.sub}</div>
                    </div>
                    <button onClick={() => setOpts(o => ({ ...o, [opt.key]: !o[opt.key as keyof typeof o] }))}
                      className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${opts[opt.key as keyof typeof opts] ? "bg-[#6C3AFF]" : "bg-gray-700"}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${opts[opt.key as keyof typeof opts] ? "left-6" : "left-1"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">HTML Input</label>
                <button onClick={() => { setInput(SAMPLE_HTML); setOutput(""); }}
                  className="text-xs text-gray-600 hover:text-[#6C3AFF] transition-colors underline underline-offset-2">Load sample</button>
              </div>
              <textarea value={input} onChange={e => { setInput(e.target.value); setOutput(""); }}
                placeholder="Paste your HTML here..."
                className="w-full h-56 px-5 py-4 rounded-2xl bg-[#13131F] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all resize-none text-sm font-mono" />
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={handleMinify} disabled={!input.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] disabled:opacity-40 text-white text-sm font-bold transition-all shadow-lg shadow-violet-900/30">
                🗜️ Minify HTML
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
                {["HTML comments <!-- -->","Leading/trailing whitespace","Spaces between tags","Multiple consecutive spaces","Optional closing tags (if enabled)"].map(r => (
                  <div key={r} className="flex items-center gap-2">
                    <span className="text-red-400">✕</span><span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">💡 When to Minify</h3>
              <div className="space-y-2 text-xs text-gray-500">
                {["Before deploying to production","After finishing development","As part of build pipeline","For static site generators","To improve Core Web Vitals"].map(u => (
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
              <p className="text-gray-500 text-xs mb-4">File upload, batch minify, API access</p>
              <button className="w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all">Get Pro — $7/mo</button>
            </div>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use the HTML Minifier</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step:"1", title:"Set Your Options",  desc:"Choose which minification steps to apply. Remove Comments and Collapse Whitespace are safe for all HTML. Remove Optional Tags is more aggressive." },
              { step:"2", title:"Paste Your HTML",   desc:"Copy your HTML from your editor and paste it in. Load Sample shows a typical before/after comparison." },
              { step:"3", title:"Minify & Copy",     desc:"Click Minify HTML. The size saving is shown immediately. Copy the output and use it in your deployment." },
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
