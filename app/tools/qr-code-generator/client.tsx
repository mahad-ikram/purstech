"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ Rule 3

// ─── Types & Constants ────────────────────────────────────────────────────────

type QRTab      = "url" | "text" | "email" | "phone" | "wifi" | "vcard";
type ErrorLevel = "L" | "M" | "Q" | "H";

// ✅ Rule 10: module-scope arrays — .map() calls below match
const RELATED_TOOLS = [
  { icon:"🔗", name:"URL Encoder",        slug:"url-encoder"        },
  { icon:"🖼️", name:"Image Compressor",   slug:"image-compressor"   },
  { icon:"💻", name:"JSON Formatter",     slug:"json-formatter"     },
  { icon:"🔐", name:"Password Generator", slug:"password-generator" },
  { icon:"📊", name:"Meta Tag Generator", slug:"meta-tag-generator" },
];

// ✅ Rule 8: FAQ uses <details>/<summary> — no useState toggle
// ✅ Rule 10: FAQ.map() matches const FAQ
const FAQ = [
  { q:"How do I make a WiFi QR code?",
    a:"Choose the WiFi type, enter your network name (SSID), password and security type, and download the code. Guests scan it with their phone camera and connect instantly — no typing the password." },
  { q:"Can I make a QR code for a Google Form, Facebook page or any link?",
    a:"Yes — any link works. Pick the URL type and paste the address of your Google Form, Facebook page, Instagram profile, menu or website. The QR code opens that link when scanned, and it never expires." },
  { q:"What is a QR code?",
    a:"A QR (Quick Response) code is a 2D barcode that stores information — like a URL, text, or contact details — readable instantly by a phone camera. Invented in 1994, they are now used everywhere from product packaging to payment systems." },
  { q:"How do I scan a QR code?",
    a:"On iPhone: open the Camera app and point it at the QR code — a notification appears automatically. On Android: same with the Camera app, or use Google Lens. No special app needed on modern phones." },
  { q:"What is error correction level?",
    a:"Error correction allows QR codes to be read even if partially damaged or covered. Level L = 7% damage tolerance, M = 15%, Q = 25%, H = 30%. Use H if you plan to print on physical materials." },
  { q:"Can I use the QR code commercially?",
    a:"Yes, completely. QR codes you generate here are yours to use however you like — websites, business cards, packaging, marketing materials, anywhere." },
  { q:"What is the best size to print a QR code?",
    a:"For print, a minimum of 2 cm × 2 cm is recommended. For large format (banners, posters), use at least 10 cm × 10 cm. Download as SVG for infinite-resolution print. Always scan-test before printing in bulk." },
];

