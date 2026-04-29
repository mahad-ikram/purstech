"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ColorValues {
  hex:  string;
  rgb:  { r: number; g: number; b: number };
  hsl:  { h: number; s: number; l: number };
  hsv:  { h: number; s: number; v: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PRESETS = [
  "#6C3AFF","#00D4FF","#FF3A6C","#00E676","#FFD700",
  "#FF9800","#E91E63","#2196F3","#4CAF50","#9C27B0",
  "#F44336","#00BCD4","#FFFFFF","#A0A0C0","#0A0A14",
];

const RELATED_TOOLS = [
  { icon: "🖼️", name: "Image Compressor",  slug: "image-compressor"  },
  { icon: "🔗", name: "QR Code Generator", slug: "qr-code-generator" },
  { icon: "💻", name: "JSON Formatter",    slug: "json-formatter"    },
  { icon: "📊", name: "Meta Tag Generator",slug: "meta-tag-generator"},
  { icon: "📝", name: "Word Counter",      slug: "word-counter"      },
];

const FAQ = [
  {
    q: "What is the difference between HEX, RGB, and HSL?",
    a: "HEX is a 6-digit code used in web/CSS (e.g. #6C3AFF). RGB defines colour using Red, Green, Blue channels from 0–255. HSL defines colour using Hue (0–360°), Saturation (0–100%), and Lightness (0–100%) — more intuitive for designers.",
  },
  {
    q: "What is CMYK?",
    a: "CMYK (Cyan, Magenta, Yellow, Key/Black) is the colour model used in printing. If you're sending colours to a printer, use CMYK values. Digital screens use RGB.",
  },
  {
    q: "What is colour contrast ratio?",
    a: "Contrast ratio measures how readable text is against a background. WCAG accessibility guidelines require at least 4.5:1 for normal text and 3:1 for large text. Our tool shows your colour's contrast against white and black.",
  },
  {
    q: "What are complementary colours?",
    a: "Complementary colours sit opposite each other on the colour wheel. They create maximum contrast when used together — great for CTAs, highlights, and attention-grabbing design.",
  },
  {
    q: "Can I copy the colour values?",
    a: "Yes — click the copy icon next to any colour format (HEX, RGB, HSL, HSV, CMYK) to instantly copy it to your clipboard.",
  },
];

// ─── Colour Conversion Helpers ────────────────────────────────────────────────

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHsv(r: number, g: number, b: number) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const v = max, d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (max !== min) {
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function rgbToCmyk(r: number, g: number, b: number) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - rn - k) / (1 - k)) * 100),
    m: Math.round(((1 - gn - k) / (1 - k)) * 100),
    y: Math.round(((1 - bn - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

function getColorValues(hex: string): ColorValues {
  const rgb  = hexToRgb(hex);
  const hsl  = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv  = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  return { hex, rgb, hsl, hsv, cmyk };
}

function getLuminance(r: number, g: number, b: number) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(l1: number, l2: number) {
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
}

function getComplementary(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return "#" + [255 - r, 255 - g, 255 - b]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
}

function generateShades(hex: string): string[] {
  const { h, s } = rgbToHsl(...Object.values(hexToRgb(hex)) as [number, number, number]);
  return [10, 20, 35, 50, 65, 75, 85, 90].map((l) => {
    // Convert HSL back to hex
    const s2 = s / 100, l2 = l / 100;
    const a  = s2 * Math.min(l2, 1 - l2);
    const f  = (n: number) => {
      const k = (n + h / 30) % 12;
      const c = l2 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * c).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  });
}

// ─── Copy Row ─────────────────────────────────────────────────────────────────

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-white/5 last:border-0">
      <span className="text-xs text-gray-500 font-medium w-12 flex-shrink-0">{label}</span>
      <span className="text-sm text-white font-mono flex-1 truncate">{value}</span>
      <button
        onClick={handleCopy}
        className="text-xs bg-[#0A0A14] hover:bg-[#6C3AFF]/20 text-gray-500 hover:text-[#6C3AFF] px-2.5 py-1 rounded-lg transition-all font-bold flex-shrink-0"
      >
        {copied ? "✅" : "📋"}
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ColorPickerPage() {
  const [color,    setColor]    = useState("#6C3AFF");
  const [hexInput, setHexInput] = useState("#6C3AFF");
  const [openFaq,  setOpenFaq]  = useState<number | null>(null);

  const cv = getColorValues(color);
  const { r, g, b } = cv.rgb;

  // Contrast
  const bgLum    = getLuminance(r, g, b);
  const whiteLum = getLuminance(255, 255, 255);
  const blackLum = getLuminance(0, 0, 0);
  const vsWhite  = getContrastRatio(bgLum, whiteLum);
  const vsBlack  = getContrastRatio(bgLum, blackLum);

  // Complementary & shades
  const complementary = getComplementary(color);
  const shades        = generateShades(color);

  // Text on this colour
  const useWhiteText = bgLum < 0.4;

  const handleHexInput = (val: string) => {
    setHexInput(val);
    const clean = val.startsWith("#") ? val : "#" + val;
    if (/^#[0-9A-Fa-f]{6}$/.test(clean)) {
      setColor(clean);
    }
  };

  const handleColorPicker = (val: string) => {
    setColor(val);
    setHexInput(val);
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
          <Link href="/categories/image" className="hover:text-gray-400 transition-colors">Image Tools</Link>
          <span>›</span>
          <span className="text-gray-400">Color Picker</span>
        </nav>

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🎨</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">Color Picker</h1>
              <p className="text-gray-500 mt-1">
                Pick any colour and instantly get HEX, RGB, HSL, HSV, CMYK codes — free, no login.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Free", "No Login", "5 Color Formats", "Contrast Checker", "Shade Generator"].map((b) => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">
                ✓ {b}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: Picker + Values ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Main picker + preview */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 flex flex-col gap-5">

              {/* Big colour preview */}
              <div
                className="w-full h-40 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl"
                style={{ backgroundColor: color }}
              >
                <span
                  className="text-2xl font-extrabold tracking-wider font-mono"
                  style={{ color: useWhiteText ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.7)" }}
                >
                  {color.toUpperCase()}
                </span>
              </div>

              {/* Colour input row */}
              <div className="flex items-center gap-4">
                {/* Native colour picker */}
                <div className="relative">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorPicker(e.target.value)}
                    className="w-16 h-16 rounded-2xl cursor-pointer border-0 bg-transparent p-0"
                    title="Click to open colour picker"
                  />
                </div>
                {/* HEX manual input */}
                <div className="flex-1">
                  <label className="text-xs text-gray-500 font-medium block mb-1.5">HEX Code</label>
                  <input
                    type="text"
                    value={hexInput}
                    onChange={(e) => handleHexInput(e.target.value)}
                    placeholder="#6C3AFF"
                    maxLength={7}
                    className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm font-mono uppercase"
                  />
                </div>
              </div>

              {/* RGB sliders */}
              <div className="flex flex-col gap-3">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">RGB Sliders</span>
                {[
                  { label: "R", value: r, color: "#FF3A6C", onChange: (v: number) => { const hex = "#" + v.toString(16).padStart(2,"0") + g.toString(16).padStart(2,"0") + b.toString(16).padStart(2,"0"); setColor(hex); setHexInput(hex); }},
                  { label: "G", value: g, color: "#00E676", onChange: (v: number) => { const hex = "#" + r.toString(16).padStart(2,"0") + v.toString(16).padStart(2,"0") + b.toString(16).padStart(2,"0"); setColor(hex); setHexInput(hex); }},
                  { label: "B", value: b, color: "#00D4FF", onChange: (v: number) => { const hex = "#" + r.toString(16).padStart(2,"0") + g.toString(16).padStart(2,"0") + v.toString(16).padStart(2,"0"); setColor(hex); setHexInput(hex); }},
                ].map((slider) => (
                  <div key={slider.label} className="flex items-center gap-3">
                    <span className="text-xs font-bold w-4" style={{ color: slider.color }}>{slider.label}</span>
                    <input
                      type="range" min={0} max={255} value={slider.value}
                      onChange={(e) => slider.onChange(Number(e.target.value))}
                      className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                      style={{ background: `linear-gradient(to right, ${slider.color} ${(slider.value/255)*100}%, #1a1a2e ${(slider.value/255)*100}%)` }}
                    />
                    <span className="text-xs text-gray-400 font-mono w-8 text-right">{slider.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* All colour values */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4">📋 Color Values</h3>
              <CopyRow label="HEX"  value={cv.hex.toUpperCase()} />
              <CopyRow label="RGB"  value={`rgb(${r}, ${g}, ${b})`} />
              <CopyRow label="HSL"  value={`hsl(${cv.hsl.h}, ${cv.hsl.s}%, ${cv.hsl.l}%)`} />
              <CopyRow label="HSV"  value={`hsv(${cv.hsv.h}, ${cv.hsv.s}%, ${cv.hsv.v}%)`} />
              <CopyRow label="CMYK" value={`cmyk(${cv.cmyk.c}%, ${cv.cmyk.m}%, ${cv.cmyk.y}%, ${cv.cmyk.k}%)`} />
              <CopyRow label="CSS"  value={`color: ${cv.hex.toUpperCase()};`} />
            </div>

            {/* Preset colours */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4">🎯 Preset Colors</h3>
              <div className="flex flex-wrap gap-3">
                {PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => { setColor(preset); setHexInput(preset); }}
                    title={preset}
                    className={`w-10 h-10 rounded-xl transition-all hover:scale-110 hover:shadow-lg ${color === preset ? "ring-2 ring-white ring-offset-2 ring-offset-[#13131F]" : ""}`}
                    style={{ backgroundColor: preset, border: preset === "#FFFFFF" ? "1px solid rgba(255,255,255,0.1)" : "none" }}
                  />
                ))}
              </div>
            </div>

            {/* Shades */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4">🌗 Shades & Tints</h3>
              <div className="flex gap-2">
                {shades.map((shade, i) => (
                  <button
                    key={i}
                    onClick={() => { setColor(shade); setHexInput(shade); }}
                    title={shade}
                    className="flex-1 h-12 rounded-xl hover:scale-105 transition-all hover:shadow-lg"
                    style={{ backgroundColor: shade }}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-3">Click any shade to select it</p>
            </div>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="flex flex-col gap-4">

            {/* Complementary */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">🔄 Complementary Color</h3>
              <div className="flex gap-3">
                <div
                  className="flex-1 h-16 rounded-xl cursor-pointer hover:scale-105 transition-all"
                  style={{ backgroundColor: color }}
                  title={color}
                  onClick={() => { setColor(color); setHexInput(color); }}
                />
                <div
                  className="flex-1 h-16 rounded-xl cursor-pointer hover:scale-105 transition-all"
                  style={{ backgroundColor: complementary }}
                  title={complementary}
                  onClick={() => { setColor(complementary); setHexInput(complementary); }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-2 font-mono">
                <span>{color.toUpperCase()}</span>
                <span>{complementary.toUpperCase()}</span>
              </div>
            </div>

            {/* Contrast checker */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">♿ Contrast Checker</h3>
              <div className="space-y-3">
                {[
                  { label: "vs White", ratio: vsWhite, preview: "#FFFFFF" },
                  { label: "vs Black", ratio: vsBlack, preview: "#000000" },
                ].map((item) => {
                  const r = parseFloat(item.ratio);
                  const wcagAA  = r >= 4.5;
                  const wcagAAA = r >= 7;
                  return (
                    <div key={item.label} className="bg-[#0A0A14] rounded-xl p-3">
                      {/* Preview */}
                      <div className="w-full h-8 rounded-lg mb-2 flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: color, color: item.preview }}>
                        Sample Text
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{item.label}</span>
                        <span className="text-sm font-extrabold text-white">{item.ratio}:1</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${wcagAA ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                          AA {wcagAA ? "✓" : "✗"}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${wcagAAA ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                          AAA {wcagAAA ? "✓" : "✗"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Color info */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">ℹ️ Color Info</h3>
              <div className="space-y-2 text-xs">
                {[
                  { label: "Hue",        value: `${cv.hsl.h}°`  },
                  { label: "Saturation", value: `${cv.hsl.s}%`  },
                  { label: "Lightness",  value: `${cv.hsl.l}%`  },
                  { label: "Brightness", value: `${cv.hsv.v}%`  },
                  { label: "Luminance",  value: bgLum.toFixed(3) },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="text-white font-mono font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related */}
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

            {/* Pro */}
            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-white text-sm mb-1">PursTech Pro</h3>
              <p className="text-gray-500 text-xs mb-4">Full palette generator, export to CSS/SASS</p>
              <button className="w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all">
                Get Pro — $7/mo
              </button>
            </div>
          </div>
        </div>

        {/* ── How to Use ── */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use the Color Picker</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: "1", title: "Pick a Color",       desc: "Click the colour square to open your browser's colour picker. Or type a HEX code directly. Or drag the RGB sliders to mix your exact colour." },
              { step: "2", title: "Copy Any Format",    desc: "Click the copy icon next to HEX, RGB, HSL, HSV, or CMYK to instantly copy that value. Use HEX for web, CMYK for print." },
              { step: "3", title: "Explore & Refine",   desc: "Use the shades panel to find lighter or darker versions. Check the contrast ratio to ensure your colour is accessible for all users." },
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
        <Link href="/" className="text-xl font-black">
          Purs<span className="text-[#6C3AFF]">Tech</span>
        </Link>
        <p className="text-gray-700 text-xs mt-2">© 2025 PursTech. Free online tools for everyone.</p>
      </footer>

    </div>
  );
}
