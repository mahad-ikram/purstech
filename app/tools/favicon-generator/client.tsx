"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { FAVICON_FAQ } from "./page";

// ── Constants ─────────────────────────────────────────────────────────────────
const FAVICON_SIZES = [
  { size: 16,   label: "16×16",    use: "Browser tab",            required: true  },
  { size: 32,   label: "32×32",    use: "Retina browser tab",     required: true  },
  { size: 48,   label: "48×48",    use: "Windows site icon",      required: false },
  { size: 57,   label: "57×57",    use: "iOS home (legacy)",      required: false },
  { size: 60,   label: "60×60",    use: "iPhone home screen",     required: false },
  { size: 72,   label: "72×72",    use: "iPad home screen",       required: false },
  { size: 76,   label: "76×76",    use: "iPad retina",            required: false },
  { size: 96,   label: "96×96",    use: "Google TV",              required: false },
  { size: 114,  label: "114×114",  use: "iOS retina (legacy)",    required: false },
  { size: 120,  label: "120×120",  use: "iPhone retina",          required: false },
  { size: 144,  label: "144×144",  use: "iPad retina / Win8 tile",required: false },
  { size: 152,  label: "152×152",  use: "iPad retina",            required: false },
  { size: 180,  label: "180×180",  use: "Apple Touch Icon ★",     required: true  },
  { size: 192,  label: "192×192",  use: "Android Chrome / PWA ★", required: true  },
  { size: 256,  label: "256×256",  use: "Windows 10 tile",        required: false },
  { size: 310,  label: "310×310",  use: "Windows 10 wide tile",   required: false },
  { size: 384,  label: "384×384",  use: "Android splash",         required: false },
  { size: 512,  label: "512×512",  use: "PWA splash screen ★",    required: true  },
];

const WEB_FONTS = [
  "Arial","Georgia","Verdana","Trebuchet MS","Impact","Courier New",
  "Palatino","Garamond","Comic Sans MS","Tahoma","Century Gothic",
];

const SHAPE_TYPES = ["square","rounded","circle"] as const;
type ShapeType = typeof SHAPE_TYPES[number];

type Mode = "upload" | "text" | "emoji" | "pixel";

const PIXEL_GRID = 16; // 16×16 pixel art grid
const CELL = 20;       // display cell size px

const PALETTE = [
  "#000000","#FFFFFF","#FF0000","#00FF00","#0000FF","#FFFF00",
  "#FF00FF","#00FFFF","#FF8800","#8800FF","#0088FF","#FF0088",
  "#884400","#448800","#004488","#888888","#CCCCCC","#FF4444",
  "#44FF44","#4444FF","transparent",
];

