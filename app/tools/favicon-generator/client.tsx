"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ Patch 2

// ── FAQs ───────────────────────────────────────────────────────────────────────

const FAVICON_FAQ = [
  { q:"What size should a favicon be?",
    a:"The classic favicon.ico contains 16x16, 32x32 and 48x48 pixels; modern sites also need 180x180 (Apple Touch Icon), 192x192 (Android Chrome) and 512x512 (PWA). This generator exports all 18 standard sizes in one ZIP, with the exact HTML head snippet to paste in." },
  { q:"How do I make a favicon?",
    a:"Upload any image, type text or an emoji, or draw one pixel-by-pixel in the built-in ICO editor — then hit Generate and download a ZIP containing every standard size plus the ready-made HTML code. No design software needed." },
  { q:"What is a favicon and why does my website need one?",
    a:"A favicon (short for 'favorites icon') is the small icon that appears in browser tabs, bookmarks, home screen shortcuts and search results. Without a favicon, browsers display a generic page icon — making your site look unfinished and less trustworthy. Google also displays favicons next to results in mobile search, making them a subtle but impactful SEO element." },
  { q:"What favicon sizes do I actually need in 2025?",
    a:"The essential sizes are: 16×16 and 32×32 for browser tabs, 180×180 for Apple Touch Icon (iPhone and iPad home screen), 192×192 for Android Chrome and PWA, and 512×512 for PWA splash screens. Our tool creates all 18 standard sizes simultaneously." },
  { q:"How do I add a favicon to my website?",
    a:"After downloading your favicon files, upload them to your website's root directory (same folder as your index.html). Paste the HTML snippet into the <head> of every page — or into layout.tsx in Next.js, or header.php in WordPress." },
  { q:"What is a PWA web manifest and do I need one?",
    a:"A Progressive Web App (PWA) manifest is a JSON file that tells browsers how to display your site when installed as a home screen app. Without a manifest, your site cannot be installed as a PWA on Android devices. Our generator creates a complete manifest.json automatically." },
  { q:"What image makes the best favicon?",
    a:"The best favicons are bold, simple and instantly recognisable at 16×16 pixels. Use just the icon or logomark portion of your logo — not the full horizontal logo with text. Test your result in the Chrome tab and iOS mockup previews before downloading." },
];

// ── Constants ──────────────────────────────────────────────────────────────────
const FAVICON_SIZES = [
  { size:16,  label:"16×16",   use:"Browser tab",             required:true  },
  { size:32,  label:"32×32",   use:"Retina browser tab",      required:true  },
  { size:48,  label:"48×48",   use:"Windows site icon",       required:false },
  { size:57,  label:"57×57",   use:"iOS home (legacy)",       required:false },
  { size:60,  label:"60×60",   use:"iPhone home screen",      required:false },
  { size:72,  label:"72×72",   use:"iPad home screen",        required:false },
  { size:76,  label:"76×76",   use:"iPad retina",             required:false },
  { size:96,  label:"96×96",   use:"Google TV",               required:false },
  { size:114, label:"114×114", use:"iOS retina (legacy)",     required:false },
  { size:120, label:"120×120", use:"iPhone retina",           required:false },
  { size:144, label:"144×144", use:"iPad retina / Win8 tile", required:false },
  { size:152, label:"152×152", use:"iPad retina",             required:false },
  { size:180, label:"180×180", use:"Apple Touch Icon ★",      required:true  },
  { size:192, label:"192×192", use:"Android Chrome / PWA ★",  required:true  },
  { size:256, label:"256×256", use:"Windows 10 tile",         required:false },
  { size:310, label:"310×310", use:"Windows 10 wide tile",    required:false },
  { size:384, label:"384×384", use:"Android splash",          required:false },
  { size:512, label:"512×512", use:"PWA splash screen ★",     required:true  },
];

const WEB_FONTS = [
  "Arial","Georgia","Verdana","Trebuchet MS","Impact","Courier New",
  "Palatino","Garamond","Comic Sans MS","Tahoma","Century Gothic",
];

const SHAPE_TYPES = ["square","rounded","circle"] as const;
type ShapeType = typeof SHAPE_TYPES[number];
type Mode = "upload"|"text"|"emoji"|"pixel";

const PIXEL_GRID = 16;

