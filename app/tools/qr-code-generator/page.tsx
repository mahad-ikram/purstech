"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import QRCode from "qrcode";

// ─── Types & Constants ────────────────────────────────────────────────────────

type QRTab       = "url" | "text" | "email" | "phone" | "wifi" | "vcard";
type ErrorLevel  = "L" | "M" | "Q" | "H";

const RELATED_TOOLS = [
  { icon: "🔗", name: "URL Encoder",        slug: "url-encoder"        },
  { icon: "🖼️", name: "Image Compressor",   slug: "image-compressor"   },
  { icon: "💻", name: "JSON Formatter",     slug: "json-formatter"     },
  { icon: "🔐", name: "Password Generator", slug: "password-generator" },
  { icon: "📊", name: "Meta Tag Generator", slug: "meta-tag-generator" },
];

const FAQ = [
  {
    q: "What is a QR code?",
    a: "A QR (Quick Response) code is a 2D barcode that stores information — like a URL, text, or contact details — readable instantly by a phone camera. Invented in 1994, they are now used everywhere from product packaging to payment systems.",
  },
  {
    q: "How do I scan a QR code?",
    a: "On iPhone: open the Camera app and point it at the QR code — a notification appears automatically. On Android: same with the Camera app, or use Google Lens. No special app needed on modern phones.",
  },
  {
    q: "What is error correction level?",
    a: "Error correction allows QR codes to be read even if partially damaged or covered. Level L = 7% damage tolerance, M = 15%, Q = 25%, H = 30%. Use H if you plan to print on physical materials.",
  },
  {
    q: "Can I use the QR code commercially?",
    a: "Yes, completely. QR codes you generate here are yours to use however you like — websites, business cards, packaging, marketing materials, anywhere.",
  },
  {
    q: "What is the best size to print a QR code?",
    a: "For print, a minimum of 2 cm × 2 cm is recommended. For large format (banners, posters), use at least 10 cm × 10 cm. Always test-scan before printing in bulk.",
  },
];

