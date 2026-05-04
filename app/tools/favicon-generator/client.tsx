"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const FAVICON_SIZES = [
  { size: 16,  label: "16×16",  use: "Browser tab (standard)"         },
  { size: 32,  label: "32×32",  use: "Browser tab (retina)"           },
  { size: 48,  label: "48×48",  use: "Windows site icon"              },
  { size: 57,  label: "57×57",  use: "iOS home screen (old)"          },
  { size: 60,  label: "60×60",  use: "iOS home screen (iPhone)"       },
  { size: 72,  label: "72×72",  use: "iOS home screen (iPad)"         },
  { size: 76,  label: "76×76",  use: "iOS home screen (iPad retina)"  },
  { size: 96,  label: "96×96",  use: "Google TV"                      },
  { size: 114, label: "114×114",use: "iOS retina (old)"               },
  { size: 120, label: "120×120",use: "iPhone retina"                  },
  { size: 144, label: "144×144",use: "iPad retina / Windows 8 tile"   },
  { size: 152, label: "152×152",use: "iPad retina"                    },
  { size: 180, label: "180×180",use: "Apple Touch Icon (required)"    },
  { size: 192, label: "192×192",use: "Android Chrome / PWA"           },
  { size: 512, label: "512×512",use: "PWA splash screen"              },
];

interface FaviconResult {
  size:    number;
  dataUrl: string;
}

const FAQ = [
  {
    q: "What size should my favicon be?",
    a: "You need multiple favicon sizes to support all browsers and devices. The minimum required are 16×16 (browser tab), 32×32 (retina browser tab), 180×180 (Apple Touch Icon for iPhone and iPad home screen) and 192×192 (Android Chrome). For complete coverage including Windows tiles and PWA support, generate all 15 standard sizes using our generator.",
  },
  {
    q: "What is an Apple Touch Icon?",
    a: "An Apple Touch Icon is the image that appears when a user saves your website to their iPhone or iPad home screen. Without one, iOS uses a screenshot of your webpage as the icon, which looks poor. The recommended size is 180×180 pixels. Add it to your website with the HTML tag: <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png'>.",
  },
  {
    q: "What image makes the best favicon?",
    a: "The best favicons are simple, bold and recognisable at tiny sizes. A single letter, monogram or simple icon works best. Detailed illustrations with fine lines become indistinguishable at 16×16. Avoid using the full horizontal logo — use just the icon or logomark portion. Square images work best since favicons are always displayed as squares (or circles on Android).",
  },
  {
    q: "Do I need a favicon.ico file or can I use PNG?",
    a: "Modern browsers support PNG favicons and most major websites now use PNG or SVG instead of the old ICO format. However, favicon.ico placed in your website root provides the best backwards compatibility with older browsers and certain RSS readers. Our generator creates PNG files for all sizes — for ICO format, you can convert a 32×32 PNG using an online ICO converter.",
  },
  {
    q: "Where do I put my favicon files and HTML code?",
    a: "Place all favicon files in the root of your website (the same folder as your index.html). Then paste the generated HTML snippet into the <head> section of every page on your site. For Next.js projects, place the files in the /public folder and add the HTML to app/layout.tsx. For WordPress, add the HTML to your theme's header.php or use the Customizer's Site Icon feature.",
  },
];