const PALETTE = [
  "#000000","#FFFFFF","#FF0000","#00FF00","#0000FF","#FFFF00",
  "#FF00FF","#00FFFF","#FF8800","#8800FF","#0088FF","#FF0088",
  "#884400","#448800","#004488","#888888","#CCCCCC","#FF4444",
  "#44FF44","#4444FF","transparent",
];

const GRADIENTS = [
  { name:"Purple",   stops:["#6C3AFF","#00D4FF"] },
  { name:"Sunset",   stops:["#FF3A6C","#FF8C00"] },
  { name:"Ocean",    stops:["#0052D4","#6FB1FC"]  },
  { name:"Forest",   stops:["#134E5E","#71B280"]  },
  { name:"Fire",     stops:["#f12711","#f5af19"]  },
  { name:"Rose",     stops:["#F093FB","#F5576C"]  },
  { name:"Midnight", stops:["#0A0A14","#2C2C54"]  },
  { name:"Gold",     stops:["#F7971E","#FFD200"]  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function drawShape(ctx: CanvasRenderingContext2D, size: number, shape: ShapeType) {
  const r = size / 2;
  ctx.beginPath();
  if (shape === "circle") {
    ctx.arc(r, r, r, 0, Math.PI * 2);
  } else if (shape === "rounded") {
    const rad = size * 0.22;
    ctx.moveTo(rad, 0); ctx.lineTo(size-rad, 0);
    ctx.quadraticCurveTo(size, 0, size, rad);
    ctx.lineTo(size, size-rad);
    ctx.quadraticCurveTo(size, size, size-rad, size);
    ctx.lineTo(rad, size);
    ctx.quadraticCurveTo(0, size, 0, size-rad);
    ctx.lineTo(0, rad);
    ctx.quadraticCurveTo(0, 0, rad, 0);
  } else {
    ctx.rect(0, 0, size, size);
  }
  ctx.closePath();
}

function applyBackground(
  ctx: CanvasRenderingContext2D, size: number,
  bgType: "solid"|"gradient"|"transparent",
  bgColor: string, gradientStops: string[], shape: ShapeType
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

// ✅ UI Enhancement 2: Flood fill for pixel art bucket tool
function floodFill(grid: string[], startIdx: number, fillColor: string): string[] {
  const targetColor = grid[startIdx];
  if (targetColor === fillColor) return grid;
  const newGrid = [...grid];
  const cols = PIXEL_GRID;
  const stack = [startIdx];
  while (stack.length) {
    const idx = stack.pop()!;
    if (idx < 0 || idx >= newGrid.length || newGrid[idx] !== targetColor) continue;
    newGrid[idx] = fillColor;
    const row = Math.floor(idx / cols), col = idx % cols;
    if (col > 0)              stack.push(idx - 1);
    if (col < cols - 1)       stack.push(idx + 1);
    if (row > 0)              stack.push(idx - cols);
    if (row < PIXEL_GRID - 1) stack.push(idx + cols);
  }
  return newGrid;
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function FaviconGeneratorClient({ children }: { children?: React.ReactNode }) {
  // ✅ Patch 2: track usage
  useTrackTool("favicon-generator", "image");

  const [mode,         setMode]         = useState<Mode>("upload");
  const [uploadImg,    setUploadImg]     = useState<HTMLImageElement | null>(null);
  const [uploadSrc,    setUploadSrc]     = useState<string | null>(null);
  const [text,         setText]         = useState("A");
  const [font,         setFont]         = useState("Arial");
  const [fontWeight,   setFontWeight]   = useState<"normal"|"bold">("bold");
  const [textColor,    setTextColor]    = useState("#FFFFFF");
  const [emoji,        setEmoji]        = useState("⚡");
  const [pixelGrid,    setPixelGrid]    = useState<string[]>(() => Array(PIXEL_GRID * PIXEL_GRID).fill("transparent"));
  const [activePen,    setActivePen]    = useState("#6C3AFF");
  const [pixelTool,    setPixelTool]    = useState<"pencil"|"bucket">("pencil");
  const [isPainting,   setIsPainting]   = useState(false);
  // ✅ UI Enhancement 1: pixel art undo stack
  const [pixelUndo,    setPixelUndo]    = useState<string[][]>([]);
  const [shape,        setShape]        = useState<ShapeType>("rounded");
  const [bgType,       setBgType]       = useState<"solid"|"gradient"|"transparent">("gradient");
  const [bgColor,      setBgColor]      = useState("#6C3AFF");
  const [gradStops,    setGradStops]    = useState(["#6C3AFF","#00D4FF"]);
  const [padding,      setPadding]      = useState(10);
  const [results,      setResults]      = useState<{ size:number; dataUrl:string }[]>([]);
  const [generating,   setGenerating]   = useState(false);
  const [copiedHtml,   setCopiedHtml]   = useState(false);
  const [appName,      setAppName]      = useState("My App");
  const [themeColor,   setThemeColor]   = useState("#6C3AFF");
  const [showManifest, setShowManifest] = useState(false);
  const [dragging,     setDragging]     = useState(false);
  const [openFaq,      setOpenFaq]      = useState<number | null>(null);

  const uploadInputRef   = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const chipCanvasRef    = useRef<HTMLCanvasElement>(null); // small browser-tab chip

  // Pixel undo helpers
  function pushPixelUndo(current: string[]) {
    setPixelUndo(prev => [...prev.slice(-19), [...current]]);
  }
  function undoPixel() {
    if (!pixelUndo.length) return;
    setPixelGrid(pixelUndo[pixelUndo.length - 1]);
    setPixelUndo(p => p.slice(0, -1));
  }

  // Ctrl+Z for pixel art
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && mode === "pixel") {
        e.preventDefault();
        undoPixel();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode, pixelUndo]);

  // ── Render canvas ──────────────────────────────────────────────────────────
  const renderToCanvas = useCallback((targetSize: number): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = targetSize;
    const ctx = canvas.getContext("2d")!;
    applyBackground(ctx, targetSize, bgType, bgColor, gradStops, shape);
    const pad   = Math.round(targetSize * (padding / 100));
    const inner = targetSize - pad * 2;
    ctx.save();
    drawShape(ctx, targetSize, shape);
    ctx.clip();
    if (mode === "upload" && uploadImg) {
      const aspect = uploadImg.width / uploadImg.height;
      let dw = inner, dh = inner;
      if (aspect > 1) dh = inner / aspect;
      else if (aspect < 1) dw = inner * aspect;
      ctx.drawImage(uploadImg, pad + (inner-dw)/2, pad + (inner-dh)/2, dw, dh);
    } else if (mode === "text") {
      const fontSize = Math.round(inner * 0.65);
      ctx.font = `${fontWeight} ${fontSize}px "${font}"`;
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text.slice(0, 3), targetSize / 2, targetSize / 2);
    } else if (mode === "emoji") {
      const fontSize = Math.round(inner * 0.72);
      ctx.font = `${fontSize}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(emoji, targetSize / 2, targetSize / 2 + fontSize * 0.05);
    } else if (mode === "pixel") {
      const cellSize = inner / PIXEL_GRID;
      pixelGrid.forEach((color, i) => {
        if (color === "transparent") return;
        ctx.fillStyle = color;
        ctx.fillRect((i % PIXEL_GRID) * cellSize + pad, Math.floor(i / PIXEL_GRID) * cellSize + pad, cellSize, cellSize);
      });
    }
    ctx.restore();
    return canvas;
  }, [mode, uploadImg, bgType, bgColor, gradStops, shape, padding, text, font, fontWeight, textColor, emoji, pixelGrid]);

  // Live preview — draws into both the large 128px card and the tiny 16px chip
  useEffect(() => {
    const preview = renderToCanvas(128);
    const main = previewCanvasRef.current;
    if (main) { main.width = main.height = 128; main.getContext("2d")!.drawImage(preview, 0, 0); }
    const chip = chipCanvasRef.current;
    if (chip) { chip.width = chip.height = 16; chip.getContext("2d")!.drawImage(preview, 0, 0); }
  }, [renderToCanvas]);

  // Generate all sizes
  async function generateAll() {
    if (mode === "upload" && !uploadImg) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 10));
    setResults(FAVICON_SIZES.map(s => ({ size: s.size, dataUrl: renderToCanvas(s.size).toDataURL("image/png") })));
    setGenerating(false);
  }

  function downloadOne(size: number, dataUrl: string) {
    const name = size === 180 ? "apple-touch-icon.png" : size === 512 ? "favicon-512x512.png" : `favicon-${size}x${size}.png`;
    Object.assign(document.createElement("a"), { href: dataUrl, download: name }).click();
  }

  async function downloadZip() {
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip(), folder = zip.folder("favicons")!;
      results.forEach(r => {
        const name = r.size === 180 ? "apple-touch-icon.png" : `favicon-${r.size}x${r.size}.png`;
        folder.file(name, r.dataUrl.split(",")[1], { base64: true });
      });
      folder.file("favicon-html-snippet.html", htmlSnippet);
      folder.file("site.webmanifest", manifestJson);
      folder.file("README.txt", `Favicon Pack — Generated by PursTech\n====================================\nTool: https://purstech.com/tools/favicon-generator\n\nUpload all files to your root directory, then paste the HTML snippet into your <head>.`);
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      Object.assign(document.createElement("a"), { href: url, download: "favicons.zip" }).click();
      URL.revokeObjectURL(url);
    } catch {
      results.forEach((r, i) => setTimeout(() => downloadOne(r.size, r.dataUrl), i * 100));
    }
  }

  function loadUploadFile(file: File) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { setUploadImg(img); setUploadSrc(url); };
    img.src = url;
  }

  const htmlSnippet = `<!-- Favicon — Generated by PursTech Favicon Generator -->
<link rel="icon" type="image/png" sizes="16x16"   href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32"   href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48"   href="/favicon-48x48.png">
<link rel="apple-touch-icon"      sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png">
<link rel="manifest"                              href="/site.webmanifest">
<meta name="theme-color"          content="${themeColor}">`;

  const manifestJson = JSON.stringify({
    name: appName, short_name: appName,
    start_url: "/", display: "standalone",
    background_color: bgType === "transparent" ? "#ffffff" : bgColor,
    theme_color: themeColor,
    icons: [
      { src: "/favicon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "/favicon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  }, null, 2);

  function handlePixelInteract(idx: number, isStart = false) {
    if (pixelTool === "bucket") {
      if (!isStart) return;
      pushPixelUndo(pixelGrid);
      setPixelGrid(prev => floodFill(prev, idx, activePen));
    } else {
      if (isStart) pushPixelUndo(pixelGrid);
      setPixelGrid(prev => { const n=[...prev]; n[idx]=activePen; return n; });
    }
  }

  const clearPixels = () => { pushPixelUndo(pixelGrid); setPixelGrid(Array(PIXEL_GRID * PIXEL_GRID).fill("transparent")); };
  const fillPixels  = () => { pushPixelUndo(pixelGrid); setPixelGrid(Array(PIXEL_GRID * PIXEL_GRID).fill(activePen)); };

  const readyToGenerate = mode !== "upload" || uploadImg !== null;
  const previewResult   = results.find(r => r.size === 32);
  const preview180      = results.find(r => r.size === 180);
  const preview192      = results.find(r => r.size === 192);

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">


      {/* ── Navbar ── */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          {/* ✅ Patch 3: Go Pro added */}
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
            <Link href="/blog"  className="text-sm text-gray-500 hover:text-white transition-colors">Blog</Link>
            <Link href="/pro"
              className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">
              Go Pro ⚡
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span aria-hidden="true">›</span>{/* ✅ Patch 4 */}
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link>
          <span aria-hidden="true">›</span>
          <Link href="/categories/image" className="hover:text-gray-400 transition-colors">Image Tools</Link>
          <span aria-hidden="true">›</span>
          <span className="text-gray-400">Favicon Generator</span>
        </nav>

        {/* Hero — from page.tsx server children */}
        {children}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ── Left: Creation panel ── */}
          <div className="xl:col-span-2 space-y-5">

            {/* Mode tabs */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-1 grid grid-cols-4 gap-1">
              {([
                { id:"upload" as Mode, icon:"🖼", label:"Upload"    },
                { id:"text"   as Mode, icon:"T",  label:"Text"      },
                { id:"emoji"  as Mode, icon:"😊", label:"Emoji"     },
                { id:"pixel"  as Mode, icon:"🎨", label:"Pixel Art" },
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
                onClick={() => !uploadSrc && uploadInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl transition-all ${
                  dragging ? "border-[#6C3AFF] bg-[#6C3AFF]/5 scale-[1.01]" : "border-white/10 hover:border-[#6C3AFF]/40"
                } ${uploadSrc ? "" : "cursor-pointer"}`}>
                <input ref={uploadInputRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f=e.target.files?.[0]; if(f) loadUploadFile(f); }} />
                {uploadSrc ? (
                  <div className="p-5 flex items-center gap-5">
                    <img src={uploadSrc} alt="Upload" className="w-20 h-20 rounded-xl object-contain bg-[#0A0A14] border border-white/10" />
                    <div>
                      <div className="text-white font-semibold text-sm mb-1">✓ Image uploaded</div>
                      <div className="text-gray-500 text-xs mb-3">Will be scaled to all 18 favicon sizes automatically.</div>
                      <button onClick={e => { e.stopPropagation(); setUploadImg(null); setUploadSrc(null); }}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors underline">
                        Remove & upload different image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-14 text-center">
                    <div className="text-5xl mb-4">🖼️</div>
                    <div className="text-white font-bold text-lg mb-2">Drop image here or click to upload</div>
                    <div className="text-gray-500 text-sm mb-1">PNG · JPG · SVG · WebP — any size</div>
                    <div className="text-gray-600 text-xs">Your image is never uploaded to any server</div>
                  </div>
                )}
              </div>
            )}

            {/* Text Mode */}
            {mode === "text" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 font-medium block mb-1.5 uppercase tracking-wider">Text / Initial (max 3 chars)</label>
                    <input value={text} onChange={e => setText(e.target.value)} maxLength={3}
                      className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-xl font-extrabold text-center focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium block mb-1.5 uppercase tracking-wider">Text Color</label>
                    <div className="flex gap-2 items-center">
                      <label className="flex-shrink-0 cursor-pointer rounded-xl overflow-hidden border border-white/10" style={{ width:48, height:48, backgroundColor:textColor, display:"block" }}>
                        <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="opacity-0 cursor-pointer block" style={{ width:48, height:48 }} />
                      </label>
                      <input value={textColor} onChange={e => setTextColor(e.target.value)}
                        className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1.5 uppercase tracking-wider">Font</label>
                  <select value={font} onChange={e => setFont(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all">
                    {WEB_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  {(["bold","normal"] as const).map(w => (
                    <button key={w} onClick={() => setFontWeight(w)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all border ${
                        fontWeight === w ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400"
                      }`}>{w}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Emoji Mode */}
            {mode === "emoji" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1.5 uppercase tracking-wider">Emoji</label>
                  <input value={emoji} onChange={e => setEmoji(e.target.value)} maxLength={2}
                    className="w-full px-4 py-4 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-4xl text-center focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                </div>
                <div className="grid grid-cols-8 gap-2">
                  {["⚡","🔥","⭐","💜","🎯","🚀","💎","🎨","🦊","🐉","🌊","🌙","✨","🎮","💡","🔮"].map(e => (
                    <button key={e} onClick={() => setEmoji(e)}
                      className={`text-2xl py-2 rounded-xl transition-all border ${
                        emoji === e ? "bg-[#6C3AFF]/20 border-[#6C3AFF]/50" : "bg-[#0A0A14] border-white/5 hover:border-white/20"
                      }`}>{e}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Pixel Art Mode */}
            {mode === "pixel" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4">
                {/* Toolbar */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* ✅ UI Enhancement 1: Tool selector (pencil vs bucket) */}
                  <div className="flex gap-1 bg-[#0A0A14] rounded-xl p-1 border border-white/5">
                    <button onClick={() => setPixelTool("pencil")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${pixelTool==="pencil" ? "bg-[#6C3AFF] text-white" : "text-gray-400 hover:text-white"}`}>
                      ✏️ Pencil
                    </button>
                    <button onClick={() => setPixelTool("bucket")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${pixelTool==="bucket" ? "bg-[#6C3AFF] text-white" : "text-gray-400 hover:text-white"}`}>
                      🪣 Fill
                    </button>
                  </div>
                  {/* ✅ UI Enhancement 1: Undo button + hint */}
                  <button onClick={undoPixel} disabled={!pixelUndo.length}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-all"
                    title="Undo (Ctrl+Z)">
                    ↩ Undo
                  </button>
                  <button onClick={clearPixels} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-red-400 transition-all">
                    🗑 Clear
                  </button>
                  <button onClick={fillPixels}  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white transition-all">
                    Fill All
                  </button>
                  <span className="text-xs text-gray-700 ml-auto">Ctrl+Z to undo</span>
                </div>

                {/* Colour palette */}
                <div className="flex flex-wrap gap-1.5">
                  {PALETTE.map((color, i) => (
                    <button key={i} onClick={() => setActivePen(color)}
                      className={`w-7 h-7 rounded-lg transition-all border ${
                        activePen === color ? "ring-2 ring-white scale-110" : "border-white/10 hover:border-white/40"
                      } ${color === "transparent" ? "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNhYWEiLz48cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjYWFhIi8+PC9zdmc+')]" : ""}`}
                      style={{ backgroundColor: color !== "transparent" ? color : undefined }} />
                  ))}
                  <input type="color" value={activePen === "transparent" ? "#6C3AFF" : activePen}
                    onChange={e => setActivePen(e.target.value)}
                    className="w-7 h-7 rounded-lg border border-white/10 bg-[#0A0A14] cursor-pointer" title="Custom colour" />
                </div>

                {/* Grid */}
                <div className="overflow-x-auto">
                  <div
                    className="border border-white/10 rounded-xl overflow-hidden cursor-crosshair select-none"
                    style={{ display:"grid", gridTemplateColumns:`repeat(${PIXEL_GRID}, 1fr)`, width:`${PIXEL_GRID*20}px` }}
                    onMouseLeave={() => setIsPainting(false)}>
                    {pixelGrid.map((color, i) => (
                      <div key={i}
                        style={{ width:20, height:20, backgroundColor: color === "transparent" ? undefined : color,
                          backgroundImage: color === "transparent" ? "repeating-conic-gradient(#333 0% 25%, #222 0% 50%) 0 0/10px 10px" : undefined,
                          borderRight:"1px solid rgba(255,255,255,0.03)", borderBottom:"1px solid rgba(255,255,255,0.03)" }}
                        onMouseDown={() => { setIsPainting(true); handlePixelInteract(i, true); }}
                        onMouseEnter={() => { if (isPainting && pixelTool === "pencil") handlePixelInteract(i); }}
                        onMouseUp={() => setIsPainting(false)}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600">Click to paint · Shift+Click auto-fills · Ctrl+Z to undo · Switch to Fill tool for flood fill</p>
              </div>
            )}

            {/* Customisation panel */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-5">
              <h3 className="text-sm font-bold text-white">🎨 Customise</h3>
              {/* Shape */}
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">Shape</label>
                <div className="flex gap-2">
                  {(["square","rounded","circle"] as const).map(s => (
                    <button key={s} onClick={() => setShape(s)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all border ${
                        shape === s ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400"
                      }`}>{s}</button>
                  ))}
                </div>
              </div>

              {/* Background */}
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">Background</label>
                <div className="flex gap-2 mb-3">
                  {(["gradient","solid","transparent"] as const).map(t => (
                    <button key={t} onClick={() => setBgType(t)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all border ${
                        bgType === t ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400"
                      }`}>{t}</button>
                  ))}
                </div>
                {bgType === "gradient" && (
                  <div className="flex flex-wrap gap-2">
                    {GRADIENTS.map(g => (
                      <button key={g.name} onClick={() => setGradStops(g.stops)}
                        title={g.name}
                        className={`w-8 h-8 rounded-lg border transition-all hover:scale-110 ${
                          JSON.stringify(gradStops) === JSON.stringify(g.stops) ? "ring-2 ring-white" : "border-white/10"
                        }`}
                        style={{ background: `linear-gradient(135deg, ${g.stops.join(",")})` }} />
                    ))}
                  </div>
                )}
                {bgType === "solid" && (
                  <div className="flex gap-3 items-center">
                    <label className="flex-shrink-0 cursor-pointer rounded-xl overflow-hidden border border-white/10" style={{ width:48, height:40, backgroundColor:bgColor, display:"block" }}>
                      <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="opacity-0 cursor-pointer block" style={{ width:48, height:40 }} />
                    </label>
                    <input value={bgColor} onChange={e => setBgColor(e.target.value)}
                      className="flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                  </div>
                )}
              </div>

              {/* Padding */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Padding</label>
                  <span className="text-xs text-gray-400 font-mono">{padding}%</span>
                </div>
                <input type="range" min={0} max={30} value={padding} onChange={e => setPadding(+e.target.value)}
                  className="w-full accent-[#6C3AFF]" />
              </div>
            </div>

            {/* Generate button */}
            <button onClick={generateAll} disabled={!readyToGenerate || generating}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] hover:opacity-90 disabled:opacity-40 text-white font-extrabold text-lg transition-all shadow-xl shadow-violet-900/30">
              {generating ? "⚙️ Generating all 18 sizes…" : "✨ Generate Favicon — All 18 Sizes"}
            </button>

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-4">

                {/* ✅ Device mockup previews */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Live Device Previews</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    {/* Chrome tab */}
                    <div className="bg-[#0A0A14] rounded-xl p-3">
                      <div className="text-xs text-gray-600 mb-2">Chrome Tab</div>
                      <div className="bg-[#3C4043] rounded-t-lg px-3 py-1.5 flex items-center gap-2">
                        {previewResult && <img src={previewResult.dataUrl} alt="" className="w-4 h-4 flex-shrink-0" />}
                        <span className="text-white text-xs truncate">My Website</span>
                        <span className="ml-auto text-gray-400 text-xs">✕</span>
                      </div>
                      <div className="bg-[#202124] h-4 rounded-b-lg" />
                    </div>

                    {/* iOS home screen */}
                    <div className="bg-[#0A0A14] rounded-xl p-3">
                      <div className="text-xs text-gray-600 mb-2">iOS Home Screen</div>
                      <div className="flex flex-col items-center gap-1.5">
                        {preview180 && (
                          <img src={preview180.dataUrl} alt=""
                            className="w-16 h-16 rounded-[22%] shadow-lg" />
                        )}
                        <span className="text-white text-[10px]">{appName}</span>
                      </div>
                    </div>

                    {/* Android */}
                    <div className="bg-[#0A0A14] rounded-xl p-3">
                      <div className="text-xs text-gray-600 mb-2">Android Chrome</div>
                      <div className="flex flex-col items-center gap-1.5">
                        {preview192 && (
                          <img src={preview192.dataUrl} alt=""
                            className="w-14 h-14 rounded-full shadow-lg" />
                        )}
                        <span className="text-white text-[10px]">{appName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Download actions */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Download</h3>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <button onClick={downloadZip}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] text-white font-bold text-sm transition-all shadow-lg">
                      ⬇ Download ZIP — All {results.length} Files
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {results.filter(r => FAVICON_SIZES.find(s => s.size === r.size)?.required).map(r => (
                      <button key={r.size} onClick={() => downloadOne(r.size, r.dataUrl)}
                        className="flex items-center gap-2 bg-[#0A0A14] border border-white/5 hover:border-[#6C3AFF]/30 rounded-xl p-2.5 transition-all text-left group">
                        <img src={r.dataUrl} alt="" className="w-8 h-8 rounded flex-shrink-0" style={{ imageRendering:"pixelated" }} />
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-[#6C3AFF] transition-colors">{r.size}×{r.size}</div>
                          <div className="text-[10px] text-gray-600">{FAVICON_SIZES.find(s=>s.size===r.size)?.use}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <details className="mt-3">
                    <summary className="text-xs text-gray-500 cursor-pointer hover:text-white transition-colors">Show all {results.length} sizes</summary>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
                      {results.map(r => (
                        <button key={r.size} onClick={() => downloadOne(r.size, r.dataUrl)}
                          className="flex flex-col items-center gap-1 bg-[#0A0A14] border border-white/5 hover:border-[#6C3AFF]/30 rounded-xl p-2 transition-all">
                          <img src={r.dataUrl} alt="" className="w-8 h-8 rounded" style={{ imageRendering:"pixelated" }} />
                          <span className="text-[10px] text-gray-500">{r.size}px</span>
                        </button>
                      ))}
                    </div>
                  </details>
                </div>

                {/* HTML snippet */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">HTML Head Snippet</h3>
                    <button onClick={async () => { await navigator.clipboard.writeText(htmlSnippet); setCopiedHtml(true); setTimeout(() => setCopiedHtml(false), 2000); }}
                      className="text-xs bg-[#6C3AFF]/20 hover:bg-[#6C3AFF]/40 text-[#6C3AFF] px-3 py-1.5 rounded-lg font-bold transition-all">
                      {copiedHtml ? "✅ Copied!" : "📋 Copy"}
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-[#00D4FF] bg-[#0A0A14] rounded-xl p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap">
                    {htmlSnippet}
                  </pre>
                </div>

                {/* PWA Manifest */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                  <button onClick={() => setShowManifest(p => !p)}
                    className="w-full flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">PWA manifest.json</h3>
                    <span className={`text-[#6C3AFF] text-xl transition-transform ${showManifest ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {showManifest && (
                    <div className="mt-4 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">App Name</label>
                          <input value={appName} onChange={e => setAppName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Theme Color</label>
                          <div className="flex gap-2 items-center">
                            {/* Wrap in label — forces consistent 40×40 hit area on mobile Android Chrome */}
                            <label className="flex-shrink-0 cursor-pointer rounded-xl overflow-hidden border border-white/10"
                              style={{ width:40, height:40, backgroundColor:themeColor, display:"block" }}>
                              <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)}
                                className="opacity-0 cursor-pointer block" style={{ width:40, height:40 }} />
                            </label>
                            <input value={themeColor} onChange={e => setThemeColor(e.target.value)}
                              className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                          </div>
                        </div>
                      </div>
                      <pre className="text-xs font-mono text-[#00D4FF] bg-[#0A0A14] rounded-xl p-4 overflow-x-auto leading-relaxed">
                        {manifestJson}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Preview sidebar ── */}
          <div className="space-y-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 xl:sticky xl:top-24">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Live Preview</h3>
              <div className="flex justify-center mb-4">
                <canvas ref={previewCanvasRef} className="w-32 h-32 rounded-2xl border border-white/10"
                  style={{ imageRendering:"pixelated" }} />
              </div>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <canvas ref={chipCanvasRef} className="w-4 h-4 rounded" style={{imageRendering:"pixelated"}} />
                  <span>Browser tab (16px)</span>
                </div>
              </div>
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-3">💡 Favicon Tips</h3>
              <div className="space-y-2 text-xs text-gray-500">
                {[
                  "Keep it bold — favicons are tiny",
                  "Test at 16px before downloading",
                  "Avoid thin lines and small text",
                  "Use your logo icon, not full wordmark",
                  "Rounded shape works best on iOS",
                  "512px PWA icon must be maskable",
                ].map(t => (
                  <div key={t} className="flex items-start gap-2">
                    <span className="text-[#6C3AFF] flex-shrink-0">→</span><span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-white text-sm mb-1">PursTech Pro</h3>
              <p className="text-gray-500 text-xs mb-4">Unlimited sizes, SVG export, dark mode favicon</p>
              <Link href="/pro"
                className="block w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all text-center">
                Get Pro — $7/mo
              </Link>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">📖 How to Create a Favicon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step:"1", title:"Choose your source",       desc:"Select one of four creation modes: Upload an existing image or logo, create a text monogram, pick an emoji, or draw custom pixel art." },
              { step:"2", title:"Customise shape & style",  desc:"Choose a shape (square, rounded or circle), set a gradient or solid background, adjust padding. The live preview updates in real time." },
              { step:"3", title:"Generate & download",      desc:"Click Generate. All 18 sizes are created instantly. Preview in device mockups, then download the ZIP with PNG files, HTML snippet and PWA manifest." },
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

        {/* FAQ — always last */}
        <div className="mt-12">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3 max-w-3xl">
            {FAVICON_FAQ.map((f, i) => (
              <div key={i} className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  aria-expanded={openFaq === i}>
                  <span className="font-semibold text-white text-sm">{f.q}</span>
                  <span className="text-[#6C3AFF] text-lg ml-4 flex-shrink-0">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-16 py-8 text-center">
        <Link href="/" className="text-xl font-black">
          Purs<span className="text-[#6C3AFF]">Tech</span>
        </Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. Free online tools for everyone.</p>
      </footer>
    </div>
  );
}