const QR_TABS: { id: QRTab; icon: string; label: string }[] = [
  { id: "url",   icon: "🔗", label: "URL"     },
  { id: "text",  icon: "📝", label: "Text"    },
  { id: "email", icon: "📧", label: "Email"   },
  { id: "phone", icon: "📱", label: "Phone"   },
  { id: "wifi",  icon: "📶", label: "WiFi"    },
  { id: "vcard", icon: "👤", label: "Contact" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildQRValue(tab: QRTab, fields: Record<string, string>): string {
  switch (tab) {
    case "url":   return fields.url   || "";
    case "text":  return fields.text  || "";
    case "email":
      return `mailto:${fields.email || ""}?subject=${encodeURIComponent(fields.subject || "")}&body=${encodeURIComponent(fields.body || "")}`;
    case "phone": return `tel:${fields.phone || ""}`;
    case "wifi":
      return `WIFI:T:${fields.security || "WPA"};S:${fields.ssid || ""};P:${fields.password || ""};;`;
    case "vcard":
      return [
        "BEGIN:VCARD", "VERSION:3.0",
        `FN:${fields.name    || ""}`,
        `ORG:${fields.org    || ""}`,
        `TEL:${fields.phone  || ""}`,
        `EMAIL:${fields.email || ""}`,
        `URL:${fields.website || ""}`,
        "END:VCARD",
      ].join("\n");
    default: return "";
  }
}

function Field({
  label, placeholder, value, onChange, type = "text",
}: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-gray-500 font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm"
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function QRCodeGeneratorPage() {
  const [tab,         setTab]         = useState<QRTab>("url");
  const [fields,      setFields]      = useState<Record<string, string>>({ url: "https://purstech.com" });
  const [fgColor,     setFgColor]     = useState("#6C3AFF");
  const [bgColor,     setBgColor]     = useState("#FFFFFF");
  const [size,        setSize]        = useState(256);
  const [errorLevel,  setErrorLevel]  = useState<ErrorLevel>("M");
  const [downloaded,  setDownloaded]  = useState(false);
  const [openFaq,     setOpenFaq]     = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const setField = (key: string, value: string) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  const qrValue  = buildQRValue(tab, fields);
  const hasValue = qrValue.trim().length > 0;

  // ── Render QR onto canvas whenever inputs change ──────────────────────────
  const renderQR = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!hasValue) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    try {
      await QRCode.toCanvas(canvas, qrValue, {
        width: size,
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: { dark: fgColor, light: bgColor },
      });
    } catch {
      // invalid input — ignore
    }
  }, [qrValue, size, errorLevel, fgColor, bgColor, hasValue]);

  useEffect(() => { renderQR(); }, [renderQR]);

  // ── Download PNG ──────────────────────────────────────────────────────────
  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a   = document.createElement("a");
    a.href     = canvas.toDataURL("image/png");
    a.download = "purstech-qr-code.png";
    a.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  // ── Download SVG ──────────────────────────────────────────────────────────
  const handleDownloadSVG = async () => {
    if (!hasValue) return;
    try {
      const svgString = await QRCode.toString(qrValue, {
        type: "svg",
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: { dark: fgColor, light: bgColor },
      });
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = "purstech-qr-code.svg";
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* ignore */ }
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">

      {/* ── Navbar ── */}
      <nav className="border-b border-white/5 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">
            ← All Tools
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">

        {/* ── Breadcrumb ── */}
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link>
          <span>›</span>
          <Link href="/categories/dev" className="hover:text-gray-400 transition-colors">Dev Tools</Link>
          <span>›</span>
          <span className="text-gray-400">QR Code Generator</span>
        </nav>

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🔗</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">QR Code Generator</h1>
              <p className="text-gray-500 mt-1">
                Generate QR codes for URLs, text, WiFi, email, phone & contacts — free, instant, downloadable.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Free", "No Login", "PNG & SVG Download", "Custom Colors", "6 QR Types"].map((b) => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">
                ✓ {b}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Tab selector */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-2 flex flex-wrap gap-1">
              {QR_TABS.map((t) => (
                <button key={t.id} onClick={() => { setTab(t.id); setFields({}); }}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 justify-center ${
                    tab === t.id ? "bg-[#6C3AFF] text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>
                  <span>{t.icon}</span>
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Dynamic fields */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
              {tab === "url"   && <Field label="Website URL" placeholder="https://purstech.com" value={fields.url || ""} onChange={(v) => setField("url", v)} />}
              {tab === "text"  && (
                <>
                  <label className="text-xs text-gray-500 font-medium">Text Content</label>
                  <textarea value={fields.text || ""} onChange={(e) => setField("text", e.target.value)}
                    placeholder="Enter any text to encode..."
                    className="px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm resize-none h-28" />
                </>
              )}
              {tab === "email" && (
                <>
                  <Field label="Email Address"     placeholder="hello@example.com"    value={fields.email   || ""} onChange={(v) => setField("email",   v)} type="email" />
                  <Field label="Subject (optional)" placeholder="Hello from PursTech" value={fields.subject || ""} onChange={(v) => setField("subject", v)} />
                  <Field label="Message (optional)" placeholder="Your message"         value={fields.body    || ""} onChange={(v) => setField("body",    v)} />
                </>
              )}
              {tab === "phone" && <Field label="Phone Number" placeholder="+1 234 567 8900" value={fields.phone || ""} onChange={(v) => setField("phone", v)} type="tel" />}
              {tab === "wifi"  && (
                <>
                  <Field label="Network Name (SSID)" placeholder="MyHomeWiFi"   value={fields.ssid     || ""} onChange={(v) => setField("ssid",     v)} />
                  <Field label="Password"            placeholder="WiFi password" value={fields.password || ""} onChange={(v) => setField("password", v)} />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-gray-500 font-medium">Security Type</label>
                    <div className="flex gap-2">
                      {["WPA","WEP","nopass"].map((s) => (
                        <button key={s} onClick={() => setField("security", s)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            (fields.security || "WPA") === s ? "bg-[#6C3AFF] text-white" : "bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white"
                          }`}>{s}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {tab === "vcard" && (
                <>
                  <Field label="Full Name"    placeholder="John Smith"           value={fields.name    || ""} onChange={(v) => setField("name",    v)} />
                  <Field label="Organisation" placeholder="Acme Corp"            value={fields.org     || ""} onChange={(v) => setField("org",     v)} />
                  <Field label="Phone"        placeholder="+1 234 567 8900"      value={fields.phone   || ""} onChange={(v) => setField("phone",   v)} />
                  <Field label="Email"        placeholder="john@example.com"     value={fields.email   || ""} onChange={(v) => setField("email",   v)} type="email" />
                  <Field label="Website"      placeholder="https://example.com"  value={fields.website || ""} onChange={(v) => setField("website", v)} />
                </>
              )}
            </div>

            {/* Customisation */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4">🎨 Customise</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-500 font-medium">QR Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent" />
                    <span className="text-xs text-gray-500 font-mono">{fgColor}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-500 font-medium">Background</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent" />
                    <span className="text-xs text-gray-500 font-mono">{bgColor}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-500 font-medium">Size (px)</label>
                  <div className="flex gap-1">
                    {[128,256,512].map((s) => (
                      <button key={s} onClick={() => setSize(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          size === s ? "bg-[#6C3AFF] text-white" : "bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white"
                        }`}>{s}</button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-500 font-medium">Error Correction</label>
                  <div className="flex gap-1">
                    {(["L","M","Q","H"] as ErrorLevel[]).map((lvl) => (
                      <button key={lvl} onClick={() => setErrorLevel(lvl)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          errorLevel === lvl ? "bg-[#6C3AFF] text-white" : "bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white"
                        }`}>{lvl}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Preview ── */}
          <div className="flex flex-col gap-4">

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 flex flex-col items-center gap-5">
              <h3 className="text-sm font-bold text-white self-start">👁️ Live Preview</h3>

              <div className="rounded-2xl overflow-hidden shadow-xl shadow-violet-900/20">
                {hasValue ? (
                  <canvas ref={canvasRef} className="block" />
                ) : (
                  <>
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="w-[200px] h-[200px] flex items-center justify-center bg-[#0A0A14] rounded-2xl border-2 border-dashed border-white/10">
                      <p className="text-gray-600 text-xs text-center px-4">Enter content to generate your QR code</p>
                    </div>
                  </>
                )}
              </div>

              <div className="w-full flex flex-col gap-2">
                <button onClick={handleDownloadPNG} disabled={!hasValue}
                  className="w-full py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold transition-all">
                  {downloaded ? "✅ Downloaded!" : "⬇️ Download PNG"}
                </button>
                <button onClick={handleDownloadSVG} disabled={!hasValue}
                  className="w-full py-3 rounded-xl bg-[#13131F] hover:bg-[#1a1a2e] border border-white/5 hover:border-[#6C3AFF]/30 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all">
                  ⬇️ Download SVG
                </button>
              </div>
              {hasValue && <p className="text-xs text-gray-600 text-center">Scan with your phone camera to test it</p>}
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">🔧 Related Tools</h3>
              <div className="space-y-2">
                {RELATED_TOOLS.map((tool) => (
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
              <p className="text-gray-500 text-xs mb-4">Logo in QR, bulk export, custom frames</p>
              <button className="w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all">Get Pro — $7/mo</button>
            </div>
          </div>
        </div>

        {/* ── How to Use ── */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use the QR Code Generator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step:"1", title:"Choose QR Type",     desc:"Select what your QR code should do — open a URL, share WiFi credentials, save a contact, dial a phone number, or display text." },
              { step:"2", title:"Enter Your Content", desc:"Fill in the fields for your chosen type. The QR code preview updates instantly on the right as you type." },
              { step:"3", title:"Download & Use",     desc:"Download PNG for digital use or SVG for print. Always scan-test before printing in bulk." },
            ].map((s) => (
              <div key={s.step} className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-[#6C3AFF]/20 border border-[#6C3AFF]/30 flex items-center justify-center text-[#6C3AFF] font-black text-lg mb-4">{s.step}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
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
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
                  </div>
                )}
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