export default function FaviconGeneratorClient() {
  const [original, setOriginal] = useState<string | null>(null);
  const [results,  setResults]  = useState<FaviconResult[]>([]);
  const [bgColor,  setBgColor]  = useState("#FFFFFF");
  const [useBg,    setUseBg]    = useState(false);
  const [padding,  setPadding]  = useState(0);
  const [generating, setGenerating] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function loadImage(file: File) {
    const reader = new FileReader();
    reader.onload = e => setOriginal(e.target?.result as string);
    reader.readAsDataURL(file);
    setResults([]);
  }

  function generateFavicon(size: number): Promise<FaviconResult> {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const canvas  = document.createElement("canvas");
        canvas.width  = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        if (useBg) { ctx.fillStyle = bgColor; ctx.fillRect(0, 0, size, size); }
        const pad = Math.round(size * (padding / 100));
        ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2);
        resolve({ size, dataUrl: canvas.toDataURL("image/png") });
      };
      img.src = original!;
    });
  }

  async function generateAll() {
    if (!original) return;
    setGenerating(true);
    const all = await Promise.all(FAVICON_SIZES.map(s => generateFavicon(s.size)));
    setResults(all);
    setGenerating(false);
  }

  function downloadOne(r: FaviconResult) {
    const a = Object.assign(document.createElement("a"), {
      href: r.dataUrl,
      download: r.size === 180 ? "apple-touch-icon.png" : `favicon-${r.size}x${r.size}.png`,
    });
    a.click();
  }

  function downloadAll() {
    results.forEach((r, i) => {
      setTimeout(() => downloadOne(r), i * 150);
    });
  }

  const htmlSnippet = `<!-- Favicon — Generated by PursTech -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png">
<meta name="theme-color" content="${useBg ? bgColor : "#ffffff"}">`;

  function copyHtml() {
    navigator.clipboard.writeText(htmlSnippet);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link>
          <span>›</span>
          <span className="text-gray-400">Favicon Generator</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">Image Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Favicon Generator Online — Create favicon.ico &amp; All Sizes Instantly
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Upload any image and generate all 15 standard favicon sizes — including Apple Touch Icon (180×180) and Android PWA icon (512×512). Get the complete HTML snippet to paste into your site.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Upload + settings */}
          <div className="space-y-4">
            {/* Upload */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) loadImage(f); }}
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragging ? "border-[#6C3AFF] bg-[#6C3AFF]/5" : "border-white/10 hover:border-[#6C3AFF]/40"
              }`}>
              <input ref={inputRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) loadImage(f); }} />
              {original ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={original} alt="Preview" className="w-24 h-24 object-contain rounded-xl border border-white/10" />
                  <span className="text-xs text-gray-500">Click to change image</span>
                </div>
              ) : (
                <>
                  <div className="text-4xl mb-2">🎨</div>
                  <div className="text-white font-bold mb-1">Upload Image</div>
                  <div className="text-gray-500 text-sm">PNG · SVG · JPEG · Any size</div>
                </>
              )}
            </div>

            {/* Settings */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 space-y-4">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Options</div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Add background color</span>
                <button onClick={() => setUseBg(p => !p)}
                  className={`w-10 h-5 rounded-full transition-all relative ${useBg ? "bg-[#6C3AFF]" : "bg-gray-700"}`}>
                  <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${useBg ? "left-[22px]" : "left-0.5"}`} />
                </button>
              </div>

              {useBg && (
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Background Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                      className="w-10 h-8 rounded border border-white/10 bg-[#0A0A14] cursor-pointer" />
                    <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none font-mono" />
                  </div>
                </div>
              )}

              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Icon Padding</span><span>{padding}%</span>
                </div>
                <input type="range" min={0} max={30} value={padding}
                  onChange={e => setPadding(Number(e.target.value))}
                  className="w-full accent-[#6C3AFF]" />
                <p className="text-xs text-gray-600 mt-1">Adds whitespace around your icon</p>
              </div>

              <button onClick={generateAll} disabled={!original || generating}
                className="w-full py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] disabled:opacity-40 text-white font-bold transition-all shadow-lg shadow-violet-900/30">
                {generating ? "⏳ Generating..." : "✨ Generate All 15 Sizes"}
              </button>
            </div>
          </div>

          {/* Right — Results */}
          <div className="lg:col-span-2">
            {results.length > 0 ? (
              <div className="space-y-4">
                {/* Download all */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">All 15 sizes ready</div>
                    <div className="text-xs text-gray-500">Click Download All to save every size</div>
                  </div>
                  <button onClick={downloadAll}
                    className="px-5 py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-sm font-bold transition-all">
                    ⬇ Download All
                  </button>
                </div>

                {/* Favicon grid */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                    Favicon Preview — {results.length} sizes generated
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {results.map(r => {
                      const meta = FAVICON_SIZES.find(s => s.size === r.size)!;
                      return (
                        <button key={r.size} onClick={() => downloadOne(r)}
                          className="group bg-[#0A0A14] rounded-xl p-3 border border-white/5 hover:border-[#6C3AFF]/40 transition-all text-center">
                          <div className="flex items-center justify-center mb-2" style={{ height: Math.min(r.size, 48) + "px" }}>
                            <img src={r.dataUrl} alt={meta.label}
                              style={{ width: Math.min(r.size, 48), height: Math.min(r.size, 48) }}
                              className="object-contain" />
                          </div>
                          <div className="text-xs font-bold text-white">{meta.label}</div>
                          <div className="text-xs text-gray-600 mt-0.5 line-clamp-1">{meta.use}</div>
                          <div className="text-xs text-[#6C3AFF] mt-1 opacity-0 group-hover:opacity-100 transition-all">⬇ Save</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* HTML Snippet */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">HTML Code — Paste in &lt;head&gt;</div>
                    <button onClick={copyHtml}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        copiedHtml ? "bg-green-600 text-white" : "bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white"
                      }`}>
                      {copiedHtml ? "✓ Copied!" : "Copy HTML"}
                    </button>
                  </div>
                  <pre className="text-xs text-green-400 bg-[#0A0A14] rounded-xl p-4 overflow-auto whitespace-pre font-mono leading-relaxed">
                    {htmlSnippet}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="text-5xl mb-4">🌐</div>
                <div className="text-white font-bold mb-2">Upload an image and click Generate</div>
                <div className="text-gray-500 text-sm max-w-xs">
                  We'll create all 15 standard favicon sizes and the HTML code snippet ready to paste into your website.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Create a Favicon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Upload your logo or icon", desc:"Upload a square PNG or SVG logo. Simple icons and monograms work best — complex images lose detail at small sizes." },
              { step:"2", title:"Set options", desc:"Choose a background color if your icon is transparent. Add padding if you want whitespace around the icon in the browser tab." },
              { step:"3", title:"Generate & preview", desc:"Click Generate All 15 Sizes to create every standard favicon. Preview each size in the grid to verify quality." },
              { step:"4", title:"Download & install", desc:"Download all sizes, upload them to your website root, then copy the HTML snippet into your page's <head> section." },
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

        {/* FAQ */}
        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((faq, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{faq.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 mt-16 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/about"   className="hover:text-gray-400 transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2025 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