// ✅ Rule 10: typed array
const QR_TABS: { id:QRTab; icon:string; label:string }[] = [
  { id:"url",   icon:"🔗", label:"URL"     },
  { id:"text",  icon:"📝", label:"Text"    },
  { id:"email", icon:"📧", label:"Email"   },
  { id:"phone", icon:"📱", label:"Phone"   },
  { id:"wifi",  icon:"📶", label:"WiFi"    },
  { id:"vcard", icon:"👤", label:"Contact" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildQRValue(tab: QRTab, fields: Record<string, string>): string {
  switch (tab) {
    case "url":   return fields.url  || "";
    case "text":  return fields.text || "";
    case "email": return `mailto:${fields.email || ""}?subject=${encodeURIComponent(fields.subject || "")}&body=${encodeURIComponent(fields.body || "")}`;
    case "phone": return `tel:${fields.phone || ""}`;
    case "wifi":  return `WIFI:T:${fields.security || "WPA"};S:${fields.ssid || ""};P:${fields.password || ""};;`;
    case "vcard": return ["BEGIN:VCARD","VERSION:3.0",`FN:${fields.name||""}`,`ORG:${fields.org||""}`,`TEL:${fields.phone||""}`,`EMAIL:${fields.email||""}`,`URL:${fields.website||""}`, "END:VCARD"].join("\n");
    default: return "";
  }
}

// ✅ QA FIX: Added w-full min-w-0 to the component wrapper and input
function Field({ label, placeholder, value, onChange, type = "text" }: {
  label:string; placeholder:string; value:string; onChange:(v:string)=>void; type?:string;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full min-w-0">
      <label className="text-xs text-gray-500 font-medium">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full min-w-0 px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function QRCodeGeneratorClient({ children }: { children?: React.ReactNode }) {
  useTrackTool("qr-code-generator", "dev"); // ✅ Rule 3

  const [tab,        setTab]        = useState<QRTab>("url");
  const [fields,     setFields]     = useState<Record<string, string>>({ url:"https://purstech.com" });
  const [fgColor,    setFgColor]    = useState("#6C3AFF");
  const [bgColor,    setBgColor]    = useState("#FFFFFF");
  const [size,       setSize]       = useState(256);
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>("M");
  const [downloaded, setDownloaded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setField  = (key:string, value:string) => setFields(p => ({ ...p, [key]:value }));
  const qrValue   = buildQRValue(tab, fields);
  const hasValue  = qrValue.trim().length > 0;

  const renderQR = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!hasValue) { canvas.getContext("2d")?.clearRect(0,0,canvas.width,canvas.height); return; }
    try {
      await QRCode.toCanvas(canvas, qrValue, {
        width: size, margin: 2,
        errorCorrectionLevel: errorLevel,
        color: { dark: fgColor, light: bgColor },
      });
    } catch { /* invalid input — ignore */ }
  }, [qrValue, size, errorLevel, fgColor, bgColor, hasValue]);

  useEffect(() => { renderQR(); }, [renderQR]);

  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    Object.assign(document.createElement("a"), {
      href: canvas.toDataURL("image/png"),
      download: "purstech-qr-code.png",
    }).click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleDownloadSVG = async () => {
    if (!hasValue) return;
    try {
      const svgString = await QRCode.toString(qrValue, {
        type: "svg", margin: 2, errorCorrectionLevel: errorLevel,
        color: { dark: fgColor, light: bgColor },
      });
      // SVG is a string — no `as any` needed
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url  = URL.createObjectURL(blob);
      Object.assign(document.createElement("a"), { href:url, download:"purstech-qr-code.svg" }).click();
      URL.revokeObjectURL(url);
    } catch { /* ignore */ }
  };

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
          <Link href="/categories/dev" className="hover:text-gray-400 transition-colors">Dev Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">QR Code Generator</span>
        </nav>

        {/* Server-rendered hero */}
        {children}

        {/* ✅ QA FIX: min-w-0 w-full added to grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0 w-full">

          {/* ── LEFT ── */}
          <div className="lg:col-span-2 min-w-0 flex flex-col gap-5">

            {/* Tab selector */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-2 flex flex-wrap gap-1">
              {QR_TABS.map(t => (
                <button key={t.id} onClick={() => { setTab(t.id); setFields({}); }}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 justify-center ${
                    tab===t.id ? "bg-[#6C3AFF] text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>
                  <span>{t.icon}</span>
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Dynamic fields */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 min-w-0 w-full">
              {tab === "url"   && <Field label="Website URL" placeholder="https://purstech.com" value={fields.url||""} onChange={v => setField("url",v)} />}
              {tab === "text"  && (
                <div className="w-full min-w-0">
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block">Text Content</label>
                  {/* ✅ QA FIX: Added w-full min-w-0 to textarea */}
                  <textarea value={fields.text||""} onChange={e => setField("text",e.target.value)}
                    placeholder="Enter any text to encode..."
                    className="w-full min-w-0 px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm resize-none h-28" />
                </div>
              )}
              {tab === "email" && (
                <>
                  <Field label="Email Address"     placeholder="hello@example.com"    value={fields.email  ||""} onChange={v=>setField("email",  v)} type="email" />
                  <Field label="Subject (optional)" placeholder="Hello from PursTech" value={fields.subject||""} onChange={v=>setField("subject",v)} />
                  <Field label="Message (optional)" placeholder="Your message"         value={fields.body   ||""} onChange={v=>setField("body",   v)} />
                </>
              )}
              {tab === "phone" && <Field label="Phone Number" placeholder="+1 234 567 8900" value={fields.phone||""} onChange={v=>setField("phone",v)} type="tel" />}
              {tab === "wifi"  && (
                <>
                  <Field label="Network Name (SSID)" placeholder="MyHomeWiFi"   value={fields.ssid    ||""} onChange={v=>setField("ssid",    v)} />
                  <Field label="Password"            placeholder="WiFi password" value={fields.password||""} onChange={v=>setField("password",v)} />
                  <div className="flex flex-col gap-1.5 min-w-0 w-full">
                    <label className="text-xs text-gray-500 font-medium">Security Type</label>
                    <div className="flex gap-2">
                      {["WPA","WEP","nopass"].map(s => (
                        <button key={s} onClick={() => setField("security",s)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            (fields.security||"WPA")===s ? "bg-[#6C3AFF] text-white" : "bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white"
                          }`}>{s}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {tab === "vcard" && (
                <>
                  <Field label="Full Name"    placeholder="John Smith"          value={fields.name   ||""} onChange={v=>setField("name",   v)} />
                  <Field label="Organisation" placeholder="Acme Corp"           value={fields.org    ||""} onChange={v=>setField("org",    v)} />
                  <Field label="Phone"        placeholder="+1 234 567 8900"     value={fields.phone  ||""} onChange={v=>setField("phone",  v)} />
                  <Field label="Email"        placeholder="john@example.com"    value={fields.email  ||""} onChange={v=>setField("email",  v)} type="email" />
                  <Field label="Website"      placeholder="https://example.com" value={fields.website||""} onChange={v=>setField("website",v)} />
                </>
              )}
            </div>

            {/* Customisation */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 min-w-0 w-full">
              <h3 className="text-sm font-bold text-white mb-4">🎨 Customise</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-500 font-medium">QR Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent" />
                    <span className="text-xs text-gray-500 font-mono">{fgColor}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-500 font-medium">Background</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent" />
                    <span className="text-xs text-gray-500 font-mono">{bgColor}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-500 font-medium">Size (px)</label>
                  <div className="flex gap-1 flex-wrap">
                    {[128,256,512].map(s => (
                      <button key={s} onClick={() => setSize(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${size===s ? "bg-[#6C3AFF] text-white" : "bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-500 font-medium">Error Correction</label>
                  <div className="flex gap-1 flex-wrap">
                    {(["L","M","Q","H"] as ErrorLevel[]).map(lvl => (
                      <button key={lvl} onClick={() => setErrorLevel(lvl)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${errorLevel===lvl ? "bg-[#6C3AFF] text-white" : "bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white"}`}>
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Preview — ✅ Rule 9: min-w-0 ── */}
          <div className="min-w-0 flex flex-col gap-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 flex flex-col items-center gap-5 min-w-0 w-full">
              <h3 className="text-sm font-bold text-white self-start">👁️ Live Preview</h3>

              <div className="rounded-2xl overflow-hidden shadow-xl shadow-violet-900/20 max-w-full">
                {hasValue ? (
                  <canvas ref={canvasRef} className="block max-w-full h-auto" />
                ) : (
                  <>
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="w-[200px] h-[200px] flex items-center justify-center bg-[#0A0A14] rounded-2xl border-2 border-dashed border-white/10">
                      <p className="text-gray-600 text-xs text-center px-4">Enter content to generate your QR code</p>
                    </div>
                  </>
                )}
              </div>

              {/* ✅ UI Enhancement: QR data preview — break-all to prevent mobile blowout */}
              {hasValue && (
                <div className="w-full min-w-0">
                  <div className="text-xs text-gray-500 mb-1">Encoded data:</div>
                  <div className="bg-[#0A0A14] rounded-lg px-3 py-2 text-xs text-gray-400 font-mono break-all line-clamp-3 border border-white/5">
                    {qrValue}
                  </div>
                </div>
              )}

              <div className="w-full flex flex-col gap-2 min-w-0">
                <button onClick={handleDownloadPNG} disabled={!hasValue}
                  className="w-full min-w-0 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold transition-all">
                  {downloaded ? "✅ Downloaded!" : "⬇️ Download PNG"}
                </button>
                <button onClick={handleDownloadSVG} disabled={!hasValue}
                  className="w-full min-w-0 py-3 rounded-xl bg-[#13131F] hover:bg-[#1a1a2e] border border-white/5 hover:border-[#6C3AFF]/30 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all">
                  ⬇️ Download SVG
                </button>
              </div>
              {hasValue && <p className="text-xs text-gray-600 text-center">Scan with your phone camera to test it</p>}
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
              <h3 className="text-sm font-bold text-white mb-4">🔧 Related Tools</h3>
              <div className="space-y-2">
                {RELATED_TOOLS.map(tool => (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#0A0A14] transition-colors group">
                    <span className="text-xl flex-shrink-0">{tool.icon}</span>
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors min-w-0 truncate">{tool.name}</span>
                    <span className="ml-auto text-gray-700 group-hover:text-[#6C3AFF] transition-colors flex-shrink-0">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* ✅ Pro CTA: <button> → <Link href="/pro"> */}
            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 text-center min-w-0 w-full">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-white text-sm mb-1">PursTech Pro</h3>
              <p className="text-gray-500 text-xs mb-4">Logo in QR, bulk export, custom frames</p>
              <Link href="/pro" className="block w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all text-center min-w-0">
                Get Pro — $7/mo
              </Link>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use the QR Code Generator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step:"1", title:"Choose QR Type",     desc:"Select what your QR code should do — open a URL, share WiFi credentials, save a contact, dial a phone number, or display text." },
              { step:"2", title:"Enter Your Content", desc:"Fill in the fields for your chosen type. The QR code preview updates instantly. Check the encoded data preview to verify the content." },
              { step:"3", title:"Download & Use",     desc:"Download PNG for digital use or SVG for print at any resolution. Use H error correction for physical print. Always scan-test before printing in bulk." },
            ].map(s => (
              <div key={s.step} className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-[#6C3AFF]/20 border border-[#6C3AFF]/30 flex items-center justify-center text-[#6C3AFF] font-black text-lg mb-4">{s.step}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ✅ Rule 8: FAQ uses <details>/<summary> — openFaq useState removed */}
        {/* ✅ Rule 10: FAQ.map() matches const FAQ at module scope */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none select-none">
                  <span>{item.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>

      {/* ✅ Rule 5: Privacy/Terms/Contact + © 2026 */}
      <footer className="border-t border-white/5 mt-16 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center flex-wrap gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