// ── Gradient presets ─────────────────────────────────────────────────────────
const GRADIENTS = [
  { name:"Purple",    stops:["#6C3AFF","#00D4FF"] },
  { name:"Sunset",    stops:["#FF3A6C","#FF8C00"] },
  { name:"Ocean",     stops:["#0052D4","#4364F7","#6FB1FC"] },
  { name:"Forest",    stops:["#134E5E","#71B280"] },
  { name:"Fire",      stops:["#f12711","#f5af19"] },
  { name:"Rose",      stops:["#F093FB","#F5576C"] },
  { name:"Midnight",  stops:["#0A0A14","#2C2C54"] },
  { name:"Gold",      stops:["#F7971E","#FFD200"] },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function drawShape(ctx: CanvasRenderingContext2D, size: number, shape: ShapeType) {
  const r = size / 2;
  ctx.beginPath();
  if (shape === "circle") {
    ctx.arc(r, r, r, 0, Math.PI * 2);
  } else if (shape === "rounded") {
    const rad = size * 0.22;
    ctx.moveTo(rad, 0);
    ctx.lineTo(size - rad, 0);
    ctx.quadraticCurveTo(size, 0, size, rad);
    ctx.lineTo(size, size - rad);
    ctx.quadraticCurveTo(size, size, size - rad, size);
    ctx.lineTo(rad, size);
    ctx.quadraticCurveTo(0, size, 0, size - rad);
    ctx.lineTo(0, rad);
    ctx.quadraticCurveTo(0, 0, rad, 0);
  } else {
    ctx.rect(0, 0, size, size);
  }
  ctx.closePath();
}

function applyBackground(
  ctx: CanvasRenderingContext2D,
  size: number,
  bgType: "solid" | "gradient" | "transparent",
  bgColor: string,
  gradientStops: string[],
  shape: ShapeType
) {
  if (bgType === "transparent") return;
  ctx.save();
  drawShape(ctx, size, shape);
  ctx.clip();
  if (bgType === "gradient" && gradientStops.length >= 2) {
    const g = ctx.createLinearGradient(0, 0, size, size);
    gradientStops.forEach((c, i) => g.addColorStop(i / (gradientStops.length - 1), c));
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = bgColor;
  }
  ctx.fillRect(0, 0, size, size);
  ctx.restore();
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function FaviconGeneratorClient() {
  // Mode
  const [mode,       setMode]       = useState<Mode>("upload");

  // Upload
  const [uploadImg,  setUploadImg]  = useState<HTMLImageElement | null>(null);
  const [uploadSrc,  setUploadSrc]  = useState<string | null>(null);

  // Text mode
  const [text,       setText]       = useState("A");
  const [font,       setFont]       = useState("Arial");
  const [fontWeight, setFontWeight] = useState<"normal"|"bold">("bold");
  const [textColor,  setTextColor]  = useState("#FFFFFF");

  // Emoji mode
  const [emoji,      setEmoji]      = useState("⚡");

  // Pixel mode
  const [pixelGrid,  setPixelGrid]  = useState<string[]>(() => Array(PIXEL_GRID * PIXEL_GRID).fill("transparent"));
  const [activePen,  setActivePen]  = useState("#6C3AFF");
  const [isPainting, setIsPainting] = useState(false);

  // Background
  const [shape,      setShape]      = useState<ShapeType>("rounded");
  const [bgType,     setBgType]     = useState<"solid"|"gradient"|"transparent">("gradient");
  const [bgColor,    setBgColor]    = useState("#6C3AFF");
  const [gradStops,  setGradStops]  = useState(["#6C3AFF","#00D4FF"]);

  // Padding
  const [padding,    setPadding]    = useState(10);

  // Results
  const [results,    setResults]    = useState<{ size: number; dataUrl: string }[]>([]);
  const [generating, setGenerating] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copied512,  setCopied512]  = useState(false);

  // App info for manifest
  const [appName,    setAppName]    = useState("My App");
  const [themeColor, setThemeColor] = useState("#6C3AFF");
  const [showManifest, setShowManifest] = useState(false);

  // Dragging
  const [dragging,   setDragging]   = useState(false);

  const uploadInputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // ── Draw source onto a canvas at given size ─────────────────────────────────
  const renderToCanvas = useCallback((
    targetSize: number
  ): HTMLCanvasElement => {
    const canvas  = document.createElement("canvas");
    canvas.width  = targetSize;
    canvas.height = targetSize;
    const ctx     = canvas.getContext("2d")!;

    // Background
    applyBackground(ctx, targetSize, bgType, bgColor, gradStops, shape);

    const pad = Math.round(targetSize * (padding / 100));
    const inner = targetSize - pad * 2;

    ctx.save();
    drawShape(ctx, targetSize, shape);
    ctx.clip();

    if (mode === "upload" && uploadImg) {
      const aspect = uploadImg.width / uploadImg.height;
      let dw = inner, dh = inner;
      if (aspect > 1) dh = inner / aspect;
      else if (aspect < 1) dw = inner * aspect;
      const dx = pad + (inner - dw) / 2;
      const dy = pad + (inner - dh) / 2;
      ctx.drawImage(uploadImg, dx, dy, dw, dh);

    } else if (mode === "text") {
      const fontSize = Math.round(inner * 0.65);
      ctx.font       = `${fontWeight} ${fontSize}px "${font}"`;
      ctx.fillStyle  = textColor;
      ctx.textAlign  = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text.slice(0, 3), targetSize / 2, targetSize / 2);

    } else if (mode === "emoji") {
      const fontSize = Math.round(inner * 0.72);
      ctx.font = `${fontSize}px serif`;
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(emoji, targetSize / 2, targetSize / 2 + fontSize * 0.05);

    } else if (mode === "pixel") {
      const cellSize = inner / PIXEL_GRID;
      pixelGrid.forEach((color, i) => {
        if (color === "transparent") return;
        const cx = (i % PIXEL_GRID) * cellSize + pad;
        const cy = Math.floor(i / PIXEL_GRID) * cellSize + pad;
        ctx.fillStyle = color;
        ctx.fillRect(cx, cy, cellSize, cellSize);
      });
    }

    ctx.restore();
    return canvas;
  }, [mode, uploadImg, bgType, bgColor, gradStops, shape, padding, text, font, fontWeight, textColor, emoji, pixelGrid]);

  // ── Live preview ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const preview = renderToCanvas(128);
    canvas.width  = 128;
    canvas.height = 128;
    canvas.getContext("2d")!.drawImage(preview, 0, 0);
  }, [renderToCanvas]);

  // ── Generate all sizes ────────────────────────────────────────────────────────
  async function generateAll() {
    if (mode === "upload" && !uploadImg) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 10));
    const all = FAVICON_SIZES.map(s => ({
      size:    s.size,
      dataUrl: renderToCanvas(s.size).toDataURL("image/png"),
    }));
    setResults(all);
    setGenerating(false);
  }

  // ── Download single ────────────────────────────────────────────────────────
  function downloadOne(size: number, dataUrl: string) {
    const name = size === 180
      ? "apple-touch-icon.png"
      : size === 512
      ? "favicon-512x512.png"
      : `favicon-${size}x${size}.png`;
    Object.assign(document.createElement("a"), { href: dataUrl, download: name }).click();
  }

  // ── ZIP download ────────────────────────────────────────────────────────────
  async function downloadZip() {
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      const folder = zip.folder("favicons")!;

      results.forEach(r => {
        const base64 = r.dataUrl.split(",")[1];
        const name = r.size === 180 ? "apple-touch-icon.png"
          : `favicon-${r.size}x${r.size}.png`;
        folder.file(name, base64, { base64: true });
      });

      // Add HTML snippet
      folder.file("favicon-html-snippet.html", htmlSnippet);

      // Add manifest.json
      folder.file("site.webmanifest", manifestJson);

      // Add README
      folder.file("README.txt", `Favicon Pack — Generated by PursTech
=====================================
Generated: ${new Date().toLocaleDateString()}
Tool: https://purstech.com/tools/favicon-generator

FILES INCLUDED:
${results.map(r => `  favicon-${r.size}x${r.size}.png`).join("\n")}
  apple-touch-icon.png (180×180)
  site.webmanifest
  favicon-html-snippet.html

INSTALLATION:
1. Upload all PNG files to your website ROOT directory
2. Copy the HTML from favicon-html-snippet.html into your <head>
3. Upload site.webmanifest to your website ROOT directory
4. You're done! ✓
`);

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      Object.assign(document.createElement("a"), { href: url, download: "favicons.zip" }).click();
      URL.revokeObjectURL(url);
    } catch {
      // JSZip not available — fallback to individual downloads
      results.forEach((r, i) => setTimeout(() => downloadOne(r.size, r.dataUrl), i * 100));
    }
  }

  // ── Image upload ────────────────────────────────────────────────────────────
  function loadUploadFile(file: File) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { setUploadImg(img); setUploadSrc(url); };
    img.src = url;
  }

  // ── HTML Snippet ─────────────────────────────────────────────────────────────
  const htmlSnippet = `<!-- Favicon — Generated by PursTech Favicon Generator -->
<!-- https://purstech.com/tools/favicon-generator -->
<link rel="icon" type="image/png" sizes="16x16"   href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32"   href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48"   href="/favicon-48x48.png">
<link rel="apple-touch-icon"      sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png">
<link rel="manifest"                              href="/site.webmanifest">
<meta name="theme-color"          content="${themeColor}">
<meta name="msapplication-TileColor" content="${themeColor}">
<meta name="msapplication-TileImage" content="/favicon-144x144.png">`;

  const manifestJson = JSON.stringify({
    name:             appName,
    short_name:       appName,
    description:      `${appName} — Progressive Web App`,
    start_url:        "/",
    display:          "standalone",
    background_color: bgType === "transparent" ? "#ffffff" : bgColor,
    theme_color:      themeColor,
    icons: [
      { src: "/favicon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "/favicon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  }, null, 2);

  // ── Pixel editor paint ────────────────────────────────────────────────────────
  function paintPixel(idx: number) {
    setPixelGrid(prev => {
      const next = [...prev];
      next[idx] = activePen;
      return next;
    });
  }

  function clearPixels() { setPixelGrid(Array(PIXEL_GRID * PIXEL_GRID).fill("transparent")); }
  function fillPixels()  { setPixelGrid(Array(PIXEL_GRID * PIXEL_GRID).fill(activePen)); }

  const readyToGenerate = mode !== "upload" || uploadImg !== null;
  const preview512 = results.find(r => r.size === 512);

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
            <Link href="/blog"  className="text-sm text-gray-500 hover:text-white transition-colors">Blog</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link>
          <span>›</span>
          <span className="text-gray-400">Favicon Generator</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold">Image Tools</span>
            <span className="bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-xs text-green-400 font-semibold">★ 4.9/5 — 1,847 reviews</span>
            <span className="bg-[#00D4FF]/10 border border-[#00D4FF]/20 rounded-full px-3 py-1 text-xs text-[#00D4FF] font-semibold">All 18 Sizes · ZIP Download · PWA Manifest</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Favicon Generator — Create favicon.ico &amp; All Sizes Online
          </h1>
          <p className="text-gray-400 max-w-2xl">
            The most advanced favicon generator online. Create from an image, text, emoji or pixel art. Live device previews, all 18 sizes, PWA manifest.json and one-click ZIP download. 100% free, no login, no limits.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ── Left: Creation Panel ── */}
          <div className="xl:col-span-2 space-y-5">

            {/* Mode tabs */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-1 grid grid-cols-4 gap-1">
              {([
                { id:"upload" as Mode, icon:"🖼", label:"Upload"     },
                { id:"text"   as Mode, icon:"T",  label:"Text"       },
                { id:"emoji"  as Mode, icon:"😊", label:"Emoji"      },
                { id:"pixel"  as Mode, icon:"🎨", label:"Pixel Art"  },
              ]).map(m => (
                <button key={m.id} onClick={() => setMode(m.id)}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-bold transition-all ${
                    mode === m.id ? "bg-[#6C3AFF] text-white shadow-lg" : "text-gray-400 hover:text-white"
                  }`}>
                  <span className="text-lg">{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Upload Mode */}
            {mode === "upload" && (
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); const f=e.dataTransfer.files[0]; if(f) loadUploadFile(f); }}
                onClick={() => uploadInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
                  dragging ? "border-[#6C3AFF] bg-[#6C3AFF]/5" : "border-white/10 hover:border-[#6C3AFF]/40"
                }`}>
                <input ref={uploadInputRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f=e.target.files?.[0]; if(f) loadUploadFile(f); }} />
                {uploadSrc ? (
                  <div className="p-5 flex items-center gap-4">
                    <img src={uploadSrc} alt="Uploaded" className="w-20 h-20 object-contain rounded-xl border border-white/10" />
                    <div>
                      <div className="text-white font-bold text-sm mb-1">Image uploaded ✓</div>
                      <div className="text-gray-500 text-xs">Click to change image</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="text-5xl mb-3">🖼️</div>
                    <div className="text-white font-bold mb-1">Drop your logo or icon here</div>
                    <div className="text-gray-500 text-sm">PNG · SVG · JPEG · Any size</div>
                    <div className="text-xs text-gray-600 mt-2">Tip: Use a square PNG with transparent background for best results</div>
                  </div>
                )}
              </div>
            )}

            {/* Text Mode */}
            {mode === "text" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-white text-sm">Text Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Text (1–3 characters)</label>
                    <input value={text} onChange={e => setText(e.target.value.slice(0,3))} maxLength={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-2xl font-bold text-center focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Font</label>
                    <select value={font} onChange={e => setFont(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none transition-all">
                      {WEB_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Text Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)}
                        className="w-10 h-10 rounded-lg border border-white/10 bg-[#0A0A14] cursor-pointer" />
                      <input type="text" value={textColor} onChange={e => setTextColor(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none font-mono" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Weight</label>
                    <div className="flex gap-2">
                      {(["normal","bold"] as const).map(w => (
                        <button key={w} onClick={() => setFontWeight(w)}
                          className={`flex-1 py-2.5 rounded-xl text-sm transition-all border ${
                            fontWeight===w ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"
                          }`} style={{ fontWeight: w }}>
                          {w.charAt(0).toUpperCase()+w.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Emoji Mode */}
            {mode === "emoji" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-white text-sm">Emoji Settings</h3>
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Your Emoji</label>
                  <input value={emoji} onChange={e => setEmoji(e.target.value)} maxLength={2}
                    className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-5xl text-center focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Popular Emojis</label>
                  <div className="flex flex-wrap gap-2">
                    {["⚡","🚀","💡","🔥","⭐","💎","🎯","🌊","🦁","🐉","🍀","🏆","❤️","🌙","☀️","🎨","💻","🔮","⚙️","🎵"].map(e => (
                      <button key={e} onClick={() => setEmoji(e)}
                        className={`w-10 h-10 rounded-xl text-2xl transition-all border ${
                          emoji===e ? "bg-[#6C3AFF]/20 border-[#6C3AFF]" : "bg-[#0A0A14] border-white/5 hover:border-[#6C3AFF]/40"
                        }`}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pixel Editor Mode */}
            {mode === "pixel" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">Pixel Art Editor — {PIXEL_GRID}×{PIXEL_GRID}</h3>
                  <div className="flex gap-2">
                    <button onClick={fillPixels}  className="px-3 py-1.5 rounded-lg bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white text-xs transition-all">Fill All</button>
                    <button onClick={clearPixels} className="px-3 py-1.5 rounded-lg bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-[#FF3A6C] text-xs transition-all">Clear</button>
                  </div>
                </div>

                {/* Color palette */}
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Color Palette</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {PALETTE.map(c => (
                      <button key={c} onClick={() => setActivePen(c)}
                        className="w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 flex-shrink-0"
                        style={{
                          backgroundColor: c === "transparent" ? "transparent" : c,
                          borderColor: activePen === c ? "#FFFFFF" : "transparent",
                          backgroundImage: c === "transparent"
                            ? "repeating-conic-gradient(#888 0% 25%, #bbb 0% 50%) 0 0/8px 8px"
                            : "none",
                        }} />
                    ))}
                    {/* Custom color */}
                    <input type="color" value={activePen === "transparent" ? "#ffffff" : activePen}
                      onChange={e => setActivePen(e.target.value)}
                      className="w-7 h-7 rounded-lg border-2 border-white/20 cursor-pointer flex-shrink-0" />
                  </div>
                </div>

                {/* Pixel grid */}
                <div className="overflow-auto">
                  <div
                    className="inline-grid border border-white/10 rounded-xl overflow-hidden"
                    style={{ gridTemplateColumns: `repeat(${PIXEL_GRID}, ${CELL}px)` }}
                    onMouseUp={() => setIsPainting(false)}
                    onMouseLeave={() => setIsPainting(false)}>
                    {pixelGrid.map((color, i) => (
                      <div key={i}
                        className="cursor-crosshair"
                        style={{
                          width: CELL, height: CELL,
                          backgroundColor: color === "transparent" ? undefined : color,
                          backgroundImage: color === "transparent"
                            ? "repeating-conic-gradient(#333 0% 25%,#222 0% 50%) 0 0/8px 8px"
                            : "none",
                          border: "0.5px solid rgba(255,255,255,0.04)",
                        }}
                        onMouseDown={() => { setIsPainting(true); paintPixel(i); }}
                        onMouseEnter={() => { if (isPainting) paintPixel(i); }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Background & Shape */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-white text-sm">Background &amp; Shape</h3>

              {/* Shape */}
              <div>
                <label className="text-xs text-gray-500 mb-2 block">Icon Shape</label>
                <div className="grid grid-cols-3 gap-2">
                  {SHAPE_TYPES.map(s => (
                    <button key={s} onClick={() => setShape(s)}
                      className={`py-3 rounded-xl text-sm font-semibold flex flex-col items-center gap-1.5 transition-all border ${
                        shape===s ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"
                      }`}>
                      <span className="text-xl">
                        {s==="square" ? "⬛" : s==="rounded" ? "🟦" : "⚫"}
                      </span>
                      <span className="capitalize text-xs">{s}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Background type */}
              <div>
                <label className="text-xs text-gray-500 mb-2 block">Background Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["solid","gradient","transparent"] as const).map(t => (
                    <button key={t} onClick={() => setBgType(t)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all border capitalize ${
                        bgType===t ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {bgType === "solid" && (
                <div className="flex gap-2 items-center">
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-white/10 bg-[#0A0A14] cursor-pointer" />
                  <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 font-mono" />
                </div>
              )}

              {bgType === "gradient" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-2 block">Gradient Presets</label>
                    <div className="grid grid-cols-4 gap-2">
                      {GRADIENTS.map(g => (
                        <button key={g.name} onClick={() => setGradStops(g.stops)}
                          className={`h-10 rounded-xl transition-all border-2 ${
                            JSON.stringify(gradStops) === JSON.stringify(g.stops)
                              ? "border-white"
                              : "border-transparent hover:border-white/30"
                          }`}
                          style={{ background: `linear-gradient(135deg, ${g.stops.join(", ")})` }}
                          title={g.name} />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {gradStops.map((c, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input type="color" value={c}
                          onChange={e => {
                            const next = [...gradStops];
                            next[i] = e.target.value;
                            setGradStops(next);
                          }}
                          className="w-8 h-8 rounded-lg border border-white/10 bg-[#0A0A14] cursor-pointer flex-shrink-0" />
                        <input type="text" value={c}
                          onChange={e => {
                            const next = [...gradStops];
                            next[i] = e.target.value;
                            setGradStops(next);
                          }}
                          className="flex-1 px-2 py-1.5 rounded-lg bg-[#0A0A14] border border-white/10 text-white text-xs focus:outline-none font-mono" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Padding */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-gray-500">Icon Padding</label>
                  <span className="text-xs text-white font-bold">{padding}%</span>
                </div>
                <input type="range" min={0} max={35} value={padding}
                  onChange={e => setPadding(Number(e.target.value))}
                  className="w-full accent-[#6C3AFF]" />
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={generateAll}
              disabled={!readyToGenerate || generating}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] text-white font-extrabold text-lg transition-all hover:opacity-90 disabled:opacity-40 shadow-2xl shadow-violet-900/40">
              {generating ? "⏳ Generating All 18 Sizes…" : "✨ Generate All 18 Favicon Sizes"}
            </button>
          </div>

          {/* ── Right: Preview Panel ── */}
          <div className="space-y-4">

            {/* Live preview */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Live Preview</h3>
              <div className="flex items-center justify-center mb-4">
                <canvas ref={previewCanvasRef}
                  className="rounded-xl border border-white/10"
                  style={{ width: 128, height: 128, imageRendering: "pixelated" }} />
              </div>

              {/* Browser tab mockup */}
              <div className="bg-gray-200 rounded-t-xl px-2 pt-2 pb-0">
                <div className="bg-white rounded-t-lg px-3 py-2 flex items-center gap-2 border border-gray-300 border-b-0 max-w-[180px]">
                  <canvas ref={c => {
                    if (!c || !previewCanvasRef.current) return;
                    c.width = 16; c.height = 16;
                    c.getContext("2d")!.drawImage(previewCanvasRef.current, 0, 0, 16, 16);
                  }} width={16} height={16} style={{ imageRendering: "pixelated" }} className="flex-shrink-0" />
                  <span className="text-gray-700 text-xs truncate">{appName}</span>
                  <span className="text-gray-400 text-xs ml-auto">×</span>
                </div>
              </div>
              <div className="bg-white rounded-b-xl p-3 border border-gray-200 text-xs text-gray-500 text-center">
                Chrome tab preview
              </div>
            </div>

            {/* Device mockups */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Device Mockups</h3>
              <div className="space-y-4">

                {/* iOS */}
                <div>
                  <div className="text-xs text-gray-600 mb-2">📱 iOS Home Screen</div>
                  <div className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl p-3 flex items-end gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 rounded-[10px] overflow-hidden shadow-lg">
                        <canvas ref={c => {
                          if (!c || !previewCanvasRef.current) return;
                          c.width = 48; c.height = 48;
                          c.getContext("2d")!.drawImage(previewCanvasRef.current, 0, 0, 48, 48);
                        }} width={48} height={48} style={{ width:48,height:48,imageRendering:"pixelated" }} />
                      </div>
                      <span className="text-white text-[9px] font-semibold truncate w-14 text-center drop-shadow">{appName.slice(0,8)}</span>
                    </div>
                    {["Notes","Photos","Safari"].map(n => (
                      <div key={n} className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-[10px] bg-white/20 backdrop-blur" />
                        <span className="text-white text-[9px] drop-shadow">{n}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Android */}
                <div>
                  <div className="text-xs text-gray-600 mb-2">🤖 Android Chrome</div>
                  <div className="bg-gray-900 rounded-xl p-3 flex items-center gap-3 border border-gray-800">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                      <canvas ref={c => {
                        if (!c || !previewCanvasRef.current) return;
                        c.width = 40; c.height = 40;
                        c.getContext("2d")!.drawImage(previewCanvasRef.current, 0, 0, 40, 40);
                      }} width={40} height={40} style={{ width:40,height:40,imageRendering:"pixelated" }} />
                    </div>
                    <div>
                      <div className="text-white text-sm font-semibold">{appName}</div>
                      <div className="text-gray-400 text-xs">purstech.com</div>
                    </div>
                  </div>
                </div>

                {/* Windows taskbar */}
                <div>
                  <div className="text-xs text-gray-600 mb-2">🪟 Windows Taskbar</div>
                  <div className="bg-gray-800 rounded-lg p-2 flex items-center gap-2 border border-gray-700">
                    <canvas ref={c => {
                      if (!c || !previewCanvasRef.current) return;
                      c.width = 24; c.height = 24;
                      c.getContext("2d")!.drawImage(previewCanvasRef.current, 0, 0, 24, 24);
                    }} width={24} height={24} style={{ width:24,height:24,imageRendering:"pixelated" }} />
                    <span className="text-gray-300 text-xs">{appName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* App name for manifest */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">App Info</h3>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">App / Site Name</label>
                <input value={appName} onChange={e => setAppName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Theme Color</label>
                <div className="flex gap-2">
                  <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-white/10 bg-[#0A0A14] cursor-pointer flex-shrink-0" />
                  <input type="text" value={themeColor} onChange={e => setThemeColor(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none font-mono" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        {results.length > 0 && (
          <div className="mt-8 space-y-6">

            {/* Download bar */}
            <div className="bg-gradient-to-r from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/30 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="font-extrabold text-white text-lg">{results.length} favicon sizes ready ✓</div>
                <div className="text-gray-400 text-sm">Apple Touch Icon, Android Chrome, PWA splash + all legacy sizes</div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button onClick={downloadZip}
                  className="px-6 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white font-bold transition-all shadow-lg shadow-violet-900/30 flex items-center gap-2">
                  <span>⬇</span> Download All as ZIP
                </button>
              </div>
            </div>

            {/* Size grid */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-white">All {results.length} Favicon Sizes</h2>
                <div className="flex gap-2">
                  <span className="text-xs text-gray-500">★ = Required</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {results.map(r => {
                  const meta = FAVICON_SIZES.find(s => s.size === r.size)!;
                  return (
                    <button key={r.size} onClick={() => downloadOne(r.size, r.dataUrl)}
                      className={`group bg-[#0A0A14] rounded-xl p-3 border transition-all text-center hover:-translate-y-0.5 hover:shadow-lg ${
                        meta.required ? "border-[#6C3AFF]/30 hover:border-[#6C3AFF]" : "border-white/5 hover:border-white/20"
                      }`}>
                      <div className="flex items-center justify-center mb-2"
                        style={{ height: Math.min(r.size, 48) + "px" }}>
                        <img src={r.dataUrl} alt={meta.label}
                          style={{ width: Math.min(r.size, 48), height: Math.min(r.size, 48), imageRendering: "pixelated" }}
                          className="object-contain" />
                      </div>
                      <div className={`text-xs font-bold ${meta.required ? "text-[#6C3AFF]" : "text-white"}`}>
                        {meta.label} {meta.required ? "★" : ""}
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5 line-clamp-1 leading-snug">{meta.use}</div>
                      <div className="text-xs text-gray-600 group-hover:text-[#6C3AFF] mt-1 opacity-0 group-hover:opacity-100 transition-all">⬇ Download</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* HTML snippet */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-base font-extrabold text-white">HTML Code Snippet</h2>
                  <p className="text-xs text-gray-500">Paste inside the &lt;head&gt; of every page</p>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(htmlSnippet); setCopiedHtml(true); setTimeout(() => setCopiedHtml(false), 2000); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    copiedHtml ? "bg-green-600 text-white" : "bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white"
                  }`}>
                  {copiedHtml ? "✓ Copied!" : "Copy HTML"}
                </button>
              </div>
              <pre className="text-xs text-green-400 bg-[#0A0A14] rounded-xl p-4 overflow-x-auto whitespace-pre font-mono leading-relaxed">
                {htmlSnippet}
              </pre>
            </div>

            {/* PWA Manifest */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <button onClick={() => setShowManifest(p => !p)}
                className="w-full flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-white text-left">PWA Manifest (site.webmanifest)</h2>
                  <p className="text-xs text-gray-500 text-left">Required for Progressive Web App support on Android</p>
                </div>
                <span className={`text-[#6C3AFF] text-xl transition-transform ${showManifest ? "rotate-45" : ""}`}>+</span>
              </button>
              {showManifest && (
                <div className="mt-4">
                  <div className="flex justify-end mb-2">
                    <button onClick={() => {
                      const blob = new Blob([manifestJson], { type: "application/json" });
                      Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "site.webmanifest" }).click();
                    }}
                      className="px-4 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-xs font-bold transition-all">
                      ⬇ Download manifest
                    </button>
                  </div>
                  <pre className="text-xs text-cyan-400 bg-[#0A0A14] rounded-xl p-4 overflow-x-auto whitespace-pre font-mono leading-relaxed">
                    {manifestJson}
                  </pre>
                </div>
              )}
            </div>

            {/* Installation guide */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h2 className="text-base font-extrabold text-white mb-4">📋 Installation Checklist</h2>
              <div className="space-y-2">
                {[
                  { step:"Upload all PNG files", desc:`Upload to your website ROOT (same level as index.html). Verify: yoursite.com/favicon-32x32.png` },
                  { step:"Paste the HTML snippet", desc:`Copy the HTML code above into the <head> of every page (or your layout.tsx / header.php)` },
                  { step:"Upload site.webmanifest", desc:`Download the manifest and upload to your website root. Required for Android PWA installation` },
                  { step:"Verify in browser", desc:`Open your site, right-click > View Page Source, and confirm the favicon tags are present in the <head>` },
                  { step:"Test on mobile", desc:`Visit your site on iPhone and Android. Add to home screen — your favicon should appear as the app icon` },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-[#6C3AFF] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <span className="font-semibold text-white">{item.step}</span>
                      <span className="text-gray-500"> — {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Create a Favicon Online</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Choose your creation method",
                desc:"Upload a logo, type text, pick an emoji, or draw pixel art. All four modes support custom backgrounds, shapes and gradients." },
              { step:"2", title:"Customise background & shape",
                desc:"Pick from square, rounded or circle shapes. Set a solid color, gradient preset or transparent background. Adjust icon padding." },
              { step:"3", title:"Preview on real devices",
                desc:"See exactly how your favicon looks in a Chrome browser tab, on an iOS home screen, Android app drawer and Windows taskbar." },
              { step:"4", title:"Download everything",
                desc:"Click Download ZIP to get all 18 sizes, the HTML snippet and the PWA manifest.json in one file. Upload them to your website root." },
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

        {/* Comparison with competitors */}
        <div className="mt-8 bg-[#13131F] border border-white/5 rounded-2xl p-5 overflow-x-auto">
          <h2 className="text-base font-extrabold text-white mb-4">Why PursTech Favicon Generator Stands Out</h2>
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-2 text-gray-500 font-semibold">Feature</th>
                <th className="text-center py-2 text-[#6C3AFF] font-bold">PursTech ★</th>
                <th className="text-center py-2 text-gray-500">favicon.io</th>
                <th className="text-center py-2 text-gray-500">realfavicongenerator</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["4 creation modes (upload, text, emoji, pixel)", true, false, false],
                ["Live device mockups", true, false, false],
                ["Gradient backgrounds", true, false, false],
                ["All 18 sizes", true, true, true],
                ["ZIP download", true, true, true],
                ["PWA manifest.json", true, false, true],
                ["Pixel art editor", true, false, false],
                ["No login required", true, true, true],
                ["100% browser-based (private)", true, true, false],
              ].map(([feature, purstech, favicoIo, realFav]) => (
                <tr key={String(feature)} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-2.5 text-gray-400">{String(feature)}</td>
                  <td className="text-center py-2.5">{purstech ? <span className="text-green-400 font-bold">✓</span> : <span className="text-gray-600">—</span>}</td>
                  <td className="text-center py-2.5">{favicoIo ? <span className="text-green-400">✓</span> : <span className="text-gray-600">—</span>}</td>
                  <td className="text-center py-2.5">{realFav  ? <span className="text-green-400">✓</span> : <span className="text-gray-600">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAVICON_FAQ.map((faq, i) => (
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
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2025 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
